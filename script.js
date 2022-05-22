let balls = [
    {
        x: screen.width/2,
        y: screen.height/2,
        ballColor: [],
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: 1,
        verticalControl: 1,
        distance: screen.width/120,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1
    }
]
let player1 = {
    p: 'player1',
    x: 10,
    y: screen.height*3/8,
    height: screen.height/4,
    color: 'white',
    lastPower: 0,
    score: 0
}
let player2 = {
    p: 'player2',
    x: screen.width-10,
    y: screen.height*3/8,
    height: screen.height/4,
    color: 'white',
    lastPower: 0,
    score: 0
}
let gameplaying = false
let timeout = false
let p1move = false
let p2move = false
let playerMoved = false
let isFull = false
let isPowers
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
let scoreDisplay
let scoreLimitSelect
let scoreLimit
let mainmenu
let activatedFire = [{p: 'player1', state:false},{p:'player2', state:false}]
let activatedIce = [{p: 'player1', state:false},{p:'player2', state:false}]
let activatedInverted = [{p: 'player1', state:false},{p:'player2', state:false}]
let isPower = false
let spawnedPower
let subtitle = 'Jogue em tela cheia (botao no canto\nsuperior direito) e deixe o dispositivo\nna horizontal!'
let allPowers = [{p:'hot', t:7000}, {p:'inverted', t:7000}, {p:'multiball', t:7000}, 
{p:'gold', t:7000}, {p:'large', t:7000}, {p:'small', t:7000}, {p:'freeze', t:2000},]
let currentPower
let AIrandomizer = 1
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
    mainmenu = createDiv()
    mainmenu.parent('page')
    mainmenu.id('mainmenu')
    mainmenu.style('display', 'flex')
    mainmenu.style('flex-direction', 'column')
    mainmenu.style('gap', '10px')
    mainmenu.style('top', 0)
    mainmenu.style('bottom', 0)
    mainmenu.style('left', 0)
    mainmenu.style('right', 0)
    mainmenu.style('width', 'fit-content')
    mainmenu.style('margin', 'auto')
    mainmenu.style('top', '65%')
    mainmenu.style('transform', 'translateY(-50%)')
    mainmenu.style('position', 'absolute')
    mainmenu.style('margin', 'auto')
    mainmenu.style('text-align', 'center')
    startButton = createButton("Start")
    startButton.mousePressed(start)
    startButton.parent('mainmenu')
    title = createDiv('Pong do Morgs')
    title.position(screen.width/4, -10)
    title.addClass('titulo')
    selectMode = createSelect();
    selectMode.option('1 Player')
    selectMode.option('2 Players')
    selectMode.parent('mainmenu')
    selectDifficulty = createSelect()
    selectDifficulty.option('Facil')
    selectDifficulty.option('Medio')
    selectDifficulty.option('Dificil')
    selectDifficulty.option('PESADELO')
    selectDifficulty.selected('Medio')
    selectDifficulty.parent('mainmenu')
    powersSelect = createSelect()
    powersSelect.option('Com poderes')
    powersSelect.option('Sem poderes')
    powersSelect.parent('mainmenu')
    scoreDisplay = createDiv('Pontos para vencer')
    scoreDisplay.id('lim')
    scoreDisplay.parent('mainmenu')
    scoreLimitSelect = createInput(10, 'number')
    scoreLimitSelect.parent('lim')
    scoreLimitSelect.input(setInput)
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
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0))
    powerColor.push(color(255,0,0),color(0,255,0),color(255,255,255))
    textAlign(LEFT)
    textSize(14)
    text('patch 1.5', 5, 15)
    textAlign(CENTER)
    textSize(20)
    text(subtitle, screen.width/2, screen.height/4)
    noStroke()
}
function setInput(){
    scoreLimit = parseInt(this.value())
}
function activateFullscreen(){
    if (page.requestFullscreen && !isFull) {
        page.requestFullscreen({navigationUI:'hide'})
        isFull = true
    }
    else if(document.exitFullscreen && isFull){
        document.exitFullscreen()
        isFull = false
    }
}
function isTouchDevice() {
    return(('ontouchstart' in window)||
    (navigator.maxTouchPoints > 0)||
    (navigator.msMaxTouchPoints > 0))
}
let device = isTouchDevice()

function spawnPower(){
    canSpawnPower = true
}

