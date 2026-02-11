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
  Hash,
  Clock,
  Calendar,
  Eye,
  BarChart2,
  Camera,
  Trash2,
  Sun,
  Moon,
  Type
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
    name: 'Name',
    handle: '@username',
    time: '',
    date: '',
    views: '1.2M',
    reposts: '1.4K',
    likes: '8.5K',
    bookmarks: '420',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
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
        useCORS: true,
        logging: false
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `post-${Date.now()}.png`;
      link.click();

    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save image. Please check console for details.");
    } finally {
      setIsCapturing(false);
    }
  };

  // --- RENDER HELPERS ---

  // Rich Text Parser for #hashtags and @mentions
  const renderRichText = (text) => {
    if (!text) return null;
    // Split by space or newline, preserving the delimiters
    const parts = text.split(/([\s\n]+)/);
    return parts.map((part, i) => {
      if (part.match(/^@[a-zA-Z0-9_]+/) || part.match(/^#[a-zA-Z0-9_]+/)) {
        return <span key={i} className="text-[#1D9BF0]">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL: CONTROL CENTER --- */}
      <div className="w-full md:w-[420px] border-r border-gray-800 flex flex-col bg-gray-950 relative z-20 h-screen overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-gray-950 sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
             <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">Status Maker</span>
          </div>
          <button onClick={resetTime} className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-bold uppercase tracking-wider transition-colors">
             <RotateCcw size={10} /> Reset Time
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
          
          {/* 1. Appearance (Theme) */}
          <div className="space-y-3">
             <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                <Sun size={12} /> Appearance
             </h3>
             <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${theme === 'dark' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Moon size={14} /> Dark
                </button>
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${theme === 'light' ? 'bg-gray-200 text-black shadow' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Sun size={14} /> Light
                </button>
             </div>
          </div>

          <div className="h-px bg-gray-800/50 w-full" />

          {/* 2. Main Content Input */}
          <div className="space-y-3">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
              <Type size={12} /> Post Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-base text-white placeholder-gray-600 outline-none resize-none font-medium leading-relaxed min-h-[120px] focus:border-pink-500/50 transition-colors"
            />
            
            {/* Post Image Attachment Control */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => postImageInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded transition-colors text-gray-300 border border-gray-700 hover:border-gray-600"
              >
                <ImageIcon size={14} />
                {stats.postImage ? 'Replace Image' : 'Attach Media'}
              </button>
              <input 
                type="file" 
                ref={postImageInputRef} 
                onChange={(e) => handleImageUpload(e, 'postImage')} 
                className="hidden" 
                accept="image/*" 
              />
              
              {stats.postImage && (
                <button 
                  onClick={clearPostImage}
                  className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 rounded hover:bg-red-400/20 transition-colors border border-transparent hover:border-red-400/20"
                  title="Remove Image"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            
            {/* Image Preview Tiny */}
            {stats.postImage && (
               <div className="w-full h-16 rounded-md bg-gray-900 border border-gray-800 overflow-hidden relative">
                  <img src={stats.postImage} alt="Attachment Preview" className="w-full h-full object-cover opacity-60" />
               </div>
            )}
          </div>

          <div className="h-px bg-gray-800/50 w-full" />

          {/* 3. Identity Configuration */}
          <div className="space-y-4">
            <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
              <User size={12} /> Identity
            </h3>
            
            <div className="flex gap-4 items-start">
               {/* Avatar Upload */}
               <div className="flex flex-col gap-2 items-center">
                 <div className="relative group cursor-pointer w-14 h-14" onClick={() => avatarInputRef.current?.click()}>
                   <img src={stats.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-gray-800 group-hover:border-pink-500 transition-colors" />
                   <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Upload size={14} className="text-white" />
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

            {/* Verification Badge Toggle & Color */}
            <div className="bg-gray-900/30 p-3 rounded-lg border border-gray-800 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Badge</label>
                
                {/* Toggle Switch */}
                <button 
                  onClick={() => updateStat('isVerified', !stats.isVerified)}
                  className={`w-9 h-5 rounded-full transition-all relative ${stats.isVerified ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${stats.isVerified ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
              
              {stats.isVerified && (
                <div className="grid grid-cols-3 gap-2">
                  <BadgeOption color="#1D9BF0" label="Blue" active={stats.badgeColor === '#1D9BF0'} onClick={() => updateStat('badgeColor', '#1D9BF0')} />
                  <BadgeOption color="#E7B416" label="Gold" active={stats.badgeColor === '#E7B416'} onClick={() => updateStat('badgeColor', '#E7B416')} />
                  <BadgeOption color="#F91880" label="Pink" active={stats.badgeColor === '#F91880'} onClick={() => updateStat('badgeColor', '#F91880')} />
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-800/50 w-full" />

          {/* 4. Metrics & Data */}
          <div className="space-y-4">
             <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
               <BarChart2 size={12} /> Engagement Metrics
             </h3>
             <div className="grid grid-cols-2 gap-3">
               <InputGroup label="Views" value={stats.views} onChange={(v) => updateStat('views', v)} icon={<Eye size={10} />} />
               <InputGroup label="Likes" value={stats.likes} onChange={(v) => updateStat('likes', v)} icon={<Heart size={10} />} />
               <InputGroup label="Reposts" value={stats.reposts} onChange={(v) => updateStat('reposts', v)} icon={<Repeat size={10} />} />
               <InputGroup label="Bookmarks" value={stats.bookmarks} onChange={(v) => updateStat('bookmarks', v)} icon={<Bookmark size={10} />} />
             </div>
          </div>

          <div className="h-px bg-gray-800/50 w-full" />

           {/* 5. Timestamp */}
           <div className="space-y-4 pb-4">
             <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
               <Clock size={12} /> Time & Date
             </h3>
             <div className="grid grid-cols-2 gap-3">
               <InputGroup label="Time" value={stats.time} onChange={(v) => updateStat('time', v)} icon={<Clock size={10} />} />
               <InputGroup label="Date" value={stats.date} onChange={(v) => updateStat('date', v)} icon={<Calendar size={10} />} />
             </div>
          </div>
        </div>

        {/* SAVE Button Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-20">
          <button 
            onClick={handleSave}
            disabled={isCapturing}
            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCapturing ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Camera size={20} />
                Save Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW CANVAS --- */}
      <div className={`flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
        
        {/* Background Ambience */}
        {theme === 'dark' ? (
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black pointer-events-none"></div>
        ) : (
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-gray-100 to-gray-200 pointer-events-none opacity-50"></div>
        )}

        {/* --- THE POST CARD --- */}
        <div 
          ref={tweetCardRef}
          className={`w-full max-w-[600px] rounded-none md:rounded-2xl p-6 md:p-8 relative z-10 transition-colors duration-300 shadow-2xl ${
             theme === 'dark' 
                ? 'bg-black border border-gray-800 text-white shadow-black/50' 
                : 'bg-white border border-gray-100 text-black shadow-gray-200'
          }`}
        >
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <img 
                src={stats.avatar} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 group cursor-pointer">
                  <span className={`font-bold text-[15px] leading-none ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {stats.name}
                  </span>
                  {stats.isVerified && (
                     <BadgeCheck size={18} color={stats.badgeColor} fill={stats.badgeColor} className="text-white" />
                  )}
                </div>
                <span className="text-[15px] leading-tight opacity-60">{stats.handle}</span>
              </div>
            </div>
            <div className={`cursor-pointer transition ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}>
               <MoreHorizontal size={20} />
            </div>
          </div>

          {/* Body Content */}
          <div className="my-5 space-y-3">
            {/* Text Content with Rich Text Logic */}
            {(content || (!content && !stats.postImage)) && (
               <p className={`text-[23px] leading-8 whitespace-pre-wrap font-normal tracking-wide break-words ${!content ? 'opacity-30 italic' : ''}`}>
                 {content ? renderRichText(content) : "What is happening?!"}
               </p>
            )}
            
            {/* Render Attached Image */}
            {stats.postImage && (
              <div className={`rounded-2xl overflow-hidden border mt-3 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                <img src={stats.postImage} alt="Post Attachment" className="w-full h-auto max-h-[500px] object-cover" />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className={`mt-4 mb-4 pb-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
             <div className="flex items-center gap-1 text-[15px] font-normal opacity-60 hover:underline cursor-pointer">
                <span>{stats.time}</span>
                <span>·</span>
                <span>{stats.date}</span>
                <span>·</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{stats.views}</span>
                <span>Views</span>
             </div>
          </div>

          {/* Actions */}
          <div className={`flex justify-between items-center px-1 h-6 opacity-60 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <ActionIcon icon={<MessageCircle size={20} />} count="24" color="hover:text-[#1D9BF0]" hoverBg="group-hover:bg-[#1D9BF0]/10" />
            <ActionIcon icon={<Repeat size={20} />} count={stats.reposts} color="hover:text-[#00BA7C]" hoverBg="group-hover:bg-[#00BA7C]/10" />
            <ActionIcon icon={<Heart size={20} />} count={stats.likes} color="hover:text-[#F91880]" hoverBg="group-hover:bg-[#F91880]/10" />
            <ActionIcon icon={<Bookmark size={20} />} count={stats.bookmarks} color="hover:text-[#1D9BF0]" hoverBg="group-hover:bg-[#1D9BF0]/10" />
            <div className="p-2 -mr-2 hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] rounded-full transition cursor-pointer">
              <Share size={20} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function InputGroup({ label, value, onChange, icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</label>
        {icon && <span className="text-gray-600">{icon}</span>}
      </div>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-pink-500 focus:bg-gray-800 outline-none transition-all font-mono placeholder-gray-600"
      />
    </div>
  );
}

function BadgeOption({ color, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-1 py-2 rounded border transition ${active ? 'bg-gray-800 border-gray-600 shadow-sm' : 'bg-transparent border-gray-800 hover:border-gray-700'}`}
    >
      <BadgeCheck size={14} color={color} fill={color} className="text-white" />
      <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

function ActionIcon({ icon, count, color, hoverBg }) {
  return (
    <div className={`flex items-center gap-2 group cursor-pointer transition-colors ${color}`}>
      <div className={`p-2 -ml-2 rounded-full transition ${hoverBg} group-hover:text-current`}>
        {icon}
      </div>
      <span className={`text-[13px] transition group-hover:text-current`}>{count}</span>
    </div>
  );
}