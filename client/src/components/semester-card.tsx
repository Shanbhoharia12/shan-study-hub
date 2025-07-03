import { Link } from "wouter";
import type { SemesterWithCounts } from "@/lib/types";

interface SemesterCardProps {
  semester: SemesterWithCounts;
}

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

export function SemesterCard({ semester }: SemesterCardProps) {
  const colorClass = semesterColors[semester.number - 1] || "from-primary to-secondary";

  return (
    <Link href={`/semester/${semester.id}`}>
      <div className="group cursor-pointer">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-primary transition-all duration-300 group-hover:-translate-y-1">
          <div className="text-center space-y-3">
            <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">
                {semester.number}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                {semester.name}
              </h3>
              <p className="text-sm text-slate-500">
                {semester.subjectCount} Subjects
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
