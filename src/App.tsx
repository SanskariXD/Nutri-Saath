import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingGate from "@/hooks/useOnboardingGate";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import FoodAssistant from "./pages/FoodAssistant";
import Scanner from "./pages/Scanner";
import BillScan from "./pages/BillScan";
import ProductDetail from "./pages/ProductDetail";
import ProductNotFound from "./pages/ProductNotFound";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Info from "./pages/Info";
import BillSummary from "./pages/BillSummary";
import Landing from "./pages/Landing";
import GetStarted from "./pages/GetStarted";
import ProducerLayout from "./components/layout/ProducerLayout";
import ProducerDashboard from "./pages/producer/ProducerDashboard";
import LabelWizard from "./pages/producer/LabelWizard";
import TrustCode from "./pages/producer/TrustCode";
import BatchRecall from "./pages/producer/BatchRecall";
import ComplianceProfile from "./pages/producer/ComplianceProfile";
import MarketTrends from "./pages/producer/MarketTrends";
import PublicBatchPage from "./components/trust/PublicBatchPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OnboardingGate>
          <Routes>
            {/* Landing & Role Selection */}
            <Route path="/" element={<Landing />} />
            <Route path="/start" element={<GetStarted />} />
            <Route path="/login" element={<Login />} />

            {/* Consumer Routes */}
            <Route path="/consumer" element={<Index />} />
            <Route path="/consumer/profile" element={<Profile />} />
            <Route path="/consumer/learn" element={<Learn />} />
            <Route path="/consumer/food-assistant" element={<FoodAssistant />} />
            <Route path="/consumer/scan" element={<Scanner />} />
            <Route path="/consumer/search" element={<Search />} />
            <Route path="/consumer/info" element={<Info />} />
            <Route path="/consumer/bill-scan" element={<BillScan />} />
            <Route path="/consumer/product/not-found/:barcode" element={<ProductNotFound />} />
            <Route path="/consumer/product/:barcode" element={<ProductDetail />} />
            <Route path="/consumer/bill-summary" element={<BillSummary />} />

            {/* Producer Routes */}
            <Route path="/producer" element={<ProducerLayout />}>
              <Route index element={<ProducerDashboard />} />
              <Route path="profile" element={<ComplianceProfile />} />
              <Route path="wizard" element={<LabelWizard />} />
              <Route path="trust-code" element={<TrustCode />} />
              <Route path="recalls" element={<BatchRecall />} />
              <Route path="market" element={<MarketTrends />} />
            </Route>

            {/* Public Verification */}
            <Route path="/verify/:trustCode" element={<PublicBatchPage />} />

            {/* Legacy/Fallback Routes (Redirect to new structure or 404) */}
            <Route path="/product/:barcode" element={<Navigate to="/consumer/product/:barcode" replace />} />
            <Route path="/scan" element={<Scanner />} /> {/* Keep for legacy external links if needed, or redirect */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OnboardingGate>
      </TooltipProvider>
    </BrowserRouter>
  );
};

export default App;