function powerCatch(power, player, ball){
    if(ball.horizontalControl===1){
        clearTimeout(stopPowerInterval1)
        stopPowerInterval1 = setTimeout(stopPower, allPowers[power].t, power, player)
    }
    else{
        clearTimeout(stopPowerInterval2)
        stopPowerInterval2 = setTimeout(stopPower, allPowers[power].t, power, player)
    }
    player.lastPower = power
    switch(allPowers[power].p){
        case 'large':
            player.height = screen.height/2
            break
        case 'hot':
            activatedFire[activatedFire.findIndex(e => e.p==player.p)].state = true
            player.color = 'red'
            break
        case 'freeze':
            activatedIce[activatedIce.findIndex(e => e.p==player.p)].state = true
            player.color = color(26,230,238)
            break
        case 'multiball':
            balls.push({
                    x: ball.x,
                    y: ball.y,
                    ballColor: [],
                    ballColorIndex: 0,
                    ballTrack: [],
                    horizontalControl: ball.horizontalControl*-1,
                    verticalControl: ball.verticalControl*-1,
                    distance: 0,
                    angle: ball.angle,
                    lastPlayerHit: 1,
                    scoreValue: 1
                })
            balls.forEach(ball => {
                ball.distance = screen.width/200
                ball.ballColorIndex = ball.ballColorIndex==1?0:ball.ballColorIndex
            })
            balls[balls.length-1]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0))
            break
        case 'inverted':
            activatedInverted[activatedInverted.findIndex(e => e.p==player.p)].state = true
            break
        case 'small':
            player.height = screen.height/8
            break
        case 'gold':
            ball.scoreValue = 2
            ball.ballColorIndex = 2
            break
    }
}

