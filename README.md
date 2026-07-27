# IDS Setup Wizard

A full-stack React and Express application that automates dealership onboarding to the IDS (Integrated Dealer Systems) inventory feed.

The wizard authenticates with the IDS API, retrieves dealership locations, identifies the primary location, and generates the credentials required to configure an iCC inventory feed—all through a guided, step-by-step interface.

> **Inspired by a real internal support workflow.** This project recreates and improves a process that was previously performed manually using Postman and internal documentation.

---

## Screenshots

> _Coming soon_

- Dealer Information
- Dealer Location Selection
- Feed Credential Generation

---

## The Problem

Before this application, onboarding a dealership to the iCC inventory feed required support engineers to manually work through several IDS API requests in Postman:

- Authenticate with the IDS API
- Retrieve dealership locations
- Identify the primary (master) location
- Generate feed credentials
- Copy the required values into iCC

The workflow was repetitive, error-prone, and required significant internal knowledge. It wasn't something that could easily be handed to another team member without additional guidance.

This application replaces that manual process with a guided setup wizard. The user simply enters the dealership name and IDS Client ID, and the application handles authentication, location discovery, and credential generation behind the scenes.

---

## Features

- Guided multi-step onboarding wizard
- Secure IDS API authentication
- Automatic dealership location retrieval
- Primary (master) location detection
- Backend-only token storage
- Shared TypeScript API contracts between frontend and backend
- Centralized error handling
- Feed credential generation
- Clear separation of business logic from API communication

---

## Architecture

The project is organized into three applications that share a single API contract.

```text
├── client/                 React + TypeScript (Vite)
├── server/                 Express + TypeScript
└── shared/
    └── types/              Shared request/response contracts
```

Sharing types between the frontend and backend ensures the API contract is defined once and enforced everywhere it's used. If a request or response changes, TypeScript immediately identifies every affected location across the application.

---

## Request Flow

```text
User enters dealership name + Client ID
                │
                ▼
      POST /api/setup/start
                │
                ▼
        Setup Controller
                │
                ▼
     Setup Workflow Service
        (business orchestration)
                │
                ▼
         IDS Service Layer
     (external IDS API only)
                │
                ▼
Authenticate
Retrieve dealer locations
Identify primary location
                │
                ▼
Create temporary setup session
                │
                ▼
Return safe session data
(no Client ID or access token)
```

---

## Layer Responsibilities

### Routes

Define API endpoints and delegate requests to controllers.

### Controllers

Validate incoming requests, invoke the appropriate workflow, and shape API responses.

### Workflow Services

Coordinate the business process without depending on Express, React, or external APIs.

### IDS Service

The only layer responsible for communicating with the external IDS API.

### Store

Maintains temporary setup session state.

### Error Handler

Converts every application error into a consistent response format for the frontend.

---

## Key Technical Decisions

### Access tokens never leave the backend

The workflow authenticates with IDS and stores the access token in the backend session. The frontend only receives the information it needs to continue the setup process.

### Preserve external API errors

Rather than replacing IDS errors with generic messages, the application preserves the original response body. Since support engineers are already familiar with IDS API responses from Postman, exposing those details makes troubleshooting significantly easier.

### Centralized application errors

A custom `AppError` class separates expected application failures (authentication failures, invalid input, missing primary location) from unexpected runtime errors. Every failure returns a consistent response structure.

### Shared API contracts

Frontend and backend both consume the same TypeScript interfaces, ensuring request and response objects remain synchronized throughout development.

### Wizard state is encapsulated

The entire setup workflow is managed through a dedicated `useSetupWizard` hook. Individual components cannot arbitrarily change steps, making navigation predictable and easier to maintain.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript

### Shared

- TypeScript shared interfaces
- Shared API contracts

---

## Getting Started

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

An IDS Client ID is required to complete the onboarding workflow end-to-end.

---

## Wizard Flow

### 1. Dealer Information

Enter the dealership name and IDS Client ID.

### 2. Dealer Locations

Retrieve dealership locations from IDS and confirm the primary location.

### 3. iCC Feed Setup

Generate (or regenerate) the credentials required for the iCC inventory feed.

---

## Roadmap

- [ ] Replace in-memory session storage with persistent storage
- [ ] Complete feed creation workflow
- [ ] Add automated unit and integration tests
- [ ] Implement subscription creation
- [ ] Implement subscription verification
- [ ] Containerize the application with Docker

---

## Lessons Learned

Building this project reinforced several software engineering principles:

- Keep business logic independent of web frameworks.
- Share API contracts between frontend and backend whenever possible.
- Never expose authentication credentials to the client.
- Preserve useful third-party API responses instead of masking them.
- Design services around a single responsibility.

---

## Status

🚧 **Actively in development**

This project was inspired by a real workflow I performed as a Technical Support Specialist. The production process required multiple manual API calls through Postman to onboard dealerships.

The goal of this project is not only to automate that workflow, but also to demonstrate software engineering practices including layered architecture, shared API contracts, centralized error handling, and secure backend design.
