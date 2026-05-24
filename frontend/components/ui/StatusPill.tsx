import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { EnquiryStatus } from "../../types";
import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";

interface StatusPillProps {
  status: EnquiryStatus;
  size?: "sm" | "md";
}

export const StatusPill = ({ status, size = "sm" }: StatusPillProps) => {
  const { colors } = useTheme();

  const isSmall = size === "sm";
  const paddingV = isSmall ? 2 : Spacing.xs;
  const paddingH = isSmall ? Spacing.sm : Spacing.md;

  let bg, text, label;

  switch (status) {
    case "new":
      bg = colors.status.newBg;
      text = colors.status.new;
      label = "New";
      break;
    case "qualified":
      bg = colors.status.qualifiedBg;
      text = colors.status.qualified;
      label = "Qualified";
      break;
    case "escalated":
      bg = colors.status.escalatedBg;
      text = colors.status.escalated;
      label = "Escalated";
      break;
    case "resolved":
      bg = colors.status.resolvedBg;
      text = colors.status.resolved;
      label = "Resolved";
      break;
  }

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingVertical: paddingV, paddingHorizontal: paddingH }]}>
      <Text style={[Typography.caption, { color: text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignSelf: "flex-start",
  },
});
