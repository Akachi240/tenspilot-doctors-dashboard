<div align="center">

# 🩺 TensPilot+ Provider Dashboard

**Companion provider application for the TensPilot+ ecosystem — clinical management interface for healthcare professionals**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)]()

[🌐 Live Demo](https://tenspilot-doctor-dashboard.vercel.app) · [📱 Patient App](https://github.com/Akachi240/remix-of-tenspilot1) · [🐛 Report Bug](https://github.com/Akachi240/tenspilot-doctors-dashboard/issues)

</div>

---

## 📖 About the Project

**TensPilot+** is a healthcare software ecosystem built alongside a standalone TENS (Transcutaneous Electrical Nerve Stimulation) device for pain management therapy.

The ecosystem has two components:
- 🔧 **The TENS Device** — a standalone hardware unit (Arduino Uno based, 4 therapy modes) that delivers electrical stimulation therapy
- 💻 **TensPilot+ Software** — companion web applications (this provider dashboard + the patient app) that help doctors monitor their patients' therapy progress and communicate with them

> The apps and hardware operate independently — TensPilot+ is a **companion app**, not a direct device interface. This dashboard gives healthcare providers a real-time view of their patients' self-reported session data and pain logs.

---

## ✨ Features

### 🩺 Provider Tools
| Feature | Description |
|---|---|
| 👥 **Patient Management** | Full patient roster with search, filtering and status tracking |
| 📊 **Patient Analytics** | Session history, pain trend charts and therapy outcomes |
| 📋 **Clinical Reports** | Generate and export patient reports to PDF (jsPDF + AutoTable) |
| 💬 **Patient Messaging** | Secure provider-to-patient messaging |
| 🧾 **Patient Detail View** | Deep-dive per-patient dashboard with full session history |
| 🤖 **AI Summaries** | Groq-powered AI summaries of patient health data |
| ⚙️ **Account Settings** | Profile management, notification preferences and security |
| 🔐 **Secure Auth** | Firebase Authentication with role-based access |

### ⚙️ Technical Highlights
| Capability | Detail |
|---|---|
| ⚡ **Performance** | Vite 8 + SWC for fast builds and instant HMR |
| 📱 **Responsive** | Optimised for desktop and tablet clinical environments |
| 🔒 **Secure Auth** | Firebase Authentication with protected route guards |
| 📈 **Rich Charts** | Recharts data visualisation for health trend analysis |
| 🎨 **Modern UI** | Tailwind CSS 4 + Framer Motion for smooth interactions |

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
| **PDF Export** | jsPDF + jsPDF-AutoTable | 4.x |
| **Charts** | Recharts | 3.x |
| **Routing** | React Router v7 | 7.x |
| **Testing** | Vitest + React Testing Library | 4.x |
| **Code Quality** | ESLint + Husky + lint-staged | — |
| **Deployment** | Vercel | — |

---

## 🗺️ Key Routes

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Provider Firebase authentication |
| `/create-profile` | Create Profile | First-time provider onboarding |
| `/dashboard` | Dashboard | Patient overview & activity summary |
| `/patients` | Patients | Full patient roster & search |
| `/patients/:id` | Patient Detail | Per-patient session data & trends |
| `/reports` | Reports | Generate & export clinical reports |
| `/messages` | Messages | Secure patient–provider messaging |
| `/settings` | Settings | Account preferences & security |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│          TensPilot+ Provider Dashboard            │
│  React 19 + TypeScript + Vite 8 + Tailwind 4    │
└──────────────────────┬───────────────────────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
   ┌─────────────────┐  ┌───────────────────┐
   │    Firebase      │  │  External APIs    │
   │  Auth + Firestore│  │  Groq (AI chat)   │
   │  (shared with    │  │  Patient App)     │
   └────────┬─────────┘  └───────────────────┘
            │ Real-time sync
            ▼
   ┌─────────────────────────┐
   │  TensPilot+ Patient App │
   │  (remix-of-tenspilot1)  │
   └─────────────────────────┘
```

Both apps share the same Firebase backend — when a patient logs a session in the patient app, it appears immediately in the provider's dashboard in real time.

---

## 📄 License

© Akachi240. All Rights Reserved. This project is not open source. No part of this codebase may be copied, modified, or distributed without explicit permission from the author.---

## 🔗 Related

- 📱 **[TensPilot+ Patient App](https://github.com/Akachi240/remix-of-tenspilot1)** — Patient-facing companion app (shared Firebase backend)

---

<div align="center">
<strong>Made with ❤️ for better healthcare outcomes</strong>
</div>
