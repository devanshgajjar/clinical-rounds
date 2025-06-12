import React from 'react';
import { CaseData } from '../../data/cases';
import { StepType } from '../../types/game';
import { medicalTests } from '../../data/medicalOptions';
import { playSound } from '../../utils/soundManager';

interface TestResultsSummaryProps {
  caseData: CaseData;
  selectedTests: string[];
  onContinue: () => void;
}

const TestResultsSummary: React.FC<TestResultsSummaryProps> = ({ 
  caseData, 
  selectedTests, 
  onContinue 
}) => {
  const testsData = caseData.steps[StepType.ORDERING_TESTS];
  
  // Get ordered tests from the comprehensive medical database
  const orderedTests = medicalTests.filter(test => 
    selectedTests.includes(test.id)
  ).map(test => {
    // Check if this test is in the original case data to determine if it's necessary
    const originalTest = testsData.tests?.find((t: any) => t.id === test.id);
    return {
      ...test,
      necessary: originalTest?.necessary || false,
      contraindicated: originalTest?.contraindicated || false
    };
  });

  const getTestsByCategory = () => {
    const categories = ['Blood Work', 'Imaging', 'Cardiac', 'Microbiology', 'Serology', 'Monitoring'];
    const grouped: Record<string, any[]> = {};
    
    categories.forEach(category => {
      grouped[category] = orderedTests.filter((t: any) => t.category === category);
    });
    
    return grouped;
  };

  const groupedTests = getTestsByCategory();

  // Create a hash function for consistent values
  const getConsistentValue = (seed: string, min: number, max: number): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const normalized = Math.abs(hash) / 2147483647; // Normalize to 0-1
    return min + (normalized * (max - min));
  };

  const generateTestResult = (test: any) => {
    const caseType = caseData.system.toLowerCase();
    const caseId = caseData.id;
    const seed = `${caseId}-${test.id}`; // Consistent seed for this test in this case
    
    // Case-specific test results
    if (caseId === 'inf-001') { // Dog Bite case
      const dogBiteResults: Record<string, { value: string; reference: string; status: 'normal' | 'abnormal' | 'pending' }> = {
        't1': { // CBC
          value: 'WBC: 12.8 × 10³/μL, RBC: 4.2 × 10⁶/μL, Platelets: 285 × 10³/μL',
          reference: 'WBC: 4.0-11.0, RBC: 3.8-5.2, Platelets: 150-450',
          status: 'abnormal'
        },
        't20': { // Wound Swab Culture
          value: 'Moderate growth of Pasteurella multocida, Staphylococcus aureus',
          reference: 'No pathogenic organisms',
          status: 'abnormal'
        },
        't46': { // Rabies Virus Antibody
          value: 'Negative',
          reference: 'Negative',
          status: 'normal'
        },
        't47': { // Tetanus Toxoid
          value: 'Antibody level: 0.05 IU/mL',
          reference: '≥0.1 IU/mL for protection',
          status: 'abnormal'
        },
        't48': { // Vital Signs
          value: 'T: 100.2°F, BP: 128/82, HR: 88, RR: 16, O2 Sat: 98%',
          reference: 'T: 97-99°F, BP: <120/80, HR: 60-100, RR: 12-20, O2: >95%',
          status: 'abnormal'
        }
      };
      
      if (dogBiteResults[test.id]) {
        return dogBiteResults[test.id];
      }
    }
    
    // Generate dynamic results based on test type and case
    const testName = test.name.toLowerCase();
    
    // Blood Work
    if (test.category === 'Blood Work') {
      if (testName.includes('cbc') || testName.includes('complete blood count')) {
        const wbc = test.necessary ? 
          getConsistentValue(`${seed}-wbc`, 11.0, 15.0).toFixed(1) : 
          getConsistentValue(`${seed}-wbc`, 5.0, 9.0).toFixed(1);
        const rbc = getConsistentValue(`${seed}-rbc`, 4.0, 5.5).toFixed(1);
        const platelets = Math.floor(getConsistentValue(`${seed}-platelets`, 200, 400));
        return {
          value: `WBC: ${wbc} × 10³/μL, RBC: ${rbc} × 10⁶/μL, Platelets: ${platelets} × 10³/μL`,
          reference: 'WBC: 4.0-11.0, RBC: 3.8-5.2, Platelets: 150-450',
          status: test.necessary ? 'abnormal' : 'normal'
        };
      }
      
      if (testName.includes('glucose')) {
        const glucose = test.necessary ? 
          Math.floor(getConsistentValue(`${seed}-glucose`, 140, 200)) : 
          Math.floor(getConsistentValue(`${seed}-glucose`, 80, 120));
        return {
          value: `${glucose} mg/dL`,
          reference: '70-100 mg/dL (fasting)',
          status: glucose > 125 ? 'abnormal' : 'normal'
        };
      }
      
      if (testName.includes('crp') || testName.includes('c-reactive')) {
        const crp = test.necessary ? 
          getConsistentValue(`${seed}-crp`, 3.0, 13.0).toFixed(1) : 
          getConsistentValue(`${seed}-crp`, 0.5, 2.5).toFixed(1);
        return {
          value: `${crp} mg/L`,
          reference: '<3.0 mg/L',
          status: parseFloat(crp) > 3 ? 'abnormal' : 'normal'
        };
      }
    }
    
    // Imaging
    if (test.category === 'Imaging') {
      if (testName.includes('x-ray')) {
        return {
          value: test.necessary ? 
            `Findings suggestive of ${caseType.includes('infectious') ? 'soft tissue swelling' : 'abnormality'}` :
            'No acute abnormalities identified',
          reference: 'Normal anatomical structures',
          status: test.necessary ? 'abnormal' : 'normal'
        };
      }
      
      if (testName.includes('ct') || testName.includes('cat')) {
        return {
          value: test.necessary ? 
            `${caseType.includes('neuro') ? 'Ischemic changes noted' : 'Abnormal findings consistent with clinical presentation'}` :
            'No acute abnormalities',
          reference: 'Normal CT findings',
          status: test.necessary ? 'abnormal' : 'normal'
        };
      }
    }
    
    // Cardiac
    if (test.category === 'Cardiac') {
      if (testName.includes('ecg') || testName.includes('ekg')) {
        return {
          value: test.necessary ? 
            'Abnormal rhythm, ST changes noted' :
            'Normal sinus rhythm, rate 72 bpm',
          reference: 'Normal sinus rhythm 60-100 bpm',
          status: test.necessary ? 'abnormal' : 'normal'
        };
      }
      
      if (testName.includes('troponin')) {
        const troponin = test.necessary ? 
          getConsistentValue(`${seed}-troponin`, 0.1, 0.6).toFixed(2) : 
          getConsistentValue(`${seed}-troponin`, 0.01, 0.04).toFixed(2);
        return {
          value: `${troponin} ng/mL`,
          reference: '<0.04 ng/mL',
          status: parseFloat(troponin) > 0.04 ? 'abnormal' : 'normal'
        };
      }
    }
    
    // Microbiology
    if (test.category === 'Microbiology') {
      if (testName.includes('culture')) {
        return {
          value: test.necessary ? 
            `Growth of pathogenic organisms consistent with ${caseType} infection` :
            'No growth of pathogenic organisms',
          reference: 'No pathogenic organisms',
          status: test.necessary ? 'abnormal' : 'normal'
        };
      }
      
      if (testName.includes('blood culture')) {
        return {
          value: test.necessary ? 
            'Positive for gram-positive cocci in clusters' :
            'No growth after 48 hours',
          reference: 'No growth',
          status: test.necessary ? 'abnormal' : 'normal'
        };
      }
    }
    
    // Monitoring
    if (test.category === 'Monitoring') {
      const temp = test.necessary ? 
        getConsistentValue(`${seed}-temp`, 100.0, 103.0).toFixed(1) : 
        getConsistentValue(`${seed}-temp`, 98.0, 99.5).toFixed(1);
      const bp_sys = test.necessary ? 
        Math.floor(getConsistentValue(`${seed}-bp-sys`, 140, 170)) : 
        Math.floor(getConsistentValue(`${seed}-bp-sys`, 110, 130));
      const bp_dia = Math.floor(bp_sys * 0.6);
      const hr = test.necessary ? 
        Math.floor(getConsistentValue(`${seed}-hr`, 85, 110)) : 
        Math.floor(getConsistentValue(`${seed}-hr`, 70, 90));
      
      return {
        value: `T: ${temp}°F, BP: ${bp_sys}/${bp_dia}, HR: ${hr}, RR: 16, O2 Sat: 98%`,
        reference: 'T: 97-99°F, BP: <120/80, HR: 60-100, RR: 12-20, O2: >95%',
        status: (parseFloat(temp) > 99.5 || bp_sys > 130 || hr > 100) ? 'abnormal' : 'normal'
      };
    }
    
    // Default results
    return {
      value: test.necessary ? 
        'Results support clinical suspicion and are consistent with diagnosis' : 
        'Within normal limits',
      reference: 'Normal range',
      status: test.necessary ? 'abnormal' : 'normal'
    };
  };

  const necessaryTests = orderedTests.filter((t: any) => t.necessary);
  const unnecessaryTests = orderedTests.filter((t: any) => !t.necessary);

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Test Results
          </h1>
          <p className="text-gray-600">
            Review the diagnostic test results for {caseData.patient.name}
          </p>
        </div>

        {/* Test Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Test Summary
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-medium text-gray-900">
                {orderedTests.length}
              </div>
              <div className="text-sm text-gray-600">Tests Ordered</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-green-600">
                {necessaryTests.length}
              </div>
              <div className="text-sm text-gray-600">Necessary</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-yellow-600">
                {unnecessaryTests.length}
              </div>
              <div className="text-sm text-gray-600">Unnecessary</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-blue-600">
                {selectedTests.length}
              </div>
              <div className="text-sm text-gray-600">Total Selected</div>
            </div>
          </div>
        </div>

        {/* Test Results by Category */}
        <div className="space-y-6 mb-8">
          {Object.entries(groupedTests).map(([category, tests]) => {
            if (tests.length === 0) return null;
            
            return (
              <div key={category} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  {category === 'Blood Work' && '🩸'}
                  {category === 'Imaging' && '📷'}
                  {category === 'Cardiac' && '❤️'}
                  {category === 'Microbiology' && '🦠'}
                  {category === 'Serology' && '🧪'}
                  {category === 'Monitoring' && '📊'}
                  <span className="ml-2">{category}</span>
                </h3>
                <div className="space-y-4">
                  {tests.map((test: any) => {
                    const result = generateTestResult(test);
                    return (
                      <div key={test.id} className="border border-gray-100 rounded p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {test.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {test.necessary && (
                              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                Essential
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="mb-1">
                            <span className="font-medium text-gray-700">Result: </span>
                            <span className={`${result.status === 'abnormal' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                              {result.value}
                            </span>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Reference: </span>
                            {result.reference}
                          </div>
                          {result.status === 'abnormal' && (
                            <div className="mt-2 text-sm bg-red-50 text-red-700 px-2 py-1 rounded">
                              ⚠️ Abnormal - requires clinical attention
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Findings */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            🔍 Key Clinical Findings
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-red-500">•</span>
              <span>Elevated WBC count suggests active infection</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500">•</span>
              <span>Wound culture positive for Pasteurella multocida (common dog bite pathogen)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500">•</span>
              <span>Low tetanus antibody levels indicate need for booster</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500">•</span>
              <span>Rabies risk low with vaccinated animal</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-500">•</span>
              <span>Fever present, monitor for systemic infection</span>
            </li>
          </ul>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={() => {
              playSound.pageTransition();
              onContinue();
            }}
            onMouseEnter={() => playSound.buttonHover()}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultsSummary; 