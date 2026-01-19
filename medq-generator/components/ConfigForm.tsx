
import React from 'react';
import { MCQConfig, BloomLevel, MainTopic, SubTopic, OrganSystem } from '../types';

interface ConfigFormProps {
  config: MCQConfig;
  setConfig: React.Dispatch<React.SetStateAction<MCQConfig>>;
  isLoading: boolean;
  onSubmit: () => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, setConfig, isLoading, onSubmit }) => {

  const handleTopicChange = (topic: MainTopic) => {
    const currentTopics = config.topics;
    if (currentTopics.includes(topic)) {
      setConfig({ ...config, topics: currentTopics.filter(t => t !== topic) });
    } else {
      setConfig({ ...config, topics: [...currentTopics, topic] });
    }
  };

  const handleSubTopicChange = (sub: SubTopic) => {
    const currentSubs = config.subTopics;
    if (currentSubs.includes(sub)) {
      setConfig({ ...config, subTopics: currentSubs.filter(s => s !== sub) });
    } else {
      setConfig({ ...config, subTopics: [...currentSubs, sub] });
    }
  };

  const handleChange = (field: keyof MCQConfig, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  const getAngoffLabel = (val: number) => {
    if (val <= 0.3) return "Very Hard";
    if (val <= 0.5) return "Hard";
    if (val <= 0.7) return "Moderate";
    return "Easy";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        Configuration
      </h2>

      <div className="space-y-6">
        
        {/* Live Search Toggle */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <label className="text-sm font-bold text-blue-900" htmlFor="liveSearch">Live Search Grounding</label>
            </div>
            <div className="relative inline-block w-10 align-middle select-none">
              <input 
                type="checkbox" 
                id="liveSearch" 
                checked={config.useLiveSearch}
                onChange={(e) => handleChange('useLiveSearch', e.target.checked)}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-5 transition-all"
              />
              <label htmlFor="liveSearch" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${config.useLiveSearch ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
            </div>
          </div>
          <p className="text-[10px] leading-tight text-blue-700/80 uppercase font-bold tracking-wider">Verified 2024-2025 EBM</p>
        </div>

        {/* Main Topics */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Main Science Topics</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(MainTopic).map((topic) => (
              <label key={topic} className={`
                flex items-center p-2 rounded-lg border text-[11px] cursor-pointer transition-all
                ${config.topics.includes(topic) 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}
              `}>
                <input 
                  type="checkbox" 
                  checked={config.topics.includes(topic)}
                  onChange={() => handleTopicChange(topic)}
                  className="mr-2 h-3.5 w-3.5 text-blue-600 rounded focus:ring-blue-500"
                />
                {topic}
              </label>
            ))}
          </div>
        </div>

        {/* Sub Topics (Competencies) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Competencies</label>
          <div className="grid grid-cols-1 gap-1.5">
            {Object.values(SubTopic).map((sub) => (
              <label key={sub} className={`
                flex items-center px-3 py-1.5 rounded-lg border text-[11px] cursor-pointer transition-all
                ${config.subTopics.includes(sub) 
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}
              `}>
                <input 
                  type="checkbox" 
                  checked={config.subTopics.includes(sub)}
                  onChange={() => handleSubTopicChange(sub)}
                  className="mr-2 h-3.5 w-3.5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                {sub}
              </label>
            ))}
          </div>
        </div>

        {/* Angoff Index Selector */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700">Target Angoff Index</label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.angoffIndex <= 0.4 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {config.angoffIndex.toFixed(1)} ({getAngoffLabel(config.angoffIndex)})
            </span>
          </div>
          <input 
            type="range" 
            min="0.2" 
            max="0.8" 
            step="0.1" 
            value={config.angoffIndex}
            onChange={(e) => handleChange('angoffIndex', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Hard (0.2)</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Easy (0.8)</span>
          </div>
        </div>

        {/* Clinical Stem & Format Options */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700" htmlFor="clinicalStem">Clinical Vignette</label>
              <span className="text-[10px] text-slate-400">Patient-case based stem</span>
            </div>
            <div className="relative inline-block w-10 align-middle select-none">
              <input 
                type="checkbox" 
                id="clinicalStem" 
                checked={config.hasClinicalStem}
                onChange={(e) => handleChange('hasClinicalStem', e.target.checked)}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-5 transition-all"
              />
              <label htmlFor="clinicalStem" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${config.hasClinicalStem ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
            </div>
          </div>
        </div>

        {/* Organ System */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Organ System</label>
          <select 
            value={config.organSystem}
            onChange={(e) => handleChange('organSystem', e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {Object.values(OrganSystem).map((system) => (
              <option key={system} value={system}>{system}</option>
            ))}
          </select>
        </div>

        {/* Question Count & Options */}
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Questions</label>
            <select 
              value={config.numberOfQuestions}
              onChange={(e) => handleChange('numberOfQuestions', parseInt(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Options</label>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {[4, 5].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChange('numberOfOptions', opt)}
                  className={`flex-1 py-1.5 text-xs rounded-md font-bold transition-colors ${config.numberOfOptions === opt ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bloom */}
        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-2">Bloom's Taxonomy</label>
            <select 
              value={config.bloomLevel}
              onChange={(e) => handleChange('bloomLevel', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              {Object.values(BloomLevel).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Learning Objective</label>
          <textarea 
            value={config.objective}
            onChange={(e) => handleChange('objective', e.target.value)}
            placeholder="e.g. Discuss treatment algorithms for ACS..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || config.topics.length === 0}
          className={`
            w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-md transition-all
            ${isLoading || config.topics.length === 0
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-[0.98]'}
          `}
        >
          {isLoading ? 'Generating...' : 'Generate MCQs'}
        </button>

      </div>
    </div>
  );
};

export default ConfigForm;
