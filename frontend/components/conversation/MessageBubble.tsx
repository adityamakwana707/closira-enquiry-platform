import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bot, User } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { colors, isDark } = useTheme();

  const isCustomer = message.sender === "customer";
  const isAgent = message.sender === "agent";

  const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, isCustomer ? styles.rightAlign : styles.leftAlign]}>
      {!isCustomer && (
        <View style={[styles.avatar, { backgroundColor: isAgent ? colors.accent.violet : colors.accent.indigo }]}>
          {isAgent ? (
            <User size={14} color="#FFFFFF" strokeWidth={2.5} />
          ) : (
            <Bot size={14} color="#FFFFFF" strokeWidth={2.5} />
          )}
        </View>
      )}

      <View style={styles.messageContent}>
        <View 
          style={[
            styles.bubble, 
            isCustomer 
              ? { backgroundColor: colors.accent.indigo, borderBottomRightRadius: 4 } 
              : { backgroundColor: isDark ? colors.background.tertiary : colors.glass.surface, borderWidth: 1, borderColor: colors.glass.border, borderBottomLeftRadius: 4 }
          ]}
        >
          <Text style={[Typography.bodyMd, { color: isCustomer ? "#FFFFFF" : colors.text.primary }]}>
            {message.content}
          </Text>
        </View>
        <Text style={[
          Typography.caption, 
          { color: colors.text.muted, marginTop: 4 },
          isCustomer ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }
        ]}>
          {timeString}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: Spacing.md,
    maxWidth: "85%",
  },
  leftAlign: {
    alignSelf: "flex-start",
  },
  rightAlign: {
    alignSelf: "flex-end",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
    marginTop: 4,
  },
  messageContent: {
    flex: 1,
  },
  bubble: {
    padding: Spacing.md,
    borderRadius: 16,
  }
});
