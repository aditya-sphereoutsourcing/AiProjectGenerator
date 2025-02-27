import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertFileSchema, insertLogSchema } from "@shared/schema";
import { chatCompletion } from "./openrouter";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Messages
  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const result = insertMessageSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }
    const message = await storage.addMessage(result.data);
    res.json(message);
  });

  // Files
  app.get("/api/files", async (_req, res) => {
    const files = await storage.getFiles();
    res.json(files);
  });

  app.post("/api/files", async (req, res) => {
    const result = insertFileSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }
    const file = await storage.addFile(result.data);
    res.json(file);
  });

  app.get("/api/files/:path", async (req, res) => {
    const file = await storage.getFileByPath(req.params.path);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    res.json(file);
  });

  // Logs
  app.get("/api/logs", async (_req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  app.post("/api/logs", async (req, res) => {
    const result = insertLogSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }
    const log = await storage.addLog(result.data);
    res.json(log);
  });

  // OpenRouter API chat completion endpoint
  app.post("/api/chat/completions", async (req, res) => {
    try {
      const { messages, model, apiKey } = req.body;
      
      if (!messages || !model) {
        return res.status(400).json({ error: "Missing required parameters: messages or model" });
      }
      
      const completion = await chatCompletion(messages, model, apiKey);
      res.json({ completion });
    } catch (error) {
      console.error("Chat completion error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error during chat completion" 
      });
    }
  });

  return httpServer;
}
