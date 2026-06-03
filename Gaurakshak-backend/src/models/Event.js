const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    kathaType: {
      type: String,
      required: [true, 'Katha type is required'],
      enum: ['bhagavad-katha', 'ramji-janmotsav', 'shiv-mahapuran', 'sundarkand-path', 'bhajan-sandhya', 'other'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    address: {
      type: String,
    },
    vachak: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KathaVachak',
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for querying upcoming events
eventSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
