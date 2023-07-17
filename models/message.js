const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true, maxLength: 144 },
  timestamp: { type: Date, required: true },
  content: { type: String, required: true },
});

MessageSchema.virtual('url').get(function () {
  return `/subpath/${this._id}`;
});

MessageSchema.virtual('timestampString').get(function () {
  return this.timestamp.toString();
});

module.exports = mongoose.model('Category', MessageSchema);
