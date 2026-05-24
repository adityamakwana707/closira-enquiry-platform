import React from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Search } from "lucide-react-native";
import { TextInput } from "react-native-gesture-handler"; // More reliable on some platforms
import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { GlassCard } from "../ui/GlassCard";

interface LeadFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}

const FILTERS = ["All", "New", "Qualified", "Escalated", "Resolved"];

export const LeadFilters = ({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }: LeadFiltersProps) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <GlassCard 
        style={styles.searchCard} 
        innerStyle={{ paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md }}
        intensity={isDark ? 20 : 50}
      >
        <View style={styles.searchRow}>
          <Search size={18} color={colors.text.muted} />
          <TextInput
            style={[Typography.body, { color: colors.text.primary, flex: 1, marginLeft: Spacing.sm, outline: 'none' } as any]}
            placeholder="Search by name or message..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </GlassCard>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterScroll}
      >
        {FILTERS.map((filter) => {
          const isActive = filter.toLowerCase() === activeFilter.toLowerCase();
          
          return (
            <TouchableOpacity
              key={filter}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.pill,
                {
                  backgroundColor: isActive ? colors.accent.indigo : "transparent",
                  borderColor: isActive 
                    ? colors.accent.indigo 
                    : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(99,102,241,0.15)'),
                  borderWidth: 1,
                }
              ]}
            >
              <Text style={[
                Typography.caption,
                { 
                  color: isActive ? "#FFFFFF" : (isDark ? colors.text.secondary : colors.accent.indigo),
                  fontFamily: isActive ? "Inter_600SemiBold" : "Inter_500Medium"
                }
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  searchCard: {
    marginBottom: Spacing.md,
    borderRadius: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterScroll: {
    gap: Spacing.sm,
    paddingHorizontal: 2,
    paddingBottom: Spacing.sm, // space for shadow
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
  }
});
