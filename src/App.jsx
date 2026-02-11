import React, { useState, useEffect, useRef } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Send, 
  MoreHorizontal, 
  Globe,
  Clock,
  Briefcase,
  Image as ImageIcon,
  User,
  Type,
  RotateCcw,
  Download,
  Trash2,
  Upload,
  Sun,
  Moon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Refs
  const avatarInputRef = useRef(null);
  const postImageInputRef = useRef(null);
  const cardRef = useRef(null);
  
  // Default Avatar (SVG Data URI to prevent CORS issues on save)
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

  // Stats & Identity
  const [stats, setStats] = useState({
    name: 'Alex Morgan',
    headline: 'Product Designer | UI/UX Enthusiast',
    time: '2h',
    isEdited: false,
    likes: 845,
    comments: 42,
    shares: 15,
    avatar: null, // If null, uses defaultAvatar
    postImage: null
  });

  // --- EFFECTS ---

  useEffect(() => {
    // Preload html2canvas
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
      document.head.appendChild(script);
    }
  }, []);

  // --- ACTIONS ---

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

  const handleSave = async () => {
    if (!cardRef.current) return;
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

      // Small delay for rendering
      await new Promise(r => setTimeout(r, 100));

      const canvas = await window.html2canvas(cardRef.current, {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        scale: 2, // Retain quality
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `professional-post-${Date.now()}.png`;
      link.click();

    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save image. Try uploading local images instead of using web URLs for avatars to fix security blocks.");
    } finally {
      setIsCapturing(false);
    }
  };

  // --- RENDER HELPERS ---

  const renderRichText = (text) => {
    if (!text) return null;
    return text.split(/([\s\n]+)/).map((part, i) => {
      // Highlight hashtags and links
      if (part.startsWith('#') || part.startsWith('http')) {
        return <span key={i} className="text-blue-600 font-medium">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL: CONTROL CENTER --- */}
      <div className="w-full md:w-[400px] border-r border-slate-200 flex flex-col bg-white z-20 h-screen shadow-xl">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <div className="bg-blue-600 p-1.5 rounded-lg">
                <Sparkles size={16} className="text-white" />
             </div>
             <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">Pro Post Maker</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-32">
          
          {/* Theme Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex">
             <button 
               onClick={() => setTheme('light')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${theme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
             >
               <Sun size={14} /> Light
             </button>
             <button 
               onClick={() => setTheme('dark')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-500'}`}
             >
               <Moon size={14} /> Dark
             </button>
          </div>

          <Divider />

          {/* Author Info */}
          <section className="space-y-4">
            <SectionLabel icon={<User size={14} />} label="Author Profile" />
            
            <div className="flex gap-4">
               {/* Avatar */}
               <div className="flex flex-col gap-2 items-center">
                 <div className="w-16 h-16 relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                   {stats.avatar ? (
                     <img src={stats.avatar} className="w-full h-full rounded-full object-cover border-2 border-slate-200" alt="Avatar" />
                   ) : (
                     <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                       <User size={24} className="text-slate-400" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                     <Upload size={16} className="text-white" />
                   </div>
                 </div>
                 <input type="file" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} className="hidden" accept="image/*" />
               </div>

               {/* Inputs */}
               <div className="flex-1 space-y-3">
                 <InputGroup placeholder="Full Name" value={stats.name} onChange={(v) => updateStat('name', v)} />
                 <InputGroup placeholder="Headline (e.g. Product Manager)" value={stats.headline} onChange={(v) => updateStat('headline', v)} />
                 <InputGroup placeholder="Time (e.g. 2h • Edited)" value={stats.time} onChange={(v) => updateStat('time', v)} icon={<Clock size={12}/>} />
               </div>
            </div>
          </section>

          <Divider />

          {/* Content */}
          <section className="space-y-3">
             <SectionLabel icon={<Type size={14} />} label="Post Content" />
             <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="What do you want to talk about?"
               className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
             />
             
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => postImageInputRef.current?.click()}
                 className="flex items-center gap-2 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors text-slate-600"
               >
                 <ImageIcon size={14} />
                 {stats.postImage ? 'Change Image' : 'Add Photo'}
               </button>
               {stats.postImage && (
                 <button onClick={clearPostImage} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
               )}
             </div>
             <input type="file" ref={postImageInputRef} onChange={(e) => handleImageUpload(e, 'postImage')} className="hidden" accept="image/*" />
          </section>

          <Divider />

          {/* Metrics */}
          <section className="space-y-3">
            <SectionLabel icon={<ThumbsUp size={14} />} label="Engagement" />
            <div className="grid grid-cols-3 gap-3">
               <InputGroup label="Likes" value={stats.likes} onChange={(v) => updateStat('likes', v)} />
               <InputGroup label="Comments" value={stats.comments} onChange={(v) => updateStat('comments', v)} />
               <InputGroup label="Reposts" value={stats.shares} onChange={(v) => updateStat('shares', v)} />
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <button 
            onClick={handleSave}
            disabled={isCapturing}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isCapturing ? 'Processing...' : <><Download size={18} /> Download Image</>}
          </button>
        </div>

      </div>

      {/* --- RIGHT PANEL: PREVIEW --- */}
      <div className={`flex-1 overflow-y-auto flex items-center justify-center p-8 transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
        
        {/* THE CARD */}
        <div 
          ref={cardRef}
          className={`w-full max-w-[550px] rounded-xl shadow-sm border transition-all ${
            theme === 'dark' 
              ? 'bg-[#1e293b] border-slate-700 text-white' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          
          {/* 1. Header */}
          <div className="p-4 flex gap-3 items-start">
            <img 
              src={stats.avatar || defaultAvatar} 
              alt="Profile"
              crossOrigin="anonymous" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <span className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {stats.name}
                </span>
                <span className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {stats.headline}
                </span>
                <div className={`flex items-center gap-1 text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>{stats.time}</span>
                  <span>•</span>
                  <Globe size={10} />
                </div>
              </div>
            </div>
            <button className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* 2. Content */}
          <div className="px-4 pb-2">
            <div className={`text-sm whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
              {content ? renderRichText(content) : <span className="opacity-40 italic">Start typing your post...</span>}
            </div>
          </div>

          {/* 3. Image */}
          {stats.postImage && (
            <div className="mt-2">
              <img 
                src={stats.postImage} 
                alt="Post Content" 
                crossOrigin="anonymous"
                className="w-full h-auto object-cover border-t border-b border-slate-100/10"
              />
            </div>
          )}

          {/* 4. Social Proof Line */}
          <div className={`mx-4 mt-3 py-2 flex items-center justify-between text-xs border-b ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
             <div className="flex items-center gap-1">
                <div className="bg-blue-500 rounded-full p-0.5">
                   <ThumbsUp size={8} className="text-white fill-white" />
                </div>
                <span>{stats.likes}</span>
             </div>
             <div className="flex gap-3">
               <span>{stats.comments} comments</span>
               <span>{stats.shares} reposts</span>
             </div>
          </div>

          {/* 5. Action Buttons */}
          <div className="px-2 py-1 flex items-center justify-between">
             <ActionButton icon={<ThumbsUp size={18} />} label="Like" theme={theme} />
             <ActionButton icon={<MessageSquare size={18} />} label="Comment" theme={theme} />
             <ActionButton icon={<RotateCcw size={18} />} label="Repost" theme={theme} />
             <ActionButton icon={<Send size={18} />} label="Send" theme={theme} />
          </div>

        </div>

      </div>
    </div>
  );
}

// --- COMPONENTS ---

function SectionLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
      {icon} <span>{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-100 w-full" />;
}

function InputGroup({ label, value, onChange, placeholder, icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] text-slate-500 font-bold uppercase">{label}</label>}
      <div className="relative">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none ${icon ? 'pl-8' : ''}`}
        />
        {icon && <span className="absolute left-2.5 top-2.5 text-slate-400">{icon}</span>}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, theme }) {
  return (
    <button className={`flex items-center gap-2 px-3 py-3 rounded-md transition-colors text-sm font-semibold flex-1 justify-center ${
      theme === 'dark' 
        ? 'text-slate-400 hover:bg-slate-800' 
        : 'text-slate-500 hover:bg-slate-100'
    }`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}