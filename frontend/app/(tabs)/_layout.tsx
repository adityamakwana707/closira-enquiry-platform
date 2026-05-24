import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { LayoutDashboard, Users, AlertTriangle, Clock } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { getEscalations, getOverdueFollowUps } from "../../mock";

// --- Tab Bar Component ---

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const escalationsCount = getEscalations().length;
  const overdueCount = getOverdueFollowUps().length;

  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={styles.blurView}>
        <View style={[styles.tabBarInner, { 
          backgroundColor: colors.tabBar.background,
          borderTopColor: colors.tabBar.border,
          paddingBottom: insets.bottom || Spacing.md,
        }]}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            let Icon;
            let badge = 0;
            let badgeColor = colors.urgency.high;

            if (route.name === 'index') {
              Icon = LayoutDashboard;
            } else if (route.name === 'leads') {
              Icon = Users;
            } else if (route.name === 'escalations') {
              Icon = AlertTriangle;
              badge = escalationsCount;
              badgeColor = colors.urgency.high;
            } else if (route.name === 'followups') {
              Icon = Clock;
              badge = overdueCount;
              badgeColor = colors.urgency.medium;
            }

            const iconColor = isFocused ? colors.accent.indigo : colors.text.muted;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <View style={styles.iconContainer}>
                  {isFocused && (
                    <View style={[styles.activePill, { backgroundColor: 'rgba(99,102,241,0.15)' }]} />
                  )}
                  {Icon && <Icon size={24} color={iconColor} strokeWidth={isFocused ? 2.5 : 2} />}
                  
                  {badge > 0 && (
                    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                      <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  Typography.caption, 
                  { 
                    color: iconColor, 
                    marginTop: 4,
                    fontFamily: isFocused ? "Inter_600SemiBold" : "Inter_500Medium" 
                  }
                ]}>
                  {label === 'index' ? 'Home' : label === 'followups' ? 'Follow-ups' : label.charAt(0).toUpperCase() + label.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

// Cleaned up unused FadeScreen wrapper

// --- Layout ---
export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade', // Smooth cross-fade transition between tabs
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: 'Leads',
        }}
      />
      <Tabs.Screen
        name="escalations"
        options={{
          title: 'Escalations',
        }}
      />
      <Tabs.Screen
        name="followups"
        options={{
          title: 'Follow-ups',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  blurView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    width: 48,
    height: 28,
    borderRadius: 14,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    lineHeight: 12,
  }
});
