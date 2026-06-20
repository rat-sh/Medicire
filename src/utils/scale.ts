import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design base (Figma uses 375x812 — iPhone 14 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale a size relative to screen width.
 * Use for horizontal measurements: widths, paddings, margins.
 */
export const scale = (size: number): number => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Scale a size relative to screen height.
 * Use for vertical measurements: heights, top/bottom spacing.
 */
export const verticalScale = (size: number): number =>
  (SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Moderate scale — scales less aggressively than scale().
 * Best for font sizes and icon sizes. factor: 0 = no scale, 1 = full scale.
 */
export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

export const SCREEN_WIDTH_EXPORT = SCREEN_WIDTH;
export const SCREEN_HEIGHT_EXPORT = SCREEN_HEIGHT;
