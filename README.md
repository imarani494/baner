<h1 align="center">
  <img src="https://img.shields.io/badge/Foto_Owl_AI-Assignment-4361ee?style=for-the-badge" />
  <br/>
  React Native Developer Intern — Assignment
</h1>

<p align="center">
  <strong>Submitted by: Imaran Ali</strong><br/>
  Mobile: 6388649373 &nbsp;|&nbsp; Email: imarani494@gmail.com
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-TypeScript-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android" />
  <img src="https://img.shields.io/badge/Platform-iOS-000000?style=flat-square&logo=apple" />
  <img src="https://img.shields.io/badge/APK-Available-2d9e6b?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Submitted-orange?style=flat-square" />
</p>

---

## 📌 Assignment Overview

This project was built as part of the **Android/iOS/React Native Developer Intern** hiring assignment for **Foto Owl AI, Baner, Pune**.

> Submission deadline: **25 June 2025**
> Submitted on: **25 June 2025** ✅

---

## 📱 App Features

### Core Screens

| Screen | Features |
|--------|----------|
| 🔐 **Login** | Email/password validation, JWT simulation, session persisted via AsyncStorage |
| 📋 **Task Dashboard** | Task list from API, pull-to-refresh, search bar, completed/pending filters |
| ➕ **Add Task** | Form with title & description validation, POST to API |
| 👤 **Profile** | User info display, task stats, logout with confirmation |

### Bonus Features

| Feature | Status |
|---------|--------|
| Offline Task Caching | ✅ AsyncStorage stale-while-revalidate |
| Dark Mode | ✅ System-aware via `useColorScheme` |
| Unit Tests | ✅ Validation & auth helpers |

---

## 🗂️ Project Structure

```
baner/
├── app/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── TaskDashboardScreen.tsx
│   │   ├── AddTaskScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── navigation/
│       └── AppNavigator.tsx
├── components/
│   ├── TaskCard.tsx
│   └── EmptyState.tsx
├── services/
│   └── api.ts                  # Axios + interceptors
├── store/
│   ├── AuthContext.tsx          # Login / logout / session
│   └── TaskContext.tsx          # Fetch / add / toggle tasks
├── utils/
│   ├── validation.ts
│   ├── storage.ts
│   └── __tests__/
│       └── validation.test.ts
├── assets/
├── README.md
└── AI_USAGE.md
```

---

## 🚀 How to Run

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| React Native CLI | Latest |
| Android Studio | Hedgehog+ |
| JDK | 17 |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/imarani494/baner.git
cd baner

# 2. Install dependencies
npm install

# 3. Run on Android
npx react-native run-android

# 4. Run on iOS (Mac only)
cd ios && pod install && cd ..
npx react-native run-ios
```

> No `.env` file needed — the app uses [JSONPlaceholder](https://jsonplaceholder.typicode.com) for tasks and simulates JWT auth locally.

---

## 🧪 Test Credentials

```
Email:     demo@example.com
Password:  demo123
```

Any valid email + password (min 6 characters) will work since auth is simulated.

---

## 🏗️ Architecture Decisions

| Area | Choice | Reason |
|------|--------|--------|
| State | Context API + useReducer | Lightweight, avoids Redux boilerplate for this scope |
| HTTP | Axios | Interceptors for token injection and error normalisation |
| Auth | JWT simulation + AsyncStorage | Mirrors real JWT flow without a backend |
| Navigation | React Navigation v6 | Stack + bottom tab pattern |
| TypeScript | Strict mode | Catches bugs across context → screen → component |
| Offline | Stale-while-revalidate | Cached tasks show instantly; fresh fetch runs in background |

---

## 📦 APK Download

The debug APK is attached to the submission email.

- **File:** `app-debug.apk`
- **Tested on:** Android 11+
- **Build:** `react-native build-android --mode=debug`

---

## 📹 Demo

> A short video walkthrough demonstrating all screens and features is included with the submission.

---

## 🤖 AI Usage

See [`AI_USAGE.md`](./AI_USAGE.md) for full disclosure of AI tools used, prompts, and which parts were manually written.

---

## 📄 License

This project was created for evaluation purposes as part of the Foto Owl AI hiring process.

---

<p align="center">
  Made with ❤️ by <strong>Imaran Ali</strong>
</p>
