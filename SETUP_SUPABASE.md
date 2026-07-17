# Supabase Setup Guide for AURA

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - **Project name**: aura
   - **Database password**: Create a strong password
   - **Region**: Choose closest to you
5. Click "Create new project" and wait 2-3 minutes

## Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
3. Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste this entire SQL block:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS xp_entries CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS weight_entries CASCADE;
DROP TABLE IF EXISTS nutrition_entries CASCADE;
DROP TABLE IF EXISTS body_measurements CASCADE;

-- Modules Table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  deadline TIMESTAMP WITH TIME ZONE,
  estimated_time INT,
  completed_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  attachments TEXT[] DEFAULT '{}',
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  "order" INT NOT NULL DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Habits Table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  completion_percentage INT DEFAULT 0,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  reminder TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Habit Completions Table
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  UNIQUE(habit_id, completed_date)
);

-- Goals Table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target DECIMAL NOT NULL,
  current_progress DECIMAL DEFAULT 0,
  unit TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Milestones Table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  target_value DECIMAL NOT NULL,
  achieved BOOLEAN DEFAULT false,
  achieved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- XP Entries Table
CREATE TABLE xp_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Achievements Table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT DEFAULT 'bronze' CHECK (rarity IN ('bronze', 'silver', 'gold', 'diamond')),
  xp_reward INT DEFAULT 0,
  unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Journal Entries Table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('great', 'good', 'normal', 'bad', 'terrible')),
  tags TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  entry_type TEXT DEFAULT 'general' CHECK (entry_type IN ('daily', 'weekly', 'monthly', 'general')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Weight Entries Table
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL NOT NULL,
  unit TEXT DEFAULT 'kg' CHECK (unit IN ('kg', 'lb')),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Body Measurements Table
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Nutrition Entries Table
CREATE TABLE nutrition_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  calories INT DEFAULT 0,
  protein INT DEFAULT 0,
  carbs INT DEFAULT 0,
  fats INT DEFAULT 0,
  water INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  UNIQUE(user_id, date)
);

-- User Settings Table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  accent_color TEXT DEFAULT 'purple',
  language TEXT DEFAULT 'en',
  units TEXT DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  calories_goal INT DEFAULT 2500,
  protein_goal INT DEFAULT 150,
  carbs_goal INT DEFAULT 300,
  fats_goal INT DEFAULT 80,
  water_goal INT DEFAULT 3000,
  weight_goal DECIMAL,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create indexes for better query performance
CREATE INDEX idx_modules_user_id ON modules(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_module_id ON tasks(module_id);
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_module_id ON habits(module_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_module_id ON goals(module_id);
CREATE INDEX idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX idx_weight_user_id ON weight_entries(user_id);
CREATE INDEX idx_nutrition_user_id ON nutrition_entries(user_id);
CREATE INDEX idx_xp_user_id ON xp_entries(user_id);

-- Enable Row Level Security
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Modules RLS Policies
CREATE POLICY "Users can view own modules" ON modules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create modules" ON modules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own modules" ON modules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own modules" ON modules FOR DELETE USING (auth.uid() = user_id);

-- Tasks RLS Policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Habits RLS Policies
CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- Habit Completions RLS Policies
CREATE POLICY "Users can view own habit completions" ON habit_completions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()));
CREATE POLICY "Users can create habit completions" ON habit_completions FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()));
CREATE POLICY "Users can delete habit completions" ON habit_completions FOR DELETE 
  USING (EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()));

-- Goals RLS Policies
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Milestones RLS Policies
CREATE POLICY "Users can view own milestones" ON milestones FOR SELECT 
  USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid()));
CREATE POLICY "Users can create milestones" ON milestones FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid()));
CREATE POLICY "Users can update own milestones" ON milestones FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid()));
CREATE POLICY "Users can delete own milestones" ON milestones FOR DELETE 
  USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid()));

-- XP Entries RLS Policies
CREATE POLICY "Users can view own xp" ON xp_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create xp" ON xp_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements RLS Policies
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Journal Entries RLS Policies
CREATE POLICY "Users can view own journal" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create journal" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Weight Entries RLS Policies
CREATE POLICY "Users can view own weight" ON weight_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create weight" ON weight_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own weight" ON weight_entries FOR DELETE USING (auth.uid() = user_id);

-- Body Measurements RLS Policies
CREATE POLICY "Users can view own measurements" ON body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create measurements" ON body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Nutrition Entries RLS Policies
CREATE POLICY "Users can view own nutrition" ON nutrition_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create nutrition" ON nutrition_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own nutrition" ON nutrition_entries FOR UPDATE USING (auth.uid() = user_id);

-- User Settings RLS Policies
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
```

4. Click **Run** and wait for completion
5. You should see "13 rows returned" at the top

## Step 4: Enable Email Authentication (Optional)

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it's by default)
3. Optionally enable **Google** for OAuth login

## Step 5: Configure CORS (if needed)

1. Go to **Settings** → **API**
2. Add your domain to **CORS allowed origins**:
   - Local: `http://localhost:3000`
   - Production: `https://yourdomain.com`

## Step 6: Test Connection

1. Update `.env.local` with your credentials
2. Run `npm install`
3. Run `npm run dev`
4. Try signing up
5. Check Supabase **SQL Editor** → **Logs** for any errors

## Troubleshooting

### "User already exists"
- Delete user from **Authentication** → **Users**
- Or use a different email

### "Relation does not exist"
- Run the SQL migrations again
- Make sure no errors appeared

### "Permission denied" error
- Check RLS policies are created
- Make sure user_id matches auth.uid()

### Can't connect to database
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Check .env.local file exists
- Restart dev server: `npm run dev`

---

**Done!** Your AURA database is ready. 🚀
