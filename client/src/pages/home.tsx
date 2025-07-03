import { useQuery } from "@tanstack/react-query";
import { SemesterCard } from "@/components/semester-card";
import { SearchBar } from "@/components/search-bar";
import { Footer } from "@/components/footer";
import type { SemesterWithCounts } from "@/lib/types";

export default function Home() {
  const { data: semesters = [], isLoading } = useQuery<SemesterWithCounts[]>({
    queryKey: ['/api/semesters'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading semesters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Welcome to Your Study Hub
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Access all your semester materials, previous year papers, practical guides, and assignments in one place. Choose your semester to get started.
            </p>
          </div>

          {/* Semester Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {semesters.map((semester) => (
              <SemesterCard key={semester.id} semester={semester} />
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-slate-600">Subjects</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-secondary">200+</div>
              <div className="text-sm text-slate-600">Notes & PDFs</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-accent">100+</div>
              <div className="text-sm text-slate-600">Previous Papers</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-purple-500">4</div>
              <div className="text-sm text-slate-600">Years Coverage</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
