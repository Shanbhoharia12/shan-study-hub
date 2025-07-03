import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Scroll, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { ExamPaperCard } from "@/components/exam-paper-card";
import { PDFModal } from "@/components/pdf-modal";
import { SearchBar } from "@/components/search-bar";
import { Footer } from "@/components/footer";
import type { Subject, ExamPaper } from "@shared/schema";
import type { ExamType, ExamYear } from "@/lib/types";

const yearColors = [
  "from-primary to-secondary", // 2024
  "from-emerald-500 to-teal-500", // 2023
  "from-amber-500 to-orange-500", // 2022
  "from-rose-500 to-pink-500", // 2021
];

export default function ExamPapersPage() {
  const { subjectId } = useParams();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const examType = (searchParams.get('type') || 'internal') as ExamType;
  
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = parseInt(subjectId || "1");

  const { data: subject, isLoading: subjectLoading } = useQuery<Subject>({
    queryKey: [`/api/subjects/${id}`],
  });

  const { data: years = [], isLoading: yearsLoading } = useQuery<ExamYear[]>({
    queryKey: [`/api/subjects/${id}/exam-years`, { type: examType }],
  });

  const { data: papers = [], isLoading: papersLoading } = useQuery<ExamPaper[]>({
    queryKey: [`/api/subjects/${id}/exam-papers`, { type: examType, year: selectedYear }],
    enabled: selectedYear !== null,
  });

  const isLoading = subjectLoading || yearsLoading || (selectedYear !== null && papersLoading);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  const handlePreview = (paper: ExamPaper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaper(null);
  };

  if (isLoading && !selectedYear) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading exam papers...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Subject Not Found</h2>
          <p className="text-slate-600">The requested subject could not be found.</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "3rd Semester", href: "/semester/3" },
    { label: subject.name, href: `/materials/${subject.id}` },
    { label: `${examType === 'internal' ? 'Internal' : 'University'} Exam Papers` },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Exam Papers Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scroll className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  {examType === 'internal' ? 'Internal' : 'University'} Exam Papers
                </h2>
                <p className="text-slate-500">
                  {subject.name} - {subject.code}
                </p>
              </div>
            </div>
          </div>

          {/* Year Selection */}
          {!selectedYear && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {years.map((yearData, index) => {
                const colorClass = yearColors[index] || "from-primary to-secondary";
                
                return (
                  <div
                    key={yearData.year}
                    className="group cursor-pointer"
                    onClick={() => handleYearSelect(yearData.year)}
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-primary transition-all duration-300 group-hover:-translate-y-1">
                      <div className="text-center space-y-2">
                        <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center`}>
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">
                            {yearData.year}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {yearData.paperCount} Papers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Papers for Selected Year */}
          {selectedYear && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  {examType === 'internal' ? 'Internal' : 'University'} Papers - {selectedYear}
                </h3>
                <button
                  onClick={() => setSelectedYear(null)}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  ← Back to Years
                </button>
              </div>

              {papersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading papers...</p>
                </div>
              ) : papers.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {papers.map((paper) => (
                    <ExamPaperCard
                      key={paper.id}
                      paper={paper}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <Scroll className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No Papers Available
                  </h3>
                  <p className="text-slate-600">
                    Exam papers for {selectedYear} will be added soon.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty State for No Years */}
          {!selectedYear && years.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No Exam Papers Available
              </h3>
              <p className="text-slate-600">
                {examType === 'internal' ? 'Internal' : 'University'} exam papers for this subject will be added soon.
              </p>
            </div>
          )}
        </div>
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
