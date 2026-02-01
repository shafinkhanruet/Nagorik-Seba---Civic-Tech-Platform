
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Shield, 
  Lock, 
  User, 
  ArrowRight, 
  KeyRound, 
  AlertTriangle, 
  Loader2,
  Fingerprint
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock validation
    setTimeout(() => {
      if (email.includes('admin') && password.length > 3) {
        setIsLoading(false);
        setStep(2);
      } else {
        setIsLoading(false);
        setError('Invalid credentials or unauthorized ID.');
      }
    }, 1500);
  };

  const handleOtpVerify = () => {
    setError('');
    setIsLoading(true);

    // Mock 2FA verification
    setTimeout(() => {
      if (otp.join('').length === 6) {
        // Determine role based on email for demo
        const role = email.includes('super') ? 'superadmin' : email.includes('mod') ? 'moderator' : 'admin';
        
        login({
          id: 'admin-usr-001',
          name: 'System Administrator',
          role: role,
          token: 'secure-token-xyz-999',
          expiresAt: Date.now() + 3600000 // 1 hour
        });
        
        navigate('/admin');
      } else {
        setIsLoading(false);
        setError('Invalid OTP Code.');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/20 text-red-500 border border-red-900/50 mb-6 shadow-lg shadow-red-900/20 animate-pulse">
            <Shield size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wider uppercase mb-2">
            Restricted Access
          </h1>
          <p className="text-red-400 text-xs font-mono bg-red-950/30 inline-block px-3 py-1 rounded border border-red-900/50">
            <AlertTriangle size={10} className="inline mr-1" />
            এই অংশ শুধুমাত্র অনুমোদিত প্রশাসকদের জন্য
          </p>
        </div>

        <GlassCard className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-xl">
          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admin ID / Email</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3.5 text-slate-600" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-red-600 transition-colors text-sm font-mono"
                    placeholder="admin@gov.bd"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Secure Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3.5 text-slate-600" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-red-600 transition-colors text-sm font-mono"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-red-700 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Verify Credentials <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center animate-fade-in">
              <div>
                <h3 className="text-slate-200 font-bold mb-1">Two-Factor Authentication</h3>
                <p className="text-slate-500 text-xs">Enter the 6-digit code from your security token.</p>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && idx < 5) {
                        const next = document.getElementById(`otp-${idx + 1}`);
                        next?.focus();
                      }
                    }}
                    id={`otp-${idx}`}
                    className="w-10 h-12 bg-slate-950 border border-slate-800 rounded text-center text-slate-200 font-mono text-xl focus:border-red-500 outline-none transition-colors"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-500 text-xs font-mono bg-emerald-950/20 py-2 rounded border border-emerald-900/30">
                <Fingerprint size={14} /> Biometric verification active
              </div>

              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

              <button 
                onClick={handleOtpVerify}
                disabled={isLoading}
                className="w-full py-3 bg-red-700 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Secure Login <KeyRound size={16} /></>}
              </button>
              
              <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-300 underline">
                Cancel Login
              </button>
            </div>
          )}
        </GlassCard>

        <div className="mt-8 text-center text-[10px] text-slate-600 font-mono">
          <p>AUTHORIZED PERSONNEL ONLY</p>
          <p>SYSTEM ID: GOV-SEC-NODE-04</p>
        </div>
      </div>
    </div>
  );
};
