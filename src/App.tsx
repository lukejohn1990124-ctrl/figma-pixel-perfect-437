import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Connections from "./pages/Connections";
import PayPalDashboard from "./pages/PayPalDashboard";
import RemindersPage from "./pages/settings/Reminders";
import TemplatesPage from "./pages/settings/Templates";
import IntegrationsPage from "./pages/settings/Integrations";
import EmailProvidersPage from "./pages/settings/EmailProviders";
import BillingPage from "./pages/settings/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/paypal" element={<PayPalDashboard />} />
            <Route path="/settings/reminders" element={<RemindersPage />} />
            <Route path="/settings/templates" element={<TemplatesPage />} />
            <Route path="/settings/integrations" element={<IntegrationsPage />} />
            <Route path="/settings/email-providers" element={<EmailProvidersPage />} />
            <Route path="/settings/billing" element={<BillingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
