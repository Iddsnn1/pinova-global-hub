import React, { useState } from 'react';
import { ReferralGovernanceHub } from './ReferralGovernanceHub';
import {
  MessageSquare,
  Users,
  Radio,
  HelpCircle,
  Share2,
  ShieldAlert,
  Headphones,
  Search,
  Send,
  Paperclip,
  Smile,
  Mic,
  ThumbsUp,
  Heart,
  MessageCircle,
  Bookmark,
  UserPlus,
  UserCheck,
  CheckCheck,
  Play,
  Pause,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  Lock,
  X,
  Plus,
  Check,
  Volume2,
  Gift,
  FileText,
  Eye,
  Filter,
  Flame,
  ChevronRight,
  TrendingUp,
  Store,
  Building2,
  ShieldCheck,
  Copy
} from 'lucide-react';
import { Product, Order, Vendor, PiUser } from '../../types';

interface SocialCommunityHubProps {
  user: PiUser;
  products: Product[];
  vendors: Vendor[];
  orders: Order[];
  onOpenMessaging?: (recipient: string) => void;
  onOpenProductDetail?: (product: Product) => void;
  onOpenVendorStorefront?: (vendor: Vendor) => void;
  onClose?: () => void;
}

export const SocialCommunityHub: React.FC<SocialCommunityHubProps> = ({
  user,
  products,
  vendors,
  orders,
  onOpenMessaging,
  onOpenProductDetail,
  onOpenVendorStorefront,
  onClose
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'messaging' | 'community_feed' | 'live_commerce' | 'product_qa' | 'referrals_social' | 'support_center' | 'moderation_privacy'
  >('messaging');

  // --- MESSAGING STATE ---
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [chatSearch, setChatSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentMessage, setAttachmentMessage] = useState<string | null>(null);

  const [conversations, setConversations] = useState([
    {
      id: 'chat-1',
      recipient: 'TechNova Global Store',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      type: 'Buyer ↔ Merchant',
      lastMessage: 'Your order ORD-PI-892341 has been dispatched with tracking #PN-8891!',
      timestamp: '10:42 AM',
      unread: 1,
      verified: true,
      messages: [
        { id: 'm1', sender: 'TechNova Global Store', text: 'Hello @Pi_Pioneer_01! Thank you for placing your order with Pi SDK v2.', timestamp: '10:38 AM', isMe: false, read: true },
        { id: 'm2', sender: 'Pi_Pioneer_01', text: 'Hi! Can you confirm if the smartphone includes a global Pi Network warranty card?', timestamp: '10:40 AM', isMe: true, read: true },
        { id: 'm3', sender: 'TechNova Global Store', text: 'Yes, absolutely! It comes with a 2-year PiNova Global Manufacturer Warranty.', timestamp: '10:42 AM', isMe: false, read: true, reactions: ['❤️', '👍'] }
      ]
    },
    {
      id: 'chat-2',
      recipient: 'Pioneer Hardware Wholesale Group',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      type: 'Business Team Chat',
      lastMessage: 'Alex: Bulk inventory shipment of 500 units arrived at Lagos Hub.',
      timestamp: 'Yesterday',
      unread: 0,
      verified: true,
      messages: [
        { id: 'm10', sender: 'David (Supply Chain)', text: 'Bulk inventory shipment of 500 units arrived at Lagos Hub.', timestamp: 'Yesterday', isMe: false, read: true },
        { id: 'm11', sender: 'Pi_Pioneer_01', text: 'Great! Let us authorize stock allocation in the Merchant Hub.', timestamp: 'Yesterday', isMe: true, read: true }
      ]
    },
    {
      id: 'chat-3',
      recipient: 'PiNova Official Support AI',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      type: '24/7 Support Desk',
      lastMessage: 'AI: Your escrow protection dispute #DSP-9021 was resolved successfully.',
      timestamp: '08:15 AM',
      unread: 0,
      verified: true,
      messages: [
        { id: 'm20', sender: 'PiNova Official Support AI', text: 'Welcome to PiNova Customer Care! How can I assist you with your Pi platform transaction today?', timestamp: '08:15 AM', isMe: false, read: true }
      ]
    }
  ]);

  // --- COMMUNITY FEED STATE ---
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 'post-1',
      storeName: 'TechNova Official Store',
      storeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      verified: true,
      timeAgo: '2 hours ago',
      content: '🚀 EXCLUSIVE ANNOUNCEMENT: Our next-generation PiNova Quantum 5G Foldable Phone is now available in limited stock! Paid exclusively via Pi SDK v2 with zero platform fees.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      likes: 342,
      isLiked: false,
      saved: false,
      commentsCount: 48,
      comments: [
        { id: 'c1', user: '@Pi_Pioneer_88', text: 'Just ordered mine with 180 π! Fast checkout experience.' },
        { id: 'c2', user: '@CryptoMerchant', text: 'Does it support multi-language Pi Nova OS?' }
      ],
      poll: {
        question: 'Which color variant would you like us to restock first?',
        options: [
          { id: 'opt-1', text: 'Obsidian Black (85 π)', votes: 142 },
          { id: 'opt-2', text: 'Cosmic Purple (85 π)', votes: 210 },
          { id: 'opt-3', text: 'Solar Gold (90 π)', votes: 95 }
        ],
        votedOption: null as string | null
      }
    },
    {
      id: 'post-2',
      storeName: 'Aura Artisanal Crafts & Wearables',
      storeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      verified: true,
      timeAgo: '5 hours ago',
      content: '✨ Handcrafted Pi Network Leather Wallets & Accessories! Every item is authenticated with a verified QR warranty tag. Check out our store for 15% flash deals.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      likes: 189,
      isLiked: true,
      saved: true,
      commentsCount: 19,
      comments: [
        { id: 'c3', user: '@HandmadeLover', text: 'Beautiful craftsmanship! Shipping time to Europe?' }
      ],
      poll: null
    }
  ]);
  const [newCommentInput, setNewCommentInput] = useState<{ [postId: string]: string }>({});

  // --- PRODUCT Q&A STATE ---
  const [qaItems, setQaItems] = useState([
    {
      id: 'qa-1',
      productName: 'PiNova Quantum 5G Smartphone',
      question: 'Is the Pi Browser pre-installed on this device for seamless SDK authentication?',
      author: '@Pioneer_Dave',
      date: 'Aug 2, 2026',
      helpfulCount: 28,
      isHelpful: false,
      answers: [
        { id: 'a1', author: 'TechNova Store (Seller)', text: 'Yes! The Pi Browser and Pi Wallet sandbox tools come pre-installed and optimized out of the box.', verifiedSeller: true, date: 'Aug 2, 2026' },
        { id: 'a2', author: '@Pi_Tech_Guru', text: 'I bought one last week and can confirm it works seamlessly with Pi SDK v2.', verifiedSeller: false, date: 'Aug 3, 2026' }
      ]
    },
    {
      id: 'qa-2',
      productName: 'SolarCharge Pro 10,000mAh Power Bank',
      question: 'Can this solar power bank charge two Pi Ecosystem IoT sensors simultaneously?',
      author: '@SolarMaker',
      date: 'Jul 29, 2026',
      helpfulCount: 14,
      isHelpful: false,
      answers: [
        { id: 'a3', author: 'EcoPi Energy Store (Seller)', text: 'Yes, it features dual USB-C Power Delivery ports supporting up to 45W total output.', verifiedSeller: true, date: 'Jul 29, 2026' }
      ]
    }
  ]);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [selectedQaProduct, setSelectedQaProduct] = useState(products[0]?.title || 'PiNova Quantum 5G Smartphone');

  // --- LIVE COMMERCE STATE ---
  const [isRegisteredLive, setIsRegisteredLive] = useState(false);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [liveChatStream, setLiveChatStream] = useState([
    { id: 'l1', user: '@Pioneer_Alpha', text: 'Super excited for the live product demo! 🔥' },
    { id: 'l2', user: '@CryptoBuyer', text: 'Is the 20% Pi discount active during the live stream?' },
    { id: 'l3', user: 'TechNova Live Host', text: 'Yes! Pinned item #1 gets an extra 10 π discount right now!', isHost: true }
  ]);

  // --- REFERRAL & SOCIAL SHARING STATE ---
  const [referralCopied, setReferralCopied] = useState(false);
  const [followedStores, setFollowedStores] = useState<string[]>(['TechNova Official Store', 'Aura Artisanal Crafts & Wearables']);

  // --- SUPPORT CENTER STATE ---
  const [supportSearch, setSupportSearch] = useState('');
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TICK-9081', subject: 'Inquiry regarding Pi SDK v2 Payment Status', status: 'OPEN', priority: 'High', date: '2026-08-03' },
    { id: 'TICK-8812', subject: 'Vendor Storefront Custom Domain Setup', status: 'RESOLVED', priority: 'Medium', date: '2026-07-28' }
  ]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  // --- MODERATION & PRIVACY STATE ---
  const [blockedUsers, setBlockedUsers] = useState(['@SpamBot_99', '@FakeMerchant_00']);
  const [mutedChats, setMutedChats] = useState<string[]>([]);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Active current conversation object
  const currentConversation = conversations.find((c) => c.id === activeChatId) || conversations[0];

  // Action handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachmentMessage) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: user.username,
      text: messageInput || (attachmentMessage ? `[Attached: ${attachmentMessage}]` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      read: true
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, timestamp: 'Just now' }
          : c
      )
    );
    setMessageInput('');
    setAttachmentMessage(null);
  };

  const handleToggleLikePost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.poll && !post.poll.votedOption) {
          return {
            ...post,
            poll: {
              ...post.poll,
              votedOption: optionId,
              options: post.poll.options.map((opt) =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
              )
            }
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = newCommentInput[postId];
    if (!text || !text.trim()) return;

    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsCount: post.commentsCount + 1,
              comments: [
                ...post.comments,
                { id: `cmt-${Date.now()}`, user: `@${user.username}`, text: text.trim() }
              ]
            }
          : post
      )
    );
    setNewCommentInput((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleHelpfulVote = (qaId: string) => {
    setQaItems((prev) =>
      prev.map((q) =>
        q.id === qaId
          ? {
              ...q,
              isHelpful: !q.isHelpful,
              helpfulCount: q.isHelpful ? q.helpfulCount - 1 : q.helpfulCount + 1
            }
          : q
      )
    );
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;

    const newQa = {
      id: `qa-${Date.now()}`,
      productName: selectedQaProduct,
      question: newQuestionInput.trim(),
      author: `@${user.username}`,
      date: 'Just now',
      helpfulCount: 1,
      isHelpful: true,
      answers: []
    };

    setQaItems((prev) => [newQa, ...prev]);
    setNewQuestionInput('');
  };

  const handleSendLiveChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatInput.trim()) return;

    setLiveChatStream((prev) => [
      ...prev,
      { id: `live-${Date.now()}`, user: `@${user.username}`, text: liveChatInput.trim() }
    ]);
    setLiveChatInput('');
  };

  const handleToggleFollowStore = (storeName: string) => {
    setFollowedStores((prev) =>
      prev.includes(storeName)
        ? prev.filter((s) => s !== storeName)
        : [...prev, storeName]
    );
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(`https://pinova.app/invite?ref=${user.username}`);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    const newT = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicketSubject.trim(),
      status: 'OPEN',
      priority: 'Medium',
      date: new Date().toISOString().split('T')[0]
    };

    setSupportTickets((prev) => [newT, ...prev]);
    setNewTicketSubject('');
    setNewTicketMessage('');
    setShowTicketModal(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      
      {/* HUB HEADER & TITLE */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-800/40 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> PiNova Social Commerce & Community
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              Official Pi SDK v2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Social & Community Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl">
            Real-time buyer ↔ seller communication, store communities, live commerce streaming, product Q&A, and community moderation for Pi Nova Marketplace.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white self-start md:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 'messaging', label: 'Messaging & Chat', icon: MessageSquare },
          { id: 'community_feed', label: 'Store Feed & Posts', icon: Users },
          { id: 'live_commerce', label: 'PiNova Live Stream', icon: Radio },
          { id: 'product_qa', label: 'Product Q&A', icon: HelpCircle },
          { id: 'referrals_social', label: 'Referrals & Sharing', icon: Share2 },
          { id: 'support_center', label: 'Support & AI Desk', icon: Headphones },
          { id: 'moderation_privacy', label: 'Safety & Moderation', icon: ShieldAlert },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: REAL-TIME MESSAGING */}
      {activeTab === 'messaging' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[620px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Conversation List Sidebar */}
          <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" /> Direct Conversations
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {conversations.length} Active
                </span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chats, merchants, orders..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {conversations
                .filter((c) => c.recipient.toLowerCase().includes(chatSearch.toLowerCase()))
                .map((conv) => {
                  const isSelected = conv.id === activeChatId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveChatId(conv.id)}
                      className={`p-3.5 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-l-4 border-purple-600'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.recipient}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        {conv.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-500 absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{conv.recipient}</h4>
                          <span className="text-[10px] text-slate-400">{conv.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{conv.lastMessage}</p>
                        <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 block">{conv.type}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Chat Window Panel */}
          <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <img
                  src={currentConversation.avatar}
                  alt={currentConversation.recipient}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    {currentConversation.recipient}
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                    </span>
                    <span>•</span>
                    <span>{currentConversation.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (mutedChats.includes(currentConversation.id)) {
                      setMutedChats(mutedChats.filter((i) => i !== currentConversation.id));
                    } else {
                      setMutedChats([...mutedChats, currentConversation.id]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    mutedChats.includes(currentConversation.id)
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {mutedChats.includes(currentConversation.id) ? 'Muted' : 'Mute'}
                </button>
              </div>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
              {currentConversation.messages.map((msg) => {
                const isMe = msg.isMe;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs space-y-1 ${
                        isMe
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-purple-600/10'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <span className="text-[10px] opacity-75 font-bold block">{msg.sender}</span>
                      <p className="leading-relaxed">{msg.text}</p>
                      
                      {msg.reactions && (
                        <div className="flex items-center gap-1 pt-1">
                          {msg.reactions.map((emoji, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{emoji}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-1 text-[9px] opacity-70 pt-0.5">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Simulated typing indicator */}
              <div className="flex items-center gap-2 text-slate-400 text-[10px] italic">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                {currentConversation.recipient} is typing a response...
              </div>
            </div>

            {/* Attachment Preview Bar */}
            {attachmentMessage && (
              <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/40 border-t border-purple-200 dark:border-purple-900 flex items-center justify-between text-xs text-purple-700 dark:text-purple-300 font-bold">
                <span className="flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> Attached: {attachmentMessage}</span>
                <button onClick={() => setAttachmentMessage(null)}><X className="w-3.5 h-3.5" /></button>
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachmentMessage('PiNova_Invoice_ORD-PI-892341.pdf')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                title="Attach Document/Image"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                className={`p-2 rounded-xl transition-colors ${isPlayingVoice ? 'bg-rose-500/20 text-rose-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
                title="Record Voice Clip"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Type your message to merchant..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: STORE COMMUNITY FEED */}
      {activeTab === 'community_feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            {feedPosts.map((post) => (
              <div key={post.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                
                {/* Store Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.storeAvatar} alt={post.storeName} className="w-10 h-10 rounded-full object-cover border border-purple-500/30" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        {post.storeName}
                        {post.verified && <ShieldCheck className="w-4 h-4 text-purple-500" />}
                      </h3>
                      <span className="text-[10px] text-slate-400">{post.timeAgo}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFollowStore(post.storeName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      followedStores.includes(post.storeName)
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        : 'bg-purple-600 text-white hover:bg-purple-500'
                    }`}
                  >
                    {followedStores.includes(post.storeName) ? (
                      <><UserCheck className="w-3.5 h-3.5" /> Following</>
                    ) : (
                      <><UserPlus className="w-3.5 h-3.5" /> Follow Store</>
                    )}
                  </button>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{post.content}</p>

                {post.image && (
                  <img src={post.image} alt="Store post" className="w-full h-64 object-cover rounded-2xl border border-slate-200 dark:border-slate-800" />
                )}

                {/* Interactive Poll */}
                {post.poll && (
                  <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 space-y-3">
                    <h4 className="font-bold text-xs text-purple-900 dark:text-purple-300 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500" /> Community Store Poll: {post.poll.question}
                    </h4>

                    <div className="space-y-2">
                      {post.poll.options.map((option) => {
                        const totalVotes = post.poll!.options.reduce((sum, o) => sum + o.votes, 0);
                        const pct = Math.round((option.votes / totalVotes) * 100) || 0;
                        const isVoted = post.poll!.votedOption === option.id;

                        return (
                          <div
                            key={option.id}
                            onClick={() => handleVotePoll(post.id, option.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                              isVoted
                                ? 'bg-purple-600 text-white border-purple-600 font-bold'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400'
                            }`}
                          >
                            <span className="text-xs z-10">{option.text}</span>
                            <span className="text-xs font-mono font-bold z-10">{pct}% ({option.votes})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Post Footer Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <button
                    onClick={() => handleToggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors ${
                      post.isLiked ? 'text-rose-500' : 'hover:text-purple-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} /> {post.likes} Likes
                  </button>

                  <span className="flex items-center gap-1.5 font-bold">
                    <MessageCircle className="w-4 h-4 text-purple-500" /> {post.commentsCount} Comments
                  </span>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://pinova.app/community/post/${post.id}`);
                      alert('Post link copied to clipboard!');
                    }}
                    className="flex items-center gap-1.5 font-bold hover:text-purple-600"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>

                {/* Comment Input */}
                <div className="pt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentInput[post.id] || ''}
                    onChange={(e) => setNewCommentInput({ ...newCommentInput, [post.id]: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                  >
                    Post
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar: Followed Stores & Community Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-purple-600" /> Followed Store Communities
              </h3>
              
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={vendor.logoImage} alt={vendor.storeName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-slate-900 dark:text-white truncate">{vendor.storeName}</span>
                    </div>
                    <button
                      onClick={() => handleToggleFollowStore(vendor.storeName)}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400"
                    >
                      {followedStores.includes(vendor.storeName) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-purple-950/20 border border-purple-800/40 text-purple-200 space-y-3">
              <h4 className="font-bold text-xs text-purple-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Community Guidelines
              </h4>
              <p className="text-[11px] leading-relaxed text-purple-200/80">
                PiNova Community enforces strict peer-to-peer trust, official Pi SDK v2 API usage, and zero tolerance for spam or off-platform payment solicitations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE COMMERCE STREAMING */}
      {activeTab === 'live_commerce' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Broadcast Stream Window */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl h-[420px] flex flex-col justify-between p-6">
              
              {/* Top Stream Overlay */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse">
                    <Radio className="w-3.5 h-3.5" /> LIVE
                  </span>
                  <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-400" /> 1,420 Viewing
                  </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-amber-400 text-xs font-bold font-mono">
                  TechNova Global Official Stream
                </div>
              </div>

              {/* Center Simulated Stream Visual */}
              <div className="text-center space-y-3 z-10 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-1 mx-auto shadow-2xl shadow-purple-500/50 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-amber-400 ml-1" />
                  </div>
                </div>
                <h3 className="font-black text-lg text-white">Live Showcase: PiNova Quantum 5G Foldable Phone</h3>
                <p className="text-xs text-slate-300">Live product demo, real-time QA & exclusive 15% Pi discount coupon!</p>
              </div>

              {/* Pinned Featured Item Overlay */}
              <div className="z-10 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={products[0]?.images[0]} alt="Featured Product" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px] uppercase">Pinned Featured Deal</span>
                    <h4 className="font-bold text-xs text-white truncate">{products[0]?.title}</h4>
                    <span className="text-xs font-black text-amber-400">{products[0]?.pricePi} π</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenProductDetail && onOpenProductDetail(products[0])}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform"
                >
                  Buy Now with Pi
                </button>
              </div>
            </div>
          </div>

          {/* Stream Chat Side Column */}
          <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xl flex flex-col h-[420px]">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" /> Live Stream Chat
            </h3>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
              {liveChatStream.map((msg) => (
                <div key={msg.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className={`font-bold block text-[10px] ${msg.isHost ? 'text-amber-500 font-mono' : 'text-purple-600 dark:text-purple-400'}`}>
                    {msg.user}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendLiveChatMessage} className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Send a message to live stream..."
                value={liveChatInput}
                onChange={(e) => setLiveChatInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none border border-slate-200 dark:border-slate-700"
              />
              <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCT Q&A */}
      {activeTab === 'product_qa' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Product Questions & Answers</h2>
                <p className="text-xs text-slate-500">Ask verified sellers and community members questions about specs, shipping, and Pi SDK v2 compatibility.</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedQaProduct}
                  onChange={(e) => setSelectedQaProduct(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ask Question Form */}
            <form onSubmit={handleAddQuestion} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 space-y-3">
              <h4 className="font-bold text-xs text-purple-900 dark:text-purple-300">Ask a Question regarding {selectedQaProduct}:</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Does this product ship with an international Pi Warranty certificate?"
                  value={newQuestionInput}
                  onChange={(e) => setNewQuestionInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md">
                  Submit Question
                </button>
              </div>
            </form>

            {/* Q&A List */}
            <div className="space-y-4 pt-2">
              {qaItems.map((qa) => (
                <div key={qa.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">{qa.productName}</span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{qa.question}</h3>
                      <span className="text-[10px] text-slate-400">Asked by {qa.author} on {qa.date}</span>
                    </div>

                    <button
                      onClick={() => handleHelpfulVote(qa.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        qa.isHelpful
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({qa.helpfulCount})
                    </button>
                  </div>

                  {/* Answers */}
                  <div className="pl-4 border-l-2 border-purple-500/40 space-y-2">
                    {qa.answers.map((ans) => (
                      <div key={ans.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{ans.author}</span>
                          {ans.verifiedSeller && (
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold text-[9px]">Verified Merchant Answer</span>
                          )}
                          <span className="text-[10px] text-slate-400 ml-auto">{ans.date}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{ans.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REFERRALS & SOCIAL SHARING */}
      {activeTab === 'referrals_social' && (
        <ReferralGovernanceHub user={user} />
      )}

      {/* TAB 6: SUPPORT & AI DESK */}
      {activeTab === 'support_center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <Headphones className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">24/7 Support Desk</h3>
              <p className="text-xs text-slate-500">Connect directly with a human support specialist or dispute mediator.</p>
              <button
                onClick={() => setActiveTab('messaging')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
              >
                Open Live Chat
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Support Tickets</h3>
              <p className="text-xs text-slate-500">Track and create formal inquiry tickets for technical and payment concerns.</p>
              <button
                onClick={() => setShowTicketModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
              >
                Create Support Ticket
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <Sparkles className="w-8 h-8 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">PiNova AI Assistant</h3>
              <p className="text-xs text-slate-500">Instant answers regarding Pi Browser login, PSTP Shield, and transaction verification.</p>
              <button
                onClick={() => setActiveTab('messaging')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl"
              >
                Ask AI Assistant
              </button>
            </div>
          </div>

          {/* Active Support Tickets */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Support Tickets</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Ticket ID</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Created Date</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {supportTickets.map((tick) => (
                    <tr key={tick.id}>
                      <td className="py-3 px-3 font-bold text-purple-600 dark:text-purple-400">{tick.id}</td>
                      <td className="py-3 px-3 font-sans font-bold text-slate-900 dark:text-white">{tick.subject}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{tick.priority}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{tick.date}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                          tick.status === 'OPEN' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {tick.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SAFETY & MODERATION */}
      {activeTab === 'moderation_privacy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Community Moderation & Privacy Controls
            </h2>
            <p className="text-xs text-slate-500">Manage blocked accounts, report policy violations, and configure your privacy visibility on Pi Nova marketplace.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Blocked Users List</h4>
                <div className="space-y-2">
                  {blockedUsers.map((u, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 text-xs">
                      <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{u}</span>
                      <button
                        onClick={() => setBlockedUsers(blockedUsers.filter((item) => item !== u))}
                        className="text-[10px] font-bold text-rose-500"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Report Content / Merchant Violation</h4>
                <p className="text-[11px] text-slate-500">Submit a confidential report to PiNova Trust & Safety moderators.</p>
                <button
                  onClick={() => alert('Violation report submitted to PiNova Moderation Team.')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
                >
                  Submit Abuse Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT TICKET MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create Support Ticket</h3>
              <button onClick={() => setShowTicketModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Inquiry subject..."
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Message Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your question or issue in detail..."
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
