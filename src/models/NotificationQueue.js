import { Schema, model } from 'mongoose';

const notificationQueueSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mangaId: { type: Schema.Types.ObjectId, ref: 'TrackedManga', required: true },
    mangaTitle: { type: String, required: true },
    chapterText: { type: String, required: true },
    chapterUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      index: true,
    },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default model('NotificationQueue', notificationQueueSchema); 