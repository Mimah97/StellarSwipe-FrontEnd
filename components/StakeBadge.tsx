import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface StakeBadgeProps {
  stake?: number;
  reputation?: number;
  className?: string;
}

export function StakeBadge({ stake = 0, reputation = 0, className }: StakeBadgeProps) {
  if (!stake && !reputation) return null;

  const getTierColor = (score: number) => {
    if (score >= 80) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    if (score >= 60) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  };

  const getTierLabel = (score: number) => {
    if (score >= 80) return "Gold";
    if (score >= 60) return "Silver";
    return "Bronze";
  };

  const displayScore = reputation || stake;
  const tierColor = getTierColor(displayScore);
  const tierLabel = getTierLabel(displayScore);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border",
        tierColor,
        className
      )}
      title={`Provider reputation: ${reputation}%, Staked: $${stake?.toLocaleString()}`}
    >
      <Shield size={12} />
      <span>{tierLabel}</span>
    </div>
  );
}
