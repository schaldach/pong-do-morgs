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
        lastPlayerHit: 1 
    }
]
let player1 = {
    p: 'player1',
    x: 10,
    y: screen.height/2,
    height: screen.height/4,
    color: 'white',
    lastPower: 0
}
let player2 = {
    p: 'player2',
    x: screen.width-10,
    y: screen.height/2,
    height: screen.height/4,
    color: 'white',
    lastPower: 0
}
let gameplaying = false
let timeout = false
let p1move = false
let p2move = false
let playerMoved = false
let isFull = false
let p1Score = 0
let p2Score = 0
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
let lastPlayerHit = ''
let activatedFire = [{p: 'player1', state:false},{p:'player2', state:false}]
let activatedIce = [{p: 'player1', state:false},{p:'player2', state:false}]
let activatedInverted = [{p: 'player1', state:false},{p:'player2', state:false}]
let isPower = false
let spawnedPower
let allPowers = [{p:'large', side:'good', t:7000}, {p:'hot', side:'good', t:7000}, 
{p:'freeze', side:'bad', t:2000}, {p:'multiball', side:'neutral', t:7000}, 
{p:'inverted', side:'bad', t:7000}, {p:'small', side:'bad', t:7000}]
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
    selectDifficulty.option('PESADELO')
    selectDifficulty.selected('Medio')
    selectDifficulty.position(screen.width/2-60, screen.height/2+100)
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
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0))
    powerColor.push(color(255,0,0),color(0,255,0),color(255,255,255))
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

function powerCatch(power, player, ball){
    if(ball.horizontalControl===1){
        clearInterval(stopPowerInterval1)
        stopPowerInterval1 = setTimeout(stopPower, allPowers[power].t, power, player)
    }
    else{
        clearInterval(stopPowerInterval2)
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
                    ballColorIndex: ball.ballColorIndex,
                    ballTrack: [],
                    horizontalControl: ball.horizontalControl*-1,
                    verticalControl: ball.verticalControl*-1,
                    distance: screen.width/120,
                    angle: 0,
                    lastPlayerHit: 1
                })
            balls.forEach(ball => {
                ball.distance = ball.distance/2
            })
            balls[balls.length-1]['ballColor'].push(color(255,255,255), color(255,0,0))
            break
        case 'inverted':
            activatedInverted[activatedInverted.findIndex(e => e.p==player.p)].state = true
            break
        case 'small':
            player.height = screen.height/8
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
        title.hide()
        textSize(45)
        fill(255)
        textAlign(CENTER)
        text(p1Score+" - "+p2Score, screen.width/2, 60)
        if(canSpawnPower){
            let xPos = Math.floor(Math.random()*screen.width*19/20)+screen.width/40
            let yPos = Math.floor(Math.random()*screen.height)
            currentPower = 4
            spawnedPower = {x: xPos, y: yPos}
            canSpawnPower = false
            isPower = true
        }
        if(isPower){
            let thisColor = powerColor[1]
            thisColor.setAlpha(75)
            fill(thisColor)
            ellipse(spawnedPower.x, spawnedPower.y, screen.height/4)
            balls.forEach(ball => {
                if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+screen.height/8){
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
            let target = balls[closestBall].y+(AISpeed*1.75)
            player2.y = !activatedIce[1].state&&(player2.y+(player2.height/2)>target&&player2.y>0)?player2.y-AISpeed:player2.y
            player2.y = !activatedIce[1].state&&(player2.y+(player2.height/2)<target&&player2.y+player2.height<screen.height)?player2.y+AISpeed:player2.y
            player1.y = !activatedIce[0].state&&!activatedInverted[0].state&&(mouseY-(player1.height/2)>=0&&mouseY+(player1.height/2)<=screen.height)?mouseY-(player1.height/2):player1.y
            player1.y = activatedInverted[0].state&&(screen.height-mouseY+(player1.height/2)<=screen.height&&screen.height-mouseY-(player1.height/2)>=0)?screen.height-mouseY-(player1.height/2):player1.y
            p1move = true
            p2move = true
        }
        else{
            if(keyIsDown(SHIFT)&&!activatedIce[0].state){
                player1.y = player1.y<=0?player1.y:player1.y-15
                p1move = true
            }
            if(keyIsDown(CONTROL)&&!activatedIce[0].state){
                player1.y = player1.y+player1.height>=screen.height?player1.y:player1.y+15
                p1move = true
            }
            if(keyIsDown(UP_ARROW)&&!activatedIce[1].state){
                player2.y = player2.y<=0?player2.y:player2.y-15
                p2move = true
            }
            if(keyIsDown(DOWN_ARROW)&&!activatedIce[1].state){
                player2.y = player2.y+player2.height>=screen.height?player2.y:player2.y+15
                p2move = true
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
            ball.lastPlayerHit = 2
            ball.distance += screen.width/1350
            ball.horizontalControl = -1
            playerMoved = p2move
            changeAngle(player2, index)
            if(activatedFire[1].state){
                ball.ballColorIndex = 1
                clearInterval(stopPowerInterval2)
                stopPower(1, player2)
                ball.distance += screen.width/90
            }
            if((ball.y-10>player2.y+player2.height)||(ball.y+10<player2.y)){
                p1Score++
                timeout = true
                timeinterval = setTimeout(winner, 250)
                return
            }
        }
        if(ball.x-10<=player1.x){
            ball.lastPlayerHit = 1
            ball.distance += screen.width/1350
            ball.horizontalControl = 1
            playerMoved = p1move
            changeAngle(player1, index)
            if(activatedFire[0].state){
                ball.ballColorIndex = 1
                clearInterval(stopPowerInterval1)
                stopPower(1, player1)
                ball.distance += screen.width/90
            }
            if((ball.y-10>player1.y+player1.height)||(ball.y+10<player1.y)){
                p2Score++
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
    balls = [{
            x: screen.width/2,
            y: screen.height/2,
            ballColor: [],
            ballColorIndex: 0,
            ballTrack: [],
            horizontalControl: 1,
            verticalControl: 1,
            distance: screen.width/120,
            angle: 0
        }]
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0))
    player1.y = screen.height/2
    player2.y = screen.height/2
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
                AISpeed = screen.height/34
                break
        }
        isPowers = powersSelect.value() === 'Com poderes'?true:false
        if(isPowers){
            powerInterval = setInterval(spawnPower, 6000)
        }
        gameplaying = true
        startButton.html("Resetar")
        startButton.position(20,20)
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
            angle: 0
        }]
        balls[0]['ballColor'].push(color(255,255,255), color(255,0,0))
        p1Score = 0
        p2Score = 0
        player1.y = screen.height*2/5
        player2.y = screen.height*2/5
        startButton.position(screen.width/2-50, screen.height/2-30)
        startButton.html("Start")
        fill(255)
        textSize(14)
        textAlign(LEFT)
        text('patch 1.5', 5, 15)
        textAlign(CENTER)
        textSize(20)
        text('Jogue em tela cheia e horizontal!\n(botao no canto superior direito)', screen.width/2, screen.height*2/5-25)
        selectMode.show()
        selectDifficulty.show()
        title.show()
        powersSelect.show()
    }
}