import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Only use WebSocket for production (Neon database)
if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = ws;
}

// Local development database URL
const LOCAL_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/study_hub';

// Use local database URL if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL || LOCAL_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });