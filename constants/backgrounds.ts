/**
 * Single source of truth for background options.
 * Used by the background selector UI and the change-background API allowlist.
 */
export const BACKGROUND_OPTIONS = [
  { id: 'frame2', path: 'assets/frame2.png', label: 'Frame 2', previewPath: '/assets/frame2.svg' },
  { id: 'bg3', path: 'assets/bg3.png', label: 'Background 3', previewPath: '/assets/frame7.svg' },
  { id: 'bg4', path: 'assets/bg4.png', label: 'Background 4', previewPath: '/assets/frame9.svg' },
  { id: 'grad1', path: 'assets/grad1.jpg', label: 'Gradient', previewPath: '/assets/grad1.jpg' },
] as const;

export const ALLOWED_BACKGROUNDS: string[] = BACKGROUND_OPTIONS.map((o) => o.path);

export const DEFAULT_BACKGROUND_PATH = 'assets/grad1.jpg';

export function getBackgroundPathById(id: string): string | undefined {
  return BACKGROUND_OPTIONS.find((o) => o.id === id)?.path;
}
