
# Nagorik Seba - Civic Tech Platform

## 1. Project Overview

**Nagorik Seba** is a next-generation civic engagement platform designed to bridge the gap between citizens and government infrastructure. It leverages AI, Blockchain-ready audit trails, and real-time data visualization to ensure transparency, accountability, and efficient public service delivery.

The platform serves two primary user bases:
1.  **Citizens**: Who report issues, vote on projects, track government spending, and file RTI requests.
2.  **Administration**: Who manage resources, monitor corruption risks via AI, verify reports, and handle crisis situations.

---

## 2. Problem Statement

Traditional civic feedback loops are opaque, slow, and prone to manipulation.
*   **Lack of Transparency**: Citizens cannot track where their tax money goes or the status of infrastructure projects.
*   **Data Silos**: Corruption in tenders and procurement often hides within disconnected datasets.
*   **Trust Deficit**: No verifiable metric exists to measure the integrity of local government units.
*   **Inefficient Response**: Emergency situations and widespread infrastructure failures lack real-time coordinated response systems.

**Nagorik Seba solves this by:**
*   Quantifying "Integrity" and "Trust" scores.
*   Using AI to detect procurement syndicates and vote manipulation.
*   Providing an immutable audit log for all sensitive administrative actions.

---

## 3. Architecture & Tech Stack

### Frontend (Current Scope)
*   **Framework**: React 18 + Vite + TypeScript
*   **State Management**: Context API (Scalable to Redux/Zustand)
*   **Styling**: Tailwind CSS + Lucid React Icons
*   **Visualization**: Recharts for data analytics
*   **Routing**: React Router DOM v6

### Backend (Integration Ready)
*   **API Pattern**: RESTful (JSON)
*   **Authentication**: JWT + 2FA (OTP/Biometric)
*   **RBAC**: Role-Based Access Control Middleware
*   **AI Service**: Python/FastAPI (for Forensic Analysis & NLP)

### Data Flow
1.  **User Action**: Citizen submits a report.
2.  **Edge Processing**: Frontend validates inputs and processes media.
3.  **API Gateway**: Authenticates request and routes to Report Service.
4.  **AI Pipeline**: Analyzes text for toxicity and media for authenticity (Deepfake detection).
5.  **Consensus Layer**: Calculates "Truth Probability" based on reporter trust score + AI confidence.
6.  **Admin Review**: High-risk items flag moderators; Low-risk items auto-publish.

---

## 4. Security & Ethics Model

### Role-Based Access Control (RBAC)
| Role | Permissions |
| :--- | :--- |
| **Citizen** | View Public Data, Submit Reports, Vote, Comment, File RTI. |
| **Moderator** | Review Queue, Hide/Restore Content, View Basic Analytics. |
| **Admin** | Manage Projects, Tenders, Hospitals, RTI Responses, Crisis Mode. |
| **Superadmin** | Full System Access, Identity Unlock (Requires Dual Auth), Audit Log Deletion (Disabled). |

### Ethics Safeguards
*   **Identity Vault**: Reporter identities are encrypted. Unlocking requires a digital court order and dual-admin authorization.
*   **AI Transparency**: Every AI decision (e.g., flagging a post) is logged with a "Why?" explanation.
*   **Moral Impact Score**: Projects are evaluated not just on ROI but on social justice and environmental impact.

---

## 5. Folder Structure

```
/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and global styles
│   ├── components/      # Reusable UI atoms and molecules
│   │   ├── charts/      # Recharts wrappers
│   │   ├── common/      # Buttons, Modals, Inputs
│   │   └── widgets/     # Complex domain-specific widgets
│   ├── config/          # Permission matrices and constants
│   ├── context/         # React Context providers (Auth, Toast, Notifs)
│   ├── hooks/           # Custom React hooks (API, Permissions)
│   ├── layouts/         # Dashboard and Auth layouts
│   ├── pages/           # Route views
│   ├── services/        # API integration layer
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Root component & Routing
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── metadata.json        # Manifest configuration
└── package.json         # Dependencies
```

---

## 6. Setup & Installation

### Prerequisites
*   Node.js v18+
*   npm or yarn

### Commands

```bash
# Install Dependencies
npm install

# Start Development Server
npm run dev

# Build for Production
npm run build

# Preview Production Build
npm run preview
```

### Environment Variables (.env)

```properties
VITE_API_BASE_URL=https://api.nagorikseba.gov.bd/v1
VITE_AI_SERVICE_URL=https://ai.nagorikseba.gov.bd
VITE_MAPS_API_KEY=xyz_google_maps_key
VITE_ENABLE_DEMO_MODE=false
```

---

## 7. API Documentation

### A. Authentication & Identity

#### Login
*   **POST** `/api/auth/login`
*   **Request**: `{ "identifier": "string", "password": "string" }`
*   **Response**: `{ "step": "otp" | "complete", "token": "jwt_string?" }`

#### Verify OTP
*   **POST** `/api/auth/verify-otp`
*   **Request**: `{ "tempToken": "string", "otp": "string" }`
*   **Response**: `{ "user": { "id": "uuid", "role": "admin", "name": "string" }, "token": "jwt_string" }`

