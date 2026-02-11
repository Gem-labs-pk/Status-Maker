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
  Download
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
    badgeColor: '#1D9BF0', // Default Blue
    isVerified: true,
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
        backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
        scale: 3, // High Res
        useCORS: true, // IMPORTANT for external images
        allowTaint: true,
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `status-maker-${Date.now()}.png`;
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
      if (part.match(/^@[a-zA-Z0-9_]+/) || part.match(/^#[a-zA-Z0-9_]+/)) {
        return <span key={i} className="text-[#1D9BF0]">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL: CONTROL CENTER --- */}
      <div className="w-full md:w-[440px] border-r border-slate-800 flex flex-col bg-slate-900/90 backdrop-blur-xl relative z-20 h-screen overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={16} className="text-white" />
             </div>
             <span className="text-sm font-bold text-slate-200 tracking-wide">Status Maker</span>
          </div>
          <button onClick={resetTime} className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-semibold uppercase tracking-wider transition-colors px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20">
             <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
          
          {/* 1. Appearance (Theme) */}
          <section className="space-y-3">
             <SectionLabel icon={<Sun size={12} />} label="Theme Mode" />
             <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
                <ThemeButton 
                  isActive={theme === 'dark'} 
                  onClick={() =>QHkjTheme('dark')} 
                  icon={<Moon size={14} />} 
                  label="Dark" 
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
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-base text-slate-100 placeholder-slate-500 outline-none resize-none font-medium leading-relaxed min-h-[140px] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                 {/* Image Controls */}
                 <button 
                  onClick={() => postImageInputRef.current?.click()}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 transition-colors"
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
               <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-900 overflow-hidden">
                      <img src={stats.postImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <span className="text-xs text-slate-400">Image attached</span>
                  </div>
                  <button 
                    onClick={clearPostImage}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
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
                   <img src={stats.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-slate-700 group-hover:border-indigo-500 transition-colors shadow-lg" />
                   <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
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

            {/* Verification Badge */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Verification Status</label>
                <Switch checked={stats.isVerified} onChange={() => updateStat('isVerified', !stats.isVerified)} />
              </div>
              
              {stats.isVerified && (
                <div className="grid grid-cols-3 gap-2">
                  <BadgeOption color="#1D9BF0" label="Blue" active={stats.badgeColor === '#1D9BF0'} onClick={() => updateStat('badgeColor', '#1D9BF0')} />
                  <BadgeOption color="#E7B416" label="Gold" active={stats.badgeColor === '#E7B416'} onClick={() => updateStat('badgeColor', '#E7B416')} />
                  <BadgeOption color="#F91880" label="Pink" active={stats.badgeColor === '#F91880'} onClick={() => updateStat('badgeColor', '#F91880')} />
                </div>
              )}
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
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-30">
          <button 
            onClick={handleSave}
            disabled={isCapturing}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
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
      <div className={`flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f1014]' : 'bg-slate-100'}`}>
        
        {/* Modern Background Gradient */}
        <div className={`absolute inset-0 pointer-events-none opacity-50 ${theme === 'dark' ? 'opacity-30' : 'opacity-60'}`}>
           <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[120px]" />
        </div>

        {/* --- THE POST CARD --- */}
        <div 
          ref={tweetCardRef}
          className={`w-full max-w-[600px] rounded-2xl p-6 relative z-10 transition-all duration-300 shadow-2xl ${
             theme === 'dark' 
                ? 'bg-black border border-slate-800 text-white shadow-black/80' 
                : 'bg-white border border-slate-200 text-black shadow-slate-200/50'
          }`}
        >
          
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <img 
                src={stats.avatar} 
                alt="Profile" 
                crossOrigin="anonymous" 
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="flex flex-col justify-center -space-y-0.5">
                <div className="flex items-center gap-1 group">
                  <span className={`font-bold text-[15px] ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    {stats.name}
                  </span>
                  {stats.isVerified && (
                     <BadgeCheck size={18} color={stats.badgeColor} fill={stats.badgeColor} className="text-white" />
                  )}
                </div>
                <span className={`text-[15px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{stats.handle}</span>
              </div>
            </div>
            <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
               <MoreHorizontal size={20} />
            </div>
          </div>

          {/* Body Content */}
          <div className="mt-3 mb-3">
            {/* Text Content */}
            {(content || (!content && !stats.postImage)) && (
               <p className={`text-[17px] leading-normal whitespace-pre-wrap font-normal break-words ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} ${!content ? 'opacity-40 italic' : ''}`}>
                 {content ? renderRichText(content) : "Type something..."}
               </p>
            )}
            
            {/* Image Attachment */}
            {stats.postImage && (
              <div className={`rounded-2xl overflow-hidden border mt-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
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
          <div className={`py-3 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
             <div className={`flex items-center gap-1 text-[15px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                <span>{stats.time}</span>
                <span>·</span>
                <span>{stats.date}</span>
                <span>·</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{stats.views}</span>
                <span>Views</span>
             </div>
          </div>

          {/* Actions */}
          <div className={`flex justify-between items-center px-2 pt-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
            <ActionIcon icon={<MessageCircle size={18} />} count="24" color="hover:text-blue-500" />
            <ActionIcon icon={<Repeat size={18} />} count={stats.reposts}yb color="hover:text-green-500" />
            <ActionIcon icon={<Heart size={18} />} count={stats.likes} color="hover:text-pink-500" />
            <ActionIcon icon={<Bookmark size={18} />} count={stats.bookmarks} color="hover:text-blue-500" />
            <div className="hover:text-blue-500 transition-colors">
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
    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-800 w-full" />;
}

function ThemeButton({ isActive, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
        isActive 
          ? 'bg-slate-700 text-white shadow-md' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button 
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${checked ? 'left-6' : 'left-1'}`} />
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
          className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:bg-slate-800 outline-none transition-all font-medium ${icon ? 'pl-8' : ''}`}
        />
        {icon && <span className="absolute left-3 top-3 text-slate-500">{icon}</span>}
      </div>
    </div>
  );
}

function BadgeOption({ color, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border transition-all ${
        active 
          ? 'bg-slate-800 border-indigo-500/50 shadow-sm' 
          : 'bg-transparent border-slate-700 hover:border-slate-600'
      }`}
    >
      <BadgeCheck size={14} color={color} fill={color} className="text-white" />
      <span className={`text-[10px] font-bold ${active ? 'text-slate-200' : 'text-slate-500'}`}>{label}</span>
    </button>
  );
}

function ActionIcon({ icon, count, color }) {
  return (
    <div className={`flex items-center gap-1.5 group cursor-pointer transition-colors ${color}`}>
      <div className="p-1.5 -ml-1.5 rounded-full transition-colors group-hover:bg-slate-500/10">
        {icon}
      </div>
      {count && <span className="text-[13px] font-medium">{count}</span>}
    </div>
  );
}