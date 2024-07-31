import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

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

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error("Error fetching todos!", error);
      });
  }, []);

  const addTodo = () => {
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo) {
      axios.post(apiUrl, { task: trimmedTodo, isComplete: false })
        .then(response => {
          setTodos([response.data, ...todos]);
          setNewTodo("");
        })
        .catch(error => {
          console.error("Error creating todo!", error);
        });
    }
  };

  const startEdit = (todo: Todo) => {
    setEditTodo(todo.id);
    setEditTask(todo.task);
  };

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
    <div className="py-8 min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-lg overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500">
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
                className="relative flex items-center bg-gray-100 p-3 mb-2 rounded-md shadow-sm hover:bg-gray-200 transition"
              >
                <input
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={() => toggleComplete(todo.id, todo.isComplete)}
                  className="mr-3"
                />
                <div className="flex-1 overflow-hidden">
                  {editTodo === todo.id ? (
                    <div className="flex items-center">
                      <textarea
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                      />
                      <button
                        className={`ml-2 px-4 py-2 rounded-md transition ${editTask.trim() === '' || editTask === todos.find(todo => todo.id === editTodo)?.task ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                        onClick={() => saveEdit(todo.id)}
                        disabled={editTask.trim() === '' || editTask === todos.find(todo => todo.id === editTodo)?.task}
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
                      className={`block overflow-hidden pr-12 ${todo.isComplete ? 'line-through text-gray-500' : 'text-gray-800'}`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {todo.task}
                    </span>
                  )}
                </div>
                {editTodo !== todo.id && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex-shrink-0 space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-600 transition"
                      onClick={() => startEdit(todo)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 transition"
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
