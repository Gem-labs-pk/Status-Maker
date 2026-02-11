import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Repeat, 
  Heart, 
  Share, 
  MoreHorizontal, 
  BadgeCheck,
  Bookmark,
  Settings2,
  X,
  RotateCcw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  const [content, setContent] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);
  
  // Default Stats
  const [stats, setStats] = useState({
    time: '',
    date: '',
    views: '1.4M',
    reposts: '12K',
    likes: '48K',
    bookmarks: '2.5K',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Muzammil',
    badgeColor: '#1D9BF0' // Default Blue
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

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-[#1D9BF0]/30">
      
      {/* --- LEFT PANEL: EDITOR --- */}
      <div className="w-full md:w-[400px] border-r border-gray-800 flex flex-col bg-gray-950/80 backdrop-blur-md relative z-20">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800/50">
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Editor</span>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition text-xs font-bold ${showSettings ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <Settings2 size={14} />
            {showSettings ? 'CLOSE SETTINGS' : 'PRO SETTINGS'}
          </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 p-6 flex flex-col">
           <textarea
             value={content}
             onChange={(e) => setContent(e.target.value)}
             placeholder="What is happening?!"
             className="flex-1 w-full bg-transparent text-xl text-white placeholder-gray-600 outline-none resize-none font-medium leading-relaxed"
             autoFocus
           />
        </div>

        {/* Settings Drawer (Animated) */}
        <div className={`border-t border-gray-800 bg-gray-900/95 overflow-hidden transition-all duration-300 ease-in-out ${showSettings ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="p-6 space-y-6 overflow-y-auto max-h-[500px]">
             
             {/* Header */}
             <div className="flex justify-between items-center">
               <span className="text-xs font-bold text-gray-500 uppercase">Configuration</span>
               <button onClick={resetTime} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
                 <RotateCcw size={12} /> Reset Time
               </button>
             </div>
             
             {/* Profile Image Upload */}
             <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Profile Photo</label>
                <div className="flex gap-3 items-center">
                  <img src={stats.avatar} alt="Current" className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <button 
                    onClick={triggerFileUpload}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2.5 px-4 rounded border border-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <Upload size={14} />
                    UPLOAD PHOTO
                  </button>
                </div>
             </div>

             {/* Verified Badge Selector */}
             <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Verified Badge</label>
                <div className="grid grid-cols-3 gap-2">
                  <BadgeOption color="#1D9BF0" label="Blue" active={stats.badgeColor === '#1D9BF0'} onClick={() => updateStat('badgeColor', '#1D9BF0')} />
                  <BadgeOption color="#E7B416" label="Gold" active={stats.badgeColor === '#E7B416'} onClick={() => updateStat('badgeColor', '#E7B416')} />
                  <BadgeOption color="#829aab" label="Grey" active={stats.badgeColor === '#829aab'} onClick={() => updateStat('badgeColor', '#829aab')} />
                </div>
             </div>
             
             {/* Stats Grid */}
             <div className="grid grid-cols-2 gap-4">
               <InputGroup label="Views" value={stats.views} onChange={(v) => updateStat('views', v)} />
               <InputGroup label="Likes" value={stats.likes} onChange={(v) => updateStat('likes', v)} />
               <InputGroup label="Reposts" value={stats.reposts} onChange={(v) => updateStat('reposts', v)} />
               <InputGroup label="Bookmarks" value={stats.bookmarks} onChange={(v) => updateStat('bookmarks', v)} />
               <InputGroup label="Time" value={stats.time} onChange={(v) => updateStat('time', v)} />
               <InputGroup label="Date" value={stats.date} onChange={(v) => updateStat('date', v)} />
             </div>

           </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW CANVAS --- */}
      <div className="flex-1 bg-black flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
        
        {/* Studio Lighting Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black pointer-events-none"></div>

        {/* --- THE POST CARD --- */}
        <div className="w-full max-w-[600px] bg-black border border-gray-800 rounded-none md:rounded-2xl p-6 md:p-8 relative z-10 shadow-2xl">
          
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
                  <span className="font-bold text-[15px] text-white leading-none">Muzammil Mahmood</span>
                  <BadgeCheck size={18} color={stats.badgeColor} fill={`${stats.badgeColor}20`} />
                </div>
                <span className="text-[#71767B] text-[15px] leading-tight">@muzammil</span>
              </div>
            </div>
            <div className="text-[#71767B] cursor-pointer hover:text-[#1D9BF0] transition">
               <MoreHorizontal size={20} />
            </div>
          </div>

          {/* Body Content */}
          <div className="my-5">
            <p className="text-[23px] leading-8 text-[#E7E9EA] whitespace-pre-wrap font-normal tracking-wide">
              {content || "Start typing on the left to create your post..."}
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
            <ActionIcon icon={<MessageCircle size={20} />} count="24" color="text-[#1D9BF0]" hoverBg="group-hover:bg-[#1D9BF0]/10" />
            <ActionIcon icon={<Repeat size={20} />} count={stats.reposts} color="text-[#00BA7C]" hoverBg="group-hover:bg-[#00BA7C]/10" />
            <ActionIcon icon={<Heart size={20} />} count={stats.likes} color="text-[#F91880]" hoverBg="group-hover:bg-[#F91880]/10" />
            <ActionIcon icon={<Bookmark size={20} />} count={stats.bookmarks} color="text-[#1D9BF0]" hoverBg="group-hover:bg-[#1D9BF0]/10" />
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

function InputGroup({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:bg-gray-800 outline-none transition-all font-mono"
      />
    </div>
  );
}

function BadgeOption({ color, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-1 py-1.5 rounded border transition ${active ? 'bg-gray-800 border-gray-600' : 'bg-transparent border-gray-800 hover:border-gray-700'}`}
    >
      <BadgeCheck size={14} color={color} fill={`${color}20`} />
      <span className="text-[10px] font-bold text-gray-400">{label}</span>
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