function stopPower(power, player){
    switch(allPowers[power].p){
        case 'small':
        case 'large':
            player.height = screen.height/4
            break
        case 'hot':
            activatedFire[activatedFire.findIndex(e => e.p==player.p)].state = false
            player.color = 'white'
            break
        case 'freeze':
            activatedIce[activatedIce.findIndex(e => e.p==player.p)].state = false
            player.color = 'white'
            break
        case 'inverted':
            activatedInverted[activatedInverted.findIndex(e => e.p==player.p)].state = false
            break
        default:
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
        scoreDisplay.hide()
        title.hide()
        fill(255)
        textAlign(LEFT)
        textSize(14)
        text('patch 1.5', 5, 15)
        textAlign(CENTER)
        textSize(45)
        text(player1.score+" - "+player2.score, screen.width/2, screen.height/14)
        if(canSpawnPower){
            let xPos = Math.floor(Math.random()*screen.width*2/3)+screen.width/6
            let yPos = Math.floor(Math.random()*screen.height*2/3)+screen.height/6
            currentPower = Math.floor(Math.random()*7)
            spawnedPower = {x: xPos, y: yPos}
            canSpawnPower = false
            isPower = true
        }
        if(isPower){
            let thisColor = powerColor[1]
            thisColor.setAlpha(75)
            fill(thisColor)
            ellipse(spawnedPower.x, spawnedPower.y, screen.height/3)
            balls.forEach(ball => {
                if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+screen.height/6){
                    let rightPlayer = ball.lastPlayerHit==1?player1:player2
                    stopPower(rightPlayer.lastPower, rightPlayer)
                    powerCatch(currentPower, rightPlayer, ball)
                    spawnedPower = {}
                    isPower = false
                }
            })
        }
        if(gameMode){
            let xDist = screen.width
            balls.forEach(ball => {
                let index = balls.indexOf(ball)
                if(screen.width-ball.x<xDist){
                    xDist = screen.width-ball.x
                    closestBall = index
                }
            })
            let target = balls[closestBall].y+(AISpeed*1.75*AIrandomizer)
            player2.y = !activatedIce[1].state&&(player2.y+(player2.height/2)>target&&player2.y>0)?player2.y-AISpeed:player2.y
            player2.y = !activatedIce[1].state&&(player2.y+(player2.height/2)<target&&player2.y+player2.height<screen.height)?player2.y+AISpeed:player2.y
            player1.y = !activatedIce[0].state&&!activatedInverted[0].state&&(mouseY-(player1.height/2)>=0&&mouseY+(player1.height/2)<=screen.height)?mouseY-(player1.height/2):player1.y
            player1.y = activatedInverted[0].state&&(screen.height-mouseY+(player1.height/2)<=screen.height&&screen.height-mouseY-(player1.height/2)>=0)?screen.height-mouseY-(player1.height/2):player1.y
            p1move = true
            p2move = true
        }
        else{
            if(device){
                touches.forEach(touch => {
                    if(touch.x < screen.width/2){
                        player1.y = !activatedIce[0].state&&!activatedInverted[0].state&&(touch.y-(player1.height/2)>=0&&touch.y+(player1.height/2)<=screen.height)?touch.y-(player1.height/2):player1.y
                        player1.y = activatedInverted[0].state&&(screen.height-touch.y+(player1.height/2)<=screen.height&&screen.height-touch.y-(player1.height/2)>=0)?screen.height-touch.y-(player1.height/2):player1.y
                    }
                    else{
                        player2.y = !activatedIce[1].state&&!activatedInverted[1].state&&(touch.y-(player2.height/2)>=0&&touch.y+(player2.height/2)<=screen.height)?touch.y-(player2.height/2):player2.y
                        player2.y = activatedInverted[1].state&&(screen.height-touch.y+(player2.height/2)<=screen.height&&screen.height-touch.y-(player2.height/2)>=0)?screen.height-touch.y-(player2.height/2):player2.y
                    }
                })
            }
            else{
                if(!activatedIce[0].state&&(keyIsDown(SHIFT)&&!activatedInverted[0].state)||(keyIsDown(CONTROL)&&activatedInverted[0].state)){
                    player1.y = player1.y<=0?player1.y:player1.y-15
                    p1move = true
                }
                if(!activatedIce[0].state&&(keyIsDown(CONTROL)&&!activatedInverted[0].state)||(keyIsDown(SHIFT)&&activatedInverted[0].state)){
                    player1.y = player1.y+player1.height>=screen.height?player1.y:player1.y+15
                    p1move = true
                }
                if(!activatedIce[1].state&&(keyIsDown(UP_ARROW)&&!activatedInverted[1].state)||(keyIsDown(DOWN_ARROW)&&activatedInverted[1].state)){
                    player2.y = player2.y<=0?player2.y:player2.y-15
                    p2move = true
                }
                if(!activatedIce[1].state&&(keyIsDown(DOWN_ARROW)&&!activatedInverted[1].state)||(keyIsDown(UP_ARROW)&&activatedInverted[1].state)){
                    player2.y = player2.y+player2.height>=screen.height?player2.y:player2.y+15
                    p2move = true
                }
            }
        }
        fill(player1.color)
        rect(player1.x, player1.y, -10, player1.height)
        fill(player2.color)
        rect(player2.x, player2.y, 10, player2.height)
        balls.forEach(ball => {
            if(ball['ballTrack'].length>5){ball['ballTrack'].shift()}
            ball['ballTrack'].push({x: ball.x, y:ball.y})
            ball['ballTrack'].forEach(past => {
                ball['ballColor'][ball.ballColorIndex].setAlpha(50)
                fill(ball['ballColor'][ball.ballColorIndex])
                ellipse(past.x, past.y, 20)
                ball['ballColor'][ball.ballColorIndex].setAlpha(255)
            })
            fill(ball['ballColor'][ball.ballColorIndex])
            ellipse(ball.x, ball.y, 20)
        })
        calculateball()
    }
}

function calculateball(){
    balls.forEach(ball => {
        let index = balls.indexOf(ball)
        let horizontalballDistance = Math.cos(ball.angle)*ball.distance
        let verticalballDistance = Math.sin(ball.angle)*ball.distance
        if(ball.x+10>=player2.x){
            if(gameMode){
                AIrandomizer = Math.random()>0.5?1:-1
            }
            ball.lastPlayerHit = 2
            ball.distance += screen.width/1500
            ball.horizontalControl = -1
            playerMoved = p2move
            changeAngle(player2, index)
            if(activatedFire[1].state){
                ball.ballColorIndex = 1
                clearTimeout(stopPowerInterval2)
                stopPower(0, player2)
                ball.distance += screen.width/80
            }
            if((ball.y-10>player2.y+player2.height)||(ball.y+10<player2.y)){
                player1.score+=ball.scoreValue
                timeout = true
                timeinterval = setTimeout(winner, 250)
                return
            }
        }
        if(ball.x-10<=player1.x){
            ball.lastPlayerHit = 1
            ball.distance += screen.width/1500
            ball.horizontalControl = 1
            playerMoved = p1move
            changeAngle(player1, index)
            if(activatedFire[0].state){
                ball.ballColorIndex = 1
                clearTimeout(stopPowerInterval1)
                stopPower(0, player1)
                ball.distance += screen.width/80
            }
            if((ball.y-10>player1.y+player1.height)||(ball.y+10<player1.y)){
                player2.score+=ball.scoreValue
                timeout = true
                timeinterval = setTimeout(winner, 250)
                return
            }
        }
        if(ball.y+10>screen.height){
            ball.verticalControl = -1
        }
        if(ball.y-10<0){
            ball.verticalControl = 1
        }
        ball.x += horizontalballDistance*ball.horizontalControl
        ball.y += verticalballDistance*ball.verticalControl
    })
    p1move = false
    p2move = false
}

