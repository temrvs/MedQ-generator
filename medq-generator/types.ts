
export enum BloomLevel {
  REMEMBERING = "Remembering",
  UNDERSTANDING = "Understanding",
  APPLYING = "Applying",
  ANALYZING = "Analyzing",
  EVALUATING = "Evaluating",
  CREATING = "Creating"
}

export enum MainTopic {
  ANATOMY = "Anatomy",
  PHYSIOLOGY = "Physiology",
  BIOCHEMISTRY = "Biochemistry",
  PATHOLOGY = "Pathology",
  PHARMACOLOGY = "Pharmacology",
  MICROBIOLOGY = "Microbiology",
  GENETICS = "Genetics",
  IMMUNOLOGY = "Immunology",
  EMBRYOLOGY = "Embryology"
}

export enum SubTopic {
  CLINICAL_CORRELATION = "Clinical Correlation",
  LAB_INTERPRETATION = "Laboratory Interpretation",
  LAB_SKILL = "Laboratory Skill",
  PROCEDURAL_SKILL = "Procedural Skill",
  HEALTH_PROMOTION = "Health Promotion",
  RATIONAL_DRUG_USE = "Rational Drug Use",
  PATIENT_SAFETY = "Patient Safety"
}

export enum OrganSystem {
  NONE = "None (General)",
  CVS = "Cardiovascular (CVS)",
  RS = "Respiratory (RS)",
  GIT = "Gastrointestinal (GIT)",
  KUB = "Renal/Urinary (KUB)",
  MSK = "Musculoskeletal (MSK)",
  NS = "Nervous System (NS)",
  ENDO = "Endocrine",
  REP = "Reproductive",
  HEM = "Hematology/Oncology",
  INTEG = "Integumentary"
}

export enum QuestionStyle {
  CONCISE = "Concise",
  DETAILED = "Detailed"
}

export interface MCQConfig {
  topics: MainTopic[];
  subTopics: SubTopic[];
  organSystem: OrganSystem;
  numberOfOptions: 4 | 5;
  bloomLevel: BloomLevel;
  angoffIndex: number; // 0.2 - 0.8 scale
  hasClinicalStem: boolean;
  questionStyle: QuestionStyle;
  objective: string;
  numberOfQuestions: number; // 1-5
  useLiveSearch: boolean; // For up-to-date knowledge
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  predictedAngoff: number; // probability 0.0 - 1.0
  bloomLevel: string;
  topicTag: string;
  sources?: GroundingSource[];
}

export interface GenerationResponse {
  questions: GeneratedQuestion[];
}

export interface ValidationResponse {
  isValid: boolean;
  title: string;
  message: string;
  advice: string;
}
