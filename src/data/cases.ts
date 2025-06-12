import { StepType } from '../types/game';

export interface CaseData {
  id: string;
  title: string;
  system: string;
  level: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  patient: {
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    chiefComplaint: string;
    background: string;
  };
  scoring: {
    baseXP: number;
    timeThresholds: {
      excellent: number; // seconds
      good: number;
      poor: number;
    };
    optimalOrder: StepType[];
  };
  steps: {
    [StepType.HISTORY_TAKING]: {
      questions: Array<{
        id: string;
        text: string;
        relevant: boolean;
        category: 'Present Illness' | 'Past Medical' | 'Social' | 'Family' | 'Review of Systems';
      }>;
      correctAnswers: string[];
      minimumRequired: number;
    };
    [StepType.ORDERING_TESTS]: {
      tests: Array<{
        id: string;
        name: string;
        category: 'Blood Work' | 'Imaging' | 'Cardiac' | 'Neurological' | 'Microbiology' | 'Serology' | 'Urinalysis' | 'Hormones' | 'Vitamins' | 'Monitoring' | 'Other';
        cost: number;
        necessary: boolean;
        contraindicated?: boolean;
      }>;
      correctTests: string[];
      maxAllowed: number;
    };
    [StepType.DIAGNOSIS]: {
      type: 'multiple-choice' | 'select-all';
      options: Array<{
        id: string;
        diagnosis: string;
        correct: boolean;
      }>;
      correctDiagnoses: string[];
    };
    [StepType.TREATMENT]: {
      treatments: Array<{
        id: string;
        name: string;
        category: 'Medication' | 'Procedure' | 'Lifestyle' | 'Follow-up';
        necessary: boolean;
        contraindicated?: boolean;
      }>;
      correctTreatments: string[];
      maxAllowed: number;
    };
  };
  reactions: {
    patient: {
      excellent: string;
      good: string;
      poor: string;
      failed: string;
    };
    mentor: {
      excellent: string;
      good: string;
      poor: string;
      failed: string;
    };
  };
}

