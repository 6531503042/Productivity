# Productivity App

A comprehensive productivity application for managing tasks, projects, and tracking your productivity.

## Features

- Task Management: Create, organize, and track your tasks with ease
- Project Tracking: Group related tasks into projects for better organization
- Analytics: View insights about your productivity and task completion
- Customization: Personalize your experience with settings and preferences

## Running the App

### Web Version

To run the web version of the app, you can use the following command:

```bash
npm run web-server
# or
bun run web-server
```

This will start a web server at http://localhost:3000 where you can view the app.

### Mobile Version

To run the mobile version of the app with Node.js v18 (recommended), use:

```bash
# Using our custom script that sets the correct Node.js version
npm run mobile
# or
bun run mobile

# For specific platforms
npm run mobile-android
npm run mobile-ios
# or
bun run mobile-android
bun run mobile-ios
```

If you encounter permission errors with Firebase, make sure:
1. You have the correct Firebase configuration in `src/services/firebase.ts`
2. Anonymous authentication is enabled in your Firebase project
3. Firestore rules allow read/write access for authenticated users

## Troubleshooting

### Firebase Permission Issues

If you encounter "missing or insufficient permission" errors:

1. Make sure you're signed in (the app uses anonymous authentication by default)
2. Check that your Firestore rules allow the operations you're trying to perform
3. Verify that your Firebase project is properly set up with the correct API keys

### Node.js Version Issues

This app requires Node.js v18 or higher. If you encounter errors related to `ReadableStream`, make sure you're using the correct Node.js version:

```bash
# Check your Node.js version
node -v

# If using Homebrew, you can install Node.js v18 with:
brew install node@18

# Then add it to your PATH:
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
```

## Development

This app is built using:

- React Native / Expo
- Firebase for authentication and data storage
- React Navigation for navigation

## Requirements

- Node.js v18 or higher
- Expo CLI
- Firebase account (for full functionality) 