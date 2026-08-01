import mongoose from 'mongoose';

const evaluationLogSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['passed', 'failed', 'error'],
      required: true,
    },
    astScore: { type: Number, default: 0 },
    testScore: { type: Number, default: 0 },
    llmFeedback: { type: String, default: '' },
    executionLogs: { type: String, default: '' },
  },
  { _id: true }
);

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scenarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scenario',
      required: true,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'submitted', 'completed', 'failed'],
      default: 'in_progress',
    },
    currentTicketId: {
      type: String,
      default: '',
    },
    completedTickets: [{ type: String }],

    // Modified Virtual File System state saved per scenario session
    vfsState: {
      type: Map,
      of: String, // relativeFilePath -> fileContent
      default: {},
    },

    totalScore: { type: Number, default: 0 },
    earnedXp: { type: Number, default: 0 },
    evaluationLogs: [evaluationLogSchema],

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Enforce unique scenario progress instance per user
userProgressSchema.index({ userId: 1, scenarioId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, status: 1 });

export default mongoose.model('UserProgress', userProgressSchema);
