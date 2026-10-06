import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Download,
  Eye,
  EyeOff,
  Inbox,
  ShieldCheck,
  ArrowLeft,
  Clock,
  Sparkles,
  Key,
  Palette,
  Image as ImageIcon,
  Type,
  Save,
  RotateCcw,
  Upload,
  Layers,
  GraduationCap,
  Heart,
  Compass,
} from 'lucide-react';
import { useSiteContent, SiteConfig } from '../context/SiteContentContext';

interface ContactLead {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
  recipientEmail: string;
  read?: boolean;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'inbox' | 'theme' | 'images' | 'text';

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, reloadConfig } = useSiteContent();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('inbox');

  // Login Form States
  const [idInput, setIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard Leads States
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editable Site Config Form State (Local copy during editing)
  const [editConfig, setEditConfig] = useState<SiteConfig>(config);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync editConfig with current site config
  useEffect(() => {
    setEditConfig(config);
  }, [config]);

  // Check saved token on open
  useEffect(() => {
    if (isOpen) {
      const savedToken = localStorage.getItem('srishti_admin_token');
      if (savedToken) {
        verifyToken(savedToken);
      }
    }
  }, [isOpen]);

  const verifyToken = async (savedToken: string) => {
    try {
      const res = await fetch('/api/admin/check', {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setToken(savedToken);
        fetchLeads(savedToken);
      } else {
        localStorage.removeItem('srishti_admin_token');
        setIsAuthenticated(false);
        setToken(null);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idInput.trim(), password: passwordInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setIsAuthenticated(true);
        setToken(data.token);
        localStorage.setItem('srishti_admin_token', data.token);
        fetchLeads(data.token);
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Invalid ID or password.');
      }
    } catch (err) {
      setLoginError('Could not connect to server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchLeads = async (authToken: string) => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.leads) {
          setLeads(data.leads);
        }
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore
      }
    }
    localStorage.removeItem('srishti_admin_token');
    setIsAuthenticated(false);
    setToken(null);
    setLeads([]);
  };

  const toggleReadStatus = async (leadId: string, currentRead: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, read: !currentRead } : l))
        );
      }
    } catch (err) {
      console.error('Failed to toggle read status:', err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Date Received', 'Status', 'Message'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${new Date(l.receivedAt).toLocaleString()}"`,
      l.read ? 'Read' : 'New',
      `"${l.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `srishti_portfolio_leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save all edited website configuration
  const handleSaveSiteConfig = async () => {
    if (!token) return;
    setSaveLoading(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ config: editConfig }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateConfig(editConfig);
        setSaveMessage('All website changes saved successfully! Live website updated.');
        setTimeout(() => setSaveMessage(null), 4000);
      } else {
        setSaveError(data.error || 'Failed to save configuration.');
      }
    } catch (err) {
      setSaveError('Could not save to server.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Reset to default config
  const handleResetSiteConfig = async () => {
    if (!token) return;
    if (!confirm('Are you sure you want to reset all colors, text and settings to original defaults?')) return;

    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/reset-site-config', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.config) {
        setEditConfig(data.config);
        updateConfig(data.config);
        setSaveMessage('Website reset to defaults successfully.');
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } catch (err) {
      setSaveError('Failed to reset config.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Helper to upload an image from file input
  const handleImageUpload = (
    category: string,
    file: File,
    onSuccess: (uploadedUrl: string) => void
  ) => {
    if (!token) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('Please choose an image under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageBase64: base64Data,
            imageName: file.name,
            category,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.url) {
          onSuccess(data.url);
          setSaveMessage(`New ${category} image uploaded successfully!`);
          setTimeout(() => setSaveMessage(null), 3000);
        } else {
          alert(data.error || 'Failed to upload image.');
        }
      } catch (e) {
        alert('Image upload failed.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered Leads
  const filteredLeads = leads
    .filter((l) => {
      if (filter === 'unread') return !l.read;
      if (filter === 'read') return l.read;
      return true;
    })
    .filter((l) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
      );
    });

  const unreadCount = leads.filter((l) => !l.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-bold text-yellow-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="heading-font font-bold text-lg sm:text-xl leading-tight flex items-center gap-2">
                <span>Srishti Pathak — Admin Studio</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-yellow-400 text-purple-950">
                  Full Access
                </span>
              </div>
              <div className="text-xs text-purple-200">
                Logged ID: <span className="font-mono text-white">srishtidigital36@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={handleSaveSiteConfig}
                  disabled={saveLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveLoading ? 'Saving...' : 'Save Website'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </button>
          </div>
        </div>

        {/* Global Alert Messages */}
        {saveMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>{saveMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveMessage(null)}
              className="text-white hover:text-emerald-200 cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {saveError && (
          <div className="bg-red-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveError(null)}
              className="text-white hover:text-red-200 cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs (Available when logged in) */}
        {isAuthenticated && (
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'inbox'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-white/80'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inquiries Inbox ({leads.length})</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'theme'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-white/80'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Colors & Background</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'images'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-white/80'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Images Manager</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'text'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-white/80'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Text & Content Editor</span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSiteConfig}
                className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-slate-50/50">
          
          {/* VIEW 1: LOGIN FORM */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8">
              <div className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-purple-100 shadow-xl space-y-6">
                
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="heading-font text-2xl font-bold text-purple-950">
                    Administrator Sign In
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter your set administrator ID and password to edit the entire website (colors, images, text, background) and view inquiries.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                  {/* ID Field */}
                  <div>
                    <label className="block text-xs font-bold text-purple-950 mb-1">
                      Admin ID / Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={idInput}
                        onChange={(e) => setIdInput(e.target.value)}
                        placeholder="srishtidigital36@gmail.com"
                        autoComplete="off"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-purple-950 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter admin password manually"
                        autoComplete="new-password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Please enter your password manually to proceed.
                    </p>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-semibold text-sm shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loginLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-yellow-300" />
                        <span>Sign In to Admin Studio</span>
                      </>
                    )}
                  </button>
                </form>

              </div>
            </div>
          ) : (
            /* VIEW 2: AUTHENTICATED TABS */
            <div>
              {/* TAB 1: INBOX */}
              {activeTab === 'inbox' && (
                <div className="space-y-6">
                  {/* Top Stats Overview Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total Messages
                      </div>
                      <div className="heading-font text-3xl font-extrabold text-purple-950 mt-1">
                        {leads.length}
                      </div>
                      <div className="text-[11px] text-purple-700 font-medium mt-0.5">
                        Received from visitors
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Unread Inquiries
                      </div>
                      <div className="heading-font text-3xl font-extrabold text-blue-600 mt-1">
                        {unreadCount}
                      </div>
                      <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                        Needs attention
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-yellow-100 shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Routing Target
                      </div>
                      <div className="text-sm font-bold text-purple-950 truncate mt-2">
                        srishtidigital36@gmail.com
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live & Active</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Quick Action
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('theme')}
                        className="mt-2 text-xs font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Edit Colors & Site</span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Manager */}
                  <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-lg p-5 sm:p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            filter === 'all'
                              ? 'bg-white text-purple-950 shadow-xs'
                              : 'text-slate-600 hover:text-purple-950'
                          }`}
                        >
                          All ({leads.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilter('unread')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            filter === 'unread'
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-blue-700'
                          }`}
                        >
                          Unread ({unreadCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilter('read')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            filter === 'read'
                              ? 'bg-white text-purple-950 shadow-xs'
                              : 'text-slate-600 hover:text-purple-950'
                          }`}
                        >
                          Read ({leads.length - unreadCount})
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-56">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Search sender, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-purple-600"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={exportLeadsToCSV}
                          disabled={leads.length === 0}
                          title="Download CSV"
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => token && fetchLeads(token)}
                          title="Refresh"
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer"
                        >
                          <RefreshCw className={`w-4 h-4 ${leadsLoading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {leadsLoading ? (
                      <div className="py-16 text-center space-y-3">
                        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-slate-500 font-medium">Loading messages...</p>
                      </div>
                    ) : filteredLeads.length === 0 ? (
                      <div className="py-16 text-center space-y-2">
                        <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-sm font-bold text-slate-700">No messages found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredLeads.map((lead) => {
                          const isUnread = !lead.read;

                          return (
                            <div
                              key={lead.id}
                              className={`rounded-2xl border transition-all ${
                                isUnread
                                  ? 'bg-purple-50/40 border-purple-200 shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start sm:items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                                      isUnread
                                        ? 'bg-purple-700 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {lead.name.charAt(0).toUpperCase()}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-sm text-purple-950">
                                        {lead.name}
                                      </span>
                                      {isUnread && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                                          NEW
                                        </span>
                                      )}
                                      <span className="text-xs text-slate-500">
                                        &lt;{lead.email}&gt;
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                      <Clock className="w-3 h-3" />
                                      <span>{new Date(lead.receivedAt).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  <a
                                    href={`mailto:${lead.email}?subject=${encodeURIComponent(
                                      `Re: Inquiring from Srishti Pathak Portfolio`
                                    )}&body=${encodeURIComponent(
                                      `Hi ${lead.name},\n\nThank you for reaching out via my portfolio website!\n\nBest regards,\nSrishti Pathak`
                                    )}`}
                                    className="px-2.5 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>Reply</span>
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => toggleReadStatus(lead.id, Boolean(lead.read))}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                                      isUnread
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{isUnread ? 'Mark Read' : 'Unread'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="px-4 pb-4 pt-1">
                                <div className="p-3.5 rounded-xl bg-white border border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                  {lead.message}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: COLOR & BACKGROUND EDITOR (Color & Background change kar sakte hain) */}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-purple-100 shadow-md space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="heading-font text-xl font-bold text-purple-950 flex items-center gap-2">
                          <Palette className="w-5 h-5 text-purple-700" />
                          <span>Website Colors & Background Theme</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Change the colors across the website in real-time. Pick preset palettes or customize exact hex values.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveSiteConfig}
                        disabled={saveLoading}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-yellow-300" />
                        <span>Save Colors</span>
                      </button>
                    </div>

                    {/* Color Presets */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                        Quick Preset Themes
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          {
                            name: 'Signature Purple & Blue',
                            primary: '#6b21a8',
                            secondary: '#2563eb',
                            accent: '#facc15',
                            bg: '#ffffff',
                          },
                          {
                            name: 'Royal Violet & Cyan',
                            primary: '#581c87',
                            secondary: '#0284c7',
                            accent: '#f59e0b',
                            bg: '#ffffff',
                          },
                          {
                            name: 'Soft Lavender Minimal',
                            primary: '#7c3aed',
                            secondary: '#3b82f6',
                            accent: '#fbbf24',
                            bg: '#faf5ff',
                          },
                          {
                            name: 'Clean Slate & Emerald',
                            primary: '#4c1d95',
                            secondary: '#059669',
                            accent: '#eab308',
                            bg: '#f8fafc',
                          },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setEditConfig({
                                ...editConfig,
                                theme: {
                                  primaryColor: preset.primary,
                                  secondaryColor: preset.secondary,
                                  accentColor: preset.accent,
                                  backgroundColor: preset.bg,
                                },
                              });
                            }}
                            className="p-3 rounded-2xl border border-slate-200 hover:border-purple-400 text-left transition-all hover:shadow-xs cursor-pointer group"
                          >
                            <div className="flex items-center gap-1.5 mb-2">
                              <span
                                className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                                style={{ backgroundColor: preset.primary }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                                style={{ backgroundColor: preset.secondary }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                                style={{ backgroundColor: preset.accent }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs ml-auto"
                                style={{ backgroundColor: preset.bg }}
                                title="Background Color"
                              />
                            </div>
                            <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                              {preset.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Individual Color Pickers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-3">
                      {/* 1. Primary Color */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-purple-950 uppercase tracking-wide">
                          Primary Color (Headings & Buttons)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editConfig.theme.primaryColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, primaryColor: e.target.value },
                              })
                            }
                            className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                          />
                          <input
                            type="text"
                            value={editConfig.theme.primaryColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, primaryColor: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>

                      {/* 2. Secondary Color */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-blue-950 uppercase tracking-wide">
                          Secondary Color (Subtitles & Accents)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editConfig.theme.secondaryColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, secondaryColor: e.target.value },
                              })
                            }
                            className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                          />
                          <input
                            type="text"
                            value={editConfig.theme.secondaryColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, secondaryColor: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>

                      {/* 3. Accent Color (Yellow highlights) */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-amber-950 uppercase tracking-wide">
                          Accent Color (Highlight & Underline)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editConfig.theme.accentColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, accentColor: e.target.value },
                              })
                            }
                            className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                          />
                          <input
                            type="text"
                            value={editConfig.theme.accentColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, accentColor: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>

                      {/* 4. Background Color (Background change kar sakte hain) */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Background Color (Whole Website)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editConfig.theme.backgroundColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, backgroundColor: e.target.value },
                              })
                            }
                            className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                          />
                          <input
                            type="text"
                            value={editConfig.theme.backgroundColor}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                theme: { ...editConfig.theme, backgroundColor: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="p-5 rounded-2xl border-2 border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Live Preview Swatch
                      </div>
                      <div
                        className="p-6 rounded-2xl transition-colors border shadow-xs"
                        style={{ backgroundColor: editConfig.theme.backgroundColor }}
                      >
                        <h4
                          className="heading-font text-2xl font-bold mb-1"
                          style={{ color: editConfig.theme.primaryColor }}
                        >
                          Hi, I'm Srishti Pathak
                        </h4>
                        <p
                          className="text-sm font-semibold mb-3"
                          style={{ color: editConfig.theme.secondaryColor }}
                        >
                          B.Com Honours Student |{' '}
                          <span
                            className="px-1 rounded-sm"
                            style={{
                              backgroundColor: editConfig.theme.accentColor,
                              color: '#1e1b4b',
                            }}
                          >
                            Digital Marketing Learner
                          </span>
                        </p>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-default"
                          style={{ backgroundColor: editConfig.theme.primaryColor }}
                        >
                          Explore My Skills
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IMAGES MANAGER (Images change kar sakte hain) */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-purple-100 shadow-md space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="heading-font text-xl font-bold text-purple-950 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-purple-700" />
                          <span>Website Images Manager</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Change your personal photo, guitar photo, art photo, or craft photo anytime from your device.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveSiteConfig}
                        disabled={saveLoading}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-yellow-300" />
                        <span>Save Image Changes</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      {/* Image 1: Personal Hero Photo */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
                            1. Personal Hero Photo
                          </div>
                          <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 mb-3">
                            <img
                              src={editConfig.hero.photoUrl}
                              alt="Personal Photo"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Path: {editConfig.hero.photoUrl}
                          </div>
                        </div>

                        <label className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Upload New Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload('photo', file, (url) => {
                                  setEditConfig({
                                    ...editConfig,
                                    hero: { ...editConfig.hero, photoUrl: url },
                                  });
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Image 2: Guitar Photo */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
                            2. Guitar Hobby Photo
                          </div>
                          <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 mb-3">
                            <img
                              src={editConfig.hobbies.guitarImg}
                              alt="Guitar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Path: {editConfig.hobbies.guitarImg}
                          </div>
                        </div>

                        <label className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Change Guitar Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload('guitar', file, (url) => {
                                  setEditConfig({
                                    ...editConfig,
                                    hobbies: { ...editConfig.hobbies, guitarImg: url },
                                  });
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Image 3: Art Photo */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
                            3. Art Hobby Photo
                          </div>
                          <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 mb-3">
                            <img
                              src={editConfig.hobbies.artImg}
                              alt="Art"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Path: {editConfig.hobbies.artImg}
                          </div>
                        </div>

                        <label className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Change Art Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload('art', file, (url) => {
                                  setEditConfig({
                                    ...editConfig,
                                    hobbies: { ...editConfig.hobbies, artImg: url },
                                  });
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Image 4: Craft Photo */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
                            4. Craft Hobby Photo
                          </div>
                          <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 mb-3">
                            <img
                              src={editConfig.hobbies.craftImg}
                              alt="Craft"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Path: {editConfig.hobbies.craftImg}
                          </div>
                        </div>

                        <label className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Change Craft Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload('craft', file, (url) => {
                                  setEditConfig({
                                    ...editConfig,
                                    hobbies: { ...editConfig.hobbies, craftImg: url },
                                  });
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TEXT & CONTENT EDITOR (Text change kar sakte hain) */}
              {activeTab === 'text' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-purple-100 shadow-md space-y-8">
                    
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="heading-font text-xl font-bold text-purple-950 flex items-center gap-2">
                          <Type className="w-5 h-5 text-purple-700" />
                          <span>Website Text & Content Editor</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Edit any text, headlines, paragraphs, scores, and details across all sections of your website.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveSiteConfig}
                        disabled={saveLoading}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-yellow-300" />
                        <span>Save All Text</span>
                      </button>
                    </div>

                    {/* Section 1: Hero Text */}
                    <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
                      <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span>1. Hero / Home Section Text</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Greeting Kicker
                          </label>
                          <input
                            type="text"
                            value={editConfig.hero.introKicker}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                hero: { ...editConfig.hero, introKicker: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editConfig.hero.name}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                hero: { ...editConfig.hero, name: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold text-purple-950"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Professional Headline Subtitle
                        </label>
                        <input
                          type="text"
                          value={editConfig.hero.headline}
                          onChange={(e) =>
                            setEditConfig({
                              ...editConfig,
                              hero: { ...editConfig.hero, headline: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Hero Introduction Bio
                        </label>
                        <textarea
                          rows={3}
                          value={editConfig.hero.bio}
                          onChange={(e) =>
                            setEditConfig({
                              ...editConfig,
                              hero: { ...editConfig.hero, bio: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Section 2: About Me Text */}
                    <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-4">
                      <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>2. About Me Section Text</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            value={editConfig.about.heading}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                about: { ...editConfig.about, heading: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={editConfig.about.subtitle}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                about: { ...editConfig.about, subtitle: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            About Paragraph 1 (Studies & Focus)
                          </label>
                          <textarea
                            rows={2}
                            value={editConfig.about.block1}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                about: { ...editConfig.about, block1: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            About Paragraph 2 (Creative & Tech Integration)
                          </label>
                          <textarea
                            rows={2}
                            value={editConfig.about.block2}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                about: { ...editConfig.about, block2: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            About Paragraph 3 (Creative Activities)
                          </label>
                          <textarea
                            rows={2}
                            value={editConfig.about.block3}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                about: { ...editConfig.about, block3: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            About Paragraph 4 (Career Goal)
                          </label>
                          <textarea
                            rows={2}
                            value={editConfig.about.block4}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                about: { ...editConfig.about, block4: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>

                      {/* Quick Intro Fields in About Card */}
                      <div className="pt-3 border-t border-blue-200/60 space-y-3">
                        <div className="text-xs font-bold text-slate-700">
                          Quick Introduction Card Data
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Class 12 Score
                            </label>
                            <input
                              type="text"
                              value={editConfig.about.quickIntro.class12}
                              onChange={(e) =>
                                setEditConfig({
                                  ...editConfig,
                                  about: {
                                    ...editConfig.about,
                                    quickIntro: {
                                      ...editConfig.about.quickIntro,
                                      class12: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Class 10 Score
                            </label>
                            <input
                              type="text"
                              value={editConfig.about.quickIntro.class10}
                              onChange={(e) =>
                                setEditConfig({
                                  ...editConfig,
                                  about: {
                                    ...editConfig.about,
                                    quickIntro: {
                                      ...editConfig.about.quickIntro,
                                      class10: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Hobbies List
                            </label>
                            <input
                              type="text"
                              value={editConfig.about.quickIntro.interests}
                              onChange={(e) =>
                                setEditConfig({
                                  ...editConfig,
                                  about: {
                                    ...editConfig.about,
                                    quickIntro: {
                                      ...editConfig.about.quickIntro,
                                      interests: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Education & Scores */}
                    <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
                      <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-purple-700" />
                        <span>3. Education Section Text</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            B.Com Degree Status
                          </label>
                          <input
                            type="text"
                            value={editConfig.education.bcomStatus}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                education: {
                                  ...editConfig.education,
                                  bcomStatus: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Class 12 Percentage
                          </label>
                          <input
                            type="text"
                            value={editConfig.education.class12Score}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                education: {
                                  ...editConfig.education,
                                  class12Score: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Class 10 Percentage
                          </label>
                          <input
                            type="text"
                            value={editConfig.education.class10Score}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                education: {
                                  ...editConfig.education,
                                  class10Score: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Beyond Academics Text
                        </label>
                        <textarea
                          rows={2}
                          value={editConfig.education.beyondAcademicsText}
                          onChange={(e) =>
                            setEditConfig({
                              ...editConfig,
                              education: {
                                ...editConfig.education,
                                beyondAcademicsText: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Section 4: Contact & Social Info */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-700" />
                        <span>4. Contact Information & Links</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Direct Email
                          </label>
                          <input
                            type="email"
                            value={editConfig.contact.email}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                contact: { ...editConfig.contact, email: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold text-purple-950"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Instagram Username
                          </label>
                          <input
                            type="text"
                            value={editConfig.contact.instagram}
                            onChange={(e) =>
                              setEditConfig({
                                ...editConfig,
                                contact: { ...editConfig.contact, instagram: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp Default Greeting Text
                        </label>
                        <input
                          type="text"
                          value={editConfig.contact.whatsappText}
                          onChange={(e) =>
                            setEditConfig({
                              ...editConfig,
                              contact: { ...editConfig.contact, whatsappText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveSiteConfig}
                        disabled={saveLoading}
                        className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      >
                        <Save className="w-4 h-4 text-yellow-300" />
                        <span>{saveLoading ? 'Saving All Changes...' : 'Save All Website Text'}</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
