import { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
  id: number;
  task: string;
  isComplete: boolean;
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState<number | null>(null);
  const apiUrl = "https://localhost:7219/api/todos";

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the todos!", error);
      });
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      axios.post(apiUrl, { task: newTodo, isComplete: false })
        .then(response => {
          setTodos([...todos, response.data]);
          setNewTodo("");
        })
        .catch(error => {
          console.error("There was an error creating the todo!", error);
        });
    }
  };

  const updateTodo = (id: number, updatedTask: string) => {
    axios.put(`${apiUrl}/${id}`, { task: updatedTask, isComplete: false })
      .then(() => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, task: updatedTask } : todo));
        setEditTodo(null);
      })
      .catch(error => {
        console.error("There was an error updating the todo!", error);
      });
  };

  const toggleComplete = (id: number, isComplete: boolean) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (todoToUpdate) {
      axios.put(`${apiUrl}/${id}`, { ...todoToUpdate, isComplete: !isComplete })
        .then(() => {
          setTodos(todos.map(todo => todo.id === id ? { ...todo, isComplete: !isComplete } : todo));
        })
        .catch(error => {
          console.error("There was an error toggling the todo!", error);
        });
    }
  };

  const removeTodo = (id: number) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the todo!", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
            placeholder="Add a new task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg"
            onClick={addTodo}
          >
            Add
          </button>
        </div>
        <ul>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center bg-gray-200 p-2 mb-2 rounded"
            >
              {editTodo === todo.id ? (
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border focus:outline-none"
                  defaultValue={todo.task}
                  onBlur={(e) => updateTodo(todo.id, e.target.value)}
                />
              ) : (
                <span
                  className={`flex-1 cursor-pointer overflow-hidden ${todo.isComplete ? 'line-through' : ''}`}
                  onClick={() => toggleComplete(todo.id, todo.isComplete)}
                >
                  {todo.task}
                </span>
              )}
              <div className="flex space-x-2">
                <button
                  className="text-blue-500"
                  onClick={() => setEditTodo(todo.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => removeTodo(todo.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
