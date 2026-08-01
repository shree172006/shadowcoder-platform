import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: [true, 'Ticket ID (e.g. JIRA-101) is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['bug', 'feature', 'refactor', 'security', 'performance'],
      default: 'feature',
    },
    acceptanceCriteria: [{ type: String }],
    hints: [{ type: String }],
    xpPoints: {
      type: Number,
      required: true,
      default: 50,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { _id: true }
);

const npcPersonaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true }, // e.g. "Senior Staff Engineer", "Engineering Manager"
    avatarUrl: { type: String, default: '' },
    initialDialogue: { type: String, required: true },
  },
  { _id: false }
);

const scenarioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Scenario title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Scenario slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Scenario description is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Junior', 'Mid', 'Senior', 'Lead'],
      default: 'Junior',
    },
    targetRole: {
      type: String,
      enum: ['fullstack', 'frontend', 'backend', 'devops'],
      default: 'fullstack',
    },
    requiredTier: {
      type: Number,
      default: 1,
      min: 1,
    },
    xpReward: {
      type: Number,
      required: true,
      default: 300,
    },
    badgeReward: {
      badgeId: { type: String },
      title: { type: String },
      iconType: { type: String },
    },
    // Virtual File System & Docker container environment configurations
    starterCodebasePath: {
      type: String,
      required: [true, 'Starter codebase archive path or S3 key is required'],
    },
    environmentConfig: {
      dockerImage: { type: String, default: 'node:20-alpine' },
      buildCmd: { type: String, default: 'npm install' },
      testCmd: { type: String, default: 'npm test' },
      timeoutMs: { type: Number, default: 30000 },
    },

    // Jira Tickets & Interactive Personas
    tickets: [ticketSchema],
    npcPersonas: [npcPersonaSchema],

    isPublished: {
      type: Boolean,
      default: false,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for querying scenarios by level/difficulty
scenarioSchema.index({ difficulty: 1, requiredTier: 1 });
scenarioSchema.index({ targetRole: 1, isPublished: 1 });

export default mongoose.model('Scenario', scenarioSchema);
