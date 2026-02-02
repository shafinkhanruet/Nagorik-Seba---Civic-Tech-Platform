
import { LucideIcon } from 'lucide-react';

export type Role = 'citizen' | 'moderator' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  role: Role;
  token?: string;
  trustScore: number;
  district?: string;
  homeLocation?: { lat: number; lng: number }; 
  expiresAt?: number;
  // System 17: Reputation Tracking
  reputationHistory?: { date: string; score: number; reason: string }[];
  isShadowbanned?: boolean; // System 2
}

// System 1: Truth Probability Engine Inputs
export interface TruthSignals {
  reporterTrust: number;
  evidenceStrength: number;
  geoMatch: number;
  communityConsensus: number;
  botProbability: number;
}

export interface ReportLocation {
  lat?: number;
  lng?: number;
  address: string;
  district?: string;
  upazila?: string;
}

export interface InfluenceData {
  riskLevel: 'Low' | 'Medium' | 'High';
  timelineData: { time: string; value: number; isSpike?: boolean }[];
  explanation?: string;
  clusterId?: string;
  botProbability: number;
}

export interface AuthorityResponseData {
  department: string;
  content: string;
  date: string;
  status: 'verified' | 'review' | 'disputed';
  attachments: string[];
}

export interface Report {
  id: string;
  title: string;
  category: string;
  categoryIcon?: any;
  location: ReportLocation;
  description: string;
  evidence: { type: 'image' | 'video' | 'doc'; url: string; isSensitive?: boolean; hash?: string; analysis?: EvidenceMetrics }[];
  
  // System 1 Output
  truthScore: number; 
  truthSignals?: TruthSignals;
  
  status: 'pending_ai_review' | 'verified' | 'rejected' | 'review' | 'disputed';
  aiSummary?: string;
  timestamp: string;
  
  author?: string;
  authorId?: string; 
  isAnonymous?: boolean;
  timePosted?: string;
  
  // System 2 & 4
  weightedSupport?: number;
  influenceAnalysis?: InfluenceData;
  
  isFlagged?: boolean;
  authorityResponse?: AuthorityResponseData;
}

// System 10: Moral Impact Score
export interface MoralMetrics {
  povertyBenefit: number;
  displacementRisk: number;
  environmentalImpact: number;
  socialJustice: number;
}

// System 5: Budget Estimation
export interface MaterialCost {
  item: string;
  quantity: number;
  marketRate: number;
  proposedRate: number;
}

export interface BudgetAnalysis {
  govtTotal: number;
  aiEstimate: number;
  deviation: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  materials: MaterialCost[];
}

export interface ProjectProposalData {
  id: string;
  title: string;
  ministry: string;
  location: string;
  status: 'open' | 'closed' | 'approved' | 'rejected' | 'frozen';
  aiSummary: string;
  budget: {
    govt: string;
    aiEstimate: string;
    risk: 'Low' | 'Medium' | 'High';
    details?: BudgetAnalysis;
  };
  impacts: ('environment' | 'displacement' | 'social' | 'economic')[];
  approvalStats: {
    current: number; 
    required: number;
    totalVotes: number;
  };
  hasVoted?: boolean;
  moralMetrics?: MoralMetrics;
  geoFence?: { lat: number; lng: number; radius: number };
}

// System 16: Audit Log
export interface AuditLogEntry {
  id: string;
  actor: string;
  role: Role | string;
  action: string;
  targetId: string;
  timestamp: string;
  previousHash: string; // Blockchain-style linking
  hash: string;
  details?: string;
  reasonCode?: string;
}

// System 6: Tender Risk
export interface TenderNode {
  id: string;
  name: string;
  type: 'contractor' | 'official' | 'shell';
  riskScore: number;
}

export interface TenderLink {
  source: string;
  target: string;
  value: number;
  type: 'bid' | 'won' | 'related';
}

export interface TenderNetwork {
  nodes: TenderNode[];
  links: TenderLink[];
  syndicateProbability: number;
}

export interface NavItem {
  id: string;
  labelBn: string;
  labelEn: string;
  path: string;
  icon: LucideIcon;
  isDanger?: boolean;
}

export interface TranslationDictionary {
  [key: string]: {
    bn: string;
    en: string;
  };
}

export type NotificationType = 'project' | 'district' | 'report' | 'hospital' | 'security' | 'legal';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  priority: 'low' | 'normal' | 'high' | 'critical'; // System 21
}

export interface WatchlistItem {
  id: string;
  type: NotificationType;
  name: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushAlerts: boolean;
  projectUpdates: boolean;
  districtScores: boolean;
  reportStatus: boolean;
}

export type RTIStatus = 'submitted' | 'acknowledged' | 'review' | 'responded' | 'closed' | 'escalated' | 'violation';

export interface RTIRequest {
  id: string;
  subject: string;
  department: string;
  details: string;
  category: string;
  isPublic: boolean;
  status: RTIStatus;
  dateFiled: string;
  deadline: string;
  applicantName: string;
  trackingId: string;
  response?: string;
}

// System 19: Evidence Metrics (EVP)
export interface EvidenceMetrics {
  credibilityScore: number; // 0-100
  forensicResult: 'authentic' | 'edited' | 'unclear';
  tamperingRisk: 'low' | 'medium' | 'high';
  freshness: 'recent' | 'old';
  chainStatus: 'verified' | 'pending';
  metadataCheck: boolean;
  elaAnalysis: number; // Error Level Analysis score 0-100
}

// System 7: District Integrity
export interface DistrictMetric {
  id: string;
  name: string;
  complaintsResolved: number;
  totalComplaints: number;
  avgResponseTimeHours: number;
  rtiResponseRate: number; // 0-1
  satisfactionScore: number; // 0-100
}
