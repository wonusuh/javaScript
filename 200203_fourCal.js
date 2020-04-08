// 환경설정
var env = {
    btns: [], // 버튼이 등록되는 배열
    inKeys: [],
    calcHist: [],
    resultEval: null,
    alert: {
        syntaxError: "수식을 확인해 주세요.",
        emptyText: "수식이 비어 있습니다."
    }
}

// 버튼 생성자 함수
function Btn(el, type, key) {
    this.el = el;
    this.type = type;
    this.key = key;

    // 생성과 동시에 클릭이벤트를 부여
    var a = this.el;
    a.onclick = this.clickKey.bind(this);
}

Btn.prototype.getObj = function () {
    console.log(this);
    return this;
}

Btn.prototype.clickKey = function () {
    // inKeys에 값을 추가
    switch(this.type) {
        case "fnc":
            if(this.key === "=") this.calcInKeys();
            if(this.key === "clr") this.clear();
            break;
        default:
            if(env.resultEval !== null) {
                var old = env.resultEval;
                this.clear();
                if(this.type === "sgn") {
                    env.inKeys.push(old);
                }
            }
            env.inKeys.push(this.key);
            //
    }
    // 클릭할때마다 호출되는 함수들
    this.dispInKeys(); // 화면에 입력양식을 출력
    this.dispCalcHist(); // 화면에 입력양식을 출력
}

Btn.prototype.dispInKeys = function () {
    var content = env.inKeys.join("");
    env.dispExpr.innerHTML = content;
}

Btn.prototype.dispCalcHist = function () {
    var content = env.calcHist.join("<br>");
    env.dispHist.innerHTML = content;
}

Btn.prototype.calcInKeys = function () {
    var mathExp;
    try {
        mathExp = env.inKeys.join("");
        if (mathExp === "") throw env.alert.emptyText;
        env.resultEval = eval(mathExp);
        env.dispRslt.innerHTML = env.resultEval;
        this.saveHist(mathExp);
        this.saveHist(env.resultEval);
    } catch(err) {
        if(err.name === "SyntaxError") {
            env.dispAlert.innerHTML = "[주의]"+env.alert.syntaxError;
        } else {
            env.dispAlert.innerHTML = "[주의]"+ err;
        }
    }
}

Btn.prototype.clear = function () {
    env.inKeys = [];
    // calcInKeys를 처리하는 경우 alert가 발생하므로 바로 처리
    env.resultEval = null;
    env.dispRslt.innerHTML = "";
}

Btn.prototype.saveHist = function (txtMath) {
    env.calcHist.push(txtMath);
}

// 버튼을 객체를 만들고 btns 배열에 등록
function createBtns() {
    var btns = document.querySelectorAll('a[class^="btn_"]');
    for (var idx in btns) {
        var obj = btns[idx];
        if(obj.nodeName === 'A') {
            // console.log(obj);
            var el = new Btn(obj, obj.dataset.type, obj.dataset.key);
            // el.init();
            env.btns.push(el);
        }
    }
}

onload = function () {
    console.log("문서가 준비됨")
    createBtns();
    env.dispExpr = document.querySelector(".disp_Expr");
    env.dispRslt = document.querySelector(".disp_Rslt");
    env.dispAlert = document.querySelector(".disp_Alert");
    env.dispHist = document.querySelector(".disp_hist");
}
