import Constants from "expo-constants";

const primaryColor = Constants.expoConfig?.extra?.primaryColor || "#7D7AFF";
const secondaryColor =
  Constants.expoConfig?.extra?.secondaryColor || "#1E20241A";
const backgroundColor =
  Constants.expoConfig?.extra?.backgroundColor || "#F2F5FA";
const textPrimaryColor =
  Constants.expoConfig?.extra?.textPrimaryColor || "#000000";
const textSecondaryColor =
  Constants.expoConfig?.extra?.textSecondaryColor || "#838D95";
const successColor = Constants.expoConfig?.extra?.successColor || "#28a745";
const errorColor = Constants.expoConfig?.extra?.errorColor || "#dc3545";
const warningColor = Constants.expoConfig?.extra?.warningColor || "#ffc107";

export default {
  primary: primaryColor,
  secondary: secondaryColor,
  background: backgroundColor,
  textPrimary: textPrimaryColor,
  textSecondary: textSecondaryColor,
  success: successColor,
  error: errorColor,
  warning: warningColor,
};
