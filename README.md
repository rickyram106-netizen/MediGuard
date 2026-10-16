# MediGuard

> 🚧 **Status: Under active development.** This is a work in progress. Some features are incomplete and things may change or break.

MediGuard is a medicine-management and reminder app. It aims to help people keep all their medicines in one place and not miss a dose.

## The problem

Many people, especially elderly patients and people on long-term treatment, forget doses or lose track of which medicine to take and when. MediGuard is my attempt to make this simpler with one place to organise medicines and get reminded.

## Project goals

- Store a person's medicines with their dose and timing
- Remind the user when a medicine is due
- Keep the experience simple enough for non-technical users

<!-- When a feature is built AND you have tested it yourself, move it into a "Working features" list below. Do not list anything you have not seen work. -->

## Current status

| Area | Status |
|------|--------|
| Core medicine tracking | In progress |
| Reminders | In progress |
| User accounts | In progress |
| Automated tests | Not yet added |
| Deployment | Not yet deployed |

## Tech stack

Based on the project files:

- **Frontend:** TypeScript with Vite
- **Backend:** `MediGuardAPI` folder (server-side code)
- **Database / security rules:** Firebase Firestore (`firestore.rules`)
- **AI:** Google Gemini API (key configured through an environment variable)
- **Built with:** Google AI Studio, ChatGPT, Claude and GitHub Copilot

<!-- Check package.json to confirm the frontend framework (for example React) and add it above. -->

## Run locally

**Requirements:** [Node.js](https://nodejs.org) 18 or newer

1. Clone the repository and open the folder:
```
   git clone https://github.com/rickyram106-netizen/MediGuard.git
   cd MediGuard
```
2. Install dependencies:
```
   npm install
```
3. Create your environment file (Windows Command Prompt):
```
   copy .env.example .env.local
```
4. Open `.env.local` and add your own `GEMINI_API_KEY`.
5. Start the app:
```
   npm run dev
```

**Security note:** never commit `.env.local` or share your API key. It is listed in `.gitignore`.

Setup instructions for the `MediGuardAPI` backend will be added as it is documented.

## Roadmap

- [ ] Finish and test core medicine management
- [ ] Finish and test reminders
- [ ] Add screenshots to this README
- [ ] Add automated tests
- [ ] Review security of API key handling and Firestore rules
- [ ] Deploy a public demo

## Important note

MediGuard is a reminder and organising tool only. It is **not a medical device**. It does not diagnose illness, recommend treatment, or replace professional medical advice. Always follow your doctor's instructions.

## How this project was built

This project was built with AI assistance (Google AI Studio, ChatGPT, Claude, GitHub Copilot). I am a student learning by reading, testing, debugging and modifying the code, and I am working on understanding each part in depth.

## Author

Ram — B.Tech AI Engineering student, Parul University, Vadodara.
