// Frontend/src/theme/shadow.ts
import { Platform } from "react-native";
import { Colors } from "./colors";

export const Shadow = Platform.select({
  ios: {
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: {
    elevation: 8,
  },
  default: {},
});
