let users = []; // Array to store user objects
let currentCardId = null; // To store the ID of the card being edited or deleted
let currentUserId = 1;

// Function to fetch and process user data from JSON file
function loadUserData() {
	fetch("https://jsonplaceholder.typicode.com/todos")
		.then((response) => response.json())
		.then((data) => {
			data.forEach((cardData) => {
				let user = findUserById(cardData.userId);
				if (!user) {
					addUser(cardData.userId);
					user = findUserById(cardData.userId);
				}
				user.addCard(cardData.id, cardData.title, cardData.completed);
			});
		})
		.catch((error) => console.error("Error loading user data:", error));
}

// Function to add a user
function addUser(userId) {
	if (findUserById(userId)) {
		console.log(`User with ID ${userId} already exists.`);
		return;
	}

	const newUser = new User(userId);
	users.push(newUser);

	const userContainer = document.createElement("div");
	userContainer.className = "container";
	userContainer.id = `cont-${newUser.userId}`;
	document.body.appendChild(userContainer);

	const btnContainer = document.createElement("div");
	const addBtn = document.createElement("div");
	btnContainer.className = "outer button-container";
	addBtn.id = "addCard";
	addBtn.style.backgroundImage = "url(assets/add_darkPink.png)";
	addBtn.title = "Add Card";
	addBtn.className = "buttons";
	btnContainer.appendChild(addBtn);
	userContainer.appendChild(btnContainer);
	console.log(`User with ID ${userId} added successfully.`);
}

// Function to find a user by ID
function findUserById(id) {
	return users.find((user) => user.userId === id);
}

class Card {
	constructor(id, userId, title, completed = false) {
		this.id = id;
		this.userId = userId;
		this.title = title;
		this.completed = completed;
	}

	updateTitle(newTitle) {
		this.title = newTitle;
	}

	updateCompleted(newCompletedStatus) {
		this.completed = newCompletedStatus;
	}
}

class User {
	constructor(userId) {
		this.userId = userId;
		this.userCards = [];
	}

	addCard(id, title, completed = false) {
		if (!this.getCardById(id)) {
			const card = new Card(id, this.userId, title, completed);
			this.userCards.push(card);

			const cardContainer = document.createElement("div");
			cardContainer.className = "card";
			cardContainer.id = `card-${this.userId}-${id}`;

			const contentDiv = document.createElement("div");
			contentDiv.className = "content";

			const titleElement = document.createElement("h3");
			titleElement.id = `title-${this.userId}-${id}`;
			titleElement.innerText = "Card ID: " + id;

			const textarea = document.createElement("textarea");
			textarea.className = "para";
			textarea.id = `textarea-${this.userId}-${id}`;
			textarea.value = title;

			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = `ischecked-${this.userId}-${id}`;
			checkbox.checked = completed;

			const editButton = document.createElement("div");
			editButton.id = `edit-${this.userId}-${id}`;
			editButton.style.backgroundImage = "url('assets/edit_dark.png')";
			editButton.title = "Edit";
			editButton.className = "buttons";

			const deleteButton = document.createElement("div");
			deleteButton.id = `delete-${this.userId}-${id}`;
			deleteButton.style.backgroundImage =
				"url('assets/delete_dark.png')";
			deleteButton.title = "Delete Card";
			deleteButton.className = "buttons";

			const buttonContainer = document.createElement("div");
			buttonContainer.className = "inner button-container";
			buttonContainer.appendChild(editButton);
			buttonContainer.appendChild(deleteButton);

			contentDiv.appendChild(titleElement);
			contentDiv.appendChild(textarea);
			contentDiv.appendChild(document.createTextNode("Completed: "));
			contentDiv.appendChild(checkbox);
			contentDiv.appendChild(buttonContainer);

			cardContainer.appendChild(contentDiv);

			document
				.getElementById(`cont-${this.userId}`)
				.appendChild(cardContainer);
		} else {
			console.log(`Card with ID ${id} already exists.`);
		}
	}

	getCardById(cardId) {
		return this.userCards.find((card) => card.id === cardId);
	}

	removeCardById(cardId) {
		this.userCards = this.userCards.filter((card) => card.id !== cardId);
		const cardElement = document.getElementById(
			`card-${this.userId}-${cardId}`
		);
		if (cardElement) {
			cardElement.remove();
		}
	}

