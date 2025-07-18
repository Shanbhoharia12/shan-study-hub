import { Link } from "wouter";
import { Book, FileText, Code, ClipboardList } from "lucide-react";
import type { SubjectWithCounts } from "@/lib/types";

interface SubjectCardProps {
  subject: SubjectWithCounts;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Book className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 mb-1">
              {subject.name}
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              {subject.code}
            </p>
            
            {/* Material Types */}
            <div className="space-y-2">
              <Link href={`/materials/${subject.id}?type=notes`}>
                <button className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors">
                  <FileText className="inline h-4 w-4 text-red-500 mr-2" />
                  Notes & PDFs
                  <span className="float-right text-slate-400">
                    {subject.notesCount}
                  </span>
                </button>
              </Link>
              
              <Link href={`/materials/${subject.id}?type=practical`}>
                <button className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors">
                  <Code className="inline h-4 w-4 text-secondary mr-2" />
                  Practicals
                  <span className="float-right text-slate-400">
                    {subject.practicalsCount}
                  </span>
                </button>
              </Link>
              
              <Link href={`/materials/${subject.id}?type=assignment`}>
                <button className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors">
                  <ClipboardList className="inline h-4 w-4 text-accent mr-2" />
                  Assignments
                  <span className="float-right text-slate-400">
                    {subject.assignmentsCount}
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
