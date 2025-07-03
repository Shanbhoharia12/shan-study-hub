import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, BookOpen, FileText } from "lucide-react";
import type { Semester, Subject } from "@shared/schema";

// Form schemas
const materialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["notes", "practical", "assignment"]),
  subjectId: z.number(),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.string().optional(),
  filePath: z.string().min(1, "File path is required"),
});

const examPaperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["internal", "university"]),
  subjectId: z.number(),
  year: z.number().min(2020).max(2030),
  examDate: z.string().optional(),
  duration: z.string().optional(),
  marks: z.string().optional(),
  fileName: z.string().min(1, "File name is required"),
  filePath: z.string().min(1, "File path is required"),
});

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  semesterId: z.number(),
  description: z.string().optional(),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("materials");

  // Fetch data
  const { data: semesters = [] } = useQuery<Semester[]>({
    queryKey: ['/api/semesters'],
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['/api/subjects/all'],
    enabled: false, // We'll load subjects by semester
  });

  // Material form
  const materialForm = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: "",
      type: "notes" as const,
      subjectId: 0,
      fileName: "",
      fileSize: "",
      filePath: "",
    },
  });

  // Exam paper form
  const examPaperForm = useForm({
    resolver: zodResolver(examPaperSchema),
    defaultValues: {
      title: "",
      type: "internal" as const,
      subjectId: 0,
      year: new Date().getFullYear(),
      examDate: "",
      duration: "",
      marks: "",
      fileName: "",
      filePath: "",
    },
  });

  // Subject form
  const subjectForm = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      code: "",
      semesterId: 0,
      description: "",
    },
  });

  // Mutations
  const createMaterial = useMutation({
    mutationFn: (data: any) => apiRequest("/api/materials", "POST", data),
    onSuccess: () => {
      toast({ title: "Success", description: "Material uploaded successfully!" });
      materialForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload material", variant: "destructive" });
    },
  });

  const createExamPaper = useMutation({
    mutationFn: (data: any) => apiRequest("/api/exam-papers", "POST", data),
    onSuccess: () => {
      toast({ title: "Success", description: "Exam paper uploaded successfully!" });
      examPaperForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/exam-papers'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload exam paper", variant: "destructive" });
    },
  });

  const createSubject = useMutation({
    mutationFn: (data: any) => apiRequest("/api/subjects", "POST", data),
    onSuccess: () => {
      toast({ title: "Success", description: "Subject created successfully!" });
      subjectForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create subject", variant: "destructive" });
    },
  });

  // Get subjects for selected semester
  const getSubjectsForSemester = (semesterId: number) => {
    // This would need to be implemented to fetch subjects by semester
    return subjects.filter(subject => subject.semesterId === semesterId);
  };

  const onSubmitMaterial = (data: any) => {
    createMaterial.mutate(data);
  };

  const onSubmitExamPaper = (data: any) => {
    createExamPaper.mutate(data);
  };

  const onSubmitSubject = (data: any) => {
    createSubject.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Panel</h1>
          <p className="text-slate-600">Manage study materials and exam papers</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials">Upload Materials</TabsTrigger>
            <TabsTrigger value="exam-papers">Upload Exam Papers</TabsTrigger>
            <TabsTrigger value="subjects">Add Subjects</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Upload Study Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={materialForm.handleSubmit(onSubmitMaterial)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Material Title</Label>
                      <Input 
                        id="title"
                        {...materialForm.register("title")}
                        placeholder="e.g. Chapter 1 Notes"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select onValueChange={(value) => materialForm.setValue("type", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notes">Notes</SelectItem>
                          <SelectItem value="practical">Practical</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="semesterId">Semester</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((semester) => (
                            <SelectItem key={semester.id} value={semester.id.toString()}>
                              {semester.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subjectId">Subject</Label>
                      <Select onValueChange={(value) => materialForm.setValue("subjectId", parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fileName">File Name</Label>
                      <Input 
                        id="fileName"
                        {...materialForm.register("fileName")}
                        placeholder="e.g. chapter1_notes.pdf"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fileSize">File Size</Label>
                      <Input 
                        id="fileSize"
                        {...materialForm.register("fileSize")}
                        placeholder="e.g. 2.5 MB"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="filePath">File Path/URL</Label>
                    <Input 
                      id="filePath"
                      {...materialForm.register("filePath")}
                      placeholder="e.g. /uploads/materials/chapter1_notes.pdf"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createMaterial.isPending}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {createMaterial.isPending ? "Uploading..." : "Upload Material"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam-papers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Upload Exam Paper
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={examPaperForm.handleSubmit(onSubmitExamPaper)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="examTitle">Paper Title</Label>
                      <Input 
                        id="examTitle"
                        {...examPaperForm.register("title")}
                        placeholder="e.g. Internal Exam 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examType">Exam Type</Label>
                      <Select onValueChange={(value) => examPaperForm.setValue("type", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="university">University</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input 
                        id="year"
                        type="number"
                        {...examPaperForm.register("year", { valueAsNumber: true })}
                        min="2020"
                        max="2030"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input 
                        id="duration"
                        {...examPaperForm.register("duration")}
                        placeholder="e.g. 3 Hours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="marks">Max Marks</Label>
                      <Input 
                        id="marks"
                        {...examPaperForm.register("marks")}
                        placeholder="e.g. 100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="examDate">Exam Date</Label>
                    <Input 
                      id="examDate"
                      {...examPaperForm.register("examDate")}
                      placeholder="e.g. May 2024"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="examFileName">File Name</Label>
                      <Input 
                        id="examFileName"
                        {...examPaperForm.register("fileName")}
                        placeholder="e.g. internal_exam_2024.pdf"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examSubjectId">Subject</Label>
                      <Select onValueChange={(value) => examPaperForm.setValue("subjectId", parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="examFilePath">File Path/URL</Label>
                    <Input 
                      id="examFilePath"
                      {...examPaperForm.register("filePath")}
                      placeholder="e.g. /uploads/papers/internal_exam_2024.pdf"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createExamPaper.isPending}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {createExamPaper.isPending ? "Uploading..." : "Upload Exam Paper"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={subjectForm.handleSubmit(onSubmitSubject)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subjectName">Subject Name</Label>
                      <Input 
                        id="subjectName"
                        {...subjectForm.register("name")}
                        placeholder="e.g. Data Structures & Algorithms"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subjectCode">Subject Code</Label>
                      <Input 
                        id="subjectCode"
                        {...subjectForm.register("code")}
                        placeholder="e.g. CS301"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subjectSemesterId">Semester</Label>
                    <Select onValueChange={(value) => subjectForm.setValue("semesterId", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester.id} value={semester.id.toString()}>
                            {semester.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subjectDescription">Description (Optional)</Label>
                    <Textarea 
                      id="subjectDescription"
                      {...subjectForm.register("description")}
                      placeholder="Brief description of the subject"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createSubject.isPending}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {createSubject.isPending ? "Creating..." : "Create Subject"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}