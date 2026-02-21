import { formatNumber } from "@/utils/calc";
import { BookMarked } from "lucide-react";
import Image from "next/image";
import React from "react";

const Repos = ({ repos, classname }: { repos: number; classname: string }) => {
  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1 md:gap-2 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/grad1.jpg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-70 group-hover:opacity-100"
      />
      <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2">
        <BookMarked className="size-5 md:size-6 lg:size-8" />
        <p className="font-modernbold text-xs md:text-sm lg:text-base pt-0.5">Repos<span className="max-sm:hidden">itories</span></p>
      </div>
      <p className={`font-modernbold absolute bottom-2 right-2 md:bottom-3 md:right-2 text-xl md:text-3xl lg:text-5xl ${formatNumber(repos).toString().length >= 4 ? "max-sm:right-1" : ""} `}>
        {formatNumber(repos)}
      </p>
    </div>
  );
};

export default Repos;