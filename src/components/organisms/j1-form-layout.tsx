import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { orelega_one } from "@/lib/fonts";
import ProfileCard from "../atoms/ui/profile-card";

interface J1FormLayoutProps {
  children: React.ReactNode;
  firstName?: string;
  completedSections?: number;
  totalSections?: number;
  sectionStatus?: Array<{
    name: string;
    completed: boolean;
    step: number;
  }>;
}

const J1FormLayout: React.FC<J1FormLayoutProps> = ({
  children,
  firstName,
  completedSections,
  totalSections,
  sectionStatus,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Collapse when scrolled past 200px
      const shouldCollapse = window.scrollY > 200;
      setIsCollapsed(shouldCollapse);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full gap-8 max-w-7xl mx-auto p-4 md:p-8">
      {/* Left column - Profile Info - Now sticky with offset for navbar height */}
      <div className="w-full md:w-1/3 md:sticky md:top-20 self-start transition-all duration-300 ease-in-out">
        <ProfileCard
          isCollapsed={isCollapsed}
          completedSections={completedSections}
          totalSections={totalSections}
          sectionStatus={sectionStatus}
        />
      </div>

      {/* Right column - Form */}
      <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6">
        <h2
          className={cn(
            orelega_one.className,
            "text-xl md:text-2xl mb-6 text-wma-darkTeal"
          )}
        >
          Submit J1 Visa Application
        </h2>
        {children}
      </div>
    </div>
  );
};

export default J1FormLayout;
