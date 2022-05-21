let ballDistance = screen.width/100
let angle = 0
let ball = {
    x: screen.width/2,
    y: screen.height/2
}
let extraBalls = {}
let player1 = {
    p: 'player1',
    x: 10,
    y: screen.height/2,
    height: screen.height/5,
    color: 255,
}
let player2 = {
    p: 'player2',
    x: screen.width-10,
    y: screen.height/2,
    height: screen.height/5,
    color: 255,
}
let horizontalControl = 1
let verticalControl = 1
let gameplaying = false
let timeout = false
let p1move = false
let p2move = false
let playerMoved = false
let isFull = false
let p1Score = 0
let p2Score = 0
let isPowers
let ballColor = []
let ballColorIndex = 0
let timeinterval
let canSpawnPower = false
let powerColor = []
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
let stopPowerInterval1
let stopPowerInterval2
let activatedFire = [{p: 'player1', state:false},{p:'player2', state:false}]
let activatedIce = [{p: 'player1', state:false},{p:'player2', state:false}]
let isPower = false
let spawnedPower
let ballTrack = []
let allPowers = [{p:'large', side:'good'}, {p:'hot', side:'good'}, {p:'multiball', side:'neutral'},
{p:'freeze', side:'good'}, {p:'blind', side:'bad'}, {p:'inverted', side:'bad'}, {p:'small', side:'bad'}]
let currentPower
let font

function preload(){
    font = loadFont('koulen.ttf')
}
function setup(){
    myCanvas = createCanvas(screen.width,screen.height)
    myCanvas.parent('page')
    background("#000000")
    myCanvas.position(0,0,"fixed")
    textFont(font)
    fill(255)
    startButton = createButton("Start")
    startButton.position(screen.width/2-50, screen.height/2-30)
    startButton.mousePressed(start)
    startButton.parent('page')
    textSize(14)
    text('patch 1.5', 5, 15)
    textAlign(CENTER)
    textSize(20)
    text('Jogue em tela cheia e horizontal!\n(botao no canto superior direito)', screen.width/2, screen.height*2/5-25)
    title = createDiv('Pong do Morgs')
    title.position(screen.width*7/32, -5)
    title.addClass('titulo')
    selectMode = createSelect();
    selectMode.option('1 Player')
    selectMode.option('2 Players (PC)')
    selectMode.position(screen.width/2-85, screen.height/2+50)
    selectMode.parent('page')
    selectDifficulty = createSelect()
    selectDifficulty.option('Facil')
    selectDifficulty.option('Medio')
    selectDifficulty.option('Dificil')
    selectDifficulty.option('INSANO')
    selectDifficulty.position(screen.width/2-50, screen.height/2+100)
    selectDifficulty.parent('page')
    powersSelect = createSelect()
    powersSelect.option('Com poderes')
    powersSelect.option('Sem poderes')
    powersSelect.position(screen.width/2-80, screen.height/2+150)
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
    ballColor.push(color(255,255,255), color(255,0,0))
    powerColor.push(color(255,0,0),color(0,255,0),color(255,255,255))
    powerColor
    noStroke()
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
    canSpawnPower = true
}

function powerCatch(power, player, interval){
    clearTimeout(interval)
    interval = setTimeout(stopPower, 5000, power, player)
    switch(allPowers[power].p){
        case'large':
            player.height = screen.height*2/5
            break
        case 'hot':
            activatedFire[activatedFire.findIndex(e => e==player.p)].state = true
            break
        case 'multiball':
            break
        case 'multiball':
            break
        case 'multiball':
            break
        case 'multiball':
            break
        case 'multiball':
            break
    }
}

