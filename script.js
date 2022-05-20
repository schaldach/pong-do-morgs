let ballDistance = screen.width/100
let angle = 0
let ball = {
    x: screen.width/2,
    y: screen.height/2
}
let extraBalls = {}
let player1 = {
    x: 10,
    y: screen.height/2
}
let player2 = {
    x: screen.width-10,
    y: screen.height/2
}
let horizontalControl = 1
let verticalControl = 1
let gameplaying = false
let timeout = false
let p1move = false
let p2move = false
let playerMoved = false
let isFull = false
let playerHeight = screen.height/5
let p1Score = 0
let p2Score = 0
let isPowers
let timeinterval
let myCanvas
let startButton
let selectMode
let selectDifficulty
let AISpeed
let fullScreen
let page
let imgdiv
let gameMode
let powersSelect
let title
let powerInterval
let ballColor
let stopPowerInterval
let xPos
let yPos
let activatedFire
let isPower
let ballTrack = []
let allPowers = ['large', 'hot', 'multiball']
let currentPower

function setup(){
    myCanvas = createCanvas(screen.width,screen.height)
    myCanvas.parent('page')
    background("#000000")
    myCanvas.position(0,0,"fixed")
    fill(255)
    startButton = createButton("Start")
    startButton.position(screen.width/2-50, screen.height/2-30)
    startButton.mousePressed(start)
    startButton.parent('page')
    textSize(14)
    text('patch 1.4', 5, 15)
    title = createDiv('Pong do Morgs')
    title.position(screen.width*5/32, 20)
    title.addClass('titulo')
    selectMode = createSelect();
    selectMode.option('1 Player')
    selectMode.option('2 Players (PC)')
    selectMode.position(screen.width/2-100, screen.height/2+80)
    selectMode.parent('page')
    selectDifficulty = createSelect()
    selectDifficulty.option('Fácil')
    selectDifficulty.option('Médio')
    selectDifficulty.option('Difícil')
    selectDifficulty.option('INSANO')
    selectDifficulty.position(screen.width/2-70, screen.height/2+120)
    selectDifficulty.parent('page')
    powersSelect = createSelect()
    powersSelect.option('Com poderes (1P)')
    powersSelect.option('Sem poderes')
    powersSelect.position(screen.width/2-120, screen.height/2+160)
    powersSelect.parent('page')
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
        playerMoved = true
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

function spawnPower(){
    xPos = Math.floor(Math.random())*(screen.width-60)
    yPos = Math.floor(Math.random())*(screen.height)
    currentPower = allPowers[Math.floor(1)]
    isPower = true
}

function powerCatch(p){
    switch(p){
        case'large':
            playerHeight = screen.height*2/5
            stopPowerInterval = setTimeout(stopPower, 8000, p)
            break
        case'hot':
            break
        case'multiball':
            break
    }
}

function stopPower(p){
    switch(p){
        case'large':
            playerHeight = screen.height/5
            break
    }
}

function draw(){
    if(gameplaying&&!timeout){
        clear()
        background("#000000")
        myCanvas.position(0,0,"fixed")
        selectMode.hide()
        selectDifficulty.hide()
        powersSelect.hide()
        title.hide()
        textSize(45)
        text(p1Score+" - "+p2Score, screen.width/2-50, 60)
        if(gameMode){
            let target = AISpeed>10?ball.y+AISpeed*1.7:ball.y
            player2.y = (player2.y+(playerHeight/2)>target&&player2.y>0)?player2.y-AISpeed:player2.y
            player2.y = (player2.y+(playerHeight/2)<target&&player2.y+playerHeight<screen.height)?player2.y+AISpeed:player2.y
            fill('blue')
            player1.y = (mouseY-(playerHeight/2)>=0&&mouseY+(playerHeight/2)<=screen.height)?mouseY-(playerHeight/2):player1.y
            p1move = true
        }
        if(isPowers){
            if((dist(ball.x, ball.y, xPos, yPos)<10+screen.height/20)&&horizontalControl===1){
                powerCatch(currentPower)
            }
        }
        rect(player1.x, player1.y, -10, playerHeight)
        fill(255)
        if(isPower){
            fill(10)
            ellipse(xPos, yPos, screen.height/10)
            fill(255)
        }
        rect(player2.x, player2.y, 10, playerHeight)
        ballTrack.forEach(past => {
            ballColor = activatedFire?color(255,0,0):color(255,255,255)
            ballColor.setAlpha(50)
            fill(ballColor)
            ellipse(past.x, past.y, 20)
        })
        fill(255)
        if(activatedFire){fill('red')}
        if(ballTrack.length>5){ballTrack.shift()}
        ellipse(ball.x, ball.y, 20)
        fill(255)
        ballTrack.push({x: ball.x, y:ball.y})
        if(!gameMode){
            if(keyIsDown(SHIFT)){
                player1.y = player1.y<=0?player1.y:player1.y-15
                p1move = true
            }
            if(keyIsDown(CONTROL)){
                player1.y = player1.y+playerHeight>=screen.height?player1.y:player1.y+15
                p1move = true
            }
            if(keyIsDown(UP_ARROW)){
                player2.y = player2.y<=0?player2.y:player2.y-15
                p2move = true
            }
            if(keyIsDown(DOWN_ARROW)){
                player2.y = player2.y+playerHeight>=screen.height?player2.y:player2.y+15
                p2move = true
            }
        }
        calculateball()
    }
}

function calculateball(){
    let horizontalballDistance = Math.cos(angle)*ballDistance
    let verticalballDistance = Math.sin(angle)*ballDistance
    if(ball.x+10>=player2.x){
        horizontalControl = -1
        playerMoved = p2move
        changeAngle()
        ballDistance += screen.width/1500
        if((ball.y-10>player2.y+playerHeight)||(ball.y+10<player2.y)){
            p1Score++
            timeout = true
            timeinterval = setTimeout(winner, 250)
            return
        }
    }
    if(ball.x-10<=player1.x){
        horizontalControl = 1
        playerMoved = p1move
        changeAngle()
        if(currentPower === 'hot'){
            ballDistance += screen.width/100
            activatedFire = true
        }
        ballDistance += screen.width/1500
        if((ball.y-10>player1.y+playerHeight)||(ball.y+10<player1.y)){
            p2Score++
            timeout = true
            timeinterval = setTimeout(winner, 250)
            return
        }
    }
    if(ball.y+10>screen.height){
        verticalControl = -1
    }
    if(ball.y-10<0){
        verticalControl = 1
    }
    ball.x += horizontalballDistance*horizontalControl
    ball.y += verticalballDistance*verticalControl
    p1move = false
    p2move = false
    playerMoved = false
}

function changeAngle(){
    let variation = 0
    variation = ball.x>screen.width/2?player2.y+(playerHeight/2)-ball.y:variation
    variation = ball.x<screen.width/2?player1.y+(playerHeight/2)-ball.y:variation
    angle = Math.abs(variation)*(Math.PI/3)/(playerHeight/2+5)
    if(playerMoved){
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
    player1.y = screen.height*2/5
    player2.y = screen.height*2/5
    ballDistance = screen.width/90
}

function start(){
    if(!gameplaying){
        gameMode = selectMode.value() === '1 Player'?true:false
        switch(selectDifficulty.value()){
            case 'Fácil':
                AISpeed = screen.height/150
                break
            case 'Médio':
                AISpeed = screen.height/82
                break
            case 'Difícil':
                AISpeed = screen.height/50
                break
            case 'INSANO':
                AISpeed = screen.height/30
                break
        }
        isPowers = powersSelect.value() === 'Com poderes (1P)'?true:false
        if(isPowers){
            powerInterval = setTimeout(spawnPower, 8000)
        }
        gameplaying = true
        startButton.html("Resetar")
        startButton.position(20,20)
    }
    else if(!timeout){
        ballDistance = screen.width/90
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
        player1.y = screen.height*2/5
        player2.y = screen.height*2/5
        startButton.position(screen.width/2-60, screen.height/2-30)
        startButton.html("Start")
        textSize(14)
        text('patch 1.2', 5, 15)
        selectMode.show()
        selectDifficulty.show()
        title.show()
        powersSelect.show()
    }
}