import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Moon, 
  Sun, 
  Image as ImageIcon,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  Send,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Share2
} from 'lucide-react';

// --- Icons / Logos (Inline SVGs for portability) ---

// Realistic Verified Badges
const VerifiedBadge = ({ platform }) => {
  if (platform === 'x') {
    return (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#1d9bf0] fill-current ml-1">
        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
      </svg>
    );
  }
  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#3897f0] fill-current ml-1">
         <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 5.521 4.477 9.999 9.999 9.999 5.521 0 9.999-4.478 9.999-9.999 0-5.522-4.478-9.999-9.999-9.999zm4.354 7.208l-5.152 5.152c-.195.195-.512.195-.707 0l-2.848-2.848c-.195-.195-.195-.512 0-.707.195-.195.512-.195.707 0l2.495 2.494 4.799-4.8c.195-.195.512-.195.707 0 .195.196.195.512-.001.709z"/>
      </svg>
    );
  }
  if (platform === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] text-[#9CA6B1] fill-current ml-1 opacity-80">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.1 14.6l-3.5-3.5 1.4-1.4 2.1 2.1 5-5 1.4 1.4-6.4 6.4z"/>
      </svg>
    );
  }
  return null;
};

// --- Helper for Blue Text ---
const formatContent = (text) => {
    return text.split(/(\s+)/).map((word, i) => {
        if (word.match(/^#|^@/)) {
            return <span key={i} className="text-[#1d9bf0] hover:underline cursor-pointer">{word}</span>
        }
        return <span key={i}>{word}</span>
    });
};

export default function App() {
  const previewRef = useRef(null);
  const [loadingLib, setLoadingLib] = useState(true);

  const [state, setState] = useState({
    displayName: 'GemPost User',
    username: 'gempost_ui',
    content: 'Just shipped a new update to the GemPost Generator! 🚀 Now supporting offline mode for all my fellow students at IUB with spotty Wi-Fi. #WebDev #React #Tailwind',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    verified: true,
    platform: 'x',
    darkMode: true,
    imageAttachmentUrl: null,
    likes: '1.2K',
    comments: '45',
    retweets: '128',
    timePosted: '2h' // New state for custom time
  });

  // Load html-to-image from CDN for standalone execution
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
    script.async = true;
    script.onload = () => setLoadingLib(false);
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e, key) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setState(prev => ({ ...prev, [key]: url }));
    }
  };

  const downloadImage = async () => {
    if (!previewRef.current || loadingLib) return;
    
    try {
        // @ts-ignore - Loading from CDN
        const htmlToImage = window.htmlToImage;
        
        const dataUrl = await htmlToImage.toPng(previewRef.current, {
            quality: 1.0,
            pixelRatio: 3, // High Def
            backgroundColor: state.darkMode 
                ? (state.platform === 'linkedin' ? '#1d2226' : '#000000') 
                : '#ffffff'
        });
        
        const link = document.createElement('a');
        link.download = `gempost-${state.platform}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error("Failed to generate image", err);
        alert("Oops! Could not generate image. Try creating a simpler post.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans text-slate-800 ${state.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50'}`}>
      
      {/* --- Sidebar Editor --- */}
      <div className={`w-full md:w-[400px] flex-shrink-0 p-6 overflow-y-auto border-r transition-colors ${state.darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-3xl">💎</span> GemPost
          </h1>
          <p className={`text-sm mt-1 ${state.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Professional Mockup Generator
          </p>
        </div>

        <div className="space-y-6">
          {/* Platform & Theme */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 block">Platform</label>
              <select 
                name="platform" 
                value={state.platform} 
                onChange={handleInputChange}
                className={`w-full p-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${state.darkMode ? 'bg-slate-700 border-slate-600 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 focus:ring-blue-500'}`}
              >
                <option value="x">X / Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
            <div>
               <label className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 block">Theme</label>
               <button 
                onClick={() => handleToggle('darkMode')}
                className={`w-full p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${state.darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
               >
                 {state.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                 {state.darkMode ? 'Dark' : 'Light'}
               </button>
            </div>
          </div>

          {/* Identity */}
          <div className="space-y-4">
            <div>
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 block">Display Name</label>
                <div className="relative flex items-center gap-2">
                    <input 
                    name="displayName"
                    value={state.displayName}
                    onChange={handleInputChange}
                    className={`flex-1 p-2.5 rounded-lg border outline-none focus:ring-2 ${state.darkMode ? 'bg-slate-700 border-slate-600 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 focus:ring-blue-500'}`}
                    />
                    <button 
                        onClick={() => handleToggle('verified')}
                        className={`p-2.5 border rounded-lg ${state.verified ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' : 'bg-transparent text-gray-400 opacity-50'}`}
                        title="Toggle Verification"
                    >
                        <VerifiedBadge platform="x" />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 block">Username</label>
                    <div className="flex items-center">
                        <span className={`p-2.5 border border-r-0 rounded-l-lg ${state.darkMode ? 'bg-slate-600 border-slate-600 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>@</span>
                        <input 
                        name="username"
                        value={state.username}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 border rounded-r-lg outline-none focus:ring-2 ${state.darkMode ? 'bg-slate-700 border-slate-600 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 focus:ring-blue-500'}`}
                        />
                    </div>
                 </div>
                 <div className="col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 block">Avatar</label>
                    <label className={`w-full h-[46px] rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${state.darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                        <Upload size={18} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatarUrl')} />
                    </label>
                 </div>
            </div>
          </div>

          {/* Time & Content */}
          <div className="space-y-4">
            <div>
               <label className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 block">Time Posted</label>
               <input 
                name="timePosted"
                value={state.timePosted}
                onChange={handleInputChange}
                placeholder="e.g. 2h, 45m, 2 Nov"
                className={`w-full p-2.5 rounded-lg border outline-none focus:ring-2 ${state.darkMode ? 'bg-slate-700 border-slate-600 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 focus:ring-blue-500'}`}
               />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 block">Post Content</label>
              <textarea 
                name="content"
                value={state.content}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 rounded-lg border outline-none focus:ring-2 resize-none ${state.darkMode ? 'bg-slate-700 border-slate-600 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 focus:ring-blue-500'}`}
              />
            </div>
          </div>

          {/* Stats Inputs */}
          <div className="grid grid-cols-3 gap-2">
             <div>
                <label className="text-[10px] font-semibold uppercase opacity-70 mb-1 block">Likes</label>
                <input name="likes" value={state.likes} onChange={handleInputChange} className={`w-full p-2 text-sm rounded border ${state.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`} />
             </div>
             <div>
                <label className="text-[10px] font-semibold uppercase opacity-70 mb-1 block">Comments</label>
                <input name="comments" value={state.comments} onChange={handleInputChange} className={`w-full p-2 text-sm rounded border ${state.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`} />
             </div>
             <div>
                <label className="text-[10px] font-semibold uppercase opacity-70 mb-1 block">Shares/RT</label>
                <input name="retweets" value={state.retweets} onChange={handleInputChange} className={`w-full p-2 text-sm rounded border ${state.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`} />
             </div>
          </div>

          {/* Image Attachment Toggle */}
          <div>
            <label className={`w-full p-3 rounded-lg border border-dashed flex items-center justify-center cursor-pointer gap-2 transition-all ${state.darkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300 hover:bg-slate-50'}`}>
                <ImageIcon size={18} />
                <span className="text-sm font-medium">{state.imageAttachmentUrl ? 'Change Post Image' : 'Add Post Image'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageAttachmentUrl')} />
            </label>
            {state.imageAttachmentUrl && (
                <button onClick={() => setState(s => ({...s, imageAttachmentUrl: null}))} className="text-xs text-red-500 mt-2 hover:underline">Remove Image</button>
            )}
          </div>

        </div>

        <button 
            onClick={downloadImage}
            disabled={loadingLib}
            className={`w-full mt-8 py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all ${loadingLib ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25'}`}
        >
            <Download size={20} />
            {loadingLib ? 'Loading Generator...' : 'Download Mockup'}
        </button>
      </div>

      {/* --- Preview Canvas --- */}
      <div className="flex-1 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-300 flex items-center justify-center p-4 md:p-12 relative">
         <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
         
         <div className="scale-[0.85] md:scale-100 transform transition-transform origin-top">
            {/* ID used for HTML-to-Image targeting */}
            <div 
                id="mockup-card" 
                ref={previewRef}
                className="shadow-2xl transition-all"
                style={{ width: '600px' }}
            >
                {state.platform === 'x' && <XPost state={state} />}
                {state.platform === 'linkedin' && <LinkedInPost state={state} />}
                {state.platform === 'instagram' && <InstagramPost state={state} />}
            </div>
         </div>
      </div>
    </div>
  );
}

// --- Platform Components ---

// 1. X (Twitter)
const XPost = ({ state }) => {
    const bg = state.darkMode ? 'bg-black text-white' : 'bg-white text-black';
    const subText = state.darkMode ? 'text-gray-500' : 'text-gray-500';
    const border = state.darkMode ? 'border-gray-800' : 'border-gray-100';

    return (
        <div className={`${bg} p-4 font-sans border ${border} rounded-none`}>
            {/* Header */}
            <div className="flex gap-3">
                <img src={state.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-[15px] hover:underline cursor-pointer">{state.displayName}</span>
                        {state.verified && <VerifiedBadge platform="x" />}
                        <span className={`${subText} text-[15px] ml-1`}>@{state.username} · {state.timePosted}</span>
                        <div className="ml-auto text-gray-500"><MoreHorizontal size={18} /></div>
                    </div>
                    
                    {/* Content */}
                    <div className="mt-1 text-[15px] whitespace-pre-wrap leading-relaxed">
                        {formatContent(state.content)}
                    </div>

                    {/* Image Attachment */}
                    {state.imageAttachmentUrl && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800/20">
                            <img src={state.imageAttachmentUrl} alt="Attachment" className="w-full h-auto object-cover max-h-[400px]" />
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className={`flex justify-between mt-3 max-w-md ${subText}`}>
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0]">
                            <MessageCircle size={18} />
                            <span className="text-xs">{state.comments}</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-green-500">
                            <Repeat2 size={18} />
                            <span className="text-xs">{state.retweets}</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-pink-500">
                            <Heart size={18} />
                            <span className="text-xs">{state.likes}</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0]">
                            <span className="flex gap-3">
                                <span className="h-[18px]"><svg viewBox="0 0 24 24" className="h-full w-auto fill-current"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" /></svg></span>
                                <Share size={18} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. LinkedIn
const LinkedInPost = ({ state }) => {
    // LinkedIn Dark Mode is specifically #1D2226 usually, or slightly lighter. 
    const bg = state.darkMode ? 'bg-[#1D2226] text-white' : 'bg-white text-slate-900';
    const secondaryText = state.darkMode ? 'text-gray-400' : 'text-gray-500';
    const border = state.darkMode ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className={`${bg} font-sans border ${border} rounded-lg overflow-hidden`}>
            {/* Header */}
            <div className="p-3 pb-1 flex gap-3">
                <img src={state.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm hover:underline hover:text-blue-500 cursor-pointer">{state.displayName}</span>
                        {state.verified && <span className={`${secondaryText} text-xs flex items-center`}>• <VerifiedBadge platform="linkedin"/> 1st</span>}
                    </div>
                    <div className={`${secondaryText} text-xs`}>{state.username} • Software Engineer</div>
                    <div className={`${secondaryText} text-xs flex items-center gap-1`}>
                        <span>{state.timePosted} • </span>
                        <svg className={`w-3 h-3 fill-current ${secondaryText}`} viewBox="0 0 16 16"><path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H9.5v-.527a.75.75 0 00-.22-.53L8.69 6.35a.75.75 0 01-.22-.53V4h.75a.75.75 0 00.53-.22l.56-.56a.75.75 0 01.53-.22H11a5 5 0 012.3 8.7l-1.39-1.68z"/></svg>
                    </div>
                </div>
                <button className={secondaryText}><MoreHorizontal size={20} /></button>
            </div>

            {/* Content */}
            <div className="px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed">
                 {formatContent(state.content)}
            </div>

            {/* Attachment */}
            {state.imageAttachmentUrl && (
                <div className="mt-2 w-full">
                    <img src={state.imageAttachmentUrl} alt="Post" className="w-full h-auto object-cover" />
                </div>
            )}

            {/* Stats Bar */}
            <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-400 border-b border-gray-700/50">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="bg-blue-500 rounded-full p-0.5"><ThumbsUp size={10} fill="white" className="text-white"/></div>
                        <div className="bg-red-500 rounded-full p-0.5"><Heart size={10} fill="white" className="text-white"/></div>
                        <div className="bg-green-600 rounded-full p-0.5"><span className="text-[8px] text-white px-0.5">👏</span></div>
                    </div>
                    <span className="hover:text-blue-500 hover:underline cursor-pointer">{state.likes}</span>
                </div>
                <div className="hover:text-blue-500 hover:underline cursor-pointer">
                    {state.comments} comments • {state.retweets} reposts
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-1 py-1 flex justify-between">
                <ActionButton icon={<ThumbsUp size={18} />} text="Like" dark={state.darkMode} />
                <ActionButton icon={<MessageSquare size={18} />} text="Comment" dark={state.darkMode} />
                <ActionButton icon={<Repeat2 size={18} />} text="Repost" dark={state.darkMode} />
                <ActionButton icon={<Send size={18} />} text="Send" dark={state.darkMode} />
            </div>
        </div>
    );
};

const ActionButton = ({ icon, text, dark }) => (
    <button className={`flex items-center justify-center gap-2 py-3 px-2 flex-1 rounded hover:bg-gray-100/10 transition-colors font-semibold text-sm ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
        {icon}
        <span>{text}</span>
    </button>
)

// 3. Instagram
const InstagramPost = ({ state }) => {
    const bg = state.darkMode ? 'bg-black text-white' : 'bg-white text-black';
    const border = state.darkMode ? 'border-gray-800' : 'border-gray-200';

    return (
        <div className={`${bg} font-sans border ${border} rounded-sm max-w-[500px] mx-auto`}>
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                     <div className="p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full">
                        <div className={`${bg} p-[2px] rounded-full`}>
                             <img src={state.avatarUrl} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                        </div>
                     </div>
                     <span className="text-sm font-semibold">{state.username}</span>
                     {state.verified && <VerifiedBadge platform="instagram" />}
                </div>
                <MoreHorizontal size={20} />
            </div>

            {/* Main Image (Or Placeholder Text Image if none) */}
            <div className={`w-full aspect-square ${state.darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center overflow-hidden relative`}>
                {state.imageAttachmentUrl ? (
                    <img src={state.imageAttachmentUrl} className="w-full h-full object-cover" alt="Post" />
                ) : (
                    <div className="p-8 text-center">
                        <p className={`text-xl font-serif italic opacity-60`}>"{state.content.substring(0, 50)}..."</p>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <Heart size={24} className="hover:opacity-50 cursor-pointer" />
                        <MessageCircle size={24} className="-rotate-90 hover:opacity-50 cursor-pointer" />
                        <Send size={24} className="hover:opacity-50 cursor-pointer" />
                    </div>
                    <Bookmark size={24} className="hover:opacity-50 cursor-pointer" />
                </div>
                
                <div className="text-sm font-semibold mb-1">{state.likes} likes</div>
                
                <div className="text-sm">
                    <span className="font-semibold mr-2">{state.username}</span>
                    <span className="whitespace-pre-wrap">{formatContent(state.content)}</span>
                </div>
                
                <div className={`text-xs mt-2 uppercase tracking-wide opacity-50`}>{state.timePosted} AGO</div>
            </div>
        </div>
    );
};