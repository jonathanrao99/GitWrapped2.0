"use client";

import React, { useEffect, useRef, useState } from "react";
import Followers from "./GithubComponents/Followers";
import LongestStreak from "./GithubComponents/LongestStreak";
import Stars from "./GithubComponents/Stars";
import CurrentStreak from "./GithubComponents/CurrentStreak";
import Repos from "./GithubComponents/Repos";
import Commit from "./GithubComponents/Commits";
import PRs from "./GithubComponents/PRs";
import Issues from "./GithubComponents/Issues";
import ContributedTo from "./GithubComponents/ContributedTo";
import Achievements from "./GithubComponents/Achievements";
import Languages from "./GithubComponents/Languages";
import MostActiveDay from "./GithubComponents/MostActiveDay";
import ShareButtons from "../ui/share-buttons";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  backgroundState,
  graphState,
  loadingState,
  usernameState,
  userStatsState,
} from "@/Recoil/State/atom";
import { UserStats } from "@/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowDown, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { BACKGROUND_OPTIONS, DEFAULT_BACKGROUND_PATH, getBackgroundPathById } from "@/constants/backgrounds";

const Github = () => {
  const userStats = useRecoilValue(userStatsState) as UserStats;
  const graph = useRecoilValue(graphState);
  const loading = useRecoilValue(loadingState);
  const username = useRecoilValue(usernameState);
  const [background, setBackground] = useRecoilState(backgroundState);
  const [selectedImage, setSelectedImage] = useState<string>(`/${DEFAULT_BACKGROUND_PATH}`);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const githubRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({ title: "Please select an image file" });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File size must be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomBackground(result);
        toast({ title: "Custom background applied!" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadImage = async () => {
    toast({ title: "Starting Download...", generating: true });

    const node = document.getElementById("github-ss") as HTMLElement;
    if (!node) return toast({ title: "Failed to find element." });

    try {
      // Pre-load the background image
      const backgroundUrl = getBackgroundImageUrl();
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load background image'));
        img.src = backgroundUrl;
      });

      // Temporarily set the background on the main container
      const originalBackground = node.style.backgroundImage;
      const originalBackgroundSize = node.style.backgroundSize;
      const originalBackgroundPosition = node.style.backgroundPosition;
      const originalBackgroundRepeat = node.style.backgroundRepeat;
      
      node.style.backgroundImage = `url(${backgroundUrl})`;
      node.style.backgroundSize = 'cover';
      node.style.backgroundPosition = 'center';
      node.style.backgroundRepeat = 'no-repeat';

      // Wait for the background to be applied
      await new Promise(resolve => setTimeout(resolve, 200));

      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(node, { 
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
      
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      
      // Restore original background
      node.style.backgroundImage = originalBackground;
      node.style.backgroundSize = originalBackgroundSize;
      node.style.backgroundPosition = originalBackgroundPosition;
      node.style.backgroundRepeat = originalBackgroundRepeat;

      const response = await fetch("/api/change-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foregroundPath: dataUrl.split(',')[1],
          backgroundPath: background,
        }),
      });

      if (response.ok) {
        const data = await response.blob();
        const link = document.createElement("a");
        const url = URL.createObjectURL(data);
        link.href = url;
        link.download = `${username || "user"}.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast({ title: "Bento Downloaded Successfully" });
      } else {
        toast({ title: "Error: Slow Internet" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error occurred while downloading." });
    }
  };

  useEffect(() => {
    if (!loading && githubRef.current) {
      githubRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  // Get background image URL for live UI
  const getBackgroundImageUrl = () => {
    if (customBackground) return customBackground;
    const option = BACKGROUND_OPTIONS.find((o) => o.path === background);
    return option ? `/${option.path}` : `/${DEFAULT_BACKGROUND_PATH}`;
  };

  return (
    <div className="fixed inset-0 z-20">
      {/* Background Image for Live UI */}
      <div className="fixed inset-0 z-0">
        <Image
          src={getBackgroundImageUrl()}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {!loading && (
        <div className="absolute top-8 px-10 z-30 right-0 max-sm:right-2 max-sm:top-2 max-sm:px-2 flex gap-4 max-sm:gap-2">
          <ShareButtons 
            username={username} 
            userStats={userStats} 
            className=""
          />
          
          {/* Hidden file input for custom background */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          
          <Select
            onValueChange={(value) => {
              if (value === "custom") {
                fileInputRef.current?.click();
                return;
              }
              const path = getBackgroundPathById(value);
              if (path) {
                const option = BACKGROUND_OPTIONS.find((o) => o.id === value);
                setSelectedImage(option ? option.previewPath : `/${path}`);
                setBackground(path);
                setCustomBackground(null);
              }
            }}
          >
            <SelectTrigger className="p-2 relative rounded-full overflow-hidden max-sm:p-1">
              <Image
                src={selectedImage}
                alt="Selected background"
                width={100}
                height={100}
                className="size-7 max-sm:size-6 rounded-full object-cover"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {BACKGROUND_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    <Image
                      src={opt.previewPath}
                      alt={opt.label}
                      width={100}
                      height={100}
                      className="size-7 rounded-full object-cover"
                    />
                  </SelectItem>
                ))}
                <SelectItem value="custom" className="flex items-center gap-2">
                  <Plus className="size-5 text-white" />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div id="github-ss" ref={githubRef} className="relative top-[-10px] w-full h-full flex items-start justify-start flex-col bg-transparent overflow-y-auto scrollbar-hide max-w-full">
        {!loading && (
          <div className="text-white z-10 w-full lg:w-[100%] max-w-[1200px] mx-auto flex items-start justify-start flex-col p-2 relative pt-12 scale-100">
            <div className="flex items-center justify-center gap-3 sm:px-8 px-2 mb-1">
              <div>
                <Image
                  src={userStats.AvatarUrl || "/assets/user.svg"}
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="rounded-full size-9 md:size-10 -translate-y-0.5 object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="font-modernbold leading-tight text-lg md:text-xl max-w-2xl py-0.5">
                  {userStats.Repositories ? username : "User not found"}
                  {userStats.Repositories && "'s Github"}
                </h1>
                {userStats.MemberSince && (
                  <p className="text-white/70 text-xs md:text-sm mt-0.5">Member since {userStats.MemberSince}</p>
                )}
              </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-6 grid-rows-7 md:grid-cols-10 md:grid-rows-4 gap-1.5 md:gap-2 w-full max-w-[1200px] mx-auto md:h-[520px] h-[600px] max-sm:min-h-[100vh] overflow-y-auto scrollbar-hide scale-100 mt-4 md:mt-5">
              <LongestStreak
                streak={userStats["Longest Streak"] || 0}
                start={userStats["Longest Streak Start"] || ""}
                end={userStats["Longest Streak End"] || ""}
                classname="p-1.5 md:p-2 col-start-1 col-span-2 row-start-1 row-span-3 md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3 overflow-hidden min-w-0 min-h-0"
              />
              <CurrentStreak
                streak={userStats["Current Streak"] || 0}
                start={userStats["Current Streak Start"] || ""}
                end={userStats["Current Streak End"] || ""}
                classname="p-1.5 md:p-2 col-start-3 col-span-2 row-start-1 row-span-2 md:col-start-3 md:col-span-2 md:row-start-1 md:row-span-2 overflow-hidden min-w-0 min-h-0"
              />
              <Followers
                followers={userStats.Followers || 0}
                classname="p-1.5 md:p-2 col-start-5 col-span-2 row-start-1 row-span-1 md:col-start-5 md:col-span-2 md:row-start-1 md:row-span-1 overflow-hidden min-w-0 min-h-0"
              />
              <Stars
                stars={userStats["Star Earned"] || 0}
                classname="p-1.5 md:p-2 col-start-5 col-span-2 row-start-2 row-span-1 md:col-start-1 md:col-span-2 md:row-start-4 md:row-span-1 overflow-hidden min-w-0 min-h-0"
              />
              <Commit
                commits={userStats["Total Contributions"] || 0}
                classname="p-1.5 md:p-2 col-start-3 col-span-4 row-start-3 row-span-2 md:col-start-5 md:col-span-2 md:row-start-2 md:row-span-2 overflow-hidden min-w-0 min-h-0"
              />
              <PRs
                pr={userStats["Pull Requests"] || 0}
                classname="p-1.5 md:p-2 col-start-1 col-span-1 row-start-4 row-span-2 md:col-start-7 md:col-span-1 md:row-start-1 md:row-span-3 overflow-hidden min-w-0 min-h-0"
              />
              <Issues
                issues={userStats.Issues || 0}
                classname="p-1.5 md:p-2 col-start-2 col-span-1 row-start-4 row-span-2 md:col-start-8 md:col-span-1 md:row-start-1 md:row-span-2 overflow-hidden min-w-0 min-h-0"
              />
              <ContributedTo
                contributedCount={userStats["Contributed To"] || 0}
                classname="p-1.5 md:p-2 col-start-3 col-span-2 row-start-5 row-span-1 md:col-start-5 md:col-span-2 md:row-start-4 md:row-span-1 overflow-hidden min-w-0 min-h-0"
              />
              <Repos
                repos={userStats.Repositories || 0}
                classname="p-1.5 md:p-2 col-start-5 col-span-1 row-start-5 row-span-1 md:col-start-7 md:col-span-4 md:row-start-4 md:row-span-1 overflow-hidden min-w-0 min-h-0"
              />
              <Achievements
                userStats={userStats}
                classname="p-1.5 md:p-2 col-start-6 col-span-1 row-start-5 row-span-1 md:col-start-8 md:col-span-3 md:row-start-3 md:row-span-1 overflow-hidden min-w-0 min-h-0"
              />
              <Languages
                userStats={userStats}
                username={username}
                classname="p-1.5 md:p-2 col-start-1 col-span-3 row-start-6 row-span-2 md:col-start-3 md:col-span-2 md:row-start-3 md:row-span-2 overflow-hidden min-w-0 min-h-0"
              />
              <MostActiveDay
                mostActiveDay={userStats["Most Active Day"] ?? null}
                classname="p-1.5 md:p-2 col-start-4 col-span-3 row-start-6 row-span-2 md:col-start-9 md:col-span-2 md:row-start-1 md:row-span-2 overflow-hidden min-w-0 min-h-0"
              />
            </div>
            
            {/* Contribution Graph Section - light theme */}
            <div className="max-sm:px-4 mt-6 md:mt-5 w-full max-w-xl flex flex-col mx-auto">
              <h2 className="w-full font-modernbold text-base md:text-lg mb-2">
                Contribution Graph
              </h2>
              <div className="px-2 md:px-4 rounded-xl w-full mx-auto flex flex-col relative overflow-x-auto">
                <div className="relative mx-auto w-fit">
                  {graph === null ? (
                    <div className="contribution-graph-wrapper bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-xl text-center min-w-[260px] min-h-[140px] flex items-center justify-center">
                      <p className="text-zinc-400 font-modernreg text-sm md:text-base animate-pulse">Loading contribution graph…</p>
                    </div>
                  ) : graph?.graph === "No contributions this year" || graph?.graph === "Error" ? (
                    <div className="contribution-graph-wrapper bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-xl text-center min-w-[260px]">
                      <p className="text-zinc-300 font-modernreg text-sm md:text-base">
                        {graph?.graph === "Error"
                          ? "Couldn’t load contribution graph."
                          : "No contributions this year. Start coding!"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        className="contribution-graph-wrapper bg-white/10 backdrop-blur-xl border border-white/20 p-3 md:p-4 rounded-xl mx-auto overflow-x-auto max-w-full z-[9999]"
                        dangerouslySetInnerHTML={{ __html: graph?.graph ?? "" }}
                      />
                      <p className="mt-2 text-xs text-zinc-400 font-modernreg flex items-center justify-end gap-2">
                        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#ebedf0]" aria-hidden /> Less</span>
                        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#216e39]" aria-hidden /> More</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
              {!loading && (
          <>
            <Button
              onClick={handleDownloadImage}
              className="border-zinc-200/20 bg-zinc-800/20 rounded-full py-4 px-3 absolute bottom-3 right-3 group z-20"
              aria-label="Download bento as image"
            >
              <ArrowDown size={16} />
              <p className="font-modernreg text-sm text-zinc-400 max-xl:border border-zinc-200/20 max-xl:bg-primary/90 max-xl:p-1 max-xl:text-white/90 px-2 max-xl:px-3 max-xl:rounded-lg bottom-10 right-1 max-xl:absolute lg:flex max-lg:translate-y-2 max-xl:opacity-0 max-xl:group-hover:opacity-100 max-xl:group-hover:translate-y-0 duration-150 lg:group-hover:text-white/80">
                Download Bento
              </p>
            </Button>
          </>
        )}
    </div>
  );
};

export default Github;
