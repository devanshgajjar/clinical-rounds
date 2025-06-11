import React, { useState, useMemo } from 'react';
import { CaseData } from '../../data/cases';
import { StepType } from '../../types/game';
import { 
  medicalTests, 
  searchTests,
  MedicalTest
} from '../../data/medicalOptions';

interface OrderingTestsProps {
  caseData: CaseData;
  onSubmit: (selectedAnswers: string[]) => void;
  onRetry?: () => void;
  attempts: number;
  maxAttempts: number;
  timeElapsed: number;
}

const OrderingTests: React.FC<OrderingTestsProps> = ({
  caseData,
  onSubmit,
  onRetry,
  attempts,
  maxAttempts,
  timeElapsed
}) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const testsData = caseData.steps[StepType.ORDERING_TESTS];

  // Filter tests based on search query
  const filteredTests = useMemo(() => {
    if (searchQuery.trim() === '') {
      return medicalTests;
    }
    return searchTests(searchQuery);
  }, [searchQuery]);

  // Get unique categories from filtered tests
  const availableCategories = useMemo(() => {
    const categorySet = new Set(filteredTests.map(test => test.category));
    const categories = Array.from(categorySet).sort();
    return categories;
  }, [filteredTests]);

  const handleTestToggle = (testId: string) => {
    setSelectedTests(prev => {
      if (prev.includes(testId)) {
        return prev.filter(id => id !== testId);
      } else if (prev.length < (testsData?.maxAllowed || 10)) {
        return [...prev, testId];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (selectedTests.length > 0 && !isSubmitting) {
      setIsSubmitting(true);
      try {
        onSubmit(selectedTests);
        setTimeout(() => setIsSubmitting(false), 2000);
      } catch (error) {
        setIsSubmitting(false);
      }
    }
  };

  const getTestsByCategory = (category: string): MedicalTest[] => {
    return filteredTests.filter(test => test.category === category);
  };

  // Check if test is from original case data (correct/necessary)
  const isOriginalTest = (testId: string): boolean => {
    return testsData?.tests?.some(test => test.id === testId) || false;
  };

  // Check if test is necessary according to case data
  const isNecessaryTest = (testId: string): boolean => {
    const originalTest = testsData?.tests?.find(test => test.id === testId);
    return originalTest?.necessary || false;
  };

  // Check if test is contraindicated according to case data
  const isContraindicatedTest = (testId: string): boolean => {
    const originalTest = testsData?.tests?.find(test => test.id === testId);
    return originalTest?.contraindicated || false;
  };

  const isValidSelection = selectedTests.length > 0;
  const maxAllowed = testsData?.maxAllowed || 10;

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
              placeholder="Search tests (e.g., blood work, CT scan, culture)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            Selected: {selectedTests.length} / {maxAllowed} tests
          </div>
          {searchQuery && (
            <div className="text-sm text-blue-600">
              Found {filteredTests.length} tests
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {availableCategories.map((category) => {
            const tests = getTestsByCategory(category);
            if (tests.length === 0) return null;
            
            return (
              <div key={category} className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {category} ({tests.length} tests)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tests.map((test) => {
                    const isSelected = selectedTests.includes(test.id);
                    const isDisabled = !isSelected && selectedTests.length >= maxAllowed;
                    const isOriginal = isOriginalTest(test.id);
                    const isNecessary = isNecessaryTest(test.id);
                    const isContraindicated = isContraindicatedTest(test.id);
                    
                    return (
                      <label
                        key={test.id}
                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        } ${
                          isContraindicated ? 'border-red-300 bg-red-50' :
                          isNecessary ? 'border-green-300 bg-green-50' :
                          isOriginal ? 'border-blue-300 bg-blue-50' :
                          'border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => !isDisabled && handleTestToggle(test.id)}
                          disabled={isDisabled}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium ${
                            isContraindicated ? 'text-red-900' :
                            isNecessary ? 'text-green-900' :
                            'text-gray-900'
                          }`}>
                            {test.name}
                            {isNecessary && <span className="text-green-600 ml-1">✓</span>}
                            {isContraindicated && <span className="text-red-600 ml-1">⚠️</span>}
                          </span>
                          {test.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {test.description}
                            </div>
                          )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-300 bg-green-50 rounded"></div>
              <span>✓ Necessary/Recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-300 bg-blue-50 rounded"></div>
              <span>Case-relevant option</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-300 bg-red-50 rounded"></div>
              <span>⚠️ Contraindicated/Dangerous</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
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
              ? '✅ Ordered!' 
              : `Order Tests (${selectedTests.length} selected)`
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderingTests; 