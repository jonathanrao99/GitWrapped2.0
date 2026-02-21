"use client";

import Github from "@/components/Github/Github";
import GithubInput from "@/components/Input/GithubInput";
import { GithubIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userStatsState, usernameState, loadingState, graphState } from "@/Recoil/State/atom";
import { useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import fetchUser from "@/actions/fetchUser";
import fetchGraph from "@/actions/fetchGraph";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import ErrorBoundary from "@/components/ui/error-boundary";
import { GitWrappedError } from "@/utils/errorHandler";

function HomeContent() {
  const userStats = useRecoilValue(userStatsState);
  const setUsername = useSetRecoilState(usernameState);
  const setLoading = useSetRecoilState(loadingState);
  const setUserStats = useSetRecoilState(userStatsState);
  const setGraphState = useSetRecoilState(graphState);
  const hasUserData = userStats && Object.keys(userStats).length > 0;
  const searchParams = useSearchParams();

  const loadUserData = useCallback(async (username: string) => {
    try {
      setLoading(true);
      toast({ title: "Loading from URL...", generating: true });
      setUsername(username);

      const { userStats } = await fetchUser(username);
      setUserStats(userStats);
      setGraphState(null);
      const graph = await fetchGraph(username);
      setGraphState(graph);

      if (graph.graph === "No contributions this year") {
        toast({
          title: "No contributions found",
          description: "This user has no contributions this year",
        });
      } else {
        toast({ title: "GitWrapped loaded from URL" });
      }
    } catch (error) {
      console.error('Error loading from URL:', error);
      const title = "Error loading user";
      const description =
        error instanceof GitWrappedError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to load user data. Check your GitHub token in .env.local and try again.";
      toast({
        title,
        description,
        variant: "destructive",
        action: (
          <ToastAction onClick={() => loadUserData(username)}>
            Retry
          </ToastAction>
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUsername, setUserStats, setGraphState]);

  // Handle URL-based sharing
  useEffect(() => {
    const usernameFromUrl = searchParams.get('user');
    if (usernameFromUrl && !hasUserData) {
      loadUserData(usernameFromUrl);
    }
  }, [searchParams, hasUserData, loadUserData]);

  return (
    <div className="w-full min-h-screen mx-auto p-5 max-sm:p-0 flex flex-col items-center justify-center overflow-hidden relative">
      <Link
        href={`https://github.com/jonathanrao99`}
        className="cursor-pointer flex items-center justify-start gap-2 z-10 w-full font-modernmono text-zinc-600 hover:text-white/60 px-5 max-sm:py-3"
      >
        <h1>GitWrapped 2.0 by @jonathanrao99 </h1>
        <GithubIcon size={18} />
      </Link>
    
    {/* Default background - only show when no user data is loaded */}
    {!hasUserData && (
      <>
        <Image
          src={`/assets/grad1.jpg`}
          alt=""
          width={500}
          height={500}
          className="absolute object-cover inset-0 size-full opacity-40"
          priority
        />
        <svg
          className="pointer-events-none isolate z-[999999] size-full absolute inset-0 opacity-30 mix-blend-soft-light"
          width="100%"
          height="100%"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.80"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </>
    )}
    
    {/* Input form - always visible */}
    <div className="h-[92vh] w-full flex items-center justify-center z-10">
      <GithubInput />
    </div>
    
    {/* Github component - rendered conditionally */}
    {hasUserData && <Github />}
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="w-full min-h-screen mx-auto p-5 max-sm:p-0 flex flex-col items-center justify-center overflow-hidden relative">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white">Loading GitWrapped...</p>
          </div>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </ErrorBoundary>
  );
}
