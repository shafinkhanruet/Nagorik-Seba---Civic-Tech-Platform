
# Nagorik Seba / OpenNation (Civic Tech Platform)

**Nagorik Seba** is a next-generation civic engagement platform designed to bridge the gap between citizens and government infrastructure in Bangladesh. It leverages AI, Blockchain-ready audit trails, and real-time data visualization to ensure transparency, accountability, and efficient public service delivery.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Prototype-orange)

---

## 📖 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Core Architecture](#2-core-architecture)
3. [Roles & Access Control](#3-roles--access-control)
4. [Crisis Mode Behavior](#4-crisis-mode-behavior)
5. [Audit Ledger Rules](#5-audit-ledger-rules)
6. [Identity Protection (DIPS)](#6-identity-protection-dips)
7. [Installation & Setup](#7-setup--run-instructions)
8. [API Reference](#8-full-api-reference)

---

## 1. Project Overview

The platform serves two primary user bases:
1.  **Citizens**: Who report issues, vote on projects, track government spending, and file RTI (Right to Information) requests.
2.  **Administration**: Who manage resources, monitor corruption risks via AI, verify reports, and handle crisis situations.

### Core Principles
*   **Transparency**: Every administrative action (approval, freeze, edit) is logged in an immutable Audit Ledger.
*   **Privacy**: Citizen identities are protected via the **Dual Identity Protection System (DIPS)**.
*   **Ethics**: Infrastructure projects are weighed against a **Moral Impact Score (MIS)**.

---

## 2. Core Architecture

The current implementation uses a **Service-Oriented Frontend Architecture**:

*   **Algorithmic Engine**: Local execution of TPE (Truth Probability Engine), IRBD (Bot Detection), and GBEA (Budget Estimation).
*   **Background Workers**: Simulated cron jobs for RTI escalations, reputation decay, and notification dispatching.
*   **Mock API Layer**: A stateful in-memory database simulating RESTful persistence.

**Data Flow**:
1.  **Submission**: Citizen submits report with geo-tagged media.
2.  **Validation**: `EVP` (Evidence Verification Pipeline) checks media metadata/ELA.
3.  **Scoring**: `TPE` calculates Truth Probability (0-100%).
4.  **Resistance**: `IRBD` checks for bot-net voting patterns.
5.  **Audit**: Action is hashed and appended to the ledger.

---

## 3. Roles & Access Control

| Role | Description | Permissions |
| :--- | :--- | :--- |
| **Citizen** | Verified General Public | Submit reports, vote, file RTI, view analytics. |
| **Moderator** | Content Integrity Staff | Review flagged reports, manage discussion queues. |
| **Admin** | Ministry/Dept Officials | Manage projects, analyze tenders, respond to RTI. |
| **Superadmin**| System Controllers | Activate Crisis Mode, Unlock Identity (Dual-Auth). |

---

## 4. Crisis Mode Behavior
**Crisis Mode** acts as a system-wide circuit breaker. When activated:
*   **Write Operations Blocked**: All voting, report submissions, and RTI filings are suspended.
*   **Auth Enforcement**: Active sessions may be terminated, requiring 2FA re-authentication.
*   **Public Warning**: A system-wide priority alert is broadcast to all clients.

---

## 5. Audit Ledger Rules
1.  **Immutability**: Entries cannot be deleted or modified.
2.  **Chaining**: Each entry contains a `previousHash`, creating a SHA-256 linked list.
3.  **Verifiability**: The `hash` field covers the actor, action, target, and timestamp.
4.  **Completeness**: Any function marked `[AUDIT]` in the API reference must generate a ledger entry.

---

## 6. Identity Protection (DIPS)
Identities are handled using a **2-of-2 Multi-Signature Reconstitution** model:
*   **Encryption**: User PII is encrypted with a master key at rest.
*   **Fragmentation**: The decryption key is split into two fragments.
*   **Access**: Reconstitution requires Admin A's fragment, Admin B's fragment, and a verified **Court Order Hash**.

---

## 7. Setup & Run Instructions

### Prerequisites
*   Node.js v18.0.0+
*   npm v9.0.0+

### Installation
```bash
git clone https://github.com/opennation/nagorik-seba-bd.git
cd nagorik-seba-bd
npm install
```

### Execution
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:
```properties
VITE_API_BASE_URL=https://api.opennation.gov.bd
VITE_CRISIS_MODE_DEFAULT=false
VITE_ENABLE_AUDIT_LEDGER=true
VITE_REPUTATION_DECAY_RATE=0.1
```

---

## 8. FULL API Reference

### 8.1 AUTH

#### `POST /api/auth/login`
*   **Role**: Public
*   **Description**: Initiates session and triggers OTP.
*   **Request**: `{ "identifier": "01711000000", "password": "hash_password" }`
*   **Response**: `{ "step": "otp", "tempToken": "tkn_9921" }`

#### `POST /api/auth/verify-otp`
*   **Role**: Public
*   **Request**: `{ "otp": "123456", "tempToken": "tkn_9921" }`
*   **Response**: `{ "user": { "id": "u-1", "role": "citizen" }, "token": "jwt_string" }`
*   **Audit**: `LOG_USER_SESSION_START`

### 8.2 REPORTS

#### `GET /api/reports`
*   **Role**: Public
*   **Description**: Fetch public reports feed.

#### `POST /api/reports`
*   **Role**: Citizen
*   **Crisis Mode**: **BLOCKED**
*   **Request**: 
    ```json
    {
      "category": "Infrastructure",
      "description": "Bridge crack at Uttara",
      "location": { "lat": 23.81, "lng": 90.41 },
      "evidence": [{ "type": "image", "data": "base64..." }]
    }
    ```
*   **Response**: `{ "id": "rep_550", "truthScore": 82, "status": "pending_ai_review" }`
*   **Audit**: `LOG_REPORT_SUBMISSION`

#### `POST /api/reports/:id/vote`
*   **Role**: Citizen
*   **Request**: `{ "type": "support", "location": { "lat": 23.8, "lng": 90.4 } }`
*   **Response**: `{ "newWeightedScore": 1450.2, "botRisk": 0.02 }`
*   **Audit**: `LOG_VOTE_CAST`

### 8.3 PROJECTS

#### `GET /api/projects`
*   **Role**: Public
*   **Description**: Fetch proposed infra projects for public voting.

#### `POST /api/projects/:id/opinion`
*   **Role**: Citizen
*   **Description**: Submit structured opinion on project proposal.
*   **Request**: `{ "vote": "support", "reason": "Necessary for traffic" }`
*   **Crisis Mode**: **BLOCKED**.

#### `POST /api/admin/projects/:id/status`
*   **Role**: Admin
*   **Description**: Freeze or Approve project based on budget/risk.
*   **Request**: `{ "status": "frozen", "reason": "Budget Deviation" }`
*   **Audit**: `LOG_PROJECT_OVERRIDE`

### 8.4 TENDERS

#### `GET /api/tenders/network`
*   **Role**: Admin/Citizen
*   **Description**: Fetch node-link data for syndicate analysis.
*   **Response**: `{ "nodes": [...], "links": [...], "syndicateProbability": 0.85 }`

### 8.5 RTI (Right To Information)

#### `GET /api/rti`
*   **Role**: Citizen
*   **Description**: Fetch my requests or public library.

#### `POST /api/rti`
*   **Role**: Citizen
*   **Request**: `{ "department": "LGRD", "subject": "BoQ for Bridge ID 882", "isPublic": true }`
*   **Response**: `{ "id": "rti_99", "trackingId": "TRK-001", "deadline": "2024-01-20" }`
*   **Audit**: `SUBMIT_RTI`

#### `POST /api/admin/rti/:id/response`
*   **Role**: Admin
*   **Request**: `{ "content": "Attached BoQ", "attachments": ["file.pdf"] }`
*   **Audit**: `UPDATE_RTI_RESPONDED`

### 8.6 HOSPITALS

#### `GET /api/hospitals`
*   **Description**: Fetch service quality metrics.
*   **Response**: `[{ "id": "h1", "fairnessScore": 42, "bribeRisk": "High" }]`

### 8.7 INTEGRITY INDEX

#### `GET /api/districts/:id/integrity`
*   **Response**: `{ "overallScore": 85, "rank": 1, "metrics": { "rtiResponse": 0.95 } }`

#### `POST /api/admin/districts/calibrate`
*   **Role**: Superadmin
*   **Request**: `{ "weights": { "complaint": 60, "resolution": 40 } }`
*   **Audit**: `LOG_ALGO_CALIBRATION`

### 8.8 ADMIN & SECURITY

#### `POST /api/admin/crisis/activate`
*   **Role**: Superadmin (Dual-Auth)
*   **Request**: `{ "reason": "System Breach", "duration": "24h" }`
*   **Audit**: `LOG_SYSTEM_LOCKDOWN`

#### `POST /api/admin/identity/unlock`
*   **Role**: Superadmin (Dual-Auth)
*   **Description**: Decrypt anonymous identity using court order.
*   **Request**: `{ "reportId": "rep_5", "courtOrderHash": "sha256...", "adminKey1": "...", "adminKey2": "..." }`
*   **Response**: `{ "identity": { "name": "Rahim Uddin", "nid": "..." } }`
*   **Audit**: `LOG_IDENTITY_UNMASKING`

#### `GET /api/admin/audit-logs`
*   **Role**: Admin
*   **Response**: `[{ "id": "l1", "action": "LOGIN", "hash": "0xabc...", "previousHash": "0x000..." }]`

### 8.9 COMMUNITY REPAIR

#### `POST /api/community/repairs/:id/fix`
*   **Role**: Citizen
*   **Request**: `{ "proof": "base64_image", "description": "Pothole filled" }`
*   **Response**: `{ "pendingCredits": 50, "status": "verifying" }`
*   **Crisis Mode**: **BLOCKED**.

## 9. Error Responses

| Code | Status | Description |
| :--- | :--- | :--- |
| **403-CRISIS** | Forbidden | Operation blocked due to active Crisis Mode. |
| **401-UNAUTH** | Unauthorized | Invalid session token or 2FA failure. |
| **422-BOT** | Unprocessable | IRBD Algorithm flagged submission as bot behavior. |
| **403-RBAC** | Forbidden | User role lacks permission for this endpoint. |
| **500-CHAIN** | Error | Audit Ledger validation failed (Integrity Breach). |
