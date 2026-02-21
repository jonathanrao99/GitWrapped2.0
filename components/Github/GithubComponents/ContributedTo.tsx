import { formatNumber } from "@/utils/calc";
import { GitMerge } from "lucide-react";
import Image from "next/image";
import React from "react";

const ContributedTo = ({
  contributedCount,
  classname,
}: {
  contributedCount: number;
  classname: string;
}) => {
  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/grad11.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-70 group-hover:opacity-100 object-left-bottom max-sm:object-right-top"
        aria-hidden
      />
      <div className="absolute top-2 left-2 max-sm:top-1.5 max-sm:left-1.5 max-lg:flex max-md:block gap-1.5">
        <GitMerge className="text-white size-7 md:size-8" />
        <p className="font-modernbold text-sm lg:text-base lg:pt-0">Contrib<span className="sm:hidden">-</span>uted To</p>
      </div>
      <div className="absolute bottom-3 right-2 text-right max-lg:right-1.5">
        <p className={`font-modernbold text-5xl max-sm:text-3xl max-lg:text-4xl ${formatNumber(contributedCount).toString().length >= 3 ? "max-lg:right-1" : ""} `}>{formatNumber(contributedCount)}</p>
        {contributedCount === 0 && (
          <p className="text-xs text-white/70 mt-0.5">Start contributing!</p>
        )}
      </div>
    </div>
  );
};

export default ContributedTo;