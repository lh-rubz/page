let users = []; // Array to store user objects
let currentCardId = null; // To store the ID of the card being edited or deleted
let currentUserId = null; // To store the ID of the user for the current operation

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
				if (user) {
					user.addCard(
						cardData.id,
						cardData.title,
						cardData.completed
					);
				} else {
					console.log(
						`Failed to add card. User with ID ${cardData.userId} does not exist.`
					);
				}
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

	// Create user card container
	const userCardContainer = document.getElementById("users-container");
	const userCard = document.createElement("div");
	userCard.className = "userCard";
	userCard.id = `userCard-${newUser.userId}`;
	userCardContainer.appendChild(userCard);

	// Create image container
	const imgContainer = document.createElement("div");
	imgContainer.className = "userImg";
	const randomImage = Math.ceil(Math.random() * 6); // Ensure this matches your image file naming convention
	imgContainer.style.backgroundImage = `url("assets/pfp-${randomImage}.png")`;
	userCard.appendChild(imgContainer);

	// Create text container
	const userTxt = document.createElement("div");
	userTxt.className = "userTxt";
	const link = document.createElement("a");
	const viewCardsB = document.createElement("button");
	viewCardsB.textContent = "View Cards";
	viewCardsB.className = "viewCardsButton";
	viewCardsB.id = `view-${userId}`;
	link.appendChild(viewCardsB);
	link.href = "#cards-container";
	userTxt.appendChild(link);
	userCard.appendChild(userTxt);

	// Create container for cards
	const cardsContainer = document.getElementById("cards-container");
	const userContainer = document.createElement("div");
	userContainer.className = "container";
	userContainer.id = `cont-${newUser.userId}`;
	cardsContainer.appendChild(userContainer);

	const btnContainer = document.createElement("div");
	const addBtn = document.createElement("div");
	btnContainer.className = "outer button-container";
	addBtn.className = "buttons";
	addBtn.id = `addCard-${newUser.userId}`;
	addBtn.style.backgroundImage = "url(assets/add_darkPink.png)";
	addBtn.title = "Add Card";
	btnContainer.appendChild(addBtn);
	userContainer.appendChild(btnContainer);
}

// Function to find a user by ID
function findUserById(id) {
	for (let user of users) {
		if (user.userId == id) {
			return user;
		}
	}
	console.log(`User with ID ${id} not found.`);
	return null;
}

class Card {
	constructor(id, title, completed = false) {
		this.id = id;
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
	isCardIdTaken(cardId) {
		const card = this.getCardById(cardId);
		return card !== undefined && card !== null;
	}

	constructor(userId) {
		this.userId = userId;
		this.userCards = [];
	}

	addCard(id, title, completed = false) {
		if (!this.isCardIdTaken(id)) {
			const card = new Card(id, title, completed);
			this.userCards.push(card);

			const cardContainer = document.createElement("div");
			cardContainer.className = "card";
			cardContainer.id = `card-${this.userId}-${id}`;

			const contentDiv = document.createElement("div");
			contentDiv.className = "content";

			const titleElement = document.createElement("h3");
			titleElement.innerText = `Card ID: ${id}`;

			const textarea = document.createElement("textarea");
			textarea.className = "para";
			textarea.id = `textarea-${this.userId}-${id}`;
			textarea.value = title;

			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = `ischecked-${this.userId}-${id}`;
			checkbox.checked = completed;

			const editButton = document.createElement("div");
			editButton.className = "buttons";
			editButton.id = `edit-${this.userId}-${id}`;
			editButton.style.backgroundImage = "url('assets/edit_dark.png')";
			editButton.title = "Edit";

			const deleteButton = document.createElement("div");
			deleteButton.className = "buttons";
			deleteButton.id = `delete-${this.userId}-${id}`;
			deleteButton.style.backgroundImage =
				"url('assets/delete_dark.png')";
			deleteButton.title = "Delete Card";

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
		return this.userCards.find((card) => card.id == cardId);
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
			document
				.getElementById(`card-${this.userId}-${cardId}`)
				.querySelector(".para").innerHTML = newTitle;
			console.log(
				document
					.getElementById(`card-${this.userId}-${cardId}`)
					.querySelector(".para").innerHTML
			);
		} else {
			console.log(`Card with ID ${cardId} not found.`);
		}
	}

	updateCardCompleted(cardId, newCompletedStatus) {
		const card = this.getCardById(cardId);
		if (card) {
			card.updateCompleted(newCompletedStatus);
			document
				.getElementById(`card-${this.userId}-${cardId}`)
				.querySelector("input[type='checkbox']").checked =
				newCompletedStatus;
		} else {
			console.log(`Card with ID ${cardId} not found.`);
		}
	}
}

// Fetch user data when the page loads
document.addEventListener("DOMContentLoaded", loadUserData);

document.body.addEventListener("click", (event) => {
	// Handle "viewCardsButton" click
	if (event.target.classList.contains("viewCardsButton")) {
		// Extract userId from the button ID
		const buttonId = event.target.id;
		const userId = buttonId.split("-")[1]; // Extract userId from the button ID
		clearCards();
		const userContainer = document.getElementById(`cont-${userId}`);

		if (userContainer) {
			userContainer.classList.add("show"); // Add the class "show" (without the dot)
		} else {
			console.log(`Container for user ID ${userId} not found.`);
		}
	} else if (event.target.classList.contains("buttons")) {
		const [action, userId, cardId] = event.target.id.split("-");
		console.log(
			`Action: ${action}, User ID: ${userId}, Card ID: ${cardId}`
		);
		currentUserId = userId;
		currentCardId = cardId;

		if (action === "edit") {
			document.getElementById("updatePopup").classList.add("show");
		} else if (action === "delete") {
			document.getElementById("deletePopup").classList.add("show");
		} else if (action === "addCard") {
			document.getElementById("formPopup").classList.add("show");
		}
	}
});

// Form submission for adding a new card
document.getElementById("doneBtn").addEventListener("click", () => {
	const idInputElement = document.getElementById("idInput");
	const titleInputElement = document.getElementById("titleInput");
	const id = idInputElement.value.trim();
	const title = titleInputElement.value.trim();
	const completed = document.getElementById("confirmCheckbox").checked;

	console.log(
		`Adding card with ID ${id}, Title: ${title}, Completed: ${completed}`
	);

	// Clear any previous custom validity messages
	idInputElement.setCustomValidity("");
	titleInputElement.setCustomValidity("");

	let valid = true;

	// Validate the ID and title fields
	if (!id) {
		idInputElement.setCustomValidity("Please fill in the ID.");
		valid = false;
	}

	if (!title) {
		titleInputElement.setCustomValidity("Please fill in the Title.");
		valid = false;
	}

	if (!valid) {
		idInputElement.reportValidity();
		titleInputElement.reportValidity();
		return; // Stop further processing if validation fails
	}

	// Check if the card ID is already taken
	const user = findUserById(currentUserId);
	if (user) {
		if (user.isCardIdTaken(id)) {
			idInputElement.setCustomValidity("Card ID already exists.");
			idInputElement.reportValidity();
			return; // Stop further processing if ID is taken
		}

		// Add the card if all validations pass
		user.addCard(id, title, completed);
	} else {
		console.log(`User with ID ${currentUserId} not found.`);
	}

	// Hide the form popup
	document.getElementById("formPopup").classList.remove("show");
});

// Close the delete confirmation popup
document.getElementById("closeDeletePopupBtn").addEventListener("click", () => {
	console.log("Closing delete confirmation popup.");
	document.getElementById("deletePopup").classList.remove("show");
});

// Confirm deletion
document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
	console.log(
		`Confirming deletion of card with ID ${currentCardId} for user ${currentUserId}`
	);
	const user = findUserById(currentUserId);
	if (user) {
		user.removeCardById(currentCardId);
	} else {
		console.log(`User with ID ${currentUserId} not found.`);
	}
	document.getElementById("deletePopup").classList.remove("show");
});

