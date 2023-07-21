const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxLength: 144 },
  timestamp: { type: Date, required: true },
  content: { type: String, required: true },
});

MessageSchema.virtual('url').get(function () {
  return `/memberboard/messages/${this._id}`;
});

MessageSchema.virtual('timestampString').get(function () {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(this.timestamp);
});

module.exports = mongoose.model('Message', MessageSchema);
