import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState(["할일1", "할일2"]);
  return (
    <div className="App">
      <h1>ToDo List</h1>
      <div>
        <input />
        <button>ADD</button>
      </div>
      {todos.map((todo, index) => (
          <div key={index}>
            <input type='checkbox'/>
            <span>{todo}</span>
            <button>DEL</button>
          </div>
        )
      )}
    </div>
  );
}

export default App;