	updateCardTitle(cardId, newTitle) {
		const card = this.getCardById(cardId);
		if (card) {
			card.updateTitle(newTitle);
			document.getElementById(
				`title-${this.userId}-${cardId}`
			).innerText = newTitle;
			document.getElementById(`textarea-${this.userId}-${cardId}`).value =
				newTitle;
		} else {
			console.log(`Card with ID ${cardId} not found.`);
		}
	}

	updateCardCompleted(cardId, newCompletedStatus) {
		const card = this.getCardById(cardId);
		if (card) {
			card.updateCompleted(newCompletedStatus);
			document.getElementById(
				`ischecked-${this.userId}-${cardId}`
			).checked = newCompletedStatus;
		} else {
			console.log(`Card with ID ${cardId} not found.`);
		}
	}
}

// Fetch user data when the page loads
document.addEventListener("DOMContentLoaded", loadUserData);

// Open the form popup to add a card
const addCardBtn = document.getElementById("addCard");
if (addCardBtn) {
	addCardBtn.addEventListener("click", () => {
		document.getElementById("formPopup").classList.add("show");
	});
}

// Close the form popup
const closeFormBtn = document.getElementById("closeFormBtn");
if (closeFormBtn) {
	closeFormBtn.addEventListener("click", () => {
		document.getElementById("formPopup").classList.remove("show");
	});
}

// Handle form submission
const doneBtn = document.getElementById("doneBtn");
if (doneBtn) {
	doneBtn.addEventListener("click", () => {
		const id = document.getElementById("idInput").value.trim();
		const title = document.getElementById("titleInput").value.trim();
		const completed = document.getElementById("confirmCheckbox").checked;

		if (id && title) {
			const user = findUserById(currentUserId); // Replace with actual user ID
			if (user) {
				user.addCard(id, title, completed);
			}
		} else {
			alert("ID and Title cannot be empty.");
		}

		document.getElementById("formPopup").classList.remove("show");
	});
}

// Handle edit and delete button clicks
document.body.addEventListener("click", (event) => {
	if (event.target.className.includes("buttons")) {
		const [action, userId, cardId] = event.target.id.split("-").slice(0, 3);

		currentUserId = userId;
		currentCardId = cardId;

		if (action === "edit") {
			document.getElementById("updatePopup").classList.add("show");
		} else if (action === "delete") {
			document.getElementById("deletePopup").classList.add("show");
		}
	}
});

// Close the delete confirmation popup
const closeDeletePopupBtn = document.getElementById("closeDeletePopupBtn");
if (closeDeletePopupBtn) {
	closeDeletePopupBtn.addEventListener("click", () => {
		document.getElementById("deletePopup").classList.remove("show");
	});
}

// Confirm deletion
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
if (confirmDeleteBtn) {
	confirmDeleteBtn.addEventListener("click", () => {
		const user = findUserById(currentUserId);
		if (user) {
			user.removeCardById(currentCardId);
		}
		document.getElementById("deletePopup").classList.remove("show");
	});
}

// Cancel deletion
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
if (cancelDeleteBtn) {
	cancelDeleteBtn.addEventListener("click", () => {
		document.getElementById("deletePopup").classList.remove("show");
	});
}

// Close the update confirmation popup
const closeUpdatePopupBtn = document.getElementById("closeUpdatePopupBtn");
if (closeUpdatePopupBtn) {
	closeUpdatePopupBtn.addEventListener("click", () => {
		document.getElementById("updatePopup").classList.remove("show");
	});
}

// Confirm update
const confirmUpdateBtn = document.getElementById("confirmUpdateBtn");
if (confirmUpdateBtn) {
	confirmUpdateBtn.addEventListener("click", () => {
		const newTitle = document
			.getElementById(`textarea-${currentUserId}-${currentCardId}`)
			.value.trim();
		const newCompleted = document.getElementById(
			`ischecked-${currentUserId}-${currentCardId}`
		).checked;

		const user = findUserById(currentUserId);
		if (user) {
			const card = user.getCardById(currentCardId);
			if (card) {
				if (card.title !== newTitle) {
					user.updateCardTitle(currentCardId, newTitle);
				}
				if (card.completed !== newCompleted) {
					user.updateCardCompleted(currentCardId, newCompleted);
				}
			}
		}
		document.getElementById("updatePopup").classList.remove("show");
	});
}

// Cancel update
const cancelUpdateBtn = document.getElementById("cancelUpdateBtn");
if (cancelUpdateBtn) {
	cancelUpdateBtn.addEventListener("click", () => {
		document.getElementById("updatePopup").classList.remove("show");
	});
}
