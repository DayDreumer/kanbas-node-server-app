import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Course from '../Courses/model.js';
import Module from '../Modules/model.js';
import coursesData from './courses.js';
import modulesData from './modules.js';

dotenv.config({ path: path.resolve('../../.env') });

const connectionString = process.env.MONGO_CONNECTION_STRING;

console.log('Environment variables loaded successfully:', process.env);
console.log('MONGO_CONNECTION_STRING:', connectionString);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  // clear data
  await Course.deleteMany({});
  await Module.deleteMany({});

  // insert data
  const courseDocs = await Course.insertMany(coursesData.default);

  for (const module of modulesData.default) {
    const courseExists = courseDocs.some(c => c._id === module.course);
    if (courseExists) {
      await Module.create(module);
    } else {
      console.error(`Course not found for module: ${module.name}`);
    }
  }

  mongoose.disconnect();
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});