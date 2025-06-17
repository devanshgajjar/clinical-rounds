import React, { useState, useEffect } from 'react';
import { CaseData } from '../../types/game';
import { StepType, Question } from '../../types/game';
import { playSound } from '../../utils/soundManager';
import { useGame } from '../../context/GameContext';

interface HistoryTakingProps {
  caseData: CaseData;
  onSubmit: (selectedAnswers: string[]) => void;
  onRetry?: () => void;
  attempts: number;
  maxAttempts: number;
  timeElapsed: number;
  onClose?: () => void;
}

const HistoryTaking: React.FC<HistoryTakingProps> = ({
  caseData,
  onSubmit,
  onRetry,
  attempts,
  maxAttempts,
  timeElapsed,
  onClose
}) => {
  const { gameState } = useGame();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // if (!gameState.isInGame || !gameState.currentCase) return null;

  const historyData = caseData.steps[StepType.HISTORY_TAKING];
  console.log('HistoryTaking: questions array:', historyData?.questions);

  if (!historyData?.questions || historyData.questions.length === 0) {
    return <div className="text-center text-gray-500 py-12">No history questions available for this case. (Check your case data.)</div>;
  }
  
  // Categorize questions - use only the actual case questions
  const categorizeQuestions = () => {
    return historyData.questions.map((q: any) => ({
      ...q,
      mappedCategory: q.category
        ? (q.category === 'Present Illness' ? 'History of Present Illness (HPI)'
          : q.category === 'Past Medical' ? 'Past Medical History'
          : q.category === 'Social' ? 'Social History'
          : q.category === 'Family' ? 'Family History'
          : q.category === 'Review of Systems' ? 'Review of Systems'
          : q.category)
        : 'General History'
    }));
  };

  const categorizedQuestions = categorizeQuestions();
  const allCategories = [
    'Present Illness',
    'Past Medical',
    'Social',
    'Family',
    'Review of Systems',
    'Other'
  ];
  const categories = Array.from(new Set(categorizedQuestions.map(q => q.category || 'Other'))).filter(cat => allCategories.includes(cat)).concat('Other');

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        playSound.selectionRemoved();
        return prev.filter(id => id !== questionId);
      } else {
        playSound.selectionMade();
        return [...prev, questionId];
      }
    });
  };

  const minRequired = caseData.steps[StepType.HISTORY_TAKING].minimumRequired || 3;
  const isValidSelection = selectedQuestions.length >= minRequired;

  const handleSubmit = async () => {
    if (selectedQuestions.length >= minRequired && !isSubmitting) {
      setIsSubmitting(true);
      playSound.stepComplete();
      try {
        console.log('HistoryTaking - Selected questions:', selectedQuestions);
        console.log('HistoryTaking - Question details:', selectedQuestions.map(id => 
          categorizedQuestions.find(q => q.id === id)
        ));
        onSubmit(selectedQuestions);
        setTimeout(() => setIsSubmitting(false), 2000);
      } catch (error) {
        setIsSubmitting(false);
      }
    }
  };

  const getQuestionsByCategory = (category: string) => {
    return categorizedQuestions.filter((q: any) => q.mappedCategory === category);
  };

  return (
    <div className="bg-white relative">
      <div className="max-w-4xl mx-auto p-8">
        {/* Progress Indicator */}
        <div className="selection-progress-indicator mb-4">
          <span>
            Selected {selectedQuestions.length} of minimum {minRequired} required
          </span>
        </div>
        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => {
            const questions = categorizedQuestions.filter((q: any) => (q.category || 'Other') === category);
            if (questions.length === 0) return null;
            return (
              <div key={category} className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {category}
                </h2>
                <div className="space-y-3">
                  {questions.map((question: any) => {
                    const isSelected = selectedQuestions.includes(question.id);
                    return (
                      <label
                        key={question.id}
                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleQuestionToggle(question.id)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-900">
                          {question.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
              ? '✅ Saved!' 
              : `Save History (${selectedQuestions.length} selected)`
            }
                  </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryTaking; 