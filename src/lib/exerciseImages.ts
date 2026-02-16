// Exercise image utilities using ExerciseDB API via RapidAPI
// This file provides functions to fetch and cache exercise images

import { getApiFriendlyName } from "./exerciseNameMappings";

interface ExerciseDBExercise {
  exerciseId: string;
  name: string;
  bodyParts?: string[];
  equipment?: string[];
  targetMuscles?: string[];
  gifUrl?: string;
}

// API Configuration - Set your RapidAPI key here or via environment variable
// Get your key from: https://rapidapi.com/hub
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";
const RAPIDAPI_HOST = "exercisedb.p.rapidapi.com";

// Cache for exercise images to avoid repeated API calls
const imageCache: Record<string, string> = {};

// Lazy load pre-generated map if available
let preGeneratedMapLoaded = false;
async function loadPreGeneratedMap() {
  if (preGeneratedMapLoaded) return;
  
  try {
    const mapModule = await import("./exerciseImageMap");
    if (mapModule.exerciseImageMap) {
      Object.assign(imageCache, mapModule.exerciseImageMap);
      preGeneratedMapLoaded = true;
    }
  } catch {
    // Image map not generated yet, will use API
  }
}

/**
 * Fetches exercise data from ExerciseDB API via RapidAPI
 * @param exerciseName - Name of the exercise
 * @returns Promise resolving to exercise data or null if not found
 */
async function fetchExerciseData(
  exerciseName: string
): Promise<ExerciseDBExercise | null> {
  if (!RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not set. Set VITE_RAPIDAPI_KEY in .env file or configure in code.");
    return null;
  }

  // Get API-friendly name from mappings first
  const apiFriendlyName = getApiFriendlyName(exerciseName);
  
  // Try multiple name variations
  const nameVariations = [
    apiFriendlyName, // Mapped name
    exerciseName, // Original
    exerciseName.toLowerCase(), // Lowercase
    exerciseName.replace(/\s+/g, "-"), // Replace spaces with hyphens
    exerciseName.replace(/\s+/g, "-").toLowerCase(), // Hyphens + lowercase
    apiFriendlyName.toLowerCase(), // Mapped lowercase
  ];

  for (const nameVariant of nameVariations) {
    try {
      const response = await fetch(
        `https://${RAPIDAPI_HOST}/exercises/name/${encodeURIComponent(nameVariant)}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST,
          },
        }
      );

      if (!response.ok) {
        continue; // Try next variation
      }

      const data = await response.json();
      
      // Handle different response formats
      let exercises: ExerciseDBExercise[] = [];
      
      if (Array.isArray(data)) {
        // Response is directly an array
        exercises = data;
      } else if (data.exercises && Array.isArray(data.exercises)) {
        // Response has exercises property
        exercises = data.exercises;
      } else if (data.exerciseId) {
        // Single exercise object
        exercises = [data];
      }

      if (exercises.length > 0) {
        // Find best match (prefer exact name match)
        const exactMatch = exercises.find(
          (ex) => ex.name.toLowerCase() === exerciseName.toLowerCase()
        );
        return exactMatch || exercises[0];
      }
    } catch (error) {
      // Continue to next variation
      continue;
    }
  }

  // If all variations failed, try searching by body part or equipment
  // For now, return null - we can enhance this later
  console.warn(`Could not find exercise: "${exerciseName}"`);
  return null;
}

/**
 * Gets image URL for an exercise using ExerciseDB API
 * @param exerciseId - Exercise ID from ExerciseDB
 * @param resolution - Image resolution (180, 360, 720, 1080)
 * @returns Image URL or null
 */
function getExerciseImageUrl(exerciseId: string, resolution: string = "360"): string {
  if (!RAPIDAPI_KEY) {
    return "";
  }
  return `https://${RAPIDAPI_HOST}/image?exerciseId=${exerciseId}&resolution=${resolution}&rapidapi-key=${RAPIDAPI_KEY}`;
}

/**
 * Fetches exercise image URL from ExerciseDB API
 * @param exerciseName - Name of the exercise
 * @returns Promise resolving to image URL or null if not found
 */
export async function fetchExerciseImage(
  exerciseName: string
): Promise<string | null> {
  // Load pre-generated map on first call
  await loadPreGeneratedMap();
  
  // Check cache first
  if (imageCache[exerciseName]) {
    return imageCache[exerciseName];
  }

  // Fetch exercise data
  const exerciseData = await fetchExerciseData(exerciseName);
  
  if (exerciseData) {
    // Try to get GIF URL first (usually available)
    if (exerciseData.gifUrl) {
      imageCache[exerciseName] = exerciseData.gifUrl;
      console.log(`✓ Found image for "${exerciseName}": ${exerciseData.gifUrl.substring(0, 50)}...`);
      return exerciseData.gifUrl;
    }

    // Otherwise, construct image URL from exerciseId
    if (exerciseData.exerciseId) {
      const imageUrl = getExerciseImageUrl(exerciseData.exerciseId, "360");
      if (imageUrl) {
        imageCache[exerciseName] = imageUrl;
        console.log(`✓ Found image for "${exerciseName}" via exerciseId: ${exerciseData.exerciseId}`);
        return imageUrl;
      }
    }
  }

  console.warn(`✗ No image found for "${exerciseName}"`);
  return null;
}

/**
 * Batch fetch images for multiple exercises
 * @param exerciseNames - Array of exercise names
 * @returns Promise resolving to a map of exercise names to image URLs
 */
export async function fetchExerciseImages(
  exerciseNames: string[]
): Promise<Record<string, string>> {
  const imageMap: Record<string, string> = {};
  const uniqueNames = [...new Set(exerciseNames)];

  // Load pre-generated map first
  await loadPreGeneratedMap();

  // Fetch images with rate limiting
  for (const name of uniqueNames) {
    // Skip if already in cache
    if (imageCache[name]) {
      imageMap[name] = imageCache[name];
      continue;
    }

    const imageUrl = await fetchExerciseImage(name);
    if (imageUrl) {
      imageMap[name] = imageUrl;
    }
    
    // Rate limiting - wait 300ms between requests to respect API limits
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return imageMap;
}

/**
 * Get cached image URL for an exercise
 * @param exerciseName - Name of the exercise
 * @returns Cached image URL or undefined
 */
export function getCachedExerciseImage(
  exerciseName: string
): string | undefined {
  return imageCache[exerciseName];
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!RAPIDAPI_KEY;
}

