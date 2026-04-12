import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./components/AuthPage";
import { useDevVaultStore } from "./store/useDevVaultStore";

function App() {
  const { authToken, authReady, isAuthLoading, restoreSession } =
    useDevVaultStore();

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (isAuthLoading || !authReady) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-white/95 p-10 shadow-2xl shadow-slate-200/70 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <p className="text-center text-lg font-semibold">
            Loading your study vault…
          </p>
        </div>
      </div>
    );
  }

  if (!authToken) {
    return <AuthPage />;
  }

  return <DashboardPage />;
}

export default App;
