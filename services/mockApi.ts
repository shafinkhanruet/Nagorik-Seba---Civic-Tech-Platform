
import { Report, ProjectProposalData, AuditLogEntry, User, TenderNode, TenderLink, RTIRequest } from '../types';

// Simulation delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const auth = {
    login: async (identifier: string): Promise<any> => {
      await delay(800);
      // Mock logic to return user details including role
      const role = identifier.toLowerCase().includes('admin') ? 'admin' : 'citizen';
      
      return { 
        step: 'otp',
        id: 'u-123',
        name: 'Rahim Uddin',
        role: role,
        trustScore: 85,
        district: 'Dhaka'
      };
    },
    verifyOtp: async (otp: string): Promise<{ user: User; token: string }> => {
      await delay(1000);
      if (otp === '000000') throw new Error('Invalid OTP');
      return {
        user: {
          id: 'u-123',
          name: 'Rahim Uddin',
          role: 'citizen',
          trustScore: 85,
          district: 'Dhaka'
        },
        token: 'mock-jwt-token-xyz'
      };
    }
};

const reports = {
    getAll: async (): Promise<Report[]> => {
      await delay(600);
      return [
        {
          id: 'r-1',
          title: 'Damaged Bridge Railing',
          category: 'Infrastructure',
          location: { lat: 23.81, lng: 90.41, address: 'Mirpur 10', district: 'Dhaka', upazila: 'Mirpur' },
          description: 'The railing on the west side is completely broken.',
          evidence: [{ type: 'image', url: 'https://images.unsplash.com/photo-1549637642-90187f64f420?auto=format&fit=crop&q=80&w=300' }],
          truthScore: 92,
          status: 'verified',
          timestamp: '2023-10-25T10:00:00Z',
          timePosted: '2 hrs ago',
          author: 'Citizen_991',
          isAnonymous: false,
          weightedSupport: 1250.5,
          aiBreakdown: {
            credibility: 90,
            evidenceQuality: 85,
            mediaCheck: 95,
            historyMatch: 80
          },
          aiSummary: 'High confidence visual match with previous structural damage reports.'
        },
        {
          id: 'r-2',
          title: 'Illegal Waste Dumping',
          category: 'Environment',
          location: { lat: 23.79, lng: 90.40, address: 'Banani Lake', district: 'Dhaka', upazila: 'Banani' },
          description: 'Industrial waste being dumped at night.',
          evidence: [],
          truthScore: 65,
          status: 'review',
          timestamp: '2023-10-26T08:30:00Z',
          timePosted: '1 day ago',
          author: 'User_Anon',
          isAnonymous: true,
          weightedSupport: 340.2,
          aiBreakdown: {
            credibility: 60,
            evidenceQuality: 40,
            mediaCheck: 50,
            historyMatch: 70
          }
        }
      ];
    },
    submit: async (data: any) => {
      await delay(1500);
      return { id: 'r-new', status: 'pending_ai_review' };
    },
    vote: async (id: string, type: 'support' | 'doubt') => {
      await delay(500);
      return { newWeightedScore: 1250.5 };
    }
};

const projects = {
    getAll: async (): Promise<ProjectProposalData[]> => {
      await delay(700);
      return [
        {
          id: 'p-1',
          title: 'Metro Rail Extension Line 6',
          ministry: 'Road Transport and Bridges',
          location: 'Dhaka',
          status: 'open',
          aiSummary: 'High impact project for reducing traffic.',
          budget: {
             govt: '500 Cr',
             aiEstimate: '480 Cr',
             risk: 'Low'
          },
          impacts: ['economic', 'social'],
          approvalStats: {
             current: 75,
             required: 60,
             totalVotes: 15000
          },
          moralMetrics: {
             povertyBenefit: 80,
             displacementRisk: 20,
             environmentalImpact: 30,
             socialJustice: 70
          }
        },
        {
          id: 'p-2',
          title: 'District Hospital Upgrade',
          ministry: 'Health',
          location: 'Comilla',
          status: 'approved',
          aiSummary: 'Critical infrastructure upgrade.',
          budget: {
             govt: '20 Cr',
             aiEstimate: '19.5 Cr',
             risk: 'Low'
          },
          impacts: ['social'],
          approvalStats: {
             current: 88,
             required: 60,
             totalVotes: 5000
          },
          moralMetrics: {
             povertyBenefit: 90,
             displacementRisk: 5,
             environmentalImpact: 10,
             socialJustice: 85
          }
        }
      ];
    }
};

