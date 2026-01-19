import { useEffect, useState } from "react"
import axios from "axios"
import { MdOutlineDone } from "react-icons/md"
import { IoClose } from "react-icons/io5"
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";

function App() {
  
  const[newTodo, setNewTodo] = useState("") //to store the input value
  const[ todos, setTodos] = useState([]) //to store the list of todos
  const[editingTodo, setEditingTodo] = useState(null); // which todo is being edited
  const[editingText, setEditingText] = useState(""); //to store the text being edited. editingText exists so React can hold the edited value until you decide to persist it.

  const addTodo = async(e)=>{ //async cuz we will talk to backend 
    e.preventDefault(); //prevent page refresh on form submit
    if(!newTodo.trim()) return; //if input is empty, do nothing
    try {
      //post request to backend to add new todo
      const response = await axios.post("/api/v1/todos", {text: newTodo}); //“Send the text the user typed to the backend, wait for the backend to save it in the database, and give me back the result.”
      setTodos([...todos, response.data.data]); //update the todos state with the new todo item returned from the backend.. response.data is the saved todo item which contains _id,text,completed,createdAt...
      setNewTodo(""); //clear the input field so user can type a new todo without manually deleting the old one
      //console.log("Todo added successfully", response.data.data);
    } catch (error) {
      console.log("Error adding todo", error);
    }
    /* 
  What the user types goes into newTodo.
  newTodo is sent as { text } in req.body to the backend.
  Backend stores it in MongoDB.
  Backend returns the saved todo.
  We store that returned todo in another state (todos) so React can render it on the UI.
  We create another state to store the response of the POST request so it can be visibly shown on the UI.
  okay as SetTodos have response.data.data it have access to mongo DB's document si we can use todo._id & todo.text for map to show on UI
  */
  }  
  

  const fetchTodos = async()=>{
    try {
      const response = await axios.get("/api/v1/todos");
      
      //if we do setTodos([...todos, response.data.data])
      //Suppose todos is [] initially and backend returns [A, B, C].
      //Then todos becomes [ [A, B, C] ] → a nested array, which can break your UI.
      console.log(response.data.data); //response.data.data is an array of todo objects from backend
      setTodos(response.data.data); //set the todos state with the array of todos from backend
      //Now todos = [A, B, C] → perfect for mapping in JSX.
      
    } catch (error) {
      console.log("Error fetching todos", error);
    }
  }

  useEffect(()=>{
    fetchTodos();
    /*How fetching works with useEffect
    Component renders → initially, todos state is empty ([]).
    useEffect runs → fetchTodos() makes an HTTP request to your backend.
    Backend responds with data → setTodos(response.data.data) updates the state.
    React re-renders the component automatically → now your UI shows the fetched todos.
    So useEffect itself doesn’t store the data, it just triggers fetching when the component mounts. 
    The state (todos) stores the data in memory while the component is mounted.
    */
},[])

/* 
// When we add a task (POST request), it is stored in the database and immediately displayed in the UI 
// by updating the React state using setTodos. 
// However, if we refresh the page, the React state resets to an empty array, so the UI would appear blank. 
// This is where useEffect comes in. 
// After the component mounts, useEffect runs and calls fetchTodos (GET request) to fetch all todos from the backend. 
// The backend controller uses Todo.find() to retrieve all documents from the database. 
// The response from fetchTodos is then stored in state using setTodos, so the UI can display all todos. 
// This ensures that even after a page refresh, the UI stays in sync with the database and shows all stored todos.
*/

const startEditing =(todo) =>{
  setEditingTodo(todo._id);
  setEditingText(todo.text);
// We already have the todo id before updating because when we click edit, that todo’s id is stored in editingTodo.
// While mapping, editingTodo === todo._id matches only that todo, so only that one goes into edit mode.
// Since we have the id, we also know which todo’s text we are editing and updating.
}

const saveEdit = async(id)=>{ //takes id so it knows which todo to update
  try {
    const response = await axios.patch(`/api/v1/todos/${id}`, {text: editingText}); //URL contains the todo id so backend knows which todo to update cuz we defined :id in the route & took id as parameter in this function

    setTodos(todos.map((todo)=>
      todo._id === id ? response.data.data : todo
    )); //we loop through todos, and if the todo id matches the updated one, we replace it with the updated todo from the response; otherwise, we keep the existing todo unchanged.
    setEditingTodo(null); //in UI it removes the input field and  tick & cross icon & shows the updated text 
    setEditingText("");
  } catch (error) {
    console.log("Error updating todo", error);
  }
}

const deleteTodo = async(id)=>{ //takes id so it knows which todo to delete
  try {
    await axios.delete(`/api/v1/todos/${id}`); //URL contains the todo id so backend knows which todo to delete cuz we defined :id in the route & took id as parameter in this function
    setTodos(todos.filter((todo)=> todo._id !== id)); //we filter out the deleted todo from the state so UI updates accordingly
  } catch (error) {
    console.log("Error deleting todo", error);
  }
}

const toggleTodo = async(id)=>{
  try {
    const todo = todos.find((t)=> t._id === id); 
    const response = await axios.patch(`/api/v1/todos/${id}`, {
      completed: !todo.completed, 
    });
    setTodos(todos.map((t)=>
      t._id === id ? response.data.data : t
    )); 
  } catch (error) {
   console.log("Error toggling todo", error); 
  }
}

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-100
    flex items-center justify-center">
    <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 w-full max-w-md">
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Task Manager</h1>
    </div>
    <div>
      <form onSubmit={addTodo} 
      className="flex flex-col sm:flex-row gap-4">
        <input 
        className=" flex-1 outline-none px-3 py-2 text-gray-500 "
          type="text" 
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e)=> setNewTodo(e.target.value)}
          required
          />
          <button className="text-white bg-amber-950 hover:bg-black m-5 p-2 rounded-2xl cursor-pointer" >Add Task</button>
      </form>
      <div> 
{
//if todolength is 0 show no tasks added yet else map through todos and show each todo
//okay as SetTodos have response.data.data it have access to mongo DB's document si we can use todo._id & todo.text for map to show on UI        
} 
        {todos.length === 0 ? (
          <div>No tasks added yet.</div>
        ):(
          <div>
            {todos.map((todo)=>(
              <div key={todo._id}> {/*todo._id is unique id generated by MongoDB for each todo item*/}
                {editingTodo === todo._id ? ( 
// If editingTodo matches the current todo id,
// we replace the text with an input field,
// allow the user to edit it,
// and store the edited value in editingText.
                  <div className="flex items-center gap-x-3">
                    <input 
                    className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300"
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}/>
                 <div> 
                  <button  className="text-white rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 cursor-pointer"
                  onClick={()=> setEditingTodo(null)}> 
                    <IoClose />
                  </button>
                  <button onClick={()=>saveEdit(todo._id)}
                  className="text-gray-800 rounded-lg bg-green-500 hover:bg-green-400 px-4 py-2 cursor-pointer" >
                    <MdOutlineDone />
                  </button>
                  </div></div>
                ):(
                  <div className="flex gap-x-2">
                          <button
                            onClick={() => toggleTodo(todo._id)}
                            className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${
                              todo.completed
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 hover:border-blue-400"
                            }`}
                          >
                            {todo.completed && <MdOutlineDone />}
                          </button>
                   <span className="text-gray-800 truncate font-medium">
                            {todo.text}
                          </span>
                   <div className="flex gap-x-2">
                     <button className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                      onClick={()=> startEditing(todo)}>
                      <MdModeEditOutline />
                    </button>
                    <button onClick={()=>deleteTodo(todo._id)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200">
                      <FaTrash />
                    </button>
                   </div>
                  </div>
                )}
                </div> 
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
   </div>
  )
}

export default App
