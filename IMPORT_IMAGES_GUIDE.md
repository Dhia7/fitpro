# Import Images to sampleData.ts

This script will fetch images from ExerciseDB API and add `imageUrl` fields directly to your exercises in `sampleData.ts`.

## Usage

### Option 1: Environment Variable
```bash
RAPIDAPI_KEY=your_api_key_here npm run import-images
```

### Option 2: Command Line Argument
```bash
npm run import-images your_api_key_here
```

## What It Does

1. ✅ Reads `src/data/sampleData.ts`
2. ✅ Finds all exercises in your workout plan
3. ✅ Fetches images from ExerciseDB API for each exercise
4. ✅ Adds `imageUrl` field directly to each exercise object
5. ✅ Creates a backup file (`sampleData.ts.backup`) before making changes
6. ✅ Updates `sampleData.ts` with image URLs

## Example

**Before:**
```typescript
{
  name: "Incline Dumbbell Press",
  sets: 4,
  reps: "10-12",
  rest: "2-3 min",
}
```

**After:**
```typescript
{
  name: "Incline Dumbbell Press",
  sets: 4,
  reps: "10-12",
  rest: "2-3 min",
  imageUrl: "https://exercisedb.p.rapidapi.com/image?exerciseId=...",
}
```

## Get Your API Key

1. Go to https://rapidapi.com/hub
2. Sign up or log in
3. Search for "ExerciseDB"
4. Subscribe (free tier available)
5. Copy your API key

## Notes

- Creates a backup before modifying files
- Only adds images for exercises that are found in the API
- Shows which exercises couldn't be found
- Rate limits requests to respect API limits





