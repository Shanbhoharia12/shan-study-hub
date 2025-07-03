import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const semesters = pgTable("semesters", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  subjectCount: integer("subject_count").default(0),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  semesterId: integer("semester_id").notNull(),
  description: text("description"),
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'notes', 'practical', 'assignment'
  subjectId: integer("subject_id").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: text("file_size"),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const examPapers = pgTable("exam_papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'internal', 'university'
  subjectId: integer("subject_id"),
  semesterId: integer("semester_id"),
  year: integer("year").notNull(),
  examDate: text("exam_date"),
  duration: text("duration"),
  marks: text("marks"),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertSemesterSchema = createInsertSchema(semesters).omit({
  id: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  uploadedAt: true,
});

export const insertExamPaperSchema = createInsertSchema(examPapers).omit({
  id: true,
  uploadedAt: true,
});

export type Semester = typeof semesters.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type ExamPaper = typeof examPapers.$inferSelect;

export type InsertSemester = z.infer<typeof insertSemesterSchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type InsertExamPaper = z.infer<typeof insertExamPaperSchema>;
