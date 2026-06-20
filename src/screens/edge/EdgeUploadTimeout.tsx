import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

// TODO: Implement EdgeUploadTimeout — see figma_Complete_App_Screen_Designs/src/app/App.tsx

const EdgeUploadTimeout: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>EdgeUploadTimeout</Text>
      <Text style={styles.sub}>Under construction</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});

export default EdgeUploadTimeout;
