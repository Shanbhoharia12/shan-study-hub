import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Book, FileText, Code, ClipboardList } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { MaterialCard } from "@/components/material-card";
import { PDFModal } from "@/components/pdf-modal";
import { SearchBar } from "@/components/search-bar";
import { Footer } from "@/components/footer";
import type { Subject, Material } from "@shared/schema";
import type { MaterialType } from "@/lib/types";

export default function MaterialsPage() {
  const { subjectId } = useParams();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialType = (searchParams.get('type') || 'notes') as MaterialType;
  
  const [selectedType, setSelectedType] = useState<MaterialType>(initialType);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = parseInt(subjectId || "1");

  const { data: subject, isLoading: subjectLoading } = useQuery<Subject>({
    queryKey: [`/api/subjects/${id}`],
  });

  const { data: materials = [], isLoading: materialsLoading } = useQuery<Material[]>({
    queryKey: [`/api/subjects/${id}/materials`, { type: selectedType }],
  });

  const isLoading = subjectLoading || materialsLoading;

  const handlePreview = (material: Material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading materials...</p>
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
    { label: "3rd Semester", href: "/semester/3" }, // This should be dynamic based on subject's semester
    { label: subject.name },
  ];

  const materialTypes = [
    { key: 'notes' as MaterialType, label: 'Notes & PDFs', icon: FileText, color: 'text-red-500' },
    { key: 'practical' as MaterialType, label: 'Practicals', icon: Code, color: 'text-secondary' },
    { key: 'assignment' as MaterialType, label: 'Assignments', icon: ClipboardList, color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Subject Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Book className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  {subject.name}
                </h2>
                <p className="text-slate-500 mb-4">
                  {subject.code} - 3rd Semester
                </p>
                
                {/* Material Type Tabs */}
                <div className="flex flex-wrap gap-2">
                  {materialTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = selectedType === type.key;
                    
                    return (
                      <button
                        key={type.key}
                        onClick={() => setSelectedType(type.key)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : type.color}`} />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Materials Content */}
          {materials.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No {materialTypes.find(t => t.key === selectedType)?.label} Available
              </h3>
              <p className="text-slate-600">
                {materialTypes.find(t => t.key === selectedType)?.label} for this subject will be added soon.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <PDFModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedMaterial}
      />
    </div>
  );
}
