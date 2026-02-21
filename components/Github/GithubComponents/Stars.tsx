import { formatNumber } from "@/utils/calc";
import { StarsIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const Stars = ({ classname, stars }: { classname: string; stars: number }) => {
  return (
    <div
      className={`${classname} flex items-start flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden p-3 bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/grain.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-70 group-hover:opacity-90"
      />
      <div className="absolute top-2 left-2 md:top-3 md:left-3">
        <StarsIcon className="size-9 md:size-10" />
        <p className="font-modernbold text-sm md:text-base">Stars Earned</p>
      </div>
      <p className="font-modernbold text-5xl max-lg:text-4xl absolute bottom-3 right-2 md:bottom-3 md:right-3">
        {formatNumber(stars)}
      </p>
    </div>
  );
};

export default Stars;
