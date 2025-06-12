const { Schema, model, Types } = require('mongoose');

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

module.exports = model('TrackedManga', trackedMangaSchema); 