import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // After build, __dirname is 'dist/' and vite outputs to 'dist/' as well
  // So the static files are in the same directory as the server bundle
  const distPath = path.resolve(__dirname);
  if (!fs.existsSync(path.join(distPath, "index.html"))) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
