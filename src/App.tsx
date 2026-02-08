import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { LogPage } from './pages/LogPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Toast } from './components/common/Toast';
import { useSmokingLogs } from './hooks/useSmokingLogs';
import { useTriggers } from './hooks/useTriggers';
import { useGoal } from './hooks/useGoal';
import { useToast } from './hooks/useToast';
import { useDarkMode } from './hooks/useDarkMode';
import { autoCleanup } from './services/dataCleanup';
import { storage } from './services/storage';
import type { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('log');

  // Run cleanup on app mount
  useEffect(() => {
    const removedCount = autoCleanup();
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old logs.`);
    }
  }, []);

  // Custom hooks
  const { logs, addLog } = useSmokingLogs();
  const { allTriggers } = useTriggers();
  const { monthlyGoal, currentMonthCount, progress } = useGoal(logs);
  const { show, message, showToast, hideToast } = useToast();
  const { isDark, themeMode, setTheme } = useDarkMode();

  // Handle adding a log
  const handleAddLog = (trigger: string) => {
    addLog(trigger);
    showToast('Entry logged');
  };

  const handleClearData = () => {
    storage.clearAll();
    window.location.reload();
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'log' && (
        <LogPage
          triggers={allTriggers}
          onAddLog={handleAddLog}
          logs={logs}
        />
      )}

      {activeTab === 'insights' && (
        <InsightsPage
          logs={logs}
          monthlyGoal={monthlyGoal}
          currentMonthCount={currentMonthCount}
          progress={progress}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPage
          monthlyGoal={monthlyGoal}
          logs={logs}
          onClearData={handleClearData}
          isDark={isDark}
          themeMode={themeMode}
          onSetTheme={setTheme}
        />
      )}

      <Toast show={show} message={message} onClose={hideToast} />
    </Layout>
  );
}

export default App;
