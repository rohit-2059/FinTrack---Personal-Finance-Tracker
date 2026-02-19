# Google Authentication Setup

To enable Google Sign-In in your FinTrack app, follow these steps:

## Firebase Console Setup

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Select your FinTrack project

2. **Enable Google Authentication**
   - Navigate to **Authentication** in the left sidebar
   - Click on the **Sign-in method** tab
   - Find **Google** in the list of providers
   - Click on **Google** to expand it
   - Toggle the **Enable** switch to ON
   - Provide a **Project public-facing name** (e.g., "FinTrack")
   - Provide a **Support email** (your email address)
   - Click **Save**

3. **Done!**
   - Google Sign-In is now enabled for your app
   - Users can sign in with their Google accounts

## Features Added

✅ "Sign in with Google" button on Login page
✅ "Sign in with Google" button on Signup page
✅ Google authentication popup integration
✅ Automatic user profile creation
✅ Seamless navigation after successful login

## Notes

- Google Sign-In uses a popup window
- Users will be prompted to select their Google account
- First-time users will automatically be registered
- Existing Google accounts will be recognized on subsequent logins
- All transactions are linked to the authenticated user ID
