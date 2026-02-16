<<<<<<< HEAD
# fitpro
=======
# Workout & Meal Plan Template

A professional, responsive workout and meal plan template built with React, Tailwind CSS, and shadcn/ui. Perfect for personal trainers, nutritionists, and fitness coaches to create customized plans for their clients.

## Features

- **Modern & Professional Design**: Clean, beautiful UI with shadcn/ui components
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Print/PDF Export**: One-click export to PDF for easy sharing with clients
- **Three Main Sections**:
  - Workout Plan: Weekly exercise schedule with sets, reps, and rest times
  - Meal Plan: Daily meal schedules with macro breakdowns
  - Progress Tracking: Body measurements, goals, and trainer notes
- **Easy to Customize**: Simple data structure for quick personalization
- **TypeScript**: Full type safety for better development experience

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety and better IDE support
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **lucide-react** - Beautiful icon library
- **react-to-print** - Print/PDF functionality

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Customization

### Editing Client Information

Edit the file `src/data/sampleData.ts` to customize the template for your clients:

```typescript
export const sampleClientInfo: ClientInfo = {
  name: "Your Client's Name",
  startDate: "Start Date",
  endDate: "End Date",
  trainerName: "Your Name",
  trainerEmail: "your@email.com",
  goal: "Client's fitness goal",
};
```

### Customizing Workout Plans

Modify the `sampleWorkoutPlan` array in `src/data/sampleData.ts`:

```typescript
{
  day: "Monday",
  focus: "Chest & Triceps",
  exercises: [
    {
      name: "Bench Press",
      sets: 4,
      reps: "8-10",
      rest: "90s",
      notes: "Optional notes"
    },
    // Add more exercises...
  ]
}
```

### Customizing Meal Plans

Update the `completeMealPlan` array in `src/data/sampleData.ts`:

```typescript
{
  day: "Monday",
  meals: {
    breakfast: {
      name: "Meal Name",
      time: "7:00 AM",
      description: "Meal description",
      protein: 35,
      carbs: 65,
      fats: 15,
      calories: 525,
    },
    // lunch, dinner, snacks...
  },
  totalMacros: {
    protein: 165,
    carbs: 215,
    fats: 55,
    calories: 2000,
  }
}
```

### Customizing Progress Tracking

Edit the `sampleProgress` object in `src/data/sampleData.ts`:

```typescript
export const sampleProgress: ProgressTracking = {
  measurements: {
    weight: 185,
    bodyFat: 18,
    // Add more measurements...
  },
  goals: {
    shortTerm: ["Goal 1", "Goal 2"],
    longTerm: ["Goal 1", "Goal 2"],
  },
  notes: "Your trainer notes here...",
};
```

## Styling & Branding

### Changing Colors

Edit `src/index.css` to customize the color scheme. The template uses CSS variables:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Main brand color */
  --secondary: 210 40% 96.1%;     /* Secondary color */
  /* More color variables... */
}
```

### Custom Fonts

Add your custom fonts in `src/index.css` or the HTML head, then update Tailwind config.

## Building for Production

Create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder. You can deploy these to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Print/PDF Export

Click the "Print / Save as PDF" button in the top right corner. This will:
- Open your browser's print dialog
- Format the content for printing
- Allow you to save as PDF
- Hide UI elements (buttons, tabs) from the print output

## Project Structure

```
workout/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.tsx       # Header component
│   │   ├── WorkoutPlan.tsx  # Workout section
│   │   ├── MealPlan.tsx     # Meal section
│   │   └── ProgressTracking.tsx
│   ├── data/
│   │   └── sampleData.ts    # ⭐ Edit this to customize
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── index.css            # Global styles
│   └── main.tsx             # App entry point
├── public/
├── package.json
└── README.md
```

## Tips for Personal Trainers

1. **Create Templates**: Set up different workout/meal plan templates for different goals (weight loss, muscle gain, maintenance)
2. **Version Control**: Use Git to keep different versions for different clients
3. **Reusable Components**: The modular structure makes it easy to mix and match workout days and meals
4. **Export & Share**: Print to PDF and email to clients or use cloud storage
5. **Track Progress**: Update measurements every 2-4 weeks

## Browser Support

- Chrome (recommended for printing)
- Firefox
- Safari
- Edge

## Troubleshooting

### Print Layout Issues
- Use Chrome for best PDF export results
- Adjust print margins in your browser's print settings
- Check "Background graphics" option for colored elements

### Development Server Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

This template is free to use for personal and commercial projects.

## Support

For questions or issues, please refer to the documentation or create an issue in the repository.

---

**Happy Training! 💪**
>>>>>>> ad12510 (initial commit)
