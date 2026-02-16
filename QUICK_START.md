# Quick Start Guide

Get your workout & meal plan template up and running in 3 minutes!

## 🚀 Getting Started

### 1. First Time Setup
```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### 2. Customize for Your Client
Edit **ONE FILE**: `src/data/sampleData.ts`

Change:
- Client name and dates
- Workout exercises  
- Meal plans and macros
- Progress tracking data

### 3. Export to PDF
1. Click "Print / Save as PDF" button
2. Choose "Save as PDF" in print dialog
3. Save and send to client!

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/data/sampleData.ts` | **⭐ EDIT THIS** - All client data |
| `src/index.css` | Change colors/branding |
| `README.md` | Full documentation |
| `CUSTOMIZATION_GUIDE.md` | Detailed customization help |

## 🎯 Most Common Edits

### Change Client Name
```typescript
// src/data/sampleData.ts
export const sampleClientInfo = {
  name: "Your Client's Name", // ← Change this
  // ...
};
```

### Add/Remove Exercises
```typescript
// src/data/sampleData.ts
exercises: [
  {
    name: "Exercise Name",
    sets: 4,
    reps: "8-10",
    rest: "90s",
  },
  // Add more exercises here...
]
```

### Update Meals
```typescript
// src/data/sampleData.ts
breakfast: {
  name: "Meal Name",
  time: "7:00 AM",
  description: "Meal details...",
  protein: 35,
  carbs: 65,
  fats: 15,
  calories: 525,
}
```

## 🎨 Change Brand Color

```css
/* src/index.css */
--color-primary: 221.2 83.2% 53.3%; /* ← Change this HSL value */
```

Popular colors:
- Blue: `221.2 83.2% 53.3%`
- Green: `142.1 76.2% 36.3%`
- Red: `0 84.2% 60.2%`
- Purple: `262.1 83.3% 57.8%`

## 📦 Build for Production

```bash
npm run build
```

Files will be in the `dist/` folder. Deploy to:
- Netlify (drag & drop dist folder)
- Vercel (connect GitHub repo)
- Any static hosting service

## 🔥 Pro Workflow

1. **Keep a template**: Save original `sampleData.ts`
2. **Per-client edit**: Update data for each client
3. **Export PDF**: Print to PDF for client
4. **Reset**: Restore template for next client

## ⚡ Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📱 Features

✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Print-Friendly** - Professional PDF export  
✅ **Modern UI** - Clean, professional components  
✅ **Easy Customization** - One file to edit  
✅ **Type-Safe** - TypeScript prevents errors  

## 🆘 Troubleshooting

**Build errors?**
```bash
rm -rf node_modules
npm install
```

**Port already in use?**
- Kill other dev servers
- Or change port in `vite.config.ts`

**Styles not showing?**
- Make sure dev server is running
- Hard refresh browser (Ctrl+Shift+R)

## 📖 More Help

- Full docs: [README.md](./README.md)
- Detailed customization: [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)

---

**You're ready to create amazing plans for your clients! 💪**










