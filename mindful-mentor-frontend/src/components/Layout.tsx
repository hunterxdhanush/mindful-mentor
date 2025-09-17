import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Navigation />
      <main className="md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}