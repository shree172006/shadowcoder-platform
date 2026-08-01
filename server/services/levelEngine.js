/**
 * Gamification & Level Progression Service for DevTier
 * Provides XP mathematical calculations, level progression curves, and tier unlock criteria.
 */

// Base XP multiplier for leveling up
const BASE_XP_PER_LEVEL = 100;

/**
 * Calculates user level based on total XP.
 * Formula: Level = floor(sqrt(XP / 100)) + 1
 * Level 1: 0 - 99 XP
 * Level 2: 100 - 399 XP
 * Level 3: 400 - 899 XP
 * Level 4: 900 - 1599 XP
 * Level 5: 1600+ XP
 *
 * @param {number} xp - Total experience points
 * @returns {number} Level integer
 */
export const calculateLevelFromXP = (xp = 0) => {
  if (xp < 0) return 1;
  return Math.floor(Math.sqrt(xp / BASE_XP_PER_LEVEL)) + 1;
};

/**
 * Calculates XP required to reach a specific target level.
 *
 * @param {number} targetLevel - Target level
 * @returns {number} Required cumulative XP
 */
export const calculateXpForLevel = (targetLevel) => {
  if (targetLevel <= 1) return 0;
  return Math.pow(targetLevel - 1, 2) * BASE_XP_PER_LEVEL;
};

/**
 * Computes progress stats for the user's current level.
 *
 * @param {number} xp - User total XP
 * @returns {Object} { currentLevel, currentLevelXp, nextLevelXp, progressPercentage }
 */
export const getLevelProgress = (xp = 0) => {
  const currentLevel = calculateLevelFromXP(xp);
  const currentLevelBaseXp = calculateXpForLevel(currentLevel);
  const nextLevelBaseXp = calculateXpForLevel(currentLevel + 1);

  const xpInCurrentLevel = xp - currentLevelBaseXp;
  const xpNeededForNextLevel = nextLevelBaseXp - currentLevelBaseXp;
  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100))
  );

  return {
    currentLevel,
    currentLevelBaseXp,
    nextLevelBaseXp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  };
};

/**
 * Awards XP to a user, updates streak, checks for level-ups and unlocked scenario tiers.
 *
 * @param {Object} userDoc - Mongoose User Document
 * @param {number} xpAmount - XP points gained from ticket/scenario completion
 * @returns {Promise<Object>} { updatedUser, leveledUp: boolean, newLevel: number, newTierUnlocked: boolean }
 */
export const awardXpAndProgress = async (userDoc, xpAmount) => {
  const previousLevel = userDoc.level;
  userDoc.xp += Math.max(0, xpAmount);

  const newLevel = calculateLevelFromXP(userDoc.xp);
  let leveledUp = false;

  if (newLevel > previousLevel) {
    userDoc.level = newLevel;
    leveledUp = true;

    // Automatically unlock higher tiers if level reaches tier thresholds
    // Tier 1: Level 1+, Tier 2: Level 3+, Tier 3: Level 5+, Tier 4: Level 10+
    const tierUnlocks = [
      { tier: 1, requiredLevel: 1 },
      { tier: 2, requiredLevel: 3 },
      { tier: 3, requiredLevel: 5 },
      { tier: 4, requiredLevel: 10 },
    ];

    tierUnlocks.forEach(({ tier, requiredLevel }) => {
      if (newLevel >= requiredLevel && !userDoc.unlockedTiers.includes(tier)) {
        userDoc.unlockedTiers.push(tier);
      }
    });
  }

  // Update streak logic
  const now = new Date();
  const lastActive = userDoc.streak?.lastActiveDate ? new Date(userDoc.streak.lastActiveDate) : null;

  if (!lastActive) {
    userDoc.streak = { currentCount: 1, maxCount: 1, lastActiveDate: now };
  } else {
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 3600);

    if (diffHours >= 24 && diffHours <= 48) {
      // Continued consecutive day streak
      userDoc.streak.currentCount += 1;
      if (userDoc.streak.currentCount > userDoc.streak.maxCount) {
        userDoc.streak.maxCount = userDoc.streak.currentCount;
      }
      userDoc.streak.lastActiveDate = now;
    } else if (diffHours > 48) {
      // Reset streak if more than 48 hours passed
      userDoc.streak.currentCount = 1;
      userDoc.streak.lastActiveDate = now;
    }
  }

  await userDoc.save();

  return {
    user: userDoc,
    leveledUp,
    newLevel: userDoc.level,
    xpGained: xpAmount,
  };
};
