import React from 'react';
import './CutsceneModal.css';

interface CutsceneModalProps {
  text: string;
  onClose: () => void;
}

const CutsceneModal: React.FC<CutsceneModalProps> = ({ text, onClose }) => {
  return (
    <div className="cutscene-modal-overlay" onClick={onClose}>
      <div className="cutscene-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cutscene-header">
          <h3>🎬 Patient Scene</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="cutscene-content">
          <div className="patient-icon">👤</div>
          <div className="cutscene-text">
            {text}
          </div>
        </div>
        
        <div className="cutscene-actions">
          <button className="continue-button" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CutsceneModal; 