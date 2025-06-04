import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import TopBanner from "@/components/layout/TopBanner.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <TopBanner />
      <Header />
      <main
        className={`flex-grow ${isHomePage ? "" : "container mx-auto px-4 py-8"}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
