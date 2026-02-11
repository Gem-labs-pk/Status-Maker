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
  Download,
  Camera
} from 'lucide-react';

export default function App() {
  const [content, setContent] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);
  const tweetCardRef = useRef(null);
  
  // Default Stats
  const [stats, setStats] = useState({
    name: 'Muzammil Mahmood',
    handle: '@muzammil',
    time: '',
    date: '',
    views: '1.4M',
    reposts: '12K',
    likes: '48K',
    bookmarks: '2.5K',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Muzammil',
    badgeColor: '#F91880' // Default Pink
  });

  // Set initial time/date to now
  useEffect(() => {
    resetTime();
  }, []);

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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setStats(prev => ({ ...prev, avatar: url }));
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleScreenshot = async () => {
    if (!tweetCardRef.current) return;
    setIsCapturing(true);

    try {
      // Dynamically load html2canvas if not present
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      const canvas = await window.html2canvas(tweetCardRef.current, {
        backgroundColor: '#000000',
        scale: 3, // High resolution
        useCORS: true, // Attempt to handle cross-origin images
        logging: false
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `tweet-studio-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-pink-500/30">
      
      {/* --- LEFT PANEL: CONTROL CENTER --- */}
      <div className="w-full md:w-[400px] border-r border-gray-800 flex flex-col bg-gray-950/80 backdrop-blur-md relative z-20 h-screen overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800/50 flex justify-between items-center bg-gray-950 sticky top-0 z-10">
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Tweet Studio Pro</span>
          <button onClick={resetTime} className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-bold uppercase tracking-wider">
             <RotateCcw size={10} /> Reset Time
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-24">
          
          {/* 1. Main Content Input */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Post Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-lg text-white placeholder-gray-600 outline-none resize-none font-medium leading-relaxed min-h-[120px] focus:border-pink-500/50 transition-colors"
              autoFocus
            />
          </div>

          <div className="h-px bg-gray-800/50 w-full" />

          {/* 2. Identity Configuration */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> Identity
            </h3>
            
            <div className="flex gap-4 items-start">
               {/* Avatar Upload */}
               <div className="flex flex-col gap-2 items-center">
                 <div className="relative group cursor-pointer" onClick={triggerFileUpload}>
                   <img src={stats.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-800 group-hover:border-pink-500 transition-colors" />
                   <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Upload size={16} className="text-white" />
                   </div>
                 </div>
                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Change Photo</span>
                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
               </div>

               {/* Name & Handle */}
               <div className="flex-1 space-y-3">
                 <InputGroup label="Display Name" value={stats.name} onChange={(v) => updateStat('name', v)} />
                 <InputGroup label="Handle" value={stats.handle} onChange={(v) => updateStat('handle', v)} />
               </div>
            </div>

            {/* Verification Badge */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Verification Badge</label>
              <div className="grid grid-cols-3 gap-2">
                <BadgeOption color="#F91880" label="Pink" active={stats.badgeColor === '#F91880'} onClick={() => updateStat('badgeColor', '#F91880')} />
                <BadgeOption color="#1D9BF0" label="Blue" active={stats.badgeColor === '#1D9BF0'} onClick={() => updateStat('badgeColor', '#1D9BF0')} />
                <BadgeOption color="#E7B416" label="Gold" active={stats.badgeColor === '#E7B416'} onClick={() => updateStat('badgeColor', '#E7B416')} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-800/50 w-full" />

          {/* 3. Metrics & Data */}
          <div className="space-y-4">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <BarChart2 size={12} /> Engagement Stats
             </h3>
             <div className="grid grid-cols-2 gap-3">
               <InputGroup label="Views" value={stats.views} onChange={(v) => updateStat('views', v)} icon={<Eye size={10} />} />
               <InputGroup label="Likes" value={stats.likes} onChange={(v) => updateStat('likes', v)} icon={<Heart size={10} />} />
               <InputGroup label="Reposts" value={stats.reposts} onChange={(v) => updateStat('reposts', v)} icon={<Repeat size={10} />} />
               <InputGroup label="Bookmarks" value={stats.bookmarks} onChange={(v) => updateStat('bookmarks', v)} icon={<Bookmark size={10} />} />
             </div>
          </div>

          <div className="h-px bg-gray-800/50 w-full" />

           {/* 4. Timestamp */}
           <div className="space-y-4 pb-4">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <Clock size={12} /> Time & Date
             </h3>
             <div className="grid grid-cols-2 gap-3">
               <InputGroup label="Time" value={stats.time} onChange={(v) => updateStat('time', v)} icon={<Clock size={10} />} />
               <InputGroup label="Date" value={stats.date} onChange={(v) => updateStat('date', v)} icon={<Calendar size={10} />} />
             </div>
          </div>
        </div>

        {/* Screenshot Button Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-20">
          <button 
            onClick={handleScreenshot}
            disabled={isCapturing}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCapturing ? (
              <span className="animate-pulse">Capturing...</span>
            ) : (
              <>
                <Camera size={20} />
                Save Screenshot
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW CANVAS --- */}
      <div className="flex-1 bg-black flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
        
        {/* Studio Lighting Effect - PINK VIBE */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-black to-black pointer-events-none"></div>

        {/* --- THE POST CARD --- */}
        <div 
          ref={tweetCardRef}
          className="w-full max-w-[600px] bg-black border border-pink-500/30 rounded-none md:rounded-2xl p-6 md:p-8 relative z-10 shadow-2xl shadow-pink-900/10"
        >
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <img 
                src={stats.avatar} 
                alt="Profile" 
                className="w-12 h-12 rounded-full bg-gray-800 border border-gray-900 object-cover"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 group cursor-pointer">
                  <span className="font-bold text-[15px] text-white leading-none">{stats.name}</span>
                  <BadgeCheck size={18} color={stats.badgeColor} fill={`${stats.badgeColor}20`} />
                </div>
                <span className="text-[#71767B] text-[15px] leading-tight">{stats.handle}</span>
              </div>
            </div>
            <div className="text-[#71767B] cursor-pointer hover:text-pink-500 transition">
               <MoreHorizontal size={20} />
            </div>
          </div>

          {/* Body Content */}
          <div className="my-5">
            <p className="text-[23px] leading-8 text-[#E7E9EA] whitespace-pre-wrap font-normal tracking-wide">
              {content || "Start typing in the editor to create your post..."}
            </p>
          </div>

          {/* Metadata */}
          <div className="mt-4 mb-4 pb-4 border-b border-[#2F3336]">
             <div className="flex items-center gap-1 text-[#71767B] text-[15px] font-normal hover:underline cursor-pointer">
                <span>{stats.time}</span>
                <span>·</span>
                <span>{stats.date}</span>
                <span>·</span>
                <span className="text-white font-semibold">{stats.views}</span>
                <span>Views</span>
             </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center text-[#71767B] px-1 h-6">
            <ActionIcon icon={<MessageCircle size={20} />} count="24" color="text-[#F91880]" hoverBg="group-hover:bg-[#F91880]/10" />
            <ActionIcon icon={<Repeat size={20} />} count={stats.reposts} color="text-[#00BA7C]" hoverBg="group-hover:bg-[#00BA7C]/10" />
            <ActionIcon icon={<Heart size={20} />} count={stats.likes} color="text-[#F91880]" hoverBg="group-hover:bg-[#F91880]/10" />
            <ActionIcon icon={<Bookmark size={20} />} count={stats.bookmarks} color="text-[#F91880]" hoverBg="group-hover:bg-[#F91880]/10" />
            <div className="p-2 -mr-2 hover:bg-[#F91880]/10 hover:text-[#F91880] rounded-full transition cursor-pointer">
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
        className="bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-pink-500 focus:bg-gray-800 outline-none transition-all font-mono"
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
      <BadgeCheck size={14} color={color} fill={`${color}20`} />
      <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

function ActionIcon({ icon, count, color, hoverBg }) {
  return (
    <div className={`flex items-center gap-2 group cursor-pointer transition-colors ${color.replace('text-', 'hover:text-')}`}>
      <div className={`p-2 -ml-2 rounded-full transition ${hoverBg} group-hover:text-current`}>
        {icon}
      </div>
      <span className={`text-[13px] transition group-hover:text-current`}>{count}</span>
    </div>
  );
}