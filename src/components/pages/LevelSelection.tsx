import React from 'react';
import { useGame } from '../../context/GameContext';
import { GameScreen } from '../../types/game';
import { caseCategories, gameCases } from '../../data/cases';
import '../../styles/duolingo-theme.css';

const LevelSelection: React.FC = () => {
  const { navigateToScreen, gameState } = useGame();

  const getCategoryProgress = (categoryId: string) => {
    const categoryCase = gameCases.filter(c => c.categoryId === categoryId);
    const completedCases = gameState.progress.completedCases.filter(caseId =>
      categoryCase.some(c => c.id === caseId)
    );

    return {
      completed: completedCases.length,
      total: categoryCase.length
    };
  };

  const handleCategorySelect = (categoryId: string) => {
    navigateToScreen(GameScreen.CASE_SELECT, categoryId);
  };

  // Map category IDs to icons and colors
  const getCategoryConfig = (categoryId: string) => {
    const configs = {
      'infectious': { icon: '🦠', color: 'var(--infectious-color)' },
      'cardiology': { icon: '❤️', color: 'var(--cardiology-color)' },
      'neurology': { icon: '🧠', color: 'var(--neurology-color)' },
      'gastro': { icon: '🫃', color: 'var(--gastro-color)' },
      'respiratory': { icon: '🫁', color: 'var(--respiratory-color)' }
    };
    return configs[categoryId as keyof typeof configs] || { icon: '🏥', color: 'var(--primary-green)' };
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center py-12">
          <div className="avatar-lg mb-4" style={{ background: 'var(--primary-green)' }}>
            🏥
          </div>
          <h1 className="text-4xl font-bold text-inverse mb-2">Clinical Rounds</h1>
          <p className="text-lg text-inverse opacity-90 mb-8">Master medical diagnosis through interactive cases</p>
          
          {/* Stats Row */}
          <div className="flex gap-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-inverse">{gameState.progress.totalXP}</div>
              <div className="text-sm text-inverse opacity-80">Total XP</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-inverse">{gameState.progress.completedCases.length}</div>
              <div className="text-sm text-inverse opacity-80">Cases Done</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-inverse">{gameState.progress.unlockedSystems.length}/5</div>
              <div className="text-sm text-inverse opacity-80">Systems</div>
            </div>
          </div>
        </header>

        {/* Medical Systems Grid */}
        <main className="pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {caseCategories.map((category, index) => {
              const progress = getCategoryProgress(category.id);
              const progressPercentage = progress.total > 0 ? 
                (progress.completed / progress.total) * 100 : 0;
              const categoryCase = gameCases.filter(c => c.categoryId === category.id);
              const isUnlocked = gameState.progress.unlockedSystems.includes(category.id) || category.id === 'infectious';
              const isCompleted = progress.completed === progress.total && progress.total > 0;
              const config = getCategoryConfig(category.id);
              
              return (
                <div 
                  key={category.id}
                  className={`card cursor-pointer animate-fade-in ${
                    !isUnlocked ? 'opacity-60' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    border: isCompleted ? '3px solid var(--primary-green)' : 'none'
                  }}
                  onClick={() => isUnlocked && handleCategorySelect(category.id)}
                >
                  {/* Card Header */}
                  <div className="card-header relative">
                    <div className="flex items-center gap-4">
                      <div 
                        className="avatar"
                        style={{ background: config.color }}
                      >
                        {config.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary">{category.name}</h3>
                        <p className="text-sm text-secondary">{category.description}</p>
                      </div>
                      
                      {isCompleted && (
                        <div className="absolute top-4 right-4">
                          <div className="badge badge-success">
                            ✓ Complete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-secondary">Progress</span>
                        <span className="text-sm font-semibold text-primary">
                          {progress.completed}/{progress.total} cases
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${progressPercentage}%`,
                            background: isCompleted 
                              ? 'linear-gradient(90deg, var(--primary-green), var(--primary-green-light))'
                              : `linear-gradient(90deg, ${config.color}, ${config.color})`
                          }}
                        />
                      </div>
                    </div>

                    {/* Case Details */}
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-secondary">XP Range: </span>
                        <span className="font-semibold text-primary">
                          {Math.min(...categoryCase.map(c => c.xpReward))} - {Math.max(...categoryCase.map(c => c.xpReward))}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(difficulty => (
                          <div 
                            key={difficulty}
                            className="w-3 h-3 rounded-full"
                            style={{ 
                              background: categoryCase.some(c => c.stars >= difficulty) 
                                ? config.color 
                                : 'var(--gray-200)' 
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    {isUnlocked ? (
                      <button 
                        className="btn btn-primary btn-md w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategorySelect(category.id);
                        }}
                      >
                        {isCompleted ? 'Review Cases' : 'Start Learning'}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-secondary">
                        <span>🔒</span>
                        <span className="text-sm">Complete previous systems to unlock</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Info Section - Now a horizontal navigation */}
        <section className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-around items-center">
              {[
                { icon: '🩺', title: 'History Taking', desc: 'Ask the right questions' },
                { icon: '🧪', title: 'Order Tests', desc: 'Choose diagnostic tests' },
                { icon: '💭', title: 'Diagnosis', desc: 'Make the diagnosis' },
                { icon: '💊', title: 'Treatment', desc: 'Plan the treatment' }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="text-2xl mb-1">{step.icon}</div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* XP System Info */}
        <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-inverse mb-4">⭐ XP System</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-inverse mb-2">Difficulty Levels</div>
              <div className="text-inverse opacity-80">Easy: 10 XP • Medium: 20 XP • Hard: 30 XP</div>
            </div>
            <div>
              <div className="font-semibold text-inverse mb-2">Step Multipliers</div>
              <div className="text-inverse opacity-80">Follow the correct order for bonus XP</div>
            </div>
            <div>
              <div className="font-semibold text-inverse mb-2">Retry Penalties</div>
              <div className="text-inverse opacity-80">1st: -20% • 2nd: -50% • 3rd: Restart</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Additional CSS for grid layout
const styles = `
  .grid {
    display: grid;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  @media (min-width: 768px) {
    .md\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .md\\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    
    .md\\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  
  @media (min-width: 1024px) {
    .lg\\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  
  .min-h-screen {
    min-height: 100vh;
  }
  
  .w-full {
    width: 100%;
  }
  
  .w-3 {
    width: 12px;
  }
  
  .h-3 {
    height: 12px;
  }
  
  .max-w-4xl {
    max-width: 56rem;
  }
  
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  
  .py-12 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  .pb-12 {
    padding-bottom: 3rem;
  }
  
  .pb-24 {
    padding-bottom: 6rem;
  }
  
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .p-4 {
    padding: 1rem;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  
  .mb-8 {
    margin-bottom: 2rem;
  }
  
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  
  .opacity-60 {
    opacity: 0.6;
  }
  
  .opacity-80 {
    opacity: 0.8;
  }
  
  .opacity-90 {
    opacity: 0.9;
  }
  
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  
  .relative {
    position: relative;
  }
  
  .absolute {
    position: absolute;
  }
  
  .fixed {
    position: fixed;
  }
  
  .bottom-0 {
    bottom: 0;
  }
  
  .left-0 {
    left: 0;
  }
  
  .right-0 {
    right: 0;
  }
  
  .top-4 {
    top: 1rem;
  }
  
  .right-4 {
    right: 1rem;
  }
  
  .flex-1 {
    flex: 1 1 0%;
  }
  
  .z-50 {
    z-index: 50;
  }
  
  .justify-around {
    justify-content: space-around;
  }
  
  .bg-white {
    background-color: white;
  }
  
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .border-t {
    border-top-width: 1px;
  }
  
  .border-gray-200 {
    border-color: #e5e7eb;
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .hover\\:bg-gray-50:hover {
    background-color: #f9fafb;
  }
  
  .transition-colors {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .text-gray-800 {
    color: #1f2937;
  }
  
  .text-gray-600 {
    color: #4b5563;
  }
  
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  @media (min-width: 640px) {
    .sm\\:block {
      display: block;
    }
  }
  
  .hidden {
    display: none;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default LevelSelection; 