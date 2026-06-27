/**
 * NearbyPharmaciesSection.tsx
 * Extracted pharmacy list rendering for the home screen.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapPin, Building2 } from 'lucide-react-native';
import { Spacing } from '@/constants/theme';
import { ApiStateView } from '@/components/ui/ApiStateView';
import { PharmacyCard } from '@/components/pharmacy/PharmacyCard';
import { formatDistance } from '@/utils/formatters';
import type { PharmacyWithStock } from '@/types/pharmacy';

interface NearbyPharmaciesSectionProps {
  hasPermission: boolean;
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  isError: boolean;
  pharmacies: PharmacyWithStock[];
  onRefetch: () => void;
  onSearch: () => void;
  onEnableLocation: () => void;
  onPharmacyPress: (pharmacyId: string) => void;
  onReserve: (pharmacyId: string) => void;
}

export const NearbyPharmaciesSection: React.FC<NearbyPharmaciesSectionProps> = ({
  hasPermission,
  latitude,
  longitude,
  isLoading,
  isError,
  pharmacies,
  onRefetch,
  onSearch,
  onEnableLocation,
  onPharmacyPress,
  onReserve,
}) => {
  if (!hasPermission || latitude == null || longitude == null) {
    return (
      <ApiStateView
        isLoading={false}
        isError={false}
        isEmpty
        emptyIcon={MapPin}
        emptyTitle="Location needed"
        emptySubtitle="Allow location access to see pharmacies near you."
        emptyAction="Enable location"
        onEmptyAction={onEnableLocation}
      />
    );
  }

  return (
    <ApiStateView
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && pharmacies.length === 0}
      loadingText="Finding nearby pharmacies..."
      errorMessage="Could not load pharmacies. Check your connection."
      emptyIcon={Building2}
      emptyTitle="No pharmacies nearby"
      emptySubtitle="Try changing your location or check back later."
      onRetry={onRefetch}
      onEmptyAction={onSearch}>
      <View style={styles.pharmacyList}>
        {pharmacies.slice(0, 5).map(pharmacy => (
          <PharmacyCard
            key={pharmacy.id}
            name={pharmacy.name}
            distance={formatDistance(pharmacy.distanceMeters)}
            status={pharmacy.stockStatus}
            price={pharmacy.price?.toString()}
            open={pharmacy.isOpen}
            closingTime={pharmacy.closingTime}
            onClick={() => onPharmacyPress(pharmacy.id)}
            onReserve={() => onReserve(pharmacy.id)}
          />
        ))}
      </View>
    </ApiStateView>
  );
};

const styles = StyleSheet.create({
  pharmacyList: { gap: Spacing.md },
});
