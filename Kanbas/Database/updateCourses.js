import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const defaultAuthorId = '654f9ec2ea7ead465908d1e3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coursesFilePath = path.resolve(__dirname, 'courses.js');
const coursesModuleUrl = pathToFileURL(coursesFilePath).href;
const coursesData = await import(coursesModuleUrl).then(module => module.default);

const updatedCoursesData = coursesData.map(course => {
  if (!course.author) {
    course.author = defaultAuthorId;
  }
  return course;
});

const newContent = `export default ${JSON.stringify(updatedCoursesData, null, 2)};`;
fs.writeFileSync(coursesFilePath, newContent, 'utf-8');

console.log('Courses data updated successfully.');