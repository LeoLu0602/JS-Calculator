class complexNumber {
    constructor(num) {
        if (num.search("i") == -1) { // num is real
            this.Re = parseFloat(num);
            this.Im = 0;
        }
        if (num.search("i") != -1) { // num is not real
            if (num == "i") {
                this.Re = 0;
                this.Im = 1;
            }
            if (num == "-i") {
                this.Re = 0;
                this.Im = -1;
            }
            if (num != "i" && num != "-i") {
                this.Re = 0;
                this.Im = parseFloat(num.slice(0, num.length - 1));
            }
        }
    }

    pow(num) {
        const result = new complexNumber("0");
        if (this.Im == 0 && num.Im == 0) {
            result.Re = Math.pow(this.Re, num.Re);
        }
        return result  
    }

    add(num) {
        const result = new complexNumber("0");
        result.Re = this.Re + num.Re;
        result.Im = this.Im + num.Im;
        return result;
    }

    sub(num) {
        const result = new complexNumber("0");
        result.Re = this.Re - num.Re;
        result.Im = this.Im - num.Im;
        return result;
    }

    mul(num) {
        const result = new complexNumber("0");
        result.Re = this.Re * num.Re - this.Im * num.Im;
        result.Im = this.Re * num.Im + this.Im * num.Re;
        return result;
    }

    div(num) {
        const result = new complexNumber("0");
        result.Re = (this.Re * num.Re + this.Im * num.Im) / (num.Re * num.Re + num.Im * num.Im);
        result.Im = ((-1) * this.Re * num.Im + this.Im * num.Re) / (num.Re * num.Re + num.Im * num.Im);
        return result;
    }

    conj() {
        const result = new complexNumber("0");
        result.Re = this.Re;
        result.Im = (-1) * this.Im;
        return result;
    }
}

function userClick() {
    let textOnBtn = document.getElementById("calculateBtn").innerHTML;
    
    if (textOnBtn == "Calculate") {
        let ans = "Ans: ";
        let inputData = document.getElementById("inputData").value;
        let outputData = calculate(inputData);
        ans += outputData;
        document.getElementById("ans").innerHTML = ans;
    
        historyArray.push(inputData + " = " + ans.slice(5));
        if (document.getElementById("historyBtn").innerHTML == "Hide History") {
            showHistory();
        }

        document.getElementById("calculateBtn").innerHTML = "Clear";
    }
    else if (textOnBtn == "Clear") {
        document.getElementById("inputData").value = "";
        document.getElementById("ans").innerHTML = "Ans:";
        document.getElementById("calculateBtn").innerHTML = "Calculate";
    }
}

function calculate(inputData) {
    let postfix = infixToPostfix(inputData);
    console.log(postfix); // for testing
    return evaluatePostfix(postfix);
}

function infixToPostfix(inputData) { 
    let infix = []; // note that inputData is a string
    let postfix = "";
    let stack = ["#"];
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
    };
    const num = new Set(["0","1","2","3","4","5","6","7","8","9",".", "N", "i"]);
    for (let i = 0; i < inputData.length; i++) {
        infix.push(inputData[i]);
        if (i + 1 < inputData.length) {
            if (inputData[i] == ")" && inputData[i + 1] == "(") {
                infix.push("x");
            }
        }
    }
    for (let i = 0; i < infix.length; i++) {
        var inComing = infix[i];
        if (inComing == "-" && (i == 0 || infix[i - 1] == "(")) {
            postfix += "[" + inComing;
            infix[i] = "N";
        }
        else if (num.has(inComing)) {
            let left = false;
            let right = false;
            if (i - 1 >= 0) {
                left = num.has(infix[i - 1]);
            }
            if (i + 1 <= infix.length - 1) {
                right = num.has(infix[i + 1]);
            }
            if (!left && !right) {
                postfix += "[" + inComing + "]";
            }
            if (left && !right) {
                postfix += inComing + "]";
            }
            if (!left && right) {
                postfix += "[" + inComing;
            }
            if (left && right) {
                postfix += inComing;
            }
        } 
        else if (inComing == ")") {
            while (stack[stack.length - 1] != "(") {
                postfix += stack[stack.length - 1];
                stack.pop();    
            }
            stack.pop(); // pop "("
        }
        else if (inComingPriority[inComing] >= inStackPriority[stack[stack.length - 1]]) {
            while (inComingPriority[inComing] >= inStackPriority[stack[stack.length - 1]]) {
                postfix += stack[stack.length - 1];
                stack.pop();
            }
            stack.push(inComing);
        }
        else if (inComingPriority[inComing] < inStackPriority[stack[stack.length - 1]]) {
            stack.push(inComing);
        }
    }
    while (stack.length > 1) {
        postfix += stack[stack.length - 1];
        stack.pop();
    }
    return postfix;
}

