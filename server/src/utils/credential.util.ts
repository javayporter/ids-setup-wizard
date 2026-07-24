import { randomInt } from "node:crypto";

/**
 * Characters allowed in generated iCC feed passwords.
 *
 * The password must be alphanumeric, so symbols are intentionally excluded.
 */
const PASSWORD_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const PASSWORD_LENGTH = 16;

/**
 * Generates a cryptographically secure 16-character alphanumeric password.
 *
 * This function only generates the credential. It does not know anything
 * about setup sessions, IDS, Express, or the frontend.
 */
export function generateCredentialPassword(): string {
  let password = "";

  for (let index = 0; index < PASSWORD_LENGTH; index += 1) {
    const randomIndex = randomInt(PASSWORD_CHARACTERS.length);
    password += PASSWORD_CHARACTERS[randomIndex];
  }

  return password;
}
