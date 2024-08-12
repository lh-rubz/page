var currPos = 1;
//HTML elements
let imgContainer = document.getElementById("container");
let rightArrow = document.getElementById("right");
let leftArrow = document.getElementById("left");
let pageInfo = document.getElementById("pageInfo");

// Function to update the styles
const updateStyles = () => {
	imgContainer.style.backgroundImage = `url('assets/cat${currPos}.jpg')`;
	updateArrowCursor();
	// Update the page info text
	pageInfo.innerHTML = `${currPos}/4`;
};

// Function to update the cursor based on the current position
function updateArrowCursor() {
	leftArrow.style.cursor = currPos === 1 ? "not-allowed" : "pointer";
	rightArrow.style.cursor = currPos === 4 ? "not-allowed" : "pointer";
}

updateStyles();

// Handle the left arrow click event
leftArrow.onclick = () => {
	if (currPos > 1) {
		currPos--;
		updateStyles();
	}
};

// Handle the right arrow click event
rightArrow.onclick = () => {
	//since there's 4 images
	if (currPos < 4) {
		currPos++;
		updateStyles();
	}
};
