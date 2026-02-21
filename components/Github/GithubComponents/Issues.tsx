import { formatNumber } from "@/utils/calc";
import Image from "next/image";
import React from "react";

const Issues = ({
  issues,
  classname,
}: {
  issues: number;
  classname: string;
}) => {
  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/grad4.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-[0.75] group-hover:opacity-90"
      />
      <div className="absolute inset-0 -z-[1] bg-black/30 rounded-lg md:rounded-xl" aria-hidden />
      <div className="absolute top-2 left-2 max-sm:top-1.5 max-sm:left-1.5">
        <Image
          src={`/icons/issues.svg`}
          alt=""
          width={80}
          height={80}
          className="size-7 md:size-8"
        />
        <p className="font-modernbold text-sm lg:text-base pt-0.5">Issues</p>
      </div>
      <div className="absolute bottom-3 right-2 max-xl:right-1.5 text-right">
        <p className={`font-modernbold max-sm:text-3xl ${formatNumber(issues).toString().length >= 3 ? "max-lg:text-3xl text-4xl lg:text-5xl" : "text-5xl max-lg:text-4xl"} `}>
          {formatNumber(issues)}
        </p>
        {issues === 0 && (
          <p className="text-xs text-white/70 mt-0.5">No open issues</p>
        )}
      </div>
    </div>
  );
};

export default Issues;