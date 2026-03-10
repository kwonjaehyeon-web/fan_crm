import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  MessageSquare, 
  Link as LinkIcon, 
  Settings,
  Bell,
  UserCircle,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Mail,
  Smartphone,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Fan, Stats } from './types';
import { format } from 'date-fns';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-black text-white shadow-lg shadow-black/10" 
        : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "text-zinc-400 group-hover:text-black")} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Users className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight">FanCRM</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === "/"} />
          <SidebarItem icon={Users} label="Fans & Tiers" to="/fans" active={location.pathname === "/fans"} />
          <SidebarItem icon={LinkIcon} label="Landing Page" to="/landing-config" active={location.pathname === "/landing-config"} />
          <SidebarItem icon={MessageSquare} label="Messages" to="/messages" active={location.pathname === "/messages"} />
        </nav>

        <div className="pt-6 border-t border-zinc-100">
          <SidebarItem icon={Settings} label="Settings" to="/settings" active={location.pathname === "/settings"} />
          <div className="mt-4 p-4 bg-zinc-50 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
              <img src="https://picsum.photos/seed/creator/100/100" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Studio Admin</p>
              <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <h1 className="font-semibold text-lg">
            {location.pathname === "/" && "Dashboard Overview"}
            {location.pathname === "/fans" && "Fan Segmentation"}
            {location.pathname === "/landing-config" && "Landing Page & Leads"}
            {location.pathname === "/messages" && "Trigger Messages"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors">
              <UserCircle size={24} className="text-zinc-400" />
              <span className="text-sm font-medium">JD</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Views ---

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(setStats);
  }, []);

  if (!stats) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-zinc-200 rounded-2xl"></div>)}
    </div>
  </div>;

  const coreFans = stats.tierCounts.find(t => t.tier === 'CORE')?.count || 0;
  const middleFans = stats.tierCounts.find(t => t.tier === 'MIDDLE')?.count || 0;
  const liteFans = stats.tierCounts.find(t => t.tier === 'LITE')?.count || 0;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <p className="text-sm font-medium text-zinc-500 mb-1">Total Fans</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold">{stats.totalFans.count}</h3>
            <span className="text-emerald-500 text-sm font-medium mb-1">+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <p className="text-sm font-medium text-zinc-500 mb-1">Core Fans</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-emerald-600">{coreFans}</h3>
            <span className="text-zinc-400 text-sm font-medium mb-1">{(coreFans / stats.totalFans.count * 100).toFixed(1)}%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <p className="text-sm font-medium text-zinc-500 mb-1">Total Revenue</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold">${stats.totalRevenue.total?.toFixed(0) || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <p className="text-sm font-medium text-zinc-500 mb-1">Avg. Conversion</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold">18.2%</h3>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">Recent Activity</h3>
              <button className="text-sm text-zinc-500 hover:text-black font-medium">View all</button>
            </div>
            <div className="divide-y divide-zinc-50">
              {[
                { name: "Sarah Johnson", action: "Verified purchase", amount: "$120.00", time: "2 mins ago", tier: "CORE" },
                { name: "Alex Chen", action: "Joined via Instagram", amount: null, time: "1 hour ago", tier: "LITE" },
                { name: "Maria Garcia", action: "Verified purchase", amount: "$45.00", time: "3 hours ago", tier: "MIDDLE" },
                { name: "James Wilson", action: "Verified purchase", amount: "$15.00", time: "5 hours ago", tier: "LITE" },
              ].map((item, i) => (
                <div key={i} className="p-4 hover:bg-zinc-50 transition-colors flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold">
                    {item.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.action} {item.amount && `(${item.amount})`}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">{item.time}</p>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      item.tier === 'CORE' ? "bg-emerald-100 text-emerald-700" :
                      item.tier === 'MIDDLE' ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {item.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Source Distribution</h3>
            <div className="space-y-4">
              {[
                { label: "Instagram Bio", value: 45, color: "bg-pink-500" },
                { label: "YouTube Description", value: 32, color: "bg-red-500" },
                { label: "Newsletter", value: 15, color: "bg-blue-500" },
                { label: "Other", value: 8, color: "bg-zinc-400" },
              ].map((source, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{source.label}</span>
                    <span>{source.value}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", source.color)} style={{ width: `${source.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Ready to re-engage?</h3>
              <p className="text-zinc-400 text-sm mb-4">12 fans haven't purchased in 90 days. Send a nudge?</p>
              <Link to="/messages" className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors">
                Send Messages <ArrowUpRight size={16} />
              </Link>
            </div>
            <Users className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-white/10 transition-colors" size={120} />
          </div>
        </div>
      </div>
    </div>
  );
};

const FansView = () => {
  const [fans, setFans] = useState<Fan[]>([]);
  const [verifyData, setVerifyData] = useState({ email: '', amount: '', purchaseCode: '' });
  const [loading, setLoading] = useState(false);

  const fetchFans = () => fetch('/api/fans').then(res => res.json()).then(setFans);

  useEffect(() => {
    fetchFans();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/fans/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyData)
      });
      if (res.ok) {
        setVerifyData({ email: '', amount: '', purchaseCode: '' });
        fetchFans();
        alert("Purchase verified successfully!");
      } else {
        alert("Verification failed. Check email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search fans by email or name..." 
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors">
              <Filter size={18} /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Fan</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Spent</th>
                  <th className="px-6 py-4">Last Verified</th>
                  <th className="px-6 py-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {fans.map((fan) => (
                  <tr key={fan.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-xs font-bold">
                          {fan.email[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{fan.email}</p>
                          <p className="text-[10px] text-zinc-400">{fan.phone || "No phone"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        fan.tier === 'CORE' ? "bg-emerald-100 text-emerald-700" :
                        fan.tier === 'MIDDLE' ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"
                      )}>
                        {fan.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">${fan.total_spent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {fan.last_purchase_date ? format(new Date(fan.last_purchase_date), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md font-medium uppercase">
                        {fan.utm_source || 'Direct'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="font-bold text-lg">Manual Verification</h3>
          </div>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase">Purchase Code</label>
              <input 
                required
                value={verifyData.purchaseCode}
                onChange={e => setVerifyData({...verifyData, purchaseCode: e.target.value})}
                placeholder="e.g. SAVE20-X9" 
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase">Fan Email</label>
              <input 
                required
                type="email"
                value={verifyData.email}
                onChange={e => setVerifyData({...verifyData, email: e.target.value})}
                placeholder="fan@example.com" 
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase">Amount ($)</label>
              <input 
                required
                type="number"
                value={verifyData.amount}
                onChange={e => setVerifyData({...verifyData, amount: e.target.value})}
                placeholder="0.00" 
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Add Transaction"}
            </button>
          </form>
        </div>

        <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 border-dashed">
          <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Tiering Rules</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-100">
              <div>
                <p className="text-xs font-bold">Lite Tier</p>
                <p className="text-[10px] text-zinc-400">Spending &lt; $25</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-100">
              <div>
                <p className="text-xs font-bold">Middle Tier</p>
                <p className="text-[10px] text-zinc-400">Spending $25 - $100</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-zinc-200"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-100">
              <div>
                <p className="text-xs font-bold">Core Tier</p>
                <p className="text-[10px] text-zinc-400">Spending &gt; $100</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-zinc-200"></div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-4 italic">Rules are applied automatically upon verification.</p>
        </div>
      </div>
    </div>
  );
};

const LandingConfig = () => {
  const [source, setSource] = useState('Instagram Bio');
  const baseUrl = `${window.location.origin}/join/creator-123`;
  const generatedUrl = `${baseUrl}?utm_source=${source.toLowerCase().replace(' ', '_')}&utm_medium=social&utm_campaign=fan_acquisition`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
              <LinkIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">UTM Link Generator</h3>
              <p className="text-sm text-zinc-500">Create trackable URLs for different platforms.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Traffic Source</label>
              <select 
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none appearance-none"
              >
                <option>Instagram Bio</option>
                <option>YouTube Description</option>
                <option>TikTok Profile</option>
                <option>Newsletter</option>
                <option>Twitter/X</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Generated URL</label>
              <div className="flex gap-2">
                <input 
                  readOnly
                  value={generatedUrl}
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-mono text-zinc-500 outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUrl);
                    alert("Copied to clipboard!");
                  }}
                  className="px-4 bg-black text-white rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Source Performance</h3>
          <div className="space-y-4">
            {[
              { source: "Instagram Bio", visitors: "12,450", leads: "2,265", conv: "18.2%", trend: "up" },
              { source: "YouTube Description", visitors: "45,100", leads: "4,284", conv: "9.5%", trend: "neutral" },
              { source: "Newsletter", visitors: "5,800", leads: "812", conv: "14.0%", trend: "down" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white",
                    item.source.includes("Instagram") ? "bg-pink-500" : 
                    item.source.includes("YouTube") ? "bg-red-500" : "bg-blue-500"
                  )}>
                    {item.source[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.source}</p>
                    <p className="text-[10px] text-zinc-400">{item.visitors} visitors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{item.conv}</p>
                  <p className="text-[10px] text-zinc-400">{item.leads} leads</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[40px] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
            <Mail className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join the Community</h2>
          <p className="text-zinc-400 mb-8 max-w-xs">Stay updated with my latest exclusive content and early access.</p>
          
          <div className="w-full max-w-sm space-y-4">
            <div className="text-left space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
              <div className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl"></div>
            </div>
            <div className="text-left space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone Number (Optional)</label>
              <div className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl"></div>
            </div>
            <div className="w-full h-14 bg-white text-black rounded-2xl font-bold flex items-center justify-center mt-4">
              Subscribe Now
            </div>
          </div>
          
          <div className="mt-12 flex gap-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Collecting Emails</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Collecting SMS</span>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

const MessagesView = () => {
  const templates = [
    { id: 1, name: "90-Day Winback", trigger: "90 days since last purchase", type: "EMAIL", content: "Hey! We haven't seen you in a while. Here's 20% off your next order..." },
    { id: 2, name: "Core Fan Thank You", trigger: "Reached CORE tier", type: "SMS", content: "You're officially a CORE fan! Thank you for the support. Here's a special gift..." },
    { id: 3, name: "New Member Welcome", trigger: "Just joined", type: "EMAIL", content: "Welcome to the community! Here's what you can expect from us..." },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                template.type === 'EMAIL' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
              )}>
                {template.type === 'EMAIL' ? <Mail size={20} /> : <Smartphone size={20} />}
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{template.type}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{template.name}</h3>
            <p className="text-xs text-zinc-500 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Trigger: {template.trigger}
            </p>
            <div className="flex-1 bg-zinc-50 p-4 rounded-2xl mb-4">
              <p className="text-xs text-zinc-600 italic line-clamp-3">"{template.content}"</p>
            </div>
            <button className="w-full py-2.5 border border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-colors">
              Edit Template
            </button>
          </div>
        ))}
        <button className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-6 text-zinc-400 hover:text-black hover:border-black transition-all group">
          <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm">Create New Trigger</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h3 className="font-bold text-lg">Message History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Template</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {[
                { email: "sarah@example.com", template: "Core Fan Thank You", status: "Delivered", time: "10 mins ago" },
                { email: "mike@domain.com", template: "90-Day Winback", status: "Opened", time: "2 hours ago" },
                { email: "jess@web.com", template: "New Member Welcome", status: "Delivered", time: "5 hours ago" },
              ].map((log, i) => (
                <tr key={i} className="text-sm">
                  <td className="px-6 py-4 font-medium">{log.email}</td>
                  <td className="px-6 py-4 text-zinc-500">{log.template}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={10} /> {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Public Landing Page ---

const PublicLanding = () => {
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      source: searchParams.get('utm_source') || 'Direct'
    };

    const res = await fetch('/api/fans/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold">You're in!</h1>
          <p className="text-zinc-400 max-w-xs mx-auto">Thanks for joining. Keep an eye on your inbox for something special.</p>
          <button onClick={() => setSubmitted(false)} className="text-sm text-zinc-500 hover:text-white transition-colors">
            Back to form
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-xl border border-white/10 mb-6">
            <Users size={32} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Join the Inner Circle</h1>
          <p className="text-zinc-400 text-lg">Get exclusive updates, early access to drops, and special rewards.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-white/20 focus:bg-white/10 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Phone (Optional)</label>
            <input 
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 (555) 000-0000"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-white/20 focus:bg-white/10 outline-none transition-all"
            />
          </div>
          <button className="w-full h-16 bg-white text-black rounded-2xl font-bold text-lg hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xl shadow-white/5">
            Subscribe Now
          </button>
        </form>

        <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> No Spam</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> One-Click Unsubscribe</span>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/join/:creatorId" element={<PublicLanding />} />
        
        {/* Dashboard Routes */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/fans" element={<Layout><FansView /></Layout>} />
        <Route path="/landing-config" element={<Layout><LandingConfig /></Layout>} />
        <Route path="/messages" element={<Layout><MessagesView /></Layout>} />
        <Route path="/settings" element={<Layout><div className="p-8 bg-white rounded-3xl border border-zinc-200">Settings coming soon...</div></Layout>} />
      </Routes>
    </Router>
  );
}
