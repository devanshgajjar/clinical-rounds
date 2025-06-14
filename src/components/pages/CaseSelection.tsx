import React from 'react';
import { useGame } from '../../context/GameContext';
import { casesData } from '../../data/cases';
import { playSound } from '../../utils/soundManager';

const CaseSelection: React.FC = () => {
  const { gameState } = useGame();

  const handleCaseSelect = (caseId: string) => {
    playSound.caseStart();
    // For now, redirect to GamePlay with the case
    window.location.href = `/?case=${caseId}`;
  };

  const getPerformanceStars = (caseId: string) => {
    // Check if case is completed and get performance
    const isCompleted = gameState.progress.completedCases.includes(caseId);
    if (!isCompleted) return 0;
    
    // Get the case results from localStorage or game state
    const savedResults = localStorage.getItem(`case_${caseId}_results`);
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        const averageScore = results.averageScore || 0;
        
        // Convert score to stars (1-5 based on performance)
        if (averageScore >= 90) return 5;
        if (averageScore >= 80) return 4;
        if (averageScore >= 70) return 3;
        if (averageScore >= 60) return 2;
        return 1;
      } catch (e) {
        return 0;
      }
    }
    
    return 0;
  };

  const getEarnedXP = (caseId: string) => {
    // Get the earned XP from localStorage
    const savedResults = localStorage.getItem(`case_${caseId}_results`);
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        return results.xpEarned || results.finalXP || results.totalXPEarned || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  };

  const isCaseCompleted = (caseId: string) => {
    return gameState.progress.completedCases.includes(caseId) || 
           localStorage.getItem(`case_${caseId}_completed`) === 'true';
  };

  const isCaseInProgress = (caseId: string) => {
    return Object.keys(gameState.progress.casesInProgress).includes(caseId);
  };

  const getCaseStatusIcon = (caseId: string) => {
    if (isCaseCompleted(caseId)) return '✅';
    if (isCaseInProgress(caseId)) return '⏳';
    return null;
  };

  // Group cases by system
  const groupedCases = casesData.reduce((acc, caseData) => {
    const system = caseData.system;
    if (!acc[system]) {
      acc[system] = [];
    }
    acc[system].push(caseData);
    return acc;
  }, {} as Record<string, typeof casesData>);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-medium text-gray-900">Clinical Cases</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>⭐</span>
            <span className="font-medium">{gameState.progress.totalXP} XP</span>
          </div>
          </div>

        {/* Cases */}
        <div className="space-y-12">
          {Object.entries(groupedCases).map(([systemName, cases]) => {
            return (
              <div key={systemName}>
                {/* System Header */}
                  <div className="mb-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    {systemName}
                  </h2>
                  <p className="text-gray-600">
                    Master {systemName.toLowerCase()} conditions and clinical decision making
                      </p>
                    </div>

                {/* Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cases.map((caseData) => {
                    const isCompleted = isCaseCompleted(caseData.id);
                    const inProgress = isCaseInProgress(caseData.id);
                    const statusIcon = getCaseStatusIcon(caseData.id);
                    const performanceStars = getPerformanceStars(caseData.id);

                        return (
                      <button
                        key={caseData.id}
                        onClick={() => handleCaseSelect(caseData.id)}
                        onMouseEnter={() => playSound.buttonHover()}
                            className={`
                          text-left p-6 border rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors
                          ${isCompleted ? 'border-green-200 bg-green-50' : 
                            inProgress ? 'border-yellow-200 bg-yellow-50' : 
                            'border-gray-200'}
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {caseData.title}
                                </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {caseData.patient.age}{caseData.patient.gender === 'Male' ? 'M' : 'F'} • {caseData.patient.chiefComplaint}
                            </p>
                            <div className="flex items-center space-x-1">
                              {isCompleted ? (
                                // Show performance stars for completed cases
                                <>
                                  {[...Array(performanceStars)].map((_, i) => (
                                    <span key={i} className="text-yellow-500">⭐</span>
                                  ))}
                                  {[...Array(5 - performanceStars)].map((_, i) => (
                                    <span key={`empty-${i}`} className="text-gray-300">⭐</span>
                                  ))}
                                </>
                              ) : (
                                // Show difficulty for uncompleted cases
                                <>
                                  {[...Array(caseData.difficulty)].map((_, i) => (
                                    <span key={i} className="text-gray-400">💎</span>
                                  ))}
                                  <span className="text-xs text-gray-500 ml-2">Difficulty</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {isCompleted 
                                ? `+${getEarnedXP(caseData.id)}XP Earned`
                                : `+${caseData.scoring.baseXP}XP`
                              }
                            </span>
                            {statusIcon && (
                              <span className="text-lg">{statusIcon}</span>
                            )}
                          </div>
                        </div>
                      </button>
                        );
                      })}
                    </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CaseSelection; 