export const casesData: CaseData[] = [
  // INFECTIOUS DISEASE CASES
  {
    id: 'inf-001',
    title: 'Dog Bite Infection',
    system: 'Infectious Disease',
    level: 1,
    difficulty: 2,
    patient: {
      name: 'Sarah Martinez',
      age: 28,
      gender: 'Female',
      chiefComplaint: 'Infected dog bite on right hand',
      background: 'Healthy 28-year-old woman bitten by neighbor\'s dog 3 days ago. Wound is red, swollen, and painful.'
    },
    scoring: {
      baseXP: 100, // Increased for more meaningful progression
      timeThresholds: {
        excellent: 180, // 3 minutes
        good: 300, // 5 minutes
        poor: 420 // 7 minutes
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'h1', text: 'When did the bite occur?', relevant: true, category: 'Present Illness' },
          { id: 'h2', text: 'Was the dog vaccinated against rabies?', relevant: true, category: 'Present Illness' },
          { id: 'h3', text: 'Have you cleaned the wound?', relevant: true, category: 'Present Illness' },
          { id: 'h4', text: 'Any fever or chills?', relevant: true, category: 'Present Illness' },
          { id: 'h5', text: 'When was your last tetanus shot?', relevant: true, category: 'Past Medical' },
          { id: 'h6', text: 'Any allergies to antibiotics?', relevant: true, category: 'Past Medical' },
          { id: 'h7', text: 'Do you smoke cigarettes?', relevant: false, category: 'Social' },
          { id: 'h8', text: 'Any family history of diabetes?', relevant: false, category: 'Family' },
          { id: 'h9', text: 'Are you experiencing any nausea?', relevant: false, category: 'Review of Systems' },
          { id: 'h10', text: 'Any numbness in the affected hand?', relevant: true, category: 'Review of Systems' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h10'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          // Blood Work
          { id: 't1', name: 'Complete Blood Count (CBC)', category: 'Blood Work', cost: 25, necessary: true },
          { id: 't2', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 30, necessary: false },
          { id: 't3', name: 'Comprehensive Metabolic Panel', category: 'Blood Work', cost: 45, necessary: false },
          { id: 't4', name: 'Liver Function Tests', category: 'Blood Work', cost: 35, necessary: false },
          { id: 't5', name: 'Lipid Panel', category: 'Blood Work', cost: 25, necessary: false },
          { id: 't6', name: 'Thyroid Function Tests', category: 'Blood Work', cost: 40, necessary: false },
          { id: 't7', name: 'HbA1c', category: 'Blood Work', cost: 30, necessary: false },
          { id: 't8', name: 'Prothrombin Time (PT/INR)', category: 'Blood Work', cost: 20, necessary: false },
          { id: 't9', name: 'Partial Thromboplastin Time (PTT)', category: 'Blood Work', cost: 20, necessary: false },
          { id: 't10', name: 'Erythrocyte Sedimentation Rate (ESR)', category: 'Blood Work', cost: 15, necessary: false },
          { id: 't11', name: 'C-Reactive Protein (CRP)', category: 'Blood Work', cost: 25, necessary: false },
          { id: 't12', name: 'Blood Glucose', category: 'Blood Work', cost: 15, necessary: false },
          
          // Imaging
          { id: 't13', name: 'X-ray of Hand', category: 'Imaging', cost: 120, necessary: false },
          { id: 't14', name: 'Chest X-ray', category: 'Imaging', cost: 80, necessary: false },
          { id: 't15', name: 'CT Scan Head', category: 'Imaging', cost: 400, necessary: false },
          { id: 't16', name: 'CT Scan Chest', category: 'Imaging', cost: 450, necessary: false },
          { id: 't17', name: 'MRI Hand', category: 'Imaging', cost: 800, necessary: false, contraindicated: true },
          { id: 't18', name: 'Ultrasound Abdomen', category: 'Imaging', cost: 200, necessary: false },
          { id: 't19', name: 'DEXA Scan', category: 'Imaging', cost: 150, necessary: false },
          
          // Microbiology
          { id: 't20', name: 'Wound Swab Culture', category: 'Microbiology', cost: 45, necessary: true },
          { id: 't21', name: 'Blood Culture', category: 'Microbiology', cost: 60, necessary: false },
          { id: 't22', name: 'Urine Culture', category: 'Microbiology', cost: 40, necessary: false },
          { id: 't23', name: 'Throat Culture', category: 'Microbiology', cost: 35, necessary: false },
          { id: 't24', name: 'Stool Culture', category: 'Microbiology', cost: 50, necessary: false },
          { id: 't25', name: 'CSF Culture', category: 'Microbiology', cost: 80, necessary: false },
          
          // Serology/Immunology
          { id: 't26', name: 'Hepatitis Panel', category: 'Serology', cost: 75, necessary: false },
          { id: 't27', name: 'HIV Antibody Test', category: 'Serology', cost: 40, necessary: false },
          { id: 't28', name: 'Rheumatoid Factor', category: 'Serology', cost: 35, necessary: false },
          { id: 't29', name: 'Antinuclear Antibody (ANA)', category: 'Serology', cost: 45, necessary: false },
          { id: 't30', name: 'Complement C3/C4', category: 'Serology', cost: 50, necessary: false },
          { id: 't46', name: 'Rabies Virus Antibody', category: 'Serology', cost: 60, necessary: true },
          { id: 't47', name: 'Tetanus Toxoid', category: 'Serology', cost: 30, necessary: true },
          
          // Cardiac
          { id: 't31', name: 'Troponin I', category: 'Cardiac', cost: 40, necessary: false },
          { id: 't32', name: 'CK-MB', category: 'Cardiac', cost: 35, necessary: false },
          { id: 't33', name: 'BNP', category: 'Cardiac', cost: 50, necessary: false },
          { id: 't34', name: 'D-Dimer', category: 'Cardiac', cost: 30, necessary: false },
          
          // Monitoring and Vitals
          { id: 't48', name: 'VITAL SIGNS MONITORING', category: 'Monitoring', cost: 25, necessary: true },
          { id: 't49', name: 'BLOOD PRESSURE MONITORING', category: 'Monitoring', cost: 30, necessary: false },
          { id: 't50', name: 'HEART RATE MONITORING', category: 'Monitoring', cost: 25, necessary: false },
          
          // Additional Tests from Intended UI
          { id: 't51', name: 'Rapid Malaria Test', category: 'Serology', cost: 35, necessary: false },
          { id: 't52', name: 'Influenza Antigen Test', category: 'Serology', cost: 40, necessary: false },
          { id: 't53', name: 'Hepatitis B Surface Antigen', category: 'Serology', cost: 50, necessary: false },
          { id: 't54', name: 'Viral Load Test', category: 'Serology', cost: 80, necessary: false },
          { id: 't55', name: 'Electrolytes Panel', category: 'Blood Work', cost: 35, necessary: false },
          
          // Urinalysis
          { id: 't35', name: 'Urinalysis', category: 'Urinalysis', cost: 20, necessary: false },
          { id: 't36', name: 'Urine Microscopy', category: 'Urinalysis', cost: 25, necessary: false },
          { id: 't37', name: '24-hour Urine Protein', category: 'Urinalysis', cost: 60, necessary: false },
          
          // Hormones
          { id: 't38', name: 'Cortisol Level', category: 'Hormones', cost: 40, necessary: false },
          { id: 't39', name: 'Testosterone', category: 'Hormones', cost: 45, necessary: false },
          { id: 't40', name: 'Estradiol', category: 'Hormones', cost: 45, necessary: false },
          { id: 't41', name: 'Growth Hormone', category: 'Hormones', cost: 60, necessary: false },
          
          // Miscellaneous
          { id: 't42', name: 'Vitamin D', category: 'Vitamins', cost: 35, necessary: false },
          { id: 't43', name: 'Vitamin B12', category: 'Vitamins', cost: 30, necessary: false },
          { id: 't44', name: 'Folate', category: 'Vitamins', cost: 25, necessary: false },
          { id: 't45', name: 'Iron Studies', category: 'Vitamins', cost: 40, necessary: false }
        ],
        correctTests: ['t1', 't20', 't46', 't47', 't48'],
        maxAllowed: 4
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'd1', diagnosis: 'Cellulitis secondary to dog bite', correct: true },
          { id: 'd2', diagnosis: 'Rabies infection', correct: false },
          { id: 'd3', diagnosis: 'Tetanus infection', correct: false },
          { id: 'd4', diagnosis: 'Simple laceration', correct: false }
        ],
        correctDiagnoses: ['d1']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'tx1', name: 'Amoxicillin-Clavulanate (Augmentin)', category: 'Medication', necessary: true },
          { id: 'tx2', name: 'Tetanus Booster', category: 'Medication', necessary: true },
          { id: 'tx3', name: 'Wound irrigation and cleaning', category: 'Procedure', necessary: true },
          { id: 'tx4', name: 'Warm compresses', category: 'Lifestyle', necessary: true },
          { id: 'tx5', name: 'Follow-up in 48-72 hours', category: 'Follow-up', necessary: true },
          { id: 'tx6', name: 'Immediate amputation', category: 'Procedure', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['tx1', 'tx2', 'tx3', 'tx4', 'tx5'],
        maxAllowed: 6
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you doctor! I feel so much better knowing exactly what to do. The antibiotics are already helping!",
        good: "Thanks for taking care of this. I'm glad we caught the infection early.",
        poor: "I'm still worried about the infection, but I'll follow your instructions.",
        failed: "I'm concerned we might have missed something important about my bite."
      },
      mentor: {
        excellent: "Excellent work! You correctly identified cellulitis and chose appropriate antibiotic coverage for dog bite pathogens.",
        good: "Good clinical reasoning. You managed the infection appropriately with proper wound care and antibiotics.",
        poor: "Adequate management, but consider reviewing dog bite antibiotic prophylaxis guidelines.",
        failed: "This case requires immediate antibiotic therapy. Review animal bite management protocols."
      }
    }
  },

  // CARDIOLOGY CASE - Exercise-Induced Syncope (HCM)
  {
    id: 'card-001',
    title: 'Exercise-Induced Syncope',
    system: 'Cardiology',
    level: 1,
    difficulty: 4, // High risk - potentially life-threatening
    patient: {
      name: 'Robert Wilson',
      age: 19,
      gender: 'Male',
      chiefComplaint: 'Collapsed during basketball practice',
      background: 'Previously healthy 19-year-old college basketball player who collapsed during intense practice. Teammate said he looked pale and was unconscious for about 30 seconds. Father died suddenly at age 45 during exercise.'
    },
    scoring: {
      baseXP: 140, // High XP for high-stakes case
      timeThresholds: {
        excellent: 300, // Need time for thorough cardiac evaluation
        good: 420,
        poor: 600
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'h1', text: 'Describe exactly what happened during the episode?', relevant: true, category: 'Present Illness' },
          { id: 'h2', text: 'Any chest pain, palpitations, or shortness of breath before collapsing?', relevant: true, category: 'Present Illness' },
          { id: 'h3', text: 'Have you ever fainted or felt dizzy during exercise before?', relevant: true, category: 'Present Illness' },
          { id: 'h4', text: 'Any family history of sudden cardiac death or heart disease?', relevant: true, category: 'Family' },
          { id: 'h5', text: 'Do you take any medications, supplements, or stimulants?', relevant: true, category: 'Past Medical' },
          { id: 'h6', text: 'Any previous heart murmur or cardiac evaluation?', relevant: true, category: 'Past Medical' },
          { id: 'h7', text: 'Do you use recreational drugs or excessive caffeine?', relevant: true, category: 'Social' },
          { id: 'h8', text: 'Any recent illness or dehydration?', relevant: false, category: 'Review of Systems' },
          { id: 'h9', text: 'How often do you exercise at this intensity?', relevant: false, category: 'Social' },
          { id: 'h10', text: 'Any exercise intolerance or unusual fatigue?', relevant: true, category: 'Review of Systems' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h10'],
        minimumRequired: 5 // More questions needed for high-risk case
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          // Essential cardiac workup
          { id: 't1', name: 'ECG (12-lead)', category: 'Cardiac', cost: 50, necessary: true },
          { id: 't2', name: 'Echocardiogram', category: 'Cardiac', cost: 350, necessary: true },
          { id: 't3', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 35, necessary: true },
          { id: 't4', name: 'Complete Blood Count', category: 'Blood Work', cost: 25, necessary: false },
          { id: 't5', name: 'Troponin I', category: 'Cardiac', cost: 75, necessary: false },
          { id: 't6', name: 'BNP or NT-proBNP', category: 'Cardiac', cost: 85, necessary: false },
          
          // Advanced cardiac tests - appropriate for HCM evaluation
          { id: 't7', name: 'Cardiac MRI', category: 'Cardiac', cost: 1200, necessary: false },
          { id: 't8', name: 'Holter Monitor (24-48hr)', category: 'Cardiac', cost: 200, necessary: false },
          { id: 't9', name: 'Exercise Stress Test', category: 'Cardiac', cost: 400, necessary: false, contraindicated: true },
          { id: 't10', name: 'Event Monitor', category: 'Cardiac', cost: 300, necessary: false },
          
          // Basic imaging and other tests
          { id: 't11', name: 'Chest X-ray', category: 'Imaging', cost: 80, necessary: false },
          { id: 't12', name: 'TSH (Thyroid Function)', category: 'Hormones', cost: 45, necessary: false },
          { id: 't13', name: 'Urinalysis', category: 'Urinalysis', cost: 25, necessary: false },
          
          // Inappropriate/dangerous tests
          { id: 't14', name: 'Head CT', category: 'Neurological', cost: 400, necessary: false },
          { id: 't15', name: 'EEG', category: 'Neurological', cost: 500, necessary: false },
          { id: 't16', name: 'Lumbar Puncture', category: 'Neurological', cost: 800, necessary: false, contraindicated: true },
          { id: 't17', name: 'Immediate Return to Sports Physical', category: 'Other', cost: 100, necessary: false, contraindicated: true }
        ],
        correctTests: ['t1', 't2', 't3'], // ECG, Echo, BMP are essential first steps
        maxAllowed: 4
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'd1', diagnosis: 'Hypertrophic Cardiomyopathy with Exercise-Induced Syncope', correct: true },
          { id: 'd2', diagnosis: 'Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC)', correct: false },
          { id: 'd3', diagnosis: 'Vasovagal Syncope', correct: false },
          { id: 'd4', diagnosis: 'Long QT Syndrome', correct: false },
          { id: 'd5', diagnosis: 'Exercise-Induced Dehydration', correct: false },
          { id: 'd6', diagnosis: 'Catecholaminergic Polymorphic Ventricular Tachycardia (CPVT)', correct: false }
        ],
        correctDiagnoses: ['d1']
      },
      [StepType.TREATMENT]: {
        treatments: [
          // Immediate management
          { id: 'tx1', name: 'Immediate restriction from competitive sports', category: 'Lifestyle', necessary: true },
          { id: 'tx2', name: 'Urgent cardiology/electrophysiology referral', category: 'Follow-up', necessary: true },
          { id: 'tx3', name: 'Family screening for HCM (first-degree relatives)', category: 'Follow-up', necessary: true },
          { id: 'tx4', name: 'Genetic counseling referral', category: 'Follow-up', necessary: true },
          
          // Medication management (appropriate but not always first-line)
          { id: 'tx5', name: 'Beta-blocker therapy (if symptomatic)', category: 'Medication', necessary: false },
          { id: 'tx6', name: 'Disopyramide for LVOT obstruction', category: 'Medication', necessary: false },
          
          // Advanced interventions (specialist decision)
          { id: 'tx7', name: 'ICD evaluation for high-risk features', category: 'Procedure', necessary: false },
          { id: 'tx8', name: 'Septal myectomy evaluation', category: 'Procedure', necessary: false },
          
          // Contraindicated/dangerous treatments
          { id: 'tx9', name: 'Clear to return to sports immediately', category: 'Lifestyle', necessary: false, contraindicated: true },
          { id: 'tx10', name: 'ACE inhibitor therapy', category: 'Medication', necessary: false, contraindicated: true },
          { id: 'tx11', name: 'Encourage intense exercise training', category: 'Lifestyle', necessary: false, contraindicated: true },
          { id: 'tx12', name: 'Discharge home without follow-up', category: 'Follow-up', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['tx1', 'tx2', 'tx3', 'tx4'], // The 4 essential immediate actions
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
    }
  },

  // NEUROLOGY CASE
  {
    id: 'neuro-001',
    title: 'Acute Stroke Presentation',
    system: 'Neurology',
    level: 1,
    difficulty: 4,
    patient: {
      name: 'Eleanor Thompson',
      age: 67,
      gender: 'Female',
      chiefComplaint: 'Sudden speech difficulty and weakness',
      background: '67-year-old woman brought by family for sudden onset of slurred speech and right-sided weakness that started 2 hours ago.'
    },
    scoring: {
      baseXP: 140, // Level 1, Difficulty 4 neurology case
      timeThresholds: {
        excellent: 300,
        good: 420,
        poor: 600
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'h1', text: 'When exactly did symptoms start?', relevant: true, category: 'Present Illness' },
          { id: 'h2', text: 'Was onset sudden or gradual?', relevant: true, category: 'Present Illness' },
          { id: 'h3', text: 'Any headache or vomiting?', relevant: true, category: 'Present Illness' },
          { id: 'h4', text: 'History of atrial fibrillation?', relevant: true, category: 'Past Medical' },
          { id: 'h5', text: 'Taking any blood thinners?', relevant: true, category: 'Past Medical' },
          { id: 'h6', text: 'Any recent surgery or trauma?', relevant: true, category: 'Past Medical' },
          { id: 'h7', text: 'Do you exercise regularly?', relevant: false, category: 'Social' },
          { id: 'h8', text: 'Any recent weight loss?', relevant: false, category: 'Review of Systems' },
          { id: 'h9', text: 'History of migraines?', relevant: false, category: 'Past Medical' },
          { id: 'h10', text: 'Any vision changes?', relevant: true, category: 'Review of Systems' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h10'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 't1', name: 'Non-contrast Head CT', category: 'Imaging', cost: 400, necessary: true },
          { id: 't2', name: 'ECG', category: 'Cardiac', cost: 50, necessary: true },
          { id: 't3', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 30, necessary: true },
          { id: 't4', name: 'PT/INR', category: 'Blood Work', cost: 25, necessary: true },
          { id: 't5', name: 'CT Angiogram Head/Neck', category: 'Imaging', cost: 800, necessary: true },
          { id: 't6', name: 'Lumbar Puncture', category: 'Neurological', cost: 200, necessary: false, contraindicated: true }
        ],
        correctTests: ['t1', 't2', 't3', 't4', 't5'],
        maxAllowed: 6
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'd1', diagnosis: 'Acute Ischemic Stroke (MCA territory)', correct: true },
          { id: 'd2', diagnosis: 'Hemorrhagic Stroke', correct: false },
          { id: 'd3', diagnosis: 'Migraine with Aura', correct: false },
          { id: 'd4', diagnosis: 'Transient Ischemic Attack', correct: false }
        ],
        correctDiagnoses: ['d1']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'tx1', name: 'Alteplase (tPA) if within window', category: 'Medication', necessary: true },
          { id: 'tx2', name: 'Aspirin 325mg', category: 'Medication', necessary: true },
          { id: 'tx3', name: 'Neurology consultation', category: 'Follow-up', necessary: true },
          { id: 'tx4', name: 'Admit to stroke unit', category: 'Follow-up', necessary: true },
          { id: 'tx5', name: 'Speech therapy evaluation', category: 'Follow-up', necessary: true },
          { id: 'tx6', name: 'Immediate anticoagulation', category: 'Medication', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['tx1', 'tx2', 'tx3', 'tx4', 'tx5'],
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
    }
  }
];

