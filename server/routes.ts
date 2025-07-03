import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubjectSchema, insertMaterialSchema, insertExamPaperSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Semesters routes
  app.get("/api/semesters", async (req, res) => {
    try {
      const semesters = await storage.getSemesters();
      res.json(semesters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch semesters" });
    }
  });

  app.get("/api/semesters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const semester = await storage.getSemester(id);
      if (!semester) {
        return res.status(404).json({ error: "Semester not found" });
      }
      res.json(semester);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch semester" });
    }
  });

  // Subjects routes
  app.get("/api/semesters/:semesterId/subjects", async (req, res) => {
    try {
      const semesterId = parseInt(req.params.semesterId);
      const subjects = await storage.getSubjectsBySemester(semesterId);
      
      // Add material counts for each subject
      const subjectsWithCounts = await Promise.all(
        subjects.map(async (subject) => {
          const notes = await storage.getMaterialsBySubject(subject.id, "notes");
          const practicals = await storage.getMaterialsBySubject(subject.id, "practical");
          const assignments = await storage.getMaterialsBySubject(subject.id, "assignment");
          
          return {
            ...subject,
            notesCount: notes.length,
            practicalsCount: practicals.length,
            assignmentsCount: assignments.length,
          };
        })
      );
      
      res.json(subjectsWithCounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  app.get("/api/subjects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subject = await storage.getSubject(id);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.json(subject);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subject" });
    }
  });

  // Materials routes
  app.get("/api/subjects/:subjectId/materials", async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const type = req.query.type as string;
      const materials = await storage.getMaterialsBySubject(subjectId, type);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch materials" });
    }
  });

  app.get("/api/materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const material = await storage.getMaterial(id);
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch material" });
    }
  });

  // Exam papers routes
  app.get("/api/subjects/:subjectId/exam-papers", async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const type = req.query.type as string;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      
      let papers;
      if (year && type) {
        papers = await storage.getExamPapersByYear(subjectId, type, year);
      } else {
        papers = await storage.getExamPapersBySubject(subjectId, type);
      }
      
      res.json(papers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exam papers" });
    }
  });

  app.get("/api/exam-papers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const paper = await storage.getExamPaper(id);
      if (!paper) {
        return res.status(404).json({ error: "Exam paper not found" });
      }
      res.json(paper);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exam paper" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        return res.json([]);
      }
      
      const results = await storage.searchMaterials(query.trim());
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Get available years for exam papers
  app.get("/api/subjects/:subjectId/exam-years", async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const type = req.query.type as string;
      const papers = await storage.getExamPapersBySubject(subjectId, type);
      
      const yearCounts = papers.reduce((acc, paper) => {
        acc[paper.year] = (acc[paper.year] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const years = Object.entries(yearCounts)
        .map(([year, count]) => ({ year: parseInt(year), paperCount: count }))
        .sort((a, b) => b.year - a.year);
      
      res.json(years);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exam years" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
