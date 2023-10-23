import './App.css';
import { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';
import { RadioGroup } from './components/RadioGroup';
import { Select } from "./components/Select";
import { TodoItem } from "./components/TodoItem";
import { Button } from "./components/Button";

function App() {
  // state 새로운 값으로 대체한다.
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [sort, setSort] = useState("NONE");
  const [filter, setFilter] = useState("ALL");
  const [updateTargetId, setUpdateTargetId] = useState("");

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (!storedTodos || storedTodos.length === 0) return;
    setTodos(storedTodos);
  }, []);

  // computedValue
  const isUpdateMode = Boolean(updateTargetId);

  const computedTodos = todos
    .filter((todo) => {
      if (filter === "ALL") return true;
      if (filter === "DONE") return todo.isDone;
      if (filter === "NOT_DONE") return !todo.isDone;
    })
    .sort((a, b) => {
      if (sort === "NONE") return 0;
      if (sort === "CREATED_AT") return b.createdAt - a.createdAt;
      if (sort === "CONTENT") return a.content.localeCompare(b.content);
    });

    const updateTodos = (nextTodos) => {
      localStorage.setItem("todos", JSON.stringify(nextTodos));
      setTodos(nextTodos);
    };

  return (
    <div className="App">
      <h1 className='header'>ToDo List</h1>
      <div className='filter-container'>
        <div>
          <span>필터: </span>
          <RadioGroup 
            values = {["ALL", "DONE", "NOT_DONE"]} 
            labels = {["전체", "완료", "미완료"]}
            value = {filter}
            onChange = {(e) => setFilter(e.target.value)}
          />
        </div>
        <div>
          <span htmlFor="sort">정렬 : </span>
          <Select
            values = {["NONE", "CREATED_AT", "CONTENT"]}
            labels = {["생성순", "최신순", "가나다순"]}
            value = {sort}
            onChange = {(e) => setSort(e.target.value)}
          />
        </div>
      </div>
      
      {/* 
        SPA(Single Page Application), CSR(client Side Rendering  <-> SSR, Server side rendering)
        client가 dom그리기를 제어한다.
      */}
      <form
        className='add-input-container'
        onSubmit={(e) => {
          // form은 기본적으로 새로고침을 trigger, why? 새로운 html파일을 내려받아야하니까
          e.preventDefault();
          if(!inputValue) return;
          const newTodo = {
            id: uuid(),
            content: inputValue,
            isDone: false,
            createdAt: Date.now(),
          };
          updateTodos([...todos, newTodo]);
          setInputValue("");
        }}
      >
        <input
          className='add-input'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value); 
          }} 
          disabled = {isUpdateMode}
        />
        <Button disabled={!inputValue || isUpdateMode}>{"ADD"}</Button>
      </form>

      <div className='todo-list-container'>
        {computedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateTargetId={updateTargetId}
            setUpdateTargetId={setUpdateTargetId}
            onTodoListDelete={(itemId) => {
              const nextTodos = todos.filter((item) => item.id !== itemId);
              updateTodos(nextTodos);
            }}
            onTodoListUpdate={(itemId, nextTodo) => {
              const nextTodos = todos.map((todo) =>
                todo.id === itemId ? { ...todo, ...nextTodo } : todo
              );
              updateTodos(nextTodos);
            }}
          />
        ))}
      </div>
    </div>
  );
}


export default App;