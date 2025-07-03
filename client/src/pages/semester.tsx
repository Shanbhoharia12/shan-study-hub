import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Breadcrumb } from "@/components/breadcrumb";
import { SubjectCard } from "@/components/subject-card";
import { SearchBar } from "@/components/search-bar";
import { Footer } from "@/components/footer";
import type { SemesterWithCounts, SubjectWithCounts } from "@/lib/types";

const semesterColors = [
  "from-primary to-secondary", // 1st
  "from-emerald-500 to-teal-500", // 2nd
  "from-amber-500 to-orange-500", // 3rd
  "from-rose-500 to-pink-500", // 4th
  "from-purple-500 to-indigo-500", // 5th
  "from-cyan-500 to-blue-500", // 6th
  "from-green-500 to-emerald-500", // 7th
  "from-red-500 to-rose-500", // 8th
];

export default function SemesterPage() {
  const { semesterId } = useParams();
  const id = parseInt(semesterId || "1");

  const { data: semester, isLoading: semesterLoading } = useQuery<SemesterWithCounts>({
    queryKey: [`/api/semesters/${id}`],
  });

  const { data: subjects = [], isLoading: subjectsLoading } = useQuery<SubjectWithCounts[]>({
    queryKey: [`/api/semesters/${id}/subjects`],
  });

  const isLoading = semesterLoading || subjectsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading semester data...</p>
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

  const colorClass = semesterColors[semester.number - 1] || "from-primary to-secondary";

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: semester.name },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Semester Header */}
          <div className="text-center space-y-4">
            <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center`}>
              <span className="text-white font-bold text-2xl">
                {semester.number}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">
                {semester.name}
              </h2>
              <p className="text-slate-600">
                {semester.description || "Core Computer Science subjects"}
              </p>
            </div>
          </div>

          {/* Subjects Section */}
          {subjects.length > 0 ? (
            <div className="space-y-8">
              {/* Subjects List */}
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Subjects</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              </div>

              {/* Exam Papers Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Internal Exam Papers */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Internal Exam Papers</h4>
                      <p className="text-sm text-slate-500">Previous internal assessments</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <Link key={subject.id} href={`/exam-papers/${subject.id}?type=internal`}>
                        <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-secondary/10 hover:border-secondary transition-colors border border-transparent">
                          <span className="font-medium text-slate-700">{subject.name}</span>
                          <span className="text-xs text-slate-500 block">{subject.code}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* University Exam Papers */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">University Exam Papers</h4>
                      <p className="text-sm text-slate-500">Previous university examinations</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <Link key={subject.id} href={`/exam-papers/${subject.id}?type=university`}>
                        <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-primary/10 hover:border-primary transition-colors border border-transparent">
                          <span className="font-medium text-slate-700">{subject.name}</span>
                          <span className="text-xs text-slate-500 block">{subject.code}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Subjects Available</h3>
              <p className="text-slate-600">
                Subjects for this semester will be added soon.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
