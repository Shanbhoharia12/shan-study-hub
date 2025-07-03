import { 
  type Semester, 
  type Subject, 
  type Material, 
  type ExamPaper,
  type InsertSemester,
  type InsertSubject,
  type InsertMaterial,
  type InsertExamPaper
} from "@shared/schema";

export interface IStorage {
  // Semesters
  getSemesters(): Promise<Semester[]>;
  getSemester(id: number): Promise<Semester | undefined>;
  createSemester(semester: InsertSemester): Promise<Semester>;

  // Subjects
  getSubjectsBySemester(semesterId: number): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Materials
  getMaterialsBySubject(subjectId: number, type?: string): Promise<Material[]>;
  getMaterial(id: number): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;

  // Exam Papers
  getExamPapersBySubject(subjectId: number, type?: string): Promise<ExamPaper[]>;
  getExamPapersByYear(subjectId: number, type: string, year: number): Promise<ExamPaper[]>;
  getExamPaper(id: number): Promise<ExamPaper | undefined>;
  createExamPaper(examPaper: InsertExamPaper): Promise<ExamPaper>;

  // Search
  searchMaterials(query: string): Promise<(Material & { subject: Subject; semester: Semester })[]>;
}

export class MemStorage implements IStorage {
  private semesters: Map<number, Semester>;
  private subjects: Map<number, Subject>;
  private materials: Map<number, Material>;
  private examPapers: Map<number, ExamPaper>;
  private semesterIdCounter: number;
  private subjectIdCounter: number;
  private materialIdCounter: number;
  private examPaperIdCounter: number;

  constructor() {
    this.semesters = new Map();
    this.subjects = new Map();
    this.materials = new Map();
    this.examPapers = new Map();
    this.semesterIdCounter = 1;
    this.subjectIdCounter = 1;
    this.materialIdCounter = 1;
    this.examPaperIdCounter = 1;

    this.initializeData();
  }

  private initializeData() {
    // Initialize semesters
    for (let i = 1; i <= 8; i++) {
      const semester: Semester = {
        id: i,
        number: i,
        name: `${i}${this.getOrdinalSuffix(i)} Semester`,
        description: `Core Computer Science subjects`,
        subjectCount: Math.floor(Math.random() * 3) + 6, // 6-8 subjects
      };
      this.semesters.set(i, semester);
    }
    this.semesterIdCounter = 9;

    // Initialize sample subjects for 3rd semester
    const sampleSubjects = [
      { name: "Data Structures & Algorithms", code: "CS301", semesterId: 3 },
      { name: "Database Management Systems", code: "CS302", semesterId: 3 },
      { name: "Computer Networks", code: "CS303", semesterId: 3 },
      { name: "Operating Systems", code: "CS304", semesterId: 3 },
      { name: "Software Engineering", code: "CS305", semesterId: 3 },
    ];

    sampleSubjects.forEach((subjectData) => {
      const subject: Subject = {
        id: this.subjectIdCounter++,
        ...subjectData,
        description: `Core subject for ${subjectData.name}`,
      };
      this.subjects.set(subject.id, subject);

      // Add sample materials for each subject
      this.addSampleMaterials(subject.id);
      this.addSampleExamPapers(subject.id);
    });
  }

