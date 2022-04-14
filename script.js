function userClick() {
    let ans = "Ans: ";
    let inputData = document.getElementById("inputData").value;
    let outputData = calculate(inputData);
    ans += outputData;
    document.getElementById("ans").innerHTML = ans;
}

function calculate(inputData) {
    let postfix = infixToPostfix(inputData);
    console.log(postfix); // for testing
    return evaluatePostfix(postfix).toString();
}

function infixToPostfix(infix) { // not finished yet
    let postfix = "";
    let stack = ['#'];
    const inStackPriority = {
        "^": 1,
        "*": 2, "x": 2, "/": 2,
        "+": 3, "-": 3,
        "(": 4, "#": 4, ")": 4
    };
    const inComingPriority = {
        "(": 0,
        "^": 1,
        "*": 2, "x": 2, "/": 2,
        "+": 3, "-": 3,
        "#": 4, ")": 4
    };

    for (let i = 0; i < infix.length; i++) {
        var ch = infix[i];
        if (inComingPriority[ch] < inStackPriority[stack[stack.length - 1]]) {
            stack.push(ch);
        }
        else {
            
        }
    }
    return postfix;
}

function evaluatePostfix(postfix) { // not finished yet
    return 0;
}