import React from 'react';
import { Case } from '../../types/game';
import { useGame } from '../../context/GameContext';
import './CaseInfo.css';

interface CaseInfoProps {
  gameCase: Case;
}

const CaseInfo: React.FC<CaseInfoProps> = ({ gameCase }) => {
  const { gameState, getStepProgress } = useGame();
  
  const progress = getStepProgress();

  return (
    <div className="case-info">
      <div className="case-header">
        <div className="case-title-section">
          <h1 className="case-title">{gameCase.title}</h1>
          <div className="case-difficulty">
            Difficulty: {'★'.repeat(gameCase.difficulty)}{'☆'.repeat(5 - gameCase.difficulty)}
          </div>
        </div>
        
        <div className="progress-section">
          <div className="step-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </div>
            <span className="progress-text">{progress.completed}/{progress.total} steps completed</span>
          </div>
          
          <div className="xp-info">
            <span className="base-xp">Base XP: {gameCase.baseXP}</span>
            <span className="total-xp">Total XP: {gameState.progress.totalXP}</span>
          </div>
        </div>
      </div>

      <div className="patient-card">
        <div className="patient-avatar">
          {gameCase.patientInfo.gender === 'Male' ? '👨' : '👩'}
        </div>
        
        <div className="patient-details">
          <div className="patient-basic-info">
            <h3 className="patient-name">{gameCase.patientInfo.name}</h3>
            <div className="patient-demographics">
              {gameCase.patientInfo.age} years old • {gameCase.patientInfo.gender}
            </div>
          </div>
          
          <div className="chief-complaint">
            <strong>Chief Complaint:</strong> {gameCase.patientInfo.chiefComplaint}
          </div>
          
          <div className="case-description">
            <strong>Presentation:</strong> {gameCase.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseInfo; 