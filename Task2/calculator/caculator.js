let num1 = document.getElementById("num1");
let num2 = document.getElementById("num2");
let result = document.getElementById("result");
let errorMsg = document.getElementById("errorMsg");
function clearMethod() {
	num1.value = "";
	num2.value = "";
	result.value = "";
	clearStyles();
}
//clears any styles
function clearStyles() {
	result.style.visibility = "hidden";
	errorMsg.style.display = "none";
	num2.style.borderBlockColor = "black";
	num1.style.borderBlockColor = "black";
}
//function to calculate the values
function calc() {
	try {
		clearStyles();
		let value1 = parseFloat(num1.value);
		let value2 = parseFloat(num2.value);
		let operator = document.querySelector(
			'input[name="operators"]:checked'
		).value;
		if (isNaN(value1) || isNaN(value2)) {
			//if not a number
			throw new Error("Please , Enter correct numbers !!");
		}
		let calculation;
		switch (operator) {
			case "+":
				calculation = value1 + value2;
				break;
			case "-":
				calculation = value1 - value2;
				break;
			case "*":
				calculation = value1 * value2;
				break;
			case "/":
				calculation = value1 / value2;
				break;
		}

		result.value = calculation;
		result.style.visibility = "visible";
	} catch (error) {
		result.style.visibility = "hidden";
		num1.style.borderBlockColor = "red";
		num2.style.borderBlockColor = "red";
		errorMsg.innerHTML = error;
		errorMsg.style.display = "block";
	}
}
