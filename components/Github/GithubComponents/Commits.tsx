import { formatNumber } from "@/utils/calc";
import { Command } from "lucide-react";
import Image from "next/image";
import React from "react";

const Commit = ({
  commits,
  classname,
}: {
  commits: number;
  classname: string;
}) => {
  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/grad2.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-80 group-hover:opacity-100"
      />
      <div className="absolute top-2 left-2 md:top-3 md:left-3">
        <Command className="size-7 md:size-8" />
        <p className="font-modernbold text-sm md:text-base pt-0.5">
          Total <br /> Commits
        </p>
      </div>
      <p
        className={`font-modernbold absolute bottom-3 right-2 md:bottom-3 md:right-3 max-lg:right-2 ${formatNumber(commits).toString().length >= 4 ? "max-lg:text-4xl text-5xl lg:text-6xl" : "text-5xl lg:text-6xl"}`}
      >
        {formatNumber(commits)}
      </p>
    </div>
  );
};

export default Commit;
