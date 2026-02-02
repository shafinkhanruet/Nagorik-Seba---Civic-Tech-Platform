
import { 
  Report, 
  ProjectProposalData, 
  AuditLogEntry, 
  User, 
  TenderNode, 
  TenderLink, 
  RTIRequest,
  DistrictMetric,
  TenderNetwork
} from '../types';
import { AlgorithmicEngine } from './AlgorithmicEngine';
import { BackgroundWorkers } from './BackgroundWorkers';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- STATE (In-Memory Database) ---
let _auditChain: AuditLogEntry[] = [];
let _lastHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
let _isCrisisMode = false;
let _users: User[] = [
  { id: 'u-123', name: 'Rahim Uddin', role: 'citizen', trustScore: 85, district: 'Dhaka', homeLocation: { lat: 23.81, lng: 90.41 } }
];
let _reports: Report[] = []; // Populated via getReports on first load if empty
let _rtiRequests: RTIRequest[] = [];

// Helper: Immutable Audit Logging
const logAudit = (actor: string, role: string, action: string, targetId: string, details?: string) => {
  const entryPayload = { actor, role, action, targetId, timestamp: new Date().toISOString() };
  const newHash = AlgorithmicEngine.generateAuditHash(_lastHash, entryPayload);
  
  const fullEntry: AuditLogEntry = {
    id: `log-${Date.now()}`,
    ...entryPayload as any,
    previousHash: _lastHash,
    hash: newHash,
    details
  };
  
  _auditChain.push(fullEntry); // Append Only
  _lastHash = newHash;
  console.log(`[AUDIT] ${action} by ${actor}: ${newHash.substring(0, 10)}...`);
};

// --- AUTH SERVICE ---
const auth = {
    login: async (identifier: string): Promise<any> => {
      await delay(800);
      const role = identifier.toLowerCase().includes('admin') ? 'admin' : 'citizen';
      const user = _users[0]; // Mock user
      
      // System 17: Reputation update on login
      user.trustScore = AlgorithmicEngine.updateReputation(user.trustScore, 'login');
      
      return { 
        step: 'otp',
        ...user,
        role // Override for demo
      };
    },
    verifyOtp: async (otp: string): Promise<{ user: User; token: string }> => {
      await delay(1000);
      if (otp === '000000') throw new Error('Invalid OTP');
      const user = _users[0];
      logAudit(user.name, user.role, 'LOGIN', user.id);
      return { user, token: 'mock-jwt-token-xyz' };
    }
};

