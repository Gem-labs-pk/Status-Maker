import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Repeat, 
  MoreHorizontal, 
  Bookmark,
  Send, 
  ThumbsUp, 
  Globe, 
  Clock,
  MapPin,
  Image as ImageIcon,
  User,
  RotateCcw,
  Download,
  Trash2,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layout,
  Type
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [step, setStep] = useState('template'); // 'template' | 'editor'
  const [template, setTemplate] = useState('twitter'); // 'twitter' | 'linkedin' | 'instagram'
  const [theme, setTheme] = useState('light');
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Refs
  const avatarInputRef = useRef(null);
  const postImageInputRef = useRef(null);
  const cardRef = useRef(null);
  
  // Default Base64 Avatar (Safe for export)
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e2e8f0'%3E%3Ccircle cx='12' cy='12' r='12'/%3E%3Cpath d='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/%3E%3C/svg%3E";

  // Unified Stats State
  const [stats, setStats] = useState({
    name: 'Alex Morgan',
    handle: '@alexmorgan', // Twitter/Insta
    headline: 'Product Designer', // LinkedIn
    location: 'San Francisco, CA', // Insta
    time: '2h',
    content: 'Just shipped a huge update! 🚀 The team has been working hard on this one. #design #shipping',
    likes: '1,240',
    comments: '48',
    shares: '22',
    avatar: null, 
    postImage: null,
    isVerified: true
  });

  // --- ACTIONS ---

  const handleTemplateSelect = (selected) => {
    setTemplate(selected);
    setStep('editor');
    // Set default themes based on platform vibe
    if (selected === 'twitter') setTheme('dark');
    else setTheme('light');
  };

  const updateStat = (key, value) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

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
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
           const script = document.createElement('script');
           // Use reliable CDN
           script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
           script.onload = resolve;
           script.onerror = reject;
           document.head.appendChild(script);
        });
      }
      
      // Delay for render stability
      await new Promise(r => setTimeout(r, 500));

      const canvas = await window.html2canvas(cardRef.current, {
        backgroundColor: null, // Transparent background so border radius works
        scale: 3, 
        useCORS: true, // Enable Cross-Origin Resource Sharing
        logging: false,
        allowTaint: false, // Important: Must be false to allow data URL export
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${template}-post-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save image. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  // --- RENDERERS ---

  if (step === 'template') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
              Created by Muzzamil Mahmood and Saqib Zahid
            </p>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose a Template</h1>
            <p className="text-slate-500">Select a social media style to start creating your post</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Twitter Card */}
            <TemplateOption 
              title="X / Twitter" 
              icon={<MessageCircle className="text-blue-400" />} 
              desc="Short updates, threads, and news."
              onClick={() => handleTemplateSelect('twitter')}
              color="hover:border-blue-400 hover:shadow-blue-100"
            />
            {/* LinkedIn Card */}
            <TemplateOption 
              title="LinkedIn" 
              icon={<BriefcaseIcon />} 
              desc="Professional updates and networking."
              onClick={() => handleTemplateSelect('linkedin')}
              color="hover:border-blue-700 hover:shadow-blue-100"
            />
            {/* Instagram Card */}
            <TemplateOption 
              title="Instagram" 
              icon={<CameraIcon />} 
              desc="Visual stories and lifestyle."
              onClick={() => handleTemplateSelect('instagram')}
              color="hover:border-pink-500 hover:shadow-pink-100"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL: WIZARD --- */}
      <div className="w-full md:w-[400px] border-r border-slate-200 flex flex-col bg-white z-20 h-screen shadow-xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <button onClick={() => setStep('template')} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <ArrowLeft size={18} />
             </button>
             <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{template} Editor</span>
          </div>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
             {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Inputs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
          
          {/* Section 1: Identity */}
          <section className="space-y-4">
            <SectionLabel label="1. Identity" icon={<User size={14}/>} />
            <div className="flex gap-4">
               <div className="flex flex-col gap-2 items-center">
                 <div className="w-16 h-16 relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                   <img src={stats.avatar || defaultAvatar} className="w-full h-full rounded-full object-cover border-2 border-slate-200" alt="Avatar" crossOrigin="anonymous" />
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                     <Upload size={16} className="text-white" />
                   </div>
                 </div>
                 <input type="file" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} className="hidden" accept="image/*" />
               </div>

               <div className="flex-1 space-y-3">
                 <InputGroup placeholder="Name" value={stats.name} onChange={(v) => updateStat('name', v)} />
                 
                 {/* Dynamic Fields based on Template */}
                 {template === 'linkedin' && (
                    <InputGroup placeholder="Headline (e.g. Product Designer)" value={stats.headline} onChange={(v) => updateStat('headline', v)} />
                 )}
                 {(template === 'twitter' || template === 'instagram') && (
                    <InputGroup placeholder="Handle (e.g. @alex)" value={stats.handle} onChange={(v) => updateStat('handle', v)} />
                 )}
                 {template === 'instagram' && (
                    <InputGroup placeholder="Location" value={stats.location} onChange={(v) => updateStat('location', v)} icon={<MapPin size={12}/>} />
                 )}
               </div>
            </div>
            
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => updateStat('isVerified', !stats.isVerified)}>
               <div className={`w-4 h-4 border rounded flex items-center justify-center ${stats.isVerified ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                 {stats.isVerified && <CheckCircle2 size={12} className="text-white" />}
               </div>
               <span className="text-xs text-slate-500">Verified Badge</span>
            </div>
          </section>

          <Divider />

          {/* Section 2: Content */}
          <section className="space-y-4">
             <SectionLabel label="2. Content" icon={<Type size={14}/>} />
             
             {template !== 'instagram' && (
               <InputGroup placeholder="Time (e.g. 2h)" value={stats.time} onChange={(v) => updateStat('time', v)} icon={<Clock size={12}/>} />
             )}

             <textarea 
               value={stats.content}
               onChange={(e) => updateStat('content', e.target.value)}
               placeholder="Write your caption or status..."
               className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"
             />
             
             <div className="flex items-center gap-2">
               <button onClick={() => postImageInputRef.current?.click()} className="flex items-center gap-2 text-xs font-semibold bg-white border border-slate-300 px-3 py-2 rounded-lg text-slate-600">
                 <ImageIcon size={14} /> {stats.postImage ? 'Change Image' : 'Add Image'}
               </button>
               {stats.postImage && (
                 <button onClick={clearPostImage} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
               )}
             </div>
             <input type="file" ref={postImageInputRef} onChange={(e) => handleImageUpload(e, 'postImage')} className="hidden" accept="image/*" />
          </section>

          <Divider />

          {/* Section 3: Engagement */}
          <section className="space-y-4">
            <SectionLabel label="3. Engagement" icon={<Layout size={14}/>} />
            <div className="grid grid-cols-3 gap-3">
               <InputGroup label="Likes" value={stats.likes} onChange={(v) => updateStat('likes', v)} />
               <InputGroup label="Comments" value={stats.comments} onChange={(v) => updateStat('comments', v)} />
               {template !== 'instagram' && (
                 <InputGroup label="Shares/Reposts" value={stats.shares} onChange={(v) => updateStat('shares', v)} />
               )}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <button 
            onClick={handleSave}
            disabled={isCapturing}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
          >
            {isCapturing ? 'Saving...' : <><Download size={18} /> Download Image</>}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW --- */}
      <div className={`flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#eef0f4]'}`}>
        
        {/* Render Specific Card based on Template */}
        <div ref={cardRef} className="shadow-2xl rounded-xl overflow-hidden transition-all duration-300">
          
          {template === 'twitter' && (
             <TwitterCard stats={stats} theme={theme} defaultAvatar={defaultAvatar} />
          )}

          {template === 'linkedin' && (
             <LinkedInCard stats={stats} theme={theme} defaultAvatar={defaultAvatar} />
          )}

          {template === 'instagram' && (
             <InstagramCard stats={stats} theme={theme} defaultAvatar={defaultAvatar} />
          )}

        </div>

      </div>
    </div>
  );
}

