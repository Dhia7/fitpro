# Quick Customization Guide

This guide will help you quickly customize the workout and meal plan template for your clients.

## 📝 Main Customization File

**All client data is in one file: `src/data/sampleData.ts`**

This is the ONLY file you need to edit to create custom plans for your clients!

## 🎯 Step-by-Step Customization

### 1. Client Information

Find the `sampleClientInfo` object and update:

```typescript
export const sampleClientInfo: ClientInfo = {
  name: "Client Name Here",           // Your client's name
  startDate: "January 15, 2025",      // Plan start date
  endDate: "March 15, 2025",          // Plan end date
  trainerName: "Your Name",           // Your name as trainer
  trainerEmail: "your@email.com",     // Your contact email
  goal: "Build muscle and lose 15 lbs", // Client's fitness goal
};
```

### 2. Workout Plan

Find the `sampleWorkoutPlan` array. Each day follows this structure:

```typescript
{
  day: "Monday",                      // Day of the week
  focus: "Chest & Triceps",          // Muscle group focus
  exercises: [
    {
      name: "Bench Press",            // Exercise name
      sets: 4,                        // Number of sets
      reps: "8-10",                   // Reps per set (can be range)
      rest: "90s",                    // Rest time between sets
      notes: "Optional notes"         // Exercise tips (optional)
    },
    // Add more exercises...
  ]
}
```

**Tips:**
- You have 7 days (Monday-Sunday) in the array
- Add/remove exercises as needed
- Use rest days for recovery
- Reps can be numbers ("12") or ranges ("8-10")

### 3. Meal Plan

Find the `completeMealPlan` array. Each day includes:

```typescript
{
  day: "Monday",
  meals: {
    breakfast: {
      name: "Protein Oatmeal Bowl",
      time: "7:00 AM",
      description: "1 cup oats, 1 scoop protein powder...",
      protein: 35,  // grams
      carbs: 65,    // grams
      fats: 15,     // grams
      calories: 525 // total calories
    },
    lunch: { /* same structure */ },
    dinner: { /* same structure */ },
    snacks: [     // Array of snacks
      { /* same structure */ }
    ]
  },
  totalMacros: {
    protein: 165,  // Total for the day
    carbs: 215,
    fats: 55,
    calories: 2000
  }
}
```

**Tips:**
- Calculate macros based on client's goals
- Adjust meal times to client's schedule
- Snacks array can have 0-3+ snacks
- Update totalMacros to match sum of all meals

### 4. Progress Tracking

Find the `sampleProgress` object:

```typescript
export const sampleProgress: ProgressTracking = {
  measurements: {
    weight: 185,        // Current weight (lbs)
    bodyFat: 18,        // Body fat percentage
    chest: 42,          // All measurements in inches
    waist: 34,
    hips: 40,
    arms: 15,
    thighs: 24,
  },
  goals: {
    shortTerm: [        // 4-8 week goals
      "Lose 5 lbs of body fat",
      "Increase bench press by 20 lbs",
    ],
    longTerm: [         // 3-6 month goals
      "Reach 170 lbs at 12% body fat",
      "Bench press 225 lbs for reps",
    ],
  },
  notes: `Your personalized notes to the client...
  
  Use this space for:
  - Encouragement
  - Important reminders
  - Contact information
  - Additional instructions
  `,
};
```

## 🎨 Branding & Styling

### Change Colors

Edit `src/index.css` to change the color scheme:

```css
:root {
  /* Main brand color - change this to your brand color */
  --color-primary: 221.2 83.2% 53.3%;  /* Blue by default */
  
  /* Other colors... */
}
```

**Popular color values (HSL format):**
- Blue: `221.2 83.2% 53.3%`
- Green: `142.1 76.2% 36.3%`
- Red: `0 84.2% 60.2%`
- Purple: `262.1 83.3% 57.8%`
- Orange: `24.6 95% 53.1%`

Use a tool like [HSL Color Picker](https://hslpicker.com/) to find your brand colors.

## 📄 Exporting Plans

1. Click the "Print / Save as PDF" button
2. In the print dialog, choose "Save as PDF"
3. Adjust settings if needed (margins, orientation)
4. Save and send to your client!

## 💡 Pro Tips

### Create Multiple Templates
```bash
# Save different versions for different client types
sampleData.ts           # Current template
sampleData-weightloss.ts   # Weight loss template
sampleData-bulking.ts      # Muscle gain template
```

Then import the one you need in `App.tsx`.

### Quick Changes Between Clients
1. Keep a master template
2. Copy `sampleData.ts` to a backup
3. Edit for each client
4. Export to PDF
5. Restore backup for next client

### Macro Calculator

Use these formulas for macro calculations:
- **Protein**: 0.8-1.2g per lb body weight
- **Fats**: 0.3-0.5g per lb body weight
- **Carbs**: Remaining calories / 4

**Example for 170lb client (weight loss):**
- Calories: 1,800 (deficit)
- Protein: 170g (680 cal)
- Fats: 60g (540 cal)
- Carbs: 145g (580 cal)

## 🔧 Common Modifications

### Add More Days to Workout Plan
Just copy an existing day object and modify:

```typescript
{
  day: "Extra Day",
  focus: "Cardio",
  exercises: [ /* your exercises */ ]
}
```

### Remove Measurements
In `sampleProgress`, delete any measurements you don't track:

```typescript
measurements: {
  weight: 185,
  // Removed: bodyFat, chest, waist, etc.
}
```

### Add Custom Notes Section
The notes field supports multi-line text with formatting.

## 🚀 Next Steps

1. Edit `src/data/sampleData.ts` with your client's info
2. Run `npm run dev` to see changes live
3. Export to PDF when ready
4. Repeat for each client!

## ❓ Questions?

- Check the main [README.md](./README.md) for technical details
- TypeScript will show errors if data format is wrong
- All changes are instant in development mode

---

**Remember**: Only edit `src/data/sampleData.ts` for client data. Everything else is pre-configured! 🎉










