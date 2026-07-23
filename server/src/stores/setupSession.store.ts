import { randomUUID } from "crypto";

import { AppError } from "../errors/AppError.js";

import type { CreateSetupSession, SetupSession } from "../types/setup.types.js";

/**
 * ------------------------------------------------------------------
 * Setup Session Store
 * ------------------------------------------------------------------
 *
 * Purpose:
 * --------
 * This file is responsible for storing the temporary state of an
 * IDS Setup Wizard session.
 *
 * Think of this as the application's short-term memory.
 *
 * During the setup process we don't want to repeatedly ask IDS
 * for a new token or re-fetch locations every time the user clicks
 * "Next".
 *
 * Instead we create a session once and remember everything the
 * workflow needs until setup is complete.
 *
 * Responsibilities:
 * -----------------
 * ✔ Create sessions
 * ✔ Retrieve sessions
 * ✔ Update sessions (later)
 * ✔ Delete sessions
 *
 * This file DOES NOT:
 * -------------------
 * ✘ Call IDS
 * ✘ Know anything about Express
 * ✘ Know anything about React
 * ✘ Contain business logic
 *
 * It only knows how to store and retrieve session data.
 */

/**
 * The in-memory session store.
 *
 * Think of a Map like a dictionary.
 *
 * Key:
 *   sessionId
 *
 * Value:
 *   SetupSession
 *
 * Example:
 *
 * "abc123"
 *      ↓
 * {
 *    dealershipName: "...",
 *    accessToken: "...",
 *    locations: [...]
 * }
 *
 * NOTE:
 * -----
 * Because this lives in memory:
 *
 * - restarting the server clears all sessions
 * - sessions are temporary
 *
 * This is acceptable for the MVP.
 */
const sessions = new Map<string, SetupSession>();

/**
 * Creates a brand-new setup session.
 *
 * Why generate the session ID here?
 *
 * Because the store owns session creation.
 * Nobody else should need to know HOW session IDs
 * are created.
 */
export function createSession(sessionData: CreateSetupSession): SetupSession {
  // Generate a unique session identifier.
  const sessionId = randomUUID();

  // Build the complete session object.
  const session: SetupSession = {
    sessionId,
    createdAt: new Date(),
    ...sessionData,
  };

  // Store it in memory.
  sessions.set(sessionId, session);

  return session;
}

/**
 * Retrieves a previously created session.
 *
 * Throws an AppError if the session does not exist.
 *
 * This prevents the workflow from continuing with an
 * invalid or expired session.
 */
export function getSession(sessionId: string): SetupSession {
  const session = sessions.get(sessionId);

  if (!session) {
    throw new AppError(404, "Setup session not found.");
  }

  return session;
}

/**
 * Deletes a completed or abandoned setup session.
 *
 * Once setup is complete we no longer need to keep
 * sensitive information such as the access token in memory.
 */
export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}
