import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Search, FileText, Package, User } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from '@/constants/routes';

export const BottomNav: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, color: string) => {
    const size = 20;
    switch (routeName) {
      case Routes.HOME_TAB: return <Home size={size} color={color} />;
      case Routes.SEARCH_TAB: return <Search size={size} color={color} />;
      case Routes.VAULT_TAB: return <FileText size={size} color={color} />;
      case Routes.RESERVATIONS_TAB: return <Package size={size} color={color} />;
      case Routes.PROFILE_TAB: return <User size={size} color={color} />;
      default: return <Home size={size} color={color} />;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 12) }]}>
      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? Colors.primary : Colors.textMuted;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={(options as any).tabBarButtonTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              {getIcon(route.name, color)}
              <Text style={[styles.label, { color }]}>
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: FontSize.xs - 2, // matches 10px text
    fontWeight: FontWeight.semibold,
  },
});
