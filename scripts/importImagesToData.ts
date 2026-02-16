/**
 * Script to fetch exercise images from ExerciseDB API and update sampleData.ts
 * This will add imageUrl fields directly to each exercise in the data file
 * 
 * Uses the ExerciseDB API from https://github.com/exercisedb/exercisedb-api
 * API Documentation: https://exercisedb.dev
 * 
 * Usage (with RapidAPI - requires API key):
 *   RAPIDAPI_KEY=your_key npm run import-images
 *   or
 *   npm run import-images your_rapidapi_key
 * 
 * Usage (with self-hosted API):
 *   EXERCISEDB_API_URL=https://your-api-url.com npm run import-images
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ExerciseDBExercise {
  id?: string;
  exerciseId?: string; // Some APIs use this
  name: string;
  bodyPart?: string;
  bodyParts?: string[];
  equipment?: string;
  equipments?: string[];
  target?: string;
  targetMuscles?: string[];
  imageUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
  // RapidAPI ExerciseDB v1 format - allow other fields
  [key: string]: unknown;
}


// Name mappings for better API matching
const exerciseNameMappings: Record<string, string[]> = {
  "Incline Dumbbell Press": ["incline-dumbbell-press", "dumbbell-incline-press", "incline press"],
  "Bench Press": ["bench-press", "barbell-bench-press"],
  "Single arm lateral raises": ["lateral-raise", "side-lateral-raise", "dumbbell-lateral-raise"],
  "Triceps Dip": ["tricep-dip", "dip", "chest-dip"],
  "Triceps Pushdown": ["tricep-pushdown", "cable-tricep-pushdown"],
  "Bent Over Row": ["bent-over-row", "barbell-row"],
  "Pull-ups": ["pull-up", "pullup"],
  "Lat Pulldown": ["lat-pulldown", "cable-lat-pulldown"],
  "Reverse Flyes Rear Delts": ["reverse-fly", "rear-delt-fly", "reverse-dumbbell-fly"],
  "Barbell Curls": ["barbell-curl", "barbell-bicep-curl"],
  "Hammer Curls": ["hammer-curl", "dumbbell-hammer-curl"],
  "Squats": ["squat", "bodyweight-squat"],
  "Leg Press / Leg Extension": ["leg-extension", "leg-press", "machine-leg-extension"],
  "Romanian Deadlifts": ["romanian-deadlift", "rdl", "stiff-leg-deadlift"],
  "Leg Curls": ["leg-curl", "hamstring-curl"],
  "Plank": ["plank", "forearm-plank"],
  "Hanging Leg Raises": ["hanging-leg-raise", "hanging-knee-raise"],
  "Overhead Dumbbell Press": ["overhead-press", "shoulder-press", "dumbbell-shoulder-press"],
  "Arnold Press": ["arnold-press", "arnold-dumbbell-press"],
  "Seated Cable Rows": ["seated-cable-row", "cable-row"],
  "Dumbbell Bicep Curls": ["dumbbell-curl", "dumbbell-bicep-curl"],
  "Overhead Tricep Extension": ["overhead-tricep-extension", "overhead-tricep", "french-press"],
  "Barbell Squats": ["barbell-squat", "back-squat"],
  "Deadlifts": ["deadlift", "conventional-deadlift"],
  "Chest Dips": ["chest-dip", "dip", "chest-dips"],
};

async function fetchExerciseImage(
  exerciseName: string,
  apiBaseUrl: string,
  rapidApiKey?: string
): Promise<string | null> {
  // Get API-friendly names (now supports multiple variations)
  const mappedNames = exerciseNameMappings[exerciseName] || [exerciseName];
  
  // Build comprehensive list of name variations
  const nameVariations: string[] = [];
  
  // Add mapped names first (most likely to match)
  nameVariations.push(...mappedNames);
  
  // Add original name and variations
  nameVariations.push(
    exerciseName,
    exerciseName.toLowerCase(),
    exerciseName.replace(/\s+/g, "-"),
    exerciseName.replace(/\s+/g, "-").toLowerCase(),
    // Try without common prefixes/suffixes
    exerciseName.replace(/\s*\/\s*.*$/, "").trim(), // Remove " / Leg Extension" part
    exerciseName.replace(/\s*\(.*?\)/g, "").trim(), // Remove parentheses content
    // Try without "arm" or "single"
    exerciseName.replace(/\b(single|arm)\s+/gi, "").trim(),
    // Try singular/plural variations
    exerciseName.replace(/s$/i, ""), // Remove trailing 's'
    exerciseName + "s", // Add trailing 's'
    // Try common alternative names
    exerciseName.replace(/triceps/gi, "tricep"),
    exerciseName.replace(/tricep/gi, "triceps"),
  );
  
  // Add lowercase versions of mapped names
  mappedNames.forEach(name => {
    nameVariations.push(name.toLowerCase());
    nameVariations.push(name.replace(/\s+/g, "-"));
    nameVariations.push(name.replace(/\s+/g, "-").toLowerCase());
  });

  // Remove duplicates
  const uniqueVariations = [...new Set(nameVariations.filter(v => v.length > 0))];

  // Determine if we're using RapidAPI
  const isRapidAPI = apiBaseUrl.includes("rapidapi.com");

  for (const nameVariant of uniqueVariations) {
    try {
      let response: Response | null = null;
      let headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add RapidAPI headers if using RapidAPI (use lowercase headers)
      if (isRapidAPI && rapidApiKey) {
        headers = {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        };
      }

      // Try RapidAPI endpoint format
      if (isRapidAPI) {
        response = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(nameVariant)}`,
          {
            method: "GET",
            headers,
          }
        );
      } else {
        // Try self-hosted API endpoints (v2 first, then v1)
        response = await fetch(
          `${apiBaseUrl}/api/v2/exercises/name/${encodeURIComponent(nameVariant)}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          response = await fetch(
            `${apiBaseUrl}/api/v1/exercises/name/${encodeURIComponent(nameVariant)}`,
            {
              method: "GET",
              headers,
            }
          );
        }
      }

      if (!response || !response.ok) {
        continue;
      }

      const data = await response.json();
      
      // Handle different response formats
      let exercises: ExerciseDBExercise[] = [];
      
      if (Array.isArray(data)) {
        exercises = data;
      } else if (data.exercises && Array.isArray(data.exercises)) {
        exercises = data.exercises;
      } else if (data.exerciseId) {
        exercises = [data];
      }

      if (exercises.length > 0) {
        const exercise = exercises[0];
        
        // Prefer imageUrl if available (v2 format)
        if (exercise.imageUrl) {
          // If it's a relative path, construct full URL
          if (exercise.imageUrl.startsWith("http")) {
            return exercise.imageUrl;
          } else {
            // Construct full URL from base path
            const exerciseId = exercise.id || exercise.exerciseId;
            if (isRapidAPI && exerciseId) {
              // RapidAPI image endpoint format
              return `https://exercisedb.p.rapidapi.com/images/${exerciseId}.gif`;
            } else {
              return `${apiBaseUrl}/media/exercises/${exercise.imageUrl}`;
            }
          }
        }
        
        // Prefer GIF URL if available (v1 format)
        if (exercise.gifUrl) {
          return exercise.gifUrl;
        }

        // Try constructing image URL from ID for RapidAPI
        const exerciseId = exercise.id || exercise.exerciseId;
        if (isRapidAPI && exerciseId) {
          return `https://exercisedb.p.rapidapi.com/images/${exerciseId}.gif`;
        }

        // Try video URL as fallback
        if (exercise.videoUrl) {
          if (exercise.videoUrl.startsWith("http")) {
            return exercise.videoUrl;
          } else {
            return `${apiBaseUrl}/media/exercises/${exercise.videoUrl}`;
          }
        }
      }
    } catch {
      // Silently continue to next variation
      continue;
    }
  }

  return null;
}

function updateSampleDataWithImages(
  fileContent: string,
  imageMap: Record<string, string>
): string {
  let updatedContent = fileContent;
  
  // Process each exercise that has an image
  for (const [exerciseName, imageUrl] of Object.entries(imageMap)) {
    // Escape special regex characters
    const escapedName = exerciseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Check if imageUrl already exists for this exercise
    const hasImageUrl = new RegExp(
      `name:\\s*"${escapedName}"[^}]*imageUrl:`,
      's'
    ).test(updatedContent);
    
    if (hasImageUrl) {
      // Update existing imageUrl
      updatedContent = updatedContent.replace(
        new RegExp(
          `(name:\\s*"${escapedName}"[^}]*imageUrl:\\s*")[^"]*(")`,
          's'
        ),
        `$1${imageUrl}$2`
      );
    } else {
      // Add imageUrl after the name field
      // Match: name: "Exercise Name", followed by sets/reps/rest/notes
      // Try to match the exact structure with proper indentation
      const pattern = new RegExp(
        `(name:\\s*"${escapedName}")(,?\\s*\\n\\s*(?:sets|reps|rest|notes|\\}))`,
        'g'
      );
      
      updatedContent = updatedContent.replace(
        pattern,
        (match, p1, p2) => {
          // Determine if there's already a comma after name
          const hasComma = p1.endsWith(',') || match.includes(',');
          const comma = hasComma ? '' : ',';
          return `${p1}${comma}\n        imageUrl: "${imageUrl}"${p2}`;
        }
      );
    }
  }
  
  return updatedContent;
}

async function importImagesToSampleData() {
  // Get API key from command line args or environment
  const rapidApiKey = process.argv[2] || process.env.RAPIDAPI_KEY || "";
  
  // Get API base URL from environment or use default
  const apiBaseUrl = process.env.EXERCISEDB_API_URL || "https://exercisedb.p.rapidapi.com";
  
  const isRapidAPI = apiBaseUrl.includes("rapidapi.com");
  
  if (isRapidAPI && !rapidApiKey) {
    console.log("⚠️  RapidAPI Key Required!");
    console.log("\nUsage:");
    console.log("  npm run import-images YOUR_RAPIDAPI_KEY");
    console.log("  or");
    console.log("  RAPIDAPI_KEY=your_key npm run import-images");
    console.log("\nGet your key from: https://rapidapi.com/hub");
    console.log("Search for 'ExerciseDB' and subscribe to get your API key.");
    console.log("\nAlternatively, self-host the API:");
    console.log("  Deploy from: https://github.com/exercisedb/exercisedb-api");
    console.log("  Then run: EXERCISEDB_API_URL=https://your-api.com npm run import-images\n");
    process.exit(1);
  }
  
  console.log(`Using ExerciseDB API: ${apiBaseUrl}`);
  console.log("Source: https://github.com/exercisedb/exercisedb-api");
  console.log("Docs: https://exercisedb.dev\n");

  // Read the sampleData file
  const dataPath = join(__dirname, "../src/data/sampleData.ts");
  const fileContent = readFileSync(dataPath, "utf-8");

  // Extract exercise names from the file
  const exerciseNameMatches = fileContent.matchAll(
    /name:\s*"([^"]+)"/g
  );
  const allExercises = new Set<string>();

  // Better filtering: only get names from exercises array, not meals
  // Match pattern: name: "..." inside exercises array (not meals)
  const exercisePattern = /exercises:\s*\[[\s\S]*?name:\s*"([^"]+)"/g;
  const exerciseMatches = fileContent.matchAll(exercisePattern);
  
  for (const match of exerciseMatches) {
    const name = match[1];
    // Filter out rest days and non-exercise activities
    if (
      !name.includes("Light Cardio") &&
      !name.includes("Stretching") &&
      !name.includes("Complete Rest") &&
      !name.includes("Rest Day") &&
      name.length > 3
    ) {
      allExercises.add(name);
    }
  }
  
  // Also check the original pattern as fallback (but filter meals better)
  for (const match of exerciseNameMatches) {
    const name = match[1];
    const lowerName = name.toLowerCase();
    
    // Skip meal-related names
    const isMeal = lowerName.includes("yogurt") || 
                   lowerName.includes("berries") ||
                   lowerName.includes("turkey") ||
                   lowerName.includes("quinoa") ||
                   lowerName.includes("beef") ||
                   lowerName.includes("stir-fry") ||
                   lowerName.includes("peanut butter") ||
                   lowerName.includes("cottage cheese") ||
                   lowerName.includes("tuna") ||
                   lowerName.includes("salad") ||
                   lowerName.includes("nuts") ||
                   lowerName.includes("omelet") ||
                   lowerName.includes("shrimp") ||
                   lowerName.includes("pasta") ||
                   lowerName.includes("smoothie") ||
                   lowerName.includes("rice cakes") ||
                   lowerName.includes("almond butter") ||
                   lowerName.includes("sushi") ||
                   lowerName.includes("fruit") ||
                   lowerName.includes("cheese") ||
                   lowerName.includes("cod") ||
                   lowerName.includes("trail mix") ||
                   lowerName.includes("casein shake") ||
                   lowerName.includes("oatmeal") ||
                   lowerName.includes("waffles") ||
                   lowerName.includes("wrap") ||
                   lowerName.includes("fajita") ||
                   lowerName.includes("burrito") ||
                   lowerName.includes("pancakes") ||
                   lowerName.includes("french toast") ||
                   lowerName.includes("steak") ||
                   lowerName.includes("potatoes") ||
                   lowerName.includes("beans") ||
                   lowerName.includes("toast") ||
                   lowerName.includes("bacon") ||
                   (lowerName.includes("protein") && (lowerName.includes("shake") || lowerName.includes("bowl") || lowerName.includes("oatmeal")));
    
    // Filter out non-exercise names
    if (
      !name.includes("Dhia Naija") &&
      !isMeal &&
      !name.includes("Light Cardio") &&
      !name.includes("Stretching") &&
      !name.includes("Complete Rest") &&
      name.length > 3
    ) {
      allExercises.add(name);
    }
  }

  console.log(`Found ${allExercises.size} unique exercises`);
  console.log("\nFetching all exercises from ExerciseDB API (single request)...\n");

  const imageMap: Record<string, string> = {};
  const exercisesArray = Array.from(allExercises);

  // Fetch ALL exercises at once to avoid rate limiting
  let allExercisesCache: ExerciseDBExercise[] | null = null;
  try {
    const isRapidAPI = apiBaseUrl.includes("rapidapi.com");
    let headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (isRapidAPI && rapidApiKey) {
      headers = {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      };
    }

    // Try to get all exercises - might need pagination or different endpoint
    let response = await fetch(
      isRapidAPI 
        ? "https://exercisedb.p.rapidapi.com/exercises"
        : `${apiBaseUrl}/api/v2/exercises`,
      {
        method: "GET",
        headers,
      }
    );
    
    // If RapidAPI and response is ok, check if we need more exercises
    // Note: The API might return limited results by default
    if (isRapidAPI && response.ok) {
      const responseText = await response.text();
      const testData = JSON.parse(responseText);
      if (Array.isArray(testData) && testData.length < 50) {
        // Try with limit parameter to get more exercises
        console.log(`  First request returned ${testData.length} exercises, trying to get all exercises...`);
        const limitResponse = await fetch(
          "https://exercisedb.p.rapidapi.com/exercises?limit=1500",
          {
            method: "GET",
            headers,
          }
        );
        if (limitResponse.ok) {
          response = limitResponse;
        } else {
          // Recreate response from the text we already read
          response = new Response(responseText, { status: 200, headers: response.headers });
        }
      } else {
        // Recreate response from the text we already read
        response = new Response(responseText, { status: 200, headers: response.headers });
      }
    }

    if (response.ok) {
      const exercises = await response.json();
      if (Array.isArray(exercises) && exercises.length > 0) {
        allExercisesCache = exercises;
        console.log(`✓ Loaded ${exercises.length} exercises from API`);
        const firstEx = exercises[0];
        const firstId = firstEx.id || firstEx.exerciseId || 'N/A';
        console.log(`  Sample exercise: "${firstEx.name}" (ID: ${firstId})`);
        
        // Debug: show structure of first exercise
        if (process.env.DEBUG) {
          console.log(`  Sample exercise structure:`, JSON.stringify(exercises[0], null, 2).substring(0, 500));
        }
        
        // Check if exercises have IDs (for constructing image URLs)
        const exercisesWithIds = exercises.filter((ex: ExerciseDBExercise) => 
          ex.id || ex.exerciseId
        ).length;
        console.log(`  Exercises with IDs: ${exercisesWithIds}/${exercises.length}`);
        
        // Note: The API might be paginated - only showing first page
        if (exercises.length < 100) {
          console.log(`  ⚠️  Warning: Only ${exercises.length} exercises returned.`);
          console.log(`  This might be a subscription limit. Will use individual lookups as fallback.\n`);
        } else {
          console.log(``);
        }
      } else {
        console.log(`✗ API returned invalid data format`);
        if (process.env.DEBUG) {
          console.log(`  Response type: ${typeof exercises}`);
          console.log(`  Response:`, JSON.stringify(exercises).substring(0, 200));
        }
        console.log(``);
      }
    } else {
      const errorText = await response.text().catch(() => "");
      console.log(`✗ Failed to fetch exercises: ${response.status} - ${errorText.substring(0, 200)}\n`);
      if (response.status === 403) {
        console.log("⚠️  You may need to subscribe to the ExerciseDB API on RapidAPI\n");
      }
      console.log("Trying individual exercise lookups as fallback...\n");
    }
  } catch (error) {
    console.log(`✗ Error fetching all exercises: ${error}\n`);
    console.log("Trying individual exercise lookups as fallback...\n");
  }
  
  // Normalize names for matching (remove spaces, special chars, lowercase)
  const normalizeName = (name: string) => 
    name.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Match exercises locally if we have the cache
  if (allExercisesCache && allExercisesCache.length > 0) {
    console.log(`Matching ${exercisesArray.length} exercises against ${allExercisesCache.length} API exercises...\n`);
    
    // Debug: show some exercise names from API
    if (process.env.DEBUG) {
      console.log(`Sample API exercise names:`, allExercisesCache.slice(0, 10).map((ex: ExerciseDBExercise) => ex.name).join(", "));
      console.log(`Your exercise names:`, exercisesArray.slice(0, 10).join(", "));
      console.log(``);
    }
    
    for (let i = 0; i < exercisesArray.length; i++) {
      const exerciseName = exercisesArray[i];
      console.log(`[${i + 1}/${exercisesArray.length}] Matching: ${exerciseName}`);
      
      const targetName = normalizeName(exerciseName);
      
      // Try exact match first
      let match = allExercisesCache!.find(ex => {
        if (!ex || !ex.name) return false;
        return normalizeName(ex.name) === targetName;
      });
      
      // Try partial match if exact match failed
      if (!match) {
        match = allExercisesCache!.find(ex => {
          if (!ex || !ex.name) return false;
          const exName = normalizeName(ex.name);
          return exName.includes(targetName) || targetName.includes(exName);
        });
      }
      
      // Try matching with mapped names
      if (!match) {
        const mappedNames = exerciseNameMappings[exerciseName];
        if (mappedNames && mappedNames.length > 0) {
          for (const mappedName of mappedNames) {
            const mappedTarget = normalizeName(mappedName);
            match = allExercisesCache!.find(ex => {
              if (!ex || !ex.name) return false;
              const exName = normalizeName(ex.name);
              return exName === mappedTarget || exName.includes(mappedTarget) || mappedTarget.includes(exName);
            });
            if (match) break; // Found a match, stop searching
          }
        }
      }
      
      if (match) {
        const isRapidAPI = apiBaseUrl.includes("rapidapi.com");
        let imageUrl: string | null = null;
        
        // Get the ID (could be 'id' or 'exerciseId')
        const exerciseId = match.id || match.exerciseId;
        
        // Debug: show what fields the match has
        if (process.env.DEBUG) {
          console.log(`    Match details:`, {
            name: match.name,
            id: match.id,
            exerciseId: match.exerciseId,
            hasImageUrl: !!match.imageUrl,
            hasGifUrl: !!match.gifUrl,
            imageUrl: match.imageUrl,
            gifUrl: match.gifUrl
          });
        }
        
        // Try imageUrl first
        if (match.imageUrl) {
          imageUrl = match.imageUrl.startsWith("http") 
            ? match.imageUrl 
            : (isRapidAPI && exerciseId 
                ? `https://exercisedb.p.rapidapi.com/images/${exerciseId}.png`
                : `${apiBaseUrl}/media/exercises/${match.imageUrl}`);
        } 
        // Try gifUrl second
        else if (match.gifUrl) {
          imageUrl = match.gifUrl;
        } 
        // Construct from ID for RapidAPI
        else if (isRapidAPI && exerciseId) {
          // RapidAPI ExerciseDB uses /images/{id}.gif or .png
          imageUrl = `https://exercisedb.p.rapidapi.com/images/${exerciseId}.gif`;
        }
        
        if (imageUrl) {
          imageMap[exerciseName] = imageUrl;
          console.log(`  ✓ Found: ${match.name} (ID: ${exerciseId || 'N/A'})`);
          if (process.env.DEBUG) {
            console.log(`    Image URL: ${imageUrl}`);
          }
        } else {
          console.log(`  ✗ No image URL found for: ${match.name} (ID: ${exerciseId || 'N/A'})`);
          if (process.env.DEBUG) {
            console.log(`    Available fields:`, Object.keys(match));
          }
        }
      } else {
        console.log(`  ✗ No match found`);
        // Show some similar exercise names for debugging
        if (process.env.DEBUG && allExercisesCache) {
          const similar = allExercisesCache
            .filter(ex => ex.name && normalizeName(ex.name).includes(targetName.substring(0, 5)))
            .slice(0, 3)
            .map(ex => ex.name);
          if (similar.length > 0) {
            console.log(`    Similar exercises in API: ${similar.join(", ")}`);
          }
        }
      }
    }
  }
  
  // If we didn't get enough exercises from bulk fetch, use individual lookups
  if (!allExercisesCache || allExercisesCache.length < 50) {
    console.log("\n⚠️  Bulk fetch returned limited results. Using individual exercise lookups...\n");
    console.log("Note: This may take longer and could hit rate limits.\n");
    
    for (let i = 0; i < exercisesArray.length; i++) {
      const exerciseName = exercisesArray[i];
      
      // Skip if we already found it in bulk fetch
      if (imageMap[exerciseName]) {
        continue;
      }
      
      // Skip meal names (they shouldn't be in exercisesArray, but double-check)
      const lowerName = exerciseName.toLowerCase();
      const isMeal = lowerName.includes("chicken") || 
                     lowerName.includes("salmon") || 
                     lowerName.includes("rice") ||
                     lowerName.includes("potato") ||
                     lowerName.includes("scramble") ||
                     lowerName.includes("protein bar") ||
                     lowerName.includes("grilled");
      
      if (isMeal) {
        console.log(`[${i + 1}/${exercisesArray.length}] Skipping meal: ${exerciseName}`);
        continue;
      }
      
      console.log(`[${i + 1}/${exercisesArray.length}] Fetching: ${exerciseName}`);
      
      const imageUrl = await fetchExerciseImage(exerciseName, apiBaseUrl, rapidApiKey);
      
      if (imageUrl) {
        imageMap[exerciseName] = imageUrl;
        console.log(`  ✓ Found image: ${imageUrl.substring(0, 60)}...`);
      } else {
        console.log(`  ✗ No image found`);
      }

      // Rate limiting - wait 1.5 seconds between requests to avoid 429 errors
      if (i < exercisesArray.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  // Update sampleData.ts with image URLs
  console.log("\n📝 Updating sampleData.ts with image URLs...");
  const updatedContent = updateSampleDataWithImages(fileContent, imageMap);
  
  // Create backup
  const backupPath = join(__dirname, "../src/data/sampleData.ts.backup");
  writeFileSync(backupPath, fileContent);
  console.log(`✓ Backup created: ${backupPath}`);
  
  // Write updated content
  writeFileSync(dataPath, updatedContent);
  console.log(`✓ Updated ${dataPath}`);
  
  console.log(
    `\n✅ Success! Added imageUrl to ${Object.keys(imageMap).length}/${exercisesArray.length} exercises`
  );
  console.log("\nMissing images for:", exercisesArray.filter(name => !imageMap[name]).join(", "));
}

// Run the script
importImagesToSampleData().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});

