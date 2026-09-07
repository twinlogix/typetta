// Jest 27's node environment does not expose the WebCrypto global (`crypto`) inside the test sandbox.
// The mongodb driver (>= 7.x) and bson (>= 7.x) rely on it for random bytes (sessions, ObjectId)
// and for SCRAM authentication, so we mirror Node's implementation into the sandbox.
import { webcrypto } from 'crypto'

const g = globalThis as { crypto?: unknown }
if (typeof g.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true, writable: true })
}
