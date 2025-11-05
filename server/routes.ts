import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocket } from "./websocket";
import { answerProcessQuestion } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // OpenAI chat endpoint for voice interactions
  app.post("/api/chat", async (req, res) => {
    try {
      const { processContext, question } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const answer = await answerProcessQuestion(processContext || "", question);
      res.json({ answer });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  
  setupWebSocket(httpServer);

  return httpServer;
}
