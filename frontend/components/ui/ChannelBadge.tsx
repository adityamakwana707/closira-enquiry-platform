import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MessageCircle, Mail, Phone } from "lucide-react-native";
import { Channel } from "../../types";
import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";

interface ChannelBadgeProps {
  channel: Channel;
  size?: "sm" | "md";
}

export const ChannelBadge = ({ channel, size = "sm" }: ChannelBadgeProps) => {
  const { colors } = useTheme();

  const isSmall = size === "sm";
  const iconSize = isSmall ? 12 : 14;
  const paddingV = isSmall ? 2 : Spacing.xs;
  const paddingH = isSmall ? Spacing.xs : Spacing.sm;

  let bg, text, Icon, label;

  switch (channel) {
    case "whatsapp":
      bg = colors.channel.whatsappBg;
      text = colors.channel.whatsapp;
      Icon = MessageCircle;
      label = "WhatsApp";
      break;
    case "email":
      bg = colors.channel.emailBg;
      text = colors.channel.email;
      Icon = Mail;
      label = "Email";
      break;
    case "call":
      bg = colors.channel.callBg;
      text = colors.channel.call;
      Icon = Phone;
      label = "Call";
      break;
  }

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingVertical: paddingV, paddingHorizontal: paddingH }]}>
      <Icon size={iconSize} color={text} strokeWidth={2.5} />
      <Text style={[Typography.caption, { color: text, marginLeft: 4 }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
  },
});
