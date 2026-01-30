import { ReportData } from '../components/ReportCard';
import { ProjectProposalData } from '../components/ProposalCard';
import { User, Role, RTIRequest } from '../types';

// --- Interfaces for DB Entities ---

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetId: string;
  hash: string;
  details?: string;
}

export interface MockDB {
  reports: ReportData[];
  projects: ProjectProposalData[];
  auditLogs: AuditLogEntry[];
  users: User[];
  rtiRequests: RTIRequest[];
}

// --- Seed Data (Extracted from previous static pages) ---

const SEED_REPORTS: ReportData[] = [
  {
    id: '1',
    category: 'রাস্তা ও জনপদ',
    location: { district: 'ঢাকা', upazila: 'মিরপুর' },
    timePosted: '২ ঘণ্টা আগে',
    isAnonymous: true,
    description: 'মিরপুর ১০ গোলচত্বরের কাছে প্রধান সড়কে বিশাল গর্ত তৈরি হয়েছে।',
    truthScore: 88,
    aiBreakdown: { credibility: 92, evidenceQuality: 85, mediaCheck: 78, historyMatch: 95 },
    evidence: [{ type: 'image', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=200' }],
    weightedSupport: 1240,
    status: 'verified',
    influenceAnalysis: { riskLevel: 'Low', timelineData: [] }
  },
  {
    id: '2',
    category: 'স্বাস্থ্যসেবা',
    location: { district: 'চট্টগ্রাম', upazila: 'পতেঙ্গা' },
    timePosted: '৪ ঘণ্টা আগে',
    isAnonymous: false,
    description: 'সরকারি হাসপাতালে নির্ধারিত সময়ে ডাক্তার পাওয়া যাচ্ছে না।',
    truthScore: 65,
    aiBreakdown: { credibility: 70, evidenceQuality: 60, mediaCheck: 50, historyMatch: 80 },
    evidence: [],
    weightedSupport: 850,
    status: 'review',
    influenceAnalysis: { riskLevel: 'Medium', timelineData: [] }
  }
];

const SEED_PROJECTS: ProjectProposalData[] = [
  {
    id: 'PRJ-105',
    title: 'Meghna 2nd Bridge Construction',
    ministry: 'Roads & Highways',
    location: 'Munshiganj',
    status: 'open',
    aiSummary: 'Reduces congestion by 30%. Displacement of 200 families predicted.',
    budget: { govt: '1200 Cr', aiEstimate: '1150 Cr', risk: 'Medium' },
    impacts: ['economic', 'displacement'],
    approvalStats: { current: 58, required: 60, totalVotes: 12543 },
    hasVoted: false,
    moralMetrics: {
        povertyBenefit: 65,
        displacementRisk: 70,
        environmentalImpact: 45,
        socialJustice: 55
    }
  },
  {
    id: 'PRJ-108',
    title: 'Sheikh Russel IT Park',
    ministry: 'ICT Division',
    location: 'Gazipur',
    status: 'approved',
    aiSummary: 'High youth employment potential. Minimal environmental impact.',
    budget: { govt: '450 Cr', aiEstimate: '440 Cr', risk: 'Low' },
    impacts: ['economic', 'social'],
    approvalStats: { current: 82, required: 60, totalVotes: 8900 },
    hasVoted: true,
    moralMetrics: {
        povertyBenefit: 85,
        displacementRisk: 10,
        environmentalImpact: 15,
        socialJustice: 90
    }
  }
];

const SEED_LOGS: AuditLogEntry[] = [
  {
    id: 'L-9021',
    timestamp: '2023-11-20 14:30:22',
    actor: 'System',
    action: 'System Initialization',
    targetId: 'SYS-001',
    hash: '0x8f2d...init'
  }
];

const SEED_RTI: RTIRequest[] = [
  {
    id: 'RTI-24-001',
    department: 'Health Ministry',
    subject: 'Budget allocation for Upazila Hospitals',
    details: 'Requesting detailed breakdown of budget allocation for X-Ray machines in Sylhet district upazilas for FY 2023-24.',
    category: 'Budget',
    isPublic: true,
    status: 'acknowledged',
    dateFiled: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
    applicantName: 'Rahim Uddin',
    trackingId: 'TRK-99281'
  },
  {
    id: 'RTI-24-002',
    department: 'LGRD',
    subject: 'Road repair tender documents',
    details: 'Copy of tender documents for road repair work in Mirpur 10 (Contract ID: #8821).',
    category: 'Tender',
    isPublic: true,
    status: 'responded',
    dateFiled: new Date(Date.now() - 25 * 86400000).toISOString(),
    deadline: new Date(Date.now() - 5 * 86400000).toISOString(),
    response: 'The requested documents have been uploaded to the public archive. Link: [Archive #8821]',
    applicantName: 'Anonymous',
    trackingId: 'TRK-11029'
  }
];

// --- Mock Service Class ---

class MockApiService {
  private db: MockDB;
  private DEMO_MODE = true;

  constructor() {
    this.db = this.loadDB();
  }

  private loadDB(): MockDB {
    const saved = localStorage.getItem('civic_mock_db_v1');
    if (saved) {
      return JSON.parse(saved);
    }
    const initial: MockDB = {
      reports: SEED_REPORTS,
      projects: SEED_PROJECTS,
      auditLogs: SEED_LOGS,
      users: [],
      rtiRequests: SEED_RTI
    };
    this.saveDB(initial);
    return initial;
  }

  private saveDB(db: MockDB = this.db) {
    localStorage.setItem('civic_mock_db_v1', JSON.stringify(db));
  }

  private async delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private simulateError() {
    // 5% chance of error
    if (Math.random() < 0.05) {
      throw new Error("Simulated Backend Error (5% Chance)");
    }
  }

  private generateHash(): string {
    return '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // --- Auth API ---

  async login(identifier: string): Promise<User> {
    await this.delay(1000);
    this.simulateError();

    const lowerId = identifier.toLowerCase();
    let role: Role = 'citizen';
    let name = 'Citizen User';

    if (lowerId.includes('super')) { role = 'superadmin'; name = 'Super Administrator'; }
    else if (lowerId.includes('admin')) { role = 'admin'; name = 'System Admin'; }
    else if (lowerId.includes('mod')) { role = 'moderator'; name = 'Content Moderator'; }

    return {
      id: `usr-${Date.now()}`,
      name,
      role,
      token: 'mock-jwt-token',
      expiresAt: Date.now() + (role === 'citizen' ? 86400000 : 3600000)
    };
  }

  // --- Reports API ---

  async getReports(): Promise<ReportData[]> {
    await this.delay(600);
    return [...this.db.reports];
  }

  async voteReport(reportId: string, type: 'support' | 'doubt', userWeight: number): Promise<{ newWeight: number }> {
    await this.delay(400);
    this.simulateError();

    const report = this.db.reports.find(r => r.id === reportId);
    if (!report) throw new Error("Report not found");

    if (type === 'support') {
      report.weightedSupport += userWeight;
    }
    // Simple logic: doubt doesn't reduce support in this model, just flags it internally
    
    this.saveDB();
    return { newWeight: report.weightedSupport };
  }

  // --- Projects API ---

  async getProjects(): Promise<ProjectProposalData[]> {
    await this.delay(600);
    return [...this.db.projects];
  }

  async voteProject(projectId: string, voteType: 'support' | 'reject'): Promise<ProjectProposalData> {
    await this.delay(500);
    const project = this.db.projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    project.approvalStats.totalVotes += 1;
    // Mock calculation for percentage change
    if (voteType === 'support') {
        const currentVoteCount = (project.approvalStats.current / 100) * (project.approvalStats.totalVotes - 1);
        project.approvalStats.current = Math.round(((currentVoteCount + 1) / project.approvalStats.totalVotes) * 100);
    } else {
        const currentVoteCount = (project.approvalStats.current / 100) * (project.approvalStats.totalVotes - 1);
        project.approvalStats.current = Math.round(((currentVoteCount) / project.approvalStats.totalVotes) * 100);
    }
    
    project.hasVoted = true;
    this.saveDB();
    return project;
  }

  // --- RTI API ---

  async getRTIRequests(publicOnly = false): Promise<RTIRequest[]> {
    await this.delay(600);
    if (publicOnly) {
      return this.db.rtiRequests.filter(r => r.isPublic);
    }
    return [...this.db.rtiRequests];
  }

  async submitRTIRequest(req: Omit<RTIRequest, 'id' | 'status' | 'dateFiled' | 'deadline' | 'trackingId'>): Promise<RTIRequest> {
    await this.delay(1200);
    const newReq: RTIRequest = {
      ...req,
      id: `RTI-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      status: 'submitted',
      dateFiled: new Date().toISOString(),
      deadline: new Date(Date.now() + 20 * 86400000).toISOString(), // 20 days default
      trackingId: `TRK-${Math.floor(Math.random() * 100000)}`
    };
    this.db.rtiRequests.unshift(newReq);
    this.saveDB();
    return newReq;
  }

  async updateRTIStatus(id: string, status: RTIRequest['status'], response?: string): Promise<RTIRequest> {
    await this.delay(800);
    const req = this.db.rtiRequests.find(r => r.id === id);
    if (!req) throw new Error("RTI Request not found");
    
    req.status = status;
    if (response) req.response = response;
    
    this.saveDB();
    return req;
  }

  // --- Admin Actions with Audit ---

  private async _logAction(actor: string, action: string, targetId: string, details?: string) {
    const entry: AuditLogEntry = {
      id: `L-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor,
      action,
      targetId,
      details,
      hash: this.generateHash()
    };
    this.db.auditLogs.unshift(entry);
    this.saveDB();
  }

  async approveProject(projectId: string, actorName: string, reason: string): Promise<void> {
    await this.delay(1000);
    this.simulateError();
    
    const project = this.db.projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    project.status = 'approved';
    await this._logAction(actorName, 'APPROVE_PROJECT', projectId, reason);
  }

  async rejectProject(projectId: string, actorName: string, reason: string): Promise<void> {
    await this.delay(1000);
    const project = this.db.projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    project.status = 'rejected';
    await this._logAction(actorName, 'REJECT_PROJECT', projectId, reason);
  }

  async freezeProject(projectId: string, actorName: string, reason: string): Promise<void> {
    await this.delay(800);
    const project = this.db.projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    project.status = 'frozen' as any;
    await this._logAction(actorName, 'FREEZE_PROJECT', projectId, reason);
  }

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    await this.delay(500);
    return [...this.db.auditLogs];
  }

  // --- Reset for Demo ---
  resetDemo() {
    localStorage.removeItem('civic_mock_db_v1');
    this.db = this.loadDB();
    window.location.reload();
  }
}

export const mockApi = new MockApiService();