function stopPower(power, player){
    switch(allPowers[power].p){
        case'large':
            player.height = screen.height/5
            break
        case 'hot':
            break
        case 'multiball':
            break
        case 'multiball':
            break
        case 'multiball':
            break
        case 'multiball':
            break
        case 'multiball':
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
        fill(255)
        text(p1Score+" - "+p2Score, screen.width/2-50, 60)
        if(canSpawnPower){
            let xPos = Math.floor(Math.random()*screen.width*19/20)+screen.width/40
            let yPos = Math.floor(Math.random()*screen.height)
            currentPower = 0
            spawnedPower = {x: xPos, y: yPos}
            canSpawnPower = false
            isPower = true
        }
        if(gameMode){
            let target = ball.y+(AISpeed*1.75)
            player2.y = (player2.y+(player2.height/2)>target&&player2.y>0)?player2.y-AISpeed:player2.y
            player2.y = (player2.y+(player2.height/2)<target&&player2.y+player2.height<screen.height)?player2.y+AISpeed:player2.y
            player1.y = (mouseY-(player1.height/2)>=0&&mouseY+(player1.height/2)<=screen.height)?mouseY-(player1.height/2):player1.y
            p1move = true
            p2move = true
        }
        else{
            if(keyIsDown(SHIFT)){
                player1.y = player1.y<=0?player1.y:player1.y-15
                p1move = true
            }
            if(keyIsDown(CONTROL)){
                player1.y = player1.y+player1.height>=screen.height?player1.y:player1.y+15
                p1move = true
            }
            if(keyIsDown(UP_ARROW)){
                player2.y = player2.y<=0?player2.y:player2.y-15
                p2move = true
            }
            if(keyIsDown(DOWN_ARROW)){
                player2.y = player2.y+player2.height>=screen.height?player2.y:player2.y+15
                p2move = true
            }
        }
        if(isPower){
            let thisColor = powerColor[1]
            thisColor.setAlpha(75)
            fill(thisColor)
            ellipse(spawnedPower.x, spawnedPower.y, screen.height/4)
            if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+screen.height/8){
                let rightPlayer = horizontalControl==1?player1:player2
                let rightInterval = horizontalControl==1?stopPowerInterval1:stopPowerInterval2
                powerCatch(currentPower, rightPlayer, rightInterval)
                spawnedPower = {}
                isPower = false
            }
        }
        fill(player1.color)
        rect(player1.x, player1.y, -10, player1.height)
        fill(player2.color)
        rect(player2.x, player2.y, 10, player2.height)
        if(ballTrack.length>5){ballTrack.shift()}
        ballTrack.push({x: ball.x, y:ball.y})
        ballTrack.forEach(past => {
            ballColor[ballColorIndex].setAlpha(50)
            fill(ballColor[ballColorIndex])
            ellipse(past.x, past.y, 20)
            ballColor[ballColorIndex].setAlpha(255)
        })
        fill(ballColor[ballColorIndex])
        ellipse(ball.x, ball.y, 20)
        calculateball()
    }
}

function calculateball(){
    let horizontalballDistance = Math.cos(angle)*ballDistance
    let verticalballDistance = Math.sin(angle)*ballDistance
    if(ball.x+10>=player2.x){
        horizontalControl = -1
        playerMoved = p2move
        changeAngle(player2)
        if(activatedFire[1].state){
            ballColorIndex = 1
            ballDistance += screen.width/75
        }
        ballDistance += screen.width/1500
        if((ball.y-10>player2.y+player2.height)||(ball.y+10<player2.y)){
            p1Score++
            timeout = true
            timeinterval = setTimeout(winner, 250)
            return
        }
    }
    if(ball.x-10<=player1.x){
        horizontalControl = 1
        playerMoved = p1move
        changeAngle(player1)
        ballDistance += screen.width/1500
        if((ball.y-10>player1.y+player1.height)||(ball.y+10<player1.y)){
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
}

function changeAngle(player){
    let variation = player.y+(player.height/2)-ball.y
    angle = Math.abs(variation)*(Math.PI/3)/(player.height/2+5)
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
            case 'Facil':
                AISpeed = screen.height/150
                break
            case 'Medio':
                AISpeed = screen.height/82
                break
            case 'Dificil':
                AISpeed = screen.height/57
                break
            case 'INSANO':
                AISpeed = screen.height/34
                break
        }
        isPowers = powersSelect.value() === 'Com poderes (1P)'?true:false
        if(isPowers){
            powerInterval = setInterval(spawnPower, 8000)
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
        fill(255)
        text('patch 1.5', 5, 15)
        selectMode.show()
        selectDifficulty.show()
        title.show()
        powersSelect.show()
    }
}