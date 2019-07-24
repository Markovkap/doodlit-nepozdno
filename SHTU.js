var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var blockSize = 10;
var width, height;
var nearPlatform;
// var whenKill
var theBestScore = 0;
var zapusk = false;
var zapuskEnter = true;
var pause = 1;
var endForPause = false;

var theBestScoreFunc = null;
var myHeaders = new Headers();
myHeaders.append('pragma', 'no-cache');
myHeaders.append('cache-control', 'no-cache');

var myInit = {
    method: 'GET',
    headers: myHeaders,
};
var file = fetch("/jf.json", myInit);
file.then(function (respons) {
        return respons.json();
    })
    .then(function (file) {
        theBestScore = file.record;
        theBestScoreFunc = function (canvasContext) {
            canvasContext.textAlign = "right";
            canvasContext.textBaseline = "top";
            canvasContext.fillText("The best: " + theBestScore, width * blockSize - 10, 15);
        };
    })
    .catch(alert);
width = 60;
height = Math.floor(window.innerHeight / blockSize);
canvas.width = width * blockSize;
canvas.height = height * blockSize;
var score = 0;
var platformi = [new Platform(width / 2 - 2, height - 5)];

function Platform(x, y) {
    this.x = x;
    this.y = y;
}
var player = {
    x: width / 2 - 1,
    y: height - 10,
    prizok: 15,
    dy: 0,
    draw: function () {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x * blockSize, this.y * blockSize, 30, 30);
    },
    move: function () {
        if (this.dy < 0) {
            this.prizok--;
        }
        if (this.prizok == 0) {
            this.dy = 1;
            this.prizok = 15;
        }
        this.y += this.dy;
    }
}


function drawField() {
    ctx.fillStyle = "#f0ece3";
    ctx.fillRect(0, 0, width * blockSize, height * blockSize);
    ctx.strokeStyle = "#ebded5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < height; i++) {
        ctx.moveTo(0, i * blockSize);
        ctx.lineTo(width * blockSize, i * blockSize);
    }
    for (var a = 0; a < height; a++) {
        ctx.moveTo(a * blockSize, 0);
        ctx.lineTo(a * blockSize, height * blockSize);
    }
    ctx.stroke();
}

function drawHeader() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(165,183,195,0.7)";
    ctx.fillRect(0, 0, width * blockSize, 5 * blockSize);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(0, 5 * blockSize);
    ctx.lineTo(width * blockSize, 5 * blockSize);
    ctx.stroke();
}

function drawScore() {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(score, 10, 15);
    if (theBestScoreFunc) theBestScoreFunc(ctx);
}

function nuznoLiNaprigatsa() {
    nearPlatform = platformi.filter(function (platform) {
        return platform.y > player.y && platform.y < player.y + 5 * blockSize;
    })[0];

    if (typeof nearPlatform === 'undefined' && player.dy != 0) {
        clearInterval(f);
        endForPause = true;
        neNaprigaisia("Потрачено",100);
        ctx.font = "50px Comic Sans MS";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("your score: "+score , width / 2 * 10, height / 2 * 10+100);
    }

    if (nearPlatform.y + 1 == player.y + 4 && (player.x + 2 >= nearPlatform.x && player.x <= nearPlatform.x + 4)) {
        player.dy = -1;
        score += 5;
    }
}

function createPlatforms(count) {
    for (var i = 0; i < count; i++) {
        platformi.unshift(new Platform(randomInteger(7, width - 7), platformi[0].y - 5));
    }
}

function drawPlatforms() {
    ctx.fillStyle = "green";
    for (var i = 0; i < platformi.length; i++) {
        ctx.fillRect(platformi[i].x * blockSize, platformi[i].y * blockSize, 50, 10);
    }
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}


function drawStartButton() {
    var w2 = width / 2 * 10;
    var h2 = height / 2 * 10;
    ctx.fillStyle = "yellow";
    ctx.fillRect(w2 - 75, h2 - 75, 140, 150);
    ctx.beginPath();
    ctx.moveTo(w2 - 50, h2 - 50);
    ctx.lineTo(w2 + 50, h2);
    ctx.lineTo(w2 - 50, h2 + 50);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "green";
    ctx.fill();
    return {
        x0: w2 - 75,
        y0: h2 - 75,
        x1: w2 + 65,
        y1: h2 + 75
    }
}
var b = drawStartButton();
var f = null;

function golovoreziPlatform(){
    for(var i = 0; i < platformi.length; i++){
        platformi[i].y++; 
    }
    player.y+=2;
}

function startGame() {
    if (zapusk) {
        f = setInterval(function () {
            ctx.clearRect(0, 0, width * blockSize, height * blockSize);
            drawField();
            drawPlatforms();
            drawHeader();
            nuznoLiNaprigatsa();
            player.draw();
            player.move();
            drawScore();
            console.log(player.y);
            if(player.y+3<=height/2){
                golovoreziPlatform()
            }
        }, 100);
    }
}

createPlatforms(height / 5 - 5);
player.dy = 1;

var actions = {
    37: "left",
    39: "right",
    13: "enter",
    27: "esc"
};

function neNaprigaisia(text,size){
    ctx.font = size + "px Comic Sans MS";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text , width / 2 * 10, height / 2 * 10);
}

$("body").keydown(function (event) {
    switch (actions[event.keyCode]) {
        case "left":
            player.x += -1;
            if (player.x < 0) {
                player.x = 0;
            }
            break;
        case "right":
            player.x += 1;
            if (player.x + 3 > width) {
                player.x = width - 3;
            }
            break;
        case "enter":
            if (zapuskEnter) {
                zapuskEnter = false;
                zapusk = true;
                startGame();
            }
            break;
        case "esc":
            if (endForPause) return false;
            zapusk = !zapusk;
            clearInterval(f);
            neNaprigaisia("pause",100);
            startGame();
            break;
    }
});


//report the mouse position on click
canvas.addEventListener("click", function (evt) {
    if (!zapuskEnter) return false;
    var mousePos = getMousePos(canvas, evt);
    if ((mousePos.x >= b.x0) && (mousePos.x <= b.x1) && (mousePos.y >= b.y0) && (mousePos.y <= b.y1)) {
        zapuskEnter = false;
        zapusk = true;
        startGame();
    }
}, false);

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}