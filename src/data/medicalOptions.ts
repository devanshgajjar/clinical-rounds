export interface MedicalTest {
  id: string;
  name: string;
  category: string;
  cost: number;
  description?: string;
}

export interface MedicalDiagnosis {
  id: string;
  name: string;
  category: string;
  icd10?: string;
  description?: string;
}

export interface MedicalTreatment {
  id: string;
  name: string;
  category: string;
  description?: string;
  dosage?: string;
}

// Comprehensive Test Database
export const medicalTests: MedicalTest[] = [
  // Blood Work - Core Tests
  { id: 'cbc', name: 'Complete Blood Count (CBC)', category: 'Blood Work', cost: 25 },
  { id: 'bmp', name: 'Basic Metabolic Panel', category: 'Blood Work', cost: 30 },
  { id: 'cmp', name: 'Comprehensive Metabolic Panel', category: 'Blood Work', cost: 45 },
  { id: 'liver-func', name: 'Liver Function Tests', category: 'Blood Work', cost: 35 },
  { id: 'lipid-panel', name: 'Lipid Panel', category: 'Blood Work', cost: 25 },
  { id: 'thyroid-func', name: 'Thyroid Function Tests (TSH, T3, T4)', category: 'Blood Work', cost: 40 },
  { id: 'hba1c', name: 'Hemoglobin A1c', category: 'Blood Work', cost: 30 },
  { id: 'glucose', name: 'Blood Glucose', category: 'Blood Work', cost: 15 },
  { id: 'pt-inr', name: 'Prothrombin Time (PT/INR)', category: 'Blood Work', cost: 20 },
  { id: 'ptt', name: 'Partial Thromboplastin Time (PTT)', category: 'Blood Work', cost: 20 },
  { id: 'esr', name: 'Erythrocyte Sedimentation Rate (ESR)', category: 'Blood Work', cost: 15 },
  { id: 'crp', name: 'C-Reactive Protein (CRP)', category: 'Blood Work', cost: 25 },
  { id: 'procalcitonin', name: 'Procalcitonin', category: 'Blood Work', cost: 45 },
  { id: 'lactate', name: 'Serum Lactate', category: 'Blood Work', cost: 20 },
  { id: 'arterial-blood-gas', name: 'Arterial Blood Gas (ABG)', category: 'Blood Work', cost: 80 },
  { id: 'venous-blood-gas', name: 'Venous Blood Gas (VBG)', category: 'Blood Work', cost: 60 },
  
  // Blood Work - Specialized
  { id: 'iron-studies', name: 'Iron Studies (Ferritin, TIBC, Iron)', category: 'Blood Work', cost: 40 },
  { id: 'b12-folate', name: 'Vitamin B12 and Folate', category: 'Blood Work', cost: 35 },
  { id: 'vitamin-d', name: 'Vitamin D (25-OH)', category: 'Blood Work', cost: 35 },
  { id: 'magnesium', name: 'Serum Magnesium', category: 'Blood Work', cost: 20 },
  { id: 'phosphorus', name: 'Serum Phosphorus', category: 'Blood Work', cost: 20 },
  { id: 'albumin', name: 'Serum Albumin', category: 'Blood Work', cost: 15 },
  { id: 'total-protein', name: 'Total Protein', category: 'Blood Work', cost: 15 },
  { id: 'bilirubin', name: 'Total and Direct Bilirubin', category: 'Blood Work', cost: 25 },
  { id: 'ammonia', name: 'Serum Ammonia', category: 'Blood Work', cost: 30 },
  { id: 'lactic-dehydrogenase', name: 'Lactate Dehydrogenase (LDH)', category: 'Blood Work', cost: 25 },
  
  // Cardiac Tests
  { id: 'ecg', name: 'Electrocardiogram (ECG/EKG)', category: 'Cardiac', cost: 50 },
  { id: 'echocardiogram', name: 'Echocardiogram', category: 'Cardiac', cost: 200 },
  { id: 'stress-test', name: 'Exercise Stress Test', category: 'Cardiac', cost: 300 },
  { id: 'holter', name: 'Holter Monitor (24-hour)', category: 'Cardiac', cost: 150 },
  { id: 'event-monitor', name: 'Event Monitor', category: 'Cardiac', cost: 200 },
  { id: 'treadmill-stress', name: 'Treadmill Stress Test', category: 'Cardiac', cost: 280 },
  { id: 'nuclear-stress', name: 'Nuclear Stress Test', category: 'Cardiac', cost: 600 },
  { id: 'cardiac-cath', name: 'Cardiac Catheterization', category: 'Cardiac', cost: 1000 },
  { id: 'troponin', name: 'Troponin I/T', category: 'Cardiac', cost: 40 },
  { id: 'ck-mb', name: 'Creatine Kinase-MB (CK-MB)', category: 'Cardiac', cost: 35 },
  { id: 'bnp', name: 'B-type Natriuretic Peptide (BNP)', category: 'Cardiac', cost: 50 },
  { id: 'nt-probnp', name: 'NT-proBNP', category: 'Cardiac', cost: 55 },
  { id: 'd-dimer', name: 'D-Dimer', category: 'Cardiac', cost: 30 },
  
  // Imaging - X-rays
  { id: 'chest-xray', name: 'Chest X-ray', category: 'Imaging', cost: 80 },
  { id: 'abdominal-xray', name: 'Abdominal X-ray', category: 'Imaging', cost: 90 },
  { id: 'hand-xray', name: 'X-ray Hand', category: 'Imaging', cost: 120 },
  { id: 'ankle-xray', name: 'Ankle X-ray (3 views)', category: 'Imaging', cost: 120 },
  { id: 'foot-xray', name: 'Foot X-ray', category: 'Imaging', cost: 100 },
  { id: 'knee-xray', name: 'X-ray Knee', category: 'Imaging', cost: 100 },
  { id: 'spine-xray', name: 'X-ray Spine', category: 'Imaging', cost: 110 },
  { id: 'pelvis-xray', name: 'X-ray Pelvis', category: 'Imaging', cost: 95 },
  { id: 'shoulder-xray', name: 'X-ray Shoulder', category: 'Imaging', cost: 105 },
  
  // Imaging - CT Scans
  { id: 'ct-head', name: 'CT Head (Non-contrast)', category: 'Imaging', cost: 400 },
  { id: 'ct-head-contrast', name: 'CT Head with Contrast', category: 'Imaging', cost: 500 },
  { id: 'ct-chest', name: 'CT Chest', category: 'Imaging', cost: 450 },
  { id: 'ct-abdomen', name: 'CT Abdomen/Pelvis', category: 'Imaging', cost: 500 },
  { id: 'ct-angiogram', name: 'CT Angiogram Head/Neck', category: 'Imaging', cost: 800 },
  { id: 'ct-pe', name: 'CT Pulmonary Embolism Protocol', category: 'Imaging', cost: 600 },
  { id: 'ct-coronary', name: 'CT Coronary Angiogram', category: 'Imaging', cost: 750 },
  { id: 'ct-ankle', name: 'CT Ankle', category: 'Imaging', cost: 400 },
  
  // Imaging - MRI
  { id: 'mri-brain', name: 'MRI Brain', category: 'Imaging', cost: 800 },
  { id: 'mri-spine', name: 'MRI Spine', category: 'Imaging', cost: 900 },
  { id: 'mri-knee', name: 'MRI Knee', category: 'Imaging', cost: 700 },
  { id: 'mri-shoulder', name: 'MRI Shoulder', category: 'Imaging', cost: 750 },
  { id: 'mri-cardiac', name: 'Cardiac MRI', category: 'Imaging', cost: 1200 },
  { id: 'mri-ankle', name: 'Ankle MRI', category: 'Imaging', cost: 800 },
  
  // Imaging - Ultrasound
  { id: 'echo-us', name: 'Echocardiogram (Ultrasound)', category: 'Imaging', cost: 200 },
  { id: 'abdominal-us', name: 'Abdominal Ultrasound', category: 'Imaging', cost: 200 },
  { id: 'pelvic-us', name: 'Pelvic Ultrasound', category: 'Imaging', cost: 180 },
  { id: 'thyroid-us', name: 'Thyroid Ultrasound', category: 'Imaging', cost: 160 },
  { id: 'carotid-us', name: 'Carotid Ultrasound', category: 'Imaging', cost: 220 },
  { id: 'renal-us', name: 'Renal Ultrasound', category: 'Imaging', cost: 190 },
  { id: 'ankle-us', name: 'Ankle Ultrasound', category: 'Imaging', cost: 200 },
  
  // Microbiology
  { id: 'blood-culture', name: 'Blood Culture', category: 'Microbiology', cost: 60 },
  { id: 'urine-culture', name: 'Urine Culture', category: 'Microbiology', cost: 40 },
  { id: 'sputum-culture', name: 'Sputum Culture', category: 'Microbiology', cost: 50 },
  { id: 'wound-culture', name: 'Wound Culture', category: 'Microbiology', cost: 45 },
  { id: 'stool-culture', name: 'Stool Culture', category: 'Microbiology', cost: 50 },
  { id: 'throat-culture', name: 'Throat Culture', category: 'Microbiology', cost: 35 },
  { id: 'csf-culture', name: 'CSF Culture', category: 'Microbiology', cost: 80 },
  { id: 'fungal-culture', name: 'Fungal Culture', category: 'Microbiology', cost: 70 },
  { id: 'acid-fast', name: 'Acid-Fast Bacilli (AFB)', category: 'Microbiology', cost: 45 },
  { id: 'c-diff', name: 'C. difficile Toxin', category: 'Microbiology', cost: 55 },
  
  // Serology/Immunology
  { id: 'hepatitis-panel', name: 'Hepatitis Panel (A, B, C)', category: 'Serology', cost: 75 },
  { id: 'hiv-ab', name: 'HIV Antibody Test', category: 'Serology', cost: 40 },
  { id: 'syphilis-screen', name: 'Syphilis Screening (RPR/VDRL)', category: 'Serology', cost: 30 },
  { id: 'rheumatoid-factor', name: 'Rheumatoid Factor (RF)', category: 'Serology', cost: 35 },
  { id: 'ana', name: 'Antinuclear Antibody (ANA)', category: 'Serology', cost: 45 },
  { id: 'anti-dsdna', name: 'Anti-dsDNA', category: 'Serology', cost: 50 },
  { id: 'complement', name: 'Complement C3/C4', category: 'Serology', cost: 50 },
  { id: 'anti-ccp', name: 'Anti-CCP Antibodies', category: 'Serology', cost: 60 },
  { id: 'tetanus-ab', name: 'Tetanus Antibody', category: 'Serology', cost: 30 },
  { id: 'rabies-ab', name: 'Rabies Antibody', category: 'Serology', cost: 60 },
  { id: 'influenza-ag', name: 'Influenza Antigen', category: 'Serology', cost: 40 },
  { id: 'strep-ag', name: 'Strep A Antigen', category: 'Serology', cost: 25 },
  
  // Neurological Tests
  { id: 'lumbar-puncture', name: 'Lumbar Puncture (Spinal Tap)', category: 'Neurological', cost: 200 },
  { id: 'eeg', name: 'Electroencephalogram (EEG)', category: 'Neurological', cost: 150 },
  { id: 'emg', name: 'Electromyography (EMG)', category: 'Neurological', cost: 180 },
  { id: 'nerve-conduction', name: 'Nerve Conduction Study', category: 'Neurological', cost: 160 },
  { id: 'neuro-exam', name: 'Detailed Neurological Examination', category: 'Neurological', cost: 50 },
  { id: 'neurovascular-assessment', name: 'Neurovascular Assessment', category: 'Neurological', cost: 0 },
  
  // Urinalysis
  { id: 'urinalysis', name: 'Urinalysis', category: 'Urinalysis', cost: 20 },
  { id: 'urine-micro', name: 'Urine Microscopy', category: 'Urinalysis', cost: 25 },
  { id: 'urine-protein', name: '24-hour Urine Protein', category: 'Urinalysis', cost: 60 },
  { id: 'urine-creatinine', name: 'Urine Creatinine Clearance', category: 'Urinalysis', cost: 45 },
  
  // Hormones
  { id: 'cortisol', name: 'Cortisol Level', category: 'Hormones', cost: 40 },
  { id: 'testosterone', name: 'Testosterone', category: 'Hormones', cost: 45 },
  { id: 'estradiol', name: 'Estradiol', category: 'Hormones', cost: 45 },
  { id: 'growth-hormone', name: 'Growth Hormone', category: 'Hormones', cost: 60 },
  { id: 'insulin', name: 'Insulin Level', category: 'Hormones', cost: 35 },
  { id: 'prolactin', name: 'Prolactin', category: 'Hormones', cost: 40 },
  
  // Monitoring
  { id: 'vital-signs', name: 'Vital Signs Monitoring', category: 'Monitoring', cost: 25 },
  { id: 'bp-monitoring', name: '24-hour Blood Pressure Monitoring', category: 'Monitoring', cost: 100 },
  { id: 'pulse-ox', name: 'Pulse Oximetry', category: 'Monitoring', cost: 15 },
  { id: 'telemetry', name: 'Cardiac Telemetry', category: 'Monitoring', cost: 150 },
  
  // Other Specialized Tests
  { id: 'spirometry', name: 'Spirometry (Pulmonary Function)', category: 'Other', cost: 80 },
  { id: 'peak-flow', name: 'Peak Flow Measurement', category: 'Other', cost: 20 },
  { id: 'sleep-study', name: 'Sleep Study (Polysomnography)', category: 'Other', cost: 800 },
  { id: 'endoscopy', name: 'Upper Endoscopy (EGD)', category: 'Other', cost: 500 },
  { id: 'colonoscopy', name: 'Colonoscopy', category: 'Other', cost: 600 },
  { id: 'bone-density', name: 'DEXA Bone Density Scan', category: 'Other', cost: 150 },
  { id: 'bone-scan', name: 'Bone Scan', category: 'Imaging', cost: 600 },
  { id: 'h-pylori', name: 'H. pylori Test', category: 'Other', cost: 50 },
];

