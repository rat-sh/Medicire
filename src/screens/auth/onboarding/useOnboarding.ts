/**
 * useOnboarding.ts
 * Encapsulates all onboarding navigation and swipe state.
 * Returns everything the screen needs — no JSX here.
 */
import { useRef, useState, useCallback } from 'react';
import { Dimensions, type FlatList } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { storage, StorageKeys } from '@/services/storage/mmkv';
import { SLIDES } from './slides';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export interface UseOnboardingReturn {
  flatListRef: React.RefObject<any>;
  currentIndex: number;
  activeIndex: ReturnType<typeof useSharedValue<number>>;
  isLast: boolean;
  handleNext: () => void;
  handleGetStarted: () => void;
  onScrollEnd: (e: { nativeEvent: { contentOffset: { x: number } } }) => void;
}

export function useOnboarding(): UseOnboardingReturn {
  const navigation = useNavigation<Nav>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = useSharedValue(0);

  const handleGetStarted = useCallback(() => {
    storage.set(StorageKeys.ONBOARDING_DONE, 'true');
    navigation.replace(Routes.SPLASH);
  }, [navigation]);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      activeIndex.value = withSpring(nextIndex);
    } else {
      handleGetStarted();
    }
  }, [currentIndex, activeIndex, handleGetStarted]);

  const onScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setCurrentIndex(index);
      activeIndex.value = withSpring(index);
    },
    [activeIndex],
  );

  return {
    flatListRef,
    currentIndex,
    activeIndex,
    isLast: currentIndex === SLIDES.length - 1,
    handleNext,
    handleGetStarted,
    onScrollEnd,
  };
}
