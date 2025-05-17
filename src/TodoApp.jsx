import React, { useState } from 'react';

function TodoApp() {
  const [task, setTask] = useState('');  
  const [tasks, setTasks] = useState([]); 

  
  const addTask = () => {
    if (task.trim() === '') return; 
    setTasks([...tasks, { id: Date.now(), text: task, completed: false }]); 
    setTask(''); 
  };

  
  const toggleComplete = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id)); 
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-400">
      <div className="w-[500px] min-h-[500px] border-2 p-10 bg-white rounded-2xl shadow-xl hover:scale-105 transform duration-500 ease-in-out">
        <h1 className="text-center font-serif font-bold text-2xl mb-5">✨ TODO LIST APP ✨</h1>
        
        
        <div className="flex mb-5">
          <input 
            type="text" 
            placeholder="Add a new task..." 
            className="w-full h-12 border-2 p-5 m-2 rounded-xl shadow-xl"
            value={task}
            onChange={(e) => setTask(e.target.value)} 
            required 
          />
          <button 
            onClick={addTask} 
            className="w-1/3 h-12 border-2 p-2 m-2 rounded-xl shadow-xl bg-blue-500 text-white hover:bg-blue-700"
          >
            ADD
          </button>
        </div>

       
        <div className="space-y-3">
          {tasks.map((t) => (
            <div 
              key={t.id} 
              className="flex justify-between items-center w-full h-14 border-2 p-3 m-2 rounded-xl shadow-xl bg-slate-100"
            >
             
              <span 
                onClick={() => toggleComplete(t.id)} 
                className={`flex-1 cursor-pointer ${t.completed ? 'line-through text-gray-500' : ''}`}
              >
                {t.text}
              </span>

              
              <button 
                onClick={() => deleteTask(t.id)} 
                className="text-red-500 hover:text-red-700 font-bold"
              >
                X
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default TodoApp;
