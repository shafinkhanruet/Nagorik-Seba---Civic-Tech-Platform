
import { 
  Report, 
  ProjectProposalData, 
  AuditLogEntry, 
  User, 
  TenderNode, 
  TenderLink, 
  RTIRequest 
} from '../types';
import { AlgorithmicEngine } from './AlgorithmicEngine';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- IN-MEMORY DATABASE (Simulated) ---
let _auditChain: AuditLogEntry[] = [];
let _lastHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
let _isCrisisMode = false;

// Helper to log audit events (System 16)
const logAudit = (actor: string, role: string, action: string, targetId: string, details?: string) => {
  const entry: Partial<AuditLogEntry> = { actor, role, action, targetId, timestamp: new Date().toISOString() };
  const newHash = AlgorithmicEngine.generateAuditHash(_lastHash, entry);
  
  const fullEntry: AuditLogEntry = {
    id: `log-${Date.now()}`,
    ...entry as any,
    previousHash: _lastHash,
    hash: newHash,
    details
  };
  
  _auditChain.push(fullEntry);
  _lastHash = newHash;
  console.log(`[AUDIT] ${action} by ${actor}: ${newHash.substring(0, 10)}...`);
};

// --- AUTH SERVICE ---
const auth = {
    login: async (identifier: string): Promise<any> => {
      await delay(800);
      const role = identifier.includes('admin') ? 'admin' : 'citizen';
      return { 
        step: 'otp',
        role: role, 
        id: 'u-' + Math.floor(Math.random() * 10000),
        name: 'Rahim Uddin'
      };
    },
    verifyOtp: async (otp: string): Promise<{ user: User; token: string }> => {
      await delay(1000);
      if (otp === '000000') throw new Error('Invalid OTP');
      const user: User = {
        id: 'u-123',
        name: 'Rahim Uddin',
        role: 'citizen',
        trustScore: 85,
        district: 'Dhaka',
        homeLocation: { lat: 23.81, lng: 90.41 } // System 18
      };
      // Log login
      logAudit(user.name, user.role, 'LOGIN', user.id);
      return { user, token: 'mock-jwt-token-xyz' };
    }
};

// --- REPORT SERVICE ---
const reports = {
    getAll: async (): Promise<Report[]> => {
      await delay(600);
      const rawReports: Report[] = [
        {
          id: 'r-1',
          title: 'Damaged Bridge Railing',
          category: 'Infrastructure',
          location: { lat: 23.81, lng: 90.41, address: 'Mirpur 10', district: 'Dhaka', upazila: 'Mirpur' },
          description: 'The railing on the west side is completely broken.',
          evidence: [{ type: 'image', url: 'https://images.unsplash.com/photo-1549637642-90187f64f420?auto=format&fit=crop&q=80&w=300' }],
          truthScore: 0, // Calculated below
          status: 'verified',
          timestamp: '2023-10-25T10:00:00Z',
          timePosted: '2 hrs ago',
          author: 'Citizen_991',
          isAnonymous: false,
          weightedSupport: 1250.5
        },
        {
          id: 'r-2',
          title: 'Illegal Waste Dumping',
          category: 'Environment',
          location: { lat: 23.79, lng: 90.40, address: 'Banani Lake', district: 'Dhaka', upazila: 'Banani' },
          description: 'Industrial waste being dumped at night.',
          evidence: [],
          truthScore: 0,
          status: 'review',
          timestamp: '2023-10-26T08:30:00Z',
          timePosted: '1 day ago',
          author: 'User_Anon',
          isAnonymous: true,
          weightedSupport: 340.2
        }
      ];

      // System 1: Apply Truth Probability Engine
      return rawReports.map(r => {
        const { score, signals } = AlgorithmicEngine.calculateTruthScore(
          r.isAnonymous ? 50 : 85, // Lower trust for anon
          r.evidence.length,
          0.05, // Assumed close geo-match
          r.weightedSupport || 0, // Support
          10 // Doubt
        );
        
        return {
          ...r,
          truthScore: score,
          truthSignals: signals,
          aiBreakdown: { // Map for UI
            credibility: Math.round(signals.reporterTrust * 100),
            evidenceQuality: Math.round(signals.evidenceStrength * 100),
            mediaCheck: 95,
            historyMatch: Math.round(signals.communityConsensus * 100)
          },
          aiSummary: `AI Calculated Probability: ${score}%. Strong evidence match.`
        };
      });
    },
    submit: async (data: any) => {
      // System 15: Crisis Mode Check
      if (_isCrisisMode) throw new Error('System is in CRISIS MODE. Reporting disabled.');
      
      await delay(1500);
      return { id: 'r-new', status: 'pending_ai_review' };
    },
    vote: async (id: string, type: 'support' | 'doubt', userLocation?: { lat: number, lng: number }) => {
      if (_isCrisisMode) throw new Error('Voting disabled in Crisis Mode');
      await delay(500);
      // System 18: Geo-Weighting simulation
      // Assuming project at 23.81, 90.41
      const dist = userLocation ? Math.sqrt(Math.pow(userLocation.lat - 23.81, 2) + Math.pow(userLocation.lng - 90.41, 2)) * 111 : 50; 
      const weight = AlgorithmicEngine.calculateVoteWeight(85, dist, false);
      
      return { newWeightedScore: 1250 + weight };
    }
};

