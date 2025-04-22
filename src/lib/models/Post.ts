// lib/models/Post.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  category: string;
  author: string;
  slug: string;
  imagePath: string | null;
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  imagePath: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for faster lookups
PostSchema.index({ slug: 1 }, { unique: true });
PostSchema.index({ category: 1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);