import type { Express } from "express";
import { type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// Start the backend server on port 3002
function startBackend() {
  // In production (dist/index.cjs), backend is at dist/backend/server.js
  // In development, backend is at backend/server.js
  let backendPath = path.resolve(process.cwd(), "backend/server.js");
  
  // Check if running from dist folder (production)
  if (!fs.existsSync(backendPath)) {
    backendPath = path.resolve(__dirname, "backend/server.js");
  }
  
  console.log("Starting backend server from:", backendPath);
  
  const backend = spawn("node", [backendPath], {
    stdio: "inherit",
    env: { ...process.env, PORT: "3002" },
  });
  
  backend.on("error", (err) => {
    console.error("Failed to start backend:", err);
  });
  
  backend.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Backend exited with code ${code}`);
    }
  });
  
  return backend;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Start the backend server
  startBackend();
  
  // Wait a moment for the backend to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Proxy all /api requests to the Flipr backend on port 3002
  // Using filter function to match /api/* paths and forward them with the /api prefix intact
  app.use(
    createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: true,
      pathFilter: '/api/**',
    })
  );

  // Proxy /uploads requests to the backend for serving uploaded files
  app.use(
    "/uploads",
    createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: true,
    })
  );

  // Proxy /health requests to the backend
  app.use(
    "/health",
    createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: true,
    })
  );

  return httpServer;
}
