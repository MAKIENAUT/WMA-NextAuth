import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { dm_sans } from "@/lib/fonts";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Progress } from "./progress";

interface ProfileCardProps {
  isCollapsed?: boolean;
  completedSections?: number;
  totalSections?: number;
  sectionStatus?: Array<{
    name: string;
    completed: boolean;
    step: number;
  }>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  isCollapsed = false,
  completedSections = 0,
  totalSections = 4,
  sectionStatus = [],
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { data: session } = useSession();
  const displayName = session?.user?.name || "User";

  // Determine if we should show expanded content
  const showExpandedContent = !isCollapsed || isHovering;

  // Progress calculation
  const progressPercentage =
    totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "py-2" : "py-4"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Profile section */}
      <div className="rounded-lg border border-wma-darkTeal p-6 box-border shadow-sm transition-all duration-300 ease-in-out bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              showExpandedContent ? "h-16 w-16" : "h-10 w-10"
            )}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                width={showExpandedContent ? 64 : 40}
                height={showExpandedContent ? 64 : 40}
                className="rounded-full object-cover border-2 border-wma-darkTeal"
                alt="Profile picture"
              />
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-wma-darkTeal/10 text-wma-darkTeal border-2 border-wma-darkTeal font-medium",
                  showExpandedContent
                    ? "h-16 w-16 text-xl"
                    : "h-10 w-10 text-sm"
                )}
              >
                {displayName.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div className="text-center">
            <h3
              className={cn(
                dm_sans.className,
                "text-lg font-semibold text-wma-darkTeal"
              )}
            >
              {displayName}'s Profile
            </h3>
            {showExpandedContent && (
              <p className="text-sm text-wma-darkTeal/80">J1 Visa Applicant</p>
            )}
          </div>
        </div>

        {/* Content that appears/disappears based on collapsed state */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out flex-col gap-2 justify-center",
            showExpandedContent
              ? "max-h-60 opacity-100 mt-6"
              : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-wma-darkTeal/80">Application Status</span>
              <span className="font-medium text-wma-darkTeal">In Progress</span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="w-half border-wma-darkTeal text-wma-darkTeal hover:bg-wma-darkTeal/10 hover:text-wma-darkTeal"
            >
              View Full Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Application Checklist - always visible */}
      <div className="rounded-lg border border-wma-darkTeal p-6 shadow-sm mt-6 bg-white">
        <h4
          className={cn(
            dm_sans.className,
            "mb-4 text-lg font-semibold text-wma-darkTeal"
          )}
        >
          Application Progress
        </h4>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-wma-darkTeal/80">Completion</span>
            <span className="font-medium text-wma-darkTeal">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 bg-wma-darkTeal/10"
            indicatorClassName="bg-wma-darkTeal"
          />
        </div>

        {/* Checklist with visual indicators */}
        <ul className="space-y-4">
          {sectionStatus.map((section) => (
            <li key={section.name} className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  section.completed
                    ? "bg-wma-darkTeal border-wma-darkTeal text-white"
                    : "bg-white border-wma-darkTeal/30 text-wma-darkTeal/50"
                } text-xs font-medium`}
              >
                {section.step}
              </div>
              <span
                className={cn(
                  section.completed
                    ? "font-medium text-wma-darkTeal"
                    : "text-wma-darkTeal/70",
                  "transition-colors duration-200"
                )}
              >
                {section.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;
