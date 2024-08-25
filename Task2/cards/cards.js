let users = []; // Array to store user objects
let currentCardId = null; // To store the ID of the card being edited or deleted
let currentUserId = null; // To store the ID of the user for the current operation
let currentUser = null;
var reservedIDs = [];
var allCards = []; // Store all cards for search purposes
var searching;

function loadUserData() {
	fetch("https://cardsapi.netlify.app/.netlify/functions/api")
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
						cardData.userId,
						cardData.title,
						cardData.completed
					);
				}
			});
		})
		.catch((error) => console.error("Error loading user data:", error));

	const search = document.getElementById("searchBar");
}

// Function to add a user
function createUserCard(userId) {
	const userCard = document.createElement("div");
	userCard.className = "userCard";
	userCard.id = `userCard-${userId}`;
	return userCard;
}

function createImageContainer(userId) {
	const imgContainer = document.createElement("div");
	imgContainer.className = "userImg";
	const randomImage = Math.ceil(Math.random() * 6);
	imgContainer.style.backgroundImage = `url("assets/pfp-${randomImage}.png")`;
	return imgContainer;
}

function createTextContainer(userId) {
	const userTxt = document.createElement("div");
	userTxt.className = "userTxt";

	const userIDtitle = document.createElement("h5");
	userIDtitle.innerHTML = "User ID: " + userId;
	userTxt.appendChild(userIDtitle);

	const link = document.createElement("a");
	const viewCardsB = document.createElement("button");
	viewCardsB.textContent = "View Cards";
	viewCardsB.className = "viewCardsButton";
	viewCardsB.id = `view-${userId}`;
	link.appendChild(viewCardsB);
	link.href = "#cards-container";

	userTxt.appendChild(link);

	return userTxt;
}

function createUserContainer(userId) {
	const userContainer = document.createElement("div");
	userContainer.className = "container";
	userContainer.id = `cont-${userId}`;
	return userContainer;
}

function createAddButton(userId) {
	const btnContainer = document.createElement("div");
	btnContainer.className = "outer button-container";

	const addBtn = document.createElement("div");
	addBtn.className = "buttons";
	addBtn.id = `addCard-${userId}`;
	addBtn.style.backgroundImage = "url(assets/add_darkPink.png)";
	addBtn.title = "Add Card";

	const userIdLabel = document.createElement("h4");
	userIdLabel.innerHTML = "User ID: " + userId;

	btnContainer.appendChild(userIdLabel);
	btnContainer.appendChild(addBtn);

	return btnContainer;
}

