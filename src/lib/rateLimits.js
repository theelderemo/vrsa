/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

// Rate limiting utilities using localStorage

const RATE_LIMIT_PREFIX = 'vrsa_rate_limit_';

/**
 * Get the current day as a string (YYYY-MM-DD)
 */
const getTodayKey = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Get usage count for a specific feature today
 * @param {string} feature - Feature identifier (e.g., 'analyzer', 'word_finder')
 * @returns {number} - Current usage count for today
 */
export const getUsageCount = (feature) => {
  const key = `${RATE_LIMIT_PREFIX}${feature}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) return 0;
  
  try {
    const { date, count } = JSON.parse(stored);
    // Reset if it's a new day
    if (date !== getTodayKey()) {
      return 0;
    }
    return count;
  } catch {
    return 0;
  }
};

/**
 * Increment usage count for a specific feature
 * @param {string} feature - Feature identifier
 * @returns {number} - New usage count
 */
export const incrementUsage = (feature) => {
  const key = `${RATE_LIMIT_PREFIX}${feature}`;
  const today = getTodayKey();
  const currentCount = getUsageCount(feature);
  const newCount = currentCount + 1;
  
  localStorage.setItem(key, JSON.stringify({
    date: today,
    count: newCount
  }));
  
  return newCount;
};

/**
 * Check if user can use a feature
 * @param {string} feature - Feature identifier
 * @param {number} limit - Daily limit
 * @param {boolean} isPro - Whether user is a pro user
 * @returns {{ canUse: boolean, remaining: number, limit: number }}
 */
export const checkRateLimit = (feature, limit, isPro = false) => {
  // Pro users bypass all rate limits
  if (isPro) {
    return { canUse: true, remaining: Infinity, limit: Infinity };
  }
  
  const currentCount = getUsageCount(feature);
  const remaining = Math.max(0, limit - currentCount);
  
  return {
    canUse: currentCount < limit,
    remaining,
    limit
  };
};

/**
 * Get remaining uses for a feature
 * @param {string} feature - Feature identifier
 * @param {number} limit - Daily limit
 * @param {boolean} isPro - Whether user is a pro user
 * @returns {number} - Remaining uses (Infinity for pro users)
 */
export const getRemainingUses = (feature, limit, isPro = false) => {
  if (isPro) return Infinity;
  return Math.max(0, limit - getUsageCount(feature));
};

// Feature identifiers
export const RATE_LIMIT_FEATURES = {
  ANALYZER: 'analyzer',
  WORD_FINDER: 'word_finder',
};

// Daily limits for free users
export const DAILY_LIMITS = {
  ANALYZER: 2,
  WORD_FINDER: 5,
};
