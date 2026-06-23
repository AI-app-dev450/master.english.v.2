import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Flame, BookOpen, Target, TrendingUp, Calendar,
  Cloud, WifiOff, Upload, Download, Save, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/App';
import type { CEFRLevel } from '@/types/vocabulary';

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function UserDashboard() {
  const { currentUser, updateCurrentUserProfile, syncToGithub, loadFromGithub, isOnline } = useAuth();
  const { vocabulary, addToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>((currentUser?.cefrLevel as CEFRLevel) || 'A2');
  const [dailyGoal, setDailyGoal] = useState(currentUser?.dailyGoal || 10);
  const [syncing, setSyncing] = useState(false);

  const stats = vocabulary.getStats();

  const handleSaveProfile = () => {
    updateCurrentUserProfile({ username, cefrLevel, dailyGoal });
    vocabulary.updateProfile({ username, cefrLevel, dailyGoal });
    addToast('Profile updated', 'success');
    setEditing(false);
  };

  const handleSync = async () => {
    if (!isOnline) { addToast('No internet — saved offline', 'info'); return; }
    setSyncing(true);
    const data = {
      words: vocabulary.words,
      sessions: vocabulary.sessions,
      profile: vocabulary.profile,
      settings: vocabulary.settings,
      syncedAt: new Date().toISOString(),
    };
    const res = await syncToGithub(data, currentUser!.id);
    addToast(res.message, res.success ? 'success' : 'error');
    setSyncing(false);
  };

  const handlePull = async () => {
    if (!isOnline) { addToast('No internet connection', 'error'); return; }
    setSyncing(true);
    const res = await loadFromGithub(currentUser!.id);
    if (res.success && res.data) {
      const d = res.data as any;
      if (d.words) vocabulary.importWords(d.words);
      addToast('Data loaded from GitHub', 'success');
    } else {
      addToast(res.message, 'error');
    }
    setSyncing(false);
  };

  const progressPercent = stats.totalWords > 0
    ? Math.round((stats.learnedWords / stats.totalWords) * 100)
    : 0;

  const todaySessions = vocabulary.sessions.filter(s =>
    new Date(s.date).toDateString() === new Date().toDateString()
  );
  const todayWords = todaySessions.reduce((acc, s) => acc + s.wordsStudied, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white ${
          currentUser?.role === 'admin' ? 'bg-[#F5A623]' : 'bg-[#4A90E2]'
        }`}>
          {currentUser?.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">
            Welcome back, {currentUser?.username}!
          </h1>
          <p className="text-sm text-gray-500">
            {currentUser?.cefrLevel} learner · Joined {new Date(currentUser?.joinDate || '').toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto">
          {isOnline ? (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Cloud className="h-3 w-3" /> Online
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <WifiOff className="h-3 w-3" /> Offline
            </span>
          )}
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-[#1A1A2E] rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/70">Daily Goal Progress</span>
          <span className="text-sm font-medium">{todayWords} / {currentUser?.dailyGoal || 10} words</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (todayWords / (currentUser?.dailyGoal || 10)) * 100)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-[#F5A623] rounded-full"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-white/50 flex items-center justify-center gap-1"><Flame className="h-3 w-3 text-[#F5A623]" /> streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{stats.learnedWords}</div>
            <div className="text-xs text-white/50">mastered</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{stats.totalWords}</div>
            <div className="text-xs text-white/50">total words</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Words Learned', value: `${stats.learnedWords}/${stats.totalWords}`, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Study Sessions', value: stats.totalSessions, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Mastery', value: `${progressPercent}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Daily Goal', value: `${currentUser?.dailyGoal} words`, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(card => (
          <motion.div
            key={card.label}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="text-xl font-bold text-[#1A1A2E]">{card.value}</div>
            <div className="text-xs text-gray-500">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Sync Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-2">
          <Cloud className="h-4 w-4" /> Data Sync
        </h3>
        <p className="text-xs text-gray-500">Your data is always saved locally. Sync to GitHub to back up online and access from any device.</p>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex-1 py-2 bg-[#1A1A2E] text-white rounded-lg text-sm font-medium hover:bg-[#252540] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {syncing ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Push Backup
          </button>
          <button
            onClick={handlePull}
            disabled={syncing || !isOnline}
            className="flex-1 py-2 bg-[#4A90E2] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {syncing ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Restore
          </button>
        </div>
        {!isOnline && (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg flex items-center gap-1.5">
            <WifiOff className="h-3.5 w-3.5" /> You're offline. All changes saved locally.
          </p>
        )}
      </div>

      {/* Edit Profile */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-2">
            <User className="h-4 w-4" /> Profile Settings
          </h3>
          <button
            onClick={() => editing ? handleSaveProfile() : setEditing(true)}
            className="flex items-center gap-1.5 text-sm text-[#4A90E2] hover:text-blue-700 font-medium"
          >
            {editing ? <><CheckCircle2 className="h-4 w-4" /> Save</> : <><Save className="h-4 w-4" /> Edit</>}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CEFR Level</label>
              <div className="flex gap-1.5 flex-wrap">
                {CEFR_LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setCefrLevel(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      cefrLevel === l
                        ? 'bg-[#1A1A2E] text-white border-[#1A1A2E]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Daily Goal (words)</label>
              <input
                type="number"
                value={dailyGoal}
                onChange={e => setDailyGoal(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-[#1A1A2E]">{currentUser?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-[#1A1A2E]">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Level</span>
              <span className="font-medium text-[#1A1A2E]">{currentUser?.cefrLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Daily Goal</span>
              <span className="font-medium text-[#1A1A2E]">{currentUser?.dailyGoal} words/day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className={`font-medium capitalize ${currentUser?.role === 'admin' ? 'text-[#F5A623]' : 'text-[#4A90E2]'}`}>
                {currentUser?.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
