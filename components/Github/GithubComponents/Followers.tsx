import { formatNumber } from "@/utils/calc";
import { UserRoundCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

const Followers = ({
  followers,
  classname,
}: {
  followers: number;
  classname?: string;
}) => {
  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/frame2.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-70 group-hover:opacity-100"
        aria-hidden
      />
      <div className="absolute top-2 left-2 max-sm:top-1.5 max-sm:left-1.5">
        <UserRoundCheck className="size-7 md:size-8" />
        <p className="font-modernbold text-sm lg:text-base">Followers</p>
      </div>
      <p className={`font-modernbold absolute bottom-3 right-2 max-xl:right-1.5 max-sm:text-3xl ${formatNumber(followers).toString().length >= 3 ? "max-lg:text-4xl text-5xl max-lg:text-3xl" : "text-5xl max-lg:text-4xl"} `}>
              {formatNumber(followers)}
            </p>
    </div>
  );
};

export default Followers;