# 🚀 AURA - Quick Start Guide

## ⚡ Super Fast Setup (5 minutes)

### Step 1: Get Supabase URL & Key

1. Go to https://supabase.com
2. Click **New Project**
3. Fill in:
   - **Name**: aura
   - **Password**: Create strong password
   - **Region**: Pick closest to you
4. Wait 2-3 minutes for it to create
5. Go to **Settings → API**
6. Copy:
   - **Project URL** (copy this)
   - **anon public** key (copy this too)

### Step 2: Clone & Setup Project

```bash
# Clone from GitHub
git clone https://github.com/bhavyanimbark007-droid/aura.git
cd aura

# Install dependencies
npm install
```

### Step 3: Create Environment File

```bash
# Create .env.local file in project root
cp .env.example .env.local
```

Open `.env.local` and paste your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Setup Database

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy **ALL** the SQL from `SETUP_SUPABASE.md` file in the project
4. Paste it into the SQL editor
5. Click **Run**
6. Wait for it to complete ✅

### Step 5: Run the App

```bash
# Start development server
npm run dev
```

Browser will open to `http://localhost:3000` 🎉

---

## 📝 First Time Usage

1. **Sign Up**: Create account with email/password
2. **Create Module**: Click "Create Module" in sidebar
3. **Add Tasks**: Go to module and add tasks
4. **Log Weight**: Go to Body → Weight tab
5. **Track Nutrition**: Body → Nutrition tab

---

## 🎮 Available Commands

```bash
# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
aura/
├── src/
│   ├── components/        # React components
│   │   ├── Layout.tsx
│   │   ├── layout/        # Sidebar, mobile nav
│   │   ├── dashboard/     # Dashboard & widgets
│   │   ├── body/          # Weight, nutrition trackers
│   │   └── module/        # Module components
│   ├── pages/             # Page components
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── BodyPage.tsx
│   │   └── ModulePage.tsx
│   ├── store/             # Zustand stores
│   │   ├── authStore.ts
│   │   ├── moduleStore.ts
│   │   ├── taskStore.ts
│   │   ├── habitStore.ts
│   │   ├── goalStore.ts
│   │   ├── userStore.ts
│   │   └── bodyStore.ts
│   ├── lib/               # Utilities
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .env.example
└── README.md
```

---

## ✨ Features Available Now

✅ **Authentication**
- Email/Password signup & login
- Secure Supabase auth

✅ **Dashboard**
- Welcome widget
- Life score visualization
- Quick stats
- Recent activity feed

✅ **Custom Modules**
- Create unlimited modules
- Choose icons & colors
- Delete, rename, reorder

✅ **Universal Task Engine**
- Create tasks in any module
- Mark complete
- Pin important tasks
- Tasks list

✅ **Habits**
- Create daily/weekly/monthly habits
- Track streaks
- Log completions
- See completion %

✅ **Goals**
- Set targets
- Track progress
- Visual progress bars
- Milestones (database ready)

✅ **Body Module**
- Weight tracking with chart
- Current/highest/lowest/average stats
- Nutrition tracker
- Calories, protein, carbs, fats, water
- Daily macros visualization

✅ **Responsive Design**
- Mobile friendly
- Tablet optimized
- Desktop perfect
- Glassmorphism design

---

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org (v16+)
- Run `node -v` to verify

### "VITE_SUPABASE_URL is undefined"
- Make sure `.env.local` file exists
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check you pasted credentials correctly

### "Relation 'modules' does not exist"
- You forgot to run the SQL migrations
- Go to Supabase → SQL Editor
- Paste the SQL from `SETUP_SUPABASE.md`
- Click Run

### "Users can view own modules" error on database
- This is normal! It's the RLS policy being created
- Continue - it should complete successfully

### Can't sign up / Login fails
- Check your Supabase credentials in `.env.local`
- Go to Supabase dashboard → Authentication → Users
- Check if user was created
- Try a different email

### Port 3000 already in use
```bash
# Kill process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Chart not showing / blank page
- Clear cache: `Ctrl+Shift+Delete` or `Cmd+Shift+Delete`
- Restart dev server
- Check browser console for errors (F12)

---

## 🔐 Security Notes

⚠️ **IMPORTANT**:
- Never push `.env.local` to GitHub (it's in .gitignore)
- Don't share your Supabase keys
- The `anon` key is public - use it only in frontend
- Use the service key only on backend

---

## 📊 Next Steps

Once running, try:

1. **Create Your First Module**
   - Click "Create Module"
   - Name: "Fitness"
   - Icon: 💪
   - Color: Purple

2. **Add a Task**
   - Go to module
   - Type task name
   - Press Enter

3. **Create Habit**
   - Click "Habits" tab
   - Add daily habit
   - Complete it

4. **Log Weight**
   - Click sidebar "Body"
   - Click "Weight" tab
   - Enter weight
   - See the chart update!

5. **Track Nutrition**
   - Click "Nutrition" tab
   - Add calories, protein, carbs, fats
   - See macros visualization

---

## 🚀 Deploy to Production

### Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Then:
1. Add `.env` variables in Vercel dashboard
2. Redeploy
3. Your app is live! 🎉

---

## 💬 Need Help?

Check:
- `README.md` - Full documentation
- `SETUP_SUPABASE.md` - Database setup guide
- GitHub Issues - Report bugs

---

**Now you're ready! Go build AURA! 🚀✨**
