# Troubleshooting: Exercise Images Not Showing

## Quick Checks

### 1. Is your API key configured?

Open your browser console (F12) and check for:
- `RAPIDAPI_KEY not set` warning → You need to add your API key
- `💡 Tip: To automatically fetch exercise images...` → API key missing

**Fix:** Add `VITE_RAPIDAPI_KEY=your_key` to `.env` file and restart dev server

### 2. Check Console Logs

Open browser console (F12) and look for:
- `✓ Found image for "Incline Dumbbell Press"` → Image found!
- `✗ No image found for "Incline Dumbbell Press"` → API didn't find it
- `📸 Fetched X/Y exercise images` → Summary of what was found

### 3. Common Issues

#### Issue: API Key Not Working
**Symptoms:** No images loading, API errors in console

**Solutions:**
- Verify your RapidAPI key is correct
- Check RapidAPI dashboard for quota/usage limits
- Ensure key is in `.env` file (not `.env.local` or other)
- Restart dev server after adding key

#### Issue: Exercise Name Not Found
**Symptoms:** Some exercises show images, others don't

**Solutions:**
1. **Check the console** - it will show which exercises couldn't be found
2. **Manual mapping** - Edit `src/lib/exerciseNameMappings.ts` to add name mappings
3. **Manual image URL** - Add `imageUrl` directly to exercise in `sampleData.ts`:

```typescript
{
  name: "Incline Dumbbell Press",
  sets: 4,
  reps: "10-12",
  imageUrl: "https://your-image-url.com/incline-dumbbell-press.jpg", // Add this
}
```

## Debugging Steps

### Step 1: Check API Key
```bash
# In your .env file, make sure you have:
VITE_RAPIDAPI_KEY=your_actual_key_here
```

### Step 2: Check Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages about image fetching
4. Check for any errors

### Step 3: Test API Directly

Open browser console and run:
```javascript
// Test if API key works
fetch('https://exercisedb.p.rapidapi.com/exercises/name/incline-dumbbell-press', {
  headers: {
    'X-RapidAPI-Key': 'YOUR_KEY_HERE',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
})
.then(r => r.json())
.then(console.log)
```

### Step 4: Manual Fix for Specific Exercise

If "Incline Dumbbell Press" specifically isn't working:

**Option A: Add manual image URL**
Edit `src/data/sampleData.ts`:
```typescript
{
  name: "Incline Dumbbell Press",
  sets: 4,
  reps: "10-12",
  rest: "2-3 min",
  notes: "Control the descent, explosive press",
  imageUrl: "https://example.com/incline-dumbbell-press.jpg", // Add this
}
```

**Option B: Update name mapping**
Edit `src/lib/exerciseNameMappings.ts` and add/modify:
```typescript
export const exerciseNameMappings: Record<string, string> = {
  "Incline Dumbbell Press": "incline-dumbbell-press", // Try different variations
  // or
  "Incline Dumbbell Press": "dumbbell-incline-press",
};
```

## Still Not Working?

1. **Check RapidAPI Dashboard**
   - Go to https://rapidapi.com/developer/dashboard
   - Verify ExerciseDB API is subscribed
   - Check usage/quota limits

2. **Try Pre-generation Script**
   ```bash
   RAPIDAPI_KEY=your_key npm run fetch-images
   ```
   This will show you exactly which exercises are found and which aren't.

3. **Use Free Image Hosting**
   - Upload images to Imgur, Cloudinary, or similar
   - Add `imageUrl` directly to exercises
   - No API needed!

## Quick Fix: Manual Image URLs

The fastest solution is to add image URLs directly to your exercises:

1. Find images online (Google Images, Imgur, etc.)
2. Copy image URL
3. Add to `sampleData.ts`:

```typescript
{
  name: "Incline Dumbbell Press",
  sets: 4,
  reps: "10-12",
  imageUrl: "https://i.imgur.com/your-image.jpg", // Add this
}
```

This bypasses the API entirely and works immediately!





