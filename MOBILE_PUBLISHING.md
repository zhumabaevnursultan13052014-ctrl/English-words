# Nursultan mobile publishing setup

This project is currently a browser app. To publish to Android or iPhone, it needs a mobile wrapper and store-level developer setup.

## Required outside this environment

- Node.js and npm installed
- Android Studio for Google Play
- Xcode for App Store
- Google Play Console account
- Apple Developer Program account

## Local setup

1. Install Node.js and npm.
2. In this folder run:
   npm install
3. To prepare the Android project:
   npx cap add android
4. To prepare the iOS project:
   npx cap add ios
5. To sync the web app into the native project:
   npx cap sync
6. Open the native project:
   npx cap open android
   npx cap open ios

## Store publishing

- Google Play: upload the Android app bundle from Android Studio.
- App Store: upload the app from Xcode and App Store Connect.

## Important note

Publishing is not only technical. It also needs:
- app icons and splash screens
- privacy policy
- app store listing text
- screenshots
- monetization plan

This folder now contains the first mobile packaging foundation for the app.
