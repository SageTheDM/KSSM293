// BMI calculator
function calculateBMI(weight, height) {
    if (height <= 0) {
        return 0; // Prevent division by zero
    }
    return (weight / (height * height)).toFixed(2); // Calculate BMI and round to 2 decimal places
}
function compareBMI() {
    let result = "";
    const name1 = document.getElementById('name1').value;
    const weight1 = document.getElementById('weight1').value;
    const height1 = document.getElementById('height1').value;

    const name2 = document.getElementById('name2').value;
    const weight2 = document.getElementById('weight2').value;
    const height2 = document.getElementById('height2').value;

    const bmi1 = calculateBMI(weight1, height1);
    const bmi2 = calculateBMI(weight2, height2);

    if (bmi1 > bmi2){
        result = "Der BMI von " + name1 + " ist höher als der BMI von " + name2;
    } else if(bmi2 > bmi1){
        result = "Der BMI von " + name2 + " ist höher als der BMI von " + name1;
    } else {
        result = "Der BMI von " + name2 + " ist gleich wie gross der BMI von " + name1;
    }

    let resultMessage = name1 + "\n" + height1 + "\n" +weight1 + "\n" + bmi1 + "\n" + "\n" + 
    name2 + "\n" + height2 + "\n" +weight2 + "\n" + bmi2 + "\n" + "\n" + result;
     // Display the result
     document.getElementById('result').innerHTML = resultMessage.replace(/\n/g, '<br>');
}