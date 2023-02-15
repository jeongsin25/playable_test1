var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext("2d");

// var x = canvas.width/2;
// var y = canvas.height - 30;
var x = 215; // 동그라미 X 위치 (실시간으로 바뀜)
var y = 630; // 동그라미 Y 위치 (실시간으로 바뀜)
var move_x = -4;  // 이동거리 X
var move_y = -4;  // 이동거리 Y
var ballWidth = 20; // 공 X 크기
var ballHeight = 20; // 공 Y 크기
var count = 0;  // 속도조절때 쓰이는 변수
var paddleWidth = 100; // 패틀 X 크기
var paddleHeight = 20; // 패들 Y 크기
var paddleX = (canvas.width - paddleWidth)/2;  // 패들 X 위치
var paddleY = 650;  // 패들 Y 위치
var rightbutton = false;
var leftbutton = false;
var brickRowCount = 5;  // 벽돌 가로로 몇개만큼 배치하기
var brickColumnCount = 10;  // 벽돌 세로로 몇개만큼 배치하기
var brickWidth = 40;  // 벽돌 x 크기
var brickHeight = 20;  // 벽돌 y 크기
var brickPadding = 0;  // 벽돌 간 사이간격 크기
var brickTop = 30;  //  벽돌 캔버스 닿지 않기 위해 상하 위치
var brickLeft = 25;  //  벽돌 캔버스 닿지 않기 위해 좌우 위치
var score = 0; // 스코어 설정

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1};
    }
}

var touchcheck = false;

document.addEventListener('keydown' , keyDownHandler , false);  // 키보드 키 눌렀을때
document.addEventListener('keyup' , keyUpHandler , false);  // 키보드 키 땠을때
document.addEventListener('mousedown' , mouseDownHandler , false);  // 마우스 첫 터치했을때
document.addEventListener('mousemove' , mouseMoveHandler , false);  // 마우스 터치 후 움직일때
document.addEventListener('mouseup' , mouseUpHandler , false);  // 마우스 터치 끝낼때
document.addEventListener('touchstart' , touchstart , false);  // 모바일 환경에서 첫 터치했을때
document.addEventListener('touchmove' , touchmove , false);  // 모바일 환경에서 터치 후 움직일때

function keyDownHandler(e){  // 키보드 키 눌렀을때
    // console.log(e.code);
    if(e.code == "ArrowRight"){
        rightbutton = true;
    }
    else if(e.code == "ArrowLeft"){
        leftbutton = true;
    }
}
function keyUpHandler(e){  // 키보드 키 땠을때
    // console.log(e.code);
    if(e.code == "ArrowRight"){
        rightbutton = false;
    }
    else if(e.code == "ArrowLeft"){ 
        leftbutton = false;
    }
}

function mouseDownHandler(e) {  // 마우스 첫 터치했을때
    touchcheck = true;
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function mouseMoveHandler(e) {  // 마우스 터치 후 움직일때
    if(touchcheck){
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
    }
}
function mouseUpHandler(e) {  // 마우스 터치를 끝냈을때
    touchcheck = false;
}


function touchstart(e){  // 모바일 환경에서 첫 터치했을때
    console.log(e.touches[0].clientX - canvas.offsetLeft)
    var relativeX = e.touches[0].clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function touchmove(e){  // 모바일 환경에서 터치 후 움직일때
    var relativeX = e.touches[0].clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
    console.log(paddleX);
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
    var ball_img = new Image();
    ball_img.src = '이미지/ball.png';
    ctx.drawImage(ball_img , x , y ,ballWidth , ballHeight)
}

function drawPaddle(){  // 패들 그리기
    var paddle_img = new Image();   // Create new img element
    paddle_img.src = '이미지/paddle.png'
    ctx.drawImage(paddle_img , paddleX , paddleY , paddleWidth , paddleHeight);
}

function drawBricks() {   // 벽돌 그리기
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status === 1){
                var brickX = (c*(brickWidth+brickPadding))+brickLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                var brick_img = new Image();
                brick_img.src = '이미지/벽돌/brick_1.png';
                ctx.drawImage(brick_img , brickX , brickY , brickWidth , brickHeight);

                // ctx.beginPath();
                // ctx.fillStyle = "rgba(100,250,200,1)";
                // ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                // ctx.closePath();
            }
        }
    }
}

function draw_canvas_bg_black(){ // 배경 밝기 조절
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0 , 0 , canvas.width , canvas.height);
    ctx.closePath();
}



function draw(){  // 캔버스 전체적으로 그리기
    // console.log(y);
    if(count %1 === 0){  // LIVE 라이브
        ctx.clearRect(0 , 0 , canvas.width , canvas.height);
        draw_canvas_bg_black();
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        drawScore();
        x += move_x;
        y += move_y;
    }
    count ++;

    if(x < 0 || x > canvas.width - ballWidth){  // 양 옆 벽에 닿았을때 반대편으로 튕겨주기
        move_x = -move_x;
    }

    if(y < 0){  //  위에 벽 닿았을때 반대편으로 튕겨주기
        move_y = -move_y;
    }
    if(y === paddleY - ballHeight && x > paddleX - ballWidth && x < paddleX + paddleWidth + ballWidth){ // 패들에 닿았으면 반대편으로 튕겨주기
            move_y = -move_y;
        }
    else if(y + move_y > paddleY){ //  패들에 닿지않고 밑에 벽에 닿았으면 실패
        // alert(y);
        console.log('실패했을시');
        document.location.reload();
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