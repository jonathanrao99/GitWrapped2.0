"use server";

import { UserData, UserStats } from "@/types";
import { graphQL } from "./graphql";
import { fetchYearContributions } from "./fetchYearContributions";
import { getCachedUser, setCachedUser } from "@/lib/cache";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateMostActiveDay,
  calculateTotalContributions,
  formatDate,
} from "@/utils/calc";
import { handleGitHubError, GitWrappedError } from "@/utils/errorHandler";

const userStatsQuery = `
  followers {
    totalCount
  }
  contributionsCollection {
    totalCommitContributions
    contributionYears
  }
  repositoriesContributedTo(
    first: 1
    contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
  ) {
    totalCount
  }
  pullRequests(first: 1) {
    totalCount
  }
  issues(first: 1) {
    totalCount
  }
  createdAt
  repositoriesWithStargazerCount: repositories(
    first: 100
    privacy: PUBLIC
    ownerAffiliations: OWNER
    orderBy: {field: STARGAZERS, direction: DESC}
  ) {
    totalCount
    nodes {
      stargazerCount
    }
  }
  avatarUrl
`;

const fetchUser = async (
  username: string
): Promise<{ userStats: UserStats }> => {
  try {
    if (!username || username.trim() === '') {
      throw new Error('Username is required');
    }
    const key = username.trim().toLowerCase();
    const cached = getCachedUser(key);
    if (cached) return cached;

    const query = `
        query ($username: String!){
            user (login: $username) {
                ${userStatsQuery}
            }
        }
    `;

    const response = await graphQL({ query, variables: { username: username.trim() } });

    if (!response || !response.user) {
      throw new Error(`User '${username}' not found`);
    }

    const data: UserData = response;
    
    if (data.user === null) {
      throw new Error(`User '${username}' not found`);
    }

    const contributionYears = data.user.contributionsCollection?.contributionYears || [];
    let allContributionDays: { date: string; contributionCount: number }[] = [];

    for (const year of contributionYears) {
      try {
        const yearContributions: { date: string; contributionCount: number }[] =
          await fetchYearContributions(username, Number(year));
        allContributionDays = allContributionDays.concat(yearContributions);
      } catch (error) {
        console.warn(`Failed to fetch contributions for year ${year}:`, error);
        // Continue with other years
      }
    }

    allContributionDays.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const { total } = calculateTotalContributions(allContributionDays);
    const {
      longestStreak,
      startDate: longestStreakStart,
      endDate: longestStreakEnd,
    } = calculateLongestStreak(allContributionDays);
    const longestStreakStartDate = formatDate(longestStreakStart);
    const longestStreakEndDate = formatDate(longestStreakEnd);
    const {
      currentStreak,
      startDate: currentStreakStart,
      endDate: currentStreakEnd,
    } = calculateCurrentStreak(allContributionDays);
    const currentStreakStartDate = formatDate(currentStreakStart);
    const currentStreakEndDate = formatDate(currentStreakEnd);
    const mostActiveDay = calculateMostActiveDay(allContributionDays);

    const userStats: UserStats = {
      Followers: data.user.followers?.totalCount || 0,
      Repositories: data.user.repositoriesWithStargazerCount?.totalCount || 0,
      "Pull Requests": data.user.pullRequests?.totalCount || 0,
      Issues: data.user.issues?.totalCount || 0,
      Commits: data.user.contributionsCollection?.totalCommitContributions || 0,
      "Contributed To": data.user.repositoriesContributedTo?.totalCount || 0,
      "Star Earned": data.user.repositoriesWithStargazerCount?.nodes?.reduce(
        (acc, repo) => acc + (repo.stargazerCount || 0),
        0
      ) || 0,
      "Total Contributions": total,
      "Longest Streak": longestStreak,
      "Longest Streak Start": longestStreakStartDate,
      "Longest Streak End": longestStreakEndDate,
      "Current Streak": currentStreak,
      "Current Streak Start": currentStreakStartDate,
      "Current Streak End": currentStreakEndDate,
      "Most Active Day": mostActiveDay,
      AvatarUrl: data.user.avatarUrl || '',
      MemberSince: data.user.createdAt
        ? new Date(data.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : null,
    };

    const result = { userStats };
    setCachedUser(key, result);
    return result;
  } catch (error) {
    console.error('Error fetching user data:', error);
    const appError = handleGitHubError(error);
    throw new GitWrappedError(appError);
  }
};

export default fetchUser;
