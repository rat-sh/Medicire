import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,       // 30 seconds
      gcTime: 5 * 60 * 1000,      // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppRoot: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default AppRoot;

/*
AppRoot.tsx
Purpose

AppRoot is the main entry point of the React Native application.

Its job is to initialize and connect all global providers before any screen is rendered.

Without this file:

Navigation will not work.
React Query will not work.
Gesture-based components may crash.
Safe area handling for notches and status bars will not work.
Provider Hierarchy

GestureHandlerRootView
└── SafeAreaProvider
└── QueryClientProvider
└── NavigationContainer
└── RootNavigator

The order is important because each layer provides functionality to the layers inside it.

Query Client Configuration

const queryClient = new QueryClient(...)

Purpose:

Global API cache manager.
Used by React Query.

Configuration:

retry: 2

Failed queries retry 2 additional times.

staleTime: 30000

Data remains fresh for 30 seconds.
Prevents unnecessary API requests.

gcTime: 300000

Unused cache is removed after 5 minutes.

mutations.retry: 1

Failed POST/PUT/DELETE requests retry once.

Reason:

Better performance.
Reduced server load.
Improved user experience.
GestureHandlerRootView

Purpose:

Enables gesture support across the application.

Required For:

Drawer navigation
Bottom sheets
Swipe gestures
Drag interactions

Without it:

Many gesture libraries fail or crash.
SafeAreaProvider

Purpose:

Provides safe area information.

Handles:

iPhone notch
Dynamic Island
Status bar area
Bottom home indicator

Without it:

UI may overlap system elements.
QueryClientProvider

Purpose:

Makes React Query available globally.

Allows any screen to use:

useQuery()
useMutation()

Without it:

React Query hooks throw errors.
NavigationContainer

Purpose:

Root navigation manager.

Responsibilities:

Screen transitions
Back navigation
Navigation state
Deep linking

Without it:

React Navigation cannot function.
RootNavigator

Purpose:

Contains all app screens and navigation stacks.

Examples:

Auth Stack
Home Stack
Profile Stack
Settings Stack

This is where the actual application starts.

Style

root: {
flex: 1
}

Purpose:

Makes the root container fill the entire screen.

Without it:

Layout issues may occur.
Export

export default AppRoot

Purpose:

Makes AppRoot available to App.tsx or index.js.
Execution Flow

App Launch
↓
Create QueryClient
↓
Initialize Gesture System
↓
Initialize Safe Area System
↓
Initialize React Query
↓
Initialize Navigation
↓
Load RootNavigator
↓
Render First Screen

Why This File Exists

This file centralizes all application-wide services.

Instead of configuring:

Navigation
React Query
Gestures
Safe Areas

inside every screen,

they are configured once here and become available throughout the app.
*/