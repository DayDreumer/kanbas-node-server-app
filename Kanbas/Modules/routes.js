import * as dao from "./dao.js";

export default function ModuleRoutes(app) {
  const createModule = async (req, res) => {
    try {
      const module = await dao.createModule(req.body);
      res.status(201).json(module);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log("Id is required.")
    }
  };

  const deleteModule = async (req, res) => {
    const status = await dao.deleteModule(req.params.moduleId);
    res.json(status);
  };

  const findAllModules = async (req, res) => {
    const modules = await dao.findAllModules();
    res.json(modules);
  };

  const findModuleById = async (req, res) => {
    const module = await dao.findModuleById(req.params.moduleId);
    res.json(module);
  };

  const updateModule = async (req, res) => {
    const { moduleId } = req.params;
    const status = await dao.updateModule(moduleId, req.body);
    res.json(status);
  };

  const findModulesByCourseId = async (req, res) => {
    const { courseId } = req.params;
    const modules = await dao.findModulesByCourseId(courseId);
    res.json(modules);
  };

  app.post("/api/modules", createModule);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.get("/api/modules", findAllModules);
  app.get("/api/modules/:moduleId", findModuleById);
  app.put("/api/modules/:moduleId", updateModule);
  app.get("/api/courses/:courseId/modules", findModulesByCourseId);
}
