module.exports = {
  name: "ProductivityApp",
  slug: "ProductivityApp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.productivityapp",
    infoPlist: {
      NSCameraUsageDescription: "This app uses the camera to scan QR codes.",
      NSPhotoLibraryUsageDescription: "This app uses the photo library to allow you to upload images.",
      NSMicrophoneUsageDescription: "This app uses the microphone to record voice notes."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.yourcompany.productivityapp",
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "RECORD_AUDIO",
      "INTERNET"
    ]
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro"
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static"
        }
      }
    ]
  ],
  platforms: ["ios", "android", "web"],
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  }
}; 