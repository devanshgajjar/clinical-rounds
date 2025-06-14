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
  isEmergency?: boolean;
  categoryId?: string;
  xpReward?: number;
  stars?: number;
  shortTitle?: string;
  shortDescription?: string;
  avatar?: string;
  unlocked?: boolean;
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
          { id: 'h10', text: 'Any numbness in the affected hand?', relevant: true, category: 'Review of Systems' },
          { id: 'h11', text: 'Did the dog appear sick or aggressive?', relevant: true, category: 'Present Illness' },
          { id: 'h12', text: 'Have you received rabies shots before?', relevant: true, category: 'Past Medical' },
          { id: 'h13', text: 'Any difficulty moving the affected hand?', relevant: true, category: 'Review of Systems' },
          { id: 'h7', text: 'Do you smoke cigarettes?', relevant: false, category: 'Social' },
          { id: 'h8', text: 'Any family history of diabetes?', relevant: false, category: 'Family' },
          { id: 'h9', text: 'Are you experiencing any nausea?', relevant: false, category: 'Review of Systems' },
          { id: 'h14', text: 'Do you have any pets at home?', relevant: false, category: 'Social' },
          { id: 'h15', text: 'Have you traveled outside the country recently?', relevant: false, category: 'Social' },
          { id: 'h16', text: 'Was the dog wearing sunglasses?', relevant: false, category: 'Social' },
          { id: 'h17', text: 'Did the dog offer you medical advice after the bite?', relevant: false, category: 'Social' }
        ],
        correctAnswers: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h10', 'h11', 'h12', 'h13'],
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
    },
    isEmergency: true,
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
    },
    isEmergency: true,
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
    },
    isEmergency: true,
  },

  // GASTROINTESTINAL CASE - Acute Appendicitis
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
          { id: 'ankle-xray', name: 'Ankle X-ray (3 views)', category: 'Imaging', cost: 120, necessary: true },
          { id: 'neurovascular-assessment', name: 'Neurovascular Assessment', category: 'Neurological', cost: 0, necessary: true },
          { id: 'foot-xray', name: 'Foot X-ray', category: 'Imaging', cost: 100, necessary: false },
          { id: 'mri-ankle', name: 'Ankle MRI', category: 'Imaging', cost: 800, necessary: false },
          { id: 'ct-ankle', name: 'CT Ankle', category: 'Imaging', cost: 400, necessary: false },
          { id: 'cbc', name: 'Complete Blood Count', category: 'Blood Work', cost: 25, necessary: false },
          { id: 'bmp', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 30, necessary: false },
          { id: 'pt-inr', name: 'Prothrombin Time (PT/INR)', category: 'Blood Work', cost: 35, necessary: false },
          { id: 'ankle-us', name: 'Ankle Ultrasound', category: 'Imaging', cost: 200, necessary: false },
          { id: 'bone-scan', name: 'Bone Scan', category: 'Imaging', cost: 600, necessary: false }
        ],
        correctTests: ['ankle-xray', 'neurovascular-assessment'],
        maxAllowed: 3
      },
      [StepType.DIAGNOSIS]: {
        type: 'multiple-choice',
        options: [
          { id: 'lateral-malleolus-fracture', diagnosis: 'Lateral Malleolus Fracture (Weber B)', correct: true },
          { id: 'ankle-sprain', diagnosis: 'Ankle Sprain', correct: false },
          { id: 'achilles-rupture', diagnosis: 'Achilles Tendon Rupture', correct: false },
          { id: 'calcaneus-fracture', diagnosis: 'Calcaneus Fracture', correct: false },
          { id: 'soft-tissue-contusion', diagnosis: 'Soft Tissue Contusion', correct: false }
        ],
        correctDiagnoses: ['lateral-malleolus-fracture']
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
    },
    isEmergency: true,
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
    },
    isEmergency: true,
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
          { id: 'ankle-xray', name: 'Ankle X-ray (3 views)', category: 'Imaging', cost: 120, necessary: true },
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
        correctTests: ['ankle-xray', 't2'],
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
    },
    isEmergency: true,
  }
]; 