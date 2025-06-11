import React from 'react';
import './FeedbackModal.css';

interface FeedbackModalProps {
  text: string;
  isSuccess: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ text, isSuccess, onClose }) => {
  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-header">
          <div className="mentor-info">
            <div className="mentor-avatar">👨‍⚕️</div>
            <h3>Dr. Holmes</h3>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className={`feedback-content ${isSuccess ? 'success' : 'failure'}`}>
          <div className="feedback-icon">
            {isSuccess ? '✅' : '❌'}
          </div>
          
          <div className="feedback-text">
            {text.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="feedback-actions">
          <button 
            className={`acknowledge-button ${isSuccess ? 'success' : 'failure'}`}
            onClick={onClose}
          >
            {isSuccess ? 'Thank you, Dr. Holmes!' : 'I understand'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 