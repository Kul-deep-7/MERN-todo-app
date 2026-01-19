import express from "express"
import cors from "cors"
import path from "path";
const app = express();

app.use(express.json({
    limit : '20kb'
}))

app.use(express.urlencoded({
    extended : true, limit: '20kb'
}))

const __dirname = path.resolve();



//routes

import todoRoutes from './routes/todo.routes.js'

app.use('/api/v1/todos', todoRoutes)


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Frontend/todo/dist")));
  app.get("/.*/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend/todo", "dist", "index.html"));
  });
}

export default app;