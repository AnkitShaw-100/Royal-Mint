import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from "@/lib/clerk";
import { HomePage } from "@/components/pages/HomePage";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { AccountsPage } from "@/components/pages/AccountsPage";
import { TransferPage } from "@/components/pages/TransferPage";
import { HistoryPage } from "@/components/pages/HistoryPage";
import { ProfilePage } from "@/components/pages/ProfilePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/transfer" element={<TransferPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const app = (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );

  if (!isClerkConfigured) return app;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>{app}</ClerkProvider>
  );
}