function evaluatePostfix(postfix) {
    const order = [];
    const stack = [];
    for (let i = 0; i < postfix.length; i++) {
        var ch = postfix[i];
        if (ch != "[") {
            order.push(ch);
        }        
        if (ch == "[") {
            var tmp = "";
            i++;
            while (postfix[i] != "]") {
                tmp += postfix[i];
                i++;
            }
            var tmpComplexNumber = new complexNumber(tmp);
            order.push(tmpComplexNumber);
        }
    }

    for (let i = 0; i < order.length; i++) {
        var inComing = order[i];
        var type = typeof(inComing);
        if (type == "object") {
            stack.push(inComing);
        }
        if (type != "object") {
            var op2 = stack[stack.length - 1];
            stack.pop();
            var op1 = stack[stack.length - 1];
            stack.pop();

            if (inComing == "^") {
                stack.push(op1.pow(op2));
            }
            if (inComing == "+") {
                stack.push(op1.add(op2));
            }
            if (inComing == "-") {
                stack.push(op1.sub(op2));
            }
            if (inComing == "*" || inComing == "x") {
                stack.push(op1.mul(op2));
            }
            if (inComing == "/") {
                stack.push(op1.div(op2));
            }
        }
    }

    let ans = "";
    if (stack[0].Re != 0 && stack[0].Im != 0) {
        ans += stack[0].Re.toString();
        if (stack[0].Im == 1) {
            ans += "+i";
        }
        if (stack[0].Im == -1) {
            ans += "-i"
        }
        if (stack[0].Im != 1 && stack[0].Im != -1) {
            if (stack[0].Im > 0) {
                ans += "+"
            }
            ans += stack[0].Im.toString() + "i";
        }
    }
    if (stack[0].Re != 0 && stack[0].Im == 0) {
        ans += stack[0].Re.toString();
    }
    if (stack[0].Re == 0 && stack[0].Im != 0) {
        if (stack[0].Im == 1) {
            ans += "i";
        }
        if (stack[0].Im == -1) {
            ans += "-i"
        }
        if (stack[0].Im != 1 && stack[0].Im != -1) {
            if (stack[0].Im > 0) {
                ans += "+"
            }
            ans += stack[0].Im.toString() + "i";
        }
    }
    if (stack[0].Re == 0 && stack[0].Im == 0) {
        ans += "0";
    }
    return ans;
}

function history() {
    let textOnBtn = document.getElementById("historyBtn").innerHTML;
    
    if (textOnBtn == "Show History") {
        showHistory();
        textOnBtn = "Hide History";
    }
    else if (textOnBtn == "Hide History") {
        document.getElementById("history").innerHTML = "";
        textOnBtn = "Show History";
    }

    document.getElementById("historyBtn").innerHTML = textOnBtn;
}

function showHistory() {
    let history = "";

    if (historyArray.length == 0) {
        history = "No History"
    }
    else if (historyArray.length != 0) {
        for (let i = historyArray.length - 1; i >= 0; i--) {
            history += historyArray[i] + "<br>";
        }
    }

    document.getElementById("history").innerHTML = history;
}

function clearAllHistory() {
    while (historyArray.length) {
        historyArray.pop();
    }
    if (document.getElementById("historyBtn").innerHTML == "Hide History") {
        showHistory();
    }
}

const historyArray = [];