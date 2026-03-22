# Entrenar

A platform for personal trainers and athletes to plan, track, and prepare for endeavours together.

## Features

- **Role-based access**: Trainers manage athletes and create plans; athletes view their assignments and log progress
- **Athlete management**: Trainers can add athletes, track their sport and notes
- **Endeavours**: Goal-oriented events (competitions, races, milestones) with target dates and assigned athletes
- **Training Plans**: Structured plans linked to endeavours and athletes with date ranges
- **Training Sessions**: Detailed session logging with exercises (sets, reps, weight, duration), status tracking, and notes
- **Progress tracking**: Athletes can mark sessions as completed/skipped and add notes

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **SQLite** (via better-sqlite3) for local database
- **bcryptjs** for password hashing

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

1. Register as a **Trainer** first
2. Add athletes from the Athletes page
3. Create an **Endeavour** (the event/goal you're training for)
4. Build **Training Plans** linked to endeavours and athletes
5. Log **Training Sessions** with exercises and track completion
