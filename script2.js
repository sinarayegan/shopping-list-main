const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const submitButton = document.getElementsByClassName("btn");
let editMode = false;
let selecteditem;

function onDOMContentLoaded() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
  itemInput.value = "";
}
const onAddItemSubmit = (e) => {
  e.preventDefault();
  const newItem = itemInput.value.toLowerCase();
  //Validate Input
  if (newItem === "") {
    alert("please add an item");
    return;
  }
  if (
    getItemsFromStorage().indexOf(newItem.toLowerCase()) !== -1 &&
    !editMode
  ) {
    alert("You Already Have This Item In Your List");
    return;
  }
  if (!editMode) {
    addItemToDom(newItem);

    //add item to local storage
    addItemToStorages(newItem);
    checkUI();
    itemInput.value = "";
  } else {
    let item = selecteditem;
    let itemsFromStorage = getItemsFromStorage();
    let i = itemsFromStorage.indexOf(item);
    itemsFromStorage.splice(i, 1, itemInput.value.toLowerCase());
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
    clearItems();
    onDOMContentLoaded();
    checkUI();
    editMode = false;
    resetUi();
  }
};

function addItemToDom(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
}

function addItemToStorages(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

/**
 * @param {Event} e
 */
function removeItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Are you sure you want to remove this item?")) {
      let item = e.target.parentElement.parentElement.textContent.toLowerCase();
      let itemsFromStorage = getItemsFromStorage();
      let i = itemsFromStorage.indexOf(item);
      itemsFromStorage.splice(i, 1);
      localStorage.setItem("items", JSON.stringify(itemsFromStorage));
      clearItems();
      onDOMContentLoaded();
      checkUI();
      resetUi();
    }
  } else {
    const lis = document.getElementsByTagName("li");

    e.target.style.color = "#ccc";
    itemInput.value = e.target.textContent;
    selecteditem = e.target.textContent.toLowerCase();
    submitButton[0].style.backgroundColor = "green";
    submitButton[0].textContent = "Update item";
    editMode = true;
  }
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
}

function clearItemsFromStorage() {
  localStorage.clear();
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  resetUi();
  checkUI();
}
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.includes(text)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
}

function resetUi() {
  submitButton[0].style.backgroundColor = "#333";
  submitButton[0].textContent = "Add item";
  itemInput.value = "";
  itemFilter.value = "";
}
//Event Listeners
itemForm.addEventListener("submit", onAddItemSubmit);
itemList.addEventListener("click", removeItem);
clearBtn.addEventListener("click", clearItemsFromStorage);
itemFilter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
checkUI();
