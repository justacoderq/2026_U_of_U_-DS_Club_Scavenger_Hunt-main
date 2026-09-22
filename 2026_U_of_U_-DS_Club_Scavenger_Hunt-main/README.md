# DATA SCIENCE CLUB SCAVENGER HUNT WEB APP

**University of Utah — The Data Science Club**
**Authors:** Janne Wald and James Crawford, 2025

---

## Overview

This project is a **browser-based scavenger hunt** built for The Data Science Club’s annual campus event.
Players scan **QR codes** to progress through stages, solving clues that test reasoning and observation skills.
The 2025 rebuild introduces a **secure, token-based architecture** with a Node.js backend that hides route structures and logs team progress and completion times.

**Key Features**

* 3 distinct routes, each with 5 stages
* Secure QR codes (`/qr/<random-token>`) prevent URL guessing
* Node.js + Express backend with JSON-based clue storage
* Frontend hosted statically on the same server
* Automatic progress logging and finish-time calculation
* Clean, mobile-responsive design

---

## Front End

### Technologies

* **HTML5 / CSS3 / Vanilla JavaScript**
* Responsive design for phones and tablets
* Single universal clue page (`stage.html`) dynamically loads clues via tokens

### Files & Behavior

* **index.html**

  * Landing page where teams enter their name, contact info, and select a route.
  * Calls `/api/start?route=<route>` to request the first token.
  * Redirects players to `/qr/<token>` to begin.

* **stage.html**

  * Displays the current clue fetched via `/api/clue/:token`.
  * Validates typed answers locally using the provided keywords.
  * On success, posts to `/api/complete` and receives the next token or finish signal.

* **finish.html**

  * Displays the team’s total completion time (calculated from local start time).

* **app.js**

  * Handles route selection and team setup logic.
  * Requests the first token from the backend and redirects to the secure URL.

* **validator.js**

  * Fetches clues and validates answers dynamically by token.
  * Reports completions to the backend for time logging.

* **style.css**

  * Provides consistent header, form, and responsive layout styling.

---

## Back End

### Technologies

* **Node.js (Express)** hosted on **Render**
* Serves both static frontend files and backend API endpoints

### Core Endpoints

| Route                      | Method | Description                                             |
| -------------------------- | ------ | ------------------------------------------------------- |
| `/qr/:token`               | GET    | Serves `stage.html` for a given QR token                |
| `/api/start?route=<route>` | GET    | Returns the first token for a selected route            |
| `/api/clue/:token`         | GET    | Returns the clue, keywords, and metadata for that token |
| `/api/complete`            | POST   | Records team completion and returns the next token      |
| `/finish.html`             | GET    | Static finish page                                      |

### Data Files

* **tokenMap.json** — Maps random tokens → routes, stages, clues, and keywords.
* **processLog.json** — Records timestamps and team progress.
* **server.js** — Main Node server serving both static frontend and APIs.

### Deployment

* Hosted on **Render** ($5/month Node plan).
* Automatically redeploys on Git commits.
* Single domain (e.g., `https://hunt.dsclub.utah.edu`) serves both frontend and backend.

---

## Repository Structure

```
DSClub_Scavenger_Hunt/
│
├── public/                     # Frontend static assets
│   ├── index.html              # Landing/setup page
│   ├── stage.html              # Universal clue page
│   ├── finish.html             # Completion page
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js              # Team setup + route selection
│   │   ├── validator.js        # Token-based clue handling
│   │   └── routes.js           # (Optional) reference clue data
│   └── assets/
│       └── images/             # Logos and visual assets
│
├── Server/
│   ├── server.js               # Express Backend Head
|   ├── controllers/
|   |   ├── api.js              # Express router for /api endpoint
|   |   └── qr.js               # Express router for /qr endpoint
|   ├── utils
|   |   ├── config.js           # Server config exporter
|   |   └── logger.js           # process logger helper
|   |   
│   ├── tokenMap.json           # Randomized clue token map
│   ├── puzzles.json            # Puzzles organized as {question, answer, hint, route, stage} (could prob structure this file diff, change as you see fit)
│   ├── processLog.json         # Auto-generated event log
│   ├── package.json            # Node dependencies and scripts
│   └── README.md               # Backend setup guide
│
├── .gitignore
├── LICENSE
└── README.txt                  # This document
```

---

## Summary

The 2025 rebuild provides a **fully integrated frontend and backend system** for the Data Science Club’s scavenger hunt.
Participants experience a seamless, secure progression through clues, while organizers gain reliable timing and progress tracking.
This architecture allows for easy scaling, new route additions, and live event analytics.

---
