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
 * During the setup process, we don't want to repeatedly ask IDS
 * for a new token or re-fetch locations every time the user clicks
 * "Next".
 *
 * Instead, we create a session once and remember everything the
 * workflow needs until setup is complete.
 *
 * Responsibilities:
 * -----------------
 * ✔ Create sessions
 * ✔ Retrieve sessions
 * ✔ Update sessions
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
 * Fields that may be changed after a session has been created.
 *
 * sessionId and createdAt are intentionally excluded because they identify
 * when and how the session was originally created and should remain stable.
 */
type SetupSessionUpdates = Partial<
  Omit<SetupSession, "sessionId" | "createdAt">
>;

/**
 * The in-memory session store.
 *
 * Key:
 *   sessionId
 *
 * Value:
 *   SetupSession
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
 * The store owns session creation, including generating the session ID
 * and recording when the session was created.
 */
export function createSession(sessionData: CreateSetupSession): SetupSession {
  const sessionId = randomUUID();

  const session: SetupSession = {
    sessionId,
    createdAt: new Date(),
    generatedPassword: null,
    ...sessionData,
  };

  sessions.set(sessionId, session);

  return session;
}

/**
 * Retrieves a previously created session.
 *
 * Throws an AppError if the session does not exist. This prevents the
 * workflow from continuing with an invalid or expired session.
 */
export function getSession(sessionId: string): SetupSession {
  const session = sessions.get(sessionId);

  if (!session) {
    throw new AppError(404, "Setup session not found.");
  }

  return session;
}

/**
 * Updates an existing setup session.
 *
 * The workflow layer decides which values should change. The store is only
 * responsible for retrieving the current session, applying the updates,
 * and saving the updated session.
 *
 * Immutable session fields such as sessionId and createdAt cannot be changed
 * through this function.
 */
export function updateSession(
  sessionId: string,
  updates: SetupSessionUpdates,
): SetupSession {
  const currentSession = getSession(sessionId);

  const updatedSession: SetupSession = {
    ...currentSession,
    ...updates,
  };

  sessions.set(sessionId, updatedSession);

  return updatedSession;
}

/**
 * Deletes a completed or abandoned setup session.
 *
 * Once setup is complete, we no longer need to keep sensitive information
 * such as the IDS access token or generated password in memory.
 */
export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}
