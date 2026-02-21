import React from "react";
import { Medal } from "lucide-react";
import { calculateAchievements, getAchievementRarityColor, getAchievementRarityBg } from "@/utils/achievements";
import { UserStats } from "@/types";
import Image from "next/image";
import { formatNumber } from "@/utils/calc";

const Achievements = ({
  userStats,
  classname,
}: {
  userStats: UserStats;
  classname?: string;
}) => {
  const achievements = calculateAchievements(userStats);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (achievements.length === 0) return null;

  return (
    <div className={`${classname} flex items-center justify-center flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}>
      <Image
        src={`/assets/1.webp`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-80 group-hover:opacity-100"
      />
      <div className="absolute top-2 left-2 md:top-3 md:left-3">
        <Medal className="size-7 md:size-8" />
        <p className="font-modernbold text-sm md:text-base pt-0.5">Achievements</p>
      </div>
      <p className={`font-modernbold absolute bottom-3 right-2 md:bottom-3 md:right-3 max-lg:right-2 ${formatNumber(unlockedCount).toString().length >= 4 ? "max-lg:text-4xl text-5xl lg:text-6xl" : "text-5xl lg:text-6xl"}`}>
        {formatNumber(unlockedCount)}
      </p>
    </div>
  );
};

export default Achievements; 