// ==========================================
// TEMPLATE COMPONENT: TWITTER / X
// ==========================================
function TwitterCard({ stats, theme, defaultAvatar }) {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-black' : 'bg-white';
  const text = isDark ? 'text-white' : 'text-black';
  const subtext = isDark ? 'text-[#71767B]' : 'text-[#536471]';
  const border = isDark ? 'border-[#2F3336]' : 'border-[#EFF3F4]';

  return (
    <div className={`w-[500px] ${bg} ${text} p-4 font-sans`}>
      <div className="flex gap-3">
        <img src={stats.avatar || defaultAvatar} className="w-10 h-10 rounded-full object-cover" crossOrigin="anonymous" />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px]">{stats.name}</span>
            {stats.isVerified && <CheckCircle2 size={16} className="text-[#1d9bf0] fill-[#1d9bf0]/10" />}
            <span className={`${subtext} text-[15px]`}>{stats.handle} · {stats.time}</span>
          </div>
          <div className="mt-1 text-[15px] whitespace-pre-wrap leading-6">
            <RichText text={stats.content} color="text-[#1d9bf0]" />
          </div>
          {stats.postImage && (
            <div className={`mt-3 rounded-2xl overflow-hidden border ${border}`}>
              <img src={stats.postImage} className="w-full h-auto object-cover" crossOrigin="anonymous" />
            </div>
          )}
          
          {/* Action Bar */}
          <div className={`flex justify-between mt-3 max-w-[400px] ${subtext}`}>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0]">
              <MessageCircle size={18} /> <span className="text-xs">{stats.comments}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#00ba7c]">
              <Repeat size={18} /> <span className="text-xs">{stats.shares}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#f91880]">
              <Heart size={18} /> <span className="text-xs">{stats.likes}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0]">
              <Share size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TEMPLATE COMPONENT: LINKEDIN
