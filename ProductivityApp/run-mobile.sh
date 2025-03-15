#!/bin/bash

# Set PATH to use Node.js v18
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"

# Check if we're using the correct Node.js version
echo "Using Node.js version: $(node -v)"

# Parse arguments
PLATFORM=""
CLEAR_CACHE=false

for arg in "$@"
do
    case $arg in
        --android)
        PLATFORM="android"
        shift
        ;;
        --ios)
        PLATFORM="ios"
        shift
        ;;
        --clear)
        CLEAR_CACHE=true
        shift
        ;;
    esac
done

# Clear cache if requested
if [ "$CLEAR_CACHE" = true ]; then
    echo "Clearing Expo cache..."
    rm -rf node_modules/.cache/expo
    rm -rf .expo
fi

# Run the app with Expo based on platform
if [ "$PLATFORM" = "android" ]; then
    echo "Starting Expo for Android..."
    npx expo start --android
elif [ "$PLATFORM" = "ios" ]; then
    echo "Starting Expo for iOS..."
    npx expo start --ios
else
    echo "Starting Expo..."
    npx expo start
fi 