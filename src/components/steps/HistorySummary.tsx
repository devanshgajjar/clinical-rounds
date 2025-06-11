import React from 'react';
import { CaseData } from '../../data/cases';
import { StepType } from '../../types/game';

interface HistorySummaryProps {
  caseData: CaseData;
  selectedAnswers: string[];
  onContinue: () => void;
}

const HistorySummary: React.FC<HistorySummaryProps> = ({ 
  caseData, 
  selectedAnswers, 
  onContinue 
}) => {
  console.log('HistorySummary - Received selectedAnswers:', selectedAnswers);
  
  const historyData = caseData.steps[StepType.HISTORY_TAKING];
  console.log('HistorySummary - Available questions:', historyData.questions.map(q => ({ id: q.id, text: q.text })));
  
  const selectedQuestions = historyData.questions.filter((q: any) => 
    selectedAnswers.includes(q.id)
  );
  
  console.log('HistorySummary - Filtered selectedQuestions:', selectedQuestions.map(q => ({ id: q.id, text: q.text })));

  const getQuestionsByCategory = () => {
    const categories = ['Present Illness', 'Past Medical', 'Social', 'Family', 'Review of Systems'];
    const grouped: Record<string, any[]> = {};
    
    categories.forEach(category => {
      grouped[category] = selectedQuestions.filter((q: any) => q.category === category);
    });
    
    return grouped;
  };

  const groupedQuestions = getQuestionsByCategory();

  const generatePatientResponse = (question: any) => {
    // Define consistent responses for each case and question ID
    
    // Exercise-Induced Syncope case responses (HCM in young athlete)
    if (caseData.id === 'card-001') {
      const exerciseSyncopeResponses: Record<string, string> = {
        'h1': 'I was doing wind sprints during basketball practice when I suddenly felt dizzy and collapsed. My teammate said I was out for about 30 seconds.',
        'h2': 'Yes, I had chest tightness and felt my heart pounding really hard right before I passed out. It was different from normal exercise breathlessness.',
        'h3': 'I\'ve felt dizzy a couple times during really intense practice, but I thought it was just being out of shape. This was the first time I actually fainted.',
        'h4': 'Yes, my dad died suddenly when he was 45. He collapsed while jogging - they said it was a massive heart attack. My uncle also had some heart problems.',
        'h5': 'Just a pre-workout supplement with caffeine and creatine. Sometimes energy drinks before games.',
        'h6': 'Never had any heart problems. I passed my sports physical last year with no issues.',
        'h7': 'I don\'t drink alcohol - coach doesn\'t allow it. But I do use pre-workout supplements and energy drinks.',
        'h8': 'No recent illness. I felt fine this morning.',
        'h9': 'I train hard pretty much every day - this was a typical intense practice.',
        'h10': 'Sometimes I get more winded than my teammates during the hardest drills, but I thought I just needed to get in better shape.'
      };
      
      if (exerciseSyncopeResponses[question.id]) {
        return exerciseSyncopeResponses[question.id];
      }
    }
    
    // Dog Bite case responses
    if (caseData.id === 'inf-001') {
      const dogBiteResponses: Record<string, string> = {
        'h1': '3 days ago, around 2 PM when I was walking my neighbor\'s dog',
        'h2': 'Yes, the dog is up to date on all vaccinations including rabies',
        'h3': 'I cleaned it with soap and water right away and applied antiseptic',
        'h4': 'Yes, I\'ve had chills and my temperature was 100.2°F this morning',
        'h5': 'I think my last tetanus shot was about 8 years ago',
        'h6': 'I\'m allergic to penicillin - it gives me a rash',
        'h7': 'No, I don\'t smoke',
        'h8': 'My mother has type 2 diabetes',
        'h9': 'No nausea or stomach problems',
        'h10': 'Yes, my hand feels numb and tingly, especially around the bite area'
      };
      
      if (dogBiteResponses[question.id]) {
        return dogBiteResponses[question.id];
      }
    }
    
    // Create a deterministic hash from question ID for consistent responses
    const getConsistentValue = (questionId: string, options: any[]) => {
      let hash = 0;
      for (let i = 0; i < questionId.length; i++) {
        hash = ((hash << 5) - hash + questionId.charCodeAt(i)) & 0xffffffff;
      }
      return options[Math.abs(hash) % options.length];
    };
    
    const questionText = question.text.toLowerCase();
    const caseType = caseData.system.toLowerCase();
    
    // Pain-related questions
    if (questionText.includes('pain')) {
      if (question.relevant) {
        const timeOptions = ['2 hours ago', '4 hours ago', '1 day ago', '2 days ago'];
        const timeFrame = getConsistentValue(question.id + '_time', timeOptions);
        return `Yes, I have ${caseType.includes('cardio') ? 'chest pain' : 'significant pain'} that started ${timeFrame}`;
      } else {
        return 'No significant pain right now';
      }
    }
    
    // Fever/temperature questions
    if (questionText.includes('fever') || questionText.includes('temperature')) {
      if (question.relevant) {
        const temps = ['100.1°F', '100.8°F', '101.2°F', '99.8°F'];
        const temp = getConsistentValue(question.id + '_temp', temps);
        return `Yes, my temperature has been ${temp}`;
      } else {
        return 'No fever, temperature has been normal';
      }
    }
    
    // Medication questions
    if (questionText.includes('medication') || questionText.includes('drug')) {
      if (question.relevant) {
        const commonMeds = ['lisinopril for blood pressure', 'metformin for diabetes', 'atorvastatin for cholesterol', 'aspirin daily'];
        const med = getConsistentValue(question.id + '_med', commonMeds);
        return `Yes, I take ${med}`;
      } else {
        return 'No regular medications';
      }
    }
    
    // Family history questions
    if (questionText.includes('family') || questionText.includes('mother') || questionText.includes('father')) {
      if (question.relevant) {
        const conditions = ['heart disease', 'diabetes', 'high blood pressure', 'sudden cardiac death'];
        const relatives = ['father', 'mother', 'brother'];
        const condition = getConsistentValue(question.id + '_condition', conditions);
        const relative = getConsistentValue(question.id + '_relative', relatives);
        return `Yes, my ${relative} had ${condition}`;
      } else {
        return 'No significant family history';
      }
    }
    
    // Timing questions
    if (questionText.includes('when') || questionText.includes('start')) {
      if (question.relevant) {
        const timeFrames = ['2 hours ago', 'this morning', 'yesterday', '3 days ago'];
        const timeFrame = getConsistentValue(question.id + '_start', timeFrames);
        return `It started ${timeFrame}`;
      } else {
        return 'I\'m not sure exactly when';
      }
    }
    
    // Default responses based on relevance and consistent hashing
    if (question.relevant) {
      const concerningResponses = [
        'Yes, this has been bothering me',
        'Yes, I noticed this recently', 
        'This started a few days ago',
        'Yes, it\'s been concerning me'
      ];
      return getConsistentValue(question.id + '_relevant', concerningResponses);
    } else {
      const normalResponses = [
        'No, nothing unusual',
        'No, that seems fine',
        'I haven\'t noticed anything like that',
        'No, that\'s not a problem'
      ];
      return getConsistentValue(question.id + '_normal', normalResponses);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Patient History Review
          </h1>
          <p className="text-gray-600">
            Review the information gathered from {caseData.patient.name}
          </p>
        </div>

        {/* Patient Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">👨‍⚕️</div>
            <div>
              <h3 className="font-medium text-gray-900">
                {caseData.patient.name}
              </h3>
              <p className="text-sm text-gray-600">
                {caseData.patient.age}-year-old {caseData.patient.gender}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Chief Complaint: {caseData.patient.chiefComplaint}
              </p>
            </div>
          </div>
        </div>

        {/* History by Category */}
        <div className="space-y-6 mb-8">
          {Object.entries(groupedQuestions).map(([category, questions]) => {
            if (questions.length === 0) return null;
            
            return (
              <div key={category} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {category}
                </h3>
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 font-medium">Q:</span>
                        <p className="text-gray-700">{question.text}</p>
                      </div>
                      <div className="flex items-start space-x-2 mt-2">
                        <span className="text-green-600 font-medium">A:</span>
                        <p className="text-gray-900 font-medium">
                          {generatePatientResponse(question)}
                        </p>
                      </div>
                      {question.relevant && (
                        <div className="mt-2 text-sm text-blue-600 font-medium">
                          ✓ Clinically relevant
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            History Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-medium text-gray-900">
                {selectedQuestions.length}
              </div>
              <div className="text-sm text-gray-600">Questions Asked</div>
            </div>
                         <div>
               <div className="text-2xl font-medium text-green-600">
                 {selectedQuestions.filter((q: any) => q.relevant).length}
               </div>
               <div className="text-sm text-gray-600">Relevant Findings</div>
             </div>
             <div>
               <div className="text-2xl font-medium text-yellow-600">
                 {selectedQuestions.filter((q: any) => !q.relevant).length}
               </div>
               <div className="text-sm text-gray-600">Non-Essential</div>
             </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorySummary; 