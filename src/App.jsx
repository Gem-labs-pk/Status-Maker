import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  CheckCircle2, 
  Moon, 
  Sun, 
  Type, 
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
const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0a66c2]">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 21.227.792 22 1.771 22h20.451C23.2 22 24 21.227 24 20.451V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const InstagramLogo = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
)

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
    retweets: '128'
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
                <div className="relative">
                    <input 
                    name="displayName"
                    value={state.displayName}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 rounded-lg border outline-none focus:ring-2 ${state.darkMode ? 'bg-slate-700 border-slate-600 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 focus:ring-blue-500'}`}
                    />
                    <button 
                        onClick={() => handleToggle('verified')}
                        className={`absolute right-2 top-2.5 ${state.verified ? 'text-blue-500' : 'text-gray-400 opacity-50'}`}
                        title="Toggle Verification"
                    >
                        <CheckCircle2 size={20} fill={state.verified ? "currentColor" : "none"} />
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

          {/* Content */}
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
                        {state.verified && <CheckCircle2 size={16} className="text-[#1d9bf0] fill-current" />}
                        <span className={`${subText} text-[15px]`}>@{state.username} · 1h</span>
                        <div className="ml-auto text-gray-500"><MoreHorizontal size={18} /></div>
                    </div>
                    
                    {/* Content */}
                    <div className="mt-1 text-[15px] whitespace-pre-wrap leading-relaxed">
                        {state.content.split(' ').map((word, i) => (
                            word.startsWith('#') || word.startsWith('@') || word.startsWith('http')
                             ? <span key={i} className="text-[#1d9bf0]">{word} </span>
                             : <span key={i}>{word} </span>
                        ))}
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
                        {state.verified && <span className={`${secondaryText} text-xs`}>• 1st</span>}
                    </div>
                    <div className={`${secondaryText} text-xs`}>{state.username} • Software Engineer</div>
                    <div className={`${secondaryText} text-xs flex items-center gap-1`}>
                        <span>2h • </span>
                        <svg className={`w-3 h-3 fill-current ${secondaryText}`} viewBox="0 0 16 16"><path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H9.5v-.527a.75.75 0 00-.22-.53L8.69 6.35a.75.75 0 01-.22-.53V4h.75a.75.75 0 00.53-.22l.56-.56a.75.75 0 01.53-.22H11a5 5 0 012.3 8.7l-1.39-1.68z"/></svg>
                    </div>
                </div>
                <button className={secondaryText}><MoreHorizontal size={20} /></button>
            </div>

            {/* Content */}
            <div className="px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed">
                 {state.content}
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
                     {state.verified && <div className="bg-blue-500 rounded-full p-[2px]"><CheckCircle2 size={8} className="text-white"/></div>}
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
                    <span className="whitespace-pre-wrap">{state.content}</span>
                </div>
                
                <div className={`text-xs mt-2 uppercase tracking-wide opacity-50`}>2 HOURS AGO</div>
            </div>
        </div>
    );
};