// --- REPORT SERVICE ---
const reports = {
    getAll: async (): Promise<Report[]> => {
      await delay(600);
      // Generate some mock reports if empty
      if (_reports.length === 0) {
         const maskedLoc = AlgorithmicEngine.maskCoordinates(23.81, 90.41);
         const r1: Report = {
            id: 'r-1',
            title: 'Damaged Bridge Railing',
            category: 'Infrastructure',
            location: { lat: maskedLoc.lat, lng: maskedLoc.lng, address: 'Mirpur 10', district: 'Dhaka', upazila: 'Mirpur' },
            description: 'The railing on the west side is completely broken.',
            evidence: [{ type: 'image', url: 'https://images.unsplash.com/photo-1549637642-90187f64f420?auto=format&fit=crop&q=80&w=300', isSensitive: false }],
            truthScore: 0,
            status: 'verified',
            timestamp: '2023-10-25T10:00:00Z',
            timePosted: '2 hrs ago',
            author: 'Citizen_991',
            isAnonymous: false,
            weightedSupport: 1250.5
         };
         _reports.push(r1);
      }

      // Dynamic Truth Score Calculation
      return _reports.map(r => {
        const { score, signals } = AlgorithmicEngine.calculateTruthScore(
          r.isAnonymous ? 50 : 85,
          r.evidence.length,
          0.05,
          r.weightedSupport || 0,
          10
        );
        
        // System 22: XAI
        const explanation = AlgorithmicEngine.generateXAIExplanation('Truth', score, ['Evidence Strength', 'Geo-Location']);

        return {
          ...r,
          truthScore: score,
          truthSignals: signals,
          aiBreakdown: { 
            credibility: Math.round(signals.reporterTrust * 100),
            evidenceQuality: Math.round(signals.evidenceStrength * 100),
            mediaCheck: 95,
            historyMatch: Math.round(signals.communityConsensus * 100)
          },
          aiSummary: explanation
        };
      });
    },
    submit: async (data: any) => {
      // System 15: Crisis Mode Lock
      if (_isCrisisMode) throw new Error('System is in CRISIS MODE. Reporting disabled.');
      
      // System 8: Defamation Check
      const nlpCheck = AlgorithmicEngine.detectDefamation(data.description);
      if (!nlpCheck.isSafe) {
         return { id: 'r-blocked', status: 'rejected', error: 'Content flagged by NLP as potential defamation.' };
      }

      await delay(1500);
      
      // System 19: Media Analysis Stub
      const mediaAnalysis = data.evidence ? AlgorithmicEngine.analyzeMedia(data.evidence[0]?.type, 1024) : null;
      
      const newReport: Report = {
        id: `r-${Date.now()}`,
        ...data,
        truthScore: 0,
        status: 'pending_ai_review',
        timestamp: new Date().toISOString(),
        evidence: data.evidence.map((e: any) => ({ ...e, analysis: mediaAnalysis }))
      };
      
      _reports.unshift(newReport);
      logAudit('Citizen', 'citizen', 'SUBMIT_REPORT', newReport.id);
      
      // System 17: Reputation Boost
      _users[0].trustScore = AlgorithmicEngine.updateReputation(_users[0].trustScore, 'report_verified'); // Optimistic

      return { id: newReport.id, status: 'pending_ai_review' };
    },
    vote: async (id: string, type: 'support' | 'doubt', userLocation?: { lat: number, lng: number }) => {
      // System 15: Crisis Mode Lock
      if (_isCrisisMode) throw new Error('Voting disabled in Crisis Mode');
      await delay(500);
      
      // System 18 & 4: Geo-Weighted Voting
      const dist = userLocation ? Math.sqrt(Math.pow(userLocation.lat - 23.81, 2) + Math.pow(userLocation.lng - 90.41, 2)) * 111 : 50; 
      const weight = AlgorithmicEngine.calculateVoteWeight(_users[0].trustScore, dist, false, true);
      
      // System 2: Bot Check
      const botCheck = AlgorithmicEngine.detectBotActivity(10, 0.9, 365); // Low risk mock
      if (botCheck.riskLevel === 'High') {
         throw new Error('Vote rejected by Anti-Bot System.');
      }

      return { newWeightedScore: 1250 + weight };
    }
};

// --- PROJECT SERVICE ---
const projects = {
    getAll: async (): Promise<ProjectProposalData[]> => {
      await delay(700);
      // Using AlgorithmicEngine to generate live estimates
      const materials = [
         { item: 'Steel', quantity: 1000, marketRate: 0.1, proposedRate: 0.11 },
         { item: 'Labor', quantity: 5000, marketRate: 0.05, proposedRate: 0.05 }
      ];
      const budgetAnalysis = AlgorithmicEngine.analyzeBudget(materials);
      const moralMetrics = { povertyBenefit: 80, displacementRisk: 20, environmentalImpact: 30, socialJustice: 70 };
      const moralScore = AlgorithmicEngine.calculateMoralScore(moralMetrics);

      return [
        {
          id: 'p-1',
          title: 'Metro Rail Extension Line 6',
          ministry: 'Road Transport',
          location: 'Dhaka',
          status: 'open',
          aiSummary: `High impact. Moral Score: ${moralScore}. Budget Risk: ${budgetAnalysis.riskLevel}`,
          budget: {
             govt: '500 Cr',
             aiEstimate: `${budgetAnalysis.aiEstimate} Cr`,
             risk: budgetAnalysis.riskLevel,
             details: budgetAnalysis
          },
          impacts: ['economic', 'social'],
          approvalStats: { current: 75, required: 60, totalVotes: 15000 },
          moralMetrics: moralMetrics
        }
      ];
    }
};

