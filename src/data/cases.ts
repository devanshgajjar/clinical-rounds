import { 
  StepType, 
  Question, 
  Test, 
  DiagnosisOption,
  Treatment,
  CaseData,
  TestCategory,
  TreatmentCategory
} from '../types/game';

export const casesData: CaseData[] = [
  // INFECTIOUS DISEASE CASES
  {
    id: 'inf-001',
    title: 'Dog Bite Infection',
    system: 'Infectious Disease',
    difficulty: '3',
    patient: {
      name: 'Sarah Martinez',
      age: 28,
      gender: 'Male',
      chiefComplaint: 'Infected dog bite on right hand',
      background: 'Patient presents with an infected dog bite on the right hand that occurred 3 days ago.'
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'when-bite', text: 'When did the bite occur?', isRelevant: true, category: 'Present Illness' },
          { id: 'dog-vaccinated', text: 'Is the dog vaccinated against rabies?', isRelevant: true, category: 'Present Illness' },
          { id: 'tetanus-shot', text: 'When was your last tetanus shot?', isRelevant: true, category: 'Past Medical' },
          { id: 'pain-level', text: 'Rate your pain level (0-10)', isRelevant: true, category: 'Present Illness' },
          { id: 'fever', text: 'Do you have a fever?', isRelevant: true, category: 'Review of Systems' },
          { id: 'redness', text: 'Is there redness around the wound?', isRelevant: true, category: 'Present Illness' },
          { id: 'swelling', text: 'Is there swelling?', isRelevant: true, category: 'Present Illness' },
          { id: 'drainage', text: 'Is there any drainage from the wound?', isRelevant: true, category: 'Present Illness' },
          { id: 'favorite-color', text: 'What is your favorite color?', isRelevant: false, category: 'Social' },
          { id: 'pet-rock', text: 'Do you have a pet rock at home?', isRelevant: false, category: 'Social' },
          { id: 'recent-travel', text: 'Have you traveled to Antarctica recently?', isRelevant: false, category: 'Social' },
          { id: 'alien-abduction', text: 'Have you been abducted by aliens recently?', isRelevant: false, category: 'Review of Systems' },
          { id: 'superpowers', text: 'Did you develop any superpowers after the bite?', isRelevant: false, category: 'Review of Systems' }
        ],
        correctAnswers: ['when-bite', 'dog-vaccinated', 'tetanus-shot', 'pain-level', 'fever', 'redness', 'swelling', 'drainage'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 'cbc', name: 'Complete Blood Count', category: TestCategory.BLOOD_WORK, cost: 25, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'wound-culture', name: 'Wound Swab Culture', category: TestCategory.MICROBIOLOGY, cost: 45, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'rabies-ab', name: 'Rabies Virus Antibody', category: TestCategory.SERIOLOGY, cost: 60, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'tetanus-ab', name: 'Tetanus Toxoid', category: TestCategory.SERIOLOGY, cost: 30, necessary: true, synonyms: [], commonTerms: [] }
        ],
        correctTests: ['cbc', 'wound-culture', 'rabies-ab', 'tetanus-ab'],
        maxAllowed: 4
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'cellulitis-dog-bite', diagnosis: 'Cellulitis secondary to dog bite', correct: true, isCorrect: true, name: 'Cellulitis secondary to dog bite', text: 'Cellulitis secondary to dog bite', synonyms: [], commonTerms: [] },
          { id: 'rabies', diagnosis: 'Rabies infection', correct: false, isCorrect: false, name: 'Rabies infection', text: 'Rabies infection', synonyms: [], commonTerms: [] },
          { id: 'tetanus', diagnosis: 'Tetanus infection', correct: false, isCorrect: false, name: 'Tetanus infection', text: 'Tetanus infection', synonyms: [], commonTerms: [] },
          { id: 'simple-laceration', diagnosis: 'Simple laceration', correct: false, isCorrect: false, name: 'Simple laceration', text: 'Simple laceration', synonyms: [], commonTerms: [] }
        ],
        correctDiagnoses: ['cellulitis-dog-bite']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'augmentin', name: 'Amoxicillin-Clavulanate (Augmentin)', category: TreatmentCategory.MEDICATIONS, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'tetanus-booster', name: 'Tetanus Booster', category: TreatmentCategory.MEDICATIONS, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'wound-care', name: 'Wound Irrigation and Cleaning', category: TreatmentCategory.PROCEDURES, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'warm-compress', name: 'Warm Compresses', category: TreatmentCategory.LIFESTYLE, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'followup-48h', name: 'Follow-up in 48-72 hours', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] }
        ],
        correctTreatments: ['augmentin', 'tetanus-booster', 'wound-care', 'warm-compress', 'followup-48h'],
        maxAllowed: 5
      }
    },
    reactions: {
      patient: {
        excellent: 'Thank you doctor, I feel much better now!',
        good: 'Thanks for your help.',
        poor: 'I hope this treatment works.',
        failed: 'I think I need a second opinion.'
      },
      mentor: {
        excellent: 'Excellent work! You handled this case perfectly.',
        good: 'Good job, but there\'s room for improvement.',
        poor: 'You missed some important steps.',
        failed: 'This case needs to be reviewed carefully.'
      }
    },
    isEmergency: true,
    scoring: {
      baseXP: 100,
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    }
  },

  // CARDIOLOGY CASE - Exercise-Induced Syncope (HCM)
  {
    id: 'card-001',
    title: 'Exercise-Induced Syncope',
    system: 'Cardiology',
    difficulty: 'medium',
    patient: {
      name: 'Robert Wilson',
      age: 19,
      gender: 'Male',
      chiefComplaint: 'Collapsed during basketball practice',
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'syncope-timing', text: 'When did the fainting episode occur?', isRelevant: true, category: 'Present Illness' },
          { id: 'exercise-relation', text: 'Was it during or right after exercise?', isRelevant: true, category: 'Present Illness' },
          { id: 'prior-episodes', text: 'Any previous fainting episodes?', isRelevant: true, category: 'Past Medical' },
          { id: 'chest-pain', text: 'Any chest pain or pressure?', isRelevant: true, category: 'Present Illness' },
          { id: 'family-cardiac', text: 'Family history of heart problems or sudden death?', isRelevant: true, category: 'Family' },
          { id: 'medications', text: 'Are you taking any medications?', isRelevant: true, category: 'Past Medical' },
          { id: 'palpitations', text: 'Any palpitations or racing heart?', isRelevant: true, category: 'Present Illness' },
          { id: 'shortness-breath', text: 'Any shortness of breath with exercise?', isRelevant: true, category: 'Present Illness' },
          { id: 'favorite-color', text: 'What is your favorite color?', isRelevant: false, category: 'Social' },
          { id: 'pet-rock', text: 'Do you have a pet rock at home?', isRelevant: false, category: 'Social' },
          { id: 'recent-travel', text: 'Have you traveled to Antarctica recently?', isRelevant: false, category: 'Social' },
          { id: 'alien-abduction', text: 'Have you been abducted by aliens recently?', isRelevant: false, category: 'Review of Systems' },
          { id: 'superpowers', text: 'Did you develop any superpowers after the episode?', isRelevant: false, category: 'Review of Systems' }
        ],
        correctAnswers: ['syncope-timing', 'exercise-relation', 'prior-episodes', 'chest-pain', 'family-cardiac', 'medications', 'palpitations', 'shortness-breath'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          // Essential cardiac workup
          { id: 'ecg', name: 'ECG (12-lead)', category: TestCategory.CARDIAC, cost: 50, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'echo', name: 'Echocardiogram', category: TestCategory.CARDIAC, cost: 350, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'bmp', name: 'Basic Metabolic Panel', category: TestCategory.BLOOD_WORK, cost: 35, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'cbc', name: 'Complete Blood Count', category: TestCategory.BLOOD_WORK, cost: 25, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'troponin', name: 'Troponin I', category: TestCategory.CARDIAC, cost: 75, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'bnp', name: 'BNP or NT-proBNP', category: TestCategory.CARDIAC, cost: 85, necessary: false, synonyms: [], commonTerms: [] },
          
          // Advanced cardiac tests - appropriate for HCM evaluation
          { id: 'cardiac-mri', name: 'Cardiac MRI', category: TestCategory.CARDIAC, cost: 1200, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'holter', name: 'Holter Monitor (24-48hr)', category: TestCategory.CARDIAC, cost: 200, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'stress-test', name: 'Exercise Stress Test', category: TestCategory.CARDIAC, cost: 400, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'event-monitor', name: 'Event Monitor', category: TestCategory.CARDIAC, cost: 300, necessary: false, synonyms: [], commonTerms: [] },
          
          // Basic imaging and other tests
          { id: 'chest-xray', name: 'Chest X-ray', category: TestCategory.IMAGING, cost: 80, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'tsh', name: 'TSH (Thyroid Function)', category: TestCategory.HORMONES, cost: 45, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'urinalysis', name: 'Urinalysis', category: TestCategory.URINALYSIS, cost: 25, necessary: false, synonyms: [], commonTerms: [] },
          
          // Inappropriate/dangerous tests
          { id: 'head-ct', name: 'Head CT', category: TestCategory.NEUROLOGICAL, cost: 400, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'eeg', name: 'EEG', category: TestCategory.NEUROLOGICAL, cost: 500, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'lumbar-puncture', name: 'Lumbar Puncture', category: TestCategory.NEUROLOGICAL, cost: 800, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'sports-physical', name: 'Immediate Return to Sports Physical', category: TestCategory.BLOOD_WORK, cost: 100, necessary: false, synonyms: [], commonTerms: [] }
        ],
        correctTests: ['ecg', 'echo', 'bmp'], // ECG, Echo, BMP are essential first steps
        maxAllowed: 4
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'hcm-syncope', diagnosis: 'Hypertrophic Cardiomyopathy with Exercise-Induced Syncope', correct: true, isCorrect: true, name: 'Hypertrophic Cardiomyopathy with Exercise-Induced Syncope', text: 'Hypertrophic Cardiomyopathy with Exercise-Induced Syncope', synonyms: [], commonTerms: [] },
          { id: 'arvc', diagnosis: 'Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC)', correct: false, isCorrect: false, name: 'Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC)', text: 'Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC)', synonyms: [], commonTerms: [] },
          { id: 'vasovagal', diagnosis: 'Vasovagal Syncope', correct: false, isCorrect: false, name: 'Vasovagal Syncope', text: 'Vasovagal Syncope', synonyms: [], commonTerms: [] },
          { id: 'long-qt', diagnosis: 'Long QT Syndrome', correct: false, isCorrect: false, name: 'Long QT Syndrome', text: 'Long QT Syndrome', synonyms: [], commonTerms: [] },
          { id: 'dehydration', diagnosis: 'Exercise-Induced Dehydration', correct: false, isCorrect: false, name: 'Exercise-Induced Dehydration', text: 'Exercise-Induced Dehydration', synonyms: [], commonTerms: [] },
          { id: 'cpvt', diagnosis: 'Catecholaminergic Polymorphic Ventricular Tachycardia (CPVT)', correct: false, isCorrect: false, name: 'Catecholaminergic Polymorphic Ventricular Tachycardia (CPVT)', text: 'Catecholaminergic Polymorphic Ventricular Tachycardia (CPVT)', synonyms: [], commonTerms: [] }
        ],
        correctDiagnoses: ['hcm-syncope']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'sports-restriction', name: 'Immediate restriction from competitive sports', category: TreatmentCategory.LIFESTYLE, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'cardiology-referral', name: 'Urgent cardiology/electrophysiology referral', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'family-screening', name: 'Family screening for HCM (first-degree relatives)', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'genetic-counseling', name: 'Genetic counseling referral', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'beta-blocker', name: 'Beta-blocker therapy (if symptomatic)', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'disopyramide', name: 'Disopyramide for LVOT obstruction', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'icd-eval', name: 'ICD evaluation for high-risk features', category: TreatmentCategory.PROCEDURES, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'myectomy-eval', name: 'Septal myectomy evaluation', category: TreatmentCategory.PROCEDURES, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'return-sports', name: 'Clear to return to sports immediately', category: TreatmentCategory.LIFESTYLE, necessary: false, synonyms: [], commonTerms: [], contraindicated: true },
          { id: 'ace-inhibitor', name: 'ACE inhibitor therapy', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [], contraindicated: true },
          { id: 'intense-exercise', name: 'Encourage intense exercise training', category: TreatmentCategory.LIFESTYLE, necessary: false, synonyms: [], commonTerms: [], contraindicated: true },
          { id: 'no-followup', name: 'Discharge home without follow-up', category: TreatmentCategory.FOLLOW_UP, necessary: false, synonyms: [], commonTerms: [], contraindicated: true }
        ],
        correctTreatments: ['sports-restriction', 'cardiology-referral', 'family-screening', 'genetic-counseling'],
        maxAllowed: 5
      }
    },
    reactions: {
      patient: {
        excellent: "I'm grateful you found this. I had no idea my heart condition was so serious. I'll follow all your recommendations.",
        good: "Thank you for the thorough evaluation. I understand I need to be more careful with exercise.",
        poor: "I'm still a bit confused about what's wrong, but I'll follow up with cardiology.",
        failed: "I'm worried we haven't figured out why I'm fainting. Should I avoid all exercise?"
      },
      mentor: {
        excellent: "Outstanding diagnosis! HCM with exercise-induced syncope requires immediate activity restriction and family screening.",
        good: "Well done identifying this high-risk cardiac condition. The management plan is appropriate.",
        poor: "You're on the right track, but ensure you emphasize the importance of activity restriction in HCM.",
        failed: "Exercise-induced syncope in a young patient requires urgent cardiac evaluation. This could be life-threatening."
      }
    },
    isEmergency: true,
  },

  // NEUROLOGY CASE
  {
    id: 'neuro-001',
    title: 'Acute Stroke Presentation',
    system: 'Neurology',
    difficulty: 'medium',
    patient: {
      name: 'Eleanor Thompson',
      age: 67,
      gender: 'Female',
      chiefComplaint: 'Sudden speech difficulty and weakness',
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'symptom-onset', text: 'When did the symptoms start?', isRelevant: true, category: 'Present Illness' },
          { id: 'weakness-location', text: 'Which side is weak?', isRelevant: true, category: 'Present Illness' },
          { id: 'speech-changes', text: 'Any changes in speech?', isRelevant: true, category: 'Present Illness' },
          { id: 'headache', text: 'Any headache?', isRelevant: true, category: 'Present Illness' },
          { id: 'vision-changes', text: 'Any vision changes?', isRelevant: true, category: 'Present Illness' },
          { id: 'medications-stroke', text: 'Are you on blood thinners?', isRelevant: true, category: 'Past Medical' },
          { id: 'prior-stroke', text: 'Any previous strokes or TIAs?', isRelevant: true, category: 'Past Medical' },
          { id: 'last-normal', text: 'When were you last normal?', isRelevant: true, category: 'Present Illness' },
          { id: 'favorite-color', text: 'What is your favorite color?', isRelevant: false, category: 'Social' },
          { id: 'pet-rock', text: 'Do you have a pet rock at home?', isRelevant: false, category: 'Social' },
          { id: 'recent-travel', text: 'Have you traveled to Antarctica recently?', isRelevant: false, category: 'Social' },
          { id: 'alien-abduction', text: 'Have you been abducted by aliens recently?', isRelevant: false, category: 'Review of Systems' },
          { id: 'superpowers', text: 'Did you develop any superpowers after the stroke?', isRelevant: false, category: 'Review of Systems' }
        ],
        correctAnswers: ['symptom-onset', 'weakness-location', 'speech-changes', 'headache', 'vision-changes', 'medications-stroke', 'prior-stroke', 'last-normal'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 'non-contrast-head-ct', name: 'Non-contrast Head CT', category: TestCategory.IMAGING, cost: 400, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'ecg', name: 'ECG', category: TestCategory.CARDIAC, cost: 50, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'bmp', name: 'Basic Metabolic Panel', category: TestCategory.BLOOD_WORK, cost: 30, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'pt-inr', name: 'PT/INR', category: TestCategory.BLOOD_WORK, cost: 25, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'ct-angiogram-head-neck', name: 'CT Angiogram Head/Neck', category: TestCategory.IMAGING, cost: 800, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'lumbar-puncture', name: 'Lumbar Puncture', category: TestCategory.NEUROLOGICAL, cost: 200, necessary: false, synonyms: [], commonTerms: [] }
        ],
        correctTests: ['non-contrast-head-ct', 'ecg', 'bmp', 'pt-inr', 'ct-angiogram-head-neck'],
        maxAllowed: 6
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'acute-stroke', diagnosis: 'Acute Ischemic Stroke', correct: true, isCorrect: true, name: 'Acute Ischemic Stroke', text: 'Acute Ischemic Stroke', synonyms: [], commonTerms: [] },
          { id: 'tia', diagnosis: 'Transient Ischemic Attack', correct: false, isCorrect: false, name: 'Transient Ischemic Attack', text: 'Transient Ischemic Attack', synonyms: [], commonTerms: [] },
          { id: 'hemorrhage', diagnosis: 'Intracranial Hemorrhage', correct: false, isCorrect: false, name: 'Intracranial Hemorrhage', text: 'Intracranial Hemorrhage', synonyms: [], commonTerms: [] },
          { id: 'bells-palsy', diagnosis: "Bell's Palsy", correct: false, isCorrect: false, name: "Bell's Palsy", text: "Bell's Palsy", synonyms: [], commonTerms: [] },
          { id: 'migraine', diagnosis: 'Complex Migraine', correct: false, isCorrect: false, name: 'Complex Migraine', text: 'Complex Migraine', synonyms: [], commonTerms: [] }
        ],
        correctDiagnoses: ['acute-stroke']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'tpa', name: 'Alteplase (tPA) if within window', category: TreatmentCategory.MEDICATIONS, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'aspirin', name: 'Aspirin 325mg', category: TreatmentCategory.MEDICATIONS, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'neuro-consult', name: 'Neurology consultation', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'stroke-unit', name: 'Admit to stroke unit', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'speech-therapy', name: 'Speech therapy evaluation', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'anticoagulation', name: 'Immediate anticoagulation', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [], contraindicated: true }
        ],
        correctTreatments: ['tpa', 'aspirin', 'neuro-consult', 'stroke-unit', 'speech-therapy'],
        maxAllowed: 6
      }
    },
    reactions: {
      patient: {
        excellent: "I can already feel some improvement in my speech. Thank you for acting so quickly, doctor.",
        good: "Thank you for your quick response. I'm hopeful about my recovery.",
        poor: "I'm scared about what this means for my future, but I trust your care.",
        failed: "I'm very worried. Are you sure we're doing everything we can for my stroke?"
      },
      mentor: {
        excellent: "Exceptional stroke management! Time is brain - your rapid diagnosis and tPA administration was crucial.",
        good: "Well executed stroke protocol. Early recognition and treatment optimization are key to good outcomes.",
        poor: "Adequate stroke care, but remember time is critical. Review the stroke treatment timeline.",
        failed: "This is a stroke emergency requiring immediate thrombolytic therapy. Every minute counts in stroke care."
      }
    },
    isEmergency: true,
  },

  // GASTROINTESTINAL CASE - Acute Appendicitis
  {
    id: 'gastro-001',
    title: 'Acute Abdominal Pain',
    shortDescription: '22M with severe abdominal pain',
    avatar: '🤢',
    xpReward: 30,
    stars: 4,
    unlocked: true,
    system: 'Gastroenterology',
    difficulty: 'medium',
    patient: {
      name: 'Michael Chen',
      age: 22,
      gender: 'Male',
      chiefComplaint: 'Severe abdominal pain for 8 hours',
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'h1', text: 'Where did the pain start and how has it changed?', isRelevant: true, category: 'Present Illness' },
          { id: 'h2', text: 'When was the last time you ate?', isRelevant: true, category: 'Present Illness' },
          { id: 'h3', text: 'Any nausea or vomiting?', isRelevant: true, category: 'Present Illness' },
          { id: 'h4', text: 'Any fever or chills?', isRelevant: true, category: 'Present Illness' },
          { id: 'h5', text: 'Have you had your appendix removed?', isRelevant: true, category: 'Past Medical' },
          { id: 'h6', text: 'Any recent travel or unusual foods?', isRelevant: false, category: 'Social' },
          { id: 'h7', text: 'Any family history of inflammatory bowel disease?', isRelevant: false, category: 'Family' },
          { id: 'h8', text: 'Does movement or coughing make the pain worse?', isRelevant: true, category: 'Present Illness' },
          { id: 'h9', text: 'Any changes in bowel movements?', isRelevant: true, category: 'Present Illness' },
          { id: 'h10', text: 'Any urinary symptoms?', isRelevant: true, category: 'Present Illness' },
          { id: 'favorite-color', text: 'What is your favorite color?', isRelevant: false, category: 'Social' },
          { id: 'pet-rock', text: 'Do you have a pet rock at home?', isRelevant: false, category: 'Social' },
          { id: 'recent-travel', text: 'Have you traveled to Antarctica recently?', isRelevant: false, category: 'Social' },
          { id: 'alien-abduction', text: 'Have you been abducted by aliens recently?', isRelevant: false, category: 'Review of Systems' },
          { id: 'superpowers', text: 'Did you develop any superpowers after the pain?', isRelevant: false, category: 'Review of Systems' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h8', 'h9'],
        minimumRequired: 5
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 'ankle-xray', name: 'Ankle X-ray (3 views)', category: TestCategory.IMAGING, cost: 120, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'neurovascular-assessment', name: 'Neurovascular Assessment', category: TestCategory.NEUROLOGICAL, cost: 0, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'foot-xray', name: 'Foot X-ray', category: TestCategory.IMAGING, cost: 100, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'mri-ankle', name: 'Ankle MRI', category: TestCategory.IMAGING, cost: 800, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'ct-ankle', name: 'CT Ankle', category: TestCategory.IMAGING, cost: 400, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'cbc', name: 'Complete Blood Count', category: TestCategory.BLOOD_WORK, cost: 25, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'bmp', name: 'Basic Metabolic Panel', category: TestCategory.BLOOD_WORK, cost: 30, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'pt-inr', name: 'Prothrombin Time (PT/INR)', category: TestCategory.BLOOD_WORK, cost: 35, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'ankle-us', name: 'Ankle Ultrasound', category: TestCategory.IMAGING, cost: 200, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'bone-scan', name: 'Bone Scan', category: TestCategory.IMAGING, cost: 600, necessary: false, synonyms: [], commonTerms: [] }
        ],
        correctTests: ['ankle-xray', 'neurovascular-assessment'],
        maxAllowed: 3
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'lateral-malleolus-fracture', diagnosis: 'Lateral Malleolus Fracture (Weber B)', correct: true, isCorrect: true, name: 'Lateral Malleolus Fracture (Weber B)', text: 'Lateral Malleolus Fracture (Weber B)', synonyms: [], commonTerms: [] },
          { id: 'ankle-sprain', diagnosis: 'Ankle Sprain', correct: false, isCorrect: false, name: 'Ankle Sprain', text: 'Ankle Sprain', synonyms: [], commonTerms: [] },
          { id: 'achilles-rupture', diagnosis: 'Achilles Tendon Rupture', correct: false, isCorrect: false, name: 'Achilles Tendon Rupture', text: 'Achilles Tendon Rupture', synonyms: [], commonTerms: [] },
          { id: 'calcaneus-fracture', diagnosis: 'Calcaneus Fracture', correct: false, isCorrect: false, name: 'Calcaneus Fracture', text: 'Calcaneus Fracture', synonyms: [], commonTerms: [] },
          { id: 'contusion', diagnosis: 'Soft Tissue Contusion', correct: false, isCorrect: false, name: 'Soft Tissue Contusion', text: 'Soft Tissue Contusion', synonyms: [], commonTerms: [] }
        ],
        correctDiagnoses: ['lateral-malleolus-fracture']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'surgical-consult', name: 'Urgent surgical consultation', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'npo', name: 'NPO (nothing by mouth)', category: TreatmentCategory.LIFESTYLE, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'iv-fluids', name: 'IV Fluid Resuscitation', category: TreatmentCategory.PROCEDURES, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'morphine', name: 'Morphine', category: TreatmentCategory.MEDICATIONS, dosage: '2-4mg IV q4h PRN', necessary: true, synonyms: [], commonTerms: [] },
          { id: 'cefoxitin', name: 'Cefoxitin', category: TreatmentCategory.MEDICATIONS, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'oral-pain-discharge', name: 'Oral pain medications and discharge', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [], contraindicated: true },
          { id: 'antacids', name: 'Antacids', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [] }
        ],
        correctTreatments: ['surgical-consult', 'npo', 'iv-fluids', 'morphine', 'cefoxitin'],
        maxAllowed: 6
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you for acting so quickly! I was really scared about the pain.",
        good: "I'm glad we figured out what's wrong. When will the surgery be?",
        poor: "I'm still worried about the surgery, but I trust your judgment.",
        failed: "Should I be concerned that the pain is getting worse?"
      },
      mentor: {
        excellent: "Excellent recognition of classic appendicitis presentation with appropriate urgent surgical referral.",
        good: "Good clinical diagnosis of appendicitis. The CT confirmed your suspicion.",
        poor: "Consider the classic migration pattern in appendicitis from periumbilical to RLQ.",
        failed: "This classic appendicitis presentation requires urgent surgical evaluation to prevent complications."
      }
    },
    isEmergency: true,
  },

  // ENDOCRINOLOGY CASE - Type 1 Diabetes Presentation
  {
    id: 'endo-001',
    title: 'New-Onset Diabetes',
    shortDescription: '16F with increased thirst',
    avatar: '💉',
    xpReward: 25,
    stars: 3,
    unlocked: true,
    system: 'Endocrinology',
    difficulty: 'medium',
    patient: {
      name: 'Ashley Rodriguez',
      age: 16,
      gender: 'Female',
      chiefComplaint: 'Increased thirst and frequent urination',
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'thirst-duration', text: 'How long have you been experiencing increased thirst?', isRelevant: true, category: 'Present Illness' },
          { id: 'urination-freq', text: 'How often are you urinating?', isRelevant: true, category: 'Present Illness' },
          { id: 'weight-loss', text: 'Have you lost weight recently?', isRelevant: true, category: 'Present Illness' },
          { id: 'fatigue', text: 'Are you feeling more tired than usual?', isRelevant: true, category: 'Present Illness' },
          { id: 'vision-blurry', text: 'Any blurry vision?', isRelevant: true, category: 'Present Illness' },
          { id: 'family-diabetes', text: 'Any family history of diabetes?', isRelevant: true, category: 'Family' },
          { id: 'diet-changes', text: 'Any recent changes in diet?', isRelevant: true, category: 'Present Illness' },
          { id: 'exercise-habits', text: 'What are your exercise habits?', isRelevant: true, category: 'Present Illness' },
          { id: 'favorite-color', text: 'What is your favorite color?', isRelevant: false, category: 'Social' },
          { id: 'pet-rock', text: 'Do you have a pet rock at home?', isRelevant: false, category: 'Social' },
          { id: 'recent-travel', text: 'Have you traveled to Antarctica recently?', isRelevant: false, category: 'Social' },
          { id: 'alien-abduction', text: 'Have you been abducted by aliens recently?', isRelevant: false, category: 'Review of Systems' },
          { id: 'superpowers', text: 'Did you develop any superpowers after the increased thirst?', isRelevant: false, category: 'Review of Systems' }
        ],
        correctAnswers: ['thirst-duration', 'urination-freq', 'weight-loss', 'fatigue', 'vision-blurry', 'family-diabetes', 'diet-changes', 'exercise-habits'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 'glucose', name: 'Blood Glucose (Random)', category: TestCategory.BLOOD_WORK, cost: 15, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'hba1c', name: 'HbA1c', category: TestCategory.BLOOD_WORK, cost: 30, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'urinalysis-ketones', name: 'Urinalysis with Ketones', category: TestCategory.URINALYSIS, cost: 25, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'bmp', name: 'Basic Metabolic Panel', category: TestCategory.BLOOD_WORK, cost: 30, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'abg', name: 'Arterial Blood Gas (ABG)', category: TestCategory.BLOOD_WORK, cost: 40, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'c-peptide', name: 'C-peptide', category: TestCategory.HORMONES, cost: 45, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'anti-gad', name: 'Anti-GAD antibodies', category: TestCategory.SERIOLOGY, cost: 75, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'thyroid-func', name: 'Thyroid Function Tests', category: TestCategory.HORMONES, cost: 40, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'cbc', name: 'Complete Blood Count', category: TestCategory.BLOOD_WORK, cost: 25, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'lipid-panel', name: 'Lipid Panel', category: TestCategory.BLOOD_WORK, cost: 25, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'abdominal-ct', name: 'Abdominal CT', category: TestCategory.IMAGING, cost: 450, necessary: false, synonyms: [], commonTerms: [] }
        ],
        correctTests: ['glucose', 'hba1c', 'urinalysis-ketones', 'bmp', 'abg'],
        maxAllowed: 5
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'type1-dm', diagnosis: 'Type 1 Diabetes Mellitus', correct: true, isCorrect: true, name: 'Type 1 Diabetes Mellitus', text: 'Type 1 Diabetes Mellitus', synonyms: [], commonTerms: [] },
          { id: 'type2-dm', diagnosis: 'Type 2 Diabetes Mellitus', correct: false, isCorrect: false, name: 'Type 2 Diabetes Mellitus', text: 'Type 2 Diabetes Mellitus', synonyms: [], commonTerms: [] },
          { id: 'diabetes-insipidus', diagnosis: 'Diabetes Insipidus', correct: false, isCorrect: false, name: 'Diabetes Insipidus', text: 'Diabetes Insipidus', synonyms: [], commonTerms: [] },
          { id: 'hyperthyroidism', diagnosis: 'Hyperthyroidism', correct: false, isCorrect: false, name: 'Hyperthyroidism', text: 'Hyperthyroidism', synonyms: [], commonTerms: [] },
          { id: 'uti', diagnosis: 'Urinary Tract Infection', correct: false, isCorrect: false, name: 'Urinary Tract Infection', text: 'Urinary Tract Infection', synonyms: [], commonTerms: [] }
        ],
        correctDiagnoses: ['type1-dm']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'insulin', name: 'Insulin therapy (long and short-acting)', category: TreatmentCategory.MEDICATIONS, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'diabetes-edu', name: 'Diabetes education and counseling', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'glucose-monitor', name: 'Blood glucose monitoring supplies', category: TreatmentCategory.PROCEDURES, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'endo-referral', name: 'Endocrinology referral', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'nutrition', name: 'Nutritionist consultation', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'metformin', name: 'Metformin therapy', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [], contraindicated: true },
          { id: 'low-carb', name: 'Low-carb diet only', category: TreatmentCategory.LIFESTYLE, necessary: false, synonyms: [], commonTerms: [], contraindicated: true }
        ],
        correctTreatments: ['insulin', 'diabetes-edu', 'glucose-monitor', 'endo-referral', 'nutrition'],
        maxAllowed: 6
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you for explaining everything so clearly. I feel less scared about managing this.",
        good: "This is a lot to take in, but I'm ready to learn about diabetes management.",
        poor: "I'm overwhelmed but I'll try to follow all the instructions.",
        failed: "Will I need to take insulin for the rest of my life?"
      },
      mentor: {
        excellent: "Excellent recognition of new-onset Type 1 diabetes with comprehensive management planning.",
        good: "Good diagnosis of Type 1 DM. The patient will need extensive diabetes education.",
        poor: "Remember that Type 1 diabetes in adolescents requires immediate insulin therapy.",
        failed: "This classic Type 1 diabetes presentation requires immediate insulin therapy and diabetes education."
      }
    },
    isEmergency: true,
  },

  // ORTHOPEDIC CASE - Ankle Fracture
  {
    id: 'ortho-001',
    title: 'Ankle Injury After Fall',
    shortDescription: '35M construction worker injury',
    avatar: '🦴',
    xpReward: 20,
    stars: 2,
    unlocked: true,
    system: 'Orthopedics',
    difficulty: 'medium',
    patient: {
      name: 'David Thompson',
      age: 35,
      gender: 'Male',
      chiefComplaint: 'Ankle pain after falling off ladder',
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'injury-mechanism', text: 'How did the injury occur?', isRelevant: true, category: 'Present Illness' },
          { id: 'weight-bearing', text: 'Can you take 4 steps immediately after injury?', isRelevant: true, category: 'Present Illness' },
          { id: 'malleoli-tender', text: 'Is there tenderness over the malleoli bones?', isRelevant: true, category: 'Present Illness' },
          { id: 'foot-numbness', text: 'Any numbness or tingling in your foot?', isRelevant: true, category: 'Present Illness' },
          { id: 'toe-sensation', text: 'Can you feel your toes normally?', isRelevant: true, category: 'Present Illness' },
          { id: 'prior-ankle', text: 'Any previous ankle injuries?', isRelevant: true, category: 'Past Medical' },
          { id: 'blood-thinners', text: 'Are you taking any blood thinners?', isRelevant: true, category: 'Past Medical' },
          { id: 'diabetes', text: 'Do you have diabetes or circulation problems?', isRelevant: true, category: 'Past Medical' },
          { id: 'pain-meds-allergy', text: 'Any allergies to pain medications?', isRelevant: true, category: 'Past Medical' },
          { id: 'favorite-color', text: 'What is your favorite color?', isRelevant: false, category: 'Social' },
          { id: 'pet-rock', text: 'Do you have a pet rock at home?', isRelevant: false, category: 'Social' },
          { id: 'recent-travel', text: 'Have you traveled to Antarctica recently?', isRelevant: false, category: 'Social' },
          { id: 'alien-abduction', text: 'Have you been abducted by aliens recently?', isRelevant: false, category: 'Review of Systems' },
          { id: 'superpowers', text: 'Did you develop any superpowers after the injury?', isRelevant: false, category: 'Review of Systems' }
        ],
        correctAnswers: ['injury-mechanism', 'weight-bearing', 'malleoli-tender', 'foot-numbness', 'toe-sensation', 'prior-ankle', 'blood-thinners', 'diabetes', 'pain-meds-allergy'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 'ankle-xray', name: 'Ankle X-ray (3 views)', category: TestCategory.IMAGING, cost: 120, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'neurovascular-assessment', name: 'Neurovascular Assessment', category: TestCategory.NEUROLOGICAL, cost: 0, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'foot-xray', name: 'Foot X-ray', category: TestCategory.IMAGING, cost: 100, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'mri-ankle', name: 'Ankle MRI', category: TestCategory.IMAGING, cost: 800, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'ct-ankle', name: 'CT Ankle', category: TestCategory.IMAGING, cost: 400, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'cbc', name: 'Complete Blood Count', category: TestCategory.BLOOD_WORK, cost: 25, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'bmp', name: 'Basic Metabolic Panel', category: TestCategory.BLOOD_WORK, cost: 30, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'coag-studies', name: 'Coagulation Studies', category: TestCategory.BLOOD_WORK, cost: 35, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'ankle-us', name: 'Ankle Ultrasound', category: TestCategory.IMAGING, cost: 200, necessary: false, synonyms: [], commonTerms: [] },
          { id: 'bone-scan', name: 'Bone Scan', category: TestCategory.IMAGING, cost: 600, necessary: false, synonyms: [], commonTerms: [] }
        ],
        correctTests: ['ankle-xray', 'neurovascular-assessment'],
        maxAllowed: 4
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'lateral-malleolus-fracture', diagnosis: 'Lateral Malleolus Fracture (Weber B)', correct: true, isCorrect: true, name: 'Lateral Malleolus Fracture (Weber B)', text: 'Lateral Malleolus Fracture (Weber B)', synonyms: [], commonTerms: [] },
          { id: 'ankle-sprain', diagnosis: 'Ankle Sprain', correct: false, isCorrect: false, name: 'Ankle Sprain', text: 'Ankle Sprain', synonyms: [], commonTerms: [] },
          { id: 'achilles-rupture', diagnosis: 'Achilles Tendon Rupture', correct: false, isCorrect: false, name: 'Achilles Tendon Rupture', text: 'Achilles Tendon Rupture', synonyms: [], commonTerms: [] },
          { id: 'calcaneus-fracture', diagnosis: 'Calcaneus Fracture', correct: false, isCorrect: false, name: 'Calcaneus Fracture', text: 'Calcaneus Fracture', synonyms: [], commonTerms: [] },
          { id: 'contusion', diagnosis: 'Soft Tissue Contusion', correct: false, isCorrect: false, name: 'Soft Tissue Contusion', text: 'Soft Tissue Contusion', synonyms: [], commonTerms: [] }
        ],
        correctDiagnoses: ['lateral-malleolus-fracture']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'surgical-consult', name: 'Urgent surgical consultation', category: TreatmentCategory.FOLLOW_UP, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'npo', name: 'NPO (nothing by mouth)', category: TreatmentCategory.LIFESTYLE, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'iv-fluids', name: 'IV Fluid Resuscitation', category: TreatmentCategory.PROCEDURES, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'morphine', name: 'Morphine', category: TreatmentCategory.MEDICATIONS, dosage: '2-4mg IV q4h PRN', necessary: true, synonyms: [], commonTerms: [] },
          { id: 'cefoxitin', name: 'Cefoxitin', category: TreatmentCategory.MEDICATIONS, necessary: true, synonyms: [], commonTerms: [] },
          { id: 'oral-pain-discharge', name: 'Oral pain medications and discharge', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [], contraindicated: true },
          { id: 'antacids', name: 'Antacids', category: TreatmentCategory.MEDICATIONS, necessary: false, synonyms: [], commonTerms: [] }
        ],
        correctTreatments: ['surgical-consult', 'npo', 'iv-fluids', 'morphine', 'cefoxitin'],
        maxAllowed: 6
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you for taking such good care of my ankle. I understand what needs to happen next.",
        good: "I appreciate the thorough examination. When will I be able to walk normally again?",
        poor: "This is more serious than I thought, but I'll follow the treatment plan.",
        failed: "I'm worried about missing work. Are you sure I can't walk on it?"
      },
      mentor: {
        excellent: "Excellent management of an ankle fracture with appropriate orthopedic referral and immobilization.",
        good: "Good recognition of the fracture pattern and need for surgical evaluation.",
        poor: "Remember to assess neurovascular status in all extremity fractures.",
        failed: "This displaced ankle fracture requires immediate orthopedic consultation and immobilization."
      }
    },
    isEmergency: true,
  }
]; 