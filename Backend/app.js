import express from "express"
import cors from "cors"

const app = express();

app.use(express.json({
    limit : '20kb'
}))

app.use(express.urlencoded({
    extended : true, limit: '20kb'
}))


//routes

import todoRoutes from './routes/todo.routes.js'

app.use('/api/v1/todos', todoRoutes)

export default app;