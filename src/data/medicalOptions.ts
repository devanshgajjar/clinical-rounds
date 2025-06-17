import { TestCategory } from '../types/game';

export interface MedicalTest {
  id: string;
  name: string;
  category: TestCategory;
  cost: number;
  description?: string;
  necessary?: boolean;
  synonyms?: string[];
  commonTerms?: string[];
}

export interface MedicalDiagnosis {
  id: string;
  name: string;
  category: string;
  icd10?: string;
  description?: string;
  correct?: boolean;
  synonyms?: string[];
  commonTerms?: string[];
}

export interface MedicalTreatment {
  id: string;
  name: string;
  category: string;
  description?: string;
  dosage?: string;
  synonyms?: string[];
  commonTerms?: string[];
}

// Comprehensive Test Database
export const medicalTests: MedicalTest[] = [
  // Blood Work
  { id: 'cbc', name: 'Complete Blood Count (CBC)', category: TestCategory.BLOOD_WORK, cost: 25, necessary: true, synonyms: ['CBC', 'Blood count', 'Hemogram'], commonTerms: ['blood test', 'blood work', 'check blood levels'] },
  { id: 'bmp', name: 'Basic Metabolic Panel', category: TestCategory.BLOOD_WORK, cost: 30 },
  { id: 'cmp', name: 'Comprehensive Metabolic Panel', category: TestCategory.BLOOD_WORK, cost: 45, necessary: false, synonyms: ['CMP', 'Chemistry panel', 'Metabolic panel'], commonTerms: ['blood chemistry', 'electrolytes', 'liver function'] },
  { id: 'liver-func', name: 'Liver Function Tests', category: TestCategory.BLOOD_WORK, cost: 35 },
  { id: 'lipid-panel', name: 'Lipid Panel', category: TestCategory.BLOOD_WORK, cost: 25 },
  { id: 'thyroid-func', name: 'Thyroid Function Tests (TSH, T3, T4)', category: TestCategory.BLOOD_WORK, cost: 40 },
  { id: 'hba1c', name: 'Hemoglobin A1c', category: TestCategory.BLOOD_WORK, cost: 30 },
  { id: 'glucose', name: 'Blood Glucose', category: TestCategory.BLOOD_WORK, cost: 15 },
  { id: 'pt-inr', name: 'Prothrombin Time (PT/INR)', category: TestCategory.BLOOD_WORK, cost: 20 },
  { id: 'ptt', name: 'Partial Thromboplastin Time (PTT)', category: TestCategory.BLOOD_WORK, cost: 20 },
  { id: 'esr', name: 'Erythrocyte Sedimentation Rate (ESR)', category: TestCategory.BLOOD_WORK, cost: 15 },
  { id: 'crp', name: 'C-Reactive Protein (CRP)', category: TestCategory.BLOOD_WORK, cost: 25 },
  { id: 'procalcitonin', name: 'Procalcitonin', category: TestCategory.BLOOD_WORK, cost: 45 },
  { id: 'lactate', name: 'Serum Lactate', category: TestCategory.BLOOD_WORK, cost: 20 },
  { id: 'arterial-blood-gas', name: 'Arterial Blood Gas (ABG)', category: TestCategory.BLOOD_WORK, cost: 80 },
  { id: 'venous-blood-gas', name: 'Venous Blood Gas (VBG)', category: TestCategory.BLOOD_WORK, cost: 60 },
  { id: 'iron-studies', name: 'Iron Studies (Ferritin, TIBC, Iron)', category: TestCategory.BLOOD_WORK, cost: 40 },
  { id: 'vitamin-d', name: 'Vitamin D Level', category: TestCategory.BLOOD_WORK, cost: 45 },
  { id: 'vitamin-b12', name: 'Vitamin B12 Level', category: TestCategory.BLOOD_WORK, cost: 35 },
  { id: 'folate', name: 'Folate Level', category: TestCategory.BLOOD_WORK, cost: 35 },
  { id: 'magnesium', name: 'Magnesium Level', category: TestCategory.BLOOD_WORK, cost: 25 },
  { id: 'calcium', name: 'Calcium Level', category: TestCategory.BLOOD_WORK, cost: 25 },
  { id: 'phosphorus', name: 'Phosphorus Level', category: TestCategory.BLOOD_WORK, cost: 25 },
  { id: 'uric-acid', name: 'Uric Acid Level', category: TestCategory.BLOOD_WORK, cost: 25 },
  { id: 'coagulation-panel', name: 'Coagulation Panel (PT, PTT, INR)', category: TestCategory.BLOOD_WORK, cost: 45 },
  { id: 'd-dimer', name: 'D-dimer', category: TestCategory.BLOOD_WORK, cost: 35 },
  { id: 'fibrinogen', name: 'Fibrinogen Level', category: TestCategory.BLOOD_WORK, cost: 40 },
  { id: 'protein-c', name: 'Protein C Activity', category: TestCategory.BLOOD_WORK, cost: 60 },
  { id: 'protein-s', name: 'Protein S Activity', category: TestCategory.BLOOD_WORK, cost: 60 },
  { id: 'antithrombin', name: 'Antithrombin III', category: TestCategory.BLOOD_WORK, cost: 55 },
  { id: 'factor-v-leiden', name: 'Factor V Leiden', category: TestCategory.BLOOD_WORK, cost: 70 },
  { id: 'prothrombin-g20210a', name: 'Prothrombin G20210A', category: TestCategory.BLOOD_WORK, cost: 70 },
  { id: 'homocysteine', name: 'Homocysteine Level', category: TestCategory.BLOOD_WORK, cost: 45 },
  { id: 'cardiac-enzymes', name: 'Cardiac Enzymes (Troponin, CK-MB)', category: TestCategory.BLOOD_WORK, cost: 50 },
  { id: 'bnp', name: 'Brain Natriuretic Peptide (BNP)', category: TestCategory.BLOOD_WORK, cost: 45 },
  { id: 'nt-probnp', name: 'NT-proBNP', category: TestCategory.BLOOD_WORK, cost: 45 },
  { id: 'cardiac-markers', name: 'Cardiac Markers Panel', category: TestCategory.BLOOD_WORK, cost: 60 },
  { id: 'lipid-fractionation', name: 'Lipid Fractionation', category: TestCategory.BLOOD_WORK, cost: 55 },
  { id: 'apolipoprotein', name: 'Apolipoprotein A1 and B', category: TestCategory.BLOOD_WORK, cost: 65 },
  { id: 'lipoprotein-a', name: 'Lipoprotein (a)', category: TestCategory.BLOOD_WORK, cost: 50 },
  
  // Cardiac Tests
  { id: 'ecg', name: 'Electrocardiogram (ECG/EKG)', category: TestCategory.CARDIAC, cost: 50 },
  { id: 'echo', name: 'Echocardiogram', category: TestCategory.CARDIAC, cost: 350 },
  { id: 'stress-test', name: 'Exercise Stress Test', category: TestCategory.CARDIAC, cost: 400 },
  { id: 'holter', name: 'Holter Monitor (24-48hr)', category: TestCategory.CARDIAC, cost: 200 },
  { id: 'event-monitor', name: 'Event Monitor', category: TestCategory.CARDIAC, cost: 300 },
  { id: 'cardiac-mri', name: 'Cardiac MRI', category: TestCategory.CARDIAC, cost: 1200 },
  { id: 'cardiac-ct', name: 'Cardiac CT', category: TestCategory.CARDIAC, cost: 800 },
  { id: 'coronary-angiogram', name: 'Coronary Angiogram', category: TestCategory.CARDIAC, cost: 1500 },
  { id: 'tilt-table', name: 'Tilt Table Test', category: TestCategory.CARDIAC, cost: 600 },
  { id: 'electrophysiology', name: 'Electrophysiology Study', category: TestCategory.CARDIAC, cost: 2000 },
  
  // Imaging - X-rays
  { id: 'chest-xray', name: 'Chest X-ray', category: TestCategory.IMAGING, cost: 80 },
  { id: 'abdominal-xray', name: 'Abdominal X-ray', category: TestCategory.IMAGING, cost: 80 },
  { id: 'hand-xray', name: 'X-ray Hand', category: TestCategory.IMAGING, cost: 120 },
  { id: 'ankle-xray', name: 'Ankle X-ray (3 views)', category: TestCategory.IMAGING, cost: 120 },
  { id: 'foot-xray', name: 'Foot X-ray', category: TestCategory.IMAGING, cost: 100 },
  { id: 'knee-xray', name: 'X-ray Knee', category: TestCategory.IMAGING, cost: 100 },
  { id: 'spine-xray', name: 'X-ray Spine', category: TestCategory.IMAGING, cost: 110 },
  { id: 'pelvis-xray', name: 'X-ray Pelvis', category: TestCategory.IMAGING, cost: 95 },
  { id: 'shoulder-xray', name: 'X-ray Shoulder', category: TestCategory.IMAGING, cost: 105 },
  
  // Imaging - CT Scans
  { id: 'ct-head', name: 'CT Head', category: TestCategory.IMAGING, cost: 400 },
  { id: 'ct-head-contrast', name: 'CT Head with Contrast', category: TestCategory.IMAGING, cost: 500 },
  { id: 'ct-chest', name: 'CT Chest', category: TestCategory.IMAGING, cost: 450 },
  { id: 'ct-abdomen', name: 'CT Abdomen/Pelvis', category: TestCategory.IMAGING, cost: 500 },
  { id: 'ct-angiogram', name: 'CT Angiogram Head/Neck', category: TestCategory.IMAGING, cost: 800 },
  { id: 'ct-pe', name: 'CT Pulmonary Embolism Protocol', category: TestCategory.IMAGING, cost: 600 },
  { id: 'ct-coronary', name: 'CT Coronary Angiogram', category: TestCategory.IMAGING, cost: 750 },
  { id: 'ct-ankle', name: 'CT Ankle', category: TestCategory.IMAGING, cost: 400 },
  
  // Imaging - MRI
  { id: 'mri-brain', name: 'MRI Brain', category: TestCategory.IMAGING, cost: 800 },
  { id: 'mri-spine', name: 'MRI Spine', category: TestCategory.IMAGING, cost: 900 },
  { id: 'mri-knee', name: 'MRI Knee', category: TestCategory.IMAGING, cost: 700 },
  { id: 'mri-shoulder', name: 'MRI Shoulder', category: TestCategory.IMAGING, cost: 750 },
  { id: 'mri-cardiac', name: 'Cardiac MRI', category: TestCategory.IMAGING, cost: 1200 },
  { id: 'mri-ankle', name: 'Ankle MRI', category: TestCategory.IMAGING, cost: 800 },
  
  // Imaging - Ultrasound
  { id: 'echo-us', name: 'Echocardiogram (Ultrasound)', category: TestCategory.IMAGING, cost: 200 },
  { id: 'abdominal-us', name: 'Abdominal Ultrasound', category: TestCategory.IMAGING, cost: 200 },
  { id: 'pelvic-us', name: 'Pelvic Ultrasound', category: TestCategory.IMAGING, cost: 180 },
  { id: 'thyroid-us', name: 'Thyroid Ultrasound', category: TestCategory.IMAGING, cost: 160 },
  { id: 'carotid-us', name: 'Carotid Ultrasound', category: TestCategory.IMAGING, cost: 220 },
  { id: 'renal-us', name: 'Renal Ultrasound', category: TestCategory.IMAGING, cost: 190 },
  { id: 'ankle-us', name: 'Ankle Ultrasound', category: TestCategory.IMAGING, cost: 200 },
  
  // Microbiology
  { id: 'blood-culture', name: 'Blood Culture', category: TestCategory.MICROBIOLOGY, cost: 45 },
  { id: 'urine-culture', name: 'Urine Culture', category: TestCategory.MICROBIOLOGY, cost: 35 },
  { id: 'sputum-culture', name: 'Sputum Culture', category: TestCategory.MICROBIOLOGY, cost: 40 },
  { id: 'wound-culture', name: 'Wound Culture', category: TestCategory.MICROBIOLOGY, cost: 45 },
  { id: 'stool-culture', name: 'Stool Culture', category: TestCategory.MICROBIOLOGY, cost: 40 },
  { id: 'throat-culture', name: 'Throat Culture', category: TestCategory.MICROBIOLOGY, cost: 35 },
  { id: 'csf-culture', name: 'CSF Culture', category: TestCategory.MICROBIOLOGY, cost: 80 },
  { id: 'fungal-culture', name: 'Fungal Culture', category: TestCategory.MICROBIOLOGY, cost: 70 },
  { id: 'acid-fast', name: 'Acid-Fast Bacilli (AFB)', category: TestCategory.MICROBIOLOGY, cost: 45 },
  { id: 'c-diff', name: 'C. difficile Toxin', category: TestCategory.MICROBIOLOGY, cost: 55 },
  
  // Serology Tests
  { id: 'hiv', name: 'HIV Antibody Test', category: TestCategory.SERIOLOGY, cost: 40 },
  { id: 'hepatitis-b', name: 'Hepatitis B Panel', category: TestCategory.SERIOLOGY, cost: 45 },
  { id: 'hepatitis-c', name: 'Hepatitis C Antibody', category: TestCategory.SERIOLOGY, cost: 45 },
  { id: 'syphilis', name: 'Syphilis Test (RPR/VDRL)', category: TestCategory.SERIOLOGY, cost: 30 },
  { id: 'rheumatoid-factor', name: 'Rheumatoid Factor', category: TestCategory.SERIOLOGY, cost: 35 },
  { id: 'ana', name: 'Antinuclear Antibody (ANA)', category: TestCategory.SERIOLOGY, cost: 45 },
  { id: 'anti-dsdna', name: 'Anti-dsDNA', category: TestCategory.SERIOLOGY, cost: 50 },
  { id: 'complement', name: 'Complement C3/C4', category: TestCategory.SERIOLOGY, cost: 50 },
  { id: 'anti-ccp', name: 'Anti-CCP Antibodies', category: TestCategory.SERIOLOGY, cost: 60 },
  { id: 'tetanus-ab', name: 'Tetanus Antibody', category: TestCategory.SERIOLOGY, cost: 30 },
  { id: 'rabies-ab', name: 'Rabies Antibody', category: TestCategory.SERIOLOGY, cost: 60 },
  { id: 'influenza-ag', name: 'Influenza Antigen', category: TestCategory.SERIOLOGY, cost: 40 },
  { id: 'strep-ag', name: 'Strep A Antigen', category: TestCategory.SERIOLOGY, cost: 25 },
  
  // Neurological Tests
  { id: 'lumbar-puncture', name: 'Lumbar Puncture (Spinal Tap)', category: TestCategory.NEUROLOGICAL, cost: 200 },
  { id: 'eeg', name: 'Electroencephalogram (EEG)', category: TestCategory.NEUROLOGICAL, cost: 150 },
  { id: 'emg', name: 'Electromyography (EMG)', category: TestCategory.NEUROLOGICAL, cost: 180 },
  { id: 'nerve-conduction', name: 'Nerve Conduction Study', category: TestCategory.NEUROLOGICAL, cost: 160 },
  { id: 'neuro-exam', name: 'Detailed Neurological Examination', category: TestCategory.NEUROLOGICAL, cost: 50 },
  { id: 'neurovascular-assessment', name: 'Neurovascular Assessment', category: TestCategory.NEUROLOGICAL, cost: 0 },
  
  // Urinalysis
  { id: 'urinalysis', name: 'Urinalysis', category: TestCategory.URINALYSIS, cost: 20 },
  { id: 'urine-micro', name: 'Urine Microscopy', category: TestCategory.URINALYSIS, cost: 25 },
  { id: 'urine-protein', name: '24-hour Urine Protein', category: TestCategory.URINALYSIS, cost: 60 },
  { id: 'urine-creatinine', name: 'Urine Creatinine Clearance', category: TestCategory.URINALYSIS, cost: 45 },
  
  // Hormones
  { id: 'cortisol', name: 'Cortisol Level', category: TestCategory.HORMONES, cost: 40 },
  { id: 'testosterone', name: 'Testosterone', category: TestCategory.HORMONES, cost: 45 },
  { id: 'estradiol', name: 'Estradiol', category: TestCategory.HORMONES, cost: 45 },
  { id: 'growth-hormone', name: 'Growth Hormone', category: TestCategory.HORMONES, cost: 60 },
  { id: 'insulin', name: 'Insulin Level', category: TestCategory.HORMONES, cost: 35 },
  { id: 'prolactin', name: 'Prolactin', category: TestCategory.HORMONES, cost: 40 },
  
  // Monitoring
  { id: 'vital-signs', name: 'Vital Signs Monitoring', category: TestCategory.VITALS, cost: 25 },
  { id: 'bp-monitoring', name: '24-hour Blood Pressure Monitoring', category: TestCategory.VITALS, cost: 100 },
  { id: 'pulse-ox', name: 'Pulse Oximetry', category: TestCategory.VITALS, cost: 15 },
  { id: 'telemetry', name: 'Cardiac Telemetry', category: TestCategory.VITALS, cost: 150 },
  
  // Other Specialized Tests
  { id: 'spirometry', name: 'Spirometry (Pulmonary Function)', category: TestCategory.LABS, cost: 80 },
  { id: 'peak-flow', name: 'Peak Flow Measurement', category: TestCategory.LABS, cost: 20 },
  { id: 'sleep-study', name: 'Sleep Study (Polysomnography)', category: TestCategory.LABS, cost: 800 },
  { id: 'endoscopy', name: 'Upper Endoscopy (EGD)', category: TestCategory.LABS, cost: 500 },
  { id: 'colonoscopy', name: 'Colonoscopy', category: TestCategory.LABS, cost: 600 },
  { id: 'bone-density', name: 'DEXA Bone Density Scan', category: TestCategory.LABS, cost: 150 },
  { id: 'bone-scan', name: 'Bone Scan', category: TestCategory.IMAGING, cost: 600 },
  { id: 'h-pylori', name: 'H. pylori Test', category: TestCategory.LABS, cost: 50 },
];

