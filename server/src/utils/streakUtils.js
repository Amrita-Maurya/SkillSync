// ─── GET TODAY'S DATE STRING ───────────────────────────────
// Returns today's date in YYYY-MM-DD format
// Using UTC to stay consistent across all users
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// ─── GET YESTERDAY'S DATE STRING ──────────────────────────
const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

// ─── CALCULATE UPDATED STREAK ─────────────────────────────
// Takes the existing streak object for a skill and the date being logged
// Returns the updated streak count and lastLogDate
//
// Rules:
// 1. If no previous log exists — start streak at 1
// 2. If last log was today — streak stays the same (duplicate log)
// 3. If last log was yesterday — streak increments by 1
// 4. If last log was before yesterday — streak resets to 1
//
// Interview point: this function is pure — same input always gives same output
// Easy to unit test, easy to reason about
const calculateStreak = (existingStreak, logDate) => {
  // No previous streak for this skill
  if (!existingStreak || !existingStreak.lastLogDate) {
    return {
      count: 1,
      lastLogDate: logDate,
    };
  }

  const lastLogDate = existingStreak.lastLogDate;
  const yesterday = getYesterdayString();
  const today = getTodayString();

  // Case 1: Already logged today — streak doesn't change
  // This handles the case where user logs multiple sessions in one day
  if (lastLogDate === today || lastLogDate === logDate) {
    return {
      count: existingStreak.count,
      lastLogDate: existingStreak.lastLogDate,
    };
  }

  // Case 2: Last log was yesterday — increment streak
  if (lastLogDate === yesterday) {
    return {
      count: existingStreak.count + 1,
      lastLogDate: logDate,
    };
  }

  // Case 3: Last log was before yesterday — reset streak
  return {
    count: 1,
    lastLogDate: logDate,
  };
};

module.exports = { getTodayString, getYesterdayString, calculateStreak };