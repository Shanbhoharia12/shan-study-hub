import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Scroll, Calendar, FileText, ChevronLeft, Download } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { PDFModal } from "@/components/pdf-modal";
import { SearchBar } from "@/components/search-bar";
import { Footer } from "@/components/footer";
import type { Semester, ExamPaper } from "@shared/schema";
import type { ExamType } from "@/lib/types";

export default function ExamPapersPage() {
  const { semesterId } = useParams();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const examType = (searchParams.get('type') || 'internal') as ExamType;
  const year = parseInt(searchParams.get('year') || '2024');
  
  const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = parseInt(semesterId || "1");

  const { data: semester, isLoading: semesterLoading } = useQuery<Semester>({
    queryKey: [`/api/semesters/${id}`],
  });

  const { data: papers = [], isLoading: papersLoading } = useQuery<ExamPaper[]>({
    queryKey: [`/api/semesters/${id}/exam-papers`, { type: examType, year: year }],
  });

  const isLoading = semesterLoading || papersLoading;

  const handlePreview = (paper: ExamPaper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaper(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading exam papers...</p>
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Semester Not Found</h2>
          <p className="text-slate-600">The requested semester could not be found.</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: semester.name, href: `/semester/${semester.id}` },
    { label: `${examType === 'internal' ? 'Internal' : 'University'} Exam Papers ${year}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchBar />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
                {examType === 'internal' ? (
                  <FileText className="h-8 w-8 mr-3 text-blue-600" />
                ) : (
                  <Scroll className="h-8 w-8 mr-3 text-green-600" />
                )}
                {examType === 'internal' ? 'Internal' : 'University'} Exam Papers
              </h1>
              <p className="text-slate-600">
                {semester.name} • {year} • All Subjects Combined
              </p>
            </div>
            
            <Link href={`/semester/${semesterId}`}>
              <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Semester
              </button>
            </Link>
          </div>

          {/* Year Badge */}
          <div className="flex items-center mb-6">
            <div className="flex items-center px-4 py-2 bg-white rounded-lg border border-slate-200">
              <Calendar className="h-5 w-5 mr-2 text-slate-600" />
              <span className="font-semibold text-slate-800">{year}</span>
            </div>
          </div>
        </div>

        {/* Exam Papers Grid */}
        {papers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {papers.map((paper) => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {paper.title}
                    </h3>
                    
                    <div className="space-y-1 mb-4">
                      {paper.examDate && (
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Date:</span> {paper.examDate}
                        </p>
                      )}
                      {paper.duration && (
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Duration:</span> {paper.duration}
                        </p>
                      )}
                      {paper.marks && (
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Max Marks:</span> {paper.marks}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    examType === 'internal' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {examType === 'internal' ? 'Internal' : 'University'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(paper)}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  
                  <a
                    href={paper.filePath}
                    download
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>

                {paper.fileName && (
                  <p className="text-xs text-slate-500 mt-2 truncate">
                    File: {paper.fileName}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-6">
              {examType === 'internal' ? (
                <FileText className="h-10 w-10 text-slate-400" />
              ) : (
                <Scroll className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              No Exam Papers Available
            </h3>
            <p className="text-slate-600 mb-6">
              No {examType} exam papers found for {year}. Papers will be uploaded soon.
            </p>
            <Link href={`/semester/${semesterId}`}>
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                Back to Semester
              </button>
            </Link>
          </div>
        )}
      </main>

      <Footer />

      <PDFModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedPaper}
      />
    </div>
  );
}