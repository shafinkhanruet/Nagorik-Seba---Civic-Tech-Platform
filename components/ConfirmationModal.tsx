import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ActionButton } from './ActionButton';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  impactLevel?: 'low' | 'high' | 'critical';
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  impactLevel = 'high',
  onConfirm,
  onClose
}) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm(reason);
    setIsLoading(false);
    onClose();
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-in">
        
        {/* Header */}
        <div className={`p-6 border-b ${impactLevel === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${impactLevel === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                  {impactLevel} Impact Action
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
              <ShieldCheck size={10} /> Administrative Reason (Audit Log)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this action being taken?"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
          <ActionButton 
            variant="ghost" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </ActionButton>
          
          <ActionButton 
            variant="danger" 
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!reason.trim()}
            disabledTooltip="Please provide a reason for the audit log"
          >
            {confirmLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};