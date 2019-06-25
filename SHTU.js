var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var blockSize = 10;
var width, height;
var nearPlatform;
var theBestScore = 0;
var theBestScoreFunc = null;
var file = fetch("/jf.json");
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

    if (typeof nearPlatform === 'undefined' && player.dy != 0) alert('your score: ' + score);

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



createPlatforms(height / 5 - 5);
player.dy = 1;
setInterval(function () {
    ctx.clearRect(0, 0, width * blockSize, height * blockSize);
    drawField();
    drawPlatforms();
    drawHeader();
    nuznoLiNaprigatsa();
    player.draw();
    player.move();
    drawScore();
}, 100);

var actions = {
    37: "left",
    39: "right",
    13: "enter"
};

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
            break;
    }
});