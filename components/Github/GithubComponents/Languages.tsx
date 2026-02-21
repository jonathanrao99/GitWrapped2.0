"use client";

import React, { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { UserStats } from "@/types";
import Image from "next/image";
import { fetchUserLanguages, type LanguageStat } from "@/actions/fetchUserLanguages";

const Languages = ({
  userStats,
  username,
  classname,
}: {
  userStats: UserStats;
  username: string;
  classname?: string;
}) => {
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const totalRepos = userStats.Repositories || 0;

  useEffect(() => {
    if (!username || totalRepos === 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchUserLanguages(username).then((data) => {
      if (!cancelled) {
        setLanguages(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [username, totalRepos]);

  if (totalRepos === 0) return null;

  return (
    <div className={`${classname} flex flex-col min-h-0 relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 z-[90] group cursor-pointer`}>
      <Image
        src={`/assets/grad4.svg`}
        alt=""
        width={500}
        height={500}
        priority
        className="size-full object-cover absolute inset-0 -z-10 rounded-lg md:rounded-xl opacity-80 group-hover:opacity-100"
        aria-hidden
      />
      <div className="absolute inset-0 -z-[1] bg-black/35 rounded-lg md:rounded-xl" aria-hidden />
      <div className="flex flex-col flex-1 min-h-0 p-2 md:p-3">
        <div className="shrink-0 flex items-center gap-1.5 pb-1.5">
          <Code2 className="size-4 md:size-5 text-white shrink-0" />
          <p className="font-modernbold text-xs md:text-sm text-white leading-tight">Top Languages</p>
        </div>
        <div className="flex-1 min-h-0 flex flex-col justify-center py-0.5">
          {loading ? (
            <p className="font-modernreg text-xs md:text-sm text-white/90">Loading...</p>
          ) : languages.length === 0 ? (
            <p className="font-modernreg text-xs md:text-sm text-white/90">No language data</p>
          ) : (
            <div className="space-y-1 md:space-y-1.5">
              {languages.map((lang) => (
                <div key={lang.language} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                      <span className="font-modernreg text-xs md:text-sm text-white drop-shadow-sm truncate">{lang.language}</span>
                    </div>
                    <span className="font-modernbold text-xs md:text-sm text-white drop-shadow-sm shrink-0">{lang.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full min-w-[2px] transition-all duration-300" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Languages;
