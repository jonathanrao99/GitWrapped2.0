import React from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { formatNumber } from "@/utils/calc";

const LongestStreak = ({
  streak,
  start,
  end,
  classname,
}: {
  streak: number;
  start: string | null;
  end: string | null;
  classname?: string;
}) => {
  return (
    <div className={`${classname} flex items-center justify-center flex-col gap-1 md:gap-2 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}>
        <Image
            src={`/assets/frame7.svg`}
            alt=""
            width={500}
            height={500}
            priority
            className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl group-hover:opacity-100 opacity-[0.88] cursor-pointer"
        />
        <p className="font-modernbold text-xs md:text-sm lg:text-base">Longest Streak</p>
        <Trophy className="size-5 md:size-6 lg:size-8"/>
        <p className="font-modernbold text-2xl md:text-4xl lg:text-5xl">{formatNumber(streak)}</p>
        <p className="text-[10px] md:text-xs font-modernreg">{start} – {end}</p>
    </div>
  );
};

export default LongestStreak;