import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  // Run cleanup on app mount
  useEffect(() => {
    const removedCount = autoCleanup();
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old logs.`);
    }
  }, []);

  // Custom hooks
  const { logs, addLog, isLoading: isLogsLoading } = useSmokingLogs();
  const { allTriggers, isLoading: isTriggersLoading } = useTriggers();
  const { monthlyGoal, currentMonthCount, progress, isLoading: isGoalLoading } = useGoal(logs);
  const { show, message, showToast, hideToast } = useToast();
  const { isDark, themeMode, setTheme } = useDarkMode();

  // const isAppLoading = isLogsLoading || isTriggersLoading || isGoalLoading;

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
    <Layout>
      <Routes>
        <Route
          path="/log"
          element={
            <LogPage
              triggers={allTriggers}
              onAddLog={handleAddLog}
              logs={logs}
              isLoading={isLogsLoading || isTriggersLoading}
            />
          }
        />
        <Route
          path="/insights"
          element={
            <InsightsPage
              logs={logs}
              monthlyGoal={monthlyGoal}
              currentMonthCount={currentMonthCount}
              progress={progress}
              isLoading={isLogsLoading || isGoalLoading}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsPage
              monthlyGoal={monthlyGoal}
              logs={logs}
              onClearData={handleClearData}
              isDark={isDark}
              themeMode={themeMode}
              onSetTheme={setTheme}
              isLoading={isGoalLoading || isLogsLoading}
            />
          }
        />
        <Route path="/" element={<Navigate to="/log" replace />} />
      </Routes>

      <Toast show={show} message={message} onClose={hideToast} />
    </Layout>
  );
}

export default App;

