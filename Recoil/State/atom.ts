import { UserStats, GraphState } from '@/types';
import { atom } from 'recoil';
import { DEFAULT_BACKGROUND_PATH } from '@/constants/backgrounds';

export const usernameState = atom({
  key: 'usernameState',
  default: '',
});

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export const userStatsState = atom<UserStats | null>({
  key: 'userStatsState',
  default: null,
});

export const graphState = atom<GraphState | null>({
  key: 'graphState',
  default: null,
});

export const backgroundState = atom<string>({
  key: 'backgroundState',
  default: DEFAULT_BACKGROUND_PATH,
});