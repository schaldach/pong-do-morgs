let distance = screen.width/90
let angle = 0
let ball = {
    x: screen.width/2,
    y: screen.height/2
}
let player1 = {
    x: 10,
    y: screen.height/2-75
}
let player2 = {
    x: screen.width-10,
    y: screen.height/2-75
}
let horizontalControl = 1
let verticalControl = 1
let gameplaying = false
let timeout = false
let p1move = false
let p2move = false
let playermoved = false
let timeinterval
let myCanvas
let startButton
let p1Score = 0
let p2Score = 0
let selectMode
let fullScreen
let page
let imgdiv
let gameMode
let isFull = false

function setup(){
    myCanvas = createCanvas(screen.width,screen.height)
    myCanvas.parent('page')
    background("#000000")
    myCanvas.position(0,0,"fixed")
    fill(255)
    textSize(14)
    text('patch 1.2', 5, 15)
    startButton = createButton("Start")
    startButton.position(screen.width/2-60, screen.height/2-30)
    startButton.mousePressed(start)
    startButton.parent('page')
    selectMode = createSelect();
    selectMode.option('1 Player')
    selectMode.option('2 Players')
    selectMode.position(screen.width/2-60, screen.height/2+50)
    selectMode.parent('page')
    fullScreen = createImg('screen.png')
    fullScreen.position(screen.width-60, 10)
    fullScreen.mousePressed(activateFullscreen)
    fullScreen.size(50,50)
    fullScreen.parent('page')
    imgdiv = createDiv()
    imgdiv.position(screen.width-60, 10)
    imgdiv.size(50,50)
    imgdiv.mousePressed(activateFullscreen)
    imgdiv.parent('page')
    page = document.getElementById('page')
    fill(255)
}

function touchMoved(){
    if(gameplaying&&!gameMode&&!timeout){
        player1.y = mouseY
        playermoved = true
    }
}

function activateFullscreen(){
    if (page.requestFullscreen && !isFull) {
        page.requestFullscreen()
        isFull = true
    }
    else if(document.exitFullscreen && isFull){
        document.exitFullscreen()
        isFull = false
    }
}

function draw(){
gameMode = selectMode.value() === '1 Player'?true:false    
    if(gameplaying&&!timeout){
        clear()
        background("#000000")
        myCanvas.position(0,0,"fixed")
        selectMode.hide()
        textSize(45)
        text(p1Score+" - "+p2Score, screen.width/2-50, 60)
        if(gameMode){
            player2.y = (player2.y+75>ball.y&&player2.y>0)?player2.y-7:player2.y
            player2.y = (player2.y+75<ball.y&&player2.y+150<screen.height)?player2.y+7:player2.y
            fill('blue')
            player1.y = (mouseY-75>=0&&mouseY+75<=screen.height)?mouseY-75:player1.y
            p1move = true
        }
        rect(player1.x, player1.y, -10, 150)
        fill(255)
        rect(player2.x, player2.y, 10, 150)
        ellipse(ball.x, ball.y, 20)
        if(!gameMode){
            if(keyIsDown(SHIFT)){
                player1.y = player1.y<=0?player1.y:player1.y-15
                p1move = true
            }
            if(keyIsDown(CONTROL)){
                player1.y = player1.y+150>=screen.height?player1.y:player1.y+15
                p1move = true
            }
            if(keyIsDown(UP_ARROW)){
                player2.y = player2.y<=0?player2.y:player2.y-15
                p2move = true
            }
            if(keyIsDown(DOWN_ARROW)){
                player2.y = player2.y+150>=screen.height?player2.y:player2.y+15
                p2move = true
            }
        }
        calculateball()
    }
}

function calculateball(){
    let horizontalDistance = Math.cos(angle)*distance
    let verticalDistance = Math.sin(angle)*distance
    if(ball.x+10>=player2.x){
        horizontalControl = -1
        playermoved = p2move
        changeAngle()
        distance += screen.width/1450
        if((ball.y-10>player2.y+150)||(ball.y+10<player2.y)){
            p1Score++
            timeout = true
            timeinterval = setTimeout(winner, 250)
            return
        }
    }
    if(ball.x-10<=player1.x){
        horizontalControl = 1
        playermoved = p1move
        changeAngle()
        distance += screen.width/1450
        if((ball.y-10>player1.y+150)||(ball.y+10<player1.y)){
            p2Score++
            timeout = true
            timeinterval = setTimeout(winner, 250)
            return
        }
    }
    if((ball.y+10>screen.height)||(ball.y-10<0)){
        verticalControl = verticalControl*-1
    }
    ball.x += horizontalDistance*horizontalControl
    ball.y += verticalDistance*verticalControl
    p1move = false
    p2move = false
    playermoved = false
}

function changeAngle(){
    let variation = 0
    variation = ball.x>screen.width/2?player2.y+75-ball.y:variation
    variation = ball.x<screen.width/2?player1.y+75-ball.y:variation
    angle = Math.abs(variation)/85*(Math.PI/3)
    if(playermoved){
        verticalControl = variation>0?-1:1
    }
}

function winner(){
    timeout = false
    verticalControl = 1
    angle = 0
    firstplay = true
    ball.x = screen.width/2,
    ball.y = screen.height/2
    player1.y = screen.height/2-75
    player2.y = screen.height/2-75
    distance = screen.width/90
}

function start(){
    if(!gameplaying){
        gameplaying = true
        startButton.html("Resetar")
        startButton.position(20,20)
    }
    else if(!timeout){
        distance = screen.width/90
        clear()
        background("#000000")
        myCanvas.position(0,0,"fixed")
        gameplaying = false
        verticalControl = 1
        horizontalControl = 1
        angle = 0
        p1Score = 0
        p2Score = 0
        ball.x = screen.width/2,
        ball.y = screen.height/2
        player1.y = screen.height/2-75
        player2.y = screen.height/2-75
        startButton.position(screen.width/2-60, screen.height/2-30)
        startButton.html("Start")
        selectMode.show()
    }
}