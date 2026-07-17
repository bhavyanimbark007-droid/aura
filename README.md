# AURA - Personal Life Operating System

**AURA** is a premium, fully-featured personal life operating system designed to help you manage every aspect of your life in one beautiful, intuitive interface.

## 🎯 Vision

AURA is not just another productivity app. It's your digital representation of life itself. Everything related to self-improvement lives in AURA.

The platform combines the flexibility of Notion, the design elegance of Apple, the smoothness of Linear, and the motivation system of Duolingo.

## 🚀 Features

### Phase 1: Foundation ✅
- ✅ Authentication (Email/Password)
- ✅ Custom Module System
- ✅ Universal Task Engine
- ✅ Beautiful Dashboard
- ✅ Responsive Design

### Phase 2: Core Features (In Progress)
- 🔄 Body Module (Weight, Meals, Workouts)
- 🔄 Habits & Goals System
- 🔄 Analytics & Visualizations
- 🔄 Semester/Projects Management
- 🔄 Journal & Mood Tracking

### Phase 3: AI & Polish (Planned)
- ⏳ AURA AI Assistant
- ⏳ Gamification Engine (XP, Levels, Achievements)
- ⏳ Smart Reports & Predictions
- ⏳ Advanced Customization

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Build**: Vite
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/bhavyanimbark007-droid/aura.git
cd aura
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase Database

Run migrations in Supabase SQL Editor:

```sql
-- Users table (auto-created by Supabase Auth)

-- Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  order INT NOT NULL,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not_started',
  priority TEXT DEFAULT 'medium',
  deadline TIMESTAMP,
  estimated_time INT,
  completed_at TIMESTAMP,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  attachments TEXT[] DEFAULT '{}',
  parent_task_id UUID,
  order INT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  completion_percentage INT DEFAULT 0,
  difficulty TEXT DEFAULT 'medium',
  reminder TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Habit Completions
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target INT NOT NULL,
  current_progress INT DEFAULT 0,
  unit TEXT,
  deadline TIMESTAMP,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'not_started',
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own modules" ON modules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create modules" ON modules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own modules" ON modules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own modules" ON modules FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── dashboard/      # Dashboard & widgets
│   └── module/         # Module components
├── pages/              # Page components
├── store/              # Zustand stores
├── types/              # TypeScript types
├── lib/                # Utilities & helpers
├── styles/             # CSS & Tailwind
└── App.tsx             # Root component
```

## 🎨 Design Philosophy

- **Minimal**: Clean, uncluttered interfaces
- **Elegant**: Premium feel throughout
- **Smooth**: Fluid animations and transitions
- **Fast**: Optimized performance
- **Modern**: Current design trends
- **Personal**: Highly customizable

## 🔒 Security

- Row Level Security (RLS) policies on all tables
- Secure authentication via Supabase
- No sensitive data in frontend
- Input validation on all forms

## 📈 Performance

- Target Lighthouse score: 95+
- Code splitting enabled
- Lazy loading for routes
- Optimized images and assets
- Virtualized lists for large datasets

## 🤝 Contributing

This is a solo project by bhavyanimbark007-droid, but feel free to fork and build your own version!

## 📄 License

MIT License

## 🙏 Credits

Inspired by:
- Notion
- Apple Design
- Linear
- Arc Browser
- Duolingo
- GitHub

---

**AURA** - Your Personal Life Operating System 🚀✨