// --- RTI SERVICE ---
const rti = {
    getRequests: async (onlyMy: boolean): Promise<RTIRequest[]> => {
        await delay(600);
        
        if (_rtiRequests.length === 0) {
           _rtiRequests.push({
                id: 'RTI-1001',
                subject: 'Bridge Cost Breakdown',
                department: 'LGRD',
                details: 'Requesting detailed BoQ...',
                category: 'Budget',
                isPublic: true,
                status: 'responded',
                dateFiled: '2023-10-01T10:00:00',
                deadline: '2023-10-21T10:00:00',
                applicantName: 'Rahim Uddin',
                trackingId: 'TRK-9921',
                response: 'The requested documents are attached.'
            });
        }

        // System 20: Run Escalation Worker on fetch (Simulation)
        _rtiRequests = await BackgroundWorkers.processRTIEscalations(_rtiRequests);
        
        return _rtiRequests;
    },
    submit: async (data: any) => {
        await delay(1000);
        const newReq: RTIRequest = {
            id: `RTI-${Date.now()}`,
            ...data,
            status: 'submitted',
            dateFiled: new Date().toISOString(),
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days
            trackingId: `TRK-${Math.floor(Math.random() * 10000)}`
        };
        _rtiRequests.push(newReq);
        logAudit(data.applicantName, 'citizen', 'SUBMIT_RTI', newReq.id);
        return { success: true, id: newReq.id };
    },
    updateStatus: async (id: string, status: string, response: string) => {
        await delay(1000);
        const req = _rtiRequests.find(r => r.id === id);
        if (req) {
            req.status = status as any;
            req.response = response;
        }
        logAudit('Admin', 'admin', `UPDATE_RTI_${status.toUpperCase()}`, id);
        return { success: true };
    }
}

// --- ADMIN SERVICE ---
const admin = {
    getCrisisStatus: async () => {
      return { active: _isCrisisMode };
    },
    activateCrisis: async (reason: string) => {
      await delay(2000);
      _isCrisisMode = true;
      // System 15: Crisis Logging
      logAudit('Superadmin', 'superadmin', 'ACTIVATE_CRISIS', 'SYSTEM', reason);
      return { success: true };
    },
    getAuditLogs: async (): Promise<AuditLogEntry[]> => {
      await delay(500);
      return [..._auditChain].reverse();
    },
    // System 3: Identity Unlock
    unlockIdentity: async (reportId: string, courtOrderHash: string) => {
        await delay(2000); // Simulate crypto latency
        // In real backend, this verifies the keys
        const identity = AlgorithmicEngine.reconstructIdentity("part1", "part2", courtOrderHash);
        
        if (identity) {
           logAudit('Superadmin', 'superadmin', 'IDENTITY_UNLOCK', reportId, `Court Order: ${courtOrderHash}`);
           return { success: true, identity: { name: 'Rahim Uddin', nid: '8293...' } };
        }
        throw new Error('Identity reconstruction failed');
    }
};

const tenders = {
    getNetwork: async (): Promise<TenderNetwork> => {
      await delay(800);
      const network = {
        nodes: [
          { id: 'Official_A', name: 'Engr. Karim', type: 'official', riskScore: 10 },
          { id: 'Contractor_X', name: 'BuildFast Ltd', type: 'contractor', riskScore: 85 },
          { id: 'Contractor_Y', name: 'SafeConstruct', type: 'contractor', riskScore: 15 },
        ] as TenderNode[],
        links: [
          { source: 'Official_A', target: 'Contractor_X', value: 5, type: 'won' },
          { source: 'Official_A', target: 'Contractor_Y', value: 1, type: 'bid' },
        ] as TenderLink[]
      };
      
      // System 6: Calculate Syndicate Score
      const syndicateScore = AlgorithmicEngine.calculateSyndicateScore({ ...network, syndicateProbability: 0 });
      return { ...network, syndicateProbability: syndicateScore }; // Attach score to response metadata if supported
    }
};

export const mockApi = {
  auth,
  reports,
  projects,
  admin,
  tenders,
  rti,
  
  getReports: reports.getAll,
  getProjects: projects.getAll,
  getAuditLogs: admin.getAuditLogs,
  getRTIRequests: rti.getRequests,
  submitRTIRequest: rti.submit,
  updateRTIStatus: rti.updateStatus,
  
  approveProject: async (id: string, actor: string, reason: string) => { 
    // System 25: Admin Override with Reason
    if (!reason) throw new Error('Reason required');
    await delay(1000); 
    logAudit(actor, 'admin', 'APPROVE_PROJECT', id, reason);
    return true; 
  },
  rejectProject: async (id: string, actor: string, reason: string) => { 
    await delay(1000); 
    logAudit(actor, 'admin', 'REJECT_PROJECT', id, reason);
    return true; 
  },
  freezeProject: async (id: string, actor: string, reason: string) => { 
    await delay(1000); 
    logAudit(actor, 'admin', 'FREEZE_PROJECT', id, reason);
    return true; 
  },
};