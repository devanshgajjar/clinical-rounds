import React, { useState, useMemo } from 'react';
import { CaseData } from '../../data/cases';
import { StepType } from '../../types/game';
import { 
  medicalDiagnoses, 
  searchDiagnoses,
  MedicalDiagnosis
} from '../../data/medicalOptions';
import { playSound } from '../../utils/soundManager';

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
    return diagnosisData?.options?.some(option => option.id === diagnosisId) || false;
  };

  // Check if diagnosis is correct according to case data
  const isCorrectDiagnosis = (diagnosisId: string): boolean => {
    const originalOption = diagnosisData?.options?.find(option => option.id === diagnosisId);
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

        {/* Categories */}
        <div className="space-y-8">
          {availableCategories.map((category) => {
            const diagnoses = getDiagnosesByCategory(category);
            if (diagnoses.length === 0) return null;
            
            return (
              <div key={category} className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {category} ({diagnoses.length} diagnoses)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {diagnoses.map((diagnosis) => {
                    const isSelected = selectedDiagnoses.includes(diagnosis.id);
                    const isOriginal = isOriginalDiagnosis(diagnosis.id);
                    const isCorrect = isCorrectDiagnosis(diagnosis.id);
                    
                    return (
                      <label
                        key={diagnosis.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                          isCorrect ? 'border-green-300 bg-green-50' :
                          isOriginal ? 'border-blue-300 bg-blue-50' :
                          'border-gray-200'
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
                          <span className={`text-lg font-medium ${
                            isCorrect ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {diagnosis.name}
                            {isCorrect && <span className="text-green-600 ml-1">✓</span>}
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
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Legend:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-300 bg-green-50 rounded"></div>
              <span>✓ Correct diagnosis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-300 bg-blue-50 rounded"></div>
              <span>Case-relevant option</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={!isValidSelection || isSubmitting}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-green-600 text-white'
                : isValidSelection
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting 
              ? '✅ Submitted!' 
              : `Submit Diagnosis (${selectedDiagnoses.length} selected)`
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis; 