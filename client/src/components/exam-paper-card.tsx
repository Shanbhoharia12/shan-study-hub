import { FileText, Eye, Download, Calendar, Clock, Award } from "lucide-react";
import { useState } from "react";
import type { ExamPaper } from "@shared/schema";

interface ExamPaperCardProps {
  paper: ExamPaper;
  onPreview: (paper: ExamPaper) => void;
}

const getGradientClass = (type: string) => {
  return type === "internal" 
    ? "from-secondary to-emerald-600" 
    : "from-primary to-blue-600";
};

export function ExamPaperCard({ paper, onPreview }: ExamPaperCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      console.log(`Downloading: ${paper.fileName}`);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`bg-gradient-to-r ${getGradientClass(paper.type)} h-32 flex items-center justify-center`}>
        <div className="text-center text-white">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm opacity-90">{paper.examDate}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-2">
          {paper.title}
        </h3>
        <div className="space-y-1 text-sm text-slate-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-2" />
            Duration: {paper.duration}
          </div>
          <div className="flex items-center">
            <Award className="h-3 w-3 mr-2" />
            Max Marks: {paper.marks}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-2" />
            {paper.type === "internal" ? "Internal Assessment" : "University Exam"}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPreview(paper)}
            className="flex-1 bg-secondary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-slate-100 text-slate-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-1" />
            {isDownloading ? "..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
