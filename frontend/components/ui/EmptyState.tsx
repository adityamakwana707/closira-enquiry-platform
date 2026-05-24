import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconColor?: string;
}

export const EmptyState = ({ icon: Icon, title, subtitle, iconColor }: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Icon size={52} color={iconColor || colors.text.muted} strokeWidth={1.5} />
      <Text style={[Typography.h3, { color: colors.text.secondary, marginTop: Spacing.xl, textAlign: "center" }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[Typography.body, { color: colors.text.muted, marginTop: Spacing.sm, textAlign: "center" }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxxl,
    paddingVertical: Spacing.huge,
  },
});
