# Google Authentication Setup

To enable Google Sign-In in your HisabKitab app, follow these steps:

## Firebase Console Setup

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Select your HisabKitab project

2. **Enable Google Authentication**
   - Navigate to **Authentication** in the left sidebar
   - Click on the **Sign-in method** tab
   - Find **Google** in the list of providers
   - Click on **Google** to expand it
   - Toggle the **Enable** switch to ON
   - Provide a **Project public-facing name** (e.g., "HisabKitab")
   - Provide a **Support email** (your email address)
   - Click **Save**

3. **Authorize Domains (Important for Deployment!)**
   - In the **Authentication** section, click **Settings** tab
   - Scroll down to **Authorized domains**
   - By default, `localhost` is already authorized for local development
   - Click **Add domain** to add your production domains:
     - Add your Vercel domain (e.g., `your-app-name.vercel.app`)
     - If you have a custom domain, add that too (e.g., `www.yourdomain.com`)
   - Click **Add** for each domain
   - **Note**: Without this step, you'll get `auth/unauthorized-domain` error in production!

4. **Done!**
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

## Troubleshooting

### Error: `auth/unauthorized-domain`

**Problem**: Getting this error on your deployed site (Vercel, Netlify, etc.)

**Solution**: 
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Authentication** → **Settings** tab
3. Scroll to **Authorized domains**
4. Click **Add domain** and enter your deployment URL (e.g., `your-app.vercel.app`)
5. Save and wait a few minutes for changes to propagate
6. Clear your browser cache and try again

### Error: Popup blocked

**Problem**: Browser blocks the Google Sign-In popup

**Solution**: 
- Allow popups for your site in browser settings
- Or use redirect mode instead of popup (requires code changes)
