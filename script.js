const memoTitle = document.getElementById("memoTitle");
const memoText = document.getElementById("memoText");
const saveButton = document.getElementById("saveButton");
const clearAllButton = document.getElementById("clearAllButton");
const memoList = document.getElementById("memoList");
const memoCount = document.getElementById("memoCount");

let memos = JSON.parse(localStorage.getItem("myMemos")) || [];
let editingIndex = null;

function saveMemosToStorage() {
  localStorage.setItem("myMemos", JSON.stringify(memos));
}

function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${date} ${hour}:${minute}`;
}

function renderMemos() {
  memoList.innerHTML = "";
  memoCount.textContent = memos.length;

  if (memos.length === 0) {
    memoList.innerHTML = '<p class="empty-message">まだメモがありません</p>';
    return;
  }

  memos.forEach((memo, index) => {
    const card = document.createElement("article");
    card.className = "memo-card";

    const title = document.createElement("h2");
    title.textContent = memo.title;

    const date = document.createElement("p");
    date.className = "date";
    date.textContent = memo.date;

    const content = document.createElement("div");
    content.className = "content";
    content.textContent = memo.text;

    const actions = document.createElement("div");
    actions.className = "memo-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "編集";

    editButton.addEventListener("click", () => {
      editMemo(index);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";

    deleteButton.addEventListener("click", () => {
      deleteMemo(index);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(content);
    card.appendChild(actions);

    memoList.appendChild(card);
  });
}

function saveMemo() {
  const title = memoTitle.value.trim();
  const text = memoText.value.trim();

  if (title === "" && text === "") {
    alert("タイトルかメモ内容を入力してください");
    return;
  }

  const memoData = {
    title: title || "無題のメモ",
    text: text,
    date: getCurrentDateTime()
  };

  if (editingIndex === null) {
    memos.unshift(memoData);
  } else {
    memos[editingIndex] = memoData;
    editingIndex = null;
    saveButton.textContent = "メモを保存";
  }

  memoTitle.value = "";
  memoText.value = "";

  saveMemosToStorage();
  renderMemos();
}

function editMemo(index) {
  memoTitle.value = memos[index].title;
  memoText.value = memos[index].text;
  editingIndex = index;
  saveButton.textContent = "編集を保存";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteMemo(index) {
  const result = confirm("このメモを削除しますか？");

  if (!result) {
    return;
  }

  memos.splice(index, 1);
  saveMemosToStorage();
  renderMemos();
}

function clearAllMemos() {
  if (memos.length === 0) {
    alert("削除するメモがありません");
    return;
  }

  const result = confirm("全てのメモを削除しますか？");

  if (!result) {
    return;
  }

  memos = [];
  editingIndex = null;
  saveButton.textContent = "メモを保存";
  saveMemosToStorage();
  renderMemos();
}

saveButton.addEventListener("click", saveMemo);
clearAllButton.addEventListener("click", clearAllMemos);

renderMemos();
