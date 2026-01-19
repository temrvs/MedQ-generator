
import React, { useState } from 'react';
import { MCQConfig, GeneratedQuestion, BloomLevel, MainTopic, OrganSystem, ValidationResponse, QuestionStyle } from './types';
import ConfigForm from './components/ConfigForm';
import QuestionCard from './components/QuestionCard';
import ValidationModal from './components/ValidationModal';
import InstructionModal from './components/InstructionModal';
import { generateMCQs, validateMCQConfig } from './services/geminiService';
import { generateAiken, generateGIFT, generateWord, downloadFile } from './utils/exportUtils';

const App: React.FC = () => {
  const [config, setConfig] = useState<MCQConfig>({
    topics: [MainTopic.ANATOMY],
    subTopics: [],
    organSystem: OrganSystem.CVS,
    numberOfOptions: 4,
    bloomLevel: BloomLevel.APPLYING,
    angoffIndex: 0.6, // New decimal standard
    hasClinicalStem: true,
    questionStyle: QuestionStyle.DETAILED,
    objective: '',
    numberOfQuestions: 3,
    useLiveSearch: true 
  });

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const [exportFormat, setExportFormat] = useState<'docx' | 'aiken' | 'gift'>('docx');

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);
    
    try {
      const validation = await validateMCQConfig(config);
      
      if (!validation.isValid) {
        setValidationResult(validation);
        setIsLoading(false);
        return;
      }

      setQuestions([]); 
      const results = await generateMCQs(config);
      setQuestions(results);
    } catch (err: any) {
      setError(err.message || "Failed to generate. Check your console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (questions.length === 0) return;
    const timestamp = new Date().toISOString().slice(0, 10);
    
    if (exportFormat === 'docx') {
      const content = generateWord(questions);
      downloadFile(content, `MedQ_Export_${timestamp}.doc`, 'application/msword');
    } else if (exportFormat === 'aiken') {
      const content = generateAiken(questions);
      downloadFile(content, `MedQ_Export_${timestamp}_Aiken.txt`, 'text/plain');
    } else if (exportFormat === 'gift') {
      const content = generateGIFT(questions);
      downloadFile(content, `MedQ_Export_${timestamp}_GIFT.txt`, 'text/plain');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
               MedQ Generator
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowInstructions(true)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">How to Use</span>
            </button>
            <div className="text-xs text-slate-400 border-l border-slate-200 pl-4 hidden md:block">
              Powered by Gemini 3 Pro
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24">
            <ConfigForm config={config} setConfig={setConfig} isLoading={isLoading} onSubmit={handleGenerate} />
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold">Generation Error</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {questions.length > 0 ? (
            <div className="animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-800">Generated Questions</h2>
                  <span className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                    {questions.length} Result{questions.length !== 1 && 's'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="text-sm border-none bg-transparent py-2 pl-3 pr-8 focus:ring-0 cursor-pointer font-medium text-slate-700"
                  >
                    <option value="docx">Word Document (.doc)</option>
                    <option value="aiken">Aiken Format (.txt)</option>
                    <option value="gift">Moodle GIFT (.txt)</option>
                  </select>
                  <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <QuestionCard key={idx} question={q} index={idx} />
                ))}
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No questions generated yet</p>
                <p className="text-sm mt-2 max-w-xs text-center">Configure parameters and click "Generate" to start.</p>
              </div>
            )
          )}

          {isLoading && questions.length === 0 && (
             <div className="flex flex-col items-center justify-center h-[60vh]">
               <div className="relative">
                 <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
               </div>
               <p className="mt-4 text-slate-600 font-medium animate-pulse">
                 {config.useLiveSearch ? 'Searching current guidelines...' : 'Gemini 3 Pro is thinking...'}
               </p>
             </div>
          )}
        </div>
      </main>

      {validationResult && (
        <ValidationModal validation={validationResult} onClose={() => setValidationResult(null)} />
      )}

      {showInstructions && (
        <InstructionModal onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
};

export default App;