// Comprehensive Diagnosis Database
export const medicalDiagnoses: MedicalDiagnosis[] = [
  // Infectious Diseases
  { id: 'cellulitis', name: 'Cellulitis', category: 'Infectious Disease', icd10: 'L03.9' },
  { id: 'pneumonia', name: 'Community-Acquired Pneumonia', category: 'Infectious Disease', icd10: 'J15.9' },
  { id: 'uti', name: 'Urinary Tract Infection', category: 'Infectious Disease', icd10: 'N39.0' },
  { id: 'sepsis', name: 'Sepsis', category: 'Infectious Disease', icd10: 'A41.9' },
  { id: 'gastroenteritis', name: 'Acute Gastroenteritis', category: 'Infectious Disease', icd10: 'K59.1' },
  { id: 'meningitis', name: 'Bacterial Meningitis', category: 'Infectious Disease', icd10: 'G00.9' },
  { id: 'endocarditis', name: 'Infective Endocarditis', category: 'Infectious Disease', icd10: 'I33.0' },
  { id: 'osteomyelitis', name: 'Osteomyelitis', category: 'Infectious Disease', icd10: 'M86.9' },
  { id: 'abscess', name: 'Skin Abscess', category: 'Infectious Disease', icd10: 'L02.9' },
  { id: 'bronchitis', name: 'Acute Bronchitis', category: 'Infectious Disease', icd10: 'J20.9' },
  
  // Cardiovascular
  { id: 'mi', name: 'Myocardial Infarction (Heart Attack)', category: 'Cardiovascular', icd10: 'I21.9' },
  { id: 'unstable-angina', name: 'Unstable Angina', category: 'Cardiovascular', icd10: 'I20.0' },
  { id: 'stable-angina', name: 'Stable Angina', category: 'Cardiovascular', icd10: 'I20.9' },
  { id: 'heart-failure', name: 'Congestive Heart Failure', category: 'Cardiovascular', icd10: 'I50.9' },
  { id: 'hypertension', name: 'Essential Hypertension', category: 'Cardiovascular', icd10: 'I10' },
  { id: 'hypertensive-emergency', name: 'Hypertensive Emergency', category: 'Cardiovascular', icd10: 'I16.1' },
  { id: 'atrial-fib', name: 'Atrial Fibrillation', category: 'Cardiovascular', icd10: 'I48.91' },
  { id: 'dvt', name: 'Deep Vein Thrombosis', category: 'Cardiovascular', icd10: 'I82.40' },
  { id: 'pe', name: 'Pulmonary Embolism', category: 'Cardiovascular', icd10: 'I26.99' },
  { id: 'cardiomyopathy', name: 'Hypertrophic Cardiomyopathy', category: 'Cardiovascular', icd10: 'I42.1' },
  { id: 'pericarditis', name: 'Acute Pericarditis', category: 'Cardiovascular', icd10: 'I30.9' },
  { id: 'aortic-stenosis', name: 'Aortic Stenosis', category: 'Cardiovascular', icd10: 'I35.0' },
  
  // Neurological
  { id: 'stroke-ischemic', name: 'Acute Ischemic Stroke', category: 'Neurological', icd10: 'I63.9' },
  { id: 'stroke-hemorrhagic', name: 'Hemorrhagic Stroke', category: 'Neurological', icd10: 'I61.9' },
  { id: 'tia', name: 'Transient Ischemic Attack', category: 'Neurological', icd10: 'G93.1' },
  { id: 'seizure-first', name: 'First-Time Seizure', category: 'Neurological', icd10: 'R56.9' },
  { id: 'epilepsy', name: 'Epilepsy', category: 'Neurological', icd10: 'G40.9' },
  { id: 'migraine', name: 'Migraine Headache', category: 'Neurological', icd10: 'G43.9' },
  { id: 'tension-headache', name: 'Tension-Type Headache', category: 'Neurological', icd10: 'G44.2' },
  { id: 'cluster-headache', name: 'Cluster Headache', category: 'Neurological', icd10: 'G44.0' },
  { id: 'concussion', name: 'Concussion', category: 'Neurological', icd10: 'S06.0' },
  { id: 'parkinsons', name: 'Parkinson\'s Disease', category: 'Neurological', icd10: 'G20' },
  { id: 'multiple-sclerosis', name: 'Multiple Sclerosis', category: 'Neurological', icd10: 'G35' },
  { id: 'brain-tumor', name: 'Brain Tumor', category: 'Neurological', icd10: 'D33.2' },
  
  // Respiratory
  { id: 'asthma-exacerbation', name: 'Asthma Exacerbation', category: 'Respiratory', icd10: 'J45.9' },
  { id: 'copd-exacerbation', name: 'COPD Exacerbation', category: 'Respiratory', icd10: 'J44.1' },
  { id: 'pneumothorax', name: 'Spontaneous Pneumothorax', category: 'Respiratory', icd10: 'J93.1' },
  { id: 'pleural-effusion', name: 'Pleural Effusion', category: 'Respiratory', icd10: 'J94.8' },
  { id: 'lung-cancer', name: 'Lung Cancer', category: 'Respiratory', icd10: 'C78.0' },
  { id: 'tuberculosis', name: 'Pulmonary Tuberculosis', category: 'Respiratory', icd10: 'A15.0' },
  { id: 'respiratory-failure', name: 'Acute Respiratory Failure', category: 'Respiratory', icd10: 'J96.0' },
  
  // Gastrointestinal
  { id: 'appendicitis', name: 'Acute Appendicitis', category: 'Gastrointestinal', icd10: 'K35.9' },
  { id: 'peptic-ulcer', name: 'Peptic Ulcer Disease', category: 'Gastrointestinal', icd10: 'K27.9' },
  { id: 'gerd', name: 'Gastroesophageal Reflux Disease', category: 'Gastrointestinal', icd10: 'K21.9' },
  { id: 'cholecystitis', name: 'Acute Cholecystitis', category: 'Gastrointestinal', icd10: 'K80.0' },
  { id: 'pancreatitis', name: 'Acute Pancreatitis', category: 'Gastrointestinal', icd10: 'K85.9' },
  { id: 'bowel-obstruction', name: 'Small Bowel Obstruction', category: 'Gastrointestinal', icd10: 'K56.6' },
  { id: 'gi-bleeding', name: 'Upper GI Bleeding', category: 'Gastrointestinal', icd10: 'K92.2' },
  { id: 'ibd', name: 'Inflammatory Bowel Disease', category: 'Gastrointestinal', icd10: 'K50.9' },
  { id: 'diverticulitis', name: 'Acute Diverticulitis', category: 'Gastrointestinal', icd10: 'K57.9' },
  
  // Endocrine
  { id: 'diabetes-type1', name: 'Type 1 Diabetes Mellitus', category: 'Endocrine', icd10: 'E10.9' },
  { id: 'diabetes-type2', name: 'Type 2 Diabetes Mellitus', category: 'Endocrine', icd10: 'E11.9' },
  { id: 'diabetic-ketoacidosis', name: 'Diabetic Ketoacidosis', category: 'Endocrine', icd10: 'E10.1' },
  { id: 'hyperthyroidism', name: 'Hyperthyroidism', category: 'Endocrine', icd10: 'E05.9' },
  { id: 'hypothyroidism', name: 'Hypothyroidism', category: 'Endocrine', icd10: 'E03.9' },
  { id: 'adrenal-insufficiency', name: 'Adrenal Insufficiency', category: 'Endocrine', icd10: 'E27.4' },
  
  // Psychiatric/Behavioral
  { id: 'depression', name: 'Major Depressive Disorder', category: 'Psychiatric', icd10: 'F32.9' },
  { id: 'anxiety', name: 'Generalized Anxiety Disorder', category: 'Psychiatric', icd10: 'F41.1' },
  { id: 'panic-disorder', name: 'Panic Disorder', category: 'Psychiatric', icd10: 'F41.0' },
  { id: 'bipolar', name: 'Bipolar Disorder', category: 'Psychiatric', icd10: 'F31.9' },
  { id: 'substance-abuse', name: 'Substance Use Disorder', category: 'Psychiatric', icd10: 'F19.10' },
  
  // Musculoskeletal
  { id: 'fracture', name: 'Bone Fracture', category: 'Musculoskeletal', icd10: 'S72.9' },
  { id: 'lateral-malleolus-fracture', name: 'Lateral Malleolus Fracture (Weber B)', category: 'Musculoskeletal', icd10: 'S82.6' },
  { id: 'ankle-sprain', name: 'Ankle Sprain', category: 'Musculoskeletal', icd10: 'S93.4' },
  { id: 'achilles-rupture', name: 'Achilles Tendon Rupture', category: 'Musculoskeletal', icd10: 'S86.0' },
  { id: 'calcaneus-fracture', name: 'Calcaneus Fracture', category: 'Musculoskeletal', icd10: 'S92.0' },
  { id: 'soft-tissue-contusion', name: 'Soft Tissue Contusion', category: 'Musculoskeletal', icd10: 'S90.0' },
  { id: 'arthritis', name: 'Osteoarthritis', category: 'Musculoskeletal', icd10: 'M19.9' },
  { id: 'rheumatoid-arthritis', name: 'Rheumatoid Arthritis', category: 'Musculoskeletal', icd10: 'M06.9' },
  { id: 'back-pain', name: 'Lower Back Pain', category: 'Musculoskeletal', icd10: 'M54.5' },
  { id: 'fibromyalgia', name: 'Fibromyalgia', category: 'Musculoskeletal', icd10: 'M79.3' },
  
  // Other Common Conditions
  { id: 'dehydration', name: 'Dehydration', category: 'Other', icd10: 'E86' },
  { id: 'vasovagal-syncope', name: 'Vasovagal Syncope', category: 'Other', icd10: 'R55' },
  { id: 'vertigo', name: 'Benign Positional Vertigo', category: 'Other', icd10: 'H81.1' },
  { id: 'anemia', name: 'Iron Deficiency Anemia', category: 'Other', icd10: 'D50.9' },
  { id: 'kidney-stones', name: 'Kidney Stones', category: 'Other', icd10: 'N20.0' },
  { id: 'allergic-reaction', name: 'Allergic Reaction', category: 'Other', icd10: 'T78.4' },
];

