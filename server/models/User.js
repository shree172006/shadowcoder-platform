import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userBadgeSchema = new mongoose.Schema(
  {
    badgeId: { type: String, required: true },
    title: { type: String, required: true },
    iconType: { type: String, default: 'default_badge' },
    unlockedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const streakSchema = new mongoose.Schema(
  {
    currentCount: { type: Number, default: 0 },
    maxCount: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  { _id: false }
);

const userStatsSchema = new mongoose.Schema(
  {
    ticketsSolvedCount: { type: Number, default: 0 },
    scenariosCompletedCount: { type: Number, default: 0 },
    submissionsCount: { type: Number, default: 0 },
    totalLinesSubmitted: { type: Number, default: 0 },
    reviewScoreAvg: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: function () {
        // Password required only if no OAuth providers linked
        return !this.googleId && !this.githubId && !this.linkedinId;
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Exclude password hash from query results by default
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'admin'],
        message: 'Role must be either student or admin',
      },
      default: 'student',
    },
    track: {
      type: String,
      enum: ['fullstack', 'frontend', 'backend', 'devops', 'data-analytics'],
      default: 'fullstack',
    },
    avatar: {
      type: String,
      default: '',
    },
    // OAuth 2.0 Provider IDs
    googleId: { type: String, sparse: true },
    githubId: { type: String, sparse: true },
    linkedinId: { type: String, sparse: true },

    // Gamification & Progression System
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    unlockedTiers: { type: [Number], default: [1] },
    badges: [userBadgeSchema],
    streak: { type: streakSchema, default: () => ({}) },
    stats: { type: userStatsSchema, default: () => ({}) },

    // Refresh Tokens for JWT Security
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance and leaderboards
userSchema.index({ xp: -1 });

// Pre-save hook: Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);