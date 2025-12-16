//This file defines a global typed cache for the Mongoose connection and connection promise 
// to prevent multiple database connections in serverless or hot-reloaded environments like Next.js.

import { Connection } from "mongoose";

declare global {
  var mongoose: {
    // either Connection or null if not connected or promise if connecting
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// This file is intentionally left blank to define global types for the project
export {};
