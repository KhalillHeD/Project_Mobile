import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";
import { Spacing } from "../theme/spacing";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "solid" | "outline" | "custom";
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  variant = "solid",
  style,
  textStyle,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,

        variant === "solid" && styles.solid,
        variant === "outline" && styles.outline,

        pressed &&
          !disabled &&
          (variant === "solid"
            ? styles.solidPressed
            : styles.outlinePressed),

        disabled && styles.disabled,
        style, // allow override last
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "outline" && styles.textOutline,
          textStyle, // allow override last
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    ...Shadow,
  },

  /* ===== SOLID (PRIMARY) ===== */
  solid: {
    backgroundColor: Colors.primary,
  },
  solidPressed: {
    backgroundColor: Colors.primaryPressed,
    transform: [{ scale: 0.985 }],
  },

  /* ===== OUTLINE (SECONDARY, DARK-SAFE) ===== */
  outline: {
    backgroundColor: "#2A2F45", // 🔥 readable on dark cards
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  outlinePressed: {
    backgroundColor: "#32385A",
    transform: [{ scale: 0.985 }],
  },

  disabled: {
    opacity: 0.45,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  textOutline: {
    color: "#FFFFFF", // 🔥 FIXED
  },
});
