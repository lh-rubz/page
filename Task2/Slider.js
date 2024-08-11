const images = ["cat1", "cat2", "cat3", "cat4"];
let currPos = 0;

let imgContainer = document.getElementById("container");
let rightArrow = document.getElementById("rightArrow");
let leftArrow = document.getElementById("leftArrow");
let pageInfo = document.getElementById("pageInfo");

const updateStyles = () => {
	imgContainer.style.backgroundImage = `url('assets/${images[currPos]}.jpg')`;

	// Update cursor styles based on the current position
	if (currPos === 0) {
		leftArrow.style.cursor = "not-allowed";
	} else {
		leftArrow.style.cursor = "pointer";
	}

	if (currPos === images.length - 1) {
		rightArrow.style.cursor = "not-allowed";
	} else {
		rightArrow.style.cursor = "pointer";
	}
	pageInfo.innerHTML = currPos + 1 + "/" + images.length;
};

// Initialize styles
updateStyles();

leftArrow.onclick = () => {
	if (currPos > 0) {
		currPos--;
		updateStyles();
	}
};

rightArrow.onclick = () => {
	if (currPos < images.length - 1) {
		currPos++;
		updateStyles();
	}
};
