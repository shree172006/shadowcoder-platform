import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: {
    label: { type: String, required: true },
    status: { type: String, default: 'active' },
    overview: { type: String, default: '' },
    codeSnippet: { type: String, default: '' },
  },
  type: { type: String, default: 'default' },
});

const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  type: { type: String, default: 'smoothstep' },
  animated: { type: Boolean, default: false },
  style: {
    stroke: { type: String, default: '#3b82f6' },
    strokeWidth: { type: Number, default: 3 },
  },
});

const roadmapSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['career', 'skill'], default: 'skill' },
    modules: { type: Number, default: 10 },
    iconName: { type: String, default: 'BookOpen' },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Roadmap', roadmapSchema);
