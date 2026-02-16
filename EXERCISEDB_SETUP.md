# ExerciseDB API Setup Guide

## Quick Setup

To automatically fetch images for all exercises using ExerciseDB API:

### Step 1: Get RapidAPI Key

1. Go to https://rapidapi.com/hub
2. Sign up or log in
3. Search for "ExerciseDB" API
4. Subscribe to the API (free tier available)
5. Copy your API key from the dashboard

### Step 2: Configure API Key

**Option A: Environment Variable (Recommended)**

Create a `.env` file in the root directory:

```env
VITE_RAPIDAPI_KEY=your_api_key_here
```

**Option B: Direct Configuration**

Edit `src/lib/exerciseImages.ts` and set:
```typescript
const RAPIDAPI_KEY = "your_api_key_here";
```

### Step 3: Restart Dev Server

After adding the API key, restart your dev server:
```bash
npm run dev
```

## How It Works

Once configured, the app will:
1. ✅ Automatically fetch images for all exercises when the WorkoutPlan loads
2. ✅ Cache images to avoid repeated API calls
3. ✅ Show loading spinners while fetching
4. ✅ Display fallback icons if images aren't found

## API Limits

- Free tier: Usually 500-1000 requests/month
- Rate limiting: 300ms delay between requests (already implemented)
- Images are cached, so repeated views don't use API calls

## Troubleshooting

### Images not loading?

1. Check browser console for errors
2. Verify API key is set correctly
3. Check RapidAPI dashboard for quota/usage
4. Ensure internet connection is active

### Want to use without API key?

You can still:
- Manually add `imageUrl` to exercises in `sampleData.ts`
- Use the pre-generation script: `npm run fetch-images`
- Use free image hosting services

## Example: Manual Image URL

```typescript
{
  name: "Bench Press",
  sets: 3,
  reps: "8-10",
  imageUrl: "https://example.com/bench-press.jpg"
}
```





