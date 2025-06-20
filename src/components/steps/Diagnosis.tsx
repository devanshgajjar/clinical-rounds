import React, { useState, useMemo } from 'react';
import { CaseData } from '../../types/game';
import { StepType } from '../../types/game';
import { 
  medicalDiagnoses, 
  searchDiagnoses,
  MedicalDiagnosis
} from '../../data/medicalOptions';
import { playSound } from '../../utils/soundManager';
import { useGame } from '../../context/GameContext';

interface DiagnosisProps {
  caseData: CaseData;
  onSubmit: (selectedAnswers: string[]) => void;
  onRetry?: () => void;
  attempts: number;
  maxAttempts: number;
  timeElapsed: number;
}

const Diagnosis: React.FC<DiagnosisProps> = ({
  caseData,
  onSubmit,
  onRetry,
  attempts,
  maxAttempts,
  timeElapsed
}) => {
  const { gameState } = useGame();
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const diagnosisData = caseData.steps[StepType.DIAGNOSIS];

  // Filter diagnoses based on search query
  const filteredDiagnoses = useMemo(() => {
    if (searchQuery.trim() === '') {
      return medicalDiagnoses;
    }
    return searchDiagnoses(searchQuery);
  }, [searchQuery]);

  // Get unique categories from filtered diagnoses
  const availableCategories = useMemo(() => {
    const categorySet = new Set(filteredDiagnoses.map(diagnosis => diagnosis.category));
    const categories = Array.from(categorySet).sort();
    return categories;
  }, [filteredDiagnoses]);

  // if (!gameState.isInGame || !gameState.currentCase) return null;

  const handleDiagnosisToggle = (diagnosisId: string) => {
    if (diagnosisData.type === 'multiple-choice') {
      playSound.selectionMade();
      setSelectedDiagnoses([diagnosisId]);
    } else {
      setSelectedDiagnoses(prev => {
        if (prev.includes(diagnosisId)) {
          playSound.selectionRemoved();
          return prev.filter(id => id !== diagnosisId);
        } else {
          playSound.selectionMade();
          return [...prev, diagnosisId];
        }
      });
    }
  };

  const handleSubmit = async () => {
    if (selectedDiagnoses.length > 0 && !isSubmitting) {
      setIsSubmitting(true);
      playSound.stepComplete();
      try {
        onSubmit(selectedDiagnoses);
        setTimeout(() => setIsSubmitting(false), 2000);
      } catch (error) {
        setIsSubmitting(false);
      }
    }
  };

  const getDiagnosesByCategory = (category: string): MedicalDiagnosis[] => {
    return filteredDiagnoses.filter(diagnosis => diagnosis.category === category);
  };

  // Check if diagnosis is from original case data (correct)
  const isOriginalDiagnosis = (diagnosisId: string): boolean => {
    return diagnosisData?.options?.some((option: any) => option.id === diagnosisId) || false;
  };

  // Check if diagnosis is correct according to case data
  const isCorrectDiagnosis = (diagnosisId: string): boolean => {
    const originalOption = diagnosisData?.options?.find((option: any) => option.id === diagnosisId);
    return originalOption?.correct || false;
  };

  const isValidSelection = selectedDiagnoses.length > 0;

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
              placeholder="Search diagnoses (e.g., pneumonia, stroke, infection)..."
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
        {/* Instructions */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {diagnosisData.type === 'multiple-choice' 
              ? 'Select the ONE most likely diagnosis' 
              : 'Select ALL diagnoses that apply to this case'
            }
          </p>
          {searchQuery && (
            <div className="text-sm text-blue-600">
              Found {filteredDiagnoses.length} diagnoses
            </div>
          )}
        </div>
        {/* Search Results (only show if searchQuery is not empty) */}
        {searchQuery.trim() !== '' && (
          <div className="space-y-4">
            {filteredDiagnoses.length === 0 ? (
              <div className="text-gray-500">No diagnoses found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDiagnoses.map((diagnosis) => {
                  const isSelected = selectedDiagnoses.includes(diagnosis.id);
                  const isOriginal = isOriginalDiagnosis(diagnosis.id);
                  const isCorrect = isCorrectDiagnosis(diagnosis.id);
                  return (
                    <label
                      key={diagnosis.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type={diagnosisData.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                        checked={isSelected}
                        onChange={() => handleDiagnosisToggle(diagnosis.id)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        name={diagnosisData.type === 'multiple-choice' ? 'diagnosis' : undefined}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-lg font-medium text-gray-900">
                          {diagnosis.name}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          {diagnosis.icd10 && `ICD-10: ${diagnosis.icd10}`}
                          {diagnosis.description && ` • ${diagnosis.description}`}
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

export default Diagnosis; 