import React from "react";
import { Calendar } from "lucide-react";
import Image from "next/image";

const MostActiveDay = ({
  mostActiveDay,
  classname,
}: {
  mostActiveDay: string | null;
  classname?: string;
}) => {
  if (mostActiveDay == null) return null;

  return (
    <div
      className={`${classname} flex items-center justify-center flex-col gap-1.5 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}
    >
      <Image
        src={`/assets/grad5.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-70 group-hover:opacity-100 object-right-bottom"
      />
      <div className="absolute top-2 left-2 max-sm:top-1.5 max-sm:left-1.5">
        <Calendar className="size-7 md:size-8 text-white" />
        <p className="font-modernbold text-sm lg:text-base pt-0.5">Most Active Day</p>
      </div>
      <p className="font-modernbold absolute bottom-3 right-2 max-lg:right-1.5 text-xl md:text-2xl lg:text-3xl max-w-[55%] text-right leading-tight truncate">
        {mostActiveDay}
      </p>
    </div>
  );
};

export default MostActiveDay;
