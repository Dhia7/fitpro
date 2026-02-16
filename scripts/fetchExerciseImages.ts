/**
 * Script to fetch exercise images from ExerciseDB API
 * and optionally update the sampleData.ts file with image URLs
 * 
 * Usage:
 *   npx tsx scripts/fetchExerciseImages.ts
 * 
 * Or add to package.json:
 *   "scripts": {
 *     "fetch-images": "tsx scripts/fetchExerciseImages.ts"
 *   }
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ExerciseDBExercise {
  exerciseId: string;
  name: string;
  bodyParts?: string[];
  equipment?: string[];
  targetMuscles?: string[];
  gifUrl?: string;
}

interface ExerciseDBResponse {
  exercises?: ExerciseDBExercise[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  imageUrl?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

async function fetchExerciseImage(
  exerciseName: string,
  rapidApiKey?: string
): Promise<string | null> {
  const RAPIDAPI_KEY = rapidApiKey || process.env.RAPIDAPI_KEY || "";
  const RAPIDAPI_HOST = "exercisedb.p.rapidapi.com";

  if (!RAPIDAPI_KEY) {
    console.log(`  ⚠ No RapidAPI key found. Set RAPIDAPI_KEY environment variable or pass as argument.`);
    console.log(`     Get your key from: https://rapidapi.com/hub`);
    return null;
  }

  try {
    // Fetch exercise data from RapidAPI
    let response = await fetch(
      `https://${RAPIDAPI_HOST}/exercises/name/${encodeURIComponent(exerciseName)}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    if (!response.ok) {
      // Try lowercase
      response = await fetch(
        `https://${RAPIDAPI_HOST}/exercises/name/${encodeURIComponent(exerciseName.toLowerCase())}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST,
          },
        }
      );
    }

    if (!response.ok) {
      console.log(`  ⚠ API returned ${response.status}. Check your API key.`);
      return null;
    }

    const data: ExerciseDBResponse = await response.json();

    if (data.exercises && data.exercises.length > 0) {
      const exercise = data.exercises[0];
      
      // Prefer GIF URL if available
      if (exercise.gifUrl) {
        return exercise.gifUrl;
      }

      // Otherwise, construct image URL from exerciseId
      if (exercise.exerciseId) {
        return `https://${RAPIDAPI_HOST}/image?exerciseId=${exercise.exerciseId}&resolution=360&rapidapi-key=${RAPIDAPI_KEY}`;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching image for ${exerciseName}:`, error);
    return null;
  }
}

async function generateExerciseImageMap() {
  // Get API key from command line args or environment
  const rapidApiKey = process.argv[2] || process.env.RAPIDAPI_KEY || "";

  if (!rapidApiKey) {
    console.log("⚠️  RapidAPI Key Required!");
    console.log("\nUsage:");
    console.log("  npm run fetch-images YOUR_RAPIDAPI_KEY");
    console.log("  or");
    console.log("  RAPIDAPI_KEY=your_key npm run fetch-images");
    console.log("\nGet your key from: https://rapidapi.com/hub");
    console.log("Search for 'ExerciseDB' and subscribe to get your API key.\n");
    process.exit(1);
  }

  // Read the sampleData file
  const dataPath = join(__dirname, "../src/data/sampleData.ts");
  const fileContent = readFileSync(dataPath, "utf-8");

  // Extract exercise names using regex (simple approach)
  const exerciseNameMatches = fileContent.matchAll(
    /name:\s*"([^"]+)"/g
  );
  const allExercises = new Set<string>();

  for (const match of exerciseNameMatches) {
    const name = match[1];
    // Filter out non-exercise names (like meal names, client names, etc.)
    if (
      !name.includes("Dhia Naija") &&
      !name.includes("Protein") &&
      !name.includes("Chicken") &&
      !name.includes("Salmon") &&
      !name.includes("Grilled") &&
      !name.includes("Egg") &&
      !name.includes("Breakfast") &&
      !name.includes("Lunch") &&
      !name.includes("Dinner") &&
      !name.includes("Snack") &&
      !name.includes("Light Cardio") &&
      !name.includes("Stretching") &&
      !name.includes("Complete Rest") &&
      name.length > 3
    ) {
      allExercises.add(name);
    }
  }

  console.log(`Found ${allExercises.size} unique exercises`);
  console.log("Exercises:", Array.from(allExercises).join(", "));
  console.log("\nFetching images from ExerciseDB API...\n");

  const imageMap: Record<string, string> = {};
  const exercisesArray = Array.from(allExercises);

  // Fetch images for each exercise
  for (let i = 0; i < exercisesArray.length; i++) {
    const exerciseName = exercisesArray[i];
    console.log(`[${i + 1}/${exercisesArray.length}] Fetching: ${exerciseName}`);
    const imageUrl = await fetchExerciseImage(exerciseName, rapidApiKey);

    if (imageUrl) {
      imageMap[exerciseName] = imageUrl;
      console.log(`  ✓ Found image: ${imageUrl.substring(0, 60)}...`);
    } else {
      console.log(`  ✗ No image found`);
    }

    // Rate limiting - wait 300ms between requests to be respectful
    if (i < exercisesArray.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  // Generate the image map file
  const outputPath = join(__dirname, "../src/lib/exerciseImageMap.ts");
  const content = `// Auto-generated exercise image map from ExerciseDB API
// Generated on: ${new Date().toISOString()}
// Total exercises: ${exercisesArray.length}
// Images found: ${Object.keys(imageMap).length}

export const exerciseImageMap: Record<string, string> = ${JSON.stringify(imageMap, null, 2)};

export function getExerciseImage(exerciseName: string): string | undefined {
  return exerciseImageMap[exerciseName];
}
`;

  writeFileSync(outputPath, content);
  console.log(`\n✓ Saved image map to ${outputPath}`);
  console.log(
    `\nSummary: Found images for ${Object.keys(imageMap).length}/${exercisesArray.length} exercises`
  );

  // Optionally update sampleData.ts with image URLs
  console.log("\nTo use these images, you can:");
  console.log("1. Import getExerciseImage from '@/lib/exerciseImageMap'");
  console.log("2. Use it in your components (already done in WorkoutPlan.tsx)");
  console.log("3. Or manually add imageUrl to exercises in sampleData.ts");
}

// Run the script
generateExerciseImageMap().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});

