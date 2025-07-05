import { type Express } from "express";
import { createServer } from "http";
import { db } from "./db";
import { materials as materialsTable, examPapers as examPapersTable, semesters as semestersTable, subjects as subjectsTable } from "../shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";
import { insertSemesterSchema, insertSubjectSchema, insertMaterialSchema, insertExamPaperSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Health check endpoint for Render
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  // Semesters routes
  app.get("/api/semesters", async (req, res) => {
    try {
      const semesters = await db.select().from(semestersTable);
      res.json(semesters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch semesters" });
    }
  });

  app.get("/api/semesters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const semester = await db.select().from(semestersTable).where(eq(semestersTable.id, id));
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
      const subjects = await db.select().from(subjectsTable).where(eq(subjectsTable.semesterId, semesterId));
      
      // Add material counts for each subject
      const subjectsWithCounts = await Promise.all(
        subjects.map(async (subject) => {
          const notes = await db.select().from(materialsTable).where(eq(materialsTable.subjectId, subject.id));
          const practicals = await db.select().from(materialsTable).where(eq(materialsTable.subjectId, subject.id));
          const assignments = await db.select().from(materialsTable).where(eq(materialsTable.subjectId, subject.id));
          
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
      const subject = await db.select().from(subjectsTable).where(eq(subjectsTable.id, id));
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
      const materials = await db.select().from(materialsTable).where(eq(materialsTable.subjectId, subjectId));
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch materials" });
    }
  });

  app.get("/api/materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const material = await db.select().from(materialsTable).where(eq(materialsTable.id, id));
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
        papers = await db.select().from(examPapersTable).where(eq(examPapersTable.subjectId, subjectId));
      } else {
        papers = await db.select().from(examPapersTable).where(eq(examPapersTable.subjectId, subjectId));
      }
      
      res.json(papers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exam papers" });
    }
  });

  app.get("/api/exam-papers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const paper = await db.select().from(examPapersTable).where(eq(examPapersTable.id, id));
      if (!paper) {
        return res.status(404).json({ error: "Exam paper not found" });
      }
      res.json(paper);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exam paper" });
    }
  });

  // New semester-based exam paper route
  app.get("/api/semesters/:semesterId/exam-papers", async (req, res) => {
    try {
      const semesterId = parseInt(req.params.semesterId);
      const type = req.query.type as string;
      const year = parseInt(req.query.year as string);
      
      const papers = await db.select().from(examPapersTable).where(eq(examPapersTable.semesterId, semesterId));
      res.json(papers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch semester exam papers" });
    }
  });

  // POST routes for creating content
  app.post("/api/semesters", async (req, res) => {
    try {
      const result = insertSemesterSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid semester data" });
      }
      const semester = await db.insert(semestersTable).values(result.data).returning();
      res.status(201).json(semester);
    } catch (error) {
      res.status(500).json({ error: "Failed to create semester" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const result = insertSubjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid subject data" });
      }
      const subject = await db.insert(subjectsTable).values(result.data).returning();
      res.status(201).json(subject);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subject" });
    }
  });

  app.post("/api/materials", async (req, res) => {
    try {
      const result = insertMaterialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid material data" });
      }
      const material = await db.insert(materialsTable).values(result.data).returning();
      res.status(201).json(material);
    } catch (error) {
      res.status(500).json({ error: "Failed to create material" });
    }
  });

  app.post("/api/exam-papers", async (req, res) => {
    try {
      const result = insertExamPaperSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid exam paper data" });
      }
      const examPaper = await db.insert(examPapersTable).values(result.data).returning();
      res.status(201).json(examPaper);
    } catch (error) {
      res.status(500).json({ error: "Failed to create exam paper" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        return res.json([]);
      }
      
      const results = await db.select().from(materialsTable).where(eq(materialsTable.title, query.trim()));
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
      const papers = await db.select().from(examPapersTable).where(eq(examPapersTable.subjectId, subjectId));
      
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

  return server;
}
