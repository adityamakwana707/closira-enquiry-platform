import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Send } from "lucide-react-native";
import { BlurView } from "expo-blur";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { useEnquiry } from "../../hooks/useEnquiry";

import { MessageBubble } from "../../components/conversation/MessageBubble";
import { ConversationTimeline } from "../../components/conversation/ConversationTimeline";
import { GlassCard } from "../../components/ui/GlassCard";
import { BackgroundOrbs } from "../../components/ui/BackgroundOrbs";
import { StatusPill } from "../../components/ui/StatusPill";
import { ChannelBadge } from "../../components/ui/ChannelBadge";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { getEnquiryById } = useEnquiry();

  const [replyText, setReplyText] = useState("");

  const enquiry = getEnquiryById(id as string);

  if (!enquiry) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <BackgroundOrbs />
        <View style={[styles.container, { paddingTop: insets.top, paddingHorizontal: Spacing.lg, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[Typography.h3, { color: colors.text.primary }]}>Conversation not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: Spacing.md }}>
            <Text style={[Typography.body, { color: colors.accent.indigo }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BackgroundOrbs />
      <View style={styles.container}>
        {/* Header */}
      <BlurView 
        intensity={isDark ? 30 : 60} 
        tint={isDark ? "dark" : "light"}
        style={[styles.headerBlur, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[Typography.h2, { color: colors.text.primary }]}>{enquiry.customer}</Text>
            <View style={styles.headerBadges}>
              <ChannelBadge channel={enquiry.channel} size="sm" />
              <View style={{ width: Spacing.sm }} />
              <StatusPill status={enquiry.status} size="sm" />
            </View>
          </View>
        </View>
      </BlurView>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        {enquiry.summary && (
          <GlassCard style={styles.summaryCard} intensity={isDark ? 20 : 50}>
            <Text style={[Typography.label, { color: colors.text.muted, marginBottom: Spacing.xs }]}>
              AI SUMMARY
            </Text>
            <Text style={[Typography.body, { color: colors.text.secondary }]}>
              {enquiry.summary}
            </Text>
          </GlassCard>
        )}

        {/* Messages */}
        <View style={styles.section}>
          {enquiry.messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={[Typography.h3, { color: colors.text.primary, marginBottom: Spacing.md, paddingHorizontal: Spacing.md }]}>
            Activity Timeline
          </Text>
          <GlassCard intensity={isDark ? 20 : 50}>
            <ConversationTimeline timeline={enquiry.timeline} />
          </GlassCard>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={[styles.actionBarContainer, { paddingBottom: insets.bottom || Spacing.md, backgroundColor: colors.background.primary, borderTopColor: colors.glass.border }]}>
        <View style={[styles.inputWrapper, { backgroundColor: isDark ? colors.background.tertiary : colors.glass.surface, borderColor: colors.glass.border }]}>
          <TextInput
            style={[Typography.body, styles.input, { color: colors.text.primary, outline: 'none' } as any]}
            placeholder="Type a reply..."
            placeholderTextColor={colors.text.muted}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: replyText.length > 0 ? colors.accent.indigo : colors.text.disabled }]}
            disabled={replyText.length === 0}
          >
            <Send size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerBadges: {
    flexDirection: 'row',
    marginTop: 4,
  },
  scrollContent: {
    paddingTop: 120, // space for header
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  actionBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingTop: 4,
    paddingBottom: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
    marginBottom: 2,
  }
});