// --- PROJECT SERVICE ---
const projects = {
    getAll: async (): Promise<ProjectProposalData[]> => {
      await delay(700);
      
      // System 5 & 10: Run Budget and Moral Analysis on mock data
      return [
        {
          id: 'p-1',
          title: 'Metro Rail Extension Line 6',
          ministry: 'Road Transport',
          location: 'Dhaka',
          status: 'open',
          aiSummary: 'High impact project for reducing traffic.',
          budget: {
             govt: '500 Cr',
             aiEstimate: '480 Cr',
             risk: 'Low',
             details: AlgorithmicEngine.analyzeBudget([
               { item: 'Steel', quantity: 1000, marketRate: 0.1, proposedRate: 0.11 },
               { item: 'Labor', quantity: 5000, marketRate: 0.05, proposedRate: 0.05 }
             ]) as any
          },
          impacts: ['economic', 'social'],
          approvalStats: { current: 75, required: 60, totalVotes: 15000 },
          moralMetrics: {
             povertyBenefit: 80,
             displacementRisk: 20,
             environmentalImpact: 30,
             socialJustice: 70
          }
        }
      ];
    }
};

// --- ADMIN SERVICE ---
const admin = {
    getCrisisStatus: async () => {
      return { active: _isCrisisMode };
    },
    activateCrisis: async (reason: string) => {
      await delay(2000);
      _isCrisisMode = true;
      // System 16: Log Critical Action
      logAudit('Superadmin', 'superadmin', 'ACTIVATE_CRISIS', 'SYSTEM', reason);
      return { success: true };
    },
    getAuditLogs: async (): Promise<AuditLogEntry[]> => {
      await delay(500);
      return _auditChain.length > 0 ? [..._auditChain].reverse() : [
        { id: 'l-1', actor: 'System', role: 'root', action: 'INIT_LEDGER', targetId: 'GENESIS', timestamp: new Date().toISOString(), previousHash: '0x0', hash: _lastHash }
      ];
    }
};

// --- TENDER SERVICE ---
const tenders = {
    getNetwork: async (): Promise<{ nodes: TenderNode[], links: TenderLink[] }> => {
      await delay(800);
      // System 6: Syndicate Detection Logic
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
      
      // Calculate Syndicate Score
      // const score = AlgorithmicEngine.calculateSyndicateScore({ ...network, syndicateProbability: 0 });
      // We would attach this score to the response metadata in a real app
      
      return network;
    }
};

// --- RTI SERVICE ---
const rti = {
    getRequests: async (onlyMy: boolean): Promise<RTIRequest[]> => {
        await delay(600);
        return [
            {
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
            }
        ];
    },
    submit: async (data: any) => {
        await delay(1000);
        logAudit(data.applicantName, 'citizen', 'SUBMIT_RTI', 'new-id');
        return { success: true, id: 'RTI-NEW' };
    },
    updateStatus: async (id: string, status: string, response: string) => {
        await delay(1000);
        // System 20: RTI Escalation logic would verify deadlines here
        logAudit('Admin', 'admin', `UPDATE_RTI_${status.toUpperCase()}`, id);
        return { success: true };
    }
}

export const mockApi = {
  auth,
  reports,
  projects,
  admin,
  tenders,
  rti,
  
  // Flattened exports
  login: auth.login,
  getReports: reports.getAll,
  getProjects: projects.getAll,
  getAuditLogs: admin.getAuditLogs,
  getRTIRequests: rti.getRequests,
  submitRTIRequest: rti.submit,
  updateRTIStatus: rti.updateStatus,
  
  approveProject: async (id: string, actor: string, reason: string) => { 
    // System 25: Admin Override Requirement
    if (!reason) throw new Error('Reason required for override');
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
