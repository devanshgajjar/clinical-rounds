import React from 'react';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/soundManager';

const HistoryXPCutscene: React.FC = () => {
  const { gameState, dispatch } = useGame();
  const currentCase = gameState.currentCase;

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Case Not Found</h2>
          <button 
            onClick={() => {
              playSound.pageTransition();
              dispatch({ type: 'BACK_TO_CASE_SELECTION' });
            }}
            onMouseEnter={() => playSound.buttonHover()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Cases
          </button>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    playSound.pageTransition();
    dispatch({ type: 'CONTINUE_TO_STEP_SELECTION' });
  };

  const handleBack = () => {
    playSound.pageTransition();
    dispatch({ type: 'BACK_TO_CASE_SELECTION' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 relative overflow-hidden">
      {/* Radiating background lines */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 bg-white origin-bottom"
            style={{
              height: '50vh',
              transform: `translateX(-50%) translateY(-100%) rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6">
        {/* Header */}
        <header className="py-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBack}
              onMouseEnter={() => playSound.buttonHover()}
              className="text-white text-xl hover:opacity-80 transition-opacity"
            >
              ←
            </button>
            <div className="flex items-center gap-2 bg-amber-500 text-white px-3 py-1 rounded-full font-bold">
              <span>🔥</span>
              <span>{gameState.progress.totalXP}</span>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">👨‍⚕️</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-12 text-center">
          {/* XP Earned Display */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-yellow-400 mb-2">
              +30 XP
            </div>
            <div className="text-2xl font-bold text-white">
              History Collected
            </div>
          </div>

          {/* XP Badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold text-lg border-4 border-yellow-400 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span>30 XP</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-gray-700 rounded-full h-4 w-80 overflow-hidden">
                <div className="flex h-full">
                  {/* First segment - completed */}
                  <div className="bg-green-400 flex-1 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-black">×2</span>
                    </div>
                  </div>
                  {/* Second segment - next */}
                  <div className="bg-gray-500 flex-1 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">×3</span>
                    </div>
                  </div>
                  {/* Third segment - future */}
                  <div className="bg-gray-600 flex-1 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-300">×4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Feedback Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <div className="flex items-start gap-4">
              {/* Patient Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-orange-200 rounded-full relative overflow-hidden">
                  {/* Patient illustration */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-10 bg-green-600 rounded-t-lg"></div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-10 bg-orange-300 rounded-full relative">
                    {/* Face features */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-b-full"></div>
                  </div>
                  {/* Hair */}
                  <div className="absolute top-0 left-2 right-2 h-4 bg-amber-800 rounded-t-full"></div>
                </div>
              </div>

              {/* Feedback content */}
              <div className="flex-1 text-left">
                <div className="text-blue-500 font-bold text-lg mb-2">
                  PRATIK
                </div>
                <div className="text-gray-800 text-base leading-relaxed">
                  I feel like you really listened.<br />
                  Thank you doc!
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            onMouseEnter={() => playSound.buttonHover()}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Continue
          </button>
        </main>
      </div>
    </div>
  );
};

export default HistoryXPCutscene; 