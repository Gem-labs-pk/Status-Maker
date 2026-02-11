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
  Plus,
  X,
  Heart,
  Lightbulb,
  HandMetal
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
  
  // Default Avatar (Base64 SVG to ensure no CORS issues)
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e2e8f0'%3E%3Ccircle cx='12' cy='12' r='12'/%3E%3Cpath d='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/%3E%3C/svg%3E";

  // Stats & Identity
  const [stats, setStats] = useState({
    name: 'Alex Morgan',
    headline: 'Senior Product Designer | Building accessible web experiences',
    time: '3h',
    isEdited: false,
    likes: 845,
    comments: 42,
    shares: 15,
    avatar: null, // If null, uses defaultAvatar
    postImage: null,
    frame: 'none' // 'none' | 'hiring' | 'open'
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

  // Convert file to Base64 immediately to prevent CORS issues during capture
  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStats(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
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
        backgroundColor: theme === 'dark' ? '#1b1f23' : '#ffffff',
        scale: 2.5, // High quality
        useCORS: true,
        allowTaint: true, // Allow local base64 images
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `professional-update-${Date.now()}.png`;
      link.click();

    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save image. Ensure you are using a modern browser.");
    } finally {
      setIsCapturing(false);
    }
  };

  // --- RENDER HELPERS ---

  const renderRichText = (text) => {
    if (!text) return null;
    return text.split(/([\s\n]+)/).map((part, i) => {
      // Highlight hashtags and links in professional blue
      if (part.startsWith('#') || part.startsWith('http') || part.startsWith('www.')) {
        return <span key={i} className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL: CONTROL CENTER --- */}
      <div className="w-full md:w-[420px] border-r border-slate-300 flex flex-col bg-white z-20 h-screen shadow-xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <div className="bg-[#0a66c2] text-white p-1 rounded font-bold text-xs tracking-tighter">in</div>
             <span className="text-sm font-bold text-slate-700 tracking-wide">Post Generator</span>
          </div>
          <button 
            onClick={() => {
               setContent('');
               setStats(s => ({ ...s, postImage: null }));
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-32">
          
          {/* Theme Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex">
             <button 
               onClick={() => setTheme('light')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${theme === 'light' ? 'bg-white shadow-sm text-[#0a66c2]' : 'text-slate-500'}`}
             >
               <Sun size={14} /> Light
             </button>
             <button 
               onClick={() => setTheme('dark')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${theme === 'dark' ? 'bg-[#1b1f23] shadow-sm text-white' : 'text-slate-500'}`}
             >
               <Moon size={14} /> Dark
             </button>
          </div>

          <Divider />

          {/* Author Info */}
          <section className="space-y-4">
            <SectionLabel label="Identity" />
            
            <div className="flex gap-4">
               {/* Avatar */}
               <div className="flex flex-col gap-2 items-center">
                 <div className="w-16 h-16 relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                   <div className={`w-full h-full rounded-full overflow-hidden border-2 ${theme === 'dark' ? 'border-slate-700' : 'border-white'} shadow-sm relative`}>
                      <img src={stats.avatar || defaultAvatar} className="w-full h-full object-cover" alt="Avatar" />
                   </div>
                   
                   {/* Frames Overlay */}
                   {stats.frame === 'hiring' && (
                     <div className="absolute inset-0 pointer-events-none">
                       <svg viewBox="0 0 100 100" className="w-full h-full rotate-12 scale-110">
                         <path id="curve" d="M 20, 50 a 30,30 0 1,1 60,0" fill="transparent" />
                         <text width="100">
                           <textPath xlinkHref="#curve" fill="#702be6" textAnchor="middle" startOffset="50%" fontSize="16" fontWeight="bold">#HIRING</textPath>
                         </text>
                       </svg>
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
                 <InputGroup placeholder="Name" value={stats.name} onChange={(v) => updateStat('name', v)} />
                 <InputGroup placeholder="Headline" value={stats.headline} onChange={(v) => updateStat('headline', v)} />
                 <InputGroup placeholder="Time (e.g. 1w • Edited)" value={stats.time} onChange={(v) => updateStat('time', v)} />
               </div>
            </div>

            {/* Frame Selector */}
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateStat('frame', 'none')} className={`flex-1 py-1 text-xs border rounded ${stats.frame === 'none' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>No Frame</button>
              <button onClick={() => updateStat('frame', 'hiring')} className={`flex-1 py-1 text-xs border rounded ${stats.frame === 'hiring' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border-purple-200'}`}>#Hiring</button>
              <button onClick={() => updateStat('frame', 'open')} className={`flex-1 py-1 text-xs border rounded ${stats.frame === 'open' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border-green-200'}`}>#OpenToWork</button>
            </div>
          </section>

          <Divider />

          {/* Content */}
          <section className="space-y-3">
             <SectionLabel label="Post Content" />
             <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="What do you want to talk about?"
               className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] outline-none resize-none transition-all"
             />
             
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => postImageInputRef.current?.click()}
                 className="flex items-center gap-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-full transition-colors text-slate-600"
               >
                 <ImageIcon size={14} />
                 {stats.postImage ? 'Change Photo' : 'Add Photo'}
               </button>
               {stats.postImage && (
                 <button onClick={clearPostImage} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={14}/></button>
               )}
             </div>
             <input type="file" ref={postImageInputRef} onChange={(e) => handleImageUpload(e, 'postImage')} className="hidden" accept="image/*" />
          </section>

          <Divider />

          {/* Metrics */}
          <section className="space-y-3">
            <SectionLabel label="Engagement Numbers" />
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
            className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
          >
            {isCapturing ? 'Processing...' : <><Download size={16} /> Download Image</>}
          </button>
        </div>

      </div>

      {/* --- RIGHT PANEL: PREVIEW --- */}
      <div className={`flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8 transition-colors ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#f3f2ef]'}`}>
        
        {/* THE CARD */}
        <div 
          ref={cardRef}
          className={`w-full max-w-[555px] rounded-lg shadow-sm border transition-all ${
            theme === 'dark' 
              ? 'bg-[#1b1f23] border-[#373b3e] text-white' 
              : 'bg-white border-[#e0e0e0] text-[#191919]'
          }`}
        >
          
          {/* 1. Header */}
          <div className="pt-3 px-4 pb-2 flex gap-3 items-start mb-1">
            <div className="relative">
              <img 
                src={stats.avatar || defaultAvatar} 
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Profile Frames Rendered on Card */}
              {stats.frame === 'hiring' && (
                <div className="absolute -inset-1">
                  <svg viewBox="0 0 100 100" className="w-full h-full rotate-[15deg]">
                     <path id="curve-hiring" d="M 12, 50 a 38,38 0 1,1 76,0" fill="transparent" />
                     <text width="100">
                       <textPath xlinkHref="#curve-hiring" fill="#702be6" textAnchor="middle" startOffset="50%" fontSize="16px" fontWeight="800" letterSpacing="1px">#HIRING</textPath>
                     </text>
                  </svg>
                </div>
              )}
              {stats.frame === 'open' && (
                <div className="absolute -inset-1">
                   <svg viewBox="0 0 100 100" className="w-full h-full rotate-[15deg]">
                     <path id="curve-open" d="M 12, 50 a 38,38 0 1,1 76,0" fill="transparent" />
                     <text width="100">
                       <textPath xlinkHref="#curve-open" fill="#057642" textAnchor="middle" startOffset="50%" fontSize="12px" fontWeight="800">#OPENTOWORK</textPath>
                     </text>
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col pt-1">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                    <span className={`font-semibold text-[14px] leading-tight hover:text-[#0a66c2] cursor-pointer hover:underline ${theme === 'dark' ? 'text-white' : 'text-[#191919]'}`}>
                      {stats.name}
                    </span>
                    <span className={`text-[12px] leading-snug truncate mt-0.5 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-[#666666]'}`}>
                      {stats.headline}
                    </span>
                    <div className={`flex items-center gap-1 text-[12px] mt-0.5 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-[#666666]'}`}>
                      <span>{stats.time} • </span>
                      <div className="flex items-center gap-0.5">
                        <Globe size={11} className={theme === 'dark' ? 'text-[#a3a3a3]' : 'text-[#666666]'} />
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    {/* Follow Button usually appears here but removing for cleaner 'post' look */}
                    <button className={`p-1 rounded-full hover:bg-gray-100/10 ${theme === 'dark' ? 'text-white' : 'text-[#666666]'}`}>
                      <MoreHorizontal size={20} />
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* 2. Content */}
          <div className="px-4 pb-2">
            <div className={`text-[14px] whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-[#e1e9f1]' : 'text-[#191919]'}`}>
              {content ? renderRichText(content) : <span className="opacity-40 italic">Start typing your post...</span>}
            </div>
          </div>

          {/* 3. Image */}
          {stats.postImage && (
            <div className="mt-2 w-full">
              <img 
                src={stats.postImage} 
                alt="Post Content" 
                className="w-full h-auto object-cover block"
              />
            </div>
          )}

          {/* 4. Social Proof Line */}
          <div className={`mx-4 mt-2 py-2 flex items-center justify-between text-[12px] ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-[#666666]'}`}>
             <div className="flex items-center gap-1 hover:text-blue-500 hover:underline cursor-pointer">
                <div className="flex -space-x-1">
                   {/* Realistic Icon Stack */}
                   <div className="z-30 w-4 h-4 rounded-full bg-[#1485bd] flex items-center justify-center ring-2 ring-white">
                      <ThumbsUp size={8} className="text-white fill-white" />
                   </div>
                   <div className="z-20 w-4 h-4 rounded-full bg-[#d11124] flex items-center justify-center ring-2 ring-white">
                      <Heart size={8} className="text-white fill-white" />
                   </div>
                   <div className="z-10 w-4 h-4 rounded-full bg-[#6dae4f] flex items-center justify-center ring-2 ring-white">
                      <HandMetal size={8} className="text-white fill-white" />
                   </div>
                </div>
                <span className="ml-1">{stats.likes}</span>
             </div>
             
             <div className="flex gap-2">
               <span className="hover:text-blue-500 hover:underline cursor-pointer">{stats.comments} comments</span>
               <span>•</span>
               <span className="hover:text-blue-500 hover:underline cursor-pointer">{stats.shares} reposts</span>
             </div>
          </div>

          <div className={`mx-4 h-[1px] ${theme === 'dark' ? 'bg-[#373b3e]' : 'bg-[#e0e0e0]'}`}></div>

          {/* 5. Action Buttons */}
          <div className="px-1 py-1 flex items-center justify-between">
             <ActionButton icon={<ThumbsUp size={18} className="mb-1" />} label="Like" theme={theme} />
             <ActionButton icon={<MessageSquare size={18} className="mb-1" />} label="Comment" theme={theme} />
             <ActionButton icon={<RotateCcw size={18} className="mb-1" />} label="Repost" theme={theme} />
             <ActionButton icon={<Send size={18} className="mb-1" />} label="Send" theme={theme} />
          </div>

        </div>

      </div>
    </div>
  );
}

// --- COMPONENTS ---

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
      <span>{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-200 w-full" />;
}

function InputGroup({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] text-slate-500 font-bold uppercase">{label}</label>}
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-[#0a66c2] outline-none placeholder-slate-400"
      />
    </div>
  );
}

function ActionButton({ icon, label, theme }) {
  return (
    <button className={`flex items-center justify-center gap-2 px-2 py-3 rounded-md transition-colors text-sm font-semibold flex-1 ${
      theme === 'dark' 
        ? 'text-[#e1e9f1] hover:bg-[#373b3e]' 
        : 'text-[#5e5e5e] hover:bg-[#f3f3f3]'
    }`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}