
import React from 'react';
import { ValidationResponse } from '../types';

interface ValidationModalProps {
  validation: ValidationResponse;
  onClose: () => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ validation, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-100 transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
          <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900 leading-tight">
              {validation.title}
            </h3>
            <p className="text-sm text-red-700 mt-1 font-medium">
              Action Required
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Problem</h4>
            <p className="text-slate-800 text-sm leading-relaxed">
              {validation.message}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-wide text-blue-800 mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommendation
            </h4>
            <p className="text-blue-900 text-sm leading-relaxed font-medium">
              {validation.advice}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            Adjust Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
