import { formatNumber } from "@/utils/calc";
import { Flame } from "lucide-react";
import Image from "next/image";
import React from "react";

const CurrentStreak = ({
  classname,
  streak,
  start,
  end,
}: {
  streak: number;
  start: string | null;
  end: string | null;
  classname?: string;
}) => {
  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1.5 md:gap-2 relative rounded-xl md:rounded-2xl overflow-hidden p-3 max-lg:p-2 bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/frame9.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 top-1 -z-10 rounded-lg md:rounded-xl opacity-80 group-hover:opacity-100"
      />
      <div className="relative items-center justify-center">
        <div className="absolute inset-1/2 size-16 -z-10 bg-gradient-to-tr from-blue-700/70 blur-[14px] rounded-full to-blue-900/30 transform -translate-x-1/2 -translate-y-1/2 group-hover:from-blue-700/90 group-hover:to-blue-900/70"></div>
        <Flame className="size-10" />
      </div>
      <p className="font-modernbold text-sm lg:text-base">Current Streak</p>
      <p className="font-modernbold text-5xl lg:text-6xl">{formatNumber(streak)}</p>
      <p className="text-[10px] md:text-xs font-modernreg">
        {streak > 0 ? <>{end} - {start}</> : "No current streak"}
      </p>
    </div>
  );
};

export default CurrentStreak;