// Comprehensive Diagnosis Database
export const medicalDiagnoses: MedicalDiagnosis[] = [
  // Infectious Diseases
  { id: 'cellulitis-dog-bite', name: 'Cellulitis secondary to dog bite', category: 'Infectious Disease', icd10: 'L03.9', correct: true, synonyms: ['Post-bite cellulitis', 'Dog bite infection'], commonTerms: ['infected dog bite', 'bite wound infection', 'skin infection from bite'] },
  { id: 'cellulitis', name: 'Cellulitis', category: 'Infectious Disease', icd10: 'L03.9' },
  { id: 'pneumonia', name: 'Community-Acquired Pneumonia', category: 'Infectious Disease', icd10: 'J15.9' },
  { id: 'uti', name: 'Urinary Tract Infection', category: 'Infectious Disease', icd10: 'N39.0' },
  { id: 'sepsis', name: 'Sepsis', category: 'Infectious Disease', icd10: 'A41.9' },
  { id: 'gastroenteritis', name: 'Acute Gastroenteritis', category: 'Infectious Disease', icd10: 'K59.1' },
  { id: 'meningitis', name: 'Bacterial Meningitis', category: 'Infectious Disease', icd10: 'G00.9' },
  { id: 'endocarditis', name: 'Infective Endocarditis', category: 'Infectious Disease', icd10: 'I33.0' },
  { id: 'osteomyelitis', name: 'Osteomyelitis', category: 'Infectious Disease', icd10: 'M86.9' },
  { id: 'abscess', name: 'Abscess', category: 'Infectious Disease', icd10: 'L02.9', correct: false, synonyms: ['Purulent collection', 'Localized infection'], commonTerms: ['pus pocket', 'boil', 'infected pocket'] },
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
  { 
    id: 'amoxicillin', 
    name: 'Amoxicillin', 
    category: 'Medication', 
    dosage: '500mg TID',
    synonyms: ['Amoxil', 'Trimox'],
    commonTerms: ['amox', 'penicillin antibiotic']
  },
  { 
    id: 'augmentin', 
    name: 'Amoxicillin-Clavulanate (Augmentin)', 
    category: 'Medication', 
    dosage: '875mg BID',
    synonyms: ['Amoxiclav', 'Clavamox'],
    commonTerms: ['broad spectrum antibiotic', 'amox-clav', 'dog bite antibiotic']
  },
  { 
    id: 'azithromycin', 
    name: 'Azithromycin (Z-pack)', 
    category: 'Medication', 
    dosage: '500mg day 1, then 250mg daily',
    synonyms: ['Zithromax', 'Z-pak'],
    commonTerms: ['Z pack', 'five day antibiotic']
  },
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
  { 
    id: 'wound-care', 
    name: 'Wound Irrigation and Cleaning', 
    category: 'Procedure',
    synonyms: ['Wound debridement', 'Wound lavage'],
    commonTerms: ['clean the wound', 'wash out the wound', 'wound cleaning']
  },
  { 
    id: 'iv-fluids', 
    name: 'IV Fluid Resuscitation', 
    category: 'Procedure', 
    description: 'Normal saline or lactated ringers',
    synonyms: ['Intravenous fluids', 'Volume resuscitation'],
    commonTerms: ['fluids', 'IV', 'drip']
  },
  { id: 'oxygen-therapy', name: 'Oxygen Therapy', category: 'Procedure', description: '2-4L nasal cannula' },
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
  { id: 'warm-compress', name: 'Warm Compresses', category: 'Lifestyle', synonyms: ['Heat therapy', 'Local heat application'], commonTerms: ['warm cloth', 'heating pad', 'hot pack'] },
  { id: 'cold-therapy', name: 'Ice/Cold Therapy', category: 'Lifestyle' },
  { id: 'elevation', name: 'Limb Elevation', category: 'Lifestyle' },
  { id: 'brat-diet', name: 'BRAT Diet', category: 'Lifestyle', description: 'Bananas, Rice, Applesauce, Toast' },
  { id: 'oral-rehydration', name: 'Oral Rehydration Therapy', category: 'Lifestyle' },
  
  // Follow-up Care
  { 
    id: 'primary-care-followup', 
    name: 'Primary Care Follow-up', 
    category: 'Follow-up',
    description: 'In 1-2 weeks'
  },
  { 
    id: 'followup-48h', 
    name: 'Follow-up in 48-72 hours', 
    category: 'Follow-up',
    synonyms: ['Early follow-up', 'Short-term follow-up'],
    commonTerms: ['come back in 2-3 days', 'check back', 'return visit']
  },
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
  // Endocrine Medications
  { id: 'insulin-therapy', name: 'Insulin therapy (long and short-acting)', category: 'Medication', dosage: 'Based on blood glucose levels' },
  { id: 'diabetes-education', name: 'Diabetes education and counseling', category: 'Follow-up', description: 'Comprehensive diabetes management education' },
  { id: 'glucose-monitoring', name: 'Blood glucose monitoring supplies', category: 'Procedure', description: 'Glucometer and testing strips' },
  { id: 'nutritionist-consult', name: 'Nutritionist consultation', category: 'Follow-up', description: 'Diabetes-specific nutrition planning' },
  { id: 'metformin', name: 'Metformin therapy', category: 'Medication', dosage: '500-2000mg daily', description: 'CONTRAINDICATED in Type 1 Diabetes' },
  { id: 'low-carb-diet', name: 'Low-carb diet only', category: 'Lifestyle', description: 'CONTRAINDICATED as sole treatment for Type 1 Diabetes' },
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
  const lowercaseQuery = query.toLowerCase().trim();
  const searchTerms = lowercaseQuery.split(/\s+/);

  return medicalTests.filter(test => {
    return searchTerms.every(term => {
      const matchesName = test.name.toLowerCase().includes(term);
      const matchesSynonyms = test.synonyms?.some(syn => syn.toLowerCase().includes(term)) || false;
      const matchesCommonTerms = test.commonTerms?.some(common => common.toLowerCase().includes(term)) || false;
      const matchesCategory = test.category.toLowerCase().includes(term);
      const matchesDescription = test.description?.toLowerCase().includes(term) || false;

      return matchesName || matchesSynonyms || matchesCommonTerms || 
             matchesCategory || matchesDescription;
    });
  });
};

