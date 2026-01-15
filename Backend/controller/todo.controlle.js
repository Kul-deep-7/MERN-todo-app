import Todo from "../models/todo.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find();

  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todos fetched successfully"));
});

export const createTodo = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, "Todo text is required");
  }

  const todo = await Todo.create({ text });

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully"));
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const todo = await Todo.findById(id);
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  if (text !== undefined) todo.text = text;
  if (completed !== undefined) todo.completed = completed;

  const updatedTodo = await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo updated successfully"));
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedTodo = await Todo.findByIdAndDelete(id);
  if (!deletedTodo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Todo deleted successfully"));
});
