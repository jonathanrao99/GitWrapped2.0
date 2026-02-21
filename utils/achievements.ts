export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'contributions' | 'streaks' | 'social' | 'repositories' | 'special';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

import { UserStats } from '@/types';

export const calculateAchievements = (userStats: UserStats): Achievement[] => {
  const achievements: Achievement[] = [];

  // Contribution Achievements
  if (userStats['Total Contributions'] >= 1000) {
    achievements.push({
      id: 'contributor-1000',
      title: 'Dedicated Developer',
      description: 'Made 1,000+ contributions',
      icon: '🚀',
      category: 'contributions',
      unlocked: true,
      rarity: 'rare'
    });
  } else if (userStats['Total Contributions'] >= 500) {
    achievements.push({
      id: 'contributor-500',
      title: 'Active Coder',
      description: 'Made 500+ contributions',
      icon: '💻',
      category: 'contributions',
      unlocked: true,
      progress: userStats['Total Contributions'],
      maxProgress: 1000,
      rarity: 'common'
    });
  } else if (userStats['Total Contributions'] >= 100) {
    achievements.push({
      id: 'contributor-100',
      title: 'Getting Started',
      description: 'Made 100+ contributions',
      icon: '⭐',
      category: 'contributions',
      unlocked: true,
      progress: userStats['Total Contributions'],
      maxProgress: 500,
      rarity: 'common'
    });
  }

  // Streak Achievements
  if (userStats['Current Streak'] >= 100) {
    achievements.push({
      id: 'streak-100',
      title: 'Century Streak',
      description: '100+ day current streak',
      icon: '🔥',
      category: 'streaks',
      unlocked: true,
      rarity: 'legendary'
    });
  } else if (userStats['Current Streak'] >= 30) {
    achievements.push({
      id: 'streak-30',
      title: 'Monthly Master',
      description: '30+ day current streak',
      icon: '📅',
      category: 'streaks',
      unlocked: true,
      progress: userStats['Current Streak'],
      maxProgress: 100,
      rarity: 'epic'
    });
  } else if (userStats['Current Streak'] >= 7) {
    achievements.push({
      id: 'streak-7',
      title: 'Week Warrior',
      description: '7+ day current streak',
      icon: '⚡',
      category: 'streaks',
      unlocked: true,
      progress: userStats['Current Streak'],
      maxProgress: 30,
      rarity: 'rare'
    });
  }

  // Longest Streak Achievements
  if (userStats['Longest Streak'] >= 365) {
    achievements.push({
      id: 'longest-365',
      title: 'Year-Long Legend',
      description: '365+ day longest streak',
      icon: '👑',
      category: 'streaks',
      unlocked: true,
      rarity: 'legendary'
    });
  } else if (userStats['Longest Streak'] >= 100) {
    achievements.push({
      id: 'longest-100',
      title: 'Century Champion',
      description: '100+ day longest streak',
      icon: '🏆',
      category: 'streaks',
      unlocked: true,
      progress: userStats['Longest Streak'],
      maxProgress: 365,
      rarity: 'epic'
    });
  }

  // Social Achievements
  if (userStats.Followers >= 1000) {
    achievements.push({
      id: 'followers-1000',
      title: 'Influencer',
      description: '1,000+ followers',
      icon: '🌟',
      category: 'social',
      unlocked: true,
      rarity: 'epic'
    });
  } else if (userStats.Followers >= 100) {
    achievements.push({
      id: 'followers-100',
      title: 'Popular',
      description: '100+ followers',
      icon: '👥',
      category: 'social',
      unlocked: true,
      progress: userStats.Followers,
      maxProgress: 1000,
      rarity: 'rare'
    });
  } else if (userStats.Followers >= 10) {
    achievements.push({
      id: 'followers-10',
      title: 'Getting Noticed',
      description: '10+ followers',
      icon: '👀',
      category: 'social',
      unlocked: true,
      progress: userStats.Followers,
      maxProgress: 100,
      rarity: 'common'
    });
  }

  // Repository Achievements
  if (userStats.Repositories >= 50) {
    achievements.push({
      id: 'repos-50',
      title: 'Repository King',
      description: '50+ repositories',
      icon: '🏰',
      category: 'repositories',
      unlocked: true,
      rarity: 'epic'
    });
  } else if (userStats.Repositories >= 10) {
    achievements.push({
      id: 'repos-10',
      title: 'Multi-Repo',
      description: '10+ repositories',
      icon: '📦',
      category: 'repositories',
      unlocked: true,
      progress: userStats.Repositories,
      maxProgress: 50,
      rarity: 'rare'
    });
  } else if (userStats.Repositories >= 1) {
    achievements.push({
      id: 'repos-1',
      title: 'First Repo',
      description: 'Created first repository',
      icon: '🎉',
      category: 'repositories',
      unlocked: true,
      rarity: 'common'
    });
  }

  // Star Achievements
  if (userStats['Star Earned'] >= 1000) {
    achievements.push({
      id: 'stars-1000',
      title: 'Star Collector',
      description: '1,000+ stars earned',
      icon: '⭐',
      category: 'repositories',
      unlocked: true,
      rarity: 'legendary'
    });
  } else if (userStats['Star Earned'] >= 100) {
    achievements.push({
      id: 'stars-100',
      title: 'Star Magnet',
      description: '100+ stars earned',
      icon: '✨',
      category: 'repositories',
      unlocked: true,
      progress: userStats['Star Earned'],
      maxProgress: 1000,
      rarity: 'epic'
    });
  } else if (userStats['Star Earned'] >= 10) {
    achievements.push({
      id: 'stars-10',
      title: 'Star Gazer',
      description: '10+ stars earned',
      icon: '💫',
      category: 'repositories',
      unlocked: true,
      progress: userStats['Star Earned'],
      maxProgress: 100,
      rarity: 'rare'
    });
  }

  // Special Achievements
  if (userStats['Pull Requests'] >= 100) {
    achievements.push({
      id: 'pr-100',
      title: 'PR Master',
      description: '100+ pull requests',
      icon: '🔀',
      category: 'special',
      unlocked: true,
      rarity: 'epic'
    });
  } else if (userStats['Pull Requests'] >= 10) {
    achievements.push({
      id: 'pr-10',
      title: 'Collaborator',
      description: '10+ pull requests',
      icon: '🤝',
      category: 'special',
      unlocked: true,
      progress: userStats['Pull Requests'],
      maxProgress: 100,
      rarity: 'rare'
    });
  }

  if (userStats.Issues >= 50) {
    achievements.push({
      id: 'issues-50',
      title: 'Issue Tracker',
      description: '50+ issues reported',
      icon: '🐛',
      category: 'special',
      unlocked: true,
      rarity: 'rare'
    });
  } else if (userStats.Issues >= 10) {
    achievements.push({
      id: 'issues-10',
      title: 'Bug Hunter',
      description: '10+ issues reported',
      icon: '🔍',
      category: 'special',
      unlocked: true,
      progress: userStats.Issues,
      maxProgress: 50,
      rarity: 'common'
    });
  }

  // Perfect Day Achievement (if they have any contributions today)
  if (userStats['Current Streak'] > 0) {
    achievements.push({
      id: 'perfect-day',
      title: 'Perfect Day',
      description: 'Contributed today',
      icon: '☀️',
      category: 'special',
      unlocked: true,
      rarity: 'common'
    });
  }

  return achievements;
};

const RARITY_STYLES: Record<string, { color: string; bg: string }> = {
  legendary: { color: 'text-yellow-400 border-yellow-400', bg: 'bg-yellow-400/10' },
  epic: { color: 'text-purple-400 border-purple-400', bg: 'bg-purple-400/10' },
  rare: { color: 'text-blue-400 border-blue-400', bg: 'bg-blue-400/10' },
  common: { color: 'text-gray-400 border-gray-400', bg: 'bg-gray-400/10' },
};

export const getAchievementRarityColor = (rarity: string): string =>
  RARITY_STYLES[rarity]?.color ?? RARITY_STYLES.common.color;

export const getAchievementRarityBg = (rarity: string): string =>
  RARITY_STYLES[rarity]?.bg ?? RARITY_STYLES.common.bg; 