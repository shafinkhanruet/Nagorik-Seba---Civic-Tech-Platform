
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
  CornerDownRight
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

interface FeedPostProps {
  post: PostData;
}

export const FeedPost: React.FC<FeedPostProps> = ({ post }) => {
  const { t, user } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [voteState, setVoteState] = useState<'none' | 'support' | 'doubt'>('none');
  const [counts, setCounts] = useState({
    support: post.supportCount,
    doubt: post.doubtCount,
    comments: post.commentCount
  });
  const [showShareToast, setShowShareToast] = useState(false);
  
  // Comment Section State
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', author: 'Local_Resident_22', text: 'This issue has been persisting for weeks. Thanks for reporting!', time: '1 hour ago', trustScore: 85 },
    { id: 'c2', author: 'Engr. Rahim', text: 'I can confirm the structural concern mentioned here.', time: '30 mins ago', trustScore: 92 }
  ]);

  const handleSupport = () => {
    if (voteState === 'support') return;
    setVoteState('support');
    setCounts(prev => ({ 
      ...prev, 
      support: prev.support + 1,
      doubt: voteState === 'doubt' ? prev.doubt - 1 : prev.doubt 
    }));
  };

  const handleDoubt = () => {
    if (voteState === 'doubt') return;
    setVoteState('doubt');
    setCounts(prev => ({ 
      ...prev, 
      doubt: prev.doubt + 1,
      support: voteState === 'support' ? prev.support - 1 : prev.support
    }));
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `new_${Date.now()}`,
      author: user?.name || 'Citizen_You',
      text: commentText,
      time: 'Just now',
      trustScore: 88 // Mock score for current user
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    setCounts(prev => ({ ...prev, comments: prev.comments + 1 }));
  };

  const getTruthColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const statusConfig = {
    verified: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', icon: CheckCircle2 },
    review: { color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', icon: Clock },
    disputed: { color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', icon: AlertTriangle }
  };

  const StatusIcon = statusConfig[post.status].icon;

  return (
    <GlassCard className="mb-6 relative overflow-visible group animate-fade-in-up hover:shadow-xl transition-all duration-300 border-t-0" noPadding>
      
      {/* Toast Notification */}
      {showShareToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl animate-fade-in-down flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          লিঙ্ক কপি করা হয়েছে
        </div>
      )}

      {/* HEADER */}
      <div className="p-5 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-white dark:border-slate-700 shadow-md overflow-hidden flex items-center justify-center p-0.5">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.id}&backgroundColor=b6e3f4`} 
                alt="Avatar" 
                className="w-full h-full rounded-full bg-white dark:bg-slate-900"
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-0.5">
              <ShieldCheck size={10} />
              {post.authorTrustScore}%
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-none">
                {post.isAnonymous ? 'সচেতন নাগরিক' : post.author}
              </h4>
              {post.isAnonymous && (
                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wide font-bold px-1.5 py-0.5 rounded">
                  Anon
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" /> {post.location}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-slate-400" /> {post.timePosted}
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="px-5 pb-3">
        <p className={`text-[15px] text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-line ${!isExpanded && 'line-clamp-3'}`}>
          {post.content}
        </p>
        {post.content.length > 150 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 hover:underline decoration-2 underline-offset-2"
          >
            {isExpanded ? 'কমিয়ে দেখুন' : 'আরও পড়ুন'}
          </button>
        )}
      </div>

      {/* MEDIA */}
      {post.mediaType !== 'none' && post.mediaUrl && (
        <div className="mt-2 mb-2 px-5">
          <SensitiveContentWrapper isSensitive={post.isSensitive}>
            <div className="relative bg-slate-100 dark:bg-slate-900 aspect-video rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
              <img src={post.mediaUrl} alt="Post content" className="w-full h-full object-cover" />
              {post.mediaType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] hover:bg-black/30 transition-colors group/video cursor-pointer">
                  <PlayCircle size={56} className="text-white opacity-90 group-hover/video:scale-110 transition-transform drop-shadow-xl" />
                </div>
              )}
            </div>
          </SensitiveContentWrapper>
        </div>
      )}

      {/* TRUTH & STATUS BAR */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
           <div className="flex flex-col gap-1 w-full max-w-[200px]">
              <div className="flex justify-between items-center text-xs">
                 <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide text-[10px]">
                   সত্যতা যাচাই <InfoTooltip text="AI এবং ফ্যাক্ট-চেকারদের দ্বারা যাচাইকৃত স্কোর।" />
                 </div>
                 <span className={`font-bold ${post.truthProbability >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
                   {post.truthProbability}%
                 </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getTruthColor(post.truthProbability)}`} 
                  style={{ width: `${post.truthProbability}%` }}
                ></div>
              </div>
           </div>

           <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-4"></div>

           <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                 <StatusIcon size={14} className={post.status === 'verified' ? 'text-emerald-600' : post.status === 'review' ? 'text-blue-600' : 'text-red-600'} />
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusConfig[post.status].color}`}>
                   {post.status}
                 </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Activity size={10} />
                <span className="font-mono">Weight: {post.weightedSupport}</span>
              </div>
           </div>
        </div>
      </div>

      {/* ACTION ROW */}
      <div className="grid grid-cols-4 border-t border-slate-100 dark:border-slate-800/60 divide-x divide-slate-100 dark:divide-slate-800/60">
        <button 
          onClick={handleSupport}
          className={`py-4 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 group ${voteState === 'support' ? 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <ThumbsUp size={20} className={`transition-transform group-hover:-translate-y-0.5 ${voteState === 'support' ? 'fill-current' : ''}`} />
          <span className="text-[11px] font-bold">সমর্থন <span className="opacity-70 font-normal ml-0.5">({counts.support})</span></span>
        </button>
        
        <button 
          onClick={handleDoubt}
          className={`py-4 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-amber-50/50 dark:hover:bg-amber-900/10 group ${voteState === 'doubt' ? 'text-amber-600 bg-amber-50/50 dark:bg-amber-900/10' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <AlertTriangle size={20} className={`transition-transform group-hover:-translate-y-0.5 ${voteState === 'doubt' ? 'fill-current' : ''}`} />
          <span className="text-[11px] font-bold">সন্দেহ <span className="opacity-70 font-normal ml-0.5">({counts.doubt})</span></span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`py-4 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group ${showComments ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <MessageSquare size={20} className={`transition-transform group-hover:-translate-y-0.5 ${showComments ? 'fill-current' : ''}`} />
          <span className="text-[11px] font-bold">আলোচনা <span className="opacity-70 font-normal ml-0.5">({counts.comments})</span></span>
        </button>
        
        <button 
          onClick={handleShare}
          className="py-4 flex flex-col items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all hover:text-indigo-600 dark:hover:text-indigo-400 group"
        >
          <Share2 size={20} className="transition-transform group-hover:-translate-y-0.5" />
          <span className="text-[11px] font-bold">শেয়ার</span>
        </button>
      </div>

      {/* COMMENTS SECTION (EXPANDABLE) */}
      {showComments && (
        <div className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 p-4 animate-fade-in">
          
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <User size={14} className="text-slate-500" />
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="আপনার মতামত লিখুন..." 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={12} />
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500">{comment.author.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm inline-block min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        <ShieldCheck size={8} /> {comment.trustScore}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-1 ml-1">
                    <span className="text-[10px] text-slate-400 font-medium">{comment.time}</span>
                    <button className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors">Reply</button>
                    <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">Like</button>
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
