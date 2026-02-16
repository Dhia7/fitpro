# Quick Start: Adding Exercise Images

## Easiest Method: Manual Image URLs

Add `imageUrl` directly to your exercises in `src/data/sampleData.ts`:

```typescript
{
  name: "Bench Press",
  sets: 3,
  reps: "8-10",
  rest: "2-3 min",
  notes: "Control the descent, explosive press",
  imageUrl: "https://i.imgur.com/example.jpg", // Add your image URL here
}
```

## Where to Get Free Exercise Images

### Option 1: Imgur (Easiest)
1. Go to https://imgur.com
2. Upload exercise images
3. Right-click image → "Copy image address"
4. Use that URL in `imageUrl`

### Option 2: Use Exercise Image URLs
Here are some example URLs you can use (replace with your own):

```typescript
// Example structure - replace with actual image URLs
const exerciseImageExamples = {
  "Bench Press": "https://example.com/bench-press.jpg",
  "Squats": "https://example.com/squats.jpg",
  "Deadlifts": "https://example.com/deadlifts.jpg",
  // ... etc
};
```

### Option 3: Local Images
1. Create `public/images/exercises/` folder
2. Add your images there
3. Reference as: `imageUrl: "/images/exercises/bench-press.jpg"`

## Using the API Script (Requires API Key)

If you have a RapidAPI key for ExerciseDB:

1. Edit `scripts/fetchExerciseImages.ts`
2. Uncomment the RapidAPI section and add your key
3. Run: `npm run fetch-images`
4. Images will be automatically added to `src/lib/exerciseImageMap.ts`

## Current Implementation

The app is already set up to:
- ✅ Display images next to exercise names
- ✅ Show loading spinner while fetching
- ✅ Show fallback icon if image fails
- ✅ Support manual `imageUrl` in exercise data
- ✅ Use pre-generated image map if available

Just add `imageUrl` to your exercises and they'll appear automatically!





