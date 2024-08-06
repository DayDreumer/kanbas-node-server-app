import * as dao from "./dao.js";

export default function CourseRoutes(app) {
  const createCourse = async (req, res) => {
    
    try {
      console.log('Received request to create course with data:', req.body); 
      const { name, description } = req.body;
      if (!name || !description) {
        console.log('Missing title or description');
        return res.status(400).json({ message: 'Name and description are required.' });
      }
      
      const course = await dao.createCourse(req.body);
      console.log('Course created successfully:', course);

      res.status(201).json(course);
    } catch (error) {
      console.error('Error creating course:', error.message); 
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  

  const deleteCourse = async (req, res) => {
    const status = await dao.deleteCourse(req.params.courseId);
    res.json(status);
  };

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const findCourseById = async (req, res) => {
    const course = await dao.findCourseById(req.params.courseId);
    res.json(course);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.updateCourse(courseId, req.body);
    res.json(status);
  };

  app.post("/api/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId", findCourseById);
  app.put("/api/courses/:courseId", updateCourse);
}