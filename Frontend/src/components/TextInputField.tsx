import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";

type Props = {
  label?: string;
  style?: ViewStyle;
} & TextInputProps;

export default function TextInputField({
  label,
  style,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        {...inputProps}
        style={[
          styles.input,
          focused && styles.inputFocused,
        ]}
        placeholderTextColor="rgba(255,255,255,0.45)"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },

  label: {
    color: "rgba(255,255,255,0.85)", // 🔥 readable on dark
    fontSize: 14,
    fontWeight: "700",
  },

  input: {
    height: 54,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,

    backgroundColor: "#1F2438", // 🔥 dark surface
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",

    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
});
