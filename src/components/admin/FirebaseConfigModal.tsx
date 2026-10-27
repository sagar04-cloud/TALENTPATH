import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  RefreshCw, 
  Radio, 
  ExternalLink,
  Code2,
  Trash2
} from 'lucide-react';
import { 
  getFirebaseConfig, 
  saveFirebaseConfig, 
  clearFirebaseConfig, 
  isFirebaseConfigured, 
  testFirebaseConnection,
  FirebaseClientConfig 
} from '../../lib/firebase';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal = ({ isOpen, onClose }: FirebaseConfigModalProps) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'json'>('fields');
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [databaseURL, setDatabaseURL] = useState('');
  const [rawSnippet, setRawSnippet] = useState('');

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getFirebaseConfig();
      if (current) {
        setApiKey(current.apiKey || '');
        setAuthDomain(current.authDomain || '');
        setProjectId(current.projectId || '');
        setStorageBucket(current.storageBucket || '');
        setMessagingSenderId(current.messagingSenderId || '');
        setAppId(current.appId || '');
        setDatabaseURL(current.databaseURL || '');
      }
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  // Parse raw Firebase console config snippet (e.g. const firebaseConfig = { apiKey: "..." })
  const handleParseSnippet = () => {
    try {
      // Parse JSON-like object with regex if standard JSON.parse fails on unquoted keys
      const extract = (key: string) => {
        const match = rawSnippet.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
        return match ? match[1] : '';
      };

      const parsedApiKey = extract('apiKey');
      const parsedAuthDomain = extract('authDomain');
      const parsedProjectId = extract('projectId');
      const parsedStorageBucket = extract('storageBucket');
      const parsedMessagingSenderId = extract('messagingSenderId');
      const parsedAppId = extract('appId');
      const parsedDatabaseURL = extract('databaseURL');

      if (parsedApiKey && parsedProjectId) {
        setApiKey(parsedApiKey);
        setAuthDomain(parsedAuthDomain || `${parsedProjectId}.firebaseapp.com`);
        setProjectId(parsedProjectId);
        setStorageBucket(parsedStorageBucket || `${parsedProjectId}.appspot.com`);
        setMessagingSenderId(parsedMessagingSenderId);
        setAppId(parsedAppId);
        if (parsedDatabaseURL) setDatabaseURL(parsedDatabaseURL);

        setActiveTab('fields');
        setTestResult({
          success: true,
          message: 'Firebase configuration extracted successfully! Click "Save Configuration" below.'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Could not extract valid Firebase keys from snippet. Please check the snippet format or fill the inputs directly.'
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: 'Invalid snippet format. Please fill the fields manually.'
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      setTestResult({
        success: false,
        message: 'API Key and Project ID are mandatory.'
      });
      return;
    }

    const config: FirebaseClientConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      databaseURL: databaseURL.trim()
    };

    saveFirebaseConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testFirebaseConnection();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Connection test failed.' });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to remove stored Firebase keys and revert to local storage?')) {
      clearFirebaseConfig();
      setApiKey('');
      setAuthDomain('');
      setProjectId('');
      setStorageBucket('');
      setMessagingSenderId('');
      setAppId('');
      setDatabaseURL('');
      setTestResult({ success: true, message: 'Firebase configuration cleared. Now running in Local Cache Mode.' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl relative text-left space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-brand-darkText hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-heading font-black text-xl text-brand-darkText">
                    Firebase Realtime Database Settings
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    isFirebaseConfigured()
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isFirebaseConfigured() ? 'Connected' : 'Local Fallback'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Connect your live Firebase project for real-time Firestore database synchronization and Firebase Authentication.
                </p>
              </div>
            </div>

            {/* Status alerts */}
            {testResult && (
              <div className={`p-3 rounded-2xl text-xs flex items-center ${
                testResult.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 text-red-600" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0 text-emerald-600" />
                <span>Configuration saved successfully! Real-time synchronization is now live.</span>
              </div>
            )}

            {/* Tabs for individual inputs vs raw paste */}
            <div className="flex border-b border-slate-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('fields')}
                className={`pb-2.5 px-4 border-b-2 transition-colors ${
                  activeTab === 'fields'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Key Inputs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`pb-2.5 px-4 border-b-2 transition-colors ${
                  activeTab === 'json'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Paste Console Snippet (Auto-Extract)
              </button>
            </div>

            {activeTab === 'json' ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Paste your `firebaseConfig` snippet from Firebase Console:
                  </label>
                  <textarea
                    rows={8}
                    value={rawSnippet}
                    onChange={(e) => setRawSnippet(e.target.value)}
                    placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "my-project.firebaseapp.com",\n  projectId: "my-project",\n  storageBucket: "my-project.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123456:web:abcd"\n};`}
                    className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-blue bg-slate-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleParseSnippet}
                  className="py-2.5 px-5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-bold text-xs uppercase tracking-wider shadow-pill transition-colors flex items-center"
                >
                  <Code2 className="w-4 h-4 mr-1.5" />
                  <span>Parse & Extract Keys</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      API Key (apiKey) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Project ID (projectId) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. talent-path-db"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Auth Domain (authDomain)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. project-id.firebaseapp.com"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      App ID (appId)
                    </label>
                    <input
                      type="text"
                      placeholder="1:123456789:web:abcd123"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Messaging Sender ID
                    </label>
                    <input
                      type="text"
                      placeholder="123456789"
                      value={messagingSenderId}
                      onChange={(e) => setMessagingSenderId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Storage Bucket
                    </label>
                    <input
                      type="text"
                      placeholder="project-id.appspot.com"
                      value={storageBucket}
                      onChange={(e) => setStorageBucket(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Realtime Database URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://project-id-default-rtdb.firebaseio.com"
                      value={databaseURL}
                      onChange={(e) => setDatabaseURL(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleTest}
                      disabled={testing || !apiKey || !projectId}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${testing ? 'animate-spin' : ''}`} />
                      <span>{testing ? 'Testing Connection...' : 'Test Connection'}</span>
                    </button>

                    {isFirebaseConfigured() && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="py-2.5 px-3 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        <span>Disconnect</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-heading font-bold text-xs uppercase tracking-wider shadow-pill transition-all"
                  >
                    Save & Activate Firebase
                  </button>
                </div>
              </form>
            )}

            {/* Informational helper footer */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-700 flex items-center">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-brand-blue" />
                Where do I find my Firebase credentials?
              </p>
              <p>
                1. Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-brand-blue underline font-semibold">Firebase Console</a> and select your project.<br />
                2. Click ⚙️ <strong>Project settings</strong> &gt; <strong>General</strong>.<br />
                3. Under <strong>Your apps</strong>, select your Web app &lt;/&gt; to copy the `firebaseConfig` object.<br />
                4. Paste the snippet above or insert the keys into your project's <code className="bg-slate-200 px-1 rounded">.env</code> file.
              </p>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
