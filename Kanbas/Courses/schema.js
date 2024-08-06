import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String},
  number: { type: String},
  startDate: { type: Date },
  endDate: { type: Date },
  department: { type: String},
  credits: { type: Number },
  description: { type: String },
  author: { type: String },
  imageUrl: { type: String }
}, { collection: 'courses' });

export default courseSchema;