import React, { useEffect } from 'react';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import useChatStore from '../../store/chatStore';
import { listSessions, deleteSession, getSessionHistory } from '../../services/api';

const Sidebar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    sessions,
    setSessions,
    sessionsLoading,
    setSessionsLoading,
    sessionId,
    clearChat,
    loadSession,
    tenantId,
    ragMode,
    setRagMode,
    maxQueries,
    setMaxQueries,
    setTenantId,
  } = useChatStore();

  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab, tenantId]);

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const data = await listSessions(tenantId);
      setSessions(data.data?.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleLoadSession = async (sid) => {
    try {
      const data = await getSessionHistory(sid, tenantId);
      const history = data.data?.history || [];
      const messages = history.map((h, i) => ({
        id: h.id || `hist-${i}`,
        role: h.role,
        content: h.content,
        timestamp: h.timestamp,
      }));
      loadSession(sid, messages);
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  const handleDeleteSession = async (sid, e) => {
    e.stopPropagation();
    try {
      await deleteSession(sid, tenantId);
      fetchSessions();
      if (sessionId === sid) clearChat();
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const navItems = [
    { id: 'chat', label: 'ଚାଟ', labelEn: 'Chat', icon: HiOutlineChatBubbleLeftRight },
    { id: 'documents', label: 'ଡକ୍ୟୁମେଣ୍ଟ', labelEn: 'Documents', icon: HiOutlineDocumentText },
    { id: 'sessions', label: 'ସେସନ୍', labelEn: 'Sessions', icon: HiOutlineClock },
    { id: 'settings', label: 'ସେଟିଂ', labelEn: 'Settings', icon: HiOutlineCog6Tooth },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-border
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-odia-primary to-odia-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm odia-text">ଓ</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm text-text-primary">ଓଡ଼ିଆ AI</h1>
              <p className="text-xs text-text-muted">RAG Chatbot</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-darker text-text-muted"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat button */}
        <div className="p-3">
          <button
            onClick={() => {
              clearChat();
              setActiveTab('chat');
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed
              border-odia-primary text-odia-dark hover:bg-odia-bg transition-colors text-sm font-medium"
          >
            <HiOutlinePlusCircle className="w-5 h-5" />
            <span>ନୂଆ ଚାଟ</span>
            <span className="text-text-muted text-xs ml-auto">New Chat</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {navItems.map(({ id, label, labelEn, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                ${
                  activeTab === id
                    ? 'bg-odia-bg text-odia-dark font-medium'
                    : 'text-text-secondary hover:bg-surface-darker'
                }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="odia-text">{label}</span>
              <span className="text-xs text-text-muted ml-auto">{labelEn}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto mt-2 px-3">
          {/* Sessions list */}
          {activeTab === 'sessions' && (
            <div className="space-y-1 py-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Recent Sessions
                </h3>
                <button
                  onClick={fetchSessions}
                  className="text-xs text-primary hover:text-primary-dark"
                >
                  Refresh
                </button>
              </div>
              {sessionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-odia-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">
                  No sessions yet
                </p>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.session_id || s.id}
                    onClick={() => handleLoadSession(s.session_id || s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors
                      ${
                        sessionId === (s.session_id || s.id)
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-surface-darker text-text-secondary'
                      }`}
                  >
                    <HiOutlineChatBubbleLeftRight className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate flex-1">
                      {s.title || s.session_id || s.id}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSession(s.session_id || s.id, e)}
                      className="p-1 rounded hover:bg-error/10 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4 py-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Tenant ID
                </label>
                <input
                  type="text"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-odia-primary/30 focus:border-odia-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  RAG Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRagMode('simple')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                      ragMode === 'simple'
                        ? 'bg-odia-primary text-white'
                        : 'bg-surface-darker text-text-secondary hover:bg-surface-dark'
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setRagMode('multiquery')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                      ragMode === 'multiquery'
                        ? 'bg-odia-primary text-white'
                        : 'bg-surface-darker text-text-secondary hover:bg-surface-dark'
                    }`}
                  >
                    Multiquery
                  </button>
                </div>
              </div>

              {ragMode === 'multiquery' && (
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Max Queries: {maxQueries}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={maxQueries}
                    onChange={(e) => setMaxQueries(Number(e.target.value))}
                    className="w-full accent-odia-primary"
                  />
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>1</span>
                    <span>6</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-darker">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-text-secondary truncate">
              {tenantId}
            </span>
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-odia-bg text-odia-dark font-medium">
              {ragMode === 'multiquery' ? 'MQ' : 'S'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
