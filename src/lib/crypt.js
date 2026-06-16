// Secure password hashing using Web Crypto API (SHA-256)
// Edge-compatible - no Node.js crypto dependency required

/**
 * Hash a password using SHA-256 with a salt.
 * Uses the Web Crypto API which is available in both Node.js and Edge runtimes.
 * @param {string} password - The plaintext password
 * @param {string} [salt] - Optional salt. Auto-generated if not provided.
 * @returns {Promise<{ hash: string, salt: string }>} The hex-encoded hash and salt
 */
export async function hashPassword(password, salt) {
  // Generate a random salt if not provided
  if (!salt) {
    const saltArray = new Uint8Array(16);
    crypto.getRandomValues(saltArray);
    salt = Array.from(saltArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return { hash, salt };
}

/**
 * Verify a password against a stored hash+salt pair.
 * @param {string} password - The plaintext password to check
 * @param {string} storedHash - The stored SHA-256 hex hash
 * @param {string} storedSalt - The stored salt used during hashing
 * @returns {Promise<boolean>} True if the password matches
 */
export async function verifyPassword(password, storedHash, storedSalt) {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}
