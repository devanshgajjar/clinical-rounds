import React from 'react';
import { useGame } from '../../context/GameContext';
import { StepType, GameScreen } from '../../types/game';
import { isOptimalStepOrder } from '../../utils/gameLogic';
import { playSound } from '../../utils/soundManager';
import './CaseSummary.css';

const CaseSummary: React.FC = () => {
  const { 
    gameState, 
    getCurrentCase, 
    hideSummary, 
    navigateToScreen,
    completeCase 
  } = useGame();

  const gameCase = getCurrentCase();
  const stepResults = gameState.currentStepResults;
  const xpCalculation = gameState.xpCalculation;

  if (!gameCase || !xpCalculation) {
    return null;
  }

  const isOptimal = isOptimalStepOrder(stepResults);
  const totalAttempts = stepResults.reduce((sum, result) => sum + result.attempts, 0);
  const averageScore = stepResults.reduce((sum, result) => sum + result.score, 0) / stepResults.length;

  const getStepName = (stepType: StepType) => {
    switch (stepType) {
      case StepType.HISTORY_TAKING:
        return 'History Taking';
      case StepType.ORDERING_TESTS:
        return 'Ordering Tests';
      case StepType.DIAGNOSIS:
        return 'Diagnosis';
      case StepType.TREATMENT:
        return 'Treatment';
      default:
        return stepType;
    }
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: '#4CAF50' };
    if (score >= 80) return { grade: 'B', color: '#8BC34A' };
    if (score >= 70) return { grade: 'C', color: '#FFC107' };
    if (score >= 60) return { grade: 'D', color: '#FF9800' };
    return { grade: 'F', color: '#F44336' };
  };

  const performance = getPerformanceGrade(averageScore);

  const handleContinue = () => {
    playSound.pageTransition();
    completeCase();
    hideSummary();
    navigateToScreen(GameScreen.CASE_SELECT, gameState.progress.currentSystem);
  };

  const handleReplay = () => {
    playSound.buttonClick();
    hideSummary();
    // Restart the same case
    window.location.reload(); // Simple approach for now
  };

  return (
    <div className="case-summary-overlay">
      <div className="case-summary">
        <div className="summary-header">
          {/* <CloseCaseButton showText={true} /> */}
          <h2> Case Complete!</h2>
          <div className="case-title">{gameCase.title}</div>
          <div className="patient-name">{gameCase.patientInfo.name}</div>
        </div>

        <div className="performance-overview">
          <div className="grade-circle" style={{ borderColor: performance.color }}>
            <div className="grade-letter" style={{ color: performance.color }}>
              {performance.grade}
            </div>
            <div className="grade-percentage">
              {Math.round(averageScore)}%
            </div>
          </div>

          <div className="performance-stats">
            <div className="stat-item">
              <div className="stat-label">XP Earned</div>
              <div className="stat-value">{xpCalculation.finalXP}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Attempts</div>
              <div className="stat-value">{totalAttempts}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Order Bonus</div>
              <div className="stat-value">{isOptimal ? '✅' : '❌'}</div>
            </div>
          </div>
        </div>

        <div className="xp-breakdown">
          <h3>XP Breakdown</h3>
          <div className="breakdown-table">
            <div className="breakdown-header">
              <span>Step</span>
              <span>Score</span>
              <span>Multiplier</span>
              <span>XP</span>
            </div>
            {xpCalculation.breakdown.map((item) => (
              <div key={item.step} className="breakdown-row">
                <span className="step-name">{getStepName(item.step)}</span>
                <span className="step-score">{item.score}%</span>
                <span className="step-multiplier">×{item.multiplier}</span>
                <span className="step-xp">{item.xp}</span>
              </div>
            ))}
            <div className="breakdown-total">
              <span>Total XP</span>
              <span></span>
              <span></span>
              <span>{xpCalculation.finalXP}</span>
            </div>
          </div>
        </div>

        <div className="step-details">
          <h3>Step Performance</h3>
          <div className="steps-list">
            {stepResults.map((result) => (
              <div key={result.stepType} className="step-detail">
                <div className="step-header">
                  <span className="step-name">{getStepName(result.stepType)}</span>
                  <span className={`step-status ${result.isCorrect ? 'success' : 'failure'}`}>
                    {result.isCorrect ? '✅' : '❌'}
                  </span>
                </div>
                <div className="step-info">
                  <div className="step-score">Score: {result.score}%</div>
                  <div className="step-attempts">Attempts: {result.attempts}</div>
                </div>
                {result.feedback && (
                  <div className="step-feedback">{result.feedback}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overall-feedback">
          <h3>Overall Performance</h3>
          <div className="feedback-content">
            {averageScore >= 85 ? (
              <p>🌟 <strong>Excellent work!</strong> Your clinical reasoning and decision-making were outstanding. 
                 You demonstrated strong medical knowledge and patient care skills.</p>
            ) : averageScore >= 70 ? (
              <p>👍 <strong>Good job!</strong> You showed solid clinical skills with room for improvement. 
                 Review the areas where you lost points and continue practicing.</p>
            ) : averageScore >= 60 ? (
              <p>📚 <strong>Keep studying!</strong> Your performance shows you're learning, but more practice is needed. 
                 Focus on the fundamentals and don't rush your decisions.</p>
            ) : (
              <p>🔄 <strong>Don't give up!</strong> Medicine is challenging, and every expert was once a beginner. 
                 Review the case carefully and try again when you're ready.</p>
            )}

            {!isOptimal && (
              <p className="order-tip">
                💡 <strong>Tip:</strong> Try following the optimal order (History → Tests → Diagnosis → Treatment) 
                for maximum XP bonuses in future cases.
              </p>
            )}

            {totalAttempts > 4 && (
              <p className="attempts-tip">
                ⚡ <strong>Tip:</strong> Take your time to think through each step carefully to avoid multiple attempts 
                and maximize your XP.
              </p>
            )}
          </div>
        </div>

        <div className="summary-actions">
          <button 
            className="replay-button" 
            onClick={handleReplay}
            onMouseEnter={() => playSound.buttonHover()}
          >
            🔄 Replay Case
          </button>
          <button 
            className="continue-button" 
            onClick={handleContinue}
            onMouseEnter={() => playSound.buttonHover()}
          >
            Continue to Cases
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseSummary; 