import { X, FileText, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Material, ExamPaper } from "@shared/schema";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Material | ExamPaper | null;
}

export function PDFModal({ isOpen, onClose, item }: PDFModalProps) {
  if (!item) return null;

  const title = "title" in item ? item.title : `${item.title}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Preview: {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 bg-slate-100 rounded-lg p-8 flex items-center justify-center min-h-96">
          <div className="text-center">
            <FileText className="h-24 w-24 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              PDF Preview
            </h3>
            <p className="text-slate-600 mb-6">
              PDF preview functionality would be implemented here using PDF.js or similar library
            </p>
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center mx-auto">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full PDF
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
