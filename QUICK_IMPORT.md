# ✅ Quick Start: Import Images to sampleData.ts

## Run This Command:

```bash
npm run import-images YOUR_RAPIDAPI_KEY
```

Or:

```bash
RAPIDAPI_KEY=your_key npm run import-images
```

## What Happens:

1. ✅ Script reads all exercises from `src/data/sampleData.ts`
2. ✅ Fetches images from ExerciseDB API for each exercise
3. ✅ Adds `imageUrl` field directly to each exercise
4. ✅ Creates backup file before making changes
5. ✅ Updates `sampleData.ts` with image URLs

## Get Your API Key:

1. Visit https://rapidapi.com/hub
2. Search for "ExerciseDB"
3. Subscribe (free tier works!)
4. Copy your API key

## Example Output:

The script will add `imageUrl` to your exercises like this:

```typescript
{
  name: "Incline Dumbbell Press",
  sets: 4,
  reps: "10-12",
  rest: "2-3 min",
  imageUrl: "https://exercisedb.p.rapidapi.com/image?exerciseId=...", // ← Added automatically!
}
```

## After Running:

Your `sampleData.ts` will have `imageUrl` fields for all exercises that were found in the API. The images will display automatically in your app!

See `IMPORT_IMAGES_GUIDE.md` for more details.





