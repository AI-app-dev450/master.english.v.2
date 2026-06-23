import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Globe,
  Sun,
  Volume2,
  Shuffle,
  Lightbulb,
  Cloud,
  Trash2,
  Save,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/App';
import type { CEFRLevel } from '@/types/vocabulary';

export function Settings() {
  const { vocabulary, addToast } = useApp();
  const [activeSection, setActiveSection] = useState<'account' | 'study' | 'display' | 'data'>('account');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Account form state
  const [username, setUsername] = useState(vocabulary.profile.username);
  const [email, setEmail] = useState(vocabulary.profile.email);
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>(vocabulary.profile.cefrLevel);
  const [dailyGoal, setDailyGoal] = useState(vocabulary.profile.dailyGoal);

  const handleSaveProfile = () => {
    vocabulary.updateProfile({
      username,
      email,
      cefrLevel,
      dailyGoal,
    });
    addToast('Profile saved successfully', 'success');
  };

  const handleResetProgress = () => {
    vocabulary.resetProgress();
    setShowResetConfirm(false);
    addToast('All progress has been reset', 'success');
  };

  const sections = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'study' as const, label: 'Study', icon: Lightbulb },
    { id: 'display' as const, label: 'Display', icon: Sun },
    { id: 'data' as const, label: 'Data', icon: Cloud },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A2E]">Settings</h1>
        <p className="mt-1 text-sm text-[#6B6B80]">Configure your learning preferences</p>
      </div>

      {/* Settings Layout */}
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Sidebar */}
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-white border border-[#E5E5DD] text-[#1A1A2E] shadow-sm'
                  : 'text-[#6B6B80] hover:bg-white/50'
              }`}
            >
              <section.icon className="h-4 w-4" strokeWidth={1.5} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeSection === 'account' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-[#E5E5DD] bg-white p-6 space-y-6"
            >
              <h2 className="text-lg font-semibold text-[#1A1A2E]">Account Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#1A1A2E]">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-[10px] border border-[#E5E5DD] px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#1A1A2E]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[10px] border border-[#E5E5DD] px-4 py-2.5 text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#1A1A2E]">CEFR Level</label>
                  <div className="flex gap-2">
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setCefrLevel(level)}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                          cefrLevel === level
                            ? 'bg-[#F5A623] text-white'
                            : 'bg-[#F5F5F0] text-[#6B6B80] hover:bg-[#EBEBE6]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#1A1A2E]">
                    Daily Goal: {dailyGoal} words
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#9B9BAE]">
                    <span>5</span>
                    <span>50</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 rounded-[10px] bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E09400]"
              >
                <Save className="h-4 w-4" strokeWidth={1.5} />
                Save Changes
              </button>
            </motion.div>
          )}

          {activeSection === 'study' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-[#E5E5DD] bg-white p-6 space-y-6"
            >
              <h2 className="text-lg font-semibold text-[#1A1A2E]">Study Preferences</h2>

              <div className="space-y-4">
                <ToggleSetting
                  label="Show Translations"
                  description="Display Lao and Thai translations"
                  icon={Globe}
                  enabled={vocabulary.settings.showTranslations}
                  onChange={(val) => vocabulary.updateSettings({ showTranslations: val })}
                />
                <ToggleSetting
                  label="Auto-play Pronunciation"
                  description="Automatically play audio for words"
                  icon={Volume2}
                  enabled={vocabulary.settings.autoPlayPronunciation}
                  onChange={(val) => vocabulary.updateSettings({ autoPlayPronunciation: val })}
                />
                <ToggleSetting
                  label="Shuffle Cards"
                  description="Randomize card order in flashcard mode"
                  icon={Shuffle}
                  enabled={vocabulary.settings.shuffleCards}
                  onChange={(val) => vocabulary.updateSettings({ shuffleCards: val })}
                />
                <ToggleSetting
                  label="Show Hints"
                  description="Display hint text during study"
                  icon={Lightbulb}
                  enabled={vocabulary.settings.showHints}
                  onChange={(val) => vocabulary.updateSettings({ showHints: val })}
                />
              </div>
            </motion.div>
          )}

          {activeSection === 'display' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-[#E5E5DD] bg-white p-6 space-y-6"
            >
              <h2 className="text-lg font-semibold text-[#1A1A2E]">Display Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[#1A1A2E]">Theme</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'light' as const, label: 'Light' },
                      { value: 'dark' as const, label: 'Dark' },
                      { value: 'system' as const, label: 'System' },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => vocabulary.updateSettings({ theme: theme.value })}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                          vocabulary.settings.theme === theme.value
                            ? 'bg-[#F5A623] text-white'
                            : 'bg-[#F5F5F0] text-[#6B6B80] hover:bg-[#EBEBE6]'
                        }`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[#1A1A2E]">Font Size</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'small' as const, label: 'Small' },
                      { value: 'medium' as const, label: 'Medium' },
                      { value: 'large' as const, label: 'Large' },
                    ].map((size) => (
                      <button
                        key={size.value}
                        onClick={() => vocabulary.updateSettings({ fontSize: size.value })}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                          vocabulary.settings.fontSize === size.value
                            ? 'bg-[#F5A623] text-white'
                            : 'bg-[#F5F5F0] text-[#6B6B80] hover:bg-[#EBEBE6]'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'data' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Google Sheets */}
              <div className="rounded-2xl border border-[#E5E5DD] bg-white p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#1A1A2E]">Google Sheets Sync</h2>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#1A1A2E]">Web App URL</label>
                  <input
                    type="text"
                    value={vocabulary.settings.googleSheetUrl}
                    onChange={(e) => vocabulary.updateSettings({ googleSheetUrl: e.target.value })}
                    className="w-full rounded-[10px] border border-[#E5E5DD] px-4 py-2.5 text-sm"
                    placeholder="https://script.google.com/macros/s/.../exec"
                  />
                </div>
                <ToggleSetting
                  label="Auto-sync"
                  description="Automatically sync when adding new words"
                  icon={Cloud}
                  enabled={vocabulary.settings.autoSync}
                  onChange={(val) => vocabulary.updateSettings({ autoSync: val })}
                />
                <button
                  onClick={async () => {
                    const result = await vocabulary.syncToGoogleSheets();
                    addToast(result.message, result.success ? 'success' : 'error');
                  }}
                  disabled={!vocabulary.settings.googleSheetUrl}
                  className="flex items-center gap-2 rounded-[10px] border border-[#E5E5DD] bg-white px-5 py-2.5 text-sm font-medium text-[#1A1A2E] hover:bg-[#F5F5F0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                  Sync Now
                </button>
              </div>

              {/* Data Management */}
              <div className="rounded-2xl border border-[#E5E5DD] bg-white p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#1A1A2E]">Data Management</h2>
                <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-[#FF3B30] mt-0.5" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1A2E]">Reset Progress</h3>
                      <p className="text-xs text-[#6B6B80] mt-1">
                        This will reset all study progress, streaks, and session history. Your words will be kept.
                      </p>
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="mt-3 flex items-center gap-2 rounded-lg border border-[#FF3B30] bg-white px-4 py-2 text-sm font-medium text-[#FF3B30] hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        Reset Progress
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-6 w-6 text-[#FF3B30]" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1A1A2E]">Reset All Progress?</h3>
              <p className="mb-6 text-sm text-[#6B6B80]">
                This will reset study counts, streaks, and session history. Your words will not be deleted.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-[10px] border border-[#E5E5DD] bg-white py-2.5 text-sm font-medium text-[#1A1A2E] hover:bg-[#F5F5F0]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  className="flex-1 rounded-[10px] bg-[#FF3B30] py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function ToggleSetting({
  label,
  description,
  icon: Icon,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F5F0]">
          <Icon className="h-5 w-5 text-[#6B6B80]" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-sm font-medium text-[#1A1A2E]">{label}</div>
          <div className="text-xs text-[#9B9BAE]">{description}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          enabled ? 'bg-[#F5A623]' : 'bg-[#E5E5DD]'
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
