import './App.css';
import { useState } from 'react';
import {v4 as uuid} from 'uuid';

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [sort, setSort] = useState();
  const [filter, setFilter] = useState("");

  const computedTodos = todos
    .filter((todo) => {
      if (filter === "ALL") return true;
      if (filter === "DONE") return todo.isDone;
      if (filter === "NOT_DONE") return !todo.isDone;
    })
    .sort((a, b) => {
      if (sort === "none") return 0;
      if (sort === "createdAt") return b.createdAt - a.createdAt;
      if (sort === "content") return a.content.localeCompare(b.content);
    });



  return (
    <div className="App">
      <h1>ToDo List</h1>
      <div>
        <label>필터: </label>
        <input 
          type='radio' 
          value="ALL" 
          checked={filter === "ALL"} 
          onChange={(e) => setFilter(e.target.value)} />
        <label>전체</label>
        <input 
          type='radio'
          value="DONE" 
          checked={filter === "DONE"} 
          onChange={(e) => setFilter(e.target.value)}        
        />
        <label>완료</label>
        <input 
          type='radio'
          value="NOT_DONE" 
          checked={filter === "NOT_DONE"} 
          onChange={(e) => setFilter(e.target.value)}
        />
        <label>미완료</label>
      </div>

      <div>
        <label htmlFor='sort'>정렬</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">생성순</option>
          <option value="createdAt">최신순</option>
          <option value="content">가나다순</option>
        </select>
      </div>

      <div>
        <input 
          value={inputValue} //Input의 제어권을 React가 가지고 있을 수 있게 state값을 주입했다
          onChange={(e) => { // Input의 값이 변하는 이벤트가 발생 했을때 제어권을 가진 React의 state값을 변경합니다.
            setInputValue(e.target.value); 
          }} 
        />
        <button 
            onClick={() => {
            //spread 연산자
            const newTodo = {
              id: uuid(),
              content: inputValue,
              isDone: false,
              createdAt: Date.now(),
            };
            setTodos([...todos, newTodo]);
            setInputValue("");
          }}
        >
          ADD
        </button>
      </div>
      <div>
        {computedTodos.map((todo, index) => (
            <div key={todo.id}>
              <input type='checkbox' checked={todo.isDone} onChange={(e) => {
                  /**
                 * todos :
                 * { content : "할일 1"
                 * createdAt : 1697782607507
                 * id : "38b5c80a-008a-47f4-81f1-bb50fa206c29"
                 * isDone : false },
                 * 두번째 todo,
                 * 서밴째 todo
                 */
                const nextTodos = todos.map((todo, idx) => 
                  idx === index ? {...todo, isDone: e.target.checked} : todo);
                setTodos(nextTodos);
              }} />
              <span style={{ textDecoration: todo.isDone ? "line-through" : ""}}>{todo.content}</span>
              <button
              onClick={() => {
                const nextTodos = todos.filter((_, idx) => idx !== index);
                setTodos(nextTodos);
              }}
              >DEL</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;