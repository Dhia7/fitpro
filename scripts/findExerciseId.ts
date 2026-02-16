/**
 * Quick script to find the exercise ID for a specific exercise name
 */

const rapidApiKey = process.argv[2] || process.env.RAPIDAPI_KEY || "";
const exerciseName = process.argv[3] || "Incline Dumbbell Press";

if (!rapidApiKey) {
  console.log("Usage: tsx scripts/findExerciseId.ts YOUR_RAPIDAPI_KEY [exercise_name]");
  process.exit(1);
}

async function findExerciseId() {
  console.log(`Searching for: "${exerciseName}"\n`);

  // Try multiple name variations
  const nameVariations = [
    exerciseName,
    exerciseName.toLowerCase(),
    exerciseName.replace(/\s+/g, "-"),
    exerciseName.replace(/\s+/g, "-").toLowerCase(),
    "incline-dumbbell-press",
    "dumbbell-incline-press",
    "incline press",
  ];

  for (const nameVariant of nameVariations) {
    try {
      console.log(`Trying: "${nameVariant}"`);
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(nameVariant)}`,
        {
          headers: {
            "x-rapidapi-key": rapidApiKey,
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        let exercises = Array.isArray(data) ? data : (data.exercises || [data]);
        
        if (exercises.length > 0) {
          console.log(`\n✓ Found ${exercises.length} exercise(s):\n`);
          exercises.forEach((ex: any, i: number) => {
            const id = ex.id || ex.exerciseId || "N/A";
            const imageUrl = `https://exercisedb.p.rapidapi.com/images/${id}.gif`;
            console.log(`${i + 1}. Name: "${ex.name}"`);
            console.log(`   ID: ${id}`);
            console.log(`   Image URL: ${imageUrl}`);
            console.log(`   Body Part: ${ex.bodyPart || ex.bodyParts?.join(", ") || "N/A"}`);
            console.log(`   Equipment: ${ex.equipment || ex.equipments?.join(", ") || "N/A"}`);
            console.log("");
          });
          return;
        }
      } else {
        console.log(`   Status: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   Error: ${error}`);
    }
  }

  console.log(`\n✗ Could not find exercise: "${exerciseName}"`);
  console.log("\nTrying to search all exercises...\n");
  
  // Try fetching all exercises and searching
  try {
    const response = await fetch(
      "https://exercisedb.p.rapidapi.com/exercises",
      {
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    if (response.ok) {
      const allExercises = await response.json();
      const searchTerm = exerciseName.toLowerCase();
      const matches = allExercises.filter((ex: any) => 
        ex.name?.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(ex.name?.toLowerCase())
      );

      if (matches.length > 0) {
        console.log(`Found ${matches.length} similar exercises:\n`);
        matches.slice(0, 5).forEach((ex: any, i: number) => {
          const id = ex.id || ex.exerciseId || "N/A";
          const imageUrl = `https://exercisedb.p.rapidapi.com/images/${id}.gif`;
          console.log(`${i + 1}. "${ex.name}"`);
          console.log(`   ID: ${id}`);
          console.log(`   Image URL: ${imageUrl}\n`);
        });
      } else {
        console.log("No similar exercises found in the database.");
      }
    }
  } catch (error) {
    console.log(`Error fetching all exercises: ${error}`);
  }
}

findExerciseId();




