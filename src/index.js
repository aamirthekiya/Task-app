const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get("", (req, res) => {
  res.send({
    message: "This app contain API end points",
    "GET Request API": {
      "Read user": "/users/me",
      "Read tasks":
        "/tasks?  -- /sortBy=createdAt:desc, limit=2 etc optional parameters",
      "Read task by id": "/tasks/task_id",
    },
    "POST Request API": {
      "Create new user": "/users",
      "Login user": "/users/login",
      "Logout user": "/users/logout",
      "Logout user from all devices": "/users/logoutAll",
      "Upload profile pic": "/users/me/avatar",
      "Create new task": "/tasks",
    },
    "PATCH Request API": {
      "Update user": "/users/me",
      "Update task": "/tasks/task_id",
    },
    "DELETE Request API": {
      "Delete user profile pic": "/users/me/avatar",
      "Delete user": "/users/me",
      "Delete task": "/tasks/task_id",
    },
  });
});

app.listen(port, () => {
  console.log("Server is up on port: ", port);
});
