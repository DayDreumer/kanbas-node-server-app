import * as dao from "./dao.js";
export default function UserRoutes(app) {
  const createUser = async (req, res) => { 
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  const deleteUser = async (req, res) => { 
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if(name){
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };
  const findUserById = async (req, res) => { 
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
  const updateUser = async (req, res) => {
    const {userId} = req.params;
    const status = await dao.updateUser(userId, req.body);
    res.json(status);
  };

  const signup = async (req, res) => { 
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;

      console.log('Received signin request');
      console.log('Username:', username);
      console.log('Password:', password);
  
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
      }
  
      const currentUser = await dao.findUserByCredentials(username, password);
  
      if (currentUser) {
        req.session.currentUser = currentUser;
        res.json(currentUser);
      } else {
        res.status(401).json({ message: "Invalid username or password." });
      }
    } catch (error) {
      console.error("Error during signin:", {
        message: error.message,
        stack: error.stack,
        username,
      });
  
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        res.status(503).json({ message: "Service unavailable. Please try again later." });
      } else if (error.message.includes('query')) {
        res.status(500).json({ message: "Database query error. Please contact support." });
      } else {
        res.status(500).json({ message: "Internal server error. Please try again later." });
      }
    }
  };
  

  const signout = (req, res) => { 
    req.session.destroy();
    res.sendStatus(200);
  };  

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  app.post("/api/users", createUser);
  app.delete("/api/users/:userId", deleteUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);


}