// Comprehensive Treatment Database
export const medicalTreatments: MedicalTreatment[] = [
  // Antibiotics
  { id: 'amoxicillin', name: 'Amoxicillin', category: 'Medication', dosage: '500mg TID' },
  { id: 'augmentin', name: 'Amoxicillin-Clavulanate (Augmentin)', category: 'Medication', dosage: '875mg BID' },
  { id: 'azithromycin', name: 'Azithromycin (Z-pack)', category: 'Medication', dosage: '500mg day 1, then 250mg daily' },
  { id: 'ceftriaxone', name: 'Ceftriaxone', category: 'Medication', dosage: '1-2g IV daily' },
  { id: 'ciprofloxacin', name: 'Ciprofloxacin', category: 'Medication', dosage: '500mg BID' },
  { id: 'doxycycline', name: 'Doxycycline', category: 'Medication', dosage: '100mg BID' },
  { id: 'vancomycin', name: 'Vancomycin', category: 'Medication', dosage: '15mg/kg IV q12h' },
  { id: 'clindamycin', name: 'Clindamycin', category: 'Medication', dosage: '300mg QID' },
  { id: 'metronidazole', name: 'Metronidazole (Flagyl)', category: 'Medication', dosage: '500mg TID' },
  { id: 'cephalexin', name: 'Cephalexin', category: 'Medication', dosage: '500mg QID' },
  
  // Cardiovascular Medications
  { id: 'aspirin', name: 'Aspirin', category: 'Medication', dosage: '81mg daily' },
  { id: 'aspirin-325', name: 'Aspirin High Dose', category: 'Medication', dosage: '325mg daily' },
  { id: 'atorvastatin', name: 'Atorvastatin', category: 'Medication', dosage: '20-80mg daily' },
  { id: 'metoprolol', name: 'Metoprolol', category: 'Medication', dosage: '50mg BID' },
  { id: 'lisinopril', name: 'Lisinopril', category: 'Medication', dosage: '10mg daily' },
  { id: 'amlodipine', name: 'Amlodipine', category: 'Medication', dosage: '5mg daily' },
  { id: 'furosemide', name: 'Furosemide (Lasix)', category: 'Medication', dosage: '40mg daily' },
  { id: 'digoxin', name: 'Digoxin', category: 'Medication', dosage: '0.25mg daily' },
  { id: 'warfarin', name: 'Warfarin', category: 'Medication', dosage: 'Based on INR' },
  { id: 'heparin', name: 'Heparin', category: 'Medication', dosage: 'Weight-based protocol' },
  { id: 'clopidogrel', name: 'Clopidogrel (Plavix)', category: 'Medication', dosage: '75mg daily' },
  { id: 'alteplase', name: 'Alteplase (tPA)', category: 'Medication', dosage: '0.9mg/kg IV' },
  
  // Respiratory Medications
  { id: 'albuterol', name: 'Albuterol Inhaler', category: 'Medication', dosage: '2 puffs q4-6h PRN' },
  { id: 'albuterol-neb', name: 'Albuterol Nebulizer', category: 'Medication', dosage: '2.5mg q4h PRN' },
  { id: 'ipratropium', name: 'Ipratropium Bromide', category: 'Medication', dosage: '0.5mg neb q6h' },
  { id: 'prednisone', name: 'Prednisone', category: 'Medication', dosage: '40-60mg daily' },
  { id: 'methylprednisolone', name: 'Methylprednisolone', category: 'Medication', dosage: '125mg IV q6h' },
  { id: 'montelukast', name: 'Montelukast (Singulair)', category: 'Medication', dosage: '10mg daily' },
  { id: 'fluticasone', name: 'Fluticasone Inhaler', category: 'Medication', dosage: '2 puffs BID' },
  
  // Neurological Medications
  { id: 'sumatriptan', name: 'Sumatriptan', category: 'Medication', dosage: '6mg SC or 25mg PO' },
  { id: 'phenytoin', name: 'Phenytoin', category: 'Medication', dosage: '300mg daily' },
  { id: 'levetiracetam', name: 'Levetiracetam (Keppra)', category: 'Medication', dosage: '500mg BID' },
  { id: 'carbamazepine', name: 'Carbamazepine', category: 'Medication', dosage: '200mg BID' },
  { id: 'topiramate', name: 'Topiramate', category: 'Medication', dosage: '25mg BID' },
  { id: 'gabapentin', name: 'Gabapentin', category: 'Medication', dosage: '300mg TID' },
  
  // Pain Medications
  { id: 'ibuprofen', name: 'Ibuprofen', category: 'Medication', dosage: '600mg TID' },
  { id: 'acetaminophen', name: 'Acetaminophen', category: 'Medication', dosage: '650mg QID' },
  { id: 'morphine', name: 'Morphine', category: 'Medication', dosage: '2-4mg IV q4h PRN' },
  { id: 'tramadol', name: 'Tramadol', category: 'Medication', dosage: '50mg q6h PRN' },
  { id: 'hydrocodone', name: 'Hydrocodone/Acetaminophen', category: 'Medication', dosage: '5/325mg q6h PRN' },
  
  // GI Medications
  { id: 'omeprazole', name: 'Omeprazole (PPI)', category: 'Medication', dosage: '20mg daily' },
  { id: 'pantoprazole', name: 'Pantoprazole', category: 'Medication', dosage: '40mg daily' },
  { id: 'metoclopramide', name: 'Metoclopramide', category: 'Medication', dosage: '10mg QID' },
  { id: 'ondansetron', name: 'Ondansetron (Zofran)', category: 'Medication', dosage: '4mg q8h PRN' },
  { id: 'simethicone', name: 'Simethicone', category: 'Medication', dosage: '80mg QID' },
  
  // Procedures
  { id: 'iv-fluids', name: 'IV Fluid Resuscitation', category: 'Procedure', description: 'Normal saline or lactated ringers' },
  { id: 'oxygen-therapy', name: 'Oxygen Therapy', category: 'Procedure', description: '2-4L nasal cannula' },
  { id: 'wound-care', name: 'Wound Irrigation and Cleaning', category: 'Procedure' },
  { id: 'suturing', name: 'Suture Repair', category: 'Procedure' },
  { id: 'intubation', name: 'Endotracheal Intubation', category: 'Procedure' },
  { id: 'central-line', name: 'Central Venous Catheter', category: 'Procedure' },
  { id: 'chest-tube', name: 'Chest Tube Placement', category: 'Procedure' },
  { id: 'cardioversion', name: 'Electrical Cardioversion', category: 'Procedure' },
  { id: 'pci', name: 'Percutaneous Coronary Intervention', category: 'Procedure' },
  { id: 'appendectomy', name: 'Appendectomy', category: 'Procedure' },
  { id: 'cholecystectomy', name: 'Cholecystectomy', category: 'Procedure' },
  { id: 'dialysis', name: 'Hemodialysis', category: 'Procedure' },
  
  // Vaccinations/Immunizations
  { id: 'tetanus-booster', name: 'Tetanus Booster', category: 'Medication', description: 'Tdap vaccine' },
  { id: 'flu-vaccine', name: 'Influenza Vaccine', category: 'Medication' },
  { id: 'pneumococcal', name: 'Pneumococcal Vaccine', category: 'Medication' },
  { id: 'hepatitis-b', name: 'Hepatitis B Vaccine', category: 'Medication' },
  
  // Lifestyle Interventions
  { id: 'diet-exercise', name: 'Diet and Exercise Counseling', category: 'Lifestyle' },
  { id: 'smoking-cessation', name: 'Smoking Cessation Counseling', category: 'Lifestyle' },
  { id: 'alcohol-counseling', name: 'Alcohol Cessation Counseling', category: 'Lifestyle' },
  { id: 'weight-management', name: 'Weight Management Program', category: 'Lifestyle' },
  { id: 'cardiac-rehab', name: 'Cardiac Rehabilitation', category: 'Lifestyle' },
  { id: 'physical-therapy', name: 'Physical Therapy', category: 'Lifestyle' },
  { id: 'bed-rest', name: 'Bed Rest', category: 'Lifestyle' },
  { id: 'activity-restriction', name: 'Activity Restriction', category: 'Lifestyle' },
  { id: 'warm-compresses', name: 'Warm Compresses', category: 'Lifestyle' },
  { id: 'cold-therapy', name: 'Ice/Cold Therapy', category: 'Lifestyle' },
  { id: 'elevation', name: 'Limb Elevation', category: 'Lifestyle' },
  { id: 'brat-diet', name: 'BRAT Diet', category: 'Lifestyle', description: 'Bananas, Rice, Applesauce, Toast' },
  { id: 'oral-rehydration', name: 'Oral Rehydration Therapy', category: 'Lifestyle' },
  
  // Follow-up Care
  { id: 'primary-care-followup', name: 'Primary Care Follow-up', category: 'Follow-up', description: 'In 1-2 weeks' },
  { id: 'cardiology-referral', name: 'Cardiology Consultation', category: 'Follow-up' },
  { id: 'neurology-referral', name: 'Neurology Consultation', category: 'Follow-up' },
  { id: 'gastro-referral', name: 'Gastroenterology Referral', category: 'Follow-up' },
  { id: 'surgery-referral', name: 'Surgical Consultation', category: 'Follow-up' },
  { id: 'pulmonology-referral', name: 'Pulmonology Referral', category: 'Follow-up' },
  { id: 'psychiatry-referral', name: 'Psychiatry Referral', category: 'Follow-up' },
  { id: 'endocrine-referral', name: 'Endocrinology Referral', category: 'Follow-up' },
  { id: 'er-return', name: 'Return to ER if symptoms worsen', category: 'Follow-up' },
  { id: 'stroke-unit', name: 'Admit to Stroke Unit', category: 'Follow-up' },
  { id: 'icu-admission', name: 'ICU Admission', category: 'Follow-up' },
  { id: 'observation', name: 'Observation and Monitoring', category: 'Follow-up' },
  { id: 'speech-therapy', name: 'Speech Therapy Evaluation', category: 'Follow-up' },
  { id: 'occupational-therapy', name: 'Occupational Therapy', category: 'Follow-up' },
  
  // Contraindicated/Dangerous Options (for learning)
  { id: 'immediate-amputation', name: 'Immediate Amputation', category: 'Procedure', description: 'CONTRAINDICATED - dangerous' },
  { id: 'high-dose-morphine', name: 'High-dose Morphine in Respiratory Distress', category: 'Medication', description: 'CONTRAINDICATED' },
  { id: 'nsaids-gi-bleed', name: 'NSAIDs in GI Bleeding', category: 'Medication', description: 'CONTRAINDICATED' },
  { id: 'anticoagulation-hemorrhage', name: 'Anticoagulation in Active Bleeding', category: 'Medication', description: 'CONTRAINDICATED' },
  { id: 'intense-exercise', name: 'Continue Intense Exercise', category: 'Lifestyle', description: 'CONTRAINDICATED in cardiac conditions' },
  { id: 'antibiotics-viral', name: 'Antibiotics for Viral Illness', category: 'Medication', description: 'Unnecessary and inappropriate' },
  { id: 'steroids-infection', name: 'Corticosteroids in Active Infection', category: 'Medication', description: 'May worsen infection' },
];

