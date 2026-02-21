import { formatNumber } from "@/utils/calc";
import Image from "next/image";
import React from "react";

const PRs = ({ pr, classname }: { pr: number; classname: string }) => {
  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/grad5.svg`}
        alt=""
        width={500}
        height={500}
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-70 group-hover:opacity-100 object-right-bottom"
        aria-hidden
      />
      <div className="absolute top-2 left-2">
        <Image
          src={`/icons/pr.svg`}
          alt="Pull requests icon"
          width={80}
          height={80}
          priority
          className="size-7 md:size-8"
        />
        <p className="font-modernbold text-sm lg:text-base pt-0.5">PRs</p>
      </div>
      <p
        className={`font-modernbold absolute bottom-3 right-2 max-lg:right-1.5 max-sm:text-3xl ${formatNumber(pr).toString().length >= 3 ? "max-lg:text-3xl text-4xl lg:text-5xl" : "text-5xl max-lg:text-4xl"} `}
      >
        {formatNumber(pr)}
      </p>
    </div>
  );
};

export default PRs;
