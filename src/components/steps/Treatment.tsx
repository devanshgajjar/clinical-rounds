import React, { useState, useMemo } from 'react';
import { CaseData } from '../../types/game';
import { StepType } from '../../types/game';
import { 
  medicalTreatments, 
  searchTreatments,
  MedicalTreatment
} from '../../data/medicalOptions';
import { playSound } from '../../utils/soundManager';

interface TreatmentProps {
  caseData: CaseData;
  onSubmit: (selectedAnswers: string[]) => void;
  onRetry?: () => void;
  attempts: number;
  maxAttempts: number;
  timeElapsed: number;
}

const Treatment: React.FC<TreatmentProps> = ({
  caseData,
  onSubmit,
  onRetry,
  attempts,
  maxAttempts,
  timeElapsed
}) => {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const treatmentData = caseData.steps[StepType.TREATMENT];

  // Filter treatments based on search query
  const filteredTreatments = useMemo(() => {
    if (searchQuery.trim() === '') {
      return medicalTreatments;
    }
    return searchTreatments(searchQuery);
  }, [searchQuery]);

  // Get unique categories from filtered treatments
  const availableCategories = useMemo(() => {
    const categorySet = new Set(filteredTreatments.map((treatment: any) => treatment.category));
    const categories = Array.from(categorySet).sort();
    return categories;
  }, [filteredTreatments]);

  const handleTreatmentToggle = (treatmentId: string) => {
    setSelectedTreatments(prev => {
      if (prev.includes(treatmentId)) {
        playSound.selectionRemoved();
        return prev.filter((id: any) => id !== treatmentId);
      } else {
        playSound.selectionMade();
        return [...prev, treatmentId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedTreatments.length > 0 && !isSubmitting) {
      setIsSubmitting(true);
      playSound.stepComplete();
      try {
        onSubmit(selectedTreatments);
        setTimeout(() => setIsSubmitting(false), 2000);
      } catch (error) {
        setIsSubmitting(false);
      }
    }
  };

  const getTreatmentsByCategory = (category: string): MedicalTreatment[] => {
    return filteredTreatments.filter((treatment: any) => treatment.category === category);
  };

  // Check if treatment is from original case data
  const isOriginalTreatment = (treatmentId: string): boolean => {
    return treatmentData?.treatments?.some(treatment => treatment.id === treatmentId) || false;
  };

  // Check if treatment is necessary according to case data
  const isNecessaryTreatment = (treatmentId: string): boolean => {
    const originalTreatment = treatmentData?.treatments?.find(treatment => treatment.id === treatmentId);
    return originalTreatment?.necessary || false;
  };

  // Check if treatment is contraindicated according to case data
  const isContraindicatedTreatment = (treatmentId: string): boolean => {
    const originalTreatment = treatmentData?.treatments?.find(treatment => treatment.id === treatmentId);
    return originalTreatment?.contraindicated || false;
  };

  const isValidSelection = selectedTreatments.length > 0;
  const maxAllowed = treatmentData?.maxAllowed || 10;

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Patient Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Summary</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>{caseData.patient.name}</strong> - {caseData.patient.age}yo {caseData.patient.gender}</p>
            <p><strong>Chief Complaint:</strong> {caseData.patient.chiefComplaint}</p>
          </div>
        </div>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search treatments (e.g., antibiotics, surgery, medication)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value && Math.random() < 0.3) {
                  playSound.searchType();
                }
              }}
              className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ paddingLeft: '3.5rem' }}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ left: '1rem' }}>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        {/* Selection Info */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Selected: {selectedTreatments.length} / {maxAllowed} treatments
          </div>
          {searchQuery && (
            <div className="text-sm text-blue-600">
              Found {filteredTreatments.length} treatments
            </div>
          )}
        </div>
        {/* Search Results (only show if searchQuery is not empty) */}
        {searchQuery.trim() !== '' && (
          <div className="space-y-4">
            {filteredTreatments.length === 0 ? (
              <div className="text-gray-500">No treatments found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTreatments.map((treatment: any) => {
                  const isSelected = selectedTreatments.includes(treatment.id);
                  const isDisabled = !isSelected && selectedTreatments.length >= maxAllowed;
                  const isOriginal = isOriginalTreatment(treatment.id);
                  const isNecessary = isNecessaryTreatment(treatment.id);
                  const isContraindicated = isContraindicatedTreatment(treatment.id);
                  return (
                    <label
                      key={treatment.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      } ${
                        isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !isDisabled && handleTreatmentToggle(treatment.id)}
                        disabled={isDisabled}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900">
                          {treatment.name}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {treatment.dosage && `Dosage: ${treatment.dosage}`}
                          {treatment.description && ` • ${treatment.description}`}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* Submit Button */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isValidSelection || isSubmitting}
            className="btn btn-primary px-8 py-3 text-lg font-semibold rounded-lg disabled:opacity-60"
          >
            Submit
          </button>
          {attempts < maxAttempts && onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-secondary px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Treatment; 