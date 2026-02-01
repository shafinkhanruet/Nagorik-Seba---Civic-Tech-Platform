import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { InfoTooltip } from './InfoTooltip';
import { SensitiveContentWrapper } from './SensitiveContentWrapper';
import { 
  ThumbsUp, 
  AlertTriangle, 
  MessageSquare, 
  Share2, 
  MoreHorizontal, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Activity,
  PlayCircle,
  Send,
  User,
  ExternalLink
} from 'lucide-react';

export interface PostData {
  id: string;
  author: string;
  authorTrustScore: number;
  isAnonymous: boolean;
  location: string;
  timePosted: string;
  content: string;
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string;
  isSensitive?: boolean;
  truthProbability: number;
  supportCount: number;
  doubtCount: number;
  commentCount: number;
  status: 'verified' | 'review' | 'disputed';
  weightedSupport: number;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
  trustScore: number;
}

export const FeedPost: React.FC<{ post: PostData }> = ({ post }) => {
  const { t, user, language } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [voteState, setVoteState] = useState<'none' | 'support' | 'doubt'>('none');
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', author: 'Local_Resident_22', text: 'এই সমস্যাটি আমাদের এলাকায় গত মাস ধরে চলছে। ধন্যবাদ এটি সবার সামনে আনার জন্য।', time: '১ ঘণ্টা আগে', trustScore: 85 },
  ]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([{ id: Date.now().toString(), author: user?.name || 'Citizen_You', text: commentText, time: 'এখনই', trustScore: 88 }, ...comments]);
    setCommentText('');
  };

  const getTruthColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const statusColors = {
    verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    review: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    disputed: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
  };

  return (
    <GlassCard className="group relative overflow-visible border-t-0 shadow-xl shadow-slate-200/50 dark:shadow-black/20" noPadding>
      {/* Top Accent */}
      <div className={`h-1.5 w-full absolute top-0 left-0 ${getTruthColor(post.truthProbability)}`}></div>

      {/* Header */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shadow-inner overflow-hidden border border-white dark:border-slate-600 flex items-center justify-center">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.id}&backgroundColor=ffffff`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-white dark:bg-slate-800 text-emerald-500 text-[10px] font-black px-1.5 py-0.5 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-0.5">
              <ShieldCheck size={10} />
              {post.authorTrustScore}%
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-slate-800 dark:text-white leading-none tracking-tight">
                {post.isAnonymous ? (language === 'bn' ? 'সচেতন নাগরিক' : 'Citizen_Anon') : post.author}
              </h4>
              {post.isAnonymous && (
                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest font-black px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  SECURE
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-emerald-500" /> {post.location}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {post.timePosted}
              </span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[post.status]}`}>
          {post.status}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className={`text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line ${!isExpanded && 'line-clamp-3'}`}>
          {post.content}
        </p>
        {post.content.length > 200 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-4 uppercase tracking-widest hover:underline"
          >
            {isExpanded ? 'Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Media Preview */}
      {post.mediaType !== 'none' && post.mediaUrl && (
        <div className="px-6 py-2">
          <SensitiveContentWrapper isSensitive={post.isSensitive} className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 group/media">
              <img src={post.mediaUrl} alt="Visual Proof" className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105" />
              {post.mediaType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircle size={64} className="text-white opacity-90 drop-shadow-2xl" />
                </div>
              )}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 glass border border-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-2xl flex items-center gap-2">
                <ExternalLink size={12} /> Forensic Validated
              </div>
            </div>
          </SensitiveContentWrapper>
        </div>
      )}

      {/* Integrity Metrics Bar */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-inner">
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   {language === 'bn' ? 'সত্যতা সূচক' : 'Truth Prob.'}
                   <InfoTooltip text="AI forensics and community verification consensus." />
                 </div>
                 <span className={`text-sm font-black ${post.truthProbability >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                   {post.truthProbability}%
                 </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${getTruthColor(post.truthProbability)}`} style={{ width: `${post.truthProbability}%` }}></div>
              </div>
           </div>
           <div className="flex items-center justify-between pl-0 sm:pl-6 sm:border-l border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Weight</p>
                <div className="flex items-center gap-2">
                   <Activity size={18} className="text-indigo-500" />
                   <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{post.weightedSupport.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-1.5 justify-end">
                   <div className={`w-2 h-2 rounded-full ${post.status === 'verified' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`}></div>
                   <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">{post.status}</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Interaction Grid */}
      <div className="grid grid-cols-4 border-t border-slate-100 dark:border-slate-800 overflow-hidden">
        <button onClick={() => setVoteState('support')} className={`py-5 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/10 group ${voteState === 'support' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-500'}`}>
          <ThumbsUp size={20} strokeWidth={2.5} className={voteState === 'support' ? 'fill-current' : ''} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t('support')} ({post.supportCount})</span>
        </button>
        <button onClick={() => setVoteState('doubt')} className={`py-5 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-rose-50 dark:hover:bg-rose-500/10 group ${voteState === 'doubt' ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' : 'text-slate-500'}`}>
          <AlertTriangle size={20} strokeWidth={2.5} className={voteState === 'doubt' ? 'fill-current' : ''} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t('doubt')} ({post.doubtCount})</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className={`py-5 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10 group ${showComments ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-500'}`}>
          <MessageSquare size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Discuss ({post.commentCount})</span>
        </button>
        <button className="py-5 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <Share2 size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Share</span>
        </button>
      </div>

      {/* Discussion Area */}
      {showComments && (
        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
          <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg">
              <User size={18} />
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your perspective..." 
                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm font-medium"
              />
              <button disabled={!commentText.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all">
                <Send size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black text-xs shrink-0">{comment.author.charAt(0)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{comment.author}</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-black">{comment.trustScore}% Verified</span>
                    <span className="text-[9px] text-slate-400 ml-auto font-bold uppercase">{comment.time}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {comment.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};