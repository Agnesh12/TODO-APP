import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { SiArchiveofourown, SiDeluge } from 'react-icons/si';

function Model() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef(null);

    useEffect(() => {
    document.title = "TODO APP";
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    axios
      .get('http://localhost:8080/api/task')
      .then(res => {
        if (!ignore) setTasks(res.data);
      })
      .catch(() => setError('Failed to fetch tasks'))
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 1500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const addTask = async () => {
    if (task.trim() === '') {
      setError('Task cannot be empty');
      return;
    }
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/task', { text: task, completed: false });
      setTasks(prev => [...prev, res.data]);
      setTask('');
      setSuccess('Task added!');
      inputRef.current?.focus();
    } catch {
      setError('Failed to add task');
    }
  };

  const toggleTask = async (id) => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    try {
      const res = await axios.put(`http://localhost:8080/api/task/${id}`, { ...t, completed: !t.completed });
      setTasks(tasks.map(task => task.id === id ? res.data : task));
      setSuccess(t.completed ? 'Marked as incomplete' : 'Marked as complete');
    } catch {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/task/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      setSuccess('Task deleted');
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleInputKeyDown = e => {
    if (e.key === 'Enter') addTask();
    if (e.key === 'Escape') setTask('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-200 via-blue-100 to-yellow-100">
      <div className="w-full max-w-xl h-[650px] rounded-3xl shadow-2xl transform duration-500 hover:scale-105 ease-in-out p-7 bg-gradient-to-br from-white via-fuchsia-100 to-cyan-100 flex flex-col border-4 border-transparent hover:border-fuchsia-400 transition-all">
        <div className="flex items-center mb-6">
          <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 rounded-full p-3 shadow-lg mr-4 animate-bounce">
            <SiArchiveofourown className="text-4xl text-white drop-shadow-lg" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            Welcome to ToDo App
          </h1>
        </div>

        <div className="flex mt-2">
          <input
            ref={inputRef}
            placeholder="Add a new task"
            value={task}
            onChange={e => {
              setTask(e.target.value);
              setError('');
            }}
            onKeyDown={handleInputKeyDown}
            className="flex-1 h-[50px] mr-4 px-4 rounded-xl border-2 border-fuchsia-400 shadow-xl focus:outline-none focus:ring-4 focus:ring-cyan-300 bg-gradient-to-r from-white via-yellow-100 to-pink-100 text-gray-700 font-semibold placeholder:text-fuchsia-400"
            disabled={loading}
            maxLength={100}
            autoFocus
          />
          <button
            onClick={addTask}
            className="w-[90px] h-[50px] rounded-xl border-2 border-cyan-400 shadow-xl bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-yellow-400 text-white font-bold hover:from-fuchsia-700 hover:to-yellow-500 hover:scale-105 transition-all"
            disabled={loading}
            aria-label="Add task"
          >
            Add
          </button>
        </div>

        {error && (
          <div className="mt-3 text-red-600 font-bold bg-red-100 rounded-lg px-4 py-2 shadow animate-pulse">{error}</div>
        )}
        {success && (
          <div className="mt-3 text-green-700 font-bold bg-green-100 rounded-lg px-4 py-2 shadow animate-bounce">{success}</div>
        )}

        <div className="mt-5 space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-fuchsia-300 scrollbar-track-cyan-100">
          {loading ? (
            <div className="text-center text-fuchsia-400 mt-10 animate-pulse text-xl font-bold">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-cyan-400 mt-10 text-lg font-semibold">No tasks yet. Add one!</div>
          ) : (
            tasks.map((t, idx) => (
              <div
                key={t.id}
                className={`w-full h-16 border-2 p-5 rounded-2xl shadow-xl flex justify-between items-center group transition-all bg-gradient-to-r ${
                  idx % 2 === 0
                    ? 'from-pink-100 via-yellow-100 to-cyan-100'
                    : 'from-cyan-100 via-fuchsia-100 to-yellow-100'
                } border-fuchsia-200 hover:border-fuchsia-400 hover:scale-105`}
              >
                <span
                  onClick={() => toggleTask(t.id)}
                  className={`cursor-pointer select-none transition-colors duration-200 text-lg font-semibold ${
                    t.completed
                      ? 'line-through text-cyan-600 bg-gradient-to-r from-green-200 to-cyan-100 px-2 py-1 rounded-lg'
                      : 'hover:text-fuchsia-600'
                  }`}
                  title={t.completed ? "Mark as incomplete" : "Mark as complete"}
                  tabIndex={0}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleTask(t.id)}
                  role="button"
                  aria-pressed={t.completed}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  title="Delete"
                  className="ml-4 hover:scale-125 transition-transform opacity-80 group-hover:opacity-100 bg-gradient-to-tr from-fuchsia-200 to-yellow-200 rounded-full p-1 shadow"
                  aria-label={`Delete ${t.text}`}
                >
                  <SiDeluge className="text-2xl text-fuchsia-700 drop-shadow" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 text-center text-xs text-fuchsia-400 font-semibold tracking-wide">
          Made with <span className="animate-pulse text-pink-500">♥g</span> by You
        </div>
      </div>
    </div>
  );
}

export default Model;
