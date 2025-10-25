import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userPreferenceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all courses
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  // Get single course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Get matched courses based on user preferences
  app.get("/api/matches", async (req, res) => {
    try {
      const { neurotype, preferences, topics, accessibility } = req.query;

      if (!neurotype || !preferences || !topics) {
        return res.status(400).json({ 
          error: "Missing required parameters: neurotype, preferences, topics" 
        });
      }

      const userPreference = {
        neurotype,
        learningPreferences: JSON.parse(preferences as string),
        topics: JSON.parse(topics as string),
        accessibilityNeeds: accessibility ? JSON.parse(accessibility as string) : []
      };

      // Validate with Zod schema
      const validatedPreference = userPreferenceSchema.parse(userPreference);

      const matches = await storage.getMatchedCourses(validatedPreference);
      res.json(matches);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to get course matches" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
