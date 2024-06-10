import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import "./loadEnvironment.mjs";

import listRoutes from "./routes/lists.mjs";
import userRoutes from "./routes/user.mjs";
import usersRoutes from "./routes/users.mjs";

const app = express();
const port = process.env.PORT;

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(bodyParser.json());
app.use('/api/v1/lists', listRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/users', usersRoutes);

try {
  await mongoose.connect(process.env.ATLAS_URI);
  app.listen(port, () => console.log(`Connected to MyTodo MongoDB database and server listening on port: ${port}.`));
} catch (error) {
  console.error(error);
}
