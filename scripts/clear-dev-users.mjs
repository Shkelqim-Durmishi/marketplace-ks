import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data/dev.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'BUYER',
    passwordHash TEXT NOT NULL,
    emailVerifiedAt TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    tokenHash TEXT NOT NULL UNIQUE,
    expiresAt TEXT NOT NULL,
    usedAt TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    tokenHash TEXT NOT NULL UNIQUE,
    expiresAt TEXT NOT NULL,
    usedAt TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const before = {
  users: db.prepare("SELECT COUNT(*) AS count FROM users").get().count,
  resetTokens: db.prepare("SELECT COUNT(*) AS count FROM password_reset_tokens").get().count,
  emailTokens: db.prepare("SELECT COUNT(*) AS count FROM email_verification_tokens").get().count,
};

db.prepare("DELETE FROM password_reset_tokens").run();
db.prepare("DELETE FROM email_verification_tokens").run();
db.prepare("DELETE FROM users").run();

const after = {
  users: db.prepare("SELECT COUNT(*) AS count FROM users").get().count,
  resetTokens: db.prepare("SELECT COUNT(*) AS count FROM password_reset_tokens").get().count,
  emailTokens: db.prepare("SELECT COUNT(*) AS count FROM email_verification_tokens").get().count,
};

console.log(JSON.stringify({ before, after }, null, 2));
