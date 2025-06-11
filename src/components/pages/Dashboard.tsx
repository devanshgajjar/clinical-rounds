import React from 'react';
import { useGame } from '../../context/GameContext';
import { clinicalSystems } from '../../data/gameData';
import { GameScreen, ClinicalSystem } from '../../types/game';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";

const Dashboard: React.FC = () => {
  const { gameState, navigateToScreen } = useGame();

  const handleSystemSelect = (system: ClinicalSystem) => {
    console.log('Dashboard: handleSystemSelect called with system:', system.id);
    if (system.isUnlocked || (system.requiredXP && gameState.progress.totalXP >= system.requiredXP)) {
      console.log('Dashboard: navigating to case selection for system:', system.id);
      navigateToScreen(GameScreen.CASE_SELECT, system.id);
    } else {
      console.log('Dashboard: system is locked');
    }
  };

  const getSystemProgress = (system: ClinicalSystem) => {
    const completedCases = system.cases.filter(c => 
      gameState.progress.completedCases.includes(c.id)
    ).length;
    return { completed: completedCases, total: system.cases.length };
  };

  const isSystemUnlocked = (system: ClinicalSystem) => {
    return system.isUnlocked || 
           gameState.progress.unlockedSystems.includes(system.id) ||
           (system.requiredXP && gameState.progress.totalXP >= system.requiredXP);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <Card className="rounded-none shadow-lg border-0">
        <CardContent className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">Clinical Rounds</CardTitle>
              <CardDescription className="text-gray-600">Master clinical decision-making through gamified learning</CardDescription>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <Badge variant="outline" className="text-2xl font-bold text-primary px-4 py-2">
                  {gameState.progress.totalXP}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Total XP</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-2xl font-bold text-green-600 px-4 py-2">
                  {gameState.progress.completedCases.length}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Cases Completed</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-2xl font-bold text-purple-600 px-4 py-2">
                  {gameState.progress.badges.length}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Badges Earned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Clinical Specialty
          </h2>
          <p className="text-xl text-white opacity-90">
            Each system offers cases that increase in difficulty and XP rewards
          </p>
        </div>

        {/* Clinical Systems Grid */}
        <div className="max-w-md mx-auto space-y-4">
          {clinicalSystems.map((system) => {
            const isUnlocked = isSystemUnlocked(system);
            const progress = getSystemProgress(system);
            
            return (
              <Card
                key={system.id}
                className={`
                  relative overflow-hidden transition-all duration-300 cursor-pointer
                  ${isUnlocked 
                    ? 'hover:scale-105 hover:shadow-2xl' 
                    : 'cursor-not-allowed opacity-60'
                  }
                `}
                onClick={() => isUnlocked && handleSystemSelect(system)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-6">
                    {/* System Icon */}
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 flex-shrink-0"
                      style={{ backgroundColor: isUnlocked ? system.color : '#9ca3af' }}
                    >
                      {system.icon}
                    </div>

                    {/* System Info */}
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">
                        {system.name}
                      </CardTitle>
                      <CardDescription className="text-sm mb-2">
                        {system.description}
                      </CardDescription>

                      {/* Progress Info */}
                      {isUnlocked && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress: {progress.completed}/{progress.total} cases</span>
                        </div>
                      )}

                      {/* Unlock Requirements */}
                      {!isUnlocked && system.requiredXP && (
                        <Badge variant="secondary" className="text-xs">
                          🔒 Requires {system.requiredXP} XP
                        </Badge>
                      )}
                    </div>

                    {/* Action Arrow */}
                    <div className="flex-shrink-0 ml-4">
                      {isUnlocked ? (
                        <Button variant="ghost" size="sm" className="text-gray-400">→</Button>
                      ) : (
                        <span className="text-gray-300">🔒</span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isUnlocked && (
                    <div className="px-6 pb-4">
                      <Progress 
                        value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Badge Indicator */}
                  {system.badge && progress.completed === progress.total && progress.total > 0 && (
                    <Badge className="absolute top-4 right-4" variant="default">
                      🏆 MASTERED
                    </Badge>
                  )}

                  {/* Case Count Indicator */}
                  <Badge className="absolute top-4 left-4" variant="secondary">
                    {system.cases.length} cases
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Badge variant="outline" className="text-3xl font-bold text-blue-600 mb-2 px-4 py-2">
                  {gameState.progress.stats.totalCasesCompleted}
                </Badge>
                <div className="text-sm text-gray-600 mt-2">Total Cases</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-3xl font-bold text-green-600 mb-2 px-4 py-2">
                  {gameState.progress.stats.perfectCases}
                </Badge>
                <div className="text-sm text-gray-600 mt-2">Perfect Cases</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-3xl font-bold text-purple-600 mb-2 px-4 py-2">
                  {Math.round(gameState.progress.stats.averageScore)}%
                </Badge>
                <div className="text-sm text-gray-600 mt-2">Average Score</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-3xl font-bold text-yellow-600 mb-2 px-4 py-2">
                  {gameState.progress.stats.empathyRating > 0 ? Math.round(gameState.progress.stats.empathyRating) : 0}
                </Badge>
                <div className="text-sm text-gray-600 mt-2">Empathy Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases in Progress */}
        {Object.keys(gameState.progress.casesInProgress).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Continue Your Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(gameState.progress.casesInProgress).map(([caseId, progress]) => {
                  const caseData = clinicalSystems
                    .flatMap(s => s.cases)
                    .find(c => c.id === caseId);
                  
                  if (!caseData) return null;
                  
                  return (
                    <Card
                      key={caseId}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        // Navigate to the case's system first, then to the case
                        const system = clinicalSystems.find(s => s.cases.some(c => c.id === caseId));
                        if (system) {
                          navigateToScreen(GameScreen.CASE_SELECT, system.id);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-semibold">{caseData.title}</CardTitle>
                            <CardDescription className="text-sm">{caseData.patientInfo.name}</CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="font-medium">
                              {progress.stepResults.filter(r => r.isCompleted).length}/4 steps
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">Continue</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 