import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-gentle-pulse">
          <span className="text-6xl">🧘‍♀️</span>
        </div>
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <p className="mb-8 text-xl text-white/80">This page seems to have wandered off the path</p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center px-8 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-bounce backdrop-blur-sm border border-white/20"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
