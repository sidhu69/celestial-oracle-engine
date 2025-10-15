import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SplashScreen } from "@/components/SplashScreen";
import Index from "./pages/Index";
import AstrologyView from "./pages/AstrologyView";
import NotFound from "./pages/NotFound";
import { adService } from "./services/adMob";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize AdMob when app starts (with error handling)
    const initializeAds = async () => {
      try {
        await adService.initialize();
        await adService.showBanner();
        console.log('✅ AdMob setup complete');
      } catch (error) {
        console.log('ℹ️ Ad initialization skipped:', error);
      }
    };

    initializeAds();

    // Cleanup: hide banner when component unmounts
    return () => {
      adService.hideBanner().catch(() => {
        // Silently ignore errors on cleanup
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/astrology" element={<AstrologyView />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