// ==========================================
function LinkedInCard({ stats, theme, defaultAvatar }) {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-[#1b1f23]' : 'bg-white';
  const text = isDark ? 'text-white' : 'text-[#191919]';
  const subtext = isDark ? 'text-[#a3a3a3]' : 'text-[#666666]';
  
  return (
    <div className={`w-[500px] ${bg} ${text} rounded-lg overflow-hidden font-sans border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="p-3 flex gap-3 mb-1">
        <img src={stats.avatar || defaultAvatar} className="w-12 h-12 rounded-full object-cover" crossOrigin="anonymous" />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{stats.name}</span>
            {stats.isVerified && <CheckCircle2 size={14} className="text-[#a3a3a3]" />}
          </div>
          <span className={`text-xs ${subtext} truncate w-64`}>{stats.headline}</span>
          <div className={`flex items-center gap-1 text-xs ${subtext}`}>
            <span>{stats.time} • </span> <Globe size={10} />
          </div>
        </div>
        <div className={`ml-auto ${subtext}`}><MoreHorizontal size={20} /></div>
      </div>

      <div className="px-3 pb-3 text-sm whitespace-pre-wrap">
         <RichText text={stats.content} color="text-[#0a66c2]" />
      </div>

      {stats.postImage && (
        <img src={stats.postImage} className="w-full h-auto object-cover" crossOrigin="anonymous" />
      )}

      <div className={`mx-3 py-2 flex items-center justify-between text-xs ${subtext} border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center gap-1">
           <ThumbsUp size={10} className="fill-[#1485bd] text-[#1485bd]" />
           <Heart size={10} className="fill-[#d11124] text-[#d11124]" />
           <span className="ml-1 hover:text-blue-500 hover:underline">{stats.likes}</span>
        </div>
        <div className="hover:text-blue-500 hover:underline">{stats.comments} comments • {stats.shares} reposts</div>
      </div>

      <div className={`px-2 py-1 flex items-center justify-between ${subtext}`}>
        {[{i:ThumbsUp, l:'Like'}, {i:MessageCircle, l:'Comment'}, {i:RotateCcw, l:'Repost'}, {i:Send, l:'Send'}].map((Btn, idx) => (
           <button key={idx} className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 hover:bg-gray-100/10 rounded-md font-semibold text-sm">
             <Btn.i size={18} /> <span className="hidden sm:inline">{Btn.l}</span>
           </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// TEMPLATE COMPONENT: INSTAGRAM
// ==========================================
function InstagramCard({ stats, theme, defaultAvatar }) {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-black' : 'bg-white';
  const text = isDark ? 'text-white' : 'text-[#262626]';
  const link = isDark ? 'text-[#E0F1FF]' : 'text-[#00376B]';

  return (
    <div className={`w-[450px] ${bg} ${text} font-sans border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={stats.avatar || defaultAvatar} className="w-8 h-8 rounded-full object-cover border border-gray-100/10" crossOrigin="anonymous" />
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">{stats.handle.replace('@','')}</span>
              {stats.isVerified && <CheckCircle2 size={12} className="text-[#0095f6] fill-[#0095f6]/10" />}
            </div>
            {stats.location && <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stats.location}</span>}
          </div>
        </div>
        <MoreHorizontal size={20} />
      </div>

      {/* Insta Image is usually square or 4:5, but we allow auto height */}
      <div className="bg-gray-100 flex items-center justify-center overflow-hidden min-h-[300px]">
        {stats.postImage ? (
           <img src={stats.postImage} className="w-full h-auto object-cover" crossOrigin="anonymous" />
        ) : (
           <div className="text-gray-400 text-sm">No image selected</div>
        )}
      </div>

      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4">
             <Heart size={24} className="hover:text-gray-500 cursor-pointer" />
             <MessageCircle size={24} className="hover:text-gray-500 cursor-pointer -rotate-90" />
             <Send size={24} className="hover:text-gray-500 cursor-pointer" />
          </div>
          <Bookmark size={24} className="hover:text-gray-500 cursor-pointer" />
        </div>
        
        <div className="font-semibold text-sm mb-1">{stats.likes} likes</div>
        <div className="text-sm">
          <span className="font-semibold mr-2">{stats.handle.replace('@','')}</span>
          <RichText text={stats.content} color={link} />
        </div>
        <div className={`text-[10px] uppercase mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>2 HOURS AGO</div>
      </div>
    </div>
  );
}

// --- SHARED SUB-COMPONENTS ---

function RichText({ text, color }) {
  if (!text) return null;
  return text.split(/([\s\n]+)/).map((part, i) => {
    if (part.startsWith('#') || part.startsWith('@') || part.startsWith('http')) {
      return <span key={i} className={`${color} cursor-pointer hover:underline`}>{part}</span>;
    }
    return part;
  });
}

function TemplateOption({ title, icon, desc, onClick, color }) {
  return (
    <button 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border border-slate-200 text-left transition-all hover:scale-[1.02] ${color} group shadow-sm`}
    >
      <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-white border border-slate-100 transition-colors">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </button>
  );
}

function SectionLabel({ label, icon }) {
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
          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none placeholder-slate-400 transition-all pl-3"
          style={icon ? { paddingLeft: '32px' } : {}}
        />
        {icon && <span className="absolute left-2.5 top-2.5 text-slate-400">{icon}</span>}
      </div>
    </div>
  );
}

// Icons placeholders for Template selection
function BriefcaseIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function CameraIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="12" cy="12" r="4"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>; }