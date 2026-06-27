/**
 * onboarding/index.tsx — Onboarding Screen
 * Orchestrates the 3-page onboarding flow.
 * Responsibility: compose slides, hook, and dot indicator; render only.
 */
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  type ListRenderItemInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { SLIDES, type Slide } from './slides';
import { useOnboarding } from './useOnboarding';
import { OnboardingDot } from './OnboardingDot';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Slide renderer ───────────────────────────────────────────────────────────

const SlideItem = React.memo(({ item }: { item: Slide }) => (
  <View style={styles.slide}>
    <LinearGradient colors={item.gradientColors} style={styles.illustrationCircle}>
      <Text style={styles.illustrationEmoji}>{item.icon}</Text>
    </LinearGradient>

    <View style={[styles.tag, { borderColor: item.tagColor }]}>
      <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
    </View>

    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.subtitle}>{item.subtitle}</Text>

    <View style={styles.painBox}>
      <Text style={styles.painText}>{item.painPoint}</Text>
    </View>
  </View>
));

SlideItem.displayName = 'SlideItem';

// ─── Screen ───────────────────────────────────────────────────────────────────

const OnboardingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    flatListRef,
    currentIndex,
    activeIndex,
    isLast,
    handleNext,
    handleGetStarted,
    onScrollEnd,
  } = useOnboarding();

  const currentSlide = SLIDES[currentIndex];
  const accentColor = currentSlide?.tagColor ?? Colors.primary;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Slide>) => <SlideItem item={item} />,
    [],
  );

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 20 }]}>
      {/* Skip */}
      <TouchableOpacity
        style={[styles.skipBtn, { paddingTop: insets.top + 12 }]}
        onPress={handleGetStarted}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Bottom — dots + CTA */}
      <View style={styles.bottomArea}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <OnboardingDot
              key={i}
              index={i}
              activeIndex={activeIndex}
              color={accentColor}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: accentColor }]}
          onPress={handleNext}
          activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>
            {isLast ? 'Get Started →' : 'Next →'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.progressText}>
          {currentIndex + 1} of {SLIDES.length}
        </Text>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  skipBtn: {
    position: 'absolute', top: 0, right: Spacing.xl, zIndex: 10,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.textSecondary,
  },

  flatList: { flex: 1 },

  slide: {
    width: SCREEN_WIDTH, flex: 1,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl, gap: Spacing.xl,
  },
  illustrationCircle: {
    width: 200, height: 200, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  illustrationEmoji: { fontSize: 80 },

  tag: {
    borderWidth: 1.5, borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: 4,
  },
  tagText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 1.5 },

  title: {
    fontSize: FontSize['4xl'], fontWeight: FontWeight.bold,
    color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.base, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },

  painBox: {
    backgroundColor: Colors.gray100, borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderLeftWidth: 3, borderLeftColor: Colors.primary, width: '100%',
  },
  painText: {
    fontSize: FontSize.sm, fontWeight: FontWeight.medium,
    color: Colors.textSecondary, fontStyle: 'italic',
  },

  bottomArea: {
    alignItems: 'center', gap: Spacing.lg,
    paddingHorizontal: Spacing.xxxl, paddingTop: Spacing.lg,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  ctaBtn: {
    width: '100%', paddingVertical: 16, borderRadius: Radius.xl,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  ctaBtnText: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold,
    color: '#fff', letterSpacing: 0.3,
  },

  progressText: {
    fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium,
  },
});

export default OnboardingScreen;