#### User Profile
*   **GET** `/api/users/me`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response**: `{ "id": "uuid", "trustScore": number, "badges": [...] }`

---

### B. Citizen Reports (Live Feed)

#### Get Reports
*   **GET** `/api/reports?district=dhaka&status=verified`
*   **Response**: `[ { "id": "rep_1", "title": "...", "truthScore": 88, "aiSummary": "..." } ]`

#### Submit Report
*   **POST** `/api/reports`
*   **Request**: 
    ```json
    {
      "category": "infrastructure",
      "description": "Road broken at Mirpur 10",
      "location": { "lat": 23.81, "lng": 90.41, "address": "..." },
      "isAnonymous": true,
      "evidence": [{ "type": "image", "data": "base64..." }]
    }
    ```
*   **Response**: `{ "id": "rep_new", "status": "pending_ai_review" }`

#### Vote on Report
*   **POST** `/api/reports/:id/vote`
*   **Request**: `{ "type": "support" | "doubt" }`
*   **Response**: `{ "newWeightedScore": 1250.5 }`

---

### C. Projects & Proposals

#### Get Projects
*   **GET** `/api/projects`
*   **Response**: List of government projects with budget and status.

#### Submit Opinion (Voting)
*   **POST** `/api/projects/:id/opinion`
*   **Request**: `{ "vote": "support" | "modify" | "reject", "reason": "string" }`
*   **Note**: Once submitted, the user's vote is hashed and locked.

#### Admin Action (Approval)
*   **POST** `/api/admin/projects/:id/status`
*   **Role**: `admin`, `superadmin`
*   **Request**: 
    ```json
    {
      "status": "approved" | "rejected" | "frozen",
      "reason": "Public Interest",
      "publicNotice": "Approved pending environmental clearance."
    }
    ```

---

### D. Integrity & Transparency

#### District Metrics
*   **GET** `/api/districts/:id/integrity`
*   **Response**:
    ```json
    {
      "overallScore": 85,
      "metrics": {
        "complaints": 120,
        "resolutionTimeAvg": 48,
        "auditFlags": 2
      }
    }
    ```

#### Calibrate Algorithm (Admin)
*   **POST** `/api/admin/districts/calibrate`
*   **Role**: `superadmin`
*   **Request**: `{ "weights": { "complaint": 60, "resolution": 40 } }`
*   **Description**: Adjusts how the integrity score is calculated. Logged in Audit Trail.

---

### E. Procurement & Tenders

#### Tender Network Analysis
*   **GET** `/api/tenders/network`
*   **Response**: Graph data (nodes/edges) showing relationships between contractors and officials to detect syndicates.

#### Get Document
*   **GET** `/api/tenders/docs/:id`
*   **Response**: `{ "url": "...", "hash": "sha256...", "accessLevel": "public" }`

---

### F. RTI (Right To Information)

#### Submit Request
*   **POST** `/api/rti`
*   **Request**:
    ```json
    {
      "department": "Ministry of Health",
      "subject": "Budget allocation 2023",
      "details": "...",
      "isPublic": true
    }
    ```

#### Admin Response
*   **PATCH** `/api/rti/:id/response`
*   **Role**: `admin`
*   **Request**: `{ "response": "string", "attachments": [...] }`

---

### G. Crisis Control & Security

#### Activate Crisis Mode
*   **POST** `/api/admin/crisis/activate`
*   **Role**: `superadmin` (Requires Dual Auth headers)
*   **Headers**: `X-Admin-1-Auth: code1`, `X-Admin-2-Auth: code2`
*   **Request**: 
    ```json
    {
      "category": "Cyber Attack",
      "reason": "DDoS on voting nodes",
      "modulesToFreeze": ["voting", "reports"]
    }
    ```

#### Unlock Identity
*   **POST** `/api/admin/identity/unlock`
*   **Role**: `superadmin`
*   **Request**: `{ "reportId": "string", "courtOrderHash": "string", "justification": "string" }`
*   **Description**: Unmasks an anonymous user. This triggers an immutable audit log entry and notifies the legal team.

#### Audit Logs
*   **GET** `/api/admin/audit-logs`
*   **Role**: `admin`, `superadmin`
*   **Response**: List of all sensitive actions taken by admins and AI.

---

### H. Notifications

*   **GET** `/api/notifications`
*   **POST** `/api/watchlist` - Follow a project, district, or issue.

---

## 8. Error Handling

Standard HTTP Status Codes are used:
*   `200 OK`: Success
*   `400 Bad Request`: Validation failure
*   `401 Unauthorized`: Invalid token
*   `403 Forbidden`: Insufficient RBAC permissions
*   `429 Too Many Requests`: Rate limit exceeded
*   `500 Internal Server Error`: Server-side failure

**Error Response Format:**
```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to unlock identity data.",
    "traceId": "req_123abc"
  }
}
```

---

© 2024 Nagorik Seba. Built for the people, by the people.
