# Exercise Images Integration Guide

This project now includes automatic exercise image fetching from the ExerciseDB API. Exercise images will be displayed next to each exercise name in the workout plan, making it easier for clients to see proper form.

## How It Works

1. **Automatic Image Fetching**: When the WorkoutPlan component loads, it automatically fetches images for all exercises from the ExerciseDB API.

2. **Image Caching**: Images are cached in memory to avoid repeated API calls.

3. **Fallback Handling**: If an image can't be found or fails to load, a dumbbell icon is displayed as a fallback.

## Features

- ✅ Automatic image fetching from ExerciseDB API
- ✅ Loading states while images are being fetched
- ✅ Error handling with fallback icons
- ✅ Image caching to reduce API calls
- ✅ Lazy loading for better performance
- ✅ Pre-generation script for offline use

## Usage

### Option 1: Automatic (Default)

The app will automatically fetch images when you load the workout plan. No action needed!

### Option 2: Pre-generate Image Map (Recommended for Production)

For better performance and offline support, you can pre-generate an image map:

1. **Install tsx** (if not already installed):
   ```bash
   npm install --save-dev tsx
   ```

2. **Run the image fetcher script**:
   ```bash
   npm run fetch-images
   ```

   This will:
   - Fetch images for all exercises in your workout plan
   - Generate `src/lib/exerciseImageMap.ts` with all image URLs
   - Show a summary of how many images were found

3. **The app will automatically use the pre-generated map** instead of making API calls.

### Option 3: Manual Image URLs

You can also manually add `imageUrl` to any exercise in `src/data/sampleData.ts`:

```typescript
{
  name: "Bench Press",
  sets: 3,
  reps: "8-10",
  rest: "2-3 min",
  notes: "Control the descent, explosive press",
  imageUrl: "https://example.com/bench-press.jpg", // Add this
}
```

## API Information

### Option 1: ExerciseDB via RapidAPI (Requires API Key)

The ExerciseDB API is available through RapidAPI:
- Sign up at https://rapidapi.com/hub
- Subscribe to ExerciseDB API
- Get your API key
- Update the script to include your API key

### Option 2: Free Alternatives

Since most exercise APIs require keys, here are free alternatives:

1. **Manual Image URLs**: Add `imageUrl` directly to exercises in `sampleData.ts`
2. **Free Image Hosting**: Upload images to services like:
   - Imgur (free, no account needed for public images)
   - Cloudinary (free tier available)
   - Your own CDN or public folder
3. **Pre-generated Map**: Run the script once with an API key, then use the generated map

### Option 3: Use Pre-generated Map

The recommended approach for production:
1. Run `npm run fetch-images` once (with API key if needed)
2. This generates `src/lib/exerciseImageMap.ts`
3. The app automatically uses the pre-generated map
4. No API calls needed at runtime!

## Troubleshooting

### Images not loading?

1. Check browser console for errors
2. Verify internet connection (API calls require internet)
3. Run `npm run fetch-images` to pre-generate images
4. Check if ExerciseDB API is accessible: https://api.exercisedb.io

### Want to use a different API?

Edit `src/lib/exerciseImages.ts` and modify the `fetchExerciseImage` function to use your preferred API endpoint.

## File Structure

```
src/
├── lib/
│   ├── exerciseImages.ts          # Main utility functions
│   └── exerciseImageMap.ts        # Auto-generated image map (optional)
├── components/
│   └── WorkoutPlan.tsx            # Updated to display images
├── types/
│   └── index.ts                   # Exercise type with imageUrl field
└── data/
    └── sampleData.ts              # Your workout data

scripts/
└── fetchExerciseImages.ts         # Script to pre-generate image map
```

## Notes

- Images are fetched asynchronously, so there may be a brief loading period
- The component shows a loading spinner while fetching images
- Failed image loads automatically hide and show the fallback icon
- Images are optimized with lazy loading for better performance

