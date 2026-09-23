import "server-only";
import { neon } from "@neondatabase/serverless";

// Connect lazily so builds do not need database credentials.
export function getSql() {
  const connectionString = process.env.PG_URI;
  if (!connectionString) throw new Error("PG_URI is not configured.");
  try {
    return neon(connectionString);
  } catch {
    // The driver can include the supplied URL in configuration errors.
    throw new Error("PG_URI must be a valid PostgreSQL connection string.");
  }
}
