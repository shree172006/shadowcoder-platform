import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    badgeId: {
      type: String,
      required: [true, 'Badge ID is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Badge title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
    },
    iconType: {
      type: String,
      required: true,
      default: 'default_badge',
    },
    category: {
      type: String,
      enum: ['level', 'streak', 'scenario', 'review', 'special'],
      default: 'scenario',
    },
    criteria: {
      minXP: { type: Number, default: 0 },
      minScenariosCompleted: { type: Number, default: 0 },
      minStreakDays: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Badge', badgeSchema);
