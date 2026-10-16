# MediGuard - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase project created

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your Firebase credentials
   nano .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Access the app at: `http://localhost:3000`

---

## 🧪 Development Testing

### Dev Mode Login
To test without setting up full Firebase authentication:

1. Click "Get Started" → Sign In with Phone
2. Enter phone: `9999999999`
3. Click "Send OTP"
4. Enter OTP: `123456`
5. Click "Verify & Continue"

This bypasses Firebase phone authentication for development.

---

## ⚙️ Firebase Setup

### 1. Authentication
```
Firebase Console → Authentication → Sign-in method
- Enable "Phone" provider
- Add your domain to "Authorized Domains"
- Enable Anonymous authentication (for dev mode)
```

### 2. Firestore Database
```
Create these collections:
- users (auto-created on first login)
- medicines (auto-created on first medicine add)
- history (auto-created on first dose log)
- family (auto-created on first contact add)
```

### 3. Storage
```
Set up for profile photos:
- profiles/{userId}
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AlarmOverlay.tsx
│   ├── BottomNav.tsx
│   ├── MedicineCard.tsx
│   ├── StatusBar.tsx
│   └── ui/Button.tsx
├── screens/             # Full page screens
│   ├── AddMedicine.tsx
│   ├── Dashboard.tsx
│   ├── Family.tsx
│   ├── History.tsx
│   ├── Login.tsx
│   ├── Onboarding.tsx
│   ├── Profile.tsx
│   ├── Settings.tsx
│   └── Splash.tsx
├── services/            # Firebase & API services
│   ├── authService.ts
│   ├── contactService.ts
│   ├── firebase.ts
│   └── medicineService.ts
├── store/               # Zustand state management
│   ├── useAppStore.ts
│   └── useMedStore.ts
├── utils/               # Helper functions
│   ├── dateUtils.ts
│   └── helpers.ts
├── App.tsx              # Main app component
├── types.ts             # TypeScript interfaces
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build optimized bundle
npm run preview      # Preview production build

# Code Quality
npm run lint         # TypeScript type checking

# Cleanup
npm run clean        # Remove dist folder
```

---

## 📱 Features Overview

### Splash Screen
- Branded landing page
- Get Started & Sign In buttons

### Authentication
- Phone number OTP login
- Anonymous login (dev mode)
- Persistent user sessions

### Dashboard
- Today's medicines list
- Daily progress tracker
- Adherence percentage
- Day streak counter

### Add Medicine
- Medicine name, dosage, unit
- Multiple reminder times (presets + custom)
- Notes/instructions
- Save to Firestore

### History
- Medicine logs (last 50)
- Adherence statistics
- Date filtering
- Taken/Missed status

### Family Contacts
- Add emergency contacts
- Alert levels (1-3)
- SMS/Call notifications
- Contact management

### Settings
- Dark mode toggle
- Font size selection
- Notification preferences
- Sound/vibration control

### Profile
- Edit name & email
- Upload profile photo
- View phone number
- Save changes

---

## 🐛 Troubleshooting

### Problem: "ERR_CONNECTION_REFUSED"
**Solution:** Make sure dev server is running
```bash
npm run dev
```

### Problem: Firebase Phone Auth Error
**Solution:** Check Firebase Console configuration
- Enable Phone authentication provider
- Add localhost:3000 to authorized domains
- For testing, use dev mode (9999999999/123456)

### Problem: No TypeScript errors shown
**Solution:** Run lint command
```bash
npm run lint
```

### Problem: Changes not reflecting
**Solution:** Clear browser cache and restart dev server
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

---

## 📊 State Management

### useAppStore (Global)
```typescript
{
  user: UserProfile | null          // Current user
  loading: boolean                  // Auth loading state
  setUser: (user) => void          // Update user
  setLoading: (bool) => void       // Update loading
  updateSettings: (settings) => void // Update settings
}
```

### useMedStore (Medicines)
```typescript
{
  medicines: Medicine[]             // List of medicines
  setMedicines: (meds) => void     // Update list
  getMedicineById: (id) => Medicine // Find medicine
}
```

---

## 🔒 Environment Variables

**Required (.env file):**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIRESTORE_DATABASE_ID=default
GEMINI_API_KEY=your_gemini_key
```

---

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Vercel
```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push to main
```

---

## 📚 Tech Stack

- **React** 19.0.0 - UI framework
- **TypeScript** - Type safety
- **Vite** 6.2.0 - Build tool
- **Firebase** 12.12.1 - Backend
- **Tailwind CSS** 4.1.14 - Styling
- **Zustand** 5.0.12 - State management
- **Motion** 12.23.24 - Animations
- **Lucide React** - Icons

---

## 📞 Support

For help:
1. Check the [TEST_REPORT.md](./TEST_REPORT.md)
2. Review Firebase console configuration
3. Check browser console (F12) for errors
4. Verify `.env` file has all required keys

---

**Last Updated:** May 1, 2026  
**Version:** 2.0.0
