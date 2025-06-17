import React from 'react';
import { useGame } from '../../context/GameContext';

const CaseIntroduction: React.FC = () => {
  const { gameState, startCase, dispatch } = useGame();
  const currentCase = gameState.currentCase;

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Case Not Found</h2>
          <button 
            onClick={() => dispatch({ type: 'BACK_TO_CASE_SELECTION' })}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Return to Cases
          </button>
        </div>
      </div>
    );
  }

  const handleStartCase = () => {
    startCase(currentCase.id);
  };

  const handleBack = () => {
    dispatch({ type: 'BACK_TO_CASE_SELECTION' });
  };

  // Generate mock vital signs based on case info for demonstration
  const getVitalSigns = () => {
    const age = currentCase.patientInfo.age;
    const baseHR = age > 60 ? 80 : 75;
    const baseBP = age > 50 ? 140 : 120;
    
    // Adjust based on case difficulty/type
    let hrModifier = 0;
    let bpModifier = 0;
    let o2Modifier = 0;
    let rrModifier = 0;

    if (currentCase.title.toLowerCase().includes('chest') || currentCase.title.toLowerCase().includes('cardiac')) {
      hrModifier = 25;
      bpModifier = 20;
      o2Modifier = -10;
    } else if (currentCase.title.toLowerCase().includes('hypertension')) {
      bpModifier = 30;
      hrModifier = 10;
    } else if (currentCase.title.toLowerCase().includes('stroke') || currentCase.title.toLowerCase().includes('neuro')) {
      bpModifier = 25;
      hrModifier = 15;
      rrModifier = 4;
    }

    return {
      heartRate: Math.max(60, Math.min(120, baseHR + hrModifier)),
      oxygenSat: Math.max(85, Math.min(100, 96 + o2Modifier)),
      bloodPressure: {
        systolic: Math.max(90, Math.min(180, baseBP + bpModifier)),
        diastolic: Math.max(60, Math.min(110, Math.floor((baseBP + bpModifier) * 0.6)))
      },
      respiratoryRate: Math.max(12, Math.min(30, 16 + rrModifier))
    };
  };

  const vitalSigns = getVitalSigns();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 text-2xl"
            title="Back to Cases"
            aria-label="Back to Cases"
          >
            ←
          </button>
          <h1 className="text-2xl font-medium text-gray-900">Case Introduction</h1>
          <div className="w-8"></div>
        </div>

        {/* Patient Information */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
            👨‍⚕️
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">
            {currentCase.patientInfo.name}
          </h2>
          <p className="text-gray-600 mb-4">
            {currentCase.patientInfo.age}-year-old {currentCase.patientInfo.gender}
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {currentCase.patientInfo.chiefComplaint}
          </p>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">💓</div>
            <div className="text-xl font-medium text-gray-900">{vitalSigns.heartRate}</div>
            <div className="text-sm text-gray-600">HR (bpm)</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🩺</div>
            <div className="text-xl font-medium text-gray-900">
              {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
            </div>
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
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartCase}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-lg"
          >
            Start Case →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseIntroduction; 