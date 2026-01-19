# MedQ Generator (beta)

MedQ Generator is a specialized application designed for medical educators and preclinical teachers. It leverages the reasoning capabilities of **Gemini 3 Pro** to create high-quality Multiple Choice Questions (MCQs) that adhere to modern pedagogical standards, including Bloom's Taxonomy and Angoff difficulty indexing.

## 🚀 Key Features

- **Specialized Preclinical Focus**: Tailored for Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, and more.
- **Clinical Vignette Generation**: Automatically crafts detailed patient cases (stems) with demographic data and physical findings.
- **Pedagogical Alignment**:
  - **Bloom’s Taxonomy**: Select cognitive levels from *Remembering* to *Creating*.
  - **Angoff Indexing**: Set target difficulty levels with AI-predicted validation.
- **Live Search Grounding**: Uses Google Search to verify questions against 2024-2025 clinical guidelines and EBM standards.
- **Multi-Format Export**:
  - **Microsoft Word (.doc)** for printing/editing.
  - **Aiken Format** for simple LMS imports.
  - **Moodle GIFT** for advanced LMS support with built-in feedback.
- **Alignment Validator**: A pre-generation check ensures your Learning Objectives (LO) match your selected Bloom's level.

## 🛠️ Tech Stack

- **Framework**: React 19 (Native ESM)
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Deployment**: Configured for Firebase Hosting & Vercel
- **Build Tool**: Vite

## 📥 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/medq-generator.git
   cd medq-generator
