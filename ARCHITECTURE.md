# Tenspilot M10s — Provider Dashboard Architecture

This document describes the technical architecture of the Tenspilot Provider Dashboard and how it integrates within the broader M10s ecosystem.

---

## 🏗️ High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TENSPILOT M10s ECOSYSTEM                         │
│                                                                         │
│   ┌─────────────────────┐         ┌─────────────────────────────────┐  │
│   │   M10s Hardware     │         │     Patient Web Application     │  │
│   │   (TENS Device)     │──BLE/──▶│   (remix-of-tenspilot1)        │  │
│   │                     │  WiFi   │   Writes data to Firestore      │  │
│   └─────────────────────┘         └────────────────┬────────────────┘  │
│                                                     │                   │
│                                                     ▼                   │
│                                          ┌──────────────────────┐      │
│                                          │   Firebase Backend   │      │
│                                          │   Auth + Firestore   │      │
│                                          │   + Storage          │      │
│                                          └──────────┬───────────┘      │
│                                                     │ Real-time sync    │
│                                                     ▼                   │
│                                    ┌────────────────────────────────┐  │
│                                    │   Provider Dashboard           │  │
│                                    │   React 19 + Vite 8           │  │
│                                    │   (this repository)            │  │
│                                    └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Application Layer Structure

```
tenspilot-doctors-dashboard/
├── src/
│   ├── components/          # Reusable UI & feature components
│   │   ├── dashboard/      # Dashboard summary cards and widgets
│   │   ├── patients/       # Patient list, search, and management UI
│   │   ├── messages/       # Secure messaging interface
│   │   ├── reports/        # Report viewer and PDF export
│   │   └── ui/             # Shared design primitives
│   ├── contexts/           # React Context API providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Firebase SDK, utilities, type helpers
│   ├── pages/              # Route-level page components
│   └── test/               # Vitest unit & integration tests
```

---

## 🔐 Authentication Architecture

```
Provider → Login Page (/login)
                │
                ▼
        Firebase Auth (Email/Password)
                │
                ├─ Success → JWT Token + Provider role verified
                │                      │
                │                      ▼
                │             ProtectedRoute HOC
                │             guards all clinical routes
                │                      │
                │                      ▼
                │              Provider App (Dashboard, Patients, etc.)
                │
                ├─ New User → /create-profile → Firestore provider doc created
                │
                └─ Failure → Error message → Retry
```

**Key files:**
- `src/contexts/AuthContext.tsx` — Global auth state provider
- `src/lib/firebase.ts` — Firebase SDK initialisation
- `src/pages/LoginPage.tsx` — Provider login flow
- `src/pages/CreateProfilePage.tsx` — First-time onboarding

---

## 🗃️ State Management

| Scope | Tool | Use Case |
|---|---|---|
| **Global** | React Context | Auth state, provider profile |
| **Server** | Firestore listeners | Real-time patient data |
| **Local** | `useState` / `useReducer` | UI state, form state |
| **Forms** | React Hook Form + Zod | All form handling & validation |

---

## 🌐 Routing (React Router v7)

| Route | Page | Access |
|---|---|---|
| `/login` | LoginPage | Public |
| `/create-profile` | CreateProfilePage | Auth (new providers) |
| `/dashboard` | DashboardPage | 🔒 Protected |
| `/patients` | PatientsPage | 🔒 Protected |
| `/patients/:id` | PatientDetailPage | 🔒 Protected |
| `/reports` | ReportsPage | 🔒 Protected |
| `/messages` | MessagesPage | 🔒 Protected |
| `/settings` | SettingsPage | 🔒 Protected |

---

## 📊 Data Architecture (Firestore)

```
Firestore Database
├── users/                      # Patient profiles (written by Patient App)
│   └── {userId}/
│       ├── profile             # Name, DOB, device ID
│       └── sessions/           # TENS device session logs
│           └── {sessionId}/
│               ├── startTime
│               ├── duration
│               ├── intensity
│               └── painBefore / painAfter
│
├── providers/                  # Healthcare provider profiles
│   └── {providerId}/
│       ├── profile             # Name, specialty, clinic
│       └── patients/           # Provider-patient relationships
│
├── appointments/               # Shared appointment records
│   └── {appointmentId}/
│       ├── patientId
│       ├── providerId
│       └── videoRoomName       # Used by Jitsi integration
│
└── messages/                   # Secure messaging
    └── {conversationId}/
        └── messages/
            └── {messageId}/
```

---

## 🎬 Video Consultation Architecture

```
Provider opens Patient Detail → Start Video Call
    │
    ▼
JitsiMeeting component (@jitsi/react-sdk)
    │
    ├─ Room name = appointment ID from Firestore
    │
    ▼
WebRTC peer-to-peer connection (via Jitsi infrastructure)
    │
    ▼
Patient joins same room from Patient App
```

---

## 📋 Report Generation Architecture

```
Provider selects patient → ReportsPage
    │
    ▼
Fetches session history from Firestore
    │
    ▼
Passes data to jsPDF + jsPDF-AutoTable
    │
    ▼
Generates formatted clinical PDF report
    │
    ▼
Browser download trigger → Provider saves PDF
```

---

## 🤖 AI Integration (Groq)

The Provider Dashboard uses Groq SDK to generate AI-powered summaries of patient health data. Providers can request:
- Session trend analysis
- Pain pattern insights
- Treatment effectiveness summaries

---

## 🧪 Testing Strategy

| Type | Tool | Coverage |
|---|---|---|
| Unit tests | Vitest | Pure functions, hooks, utilities |
| Component tests | React Testing Library | UI behaviour and interactions |
| Integration tests | Vitest + jsdom | Multi-component clinical workflows |

Run: `npm run test:coverage`

---

## 🚀 Deployment

- **Platform**: Vercel (automatic preview deployments on PRs)
- **Config**: `vercel.json` — SPA routing rewrites to `index.html`
- **Environment**: All `VITE_*` env vars set in Vercel dashboard
- **Build command**: `npm run build` → `tsc && vite build`

---

## 🔗 Related Repositories

- **[Patient App](https://github.com/Akachi240/remix-of-tenspilot1)** — Patient-facing application sharing the same Firebase backend
