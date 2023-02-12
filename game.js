var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext("2d");

// var x = canvas.width/2;
// var y = canvas.height - 30;
var x = 225; // 동그라미 X 위치 (실시간으로 바뀜)
var y = 640; // 동그라미 Y 위치 (실시간으로 바뀜)
var move_x = -10;  // 이동거리 X
var move_y = -10;  // 이동거리 Y
var ballRadius = 10;  // 동그라미 반지름
var count = 0;  // 속도조절때 쓰이는 변수
var paddleWidth = 100; // 패틀 X 크기
var paddleHeight = 20; // 패들 Y 크기
var paddleX = (canvas.width - paddleWidth)/2;  // 패들 X 위치
var paddleY = 650;  // 패들 Y 위치
var rightbutton = false;
var leftbutton = false;
var brickRowCount = 3;  // 벽돌 가로로 몇개만큼 배치하기
var brickColumnCount = 5;  // 벽돌 세로로 몇개만큼 배치하기
var brickWidth = 74;  // 벽돌 x 크기
var brickHeight = 20;  // 벽돌 y 크기
var brickPadding = 5;  // 벽돌 간 사이간격 크기
var brickTop = 30;  //  벽돌 캔버스 닿지 않기 위해 상하 위치
var brickLeft = 30;  //  벽돌 캔버스 닿지 않기 위해 좌우 위치
var score = 0; // 스코어 설정

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1};
    }
}



document.addEventListener('keydown' , keyDownHandler , false);  // 키 눌렀을때
document.addEventListener('keyup' , keyUpHandler , false);  // 키 땠을때
document.addEventListener('mousedown' , mouseMoveHandler , false);  // 마우스를 누르고 이동시킬때


function keyDownHandler(e){
    // console.log(e.code);
    if(e.code == "ArrowRight"){
        rightbutton = true;
    }
    else if(e.code == "ArrowLeft"){
        leftbutton = true;
    }
}

function keyUpHandler(e){
    // console.log(e.code);
    if(e.code == "ArrowRight"){
        rightbutton = false;
    }
    else if(e.code == "ArrowLeft"){ 
        leftbutton = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }

    // console.log(e.clientX); // 마우스의 X 기준 위치
    // console.log(canvas.offsetLeft); // 캔버스와 바디 태그 사이
    document.addEventListener('mousemove' , function(e){
        console.log(e.clientX);
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
            // console.log(paddleX);
        }
    })
}


function collisionDetection() {  // 공이 벽돌에 닿았을때 유효성 체크 후 없애기
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status === 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    move_y = -move_y;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}



function drawScore() {  // 스코어 그리기
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawBall(){  // 동그라미 그리기
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,255,0,1)";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){  // 패들 그리기
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(paddleX , paddleY , paddleWidth , paddleHeight);
    ctx.closePath();
}

function drawBricks() {   //벽돌 그리기
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status === 1){
                var brickX = (c*(brickWidth+brickPadding))+brickLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.fillStyle = "rgba(100,250,200,1)";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                ctx.closePath();
            }
        }
    }
}



function draw(){  // 캔버스 전체적으로 그리기
    if(count % 2 === 0){  // LIVE 라이브
        ctx.clearRect(0 , 0 , canvas.width , canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        drawScore();
        x += move_x;
        y += move_y;
    }
    count ++;

    if(x + move_x < ballRadius || x + move_x > canvas.width - ballRadius){  // 양 옆 벽에 닿았을때 반대편으로 튕겨주기
        move_x = -move_x;
    }

    if(y + move_y < ballRadius){  //  위에 벽 닿았을때 반대편으로 튕겨주기
        move_y = -move_y;
    }else if(y + move_y + ballRadius/2 > paddleY){ // 밑에 벽 닿았을때
        if(x > paddleX && x < paddleX + paddleWidth){  // 패들에 닿았으면 반대편으로 튕겨주기
            move_y = -move_y;
        }else{ //  패들에 닿지않고 밑에 벽에 닿았으면 실패
            // alert(y)
            console.log('실패했을시');
            document.location.reload();
        }
    }

    if(rightbutton && paddleX < canvas.width - paddleWidth){  // 키보드 오른쪽 키 눌렀을때 이동시키기
        paddleX += 7;
    }else if(leftbutton && paddleX > 0){  // 키보드 왼쪽 키 눌었을때 이동시키기
        paddleX -= 7;
    }
    requestAnimationFrame(draw);
    // if(x === 200){ // 애니메이션 멈추거나 진행
    //     console.log('ㅎㅇ')
    //     cancelAnimationFrame(requestAnimationFrame(draw));
    // }else{
    //     requestAnimationFrame(draw);
    // }
}

draw();