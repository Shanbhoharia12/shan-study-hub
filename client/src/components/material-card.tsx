import { FileText, Eye, Download } from "lucide-react";
import { useState } from "react";
import type { Material } from "@shared/schema";

interface MaterialCardProps {
  material: Material;
  onPreview: (material: Material) => void;
}

export function MaterialCard({ material, onPreview }: MaterialCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, this would trigger the actual download
      console.log(`Downloading: ${material.fileName}`);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="pdf-preview h-32 flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <FileText className="h-12 w-12 text-white" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
          {material.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
          <span className="capitalize">{material.type}</span>
          <span>{material.fileSize}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPreview(material)}
            className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
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
