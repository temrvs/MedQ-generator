
import React, { useState } from 'react';
import { GeneratedQuestion } from '../types';

interface QuestionCardProps {
  question: GeneratedQuestion;
  index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const cleanText = (text: string) => text.replace(/<br\s*\/?>/gi, '\n');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all hover:shadow-md">
      {/* Header Tags */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Q{index + 1}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {question.topicTag}
          </span>
          {question.sources && question.sources.length > 0 && (
             <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-tight">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
               Verified via Live Search
             </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {question.bloomLevel}
        </span>
      </div>

      {/* Question Body */}
      <div className="p-6">
        <p className="text-slate-800 text-lg leading-relaxed mb-6 font-medium whitespace-pre-wrap">
          {cleanText(question.questionText)}
        </p>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correctAnswerIndex;
            
            let optionClass = "border-slate-200 hover:bg-slate-50";
            if (showAnswer) {
              if (isCorrect) {
                optionClass = "border-green-300 bg-green-50 text-green-800 ring-1 ring-green-400";
              } else {
                optionClass = "border-slate-100 bg-slate-50 opacity-60";
              }
            }

            return (
              <div 
                key={idx}
                className={`p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 ${optionClass}`}
              >
                <span className={`
                  flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border
                  ${showAnswer && isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-500 border-slate-300'}
                `}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm md:text-base">{cleanText(option)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className={`
            text-sm font-semibold px-4 py-2 rounded-lg transition-colors
            ${showAnswer 
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer & Explanation'}
        </button>
        <div className="text-xs text-slate-400 font-medium">
          Predicted Angoff: <span className="text-slate-600 font-bold">{question.predictedAngoff.toFixed(2)}</span>
        </div>
      </div>

      {/* Explanation Reveal */}
      {showAnswer && (
        <div className="px-6 pb-6 bg-slate-50 animate-fadeIn space-y-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <h4 className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wider">Explanation</h4>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {cleanText(question.explanation)}
            </p>
          </div>

          {/* Grounding Sources */}
          {question.sources && question.sources.length > 0 && (
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Grounding Sources & EBM Citations
              </h4>
              <ul className="space-y-1.5">
                {question.sources.map((source, sIdx) => (
                  <li key={sIdx} className="text-xs truncate">
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <span className="text-slate-400">•</span>
                      <span className="font-medium">{source.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
