import { Schema, model, Types } from 'mongoose';

const trackedMangaSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    mangaTitle: { type: String, required: true },
    lastKnownChapter: String,
    lastKnownChapterUrl: String,
    lastCheckedAt: Date,
    lastUpdatedAt: Date,
    notificationEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model('TrackedManga', trackedMangaSchema); 