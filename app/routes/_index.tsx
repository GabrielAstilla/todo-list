import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Define the Todo interface
interface Todo {
  id: number;
  task: string;
  isComplete: boolean;
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editTodo, setEditTodo] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<string>("");
  const apiUrl = "https://localhost:7219/api/todos";

  // Fetch todos from the server when the component mounts
  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error("Error fetching todos!", error);
      });
  }, []);

  // Add a new todo
  const addTodo = () => {
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo) {
      axios.post(apiUrl, { task: trimmedTodo, isComplete: false })
        .then(response => {
          setTodos([response.data, ...todos]); // Add new todo at the top
          setNewTodo("");
        })
        .catch(error => {
          console.error("Error creating todo!", error);
        });
    }
  };

  // Start editing a todo
  const startEdit = (todo: Todo) => {
    setEditTodo(todo.id);
    setEditTask(todo.task);
  };

  // Save the edited todo
  const saveEdit = (id: number) => {
    const trimmedEditTask = editTask.trim();
    if (trimmedEditTask && trimmedEditTask !== todos.find(todo => todo.id === id)?.task) {
      axios.put(`${apiUrl}/${id}`, { task: trimmedEditTask, isComplete: false })
        .then(() => {
          setTodos(todos.map(todo => todo.id === id ? { ...todo, task: trimmedEditTask } : todo));
          setEditTodo(null);
        })
        .catch(error => {
          console.error("Error updating todo!", error);
        });
    }
  };

  // Toggle the completion status of a todo
  const toggleComplete = (id: number, isComplete: boolean) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (todoToUpdate) {
      axios.put(`${apiUrl}/${id}`, { ...todoToUpdate, isComplete: !isComplete })
        .then(() => {
          setTodos(todos.map(todo => todo.id === id ? { ...todo, isComplete: !isComplete } : todo));
        })
        .catch(error => {
          console.error("Error toggling todo!", error);
        });
    }
  };

  // Remove a todo
  const removeTodo = (id: number) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error("Error deleting todo!", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 flex items-center justify-center">
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white shadow-2xl rounded-lg overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500">
        <h1 className="text-3xl font-bold text-white p-4 text-center">To-Do List</h1>
        <div className="p-4">
          <div className="flex mb-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a new task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition"
              onClick={addTodo}
            >
              Add
            </button>
          </div>
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center bg-gray-100 p-3 mb-2 rounded-md shadow-sm hover:bg-gray-200 transition"
              >
                <input
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={() => toggleComplete(todo.id, todo.isComplete)}
                  className="mr-3"
                />
                <div className="flex-1">
                  {editTodo === todo.id ? (
                    <div className="flex items-center">
                      <textarea
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                      />
                      <button
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        onClick={() => saveEdit(todo.id)}
                        disabled={editTask.trim() === ''}
                      >
                        Save
                      </button>
                      <button
                        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        onClick={() => setEditTodo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`block overflow-hidden ${todo.isComplete ? 'line-through text-gray-500' : 'text-gray-800'}`}
                    >
                      {todo.task}
                    </span>
                  )}
                </div>
                {editTodo !== todo.id && (
                  <div className="flex-shrink-0 ml-3">
                    <button
                      className="text-blue-500 p-2 hover:text-blue-600 transition"
                      onClick={() => startEdit(todo)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 p-2 hover:text-red-600 transition"
                      onClick={() => removeTodo(todo.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
