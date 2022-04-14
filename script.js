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
        "(": 4, "#": 4
    };
    const inComingPriority = {
        "(": 0,
        "^": 1,
        "*": 2, "x": 2, "/": 2,
        "+": 3, "-": 3,
        "#": 4
    };

    for (let i = 0; i < infix.length; i++) {
        var ch = infix[i];
        if (ch == "(" || ch == "^") {
            stack.push(ch);
        }
        else if (ch == ")") {
            while (stack.length && stack[stack.length - 1] != "(") {
                postfix += stack[stack.length - 1];
                stack.pop();
            }
        }
    }
    return postfix;
}

function evaluatePostfix(postfix) { // not finished yet
    return 0;
}

/* 
Example:
inpfix = A/B-C+D*E-A*C
postfix = AB/C-DE*+AC*-
*/