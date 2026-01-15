import {Router} from 'express'
import { createTodo, deleteTodo, getTodos, updateTodo } from '../controller/todo.controlle.js'

const router = Router()

router.route('/').get(getTodos)
router.route('/').post(createTodo)
router.route('/:id').patch(updateTodo)
router.route('/:id').delete(deleteTodo)

export default router;

/* 
In Express.js, we use Router to separate routes from the main server file and keep the code organized.
A route file creates a router instance using Router() and defines endpoints that are connected to controller functions.

The router is then imported into app.js and mounted using app.use().
app.use("/api/todos", todoRoute);

Express combines both paths to form the final API endpoint:
GET /api/todos/getTodo

*/