export const searchDiagnoses = (query: string): MedicalDiagnosis[] => {
  const lowercaseQuery = query.toLowerCase().trim();
  const searchTerms = lowercaseQuery.split(/\s+/);

  return medicalDiagnoses.filter(diagnosis => {
    return searchTerms.every(term => {
      const matchesName = diagnosis.name.toLowerCase().includes(term);
      const matchesSynonyms = diagnosis.synonyms?.some(syn => syn.toLowerCase().includes(term)) || false;
      const matchesCommonTerms = diagnosis.commonTerms?.some(common => common.toLowerCase().includes(term)) || false;
      const matchesCategory = diagnosis.category?.toLowerCase().includes(term) || false;
      const matchesICD = diagnosis.icd10?.toLowerCase().includes(term) || false;
      const matchesDescription = diagnosis.description?.toLowerCase().includes(term) || false;

      return matchesName || matchesSynonyms || matchesCommonTerms || 
             matchesCategory || matchesICD || matchesDescription;
    });
  });
};

export const searchTreatments = (query: string): MedicalTreatment[] => {
  const lowercaseQuery = query.toLowerCase().trim();
  const searchTerms = lowercaseQuery.split(/\s+/); // Split into individual words

  return medicalTreatments.filter(treatment => {
    // Check each search term against all possible matches
    return searchTerms.every(term => {
      const matchesName = treatment.name.toLowerCase().includes(term);
      const matchesSynonyms = treatment.synonyms?.some(syn => syn.toLowerCase().includes(term)) || false;
      const matchesCommonTerms = treatment.commonTerms?.some(common => common.toLowerCase().includes(term)) || false;
      const matchesCategory = treatment.category.toLowerCase().includes(term);
      const matchesDosage = treatment.dosage?.toLowerCase().includes(term) || false;
      const matchesDescription = treatment.description?.toLowerCase().includes(term) || false;

      return matchesName || matchesSynonyms || matchesCommonTerms || 
             matchesCategory || matchesDosage || matchesDescription;
    });
  });
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