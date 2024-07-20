let prevNum = 1;
let curNum = 1;

function bigger() {
    let nextNum = curNum + prevNum;
    prevNum = curNum;
    curNum = nextNum;
    updateHtmlVal(curNum);
}

function smaller() {
    let prevPrevNum = curNum - prevNum;
    curNum = prevNum;
    prevNum = prevPrevNum;
    updateHtmlVal(curNum);
}

function updateHtmlVal(val) {
    document.getElementById("fib_val").innerText = val;
}