// Cancel deletion
document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
	console.log("Canceling deletion.");
	document.getElementById("deletePopup").classList.remove("show");
});

// Close the update confirmation popup
document.getElementById("closeUpdatePopupBtn").addEventListener("click", () => {
	console.log("Closing update confirmation popup.");
	document.getElementById("updatePopup").classList.remove("show");
});

// Confirm update
document.getElementById("confirmUpdateBtn").addEventListener("click", () => {
	const textareaId = `textarea-${currentUserId}-${currentCardId}`;
	const checkboxId = `ischecked-${currentUserId}-${currentCardId}`;

	console.log(`Textarea ID: ${textareaId}`);
	console.log(`Checkbox ID: ${checkboxId}`);

	const textareaElement = document.getElementById(textareaId);
	const checkboxElement = document.getElementById(checkboxId);

	if (!textareaElement) {
		console.error(`Textarea element with ID ${textareaId} not found.`);
		return;
	}
	if (!checkboxElement) {
		console.error(`Checkbox element with ID ${checkboxId} not found.`);
		return;
	}

	const newTitle = textareaElement.value.trim();
	const newCompleted = checkboxElement.checked;

	console.log(
		`Updating card with ID ${currentCardId} for user ${currentUserId}. New Title: ${newTitle}, New Completed Status: ${newCompleted}`
	);

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
		} else {
			console.log(
				`Card with ID ${currentCardId} not found for user ${currentUserId}.`
			);
		}
	} else {
		console.log(`User with ID ${currentUserId} not found.`);
	}
	document.getElementById("updatePopup").classList.remove("show");
});

// Cancel update
document.getElementById("cancelUpdateBtn").addEventListener("click", () => {
	console.log("Canceling update.");
	document.getElementById("updatePopup").classList.remove("show");
});

// Clear button event
const clearBtn = document.getElementById("clear");

clearBtn.addEventListener("click", clearCards);

function clearCards() {
	const allUserContainers = document.querySelectorAll(".container");
	allUserContainers.forEach((container) => {
		container.classList.remove("show");
	});
}

// Function to save card data
function saveCards() {
	const data = [];

	// Collect all card data from users
	users.forEach((user) => {
		user.userCards.forEach((card) => {
			data.push({
				userId: user.userId,
				cardId: card.id,
				title: card.title,
				completed: card.completed,
			});
		});
	});

	// Post data to the server
	fetch("/assets/myJson.txt", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((result) => {
			if (result.success) {
				alert("File saved successfully!");
			} else {
				alert("Failed to save the file.");
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("An error occurred while saving the file.");
		});
}

// Save button event listener
const saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", saveCards);
