// 요소 선택
const $input = document.querySelector("input");
const $button = document.querySelector(".addBtn");
const $form = document.querySelector("form");
const $ul = document.querySelector("ul");

// 할 일 목록 가져오기
const fetchTodos = async () => {
  $ul.innerHTML = ""; // 기존 목록 초기화

  try {
    const res = await fetch("http://localhost:3000/todos");
    const todos = await res.json();

    todos.forEach((todo) => {
      createTodoItem(todo);
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// 할 일 항목 생성
const createTodoItem = (todo) => {
  const $li = document.createElement("li");

  const $label = document.createElement("label");
  $label.innerText = todo.todo;
  $label.htmlFor = todo.id;

  const $div = document.createElement("div");

  const $checkBox = document.createElement("input");
  $checkBox.type = "checkbox";
  $checkBox.id = todo.id;
  $checkBox.checked = todo.done;
  $checkBox.addEventListener("click", () => completeTodo(todo.id));

  const $updateBtn = document.createElement("button");
  $updateBtn.innerText = "수정";
  $updateBtn.addEventListener("click", () => editTodoText(todo.id, todo.todo));

  const $deleteBtn = document.createElement("button");
  $deleteBtn.innerText = "삭제";
  $deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

  if (todo.done) {
    $li.classList.add("checked");
  }

  $div.append($checkBox, $updateBtn, $deleteBtn);
  $li.append($label, $div);
  $ul.appendChild($li);
};

// 할 일 추가
const addTodo = async () => {
  const todoInput = $input.value.trim();

  if (!todoInput) {
    alert("텍스트를 입력하시오");
    return;
  }

  const newTodo = {
    todo: todoInput,
    done: false,
  };

  try {
    await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });
    fetchTodos(); // 목록 업데이트
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

// 할 일 삭제
const deleteTodo = async (id) => {
  if (!confirm("삭제하시겠습니까?")) return;

  try {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos(); // 목록 업데이트
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// 할 일 완료 상태 변경
const completeTodo = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/todos/${id}`);
    const todo = await res.json();

    const checkTodo = {
      done: !todo.done,
    };

    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkTodo),
    });
    fetchTodos(); // 목록 업데이트
  } catch (error) {
    console.error("Error toggling todo done:", error);
  }
};

// 할 일 텍스트 수정
const editTodoText = async (id, currentText) => {
  const newText = prompt("새로운 텍스트를 입력하세요:", currentText);

  if (newText === null) {
    alert("수정이 취소됨");
    return;
  }

  if (newText.trim().length < 2) {
    alert("텍스트를 2글자 이상 입력하시오");
    return;
  }

  try {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: newText }),
    });
    fetchTodos(); // 목록 업데이트
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

// 폼 제출 이벤트 처리
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
  $input.value = "";
  $input.focus();
});

// 초기 할 일 목록 가져오기
fetchTodos();