function addUser(userId) {
	const newUser = new User(userId);
	users.push(newUser);

	// Create and append user card
	const userCard = createUserCard(userId);
	const userCardContainer = document.getElementById("users-container");
	userCardContainer.appendChild(userCard);

	// Create and append image container
	const imgContainer = createImageContainer(userId);
	userCard.appendChild(imgContainer);

	// Create and append text container
	const userTxt = createTextContainer(userId);
	userCard.appendChild(userTxt);

	// Create and append user container for cards
	const userContainer = createUserContainer(userId);
	const cardsContainer = document.getElementById("cards-container");
	cardsContainer.appendChild(userContainer);

	// Create and append add button
	const addBtnContainer = createAddButton(userId);
	userContainer.appendChild(addBtnContainer);
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
//Card class
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
	//each user has several cards
	constructor(userId) {
		this.userId = userId;
		this.userCards = [];
		this.htmlCards = [];
	}

	addCard(id, userId, title, completed = false) {
		const card = new Card(id, userId, title, completed);
		this.userCards.push(card);
		reservedIDs.push(id);

		const cardContainer = this.createCardContainer(id, userId);
		const contentDiv = this.createContentDiv(id, userId, title, completed);

		cardContainer.appendChild(contentDiv);
		document
			.getElementById(`cont-${this.userId}`)
			.appendChild(cardContainer);
		allCards.push(cardContainer);
	}

	createCardContainer(id, userId) {
		const cardContainer = document.createElement("div");
		this.htmlCards.push(cardContainer);
		cardContainer.title = "USER ID:" + userId;
		cardContainer.className = "card";
		cardContainer.id = `card-${userId}-${id}`;
		return cardContainer;
	}

	createContentDiv(id, userId, title, completed) {
		const contentDiv = document.createElement("div");
		contentDiv.className = "content";

		const titleElement = document.createElement("h3");
		titleElement.innerText = `Card ID: ${id}`;

		const textarea = document.createElement("textarea");
		textarea.className = "para";
		textarea.id = `textarea-${userId}-${id}`;
		textarea.value = title;
		textarea.readOnly = true;

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = `ischecked-${userId}-${id}`;
		checkbox.checked = completed;
		checkbox.disabled = true;

		const buttonContainer = this.createButtonContainer(id, userId);

		contentDiv.appendChild(titleElement);
		contentDiv.appendChild(textarea);
		contentDiv.appendChild(document.createTextNode("Completed: "));
		contentDiv.appendChild(checkbox);
		contentDiv.appendChild(buttonContainer);

		return contentDiv;
	}

	createButtonContainer(id, userId) {
		const buttonContainer = document.createElement("div");
		buttonContainer.className = "inner button-container";

		const editButton = document.createElement("div");
		editButton.className = "buttons";
		editButton.id = `edit-${userId}-${id}`;
		editButton.style.backgroundImage = "url('assets/edit_dark.png')";
		editButton.title = "Edit";

		const deleteButton = document.createElement("div");
		deleteButton.className = "buttons";
		deleteButton.id = `delete-${userId}-${id}`;
		deleteButton.style.backgroundImage = "url('assets/delete_dark.png')";
		deleteButton.title = "Delete Card";

		buttonContainer.appendChild(editButton);
		buttonContainer.appendChild(deleteButton);

		return buttonContainer;
	}

	getCardById(cardId) {
		return this.userCards.find((card) => card.id == cardId);
	}

	removeCardById(cardId) {
		reservedIDs = reservedIDs.filter((id) => id != cardId); //removes the id from the array that contains the ids

		this.userCards = this.userCards.filter((card) => card.id !== cardId);
		const cardElement = document.getElementById(
			`card-${this.userId}-${cardId}`
		);
		if (cardElement) {
			cardElement.remove();
		}

		this.updateUserContainer();
	}

	updateUserContainer() {
		if (searching === true) {
			const userContainer = document.getElementById(
				`cont-${this.userId}`
			);
			const childElementsWithShowClass =
				userContainer.querySelectorAll(":scope > .show");

			if (childElementsWithShowClass.length === 0) {
				userContainer.classList.remove("show");
			}
		}
	}

	updateCardTitle(cardId, newTitle) {
		const card = this.getCardById(cardId);
		if (card) {
			card.updateTitle(newTitle);
			document
				.getElementById(`card-${this.userId}-${cardId}`)
				.querySelector(".para").value = newTitle; //in case i wanted to change the way of editing to a form
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
				newCompletedStatus; //in case i wanted to change the way of editing to a form
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
		document.getElementById("notFound").classList.remove("show");
		searching = false;
		const buttonId = event.target.id;
		const userId = buttonId.split("-")[1]; // Extract userId from the button ID
		clearCards();
		const dataChooser = document.getElementById("dataType");
		const completedChooser = document.getElementById("filterCompleted");
		const searchBar = document.getElementById("searchBar");
		searchBar.value = "";
		dataChooser.value = "number";
		completedChooser.value = "both";
		const userContainer = document.getElementById(`cont-${userId}`);
		const user = findUserById(userId);
		currentUser = user;
		showCards();
		if (userContainer) {
			userContainer.classList.add("show");
		}
	} else if (event.target.classList.contains("buttons")) {
		const [action, userId, cardId] = event.target.id.split("-");

		currentUserId = userId;
		currentCardId = cardId;

		if (action === "edit") {
			const user = findUserById(currentUserId);
			if (user) {
				const card = user.getCardById(currentCardId);
				if (card) {
					document.getElementById("updateTA").value = card.title;
					document.getElementById("iscompleted").checked =
						card.completed;
					document
						.getElementById("updatePopup")
						.classList.add("show");
				}
			}
		} else if (action === "delete") {
			document.getElementById("deletePopup").classList.add("show");
		} else if (action === "addCard") {
			document.getElementById("titleInput").value = ""; // Clear the title input
			document.getElementById("confirmCheckbox").checked = false; // Uncheck the checkbox
			document.getElementById("formPopup").classList.add("show");
		}
	}
});
function showCards() {
	allCards.forEach((card) => {
		card.classList.remove("hidden");
	});
}
// Form submission for adding a new card
document.getElementById("doneBtn").addEventListener("click", () => {
	const titleInputElement = document.getElementById("titleInput");
	const id = reservedIDs[reservedIDs.length - 1] + 1;
	const title = titleInputElement.value.trim();
	const completed = document.getElementById("confirmCheckbox").checked;

	// Clear any previous custom validity messages
	titleInputElement.setCustomValidity("");

	if (!title) {
		titleInputElement.setCustomValidity("Please fill in the Title.");
		titleInputElement.reportValidity();
		return;
	}

	// Proceed to add the card if all validations pass
	const user = findUserById(currentUserId);
	if (user) {
		user.addCard(id, currentUserId, title, completed);
		// POST request to add the card on the server
		fetch(
			`https://cardsapi.netlify.app/.netlify/functions/api//cards/user/${currentUserId}`,
			{
				method: "POST",
				body: JSON.stringify({
					title: title,
					completed: completed,
				}),
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
				},
			}
		)
			.then((response) => response.json())
			.then((json) => console.log("Card added:", json))
			.catch((error) => console.error("Error adding card:", error));
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
		fetch(
			`https://cardsapi.netlify.app/.netlify/functions/api/cards/${currentCardId}`,
			{
				method: "DELETE",
			}
		)
			.then(() => console.log("Card deleted"))
			.catch((error) => console.error("Error deleting card:", error));
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
	const newTitle = document.getElementById("updateTA").value.trim();
	const newCompleted = document.getElementById("iscompleted").checked;

	if (!newTitle) {
		// If the title is empty, display a validation message
		document
			.getElementById("updateTA")
			.setCustomValidity("Title cannot be empty.");
		document.getElementById("updateTA").reportValidity();
		return;
	} else {
		document.getElementById("updateTA").setCustomValidity("");
	}

	console.log(
		`Updating card with ID ${currentCardId} for user ${currentUserId}. \nNew Title: ${newTitle}, New Completed Status: ${newCompleted}`
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
			// Make a PUT request to update the card on the server
			fetch(
				`https://cardsapi.netlify.app/.netlify/functions/api//cards/${currentCardId}`,
				{
					method: "PUT",
					body: JSON.stringify({
						id: currentCardId,
						title: newTitle,
						userId: currentUserId,
						completed: newCompleted,
					}),
					headers: {
						"Content-Type": "application/json; charset=UTF-8",
					},
				}
			)
				.then((response) => response.json())
				.then((json) => console.log("Card updated:", json))
				.catch((error) => console.error("Error updating card:", error));
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
	document.getElementById("updatePopup").classList.remove("show");
});
//cancel form
document.getElementById("closeFormBtn").addEventListener("click", () => {
	document.getElementById("formPopup").classList.remove("show");
});
// Clear button event
const clearBtn = document.getElementById("clear");

clearBtn.addEventListener("click", () => {
	clearCards();
	searching = false;
	const dataChooser = document.getElementById("dataType");
	const completedChooser = document.getElementById("filterCompleted");
	const searchBar = document.getElementById("searchBar");
	dataChooser.value = "number";
	updateSuggestions();
	completedChooser.value = "both";
	searchBar.value = "";
	currentUser = null;
});

function clearCards() {
	const allUserContainers = document.querySelectorAll(".container");
	allUserContainers.forEach((container) => {
		container.classList.remove("show");
	});

	// Clear the search results
	const searchResultsContainer = document.getElementById("searchResults");
	searchResultsContainer.classList.remove("show");
	const searchData = document.getElementById("searchData");
}
var filteredCards = [];
document.getElementById("searchBtn").addEventListener("click", () => {
	const searchBar = document.getElementById("searchBar");
	const searchText = searchBar.value.trim().toLowerCase();
	const dataType = document.getElementById("dataType").value;

	// Check if the dataType is "number" and validate the input
	if (dataType === "number" && searchText) {
		const parsedSearchText = parseInt(searchText, 10);
		if (isNaN(parsedSearchText) || searchText === "") {
			searchBar.setCustomValidity("Please enter a valid number.");
			searchBar.reportValidity();
			return;
		} else {
			searchBar.setCustomValidity(""); // Clear any previous custom validity
		}
	}
	search();
});
function search() {
	searching = true;
	clearCards();
	filteredCards = [];

	const searchText = document
		.getElementById("searchBar")
		.value.trim()
		.toLowerCase();

	const dataType = document.getElementById("dataType").value;
	const usersFilter = document.getElementById("filterUsers").value;
	const completedFilter = document.getElementById("filterCompleted").value;

	let getCards = allCards;
	document.getElementById("filterUsers").setCustomValidity("");
	//if the user chose current and he didn't view any cards yet show the validity
	if (usersFilter === "current" && currentUser === null) {
		document
			.getElementById("filterUsers")
			.setCustomValidity("Please choose a user first");
		document.getElementById("filterUsers").reportValidity();
		return;
	} else if (usersFilter === "current" && currentUser !== null) {
		getCards = currentUser.htmlCards;
	}

	// Filter based on completed status
	if (completedFilter !== "both") {
		const isCompleted = completedFilter === "true";
		getCards = getCards.filter((card) => {
			const checkbox = card.querySelector("input[type='checkbox']");
			return checkbox && checkbox.checked === isCompleted;
		});
	}

	filteredCards = getCards.filter((card) => {
		const cardTitle = card.querySelector(".para").value.toLowerCase();
		const cardId = card.id.split("-").pop();

		if (dataType === "text") {
			return cardTitle && cardTitle.includes(searchText);
		} else if (dataType === "number") {
			return cardId && cardId.includes(searchText);
		} else {
			return false;
		}
	});

	updateSearchData(filteredCards);
}

function updateSearchData(cards) {
	allCards.forEach((card) => card.classList.add("hidden"));
	const searchResultsContainer = document.getElementById("searchResults");
	searchResultsContainer.classList.remove("show");
	const notFound = document.getElementById("notFound");
	notFound.classList.remove("show");
	const allUserContainers = document.querySelectorAll(".container");
	allUserContainers.forEach((container) =>
		container.classList.remove("show")
	);

	if (cards.length === 0) {
		// Show the "not found" message if no cards match

		searchResultsContainer.classList.add("show");

		notFound.classList.add("show");
	} else {
		cards.forEach((card) => {
			card.classList.remove("hidden");

			// Get the user container for the card and ensure it's shown
			const cardId = card.id.split("-").pop(); // Extract card ID
			const userId = card.id.split("-")[1]; // Extract user ID
			const userContainer = document.getElementById(`cont-${userId}`);

			if (userContainer) {
				userContainer.classList.add("show");
			}
		});

		// Show the main cards container
		const cardsContainer = document.getElementById("cards-container");
		cardsContainer.classList.add("show");
	}
}

const selectCompleted = document.getElementById("filterCompleted");

selectCompleted.addEventListener("change", (event) => {
	search();
});

//for suggestions

function updateSuggestions() {
	const datalist = document.getElementById("optionsList");
	datalist.innerHTML = ""; // Clear existing options

	const dataType = document.getElementById("dataType").value;
	const usersFilter = document.getElementById("filterUsers").value;
	const userInput = document.getElementById("searchBar").value.toLowerCase();
	// Use a Set to track unique values
	const uniqueValues = new Set();

	let getCards = allCards;
	if (usersFilter === "current" && currentUser !== null) {
		getCards = currentUser.htmlCards;
	} else if (usersFilter === "current" && currentUser === null) {
		getCards = [];
	}

	getCards.forEach((card) => {
		let value;
		if (dataType === "text") {
			// Extract the title from the card's text area
			const titleElement = card.querySelector(".para");
			if (titleElement) {
				value = titleElement.value.trim().toLowerCase();
			}
		} else if (dataType === "number") {
			const cardId = card.id.split("-").pop(); // card ID is the last part of the ID attribute
			value = cardId;
		}

		// Only add option if value contains userInput and is not already in the Set
		if (value && value.includes(userInput) && !uniqueValues.has(value)) {
			uniqueValues.add(value);
			const option = document.createElement("option");
			option.value = value;
			datalist.appendChild(option);
		}
	});
}
