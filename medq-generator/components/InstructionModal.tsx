
import React from 'react';

interface InstructionModalProps {
  onClose: () => void;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center sticky top-0">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to use MedQ Generator
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
            
            {/* Intro */}
            <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50 py-2 rounded-r-lg">
                MedQ Generator uses AI to create high-quality, pedagogically aligned multiple-choice questions for preclinical medical education. Follow these steps to generate questions.
            </p>

            <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm">1</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Set the Context</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            Select your <strong>Main Topics</strong> (e.g., Anatomy, Physiology) and <strong>Organ System</strong>.
                            You can also select <strong>Subtopics</strong> (e.g., Clinical Correlation, Patient Safety). 
                            <br/>
                            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">Tip</span>
                            <span className="text-xs text-slate-500 ml-1">If you leave Subtopics blank, the AI will automatically select the most relevant ones based on your objective.</span>
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm">2</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Define Pedagogy</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            <strong>Bloom's Taxonomy:</strong> Determines the cognitive depth (e.g., Remembering vs. Creating).
                            <br/>
                            <strong>Angoff Index:</strong> Sets the difficulty. A lower percentage (e.g., 40%) generates harder questions, while a higher percentage (e.g., 90%) generates easier ones.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm">3</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Enter Learning Objective (LO)</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            Paste your specific LO. The system includes an <strong>Alignment Check</strong>. If your LO verbs (e.g., "List") do not match your Bloom's Level (e.g., "Evaluating"), the app will warn you before generating.
                        </p>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm">4</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Generate & Review</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            Click <strong>Generate MCQs</strong>. The AI will produce:
                            <ul className="list-disc list-inside ml-2 mt-1 space-y-1 text-slate-500">
                                <li>A clinical stem (if selected)</li>
                                <li>Distractors based on common misconceptions</li>
                                <li>Detailed explanations</li>
                                <li>A "Predicted Angoff" score</li>
                            </ul>
                        </p>
                    </div>
                </div>

                 {/* Step 5 */}
                 <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm">5</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Export</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            Use the dropdown in the results area to export your questions to:
                            <ul className="list-disc list-inside ml-2 mt-1 space-y-1 text-slate-500">
                                <li><strong>Word (.doc)</strong>: For editing and printing.</li>
                                <li><strong>Aiken (.txt)</strong>: Simple format for LMS import.</li>
                                <li><strong>Moodle GIFT (.txt)</strong>: Advanced LMS format with feedback support.</li>
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end sticky bottom-0">
            <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                Close Guide
            </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionModal;