function changeAngle(player, index){
    let variation = player.y+(player.height/2)-balls[index].y
    balls[index].angle = Math.abs(variation)*(Math.PI/3)/(player.height/2+5)
    if(playerMoved){
        balls[index].verticalControl = variation>0?-1:1
    }
}

function winner(){
    timeout = false
    if(player1.score==scoreLimit&&scoreLimit!=0){
        subtitle = 'Jogador 1 venceu!'
        start()
        return
    }
    if(player2.score==scoreLimit&&scoreLimit!=0){
        subtitle = 'Jogador 2 venceu!'
        start()
        return
    }
    balls = [{
            x: screen.width/2,
            y: screen.height/2,
            ballColor: [],
            ballColorIndex: 0,
            ballTrack: [],
            horizontalControl: 1,
            verticalControl: 1,
            distance: screen.width/120,
            angle: 0,
            lastPlayerHit: 1,
            scoreValue: 1
        }]
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0))
    player1.y = screen.height*3/8
    player2.y = screen.height*3/8
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
            case 'PESADELO':
                AISpeed = screen.height/31
                break
        }
        isPowers = powersSelect.value() === 'Com poderes'?true:false
        if(isPowers){
            powerInterval = setInterval(spawnPower, 6000)
        }
        gameplaying = true
        subtitle = 'Jogue em tela cheia (botao no canto\nsuperior direito) e na horizontal!'
        startButton.html("Resetar")
        mainmenu.style('transform', 'none')
        mainmenu.style('margin-top', '1.5rem')
        mainmenu.style('margin-left', '2rem')
        mainmenu.style('top', 'auto')
        mainmenu.style('bottom', 'auto')
        mainmenu.style('left', 'auto')
        mainmenu.style('right', 'auto')
    }
    else if(!timeout){
        clearInterval(powerInterval)
        clear()
        background("#000000")
        myCanvas.position(0,0,"fixed")
        gameplaying = false
        balls = [{
            x: screen.width/2,
            y: screen.height/2,
            ballColor: [],
            ballColorIndex: 0,
            ballTrack: [],
            horizontalControl: 1,
            verticalControl: 1,
            distance: screen.width/100,
            angle: 0,
            lastPlayerHit: 1,
            scoreValue: 1
        }]
        balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0))
        player1.score = 0
        player2.score = 0
        player1.y = screen.height*2/5
        player2.y = screen.height*2/5
        mainmenu.style('display', 'flex')
        mainmenu.style('flex-direction', 'column')
        mainmenu.style('gap', '10px')
        mainmenu.style('top', '0')
        mainmenu.style('bottom', '0')
        mainmenu.style('left', '0')
        mainmenu.style('right', '0')
        mainmenu.style('width', 'fit-content')
        mainmenu.style('margin', 'auto')
        mainmenu.style('top', '65%')
        mainmenu.style('transform', 'translateY(-50%)')
        mainmenu.style('position', 'absolute')
        mainmenu.style('margin', 'auto')
        mainmenu.style('text-align', 'center')
        startButton.html("Start")
        fill(255)
        textSize(14)
        textAlign(LEFT)
        text('patch 1.5', 5, 15)
        textAlign(CENTER)
        textSize(20)
        text(subtitle, screen.width/2, screen.height/4)
        selectMode.show()
        selectDifficulty.show()
        powersSelect.show()
        title.show()
        scoreDisplay.show()
    }
}