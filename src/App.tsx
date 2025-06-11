import React, { useEffect, useState } from 'react';
import { GameProvider } from './context/GameContext';
import CaseSelection from './components/pages/CaseSelection';
import CaseIntroduction from './components/pages/CaseIntroduction';
import StepSelection from './components/pages/StepSelection';
import HistoryXPCutscene from './components/pages/HistoryXPCutscene';
import GamePlay from './components/game/GamePlay';
import { useGame } from './context/GameContext';
import { getCaseById } from './data/cases';
import './styles/duolingo-theme.css';

// Custom Case Introduction component for our case data
const CustomCaseIntroduction: React.FC<{ caseId: string; onStart: () => void; onBack: () => void }> = ({ caseId, onStart, onBack }) => {
  const caseData = getCaseById(caseId);
  
  if (!caseData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Case Not Found</h2>
          <button 
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Return to Cases
          </button>
        </div>
      </div>
    );
  }

  // Get case-specific patient avatar and vital signs
  const getPatientAvatar = () => {
    const age = caseData.patient.age;
    const gender = caseData.patient.gender;
    
    if (age < 30) {
      return gender === 'Male' ? '👨' : '👩';
    } else if (age < 50) {
      return gender === 'Male' ? '👨‍💼' : '👩‍💼';
    } else {
      return gender === 'Male' ? '👨‍🦳' : '👩‍🦳';
    }
  };

  const getVitalSigns = () => {
    const age = caseData.patient.age;
    const caseTitle = caseData.title.toLowerCase();
    const system = caseData.system.toLowerCase();
    
    // Base vital signs for age
    let heartRate = age > 60 ? 75 : 70;
    let systolic = age > 50 ? 130 : 120;
    let diastolic = Math.floor(systolic * 0.65);
    let respiratoryRate = 16;
    let oxygenSat = 98;
    let temperature = 98.6;
    
    // Case-specific adjustments
    if (caseId === 'inf-001') { // Dog Bite Infection
      heartRate = 88;
      systolic = 128;
      diastolic = 82;
      respiratoryRate = 16;
      oxygenSat = 98;
      temperature = 100.2; // Fever from infection
    } else if (system.includes('cardio') || caseTitle.includes('chest') || caseTitle.includes('heart')) {
      heartRate += 25; // Tachycardia
      systolic += 20; // Hypertension
      diastolic += 15;
      oxygenSat -= 2; // Mild hypoxia
    } else if (system.includes('neuro') || caseTitle.includes('stroke') || caseTitle.includes('neuro')) {
      heartRate += 15;
      systolic += 30; // Significant hypertension
      diastolic += 20;
      respiratoryRate += 4;
    } else if (system.includes('infectious') || caseTitle.includes('fever') || caseTitle.includes('infection')) {
      heartRate += 20; // Fever response
      temperature += Math.random() * 3 + 1; // 99.6-102.6°F
      respiratoryRate += 2;
    }
    
    return {
      heartRate: Math.max(60, Math.min(140, heartRate)),
      bloodPressure: `${Math.max(90, Math.min(180, systolic))}/${Math.max(60, Math.min(110, diastolic))}`,
      respiratoryRate: Math.max(12, Math.min(30, respiratoryRate)),
      oxygenSat: Math.max(88, Math.min(100, oxygenSat)),
      temperature: Math.round(temperature * 10) / 10
    };
  };

  const getCaseSpecificDetails = () => {
    switch (caseId) {
      case 'inf-001':
        return {
          urgency: 'Moderate',
          lastSeen: '3 days ago at urgent care',
          currentStatus: 'Worsening symptoms with fever and increased pain',
          keyFindings: ['Infected bite wound on right hand', 'Fever 100.2°F', 'Redness and swelling around wound']
        };
      default:
        return {
          urgency: caseData.difficulty >= 4 ? 'High' : caseData.difficulty >= 3 ? 'Moderate' : 'Low',
          lastSeen: 'New presentation',
          currentStatus: 'Seeking medical evaluation',
          keyFindings: [caseData.patient.chiefComplaint]
        };
    }
  };

  const patientAvatar = getPatientAvatar();
  const vitalSigns = getVitalSigns();
  const caseDetails = getCaseSpecificDetails();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ←
          </button>
          <h1 className="text-2xl font-medium text-gray-900">Case Introduction</h1>
          <div className="w-8"></div>
        </div>

        {/* Patient Information */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-5xl">
            {patientAvatar}
          </div>
          <h2 className="text-3xl font-medium text-gray-900 mb-2">
            {caseData.patient.name}
          </h2>
          <p className="text-gray-600 mb-4 text-lg">
            {caseData.patient.age}-year-old {caseData.patient.gender}
          </p>
          
          {/* Chief Complaint */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Chief Complaint</h3>
            <p className="text-lg text-blue-800 font-medium">
              "{caseData.patient.chiefComplaint}"
            </p>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🫀</div>
            <div className="text-xl font-medium text-gray-900">{vitalSigns.heartRate}</div>
            <div className="text-sm text-gray-600">HR (bpm)</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🩺</div>
            <div className="text-xl font-medium text-gray-900">{vitalSigns.bloodPressure}</div>
            <div className="text-sm text-gray-600">BP (mmHg)</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🫁</div>
            <div className="text-xl font-medium text-gray-900">{vitalSigns.respiratoryRate}</div>
            <div className="text-sm text-gray-600">RR (/min)</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">💜</div>
            <div className="text-xl font-medium text-gray-900">{vitalSigns.oxygenSat}%</div>
            <div className="text-sm text-gray-600">O₂ Sat</div>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🌡️</div>
            <div className="text-xl font-medium text-gray-900">{vitalSigns.temperature}°F</div>
            <div className="text-sm text-gray-600">Temp</div>
          </div>
        </div>

        {/* Case Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Case Background */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Case Background</h3>
            <p className="text-gray-700 mb-4">{caseData.patient.background}</p>
            
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Medical System:</span>
                <span className="ml-2 text-gray-900">{caseData.system}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Urgency Level:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  caseDetails.urgency === 'High' ? 'bg-red-100 text-red-800' :
                  caseDetails.urgency === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {caseDetails.urgency}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Difficulty:</span>
                <span className="ml-2">
                  {[...Array(caseData.difficulty)].map((_, i) => (
                    <span key={i} className="text-yellow-500">💎</span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Clinical Summary</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Last Seen:</span>
                <span className="ml-2 text-gray-900">{caseDetails.lastSeen}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                <p className="text-gray-900 mt-1">{caseDetails.currentStatus}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Key Findings:</span>
                <ul className="mt-1 space-y-1">
                  {caseDetails.keyFindings.map((finding, index) => (
                    <li key={index} className="text-gray-900 text-sm">• {finding}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-lg transition-colors"
          >
            Begin Clinical Assessment →
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { gameState } = useGame();
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [showingCustomIntro, setShowingCustomIntro] = useState(false);

  // Check for case parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const caseParam = urlParams.get('case');
    if (caseParam) {
      setCurrentCaseId(caseParam);
      setShowingCustomIntro(true);
    }
  }, []);

  const handleStartCustomCase = () => {
    setShowingCustomIntro(false);
    // Clear URL parameter and redirect to GamePlay
    const url = new URL(window.location.href);
    url.searchParams.delete('case');
    window.history.replaceState({}, '', url.toString());
  };

  const handleBackFromCustomIntro = () => {
    setShowingCustomIntro(false);
    setCurrentCaseId(null);
    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('case');
    window.history.replaceState({}, '', url.toString());
  };



  const renderCurrentScreen = () => {
    console.log('App: renderCurrentScreen - isInGame:', gameState.isInGame, 'showCaseIntro:', gameState.showCaseIntro, 'showStepSelection:', gameState.showStepSelection, 'showXPCutscene:', gameState.showXPCutscene, 'showSummary:', gameState.showSummary);
    
    // Show custom case introduction if we have a case parameter
    if (showingCustomIntro && currentCaseId) {
      return (
        <CustomCaseIntroduction 
          caseId={currentCaseId}
          onStart={handleStartCustomCase}
          onBack={handleBackFromCustomIntro}
        />
      );
    }

    // Show GamePlay if we came from custom intro
    if (!showingCustomIntro && currentCaseId) {
      return <GamePlay caseId={currentCaseId} />;
    }
    
    if (gameState.isInGame) {
      console.log('App: rendering GamePlay');
      return <GamePlay />;
    }

    if (gameState.showXPCutscene) {
      console.log('App: rendering HistoryXPCutscene');
      return <HistoryXPCutscene />;
    }

    if (gameState.showStepSelection) {
      console.log('App: rendering StepSelection');
      return <StepSelection />;
    }

    if (gameState.showCaseIntro) {
      console.log('App: rendering CaseIntroduction');
      return <CaseIntroduction />;
    }

    if (gameState.showSummary) {
      // Save results to localStorage for case selection display
      if (gameState.xpCalculation && gameState.currentCase) {
        const caseId = gameState.currentCase.id;
        const averageScore = Math.round(
          gameState.currentStepResults.reduce((sum, step) => sum + step.score, 0) / gameState.currentStepResults.length
        );
        
        const results = {
          caseId,
          averageScore,
          performance: averageScore >= 90 ? 'excellent' : averageScore >= 80 ? 'good' : averageScore >= 60 ? 'poor' : 'failed',
          xpEarned: gameState.xpCalculation.finalXP,
          completedAt: new Date().toISOString(),
          stepResults: gameState.currentStepResults
        };
        
        localStorage.setItem(`case_${caseId}_results`, JSON.stringify(results));
        localStorage.setItem(`case_${caseId}_completed`, 'true');
        
        console.log('Saved case results to localStorage:', results);
      }

      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Case Complete!</h2>
              <p className="text-gray-600 mb-6">Great job completing this case!</p>
              
              {gameState.xpCalculation && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    +{gameState.xpCalculation.finalXP} XP
                  </div>
                  <div className="text-sm text-green-700">
                    Total XP: {gameState.progress.totalXP}
                  </div>
                </div>
              )}
              
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
                onClick={() => window.location.reload()}
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show unified case selection interface (like the screenshot)
    console.log('App: rendering unified CaseSelection');
    return <CaseSelection />;
  };

  return (
    <div className="app-container">
      {renderCurrentScreen()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