// Helper functions for filtering and searching
export const getTestsByCategory = (category: string): MedicalTest[] => {
  return medicalTests.filter(test => test.category === category);
};

export const getDiagnosesByCategory = (category: string): MedicalDiagnosis[] => {
  return medicalDiagnoses.filter(diagnosis => diagnosis.category === category);
};

export const getTreatmentsByCategory = (category: string): MedicalTreatment[] => {
  return medicalTreatments.filter(treatment => treatment.category === category);
};

export const searchTests = (query: string): MedicalTest[] => {
  const lowercaseQuery = query.toLowerCase();
  return medicalTests.filter(test => 
    test.name.toLowerCase().includes(lowercaseQuery) ||
    test.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchDiagnoses = (query: string): MedicalDiagnosis[] => {
  const lowercaseQuery = query.toLowerCase();
  return medicalDiagnoses.filter(diagnosis => 
    diagnosis.name.toLowerCase().includes(lowercaseQuery) ||
    diagnosis.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchTreatments = (query: string): MedicalTreatment[] => {
  const lowercaseQuery = query.toLowerCase();
  return medicalTreatments.filter(treatment => 
    treatment.name.toLowerCase().includes(lowercaseQuery) ||
    treatment.category.toLowerCase().includes(lowercaseQuery) ||
    (treatment.dosage && treatment.dosage.toLowerCase().includes(lowercaseQuery))
  );
};

export const getTestCategories = (): string[] => {
  const categorySet = new Set(medicalTests.map(test => test.category));
  return Array.from(categorySet).sort();
};

export const getDiagnosisCategories = (): string[] => {
  const categorySet = new Set(medicalDiagnoses.map(diagnosis => diagnosis.category));
  return Array.from(categorySet).sort();
};

export const getTreatmentCategories = (): string[] => {
  const categorySet = new Set(medicalTreatments.map(treatment => treatment.category));
  return Array.from(categorySet).sort();
}; 