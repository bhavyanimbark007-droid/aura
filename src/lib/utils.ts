import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = () => {
  return Math.random().toString(36).substring(2, 11)
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const calculateDaysUntilDeadline = (deadline: string) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const difference = deadlineDate.getTime() - today.getTime()
  return Math.ceil(difference / (1000 * 3600 * 24))
}

export const calculateStreakStatus = (completions: Date[]): { current: number; longest: number } => {
  if (completions.length === 0) return { current: 0, longest: 0 }

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  const sortedDates = [...completions].sort((a, b) => a.getTime() - b.getTime())

  for (let i = 1; i < sortedDates.length; i++) {
    const dayDiff = Math.floor((sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24))

    if (dayDiff === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)
  currentStreak = tempStreak

  return { current: currentStreak, longest: longestStreak }
}