const admin = {
    getCrisisStatus: async () => {
      return { active: false };
    },
    activateCrisis: async (reason: string) => {
      await delay(2000);
      return { success: true };
    },
    getAuditLogs: async (): Promise<AuditLogEntry[]> => {
      await delay(500);
      return [
        { id: 'l-1', actor: 'Admin_X', role: 'admin', action: 'FREEZE_PROJECT', targetId: 'p-2', timestamp: '2023-10-24 14:00', hash: 'sha256-xyz...', details: 'Budget irregularity detected' },
        { id: 'l-2', actor: 'AI_Sentinel', role: 'superadmin', action: 'FLAG_SYNDICATE', targetId: 'tender-99', timestamp: '2023-10-23 09:15', hash: 'sha256-abc...', details: 'Collusion pattern match 98%' }
      ];
    }
};

const tenders = {
    getNetwork: async (): Promise<{ nodes: TenderNode[], links: TenderLink[] }> => {
      await delay(800);
      return {
        nodes: [
          { id: 'Official_A', name: 'Engr. Karim', type: 'official', riskScore: 10 },
          { id: 'Contractor_X', name: 'BuildFast Ltd', type: 'contractor', riskScore: 85 },
          { id: 'Contractor_Y', name: 'SafeConstruct', type: 'contractor', riskScore: 15 },
        ],
        links: [
          { source: 'Official_A', target: 'Contractor_X', value: 5 },
          { source: 'Official_A', target: 'Contractor_Y', value: 1 },
        ]
      };
    }
};

const rti = {
    getRequests: async (onlyMy: boolean): Promise<RTIRequest[]> => {
        await delay(600);
        return [
            {
                id: 'RTI-1001',
                subject: 'Bridge Cost Breakdown',
                department: 'LGRD',
                details: 'Requesting detailed BoQ for project ID 8821.',
                category: 'Budget',
                isPublic: true,
                status: 'responded',
                dateFiled: '2023-10-01T10:00:00',
                deadline: '2023-10-21T10:00:00',
                applicantName: 'Rahim Uddin',
                trackingId: 'TRK-9921',
                response: 'The requested documents are attached.'
            },
            {
                id: 'RTI-1002',
                subject: 'Vaccine Procurement',
                department: 'Ministry of Health',
                details: 'Procurement policy for 2023.',
                category: 'Policy',
                isPublic: true,
                status: 'review',
                dateFiled: '2023-10-15T10:00:00',
                deadline: '2023-11-05T10:00:00',
                applicantName: 'Anon Citizen',
                trackingId: 'TRK-9925'
            }
        ];
    },
    submit: async (data: any) => {
        await delay(1000);
        return { success: true, id: 'RTI-NEW' };
    },
    updateStatus: async (id: string, status: string, response: string) => {
        await delay(1000);
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
  
  getReports: reports.getAll,
  getProjects: projects.getAll,
  getAuditLogs: admin.getAuditLogs,
  getRTIRequests: rti.getRequests,
  submitRTIRequest: rti.submit,
  updateRTIStatus: rti.updateStatus,
  
  approveProject: async (id: string, actor: string, reason: string) => { await delay(1000); return true; },
  rejectProject: async (id: string, actor: string, reason: string) => { await delay(1000); return true; },
  freezeProject: async (id: string, actor: string, reason: string) => { await delay(1000); return true; },
};
