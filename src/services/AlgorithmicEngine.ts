
import { 
  Report, 
  User, 
  TruthSignals, 
  MoralMetrics, 
  MaterialCost, 
  TenderNetwork,
  AuditLogEntry 
} from '../types';

/**
 * OpenNation Core Algorithmic Engine
 * Implements mathematical models defined in the Governance Blueprint v1.0
 */

export class AlgorithmicEngine {

  // --- SYSTEM 1: Truth Probability Engine (TPE) ---
  
  static calculateTruthScore(
    reporterTrust: number, // 0-100
    evidenceCount: number,
    geoDistance: number, // km
    communitySupport: number, // ratio 0-1
    communityDoubt: number // ratio 0-1
  ): { score: number; signals: TruthSignals } {
    
    // Normalize Inputs
    const T_reporter = reporterTrust / 100;
    const E_strength = Math.min(evidenceCount * 0.3, 1.0); // Cap at 1.0
    
    // G_match: 1 if < 0.1km, decay linearly to 0 at 5km
    const G_match = geoDistance < 0.1 ? 1.0 : Math.max(0, 1 - (geoDistance / 5.0));
    
    // C_consensus: Bayesian Average
    const totalVotes = communitySupport + communityDoubt;
    const C_consensus = totalVotes === 0 ? 0.5 : communitySupport / (totalVotes + 1);

    // Weights (Blueprint Spec)
    const W1 = 0.25; // Reporter
    const W2 = 0.40; // Evidence (Highest)
    const W3 = 0.15; // Geo
    const W4 = 0.20; // Crowd

    const weightedSum = (W1 * T_reporter) + (W2 * E_strength) + (W3 * G_match) + (W4 * C_consensus);
    const score = Math.round(weightedSum * 100);

    return {
      score,
      signals: {
        reporterTrust: T_reporter,
        evidenceStrength: E_strength,
        geoMatch: G_match,
        communityConsensus: C_consensus,
        botProbability: 0 // Calculated separately
      }
    };
  }

  // --- SYSTEM 2: Influence-Resistance & Bot Detection (IRBD) ---

  static detectBotActivity(voteVelocity: number, ipDiversity: number): number {
    // Logic: High velocity + Low IP diversity = High Bot Prob
    // voteVelocity: votes per minute
    // ipDiversity: unique IPs / total votes (0-1)
    
    const velocityFactor = Math.min(voteVelocity / 60, 1); // 1 if > 60 votes/min
    const diversityPenalty = 1 - ipDiversity; 
    
    // If diversity is low (0.1), penalty is high (0.9). 
    // Bot Prob = Velocity * DiversityPenalty
    return Math.round(velocityFactor * diversityPenalty * 100);
  }

  // --- SYSTEM 4: Project Proposal Weighted Voting (PPWV) ---

  static calculateVoteWeight(
    userTrust: number, 
    distanceToProject: number, 
    isExpert: boolean
  ): number {
    // Blueprint Formula: VoteValue = Base * W_geo * W_expert * W_trust
    const BaseVote = 1;
    
    // W_geo
    let W_geo = 0.25; // Remote
    if (distanceToProject < 2) W_geo = 2.0; // Resident
    else if (distanceToProject < 10) W_geo = 1.0; // City

    // W_expert
    const W_expert = isExpert ? 3.0 : 1.0;

    // W_trust (0.5x to 1.5x)
    const W_trust = 0.5 + (userTrust / 100);

    return BaseVote * W_geo * W_expert * W_trust;
  }

  // --- SYSTEM 5: Government Budget Estimation AI (GBEA) ---

  static analyzeBudget(materials: MaterialCost[]): { estimated: number; deviation: number } {
    const aiTotal = materials.reduce((acc, item) => acc + (item.quantity * item.marketRate), 0);
    const govtTotal = materials.reduce((acc, item) => acc + (item.quantity * item.proposedRate), 0);
    
    const deviation = ((govtTotal - aiTotal) / govtTotal) * 100;
    
    return {
      estimated: aiTotal,
      deviation: Math.round(deviation * 100) / 100
    };
  }

  // --- SYSTEM 6: Tender Risk Analysis (TCRA) ---

  static calculateSyndicateScore(network: TenderNetwork): number {
    // Logic: Density of connections between contractors + repeated wins
    const contractorNodes = network.nodes.filter(n => n.type === 'contractor');
    const links = network.links.length;
    
    if (contractorNodes.length < 2) return 0;

    // Density = 2 * Links / (Nodes * (Nodes - 1))
    const maxLinks = contractorNodes.length * (contractorNodes.length - 1);
    const density = links / (maxLinks || 1);
    
    // Simple heuristic: If density > 0.5, high chance of collusion
    return Math.min(Math.round(density * 100 * 1.5), 100);
  }

  // --- SYSTEM 10: Moral Impact Score (MIS) ---

  static calculateMoralScore(metrics: MoralMetrics): number {
    // Scoring: weighted sum (-100 to +100)
    // Benefit adds, Risk subtracts
    const score = (metrics.povertyBenefit * 0.4) + (metrics.socialJustice * 0.3) - (metrics.displacementRisk * 0.2) - (metrics.environmentalImpact * 0.1);
    return Math.round(score);
  }

  // --- SYSTEM 16: Audit Log Hashing (ALTL) ---

  static generateAuditHash(previousHash: string, entry: Partial<AuditLogEntry>): string {
    // Simple mock SHA-256 simulation for frontend
    const data = previousHash + JSON.stringify(entry);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  }

  // --- SYSTEM 24: Privacy Masking (DAPM) ---
  
  static maskCoordinates(lat: number, lng: number): { lat: number; lng: number } {
    // Snap to rough grid (approx 500m precision) to hide exact house
    const precision = 100; // Rounding factor
    return {
      lat: Math.round(lat * precision) / precision,
      lng: Math.round(lng * precision) / precision
    };
  }
}