  private addSampleMaterials(subjectId: number) {
    const materialTypes = ["notes", "practical", "assignment"];
    const sampleTitles = {
      notes: ["Introduction Notes", "Chapter 1-5", "Complete Reference Guide", "Quick Revision Notes"],
      practical: ["Lab Manual", "Practical Exercises", "Programming Examples", "Lab Solutions"],
      assignment: ["Assignment 1", "Assignment 2", "Mini Project", "Final Assignment"]
    };

    materialTypes.forEach((type) => {
      sampleTitles[type as keyof typeof sampleTitles].forEach((title) => {
        const material: Material = {
          id: this.materialIdCounter++,
          title,
          type,
          subjectId,
          fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
          filePath: `/materials/${subjectId}/${type}/${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          uploadedAt: new Date(),
        };
        this.materials.set(material.id, material);
      });
    });
  }

  private addSampleExamPapers(subjectId: number) {
    const examTypes = ["internal", "university"];
    const years = [2021, 2022, 2023, 2024];

    examTypes.forEach((type) => {
      years.forEach((year) => {
        for (let i = 1; i <= Math.floor(Math.random() * 3) + 1; i++) {
          const paper: ExamPaper = {
            id: this.examPaperIdCounter++,
            title: type === "internal" ? `Internal Exam ${i}` : `University Exam ${i}`,
            type,
            subjectId,
            year,
            examDate: `${type === "internal" ? "March" : "May"} ${year}`,
            duration: type === "internal" ? "2 Hours" : "3 Hours",
            marks: type === "internal" ? "50" : "100",
            fileName: `${type}_exam_${year}_${i}.pdf`,
            filePath: `/papers/${subjectId}/${type}/${year}/${type}_exam_${year}_${i}.pdf`,
            uploadedAt: new Date(),
          };
          this.examPapers.set(paper.id, paper);
        }
      });
    });
  }

  private getOrdinalSuffix(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  async getSemesters(): Promise<Semester[]> {
    return Array.from(this.semesters.values()).sort((a, b) => a.number - b.number);
  }

  async getSemester(id: number): Promise<Semester | undefined> {
    return this.semesters.get(id);
  }

  async createSemester(semester: InsertSemester): Promise<Semester> {
    const id = this.semesterIdCounter++;
    const newSemester: Semester = { ...semester, id };
    this.semesters.set(id, newSemester);
    return newSemester;
  }

  async getSubjectsBySemester(semesterId: number): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(
      (subject) => subject.semesterId === semesterId
    );
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const id = this.subjectIdCounter++;
    const newSubject: Subject = { ...subject, id };
    this.subjects.set(id, newSubject);
    return newSubject;
  }

  async getMaterialsBySubject(subjectId: number, type?: string): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(
      (material) => 
        material.subjectId === subjectId && 
        (!type || material.type === type)
    );
  }

  async getMaterial(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async createMaterial(material: InsertMaterial): Promise<Material> {
    const id = this.materialIdCounter++;
    const newMaterial: Material = { 
      ...material, 
      id, 
      uploadedAt: new Date() 
    };
    this.materials.set(id, newMaterial);
    return newMaterial;
  }

  async getExamPapersBySubject(subjectId: number, type?: string): Promise<ExamPaper[]> {
    return Array.from(this.examPapers.values()).filter(
      (paper) => 
        paper.subjectId === subjectId && 
        (!type || paper.type === type)
    );
  }

  async getExamPapersByYear(subjectId: number, type: string, year: number): Promise<ExamPaper[]> {
    return Array.from(this.examPapers.values()).filter(
      (paper) => 
        paper.subjectId === subjectId && 
        paper.type === type && 
        paper.year === year
    );
  }

  async getExamPaper(id: number): Promise<ExamPaper | undefined> {
    return this.examPapers.get(id);
  }

  async createExamPaper(examPaper: InsertExamPaper): Promise<ExamPaper> {
    const id = this.examPaperIdCounter++;
    const newExamPaper: ExamPaper = { 
      ...examPaper, 
      id, 
      uploadedAt: new Date() 
    };
    this.examPapers.set(id, newExamPaper);
    return newExamPaper;
  }

  async searchMaterials(query: string): Promise<(Material & { subject: Subject; semester: Semester })[]> {
    const results: (Material & { subject: Subject; semester: Semester })[] = [];
    const lowercaseQuery = query.toLowerCase();

    for (const material of this.materials.values()) {
      const subject = this.subjects.get(material.subjectId);
      const semester = subject ? this.semesters.get(subject.semesterId) : undefined;

      if (subject && semester) {
        const searchableText = [
          material.title,
          material.type,
          subject.name,
          subject.code,
          semester.name
        ].join(' ').toLowerCase();

        if (searchableText.includes(lowercaseQuery)) {
          results.push({ ...material, subject, semester });
        }
      }
    }

    return results;
  }
}

export const storage = new MemStorage();
