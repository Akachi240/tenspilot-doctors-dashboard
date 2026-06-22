<div align="center">

# 🩺 Tenspilot Provider Dashboard

**Professional clinical management interface for healthcare providers in the Tenspilot M10s ecosystem**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[🌐 Live Demo](https://tenspilot-doctors-dashboard.vercel.app) · [📱 Patient App](https://github.com/Akachi240/remix-of-tenspilot1) · [🐛 Report Bug](https://github.com/Akachi240/tenspilot-doctors-dashboard/issues) · [✨ Request Feature](https://github.com/Akachi240/tenspilot-doctors-dashboard/issues)

</div>

---

## 📖 About the Project

The **Tenspilot M10s Provider Dashboard** is the clinical management hub for healthcare professionals working with the Tenspilot M10s ecosystem. Doctors and providers use this dashboard to monitor their patient roster, review real-time health data from M10s devices, generate clinical reports, and communicate securely with patients — all from a single, modern interface.

> Built for providers. Designed for clinical workflows. Powered by real-time technology.

---

## ✨ Features

### 🩺 Clinical Tools
| Feature | Description |
|---|---|
| 👥 **Patient Management** | Full patient roster with search, filtering, and status tracking |
| 📊 **Patient Analytics** | Real-time health metrics, session history & trend visualisation |
| 📋 **Clinical Reports** | Comprehensive report generation & export to PDF via jsPDF |
| 💬 **Secure Messaging** | HIPAA-conscious patient–provider messaging system |
| 🎬 **Video Consultations** | Real-time telehealth video calls via Jitsi SDK |
| 🧾 **Patient Detail View** | Deep-dive per-patient dashboards with full session history |
| ⚙️ **Account Settings** | Profile management, notification preferences & security |
| 🔐 **Role-Based Access** | Provider authentication with Firebase Auth |

### ⚙️ Technical Highlights
| Capability | Detail |
|---|---|
| ⚡ **Performance** | Vite 8 + SWC for sub-100ms hot module replacement |
| 📱 **Responsive Design** | Fully optimised for desktop and tablet clinical environments |
| 🔒 **Secure Auth** | Firebase Authentication with protected route guards |
| 🤖 **AI Assistance** | Groq LLM integration for AI-powered clinical summaries |
| 📈 **Rich Charts** | Recharts data visualisation for health trend analysis |
| 🎨 **Modern UI** | Tailwind CSS 4 + Framer Motion for smooth, premium interactions |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | React + TypeScript | 19 / 5.7 |
| **Build Tool** | Vite + SWC | 8.x |
| **Styling** | Tailwind CSS 4 | 4.x |
| **Animations** | Framer Motion | 12.x |
| **Forms** | React Hook Form + Zod | 7.x / 4.x |
| **Backend** | Firebase Auth + Firestore | 12.x |
| **AI / LLM** | Groq SDK | 1.x |
| **Video Calls** | Jitsi React SDK | 1.x |
| **PDF Export** | jsPDF + jsPDF-AutoTable | 4.x |
| **Charts** | Recharts | 3.x |
| **Routing** | React Router v7 | 7.x |
| **Testing** | Vitest + React Testing Library | 4.x |
| **Code Quality** | ESLint + Husky + lint-staged | — |
| **Deployment** | Vercel | — |

---

## 🚀 Quick Start

### Prerequisites
- Node.js `>= 18.x`
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Akachi240/tenspilot-doctors-dashboard.git
cd tenspilot-doctors-dashboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Firebase & Groq API credentials

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Copy `.env.example` to `.env.local` and populate:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_api_key
```

---

## 📂 Project Structure

```
tenspilot-doctors-dashboard/
├── public/                  # Static assets & favicons
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── dashboard/      # Dashboard widgets & summary cards
│   │   ├── patients/       # Patient list & management UI
│   │   ├── reports/        # Report viewer & export tools
│   │   ├── messages/       # Messaging interface
│   │   └── ui/             # Shared design primitives
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Firebase config, utilities & helpers
│   ├── pages/              # Route-level page components
│   └── test/               # Unit & integration tests
├── docs/                    # Additional documentation
├── .env.example             # Environment variable template
├── vite.config.ts           # Vite configuration
└── tailwind.config.ts       # Tailwind design system config
```

---

## 🗺️ Key Routes

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Provider Firebase authentication |
| `/create-profile` | Create Profile | First-time provider onboarding |
| `/dashboard` | Dashboard | High-level patient & activity overview |
| `/patients` | Patients | Full patient roster & search |
| `/patients/:id` | Patient Detail | Deep-dive patient health data |
| `/reports` | Reports | Generate & export clinical reports |
| `/messages` | Messages | Secure patient–provider messaging |
| `/settings` | Settings | Account preferences & security |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Provider Browser App                │
│  React 19 + TypeScript + Vite 8 + Tailwind 4   │
│  ─────────────────────────────────────────────  │
│  React Context API (auth, patient state)        │
│  React Router v7 (client-side routing)          │
└──────────┬──────────────────────────────────────┘
           │
    ┌──────┴───────────────────────┐
    │                              │
    ▼                              ▼
┌────────────────┐      ┌─────────────────────┐
│   Firebase     │      │   External Services  │
│  ─────────── │      │  ──────────────────  │
│  Auth (JWT)   │      │  Groq SDK (AI Chat)  │
│  Firestore DB │      │  Jitsi (Telehealth)  │
│  Storage      │      │  Vercel (Hosting)    │
└────────────────┘      └─────────────────────┘
           │
           ▼
┌────────────────────────────────┐
│   Tenspilot M10s Patient App  │
│  (Shared Firestore database)  │
└────────────────────────────────┘
```

### Data Flow
- **Patient data** is written by the M10s device and Patient App to Firestore
- **Provider Dashboard** reads that same Firestore data in real time
- **Shared collections** ensure both apps stay perfectly in sync
- **Role-based security rules** in Firestore ensure providers can only access their own patients

---

## 🧪 Testing

```bash
# Run all tests (single pass)
npm run test

# Watch mode (TDD)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Tests live in `src/test/` and use **Vitest** + **React Testing Library** + **jsdom**.

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for our code standards and contribution guidelines.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

## 👨‍💻 Author

**Akachi** — Healthcare Software Engineer

[![GitHub](https://img.shields.io/badge/GitHub-@Akachi240-181717?logo=github)](https://github.com/Akachi240)

---

## 🔗 Related

- 📱 **[Tenspilot Patient App](https://github.com/Akachi240/remix-of-tenspilot1)** — AI-powered patient engagement platform

---

<div align="center">
<strong>Made with ❤️ for better healthcare outcomes</strong>
</div>
