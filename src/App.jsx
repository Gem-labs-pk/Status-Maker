import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Repeat, 
  Heart, 
  Share, 
  MoreHorizontal, 
  BadgeCheck,
  Bookmark,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  User,
  Type,
  Clock,
  Calendar,
  Eye,
  BarChart2,
  Camera,
  Trash2,
  Sun,
  Moon,
  Sparkles,
  Download,
  Check
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Refs
  const avatarInputRef = useRef(null);
  const postImageInputRef = useRef(null);
  const tweetCardRef = useRef(null);
  
  // Stats & Identity
  const [stats, setStats] = useState({
    name: 'Sarah Jenkins',
    handle: '@sarah_j',
    time: '',
    date: '',
    views: '2.4M',
    reposts: '4.2K',
    likes: '18.5K',
    bookmarks: '1.2K',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
    badgeType: 'blue', // 'blue' | 'gold' | 'grey' | 'none'
    postImage: null
  });

  // --- EFFECTS ---

  // Initialize Time
  useEffect(() => {
    resetTime();
    // Preload html2canvas quietly
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
      document.head.appendChild(script);
    }
  }, []);

  // --- ACTIONS ---

  const resetTime = () => {
    const now = new Date();
    setStats(prev => ({
      ...prev,
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));
  };

  const updateStat = (key, value) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setStats(prev => ({ ...prev, [field]: url }));
    }
  };

  const clearPostImage = () => {
    setStats(prev => ({ ...prev, postImage: null }));
    if(postImageInputRef.current) postImageInputRef.current.value = '';
  };

  // Improved Save/Screenshot Logic
  const handleSave = async () => {
    if (!tweetCardRef.current) return;
    setIsCapturing(true);

    try {
      // Ensure library is loaded
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
           const script = document.createElement('script');
           script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
           script.onload = resolve;
           script.onerror = reject;
           document.head.appendChild(script);
        });
      }

      // Small delay to ensure styles settle
      await new Promise(r => setTimeout(r, 100));

      const canvas = await window.html2canvas(tweetCardRef.current, {
        backgroundColor: theme === 'dark' ? '#15202B' : '#ffffff', // Match new colors
        scale: 3, // High Res
        useCORS: true, 
        allowTaint: true,
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `status-${stats.handle.replace('@','')}-${Date.now()}.png`;
      link.click();

    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save image. Note: External images without CORS headers may block saving.");
    } finally {
      setIsCapturing(false);
    }
  };

  // --- RENDER HELPERS ---

  // Rich Text Parser for #hashtags and @mentions
  const renderRichText = (text) => {
    if (!text) return null;
    const parts = text.split(/([\s\n]+)/);
    return parts.map((part, i) => {
      // Hashtags and Mentions
      if (part.match(/^@[a-zA-Z0-9_]+/) || part.match(/^#[a-zA-Z0-9_]+/)) {
        return <span key={i} className="text-[#1D9BF0]">{part}</span>;
      }
      return part;
    });
  };

  // Badge Color Logic
  const getBadgeColor = (type) => {
    switch(type) {
      case 'gold': return '#FFD700'; // Business
      case 'grey': return '#829aab'; // Gov/Official
      default: return '#1D9BF0';     // Standard Blue
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL: CONTROL CENTER --- */}
      <div className="w-full md:w-[440px] border-r border-slate-200 flex flex-col bg-white relative z-20 h-screen overflow-hidden shadow-xl">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
             </div>
             <span className="text-sm font-bold text-slate-800 tracking-wide">Status Maker</span>
          </div>
          <button onClick={resetTime} className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-semibold uppercase tracking-wider transition-colors px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200">
             <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
          
          {/* 1. Appearance (Theme) */}
          <section className="space-y-3">
             <SectionLabel icon={<Sun size={12} />} label="Theme Mode" />
             <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <ThemeButton 
                  isActive={theme === 'dark'} 
                  onClick={() => setTheme('dark')} 
                  icon={<Moon size={14} />} 
                  label="Dim (Pro)" 
                />
                <ThemeButton 
                  isActive={theme === 'light'} 
                  onClick={() => setTheme('light')} 
                  icon={<Sun size={14} />} 
                  label="Light" 
                />
             </div>
          </section>

          <Divider />

          {/* 2. Main Content Input */}
          <section className="space-y-3">
            <SectionLabel icon={<Type size={12} />} label="Content" />
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What is happening?!"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base text-slate-800 placeholder-slate-400 outline-none resize-none font-medium leading-relaxed min-h-[140px] focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                 {/* Image Controls */}
                 <button 
                  onClick={() => postImageInputRef.current?.click()}
                  className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 hover:border-blue-400 text-slate-400 hover:text-blue-500 transition-colors"
                  title="Attach Media"
                 >
                   <ImageIcon size={16} />
                 </button>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={postImageInputRef} 
              onChange={(e) => handleImageUpload(e, 'postImage')} 
              className="hidden" 
              accept="image/*" 
            />
            
            {/* Attachment Preview */}
            {stats.postImage && (
               <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden">
                      <img src={stats.postImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Image attached</span>
                  </div>
                  <button 
                    onClick={clearPostImage}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
               </div>
            )}
          </section>

          <Divider />

          {/* 3. Identity Configuration */}
          <section className="space-y-4">
            <SectionLabel icon={<User size={12} />} label="Author Info" />
            
            <div className="flex gap-4 items-start">
               {/* Avatar Upload */}
               <div className="flex flex-col gap-2 items-center">
                 <div className="relative group cursor-pointer w-16 h-16" onClick={() => avatarInputRef.current?.click()}>
                   <img src={stats.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border border-slate-200 group-hover:border-blue-400 transition-colors shadow-sm" />
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[1px]">
                     <Upload size={16} className="text-white" />
                   </div>
                 </div>
                 <input 
                    type="file" 
                    ref={avatarInputRef} 
                    onChange={(e) => handleImageUpload(e, 'avatar')} 
                    className="hidden" 
                    accept="image/*" 
                  />
               </div>

               {/* Name & Handle */}
               <div className="flex-1 space-y-3">
                 <InputGroup label="Display Name" value={stats.name} onChange={(v) => updateStat('name', v)} />
                 <InputGroup label="Handle" value={stats.handle} onChange={(v) => updateStat('handle', v)} />
               </div>
            </div>

            {/* Verification Badge Selector */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verification Status</label>
              
              <div className="grid grid-cols-4 gap-2">
                <BadgeSelector 
                   type="none" 
                   active={stats.badgeType === 'none'} 
                   onClick={() => updateStat('badgeType', 'none')} 
                />
                <BadgeSelector 
                   type="blue" 
                   active={stats.badgeType === 'blue'} 
                   onClick={() => updateStat('badgeType', 'blue')} 
                />
                <BadgeSelector 
                   type="gold" 
                   active={stats.badgeType === 'gold'} 
                   onClick={() => updateStat('badgeType', 'gold')} 
                />
                <BadgeSelector 
                   type="grey" 
                   active={stats.badgeType === 'grey'} 
                   onClick={() => updateStat('badgeType', 'grey')} 
                />
              </div>
            </div>
          </section>

          <Divider />

          {/* 4. Metrics & Timestamp */}
          <section className="space-y-4">
             <SectionLabel icon={<BarChart2 size={12} />} label="Metrics" />
             <div className="grid grid-cols-2 gap-3">
               <InputGroup label="Views" value={stats.views} onChange={(v) => updateStat('views', v)} />
               <InputGroup label="Likes" value={stats.likes} onChange={(v) => updateStat('likes', v)} />
               <InputGroup label="Reposts" value={stats.reposts} onChange={(v) => updateStat('reposts', v)} />
               <InputGroup label="Bookmarks" value={stats.bookmarks} onChange={(v) => updateStat('bookmarks', v)} />
             </div>
             
             <div className="pt-2">
               <SectionLabel icon={<Clock size={12} />} label="Date & Time" />
               <div className="grid grid-cols-2 gap-3 mt-2">
                 <InputGroup value={stats.time} onChange={(v) => updateStat('time', v)} icon={<Clock size={12} />} />
                 <InputGroup value={stats.date} onChange={(v) => updateStat('date', v)} icon={<Calendar size={12} />} />
               </div>
             </div>
          </section>
        </div>

        {/* SAVE Button Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 z-30">
          <button 
            onClick={handleSave}
            disabled={isCapturing}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg shadow-slate-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isCapturing ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                Save Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW CANVAS --- */}
      <div className={`flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#F0F2F5]'}`}>
        
        {/* Modern Background Gradient - Very subtle */}
        {theme === 'dark' && (
           <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#192734] to-transparent" />
           </div>
        )}

        {/* --- THE POST CARD --- */}
        <div 
          ref={tweetCardRef}
          className={`w-full max-w-[600px] rounded-none md:rounded-xl p-4 md:p-5 relative z-10 transition-all duration-300 shadow-xl ${
             theme === 'dark' 
                ? 'bg-[#15202B] border border-slate-800 text-white shadow-black/50' // Official "Dim" color
                : 'bg-white border border-slate-100 text-black shadow-slate-200/50'
          }`}
        >
          
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <img 
                src={stats.avatar} 
                alt="Profile" 
                crossOrigin="anonymous" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col justify-center -space-y-0.5">
                <div className="flex items-center gap-1 group">
                  <span className={`font-bold text-[15px] ${theme === 'dark' ? 'text-white' : 'text-[#0F1419]'}`}>
                    {stats.name}
                  </span>
                  {stats.badgeType !== 'none' && (
                     <BadgeCheck 
                        size={18} 
                        fill={getBadgeColor(stats.badgeType)} 
                        className="text-white" // This makes the checkmark white
                        strokeWidth={2.5}
                     />
                  )}
                </div>
                <span className={`text-[15px] ${theme === 'dark' ? 'text-[#8B98A5]' : 'text-[#536471]'}`}>{stats.handle}</span>
              </div>
            </div>
            <div className={`${theme === 'dark' ? 'text-[#8B98A5]' : 'text-[#536471]'}`}>
               <MoreHorizontal size={20} />
            </div>
          </div>

          {/* Body Content */}
          <div className="mt-3 mb-3">
            {/* Text Content */}
            {(content || (!content && !stats.postImage)) && (
               <p className={`text-[17px] leading-[24px] whitespace-pre-wrap font-normal break-words ${theme === 'dark' ? 'text-white' : 'text-[#0F1419]'} ${!content ? 'opacity-40 italic' : ''}`}>
                 {content ? renderRichText(content) : "Type something..."}
               </p>
            )}
            
            {/* Image Attachment */}
            {stats.postImage && (
              <div className={`rounded-2xl overflow-hidden border mt-3 ${theme === 'dark' ? 'border-[#38444D]' : 'border-[#CFD9DE]'}`}>
                <img 
                  src={stats.postImage} 
                  alt="Post" 
                  crossOrigin="anonymous" 
                  className="w-full h-auto max-h-[500px] object-cover block" 
                />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className={`py-3 border-b ${theme === 'dark' ? 'border-[#38444D]' : 'border-[#EFF3F4]'}`}>
             <div className={`flex items-center gap-1 text-[15px] ${theme === 'dark' ? 'text-[#8B98A5]' : 'text-[#536471]'}`}>
                <span>{stats.time}</span>
                <span>·</span>
                <span>{stats.date}</span>
                <span>·</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#0F1419]'}`}>{stats.views}</span>
                <span>Views</span>
             </div>
          </div>

          {/* Actions */}
          <div className={`flex justify-between items-center px-2 pt-3 ${theme === 'dark' ? 'text-[#8B98A5]' : 'text-[#536471]'}`}>
            <ActionIcon icon={<MessageCircle size={18} />} count="24" />
            <ActionIcon icon={<Repeat size={18} />} count={stats.reposts} />
            <ActionIcon icon={<Heart size={18} />} count={stats.likes} />
            <ActionIcon icon={<Bookmark size={18} />} count={stats.bookmarks} />
            <div className="transition-colors">
              <Share size={18} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SectionLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-100 w-full" />;
}

function ThemeButton({ isActive, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
        isActive 
          ? 'bg-slate-800 text-white shadow-md' 
          : 'bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function BadgeSelector({ type, active, onClick }) {
  const getPreviewColor = () => {
    switch(type) {
      case 'gold': return '#FFD700';
      case 'grey': return '#829aab';
      case 'blue': return '#1D9BF0';
      default: return '#cbd5e1';
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${
        active 
          ? 'bg-blue-50/50 border-blue-500/30 ring-1 ring-blue-500/20' 
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {type === 'none' ? (
        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
      ) : (
        <BadgeCheck size={20} fill={getPreviewColor()} className="text-white" />
      )}
      <span className={`text-[10px] font-bold capitalize ${active ? 'text-blue-600' : 'text-slate-400'}`}>
        {type}
      </span>
    </button>
  );
}

function InputGroup({ label, value, onChange, icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{label}</label>}
      <div className="relative group">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white outline-none transition-all font-medium ${icon ? 'pl-8' : ''}`}
        />
        {icon && <span className="absolute left-3 top-3 text-slate-400">{icon}</span>}
      </div>
    </div>
  );
}

function ActionIcon({ icon, count }) {
  return (
    <div className="flex items-center gap-1.5 group cursor-pointer">
      <div className="p-1.5 -ml-1.5 rounded-full transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-500">
        {icon}
      </div>
      {count && <span className="text-[13px] font-medium group-hover:text-blue-500 transition-colors">{count}</span>}
    </div>
  );
}