export const getSystemCases = (systemName: string): CaseData[] => {
  return casesData.filter(caseItem => caseItem.system === systemName);
};

export const getCaseById = (caseId: string): CaseData | undefined => {
  return casesData.find(caseItem => caseItem.id === caseId);
};

export const getGameCaseById = (caseId: string): (CaseData & {
  categoryId: string;
  avatar: string;
  shortTitle: string;
  shortDescription: string;
  xpReward: number;
  stars: number;
  unlocked: boolean;
}) | undefined => {
  return gameCases.find(caseItem => caseItem.id === caseId);
};

// Case Categories - Updated to match exact requirements
export const caseCategories = [
  {
    id: 'infectious',
    name: 'Infectious Disease',
    description: 'Diagnose and treat infectious conditions',
    color: '#ef4444'
  },
  {
    id: 'cardiology', 
    name: 'Cardiology',
    description: 'Heart and cardiovascular system cases',
    color: '#3b82f6'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Brain and nervous system disorders',
    color: '#8b5cf6'
  },
  {
    id: 'gastro',
    name: 'Gastrointestinal',
    description: 'Digestive system conditions',
    color: '#f59e0b'
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    description: 'Lung and breathing disorders',
    color: '#10b981'
  }
];

// Enhanced case data with game-like properties
export const gameCases: Array<CaseData & {
  categoryId: string;
  avatar: string;
  shortTitle: string;
  shortDescription: string;
  xpReward: number;
  stars: number;
  unlocked: boolean;
}> = [
  // ===== INFECTIOUS DISEASE CASES =====
  {
    ...casesData[0], // Dog Bite case (already defined above)
    categoryId: 'infectious',
    id: 'dog-bite-infection',
    title: 'Dog Bite Infection',
    shortTitle: 'Dog Bite',
    shortDescription: '28F with infected dog bite',
    avatar: '🐕',
    xpReward: 20, // Medium difficulty
    stars: 3,
    unlocked: true
  },
  {
    id: 'pneumonia-fever',
    categoryId: 'infectious',
    title: 'Community-Acquired Pneumonia',
    shortTitle: 'Pneumonia',
    shortDescription: '72M with fever and cough',
    avatar: '🦠',
    xpReward: 30, // Hard difficulty
    stars: 4,
    unlocked: true,
    system: 'Infectious Disease',
    level: 1,
    difficulty: 4,
    patient: {
      name: 'William Thompson',
      age: 72,
      gender: 'Male',
      chiefComplaint: 'Fever, cough, and difficulty breathing',
      background: '72-year-old male with 3-day history of fever, productive cough, and increasing shortness of breath.'
    },
    scoring: {
      baseXP: 140, // Updated for realistic progression
      timeThresholds: {
        excellent: 360,
        good: 480,
        poor: 600
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'fever-onset', text: 'When did the fever start?', category: 'Present Illness', relevant: true },
          { id: 'cough-production', text: 'Are you coughing up anything?', category: 'Present Illness', relevant: true },
          { id: 'smoking-history', text: 'Do you smoke?', category: 'Social', relevant: true },
          { id: 'recent-travel', text: 'Any recent travel?', category: 'Social', relevant: true },
          { id: 'shortness-breath', text: 'Any difficulty breathing?', category: 'Review of Systems', relevant: true },
          { id: 'chest-pain', text: 'Any chest pain?', category: 'Review of Systems', relevant: true },
          { id: 'appetite', text: 'How is your appetite?', category: 'Review of Systems', relevant: false }
        ],
        correctAnswers: ['fever-onset', 'cough-production', 'smoking-history', 'shortness-breath', 'chest-pain']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 4,
        tests: [
          { id: 'chest-xray', name: 'Chest X-ray', category: 'Imaging', cost: 100, necessary: true },
          { id: 'cbc', name: 'Complete Blood Count', category: 'Blood Work', cost: 25, necessary: true },
          { id: 'blood-culture', name: 'Blood Culture', category: 'Blood Work', cost: 75, necessary: true },
          { id: 'sputum-culture', name: 'Sputum Culture', category: 'Other', cost: 50, necessary: true },
          { id: 'ct-chest', name: 'CT Chest', category: 'Imaging', cost: 300, necessary: false }
        ],
        correctTests: ['chest-xray', 'cbc', 'blood-culture', 'sputum-culture']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'cap', diagnosis: 'Community-Acquired Pneumonia', correct: true },
          { id: 'bronchitis', diagnosis: 'Acute Bronchitis', correct: false },
          { id: 'tuberculosis', diagnosis: 'Tuberculosis', correct: false },
          { id: 'lung-cancer', diagnosis: 'Lung Cancer', correct: false }
        ],
        correctDiagnoses: ['cap']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 4,
        treatments: [
          { id: 'antibiotic', name: 'Azithromycin + Ceftriaxone', category: 'Medication', necessary: true },
          { id: 'oxygen', name: 'Oxygen Therapy', category: 'Procedure', necessary: true },
          { id: 'iv-fluids', name: 'IV Fluids', category: 'Procedure', necessary: true },
          { id: 'rest', name: 'Bed Rest', category: 'Lifestyle', necessary: true },
          { id: 'steroids', name: 'Corticosteroids', category: 'Medication', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['antibiotic', 'oxygen', 'iv-fluids', 'rest']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you doctor! I can breathe much better already.",
        good: "I feel like I'm on the right track to recovery.",
        poor: "I'm still having trouble breathing, but I'll trust your plan.",
        failed: "I'm really worried about my breathing getting worse."
      },
      mentor: {
        excellent: "Excellent pneumonia management! Proper antibiotic selection and supportive care.",
        good: "Good recognition of pneumonia with appropriate treatment approach.",
        poor: "Adequate care, but consider reviewing pneumonia severity scoring.",
        failed: "This pneumonia requires immediate antibiotic therapy and close monitoring."
      }
    }
  },
  {
    id: 'uti-elderly',
    categoryId: 'infectious',
    title: 'Urinary Tract Infection',
    shortTitle: 'UTI',
    shortDescription: '68F with painful urination',
    avatar: '💊',
    xpReward: 10, // Easy difficulty
    stars: 2,
    unlocked: true,
    system: 'Infectious Disease',
    level: 1,
    difficulty: 2,
    patient: {
      name: 'Dorothy Garcia',
      age: 68,
      gender: 'Female',
      chiefComplaint: 'Burning with urination and frequency',
      background: '68-year-old female with 2-day history of dysuria, urinary frequency, and urgency.'
    },
    scoring: {
      baseXP: 100, // Updated for realistic progression
      timeThresholds: {
        excellent: 180,
        good: 300,
        poor: 420
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'dysuria', text: 'Do you have burning with urination?', category: 'Present Illness', relevant: true },
          { id: 'frequency', text: 'Are you urinating more often?', category: 'Present Illness', relevant: true },
          { id: 'fever', text: 'Any fever or chills?', category: 'Review of Systems', relevant: true },
          { id: 'previous-uti', text: 'Have you had UTIs before?', category: 'Past Medical', relevant: true },
          { id: 'sexual-activity', text: 'Any recent sexual activity?', category: 'Social', relevant: false }
        ],
        correctAnswers: ['dysuria', 'frequency', 'fever', 'previous-uti']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 3,
        tests: [
          { id: 'urinalysis', name: 'Urinalysis', category: 'Other', cost: 30, necessary: true },
          { id: 'urine-culture', name: 'Urine Culture', category: 'Other', cost: 50, necessary: true },
          { id: 'pregnancy-test', name: 'Pregnancy Test', category: 'Other', cost: 20, necessary: false }
        ],
        correctTests: ['urinalysis', 'urine-culture']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'uti', diagnosis: 'Urinary Tract Infection', correct: true },
          { id: 'kidney-stones', diagnosis: 'Kidney Stones', correct: false },
          { id: 'bladder-cancer', diagnosis: 'Bladder Cancer', correct: false }
        ],
        correctDiagnoses: ['uti']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 3,
        treatments: [
          { id: 'nitrofurantoin', name: 'Nitrofurantoin', category: 'Medication', necessary: true },
          { id: 'fluids', name: 'Increase Fluid Intake', category: 'Lifestyle', necessary: true },
          { id: 'cranberry', name: 'Cranberry Juice', category: 'Lifestyle', necessary: false }
        ],
        correctTreatments: ['nitrofurantoin', 'fluids']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you! I feel much better knowing what to do.",
        good: "I'm relieved to know it's treatable.",
        poor: "I hope this clears up soon.",
        failed: "Should I be worried about my kidneys?"
      },
      mentor: {
        excellent: "Perfect UTI diagnosis with appropriate antibiotic choice.",
        good: "Good recognition of UTI symptoms and proper treatment.",
        poor: "Consider urine culture for elderly patients with UTI.",
        failed: "UTIs in elderly patients require prompt antibiotic treatment."
      }
    }
  },

  // ===== CARDIOLOGY CASES =====
  {
    ...casesData[1], // Exercise-Induced Syncope case (already defined above)
    categoryId: 'cardiology',
    id: 'exercise-syncope',
    title: 'Exercise-Induced Syncope',
    shortTitle: 'Syncope',
    shortDescription: '45M fainting at gym',
    avatar: '💓',
    xpReward: 30, // Hard difficulty
    stars: 4,
    unlocked: true
  },
  {
    id: 'chest-pain-angina',
    categoryId: 'cardiology',
    title: 'Chest Pain - Stable Angina',
    shortTitle: 'Chest Pain',
    shortDescription: '58M with exertional chest pain',
    avatar: '💔',
    xpReward: 20, // Medium difficulty
    stars: 3,
    unlocked: true,
    system: 'Cardiology',
    level: 1,
    difficulty: 3,
    patient: {
      name: 'Robert Johnson',
      age: 58,
      gender: 'Male',
      chiefComplaint: 'Chest pain with exertion',
      background: '58-year-old male with 2-month history of chest pressure that occurs with walking and resolves with rest.'
    },
    scoring: {
      baseXP: 120, // Updated for realistic progression
      timeThresholds: {
        excellent: 300,
        good: 420,
        poor: 540
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 5,
        questions: [
          { id: 'chest-pain-character', text: 'Can you describe the chest pain?', category: 'Present Illness', relevant: true },
          { id: 'exertion-relation', text: 'Does the pain occur with activity?', category: 'Present Illness', relevant: true },
          { id: 'pain-relief', text: 'What relieves the pain?', category: 'Present Illness', relevant: true },
          { id: 'risk-factors', text: 'Do you have diabetes, high blood pressure, or high cholesterol?', category: 'Past Medical', relevant: true },
          { id: 'family-history', text: 'Any family history of heart disease?', category: 'Family', relevant: true },
          { id: 'smoking', text: 'Do you smoke?', category: 'Social', relevant: true }
        ],
        correctAnswers: ['chest-pain-character', 'exertion-relation', 'pain-relief', 'risk-factors', 'family-history']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 4,
        tests: [
          { id: 'ecg', name: 'ECG', category: 'Cardiac', cost: 50, necessary: true },
          { id: 'stress-test', name: 'Exercise Stress Test', category: 'Cardiac', cost: 200, necessary: true },
          { id: 'lipid-panel', name: 'Lipid Panel', category: 'Blood Work', cost: 40, necessary: true },
          { id: 'cardiac-cath', name: 'Cardiac Catheterization', category: 'Cardiac', cost: 1000, necessary: false }
        ],
        correctTests: ['ecg', 'stress-test', 'lipid-panel']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'stable-angina', diagnosis: 'Stable Angina', correct: true },
          { id: 'unstable-angina', diagnosis: 'Unstable Angina', correct: false },
          { id: 'myocardial-infarction', diagnosis: 'Myocardial Infarction', correct: false }
        ],
        correctDiagnoses: ['stable-angina']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 4,
        treatments: [
          { id: 'aspirin', name: 'Aspirin 81mg daily', category: 'Medication', necessary: true },
          { id: 'statin', name: 'Atorvastatin', category: 'Medication', necessary: true },
          { id: 'beta-blocker', name: 'Metoprolol', category: 'Medication', necessary: true },
          { id: 'lifestyle', name: 'Diet and Exercise', category: 'Lifestyle', necessary: true }
        ],
        correctTreatments: ['aspirin', 'statin', 'beta-blocker', 'lifestyle']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you doctor! I understand what I need to do.",
        good: "I'm glad we caught this early.",
        poor: "I'll follow the plan, but I'm still worried.",
        failed: "Am I having a heart attack?"
      },
      mentor: {
        excellent: "Excellent diagnosis of stable angina with comprehensive management.",
        good: "Good recognition of stable angina pattern.",
        poor: "Consider all cardiovascular risk factors in your assessment.",
        failed: "This chest pain pattern requires cardiac evaluation."
      }
    }
  },
  {
    id: 'hypertensive-emergency',
    categoryId: 'cardiology',
    title: 'Hypertensive Emergency',
    shortTitle: 'High BP',
    shortDescription: '52F with severe headache and high BP',
    avatar: '📈',
    xpReward: 10, // Easy difficulty
    stars: 2,
    unlocked: true,
    system: 'Cardiology',
    level: 1,
    difficulty: 2,
    patient: {
      name: 'Linda Rodriguez',
      age: 52,
      gender: 'Female',
      chiefComplaint: 'Severe headache and blurred vision',
      background: '52-year-old female with sudden onset severe headache, nausea, and blurred vision. Blood pressure 220/110.'
    },
    scoring: {
      baseXP: 100, // Updated for realistic progression
      timeThresholds: {
        excellent: 180,
        good: 300,
        poor: 420
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'headache-onset', text: 'When did the headache start?', category: 'Present Illness', relevant: true },
          { id: 'vision-changes', text: 'Any vision changes?', category: 'Review of Systems', relevant: true },
          { id: 'bp-history', text: 'Do you have high blood pressure?', category: 'Past Medical', relevant: true },
          { id: 'bp-medications', text: 'Are you taking blood pressure medications?', category: 'Past Medical', relevant: true },
          { id: 'chest-pain', text: 'Any chest pain?', category: 'Review of Systems', relevant: true }
        ],
        correctAnswers: ['headache-onset', 'vision-changes', 'bp-history', 'bp-medications']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 3,
        tests: [
          { id: 'vital-signs', name: 'Vital Signs', category: 'Other', cost: 25, necessary: true },
          { id: 'ecg', name: 'ECG', category: 'Cardiac', cost: 50, necessary: true },
          { id: 'basic-metabolic', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 35, necessary: true }
        ],
        correctTests: ['vital-signs', 'ecg', 'basic-metabolic']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'hypertensive-emergency', diagnosis: 'Hypertensive Emergency', correct: true },
          { id: 'hypertensive-urgency', diagnosis: 'Hypertensive Urgency', correct: false },
          { id: 'stroke', diagnosis: 'Stroke', correct: false }
        ],
        correctDiagnoses: ['hypertensive-emergency']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 3,
        treatments: [
          { id: 'nicardipine', name: 'Nicardipine IV', category: 'Medication', necessary: true },
          { id: 'monitoring', name: 'Continuous BP Monitoring', category: 'Procedure', necessary: true },
          { id: 'sublingual-nifedipine', name: 'Sublingual Nifedipine', category: 'Medication', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['nicardipine', 'monitoring']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you! My headache is getting better.",
        good: "I feel more stable now.",
        poor: "I'm still having the headache.",
        failed: "Is my blood pressure dangerous?"
      },
      mentor: {
        excellent: "Perfect management of hypertensive emergency with controlled BP reduction.",
        good: "Good recognition of hypertensive emergency.",
        poor: "Remember to avoid rapid BP reduction in hypertensive emergency.",
        failed: "This requires immediate controlled blood pressure reduction."
      }
    }
  },

  // ===== NEUROLOGY CASES =====
  {
    ...casesData[2], // Acute Stroke case (already defined above)
    categoryId: 'neurology',
    id: 'acute-stroke',
    title: 'Acute Stroke',
    shortTitle: 'Stroke',
    shortDescription: '71M with sudden weakness',
    avatar: '🧠',
    xpReward: 30, // Hard difficulty
    stars: 5,
    unlocked: true
  },
  {
    id: 'migraine-headache',
    categoryId: 'neurology',
    title: 'Migraine Headache',
    shortTitle: 'Migraine',
    shortDescription: '34F with severe headache',
    avatar: '🤕',
    xpReward: 10, // Easy difficulty
    stars: 2,
    unlocked: true,
    system: 'Neurology',
    level: 1,
    difficulty: 2,
    patient: {
      name: 'Sarah Kim',
      age: 34,
      gender: 'Female',
      chiefComplaint: 'Severe throbbing headache with nausea',
      background: '34-year-old female with 6-hour history of severe unilateral throbbing headache associated with nausea and light sensitivity.'
    },
    scoring: {
      baseXP: 100, // Updated for realistic progression
      timeThresholds: {
        excellent: 180,
        good: 300,
        poor: 420
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'headache-character', text: 'Can you describe the headache?', category: 'Present Illness', relevant: true },
          { id: 'nausea-vomiting', text: 'Any nausea or vomiting?', category: 'Review of Systems', relevant: true },
          { id: 'light-sensitivity', text: 'Does light bother you?', category: 'Review of Systems', relevant: true },
          { id: 'previous-headaches', text: 'Have you had similar headaches before?', category: 'Past Medical', relevant: true },
          { id: 'triggers', text: 'What might have triggered this headache?', category: 'Present Illness', relevant: true }
        ],
        correctAnswers: ['headache-character', 'nausea-vomiting', 'light-sensitivity', 'previous-headaches']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 2,
        tests: [
          { id: 'neurological-exam', name: 'Neurological Examination', category: 'Neurological', cost: 50, necessary: true },
          { id: 'ct-head', name: 'CT Head', category: 'Imaging', cost: 300, necessary: false },
          { id: 'mri-brain', name: 'MRI Brain', category: 'Imaging', cost: 800, necessary: false }
        ],
        correctTests: ['neurological-exam']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'migraine', diagnosis: 'Migraine Headache', correct: true },
          { id: 'tension-headache', diagnosis: 'Tension Headache', correct: false },
          { id: 'cluster-headache', diagnosis: 'Cluster Headache', correct: false }
        ],
        correctDiagnoses: ['migraine']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 3,
        treatments: [
          { id: 'sumatriptan', name: 'Sumatriptan', category: 'Medication', necessary: true },
          { id: 'nsaid', name: 'Ibuprofen', category: 'Medication', necessary: true },
          { id: 'antiemetic', name: 'Ondansetron', category: 'Medication', necessary: true }
        ],
        correctTreatments: ['sumatriptan', 'nsaid', 'antiemetic']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you! The pain is much better now.",
        good: "I'm feeling some relief.",
        poor: "I still have some pain but it's manageable.",
        failed: "The headache is still really bad."
      },
      mentor: {
        excellent: "Excellent migraine diagnosis with appropriate acute treatment.",
        good: "Good recognition of migraine pattern.",
        poor: "Consider prophylactic therapy for frequent migraines.",
        failed: "This headache pattern suggests migraine requiring specific treatment."
      }
    }
  },
  {
    id: 'seizure-episode',
    categoryId: 'neurology',
    title: 'First-Time Seizure',
    shortTitle: 'Seizure',
    shortDescription: '28M with witnessed seizure',
    avatar: '⚡',
    xpReward: 20, // Medium difficulty
    stars: 3,
    unlocked: true,
    system: 'Neurology',
    level: 1,
    difficulty: 3,
    patient: {
      name: 'Michael Davis',
      age: 28,
      gender: 'Male',
      chiefComplaint: 'Witnessed seizure episode',
      background: '28-year-old male brought in after a witnessed generalized tonic-clonic seizure lasting 2 minutes. No previous history of seizures.'
    },
    scoring: {
      baseXP: 120, // Updated for realistic progression
      timeThresholds: {
        excellent: 240,
        good: 360,
        poor: 480
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'seizure-description', text: 'Can you describe what happened?', category: 'Present Illness', relevant: true },
          { id: 'head-trauma', text: 'Any recent head injury?', category: 'Past Medical', relevant: true },
          { id: 'drug-alcohol', text: 'Any drug or alcohol use?', category: 'Social', relevant: true },
          { id: 'medications', text: 'What medications are you taking?', category: 'Past Medical', relevant: true },
          { id: 'family-seizures', text: 'Any family history of seizures?', category: 'Family', relevant: true }
        ],
        correctAnswers: ['seizure-description', 'head-trauma', 'drug-alcohol', 'medications']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 4,
        tests: [
          { id: 'glucose', name: 'Blood Glucose', category: 'Blood Work', cost: 15, necessary: true },
          { id: 'electrolytes', name: 'Electrolytes', category: 'Blood Work', cost: 30, necessary: true },
          { id: 'ct-head', name: 'CT Head', category: 'Imaging', cost: 300, necessary: true },
          { id: 'eeg', name: 'EEG', category: 'Neurological', cost: 150, necessary: false }
        ],
        correctTests: ['glucose', 'electrolytes', 'ct-head']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'first-seizure', diagnosis: 'First-Time Seizure', correct: true },
          { id: 'epilepsy', diagnosis: 'Epilepsy', correct: false },
          { id: 'syncope', diagnosis: 'Syncope', correct: false }
        ],
        correctDiagnoses: ['first-seizure']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 3,
        treatments: [
          { id: 'observation', name: 'Observation and Monitoring', category: 'Procedure', necessary: true },
          { id: 'education', name: 'Seizure Precautions Education', category: 'Lifestyle', necessary: true },
          { id: 'aed', name: 'Anti-epileptic Drug', category: 'Medication', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['observation', 'education']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you for explaining everything so clearly.",
        good: "I understand what happened now.",
        poor: "I'm still worried about having another seizure.",
        failed: "Do I have epilepsy?"
      },
      mentor: {
        excellent: "Good approach to first-time seizure with appropriate workup.",
        good: "Adequate evaluation of new-onset seizure.",
        poor: "Consider metabolic causes in first-time seizure patients.",
        failed: "First-time seizures require thorough evaluation for underlying causes."
      }
    }
  },

  // ===== GASTROINTESTINAL CASES =====
  {
    id: 'acute-appendicitis',
    categoryId: 'gastro',
    title: 'Acute Appendicitis',
    shortTitle: 'Appendicitis',
    shortDescription: '22M with severe abdominal pain',
    avatar: '🤢',
    xpReward: 30, // Hard difficulty
    stars: 4,
    unlocked: true,
    system: 'Gastrointestinal',
    level: 1,
    difficulty: 4,
    patient: {
      name: 'James Wilson',
      age: 22,
      gender: 'Male',
      chiefComplaint: 'Severe right lower abdominal pain',
      background: '22-year-old male with 8-hour history of severe right lower quadrant abdominal pain that started around the umbilicus.'
    },
    scoring: {
      baseXP: 140, // Updated for realistic progression
      timeThresholds: {
        excellent: 240,
        good: 360,
        poor: 480
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 5,
        questions: [
          { id: 'pain-onset', text: 'How did the pain start?', category: 'Present Illness', relevant: true },
          { id: 'pain-migration', text: 'Has the pain moved anywhere?', category: 'Present Illness', relevant: true },
          { id: 'nausea-vomiting', text: 'Any nausea or vomiting?', category: 'Review of Systems', relevant: true },
          { id: 'fever', text: 'Any fever?', category: 'Review of Systems', relevant: true },
          { id: 'appetite', text: 'How is your appetite?', category: 'Review of Systems', relevant: true },
          { id: 'bowel-movements', text: 'Any changes in bowel movements?', category: 'Review of Systems', relevant: false }
        ],
        correctAnswers: ['pain-onset', 'pain-migration', 'nausea-vomiting', 'fever', 'appetite']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 4,
        tests: [
          { id: 'cbc', name: 'Complete Blood Count', category: 'Blood Work', cost: 25, necessary: true },
          { id: 'ct-abdomen', name: 'CT Abdomen/Pelvis', category: 'Imaging', cost: 400, necessary: true },
          { id: 'urinalysis', name: 'Urinalysis', category: 'Other', cost: 30, necessary: true },
          { id: 'ultrasound', name: 'Abdominal Ultrasound', category: 'Imaging', cost: 200, necessary: false }
        ],
        correctTests: ['cbc', 'ct-abdomen', 'urinalysis']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'appendicitis', diagnosis: 'Acute Appendicitis', correct: true },
          { id: 'gastroenteritis', diagnosis: 'Gastroenteritis', correct: false },
          { id: 'kidney-stones', diagnosis: 'Kidney Stones', correct: false }
        ],
        correctDiagnoses: ['appendicitis']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 3,
        treatments: [
          { id: 'surgery', name: 'Appendectomy', category: 'Procedure', necessary: true },
          { id: 'antibiotics', name: 'IV Antibiotics', category: 'Medication', necessary: true },
          { id: 'pain-control', name: 'Pain Management', category: 'Medication', necessary: true }
        ],
        correctTreatments: ['surgery', 'antibiotics', 'pain-control']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you for the quick diagnosis! I feel much better after surgery.",
        good: "I'm relieved to know what was wrong.",
        poor: "I'm glad we caught this in time.",
        failed: "Could this have been something serious?"
      },
      mentor: {
        excellent: "Excellent diagnosis of appendicitis with prompt surgical intervention.",
        good: "Good recognition of classic appendicitis presentation.",
        poor: "Remember to consider imaging for atypical presentations.",
        failed: "This requires immediate surgical evaluation for possible appendicitis."
      }
    }
  },
  {
    id: 'peptic-ulcer',
    categoryId: 'gastro',
    title: 'Peptic Ulcer Disease',
    shortTitle: 'Ulcer',
    shortDescription: '45M with stomach pain',
    avatar: '🔥',
    xpReward: 20, // Medium difficulty
    stars: 3,
    unlocked: true,
    system: 'Gastrointestinal',
    level: 1,
    difficulty: 3,
    patient: {
      name: 'David Martinez',
      age: 45,
      gender: 'Male',
      chiefComplaint: 'Burning stomach pain',
      background: '45-year-old male with 3-week history of burning epigastric pain that worsens when hungry and improves with food.'
    },
    scoring: {
      baseXP: 120, // Updated for realistic progression
      timeThresholds: {
        excellent: 240,
        good: 360,
        poor: 480
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'pain-character', text: 'Can you describe the stomach pain?', category: 'Present Illness', relevant: true },
          { id: 'pain-timing', text: 'When does the pain occur?', category: 'Present Illness', relevant: true },
          { id: 'nsaid-use', text: 'Do you take any pain medications?', category: 'Past Medical', relevant: true },
          { id: 'black-stools', text: 'Any black or tarry stools?', category: 'Review of Systems', relevant: true },
          { id: 'alcohol-use', text: 'How much alcohol do you drink?', category: 'Social', relevant: true }
        ],
        correctAnswers: ['pain-character', 'pain-timing', 'nsaid-use', 'black-stools']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 3,
        tests: [
          { id: 'h-pylori', name: 'H. pylori Test', category: 'Blood Work', cost: 50, necessary: true },
          { id: 'cbc', name: 'Complete Blood Count', category: 'Blood Work', cost: 25, necessary: true },
          { id: 'endoscopy', name: 'Upper Endoscopy', category: 'Other', cost: 500, necessary: false }
        ],
        correctTests: ['h-pylori', 'cbc']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'peptic-ulcer', diagnosis: 'Peptic Ulcer Disease', correct: true },
          { id: 'gastritis', diagnosis: 'Gastritis', correct: false },
          { id: 'gerd', diagnosis: 'GERD', correct: false }
        ],
        correctDiagnoses: ['peptic-ulcer']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 4,
        treatments: [
          { id: 'ppi', name: 'Proton Pump Inhibitor', category: 'Medication', necessary: true },
          { id: 'antibiotics', name: 'H. pylori Triple Therapy', category: 'Medication', necessary: true },
          { id: 'avoid-nsaids', name: 'Avoid NSAIDs', category: 'Lifestyle', necessary: true },
          { id: 'diet-changes', name: 'Dietary Modifications', category: 'Lifestyle', necessary: false }
        ],
        correctTreatments: ['ppi', 'antibiotics', 'avoid-nsaids']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you! The stomach pain is much better now.",
        good: "I understand what caused this now.",
        poor: "I'll be more careful with pain medications.",
        failed: "Is this something serious?"
      },
      mentor: {
        excellent: "Excellent diagnosis with appropriate H. pylori eradication therapy.",
        good: "Good recognition of peptic ulcer disease.",
        poor: "Remember to test for H. pylori in peptic ulcer patients.",
        failed: "This epigastric pain pattern suggests peptic ulcer disease."
      }
    }
  },
  {
    id: 'gastroenteritis',
    categoryId: 'gastro',
    title: 'Acute Gastroenteritis',
    shortTitle: 'Stomach Bug',
    shortDescription: '29F with nausea and diarrhea',
    avatar: '🤮',
    xpReward: 10, // Easy difficulty
    stars: 2,
    unlocked: true,
    system: 'Gastrointestinal',
    level: 1,
    difficulty: 2,
    patient: {
      name: 'Maria Lopez',
      age: 29,
      gender: 'Female',
      chiefComplaint: 'Nausea, vomiting, and diarrhea',
      background: '29-year-old female with 2-day history of nausea, vomiting, and watery diarrhea after eating at a restaurant.'
    },
    scoring: {
      baseXP: 100, // Updated for realistic progression
      timeThresholds: {
        excellent: 180,
        good: 300,
        poor: 420
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'symptom-onset', text: 'When did your symptoms start?', category: 'Present Illness', relevant: true },
          { id: 'food-history', text: 'What did you eat recently?', category: 'Present Illness', relevant: true },
          { id: 'fever', text: 'Any fever?', category: 'Review of Systems', relevant: true },
          { id: 'dehydration', text: 'Are you drinking enough fluids?', category: 'Review of Systems', relevant: true },
          { id: 'sick-contacts', text: 'Anyone else sick at home?', category: 'Social', relevant: false }
        ],
        correctAnswers: ['symptom-onset', 'food-history', 'fever', 'dehydration']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 2,
        tests: [
          { id: 'basic-metabolic', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 35, necessary: true },
          { id: 'stool-culture', name: 'Stool Culture', category: 'Other', cost: 75, necessary: false }
        ],
        correctTests: ['basic-metabolic']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'gastroenteritis', diagnosis: 'Acute Gastroenteritis', correct: true },
          { id: 'appendicitis', diagnosis: 'Appendicitis', correct: false },
          { id: 'food-poisoning', diagnosis: 'Food Poisoning', correct: false }
        ],
        correctDiagnoses: ['gastroenteritis']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 3,
        treatments: [
          { id: 'fluids', name: 'Oral Rehydration', category: 'Lifestyle', necessary: true },
          { id: 'bland-diet', name: 'BRAT Diet', category: 'Lifestyle', necessary: true },
          { id: 'antibiotics', name: 'Antibiotics', category: 'Medication', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['fluids', 'bland-diet']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you! I'm feeling much better with the fluids.",
        good: "I understand what to do now.",
        poor: "I hope this gets better soon.",
        failed: "Do I need antibiotics?"
      },
      mentor: {
        excellent: "Perfect management of viral gastroenteritis with supportive care.",
        good: "Good recognition of self-limiting gastroenteritis.",
        poor: "Remember that most gastroenteritis is viral and self-limiting.",
        failed: "This is likely viral gastroenteritis requiring supportive care only."
      }
    }
  },

  // ===== RESPIRATORY CASES =====
  {
    id: 'asthma-exacerbation',
    categoryId: 'respiratory',
    title: 'Asthma Exacerbation',
    shortTitle: 'Asthma',
    shortDescription: '16F with wheezing and shortness of breath',
    avatar: '💨',
    xpReward: 20, // Medium difficulty
    stars: 3,
    unlocked: true,
    system: 'Respiratory',
    level: 1,
    difficulty: 3,
    patient: {
      name: 'Emily Chen',
      age: 16,
      gender: 'Female',
      chiefComplaint: 'Wheezing and difficulty breathing',
      background: '16-year-old female with known asthma presenting with worsening wheezing and shortness of breath over 2 days.'
    },
    scoring: {
      baseXP: 120, // Updated for realistic progression
      timeThresholds: {
        excellent: 240,
        good: 360,
        poor: 480
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'asthma-history', text: 'Do you have a history of asthma?', category: 'Past Medical', relevant: true },
          { id: 'triggers', text: 'What might have triggered this episode?', category: 'Present Illness', relevant: true },
          { id: 'medication-use', text: 'Are you using your inhaler?', category: 'Past Medical', relevant: true },
          { id: 'peak-flow', text: 'Do you know your normal peak flow?', category: 'Past Medical', relevant: true },
          { id: 'chest-tightness', text: 'Any chest tightness?', category: 'Review of Systems', relevant: true }
        ],
        correctAnswers: ['asthma-history', 'triggers', 'medication-use', 'peak-flow']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 3,
        tests: [
          { id: 'peak-flow', name: 'Peak Flow Measurement', category: 'Other', cost: 25, necessary: true },
          { id: 'pulse-ox', name: 'Pulse Oximetry', category: 'Other', cost: 20, necessary: true },
          { id: 'chest-xray', name: 'Chest X-ray', category: 'Imaging', cost: 100, necessary: false }
        ],
        correctTests: ['peak-flow', 'pulse-ox']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'asthma-exacerbation', diagnosis: 'Asthma Exacerbation', correct: true },
          { id: 'pneumonia', diagnosis: 'Pneumonia', correct: false },
          { id: 'panic-attack', diagnosis: 'Panic Attack', correct: false }
        ],
        correctDiagnoses: ['asthma-exacerbation']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 4,
        treatments: [
          { id: 'albuterol', name: 'Albuterol Nebulizer', category: 'Medication', necessary: true },
          { id: 'steroids', name: 'Oral Prednisone', category: 'Medication', necessary: true },
          { id: 'oxygen', name: 'Oxygen if needed', category: 'Procedure', necessary: true },
          { id: 'education', name: 'Asthma Action Plan', category: 'Lifestyle', necessary: true }
        ],
        correctTreatments: ['albuterol', 'steroids', 'oxygen', 'education']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you! I can breathe so much better now.",
        good: "The wheezing is getting better.",
        poor: "I'm still having some trouble breathing.",
        failed: "Am I having a bad asthma attack?"
      },
      mentor: {
        excellent: "Excellent asthma management with bronchodilators and corticosteroids.",
        good: "Good recognition of asthma exacerbation.",
        poor: "Consider peak flow monitoring in asthma patients.",
        failed: "This asthma exacerbation requires immediate bronchodilator therapy."
      }
    }
  },
  {
    id: 'copd-exacerbation',
    categoryId: 'respiratory',
    title: 'COPD Exacerbation',
    shortTitle: 'COPD',
    shortDescription: '68M smoker with worsening cough',
    avatar: '🚬',
    xpReward: 30, // Hard difficulty
    stars: 4,
    unlocked: true,
    system: 'Respiratory',
    level: 1,
    difficulty: 4,
    patient: {
      name: 'Frank Johnson',
      age: 68,
      gender: 'Male',
      chiefComplaint: 'Worsening cough and shortness of breath',
      background: '68-year-old male with COPD presenting with 3-day history of increased cough, yellow sputum, and worsening dyspnea.'
    },
    scoring: {
      baseXP: 140, // Updated for realistic progression
      timeThresholds: {
        excellent: 300,
        good: 420,
        poor: 540
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 5,
        questions: [
          { id: 'copd-history', text: 'Do you have COPD or emphysema?', category: 'Past Medical', relevant: true },
          { id: 'smoking', text: 'Do you smoke?', category: 'Social', relevant: true },
          { id: 'sputum-change', text: 'Has your sputum changed color?', category: 'Present Illness', relevant: true },
          { id: 'baseline-function', text: 'How is this compared to your usual breathing?', category: 'Present Illness', relevant: true },
          { id: 'home-oxygen', text: 'Do you use oxygen at home?', category: 'Past Medical', relevant: true },
          { id: 'fever', text: 'Any fever?', category: 'Review of Systems', relevant: true }
        ],
        correctAnswers: ['copd-history', 'smoking', 'sputum-change', 'baseline-function', 'fever']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 4,
        tests: [
          { id: 'chest-xray', name: 'Chest X-ray', category: 'Imaging', cost: 100, necessary: true },
          { id: 'abg', name: 'Arterial Blood Gas', category: 'Blood Work', cost: 80, necessary: true },
          { id: 'sputum-culture', name: 'Sputum Culture', category: 'Other', cost: 50, necessary: true },
          { id: 'ct-chest', name: 'CT Chest', category: 'Imaging', cost: 300, necessary: false }
        ],
        correctTests: ['chest-xray', 'abg', 'sputum-culture']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'copd-exacerbation', diagnosis: 'COPD Exacerbation', correct: true },
          { id: 'pneumonia', diagnosis: 'Pneumonia', correct: false },
          { id: 'heart-failure', diagnosis: 'Congestive Heart Failure', correct: false }
        ],
        correctDiagnoses: ['copd-exacerbation']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 5,
        treatments: [
          { id: 'bronchodilators', name: 'Albuterol + Ipratropium', category: 'Medication', necessary: true },
          { id: 'steroids', name: 'Methylprednisolone', category: 'Medication', necessary: true },
          { id: 'antibiotics', name: 'Azithromycin', category: 'Medication', necessary: true },
          { id: 'oxygen', name: 'Supplemental Oxygen', category: 'Procedure', necessary: true },
          { id: 'smoking-cessation', name: 'Smoking Cessation Counseling', category: 'Lifestyle', necessary: true }
        ],
        correctTreatments: ['bronchodilators', 'steroids', 'antibiotics', 'oxygen', 'smoking-cessation']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you doctor! I can breathe much easier now.",
        good: "I'm feeling better with the treatments.",
        poor: "It's still hard to breathe, but I'll keep trying.",
        failed: "Is my breathing going to get worse?"
      },
      mentor: {
        excellent: "Excellent COPD exacerbation management with comprehensive therapy.",
        good: "Good recognition of COPD exacerbation with appropriate treatment.",
        poor: "Consider arterial blood gas analysis in COPD exacerbations.",
        failed: "This COPD exacerbation requires immediate bronchodilator and steroid therapy."
      }
    }
  },
  {
    id: 'pulmonary-embolism',
    categoryId: 'respiratory',
    title: 'Pulmonary Embolism',
    shortTitle: 'PE',
    shortDescription: '35F with sudden chest pain',
    avatar: '🫁',
    xpReward: 10, // Easy difficulty - despite being serious, straightforward presentation
    stars: 2,
    unlocked: true,
    system: 'Respiratory',
    level: 1,
    difficulty: 2,
    patient: {
      name: 'Jennifer White',
      age: 35,
      gender: 'Female',
      chiefComplaint: 'Sudden onset chest pain and shortness of breath',
      background: '35-year-old female on birth control pills presenting with sudden onset chest pain and dyspnea after a long car trip.'
    },
    scoring: {
      baseXP: 100, // Updated for realistic progression
      timeThresholds: {
        excellent: 180,
        good: 300,
        poor: 420
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        minimumRequired: 4,
        questions: [
          { id: 'onset', text: 'How quickly did the symptoms start?', category: 'Present Illness', relevant: true },
          { id: 'risk-factors', text: 'Are you on birth control or have you traveled recently?', category: 'Social', relevant: true },
          { id: 'leg-swelling', text: 'Any leg pain or swelling?', category: 'Review of Systems', relevant: true },
          { id: 'chest-pain-character', text: 'Can you describe the chest pain?', category: 'Present Illness', relevant: true },
          { id: 'family-clots', text: 'Any family history of blood clots?', category: 'Family', relevant: true }
        ],
        correctAnswers: ['onset', 'risk-factors', 'leg-swelling', 'chest-pain-character']
      },
      [StepType.ORDERING_TESTS]: {
        maxAllowed: 3,
        tests: [
          { id: 'd-dimer', name: 'D-Dimer', category: 'Blood Work', cost: 60, necessary: true },
          { id: 'ct-pe', name: 'CT Pulmonary Angiogram', category: 'Imaging', cost: 500, necessary: true },
          { id: 'leg-ultrasound', name: 'Leg Doppler Ultrasound', category: 'Imaging', cost: 200, necessary: false }
        ],
        correctTests: ['d-dimer', 'ct-pe']
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'pulmonary-embolism', diagnosis: 'Pulmonary Embolism', correct: true },
          { id: 'pneumonia', diagnosis: 'Pneumonia', correct: false },
          { id: 'anxiety', diagnosis: 'Anxiety Attack', correct: false }
        ],
        correctDiagnoses: ['pulmonary-embolism']
      },
      [StepType.TREATMENT]: {
        maxAllowed: 3,
        treatments: [
          { id: 'anticoagulation', name: 'Heparin/Warfarin', category: 'Medication', necessary: true },
          { id: 'oxygen', name: 'Oxygen Therapy', category: 'Procedure', necessary: true },
          { id: 'bed-rest', name: 'Bed Rest', category: 'Lifestyle', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['anticoagulation', 'oxygen']
      }
    },
    reactions: {
      patient: {
        excellent: "Thank you for catching this so quickly!",
        good: "I'm relieved to know what's wrong.",
        poor: "This sounds serious, but I trust your treatment.",
        failed: "Is this life-threatening?"
      },
      mentor: {
        excellent: "Excellent diagnosis of PE with prompt anticoagulation.",
        good: "Good recognition of PE risk factors and presentation.",
        poor: "Consider Wells score for PE probability assessment.",
        failed: "This presentation suggests pulmonary embolism requiring immediate anticoagulation."
      }
    }
  },

  // GASTROENTEROLOGY CASE - Acute Appendicitis
  {
    id: 'gastro-001',
    categoryId: 'gastro',
    title: 'Acute Abdominal Pain',
    shortTitle: 'Appendicitis',
    shortDescription: '22M with severe abdominal pain',
    avatar: '🤢',
    xpReward: 30,
    stars: 4,
    unlocked: true,
    system: 'Gastroenterology',
    level: 1,
    difficulty: 3,
    patient: {
      name: 'Michael Chen',
      age: 22,
      gender: 'Male',
      chiefComplaint: 'Severe abdominal pain for 8 hours',
      background: '22-year-old college student presenting with severe right lower quadrant abdominal pain that started periumbilically and migrated. Associated with nausea and low-grade fever.'
    },
    scoring: {
      baseXP: 130,
      timeThresholds: {
        excellent: 300,
        good: 420,
        poor: 540
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'h1', text: 'Where did the pain start and how has it changed?', relevant: true, category: 'Present Illness' },
          { id: 'h2', text: 'When was the last time you ate?', relevant: true, category: 'Present Illness' },
          { id: 'h3', text: 'Any nausea or vomiting?', relevant: true, category: 'Present Illness' },
          { id: 'h4', text: 'Any fever or chills?', relevant: true, category: 'Review of Systems' },
          { id: 'h5', text: 'Have you had your appendix removed?', relevant: true, category: 'Past Medical' },
          { id: 'h6', text: 'Any recent travel or unusual foods?', relevant: false, category: 'Social' },
          { id: 'h7', text: 'Any family history of inflammatory bowel disease?', relevant: false, category: 'Family' },
          { id: 'h8', text: 'Does movement or coughing make the pain worse?', relevant: true, category: 'Present Illness' },
          { id: 'h9', text: 'Any changes in bowel movements?', relevant: true, category: 'Review of Systems' },
          { id: 'h10', text: 'Any urinary symptoms?', relevant: true, category: 'Review of Systems' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h8', 'h9'],
        minimumRequired: 5
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 't1', name: 'Complete Blood Count (CBC)', category: 'Blood Work', cost: 25, necessary: true },
          { id: 't2', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 30, necessary: false },
          { id: 't3', name: 'Urinalysis', category: 'Urinalysis', cost: 20, necessary: true },
          { id: 't4', name: 'CT Abdomen/Pelvis with Contrast', category: 'Imaging', cost: 450, necessary: true },
          { id: 't5', name: 'C-Reactive Protein (CRP)', category: 'Blood Work', cost: 25, necessary: true },
          { id: 't6', name: 'Abdominal Ultrasound', category: 'Imaging', cost: 200, necessary: false },
          { id: 't7', name: 'Lipase', category: 'Blood Work', cost: 35, necessary: false },
          { id: 't8', name: 'Liver Function Tests', category: 'Blood Work', cost: 35, necessary: false },
          { id: 't9', name: 'Beta-hCG (pregnancy test)', category: 'Hormones', cost: 30, necessary: false },
          { id: 't10', name: 'MRI Abdomen', category: 'Imaging', cost: 800, necessary: false },
          { id: 't11', name: 'Colonoscopy', category: 'Other', cost: 1200, necessary: false, contraindicated: true }
        ],
        correctTests: ['t1', 't3', 't4', 't5'],
        maxAllowed: 4
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'd1', diagnosis: 'Acute Appendicitis', correct: true },
          { id: 'd2', diagnosis: 'Gastroenteritis', correct: false },
          { id: 'd3', diagnosis: 'Kidney Stone', correct: false },
          { id: 'd4', diagnosis: 'Inflammatory Bowel Disease', correct: false },
          { id: 'd5', diagnosis: 'Ovarian Cyst (if female)', correct: false }
        ],
        correctDiagnoses: ['d1']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'tx1', name: 'Urgent surgical consultation', category: 'Follow-up', necessary: true },
          { id: 'tx2', name: 'NPO (nothing by mouth)', category: 'Lifestyle', necessary: true },
          { id: 'tx3', name: 'IV fluids', category: 'Procedure', necessary: true },
          { id: 'tx4', name: 'Pain management (IV morphine)', category: 'Medication', necessary: true },
          { id: 'tx5', name: 'Antibiotics (cefoxitin)', category: 'Medication', necessary: true },
          { id: 'tx6', name: 'Oral pain medications and discharge', category: 'Medication', necessary: false, contraindicated: true },
          { id: 'tx7', name: 'Antacids', category: 'Medication', necessary: false }
        ],
        correctTreatments: ['tx1', 'tx2', 'tx3', 'tx4', 'tx5'],
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
    }
  },

  // ENDOCRINOLOGY CASE - Type 1 Diabetes Presentation
  {
    id: 'endo-001',
    categoryId: 'endocrinology',
    title: 'New-Onset Diabetes',
    shortTitle: 'Type 1 DM',
    shortDescription: '16F with increased thirst',
    avatar: '💉',
    xpReward: 25,
    stars: 3,
    unlocked: true,
    system: 'Endocrinology',
    level: 1,
    difficulty: 3,
    patient: {
      name: 'Ashley Rodriguez',
      age: 16,
      gender: 'Female',
      chiefComplaint: 'Increased thirst and frequent urination',
      background: '16-year-old previously healthy female presenting with 2-week history of excessive thirst, frequent urination, fatigue, and 10-pound weight loss despite increased appetite.'
    },
    scoring: {
      baseXP: 125,
      timeThresholds: {
        excellent: 300,
        good: 420,
        poor: 540
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'h1', text: 'How long have you had these symptoms?', relevant: true, category: 'Present Illness' },
          { id: 'h2', text: 'How much water are you drinking per day?', relevant: true, category: 'Present Illness' },
          { id: 'h3', text: 'Have you lost weight recently?', relevant: true, category: 'Present Illness' },
          { id: 'h4', text: 'Any family history of diabetes?', relevant: true, category: 'Family' },
          { id: 'h5', text: 'Any abdominal pain or vomiting?', relevant: true, category: 'Review of Systems' },
          { id: 'h6', text: 'Are you taking any medications?', relevant: true, category: 'Past Medical' },
          { id: 'h7', text: 'Any recent infections or stress?', relevant: true, category: 'Present Illness' },
          { id: 'h8', text: 'Do you exercise regularly?', relevant: false, category: 'Social' },
          { id: 'h9', text: 'Any vision changes?', relevant: true, category: 'Review of Systems' },
          { id: 'h10', text: 'How is your energy level?', relevant: true, category: 'Review of Systems' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h7', 'h9', 'h10'],
        minimumRequired: 5
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 't1', name: 'Blood Glucose (Random)', category: 'Blood Work', cost: 15, necessary: true },
          { id: 't2', name: 'HbA1c', category: 'Blood Work', cost: 30, necessary: true },
          { id: 't3', name: 'Urinalysis with Ketones', category: 'Urinalysis', cost: 25, necessary: true },
          { id: 't4', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 30, necessary: true },
          { id: 't5', name: 'Arterial Blood Gas (ABG)', category: 'Blood Work', cost: 40, necessary: true },
          { id: 't6', name: 'C-peptide', category: 'Hormones', cost: 45, necessary: false },
          { id: 't7', name: 'Anti-GAD antibodies', category: 'Serology', cost: 75, necessary: false },
          { id: 't8', name: 'Thyroid Function Tests', category: 'Hormones', cost: 40, necessary: false },
          { id: 't9', name: 'Complete Blood Count', category: 'Blood Work', cost: 25, necessary: false },
          { id: 't10', name: 'Lipid Panel', category: 'Blood Work', cost: 25, necessary: false },
          { id: 't11', name: 'Abdominal CT', category: 'Imaging', cost: 450, necessary: false }
        ],
        correctTests: ['t1', 't2', 't3', 't4', 't5'],
        maxAllowed: 5
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'd1', diagnosis: 'Type 1 Diabetes Mellitus', correct: true },
          { id: 'd2', diagnosis: 'Type 2 Diabetes Mellitus', correct: false },
          { id: 'd3', diagnosis: 'Diabetes Insipidus', correct: false },
          { id: 'd4', diagnosis: 'Hyperthyroidism', correct: false },
          { id: 'd5', diagnosis: 'Urinary Tract Infection', correct: false }
        ],
        correctDiagnoses: ['d1']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'tx1', name: 'Insulin therapy (long and short-acting)', category: 'Medication', necessary: true },
          { id: 'tx2', name: 'Diabetes education and counseling', category: 'Follow-up', necessary: true },
          { id: 'tx3', name: 'Blood glucose monitoring supplies', category: 'Procedure', necessary: true },
          { id: 'tx4', name: 'Endocrinology referral', category: 'Follow-up', necessary: true },
          { id: 'tx5', name: 'Nutritionist consultation', category: 'Follow-up', necessary: true },
          { id: 'tx6', name: 'Metformin therapy', category: 'Medication', necessary: false, contraindicated: true },
          { id: 'tx7', name: 'Low-carb diet only', category: 'Lifestyle', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['tx1', 'tx2', 'tx3', 'tx4', 'tx5'],
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
    }
  },

  // ORTHOPEDIC CASE - Ankle Fracture
  {
    id: 'ortho-001',
    categoryId: 'orthopedics',
    title: 'Ankle Injury After Fall',
    shortTitle: 'Ankle Fracture',
    shortDescription: '35M construction worker injury',
    avatar: '🦴',
    xpReward: 20,
    stars: 2,
    unlocked: true,
    system: 'Orthopedics',
    level: 1,
    difficulty: 2,
    patient: {
      name: 'David Thompson',
      age: 35,
      gender: 'Male',
      chiefComplaint: 'Ankle pain after falling off ladder',
      background: '35-year-old construction worker who fell off a ladder and landed awkwardly on his right ankle. Unable to bear weight, with obvious swelling and deformity.'
    },
    scoring: {
      baseXP: 100,
      timeThresholds: {
        excellent: 180,
        good: 300,
        poor: 420
      },
      optimalOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT]
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: [
          { id: 'h1', text: 'How did the injury occur?', relevant: true, category: 'Present Illness' },
          { id: 'h2', text: 'Can you bear weight on the ankle?', relevant: true, category: 'Present Illness' },
          { id: 'h3', text: 'Can you take 4 steps immediately after injury?', relevant: true, category: 'Present Illness' },
          { id: 'h4', text: 'Is there tenderness over the malleoli bones?', relevant: true, category: 'Present Illness' },
          { id: 'h5', text: 'Any numbness or tingling in your foot?', relevant: true, category: 'Review of Systems' },
          { id: 'h6', text: 'Can you feel your toes normally?', relevant: true, category: 'Review of Systems' },
          { id: 'h7', text: 'Any previous ankle injuries?', relevant: true, category: 'Past Medical' },
          { id: 'h8', text: 'Are you taking any blood thinners?', relevant: true, category: 'Past Medical' },
          { id: 'h9', text: 'Do you have diabetes or circulation problems?', relevant: true, category: 'Past Medical' },
          { id: 'h10', text: 'Any allergies to pain medications?', relevant: true, category: 'Past Medical' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10'],
        minimumRequired: 4
      },
      [StepType.ORDERING_TESTS]: {
        tests: [
          { id: 't1', name: 'Ankle X-ray (3 views)', category: 'Imaging', cost: 120, necessary: true },
          { id: 't2', name: 'Neurovascular assessment', category: 'Neurological', cost: 0, necessary: true },
          { id: 't3', name: 'Foot X-ray', category: 'Imaging', cost: 100, necessary: false },
          { id: 't4', name: 'Ankle MRI', category: 'Imaging', cost: 800, necessary: false },
          { id: 't5', name: 'CT Ankle', category: 'Imaging', cost: 400, necessary: false },
          { id: 't6', name: 'Complete Blood Count', category: 'Blood Work', cost: 25, necessary: false },
          { id: 't7', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 30, necessary: false },
          { id: 't8', name: 'Coagulation Studies', category: 'Blood Work', cost: 35, necessary: false },
          { id: 't9', name: 'Ultrasound Ankle', category: 'Imaging', cost: 200, necessary: false },
          { id: 't10', name: 'Bone Scan', category: 'Imaging', cost: 600, necessary: false }
        ],
        correctTests: ['t1', 't2'],
        maxAllowed: 3
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'd1', diagnosis: 'Lateral Malleolus Fracture (Weber B)', correct: true },
          { id: 'd2', diagnosis: 'Ankle Sprain', correct: false },
          { id: 'd3', diagnosis: 'Achilles Tendon Rupture', correct: false },
          { id: 'd4', diagnosis: 'Calcaneus Fracture', correct: false },
          { id: 'd5', diagnosis: 'Soft Tissue Contusion', correct: false }
        ],
        correctDiagnoses: ['d1']
      },
      [StepType.TREATMENT]: {
        treatments: [
          { id: 'tx1', name: 'Orthopedic surgery consultation', category: 'Follow-up', necessary: true },
          { id: 'tx2', name: 'Short leg splint application', category: 'Procedure', necessary: true },
          { id: 'tx3', name: 'Non-weight bearing orders', category: 'Lifestyle', necessary: true },
          { id: 'tx4', name: 'Pain management (opioids/NSAIDs)', category: 'Medication', necessary: true },
          { id: 'tx5', name: 'Crutches or walker', category: 'Procedure', necessary: true },
          { id: 'tx6', name: 'Ice 20 minutes every 2 hours x 48 hours', category: 'Lifestyle', necessary: true },
          { id: 'tx7', name: 'Elevation above heart level', category: 'Lifestyle', necessary: true },
          { id: 'tx8', name: 'Follow-up in 1-2 days', category: 'Follow-up', necessary: true },
          { id: 'tx9', name: 'Return to full activity immediately', category: 'Lifestyle', necessary: false, contraindicated: true },
          { id: 'tx10', name: 'Weight bearing as tolerated', category: 'Lifestyle', necessary: false, contraindicated: true }
        ],
        correctTreatments: ['tx1', 'tx2', 'tx3', 'tx4', 'tx5', 'tx6', 'tx7', 'tx8'],
        maxAllowed: 10
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
    }
  }
]; 