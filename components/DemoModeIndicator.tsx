import React, { useState } from 'react';
import { FlaskConical, Info, X } from 'lucide-react';

// Configuration Flag for Demo Mode
const DEMO_CONFIG = {
  isEnabled: true, // Toggle this to false to hide the indicator globally
};

export const DemoModeIndicator: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  if (!DEMO_CONFIG.isEnabled) return null;

  return (
    <>
      {/* Floating Badge */}
      <button
        onClick={() => setShowInfo(true)}
        className="fixed top-24 right-4 z-[90] flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/90 dark:bg-indigo-900/80 backdrop-blur-md border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-lg hover:scale-105 transition-transform animate-fade-in group"
        title="Demo Mode Active"
        aria-label="Demo Mode Info"
      >
        <FlaskConical size={14} className="group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Demo Mode — Sample Data</span>
        <span className="sm:hidden">Demo</span>
        <Info size={12} className="ml-1 opacity-60 group-hover:opacity-100" />
      </button>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setShowInfo(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 animate-scale-in">
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 ring-4 ring-indigo-50 dark:ring-indigo-900/10">
                <FlaskConical size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-serif">
                ডেমো মোড
              </h3>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/30 mb-6 w-full">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "এই প্ল্যাটফর্মে প্রদর্শিত সব তথ্য উদাহরণস্বরূপ। এটি একটি শিক্ষামূলক প্রকল্প এবং বাস্তব ডেটাবেসের সাথে সংযুক্ত নয়।"
                </p>
              </div>
              
              <button
                onClick={() => setShowInfo(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};