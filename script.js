let balls = [
    {
        x: (screen.width*13/15)/2,
        y: screen.height/2,
        ballColor: [],
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: 1,
        verticalControl: 1,
        distance: (screen.width*13/15)/120,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1
    }
]
let player1 = {
    p: 'player1',
    x: 10,
    y: screen.height*7/16,
    height: screen.height/4,
    color: 'white',
    lastPower: 0,
    powerGot: false,
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    moved: false
}
let player2 = {
    p: 'player2',
    x: (screen.width*13/15)-10,
    y: screen.height*7/16,
    height: screen.height/4,
    color: 'white',
    lastPower: 0,
    powerGot: false,
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    moved: false
}
let gameplaying = false
let timeout = false
let playerMoved = false
let isFull = false
let firstWarning = true
let canSpawnPower = false
let scoreLimit = 5
let isPower = false
let subtitle = 'Deixe o dispositivo na horizontal,\nrecarregue a pagina e deixe em tela cheia\n(botao em cima na direita), nessa ordem!'
let allPowers = [{p:'Fogo', t:7500, c:'green'}, {p:'Invertido', t:7500, c:'red'}, {p:'Multibola', t:7500, c:'white'},
{p:'Gol de ouro', t:7500, c:'white'}, {p:'Grande', t:7500, c:'green'}, {p:'Pequeno', t:7500, c:'red'}, {p:'Congelado', t:2000, c:'red'},]
let AIrandomizer = 1
let myCanvas,startButton,selectMode,selectDifficulty,AISpeed,fullScreen,page,imgdiv,gameMode,
powersSelect,title,powerInterval,stopPowerInterval1,stopPowerInterval2,scoreDisplay,
scoreLimitSelect,mainmenu,currentPower,font,spawnedPower,isPowers,timeinterval, closestBall

function preload(){
    font = loadFont('koulen.ttf')
}
function setup(){
    myCanvas = createCanvas((screen.width*13/15),screen.height)
    myCanvas.parent('page')
    background("#000000")
    myCanvas.position(screen.width*2/30,0,"fixed")
    textFont(font)
    fill(255)
    mainmenu = createDiv()
    mainmenu.parent('page')
    mainmenu.id('mainmenu')
    stylemenu()
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
    scoreLimitSelect = createInput(5, 'number')
    scoreLimitSelect.parent('lim')
    scoreLimitSelect.input(setInput)
    fullScreen = createImg('screen.png')
    fullScreen.position((screen.width*13/15)-60, 10)
    fullScreen.mousePressed(activateFullscreen)
    fullScreen.size(50,50)
    fullScreen.parent('page')
    imgdiv = createDiv()
    imgdiv.position((screen.width*13/15)-60, 10)
    imgdiv.size(50,50)
    imgdiv.mousePressed(activateFullscreen)
    imgdiv.parent('page')
    page = document.getElementById('page')
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0), color(138,43,226))
    textAlign(LEFT)
    textSize(14)
    text('patch 1.5', 5, 15)
    textAlign(CENTER)
    textSize(20)
    text(subtitle, (screen.width*13/15)/2, screen.height*2/7)
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
        case 'Grande':
            player.height = screen.height/2
            break
        case 'Fogo':
            player.activatedFire = true
            player.color = 'red'
            break
        case 'Congelado':
            player.activatedIce = true
            player.color = 'blue'
            break
        case 'Multibola':
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
                ball.distance = (screen.width*13/15)/120
                ball.ballColorIndex = ball.ballColorIndex==1?0:ball.ballColorIndex
                ball.ballColorIndex = ball.ballColorIndex==3?2:ball.ballColorIndex
            })
            balls[balls.length-1]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0), color(138,43,226))
            break
        case 'Invertido':
            player.y = 0
            player.activatedInverted = true
            break
        case 'Pequeno':
            player.height = screen.height/8
            break
        case 'Gol de ouro':
            ball.scoreValue = 2
            ball.ballColorIndex = 2
            break
    }
}

function stopPower(power, player){
    player.powerGot = false
    switch(allPowers[power].p){
        case 'Pequeno':
        case 'Grande':
            player.height = screen.height/4
            break
        case 'Fogo':
            player.activatedFire = false
            player.color = 'white'
            break
        case 'Congelado':
            player.activatedIce = false
            player.color = 'white'
            break
        case 'Invertido':
            player.activatedInverted = false
            break
        default:
            break
    }
}

function draw(){
    if(gameplaying&&!timeout){
        clear()
        background("#000000")
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
        text(player1.score+" - "+player2.score, (screen.width*13/15)/2, screen.height/10)
        if(canSpawnPower){
            let xPos = Math.floor(Math.random()*(screen.width*13/15)*2/3)+(screen.width*13/15)/6
            let yPos = Math.floor(Math.random()*screen.height*2/3)+screen.height/6
            currentPower = Math.floor(Math.random()*7)
            spawnedPower = {x: xPos, y: yPos}
            canSpawnPower = false
            isPower = true
        }
        if(isPower){
            let thisColor = color(170,0,255)
            thisColor.setAlpha(70)
            fill(thisColor)
            ellipse(spawnedPower.x, spawnedPower.y, screen.height/3)
            thisColor.setAlpha(255)
            textSize(40)
            textAlign(CENTER)
            text('?',spawnedPower.x, spawnedPower.y+10)
            balls.forEach(ball => {
                if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+screen.height/6){
                    let rightPlayer = ball.lastPlayerHit==1?player1:player2
                    stopPower(rightPlayer.lastPower, rightPlayer)
                    powerCatch(currentPower, rightPlayer, ball)
                    if(ball.lastPlayerHit==1){player1.powerGot=true}
                    else{player2.powerGot=true}
                    spawnedPower = {}
                    isPower = false
                }
            })
        }
        textSize(25)
        if(player1.powerGot){
            fill(allPowers[player1.lastPower].c)
            textAlign(LEFT)
            text(allPowers[player1.lastPower].p, 5, screen.height-15)
        }
        if(player2.powerGot){
            fill(allPowers[player2.lastPower].c)
            textAlign(RIGHT)
            text(allPowers[player2.lastPower].p, (screen.width*13/15)-5, screen.height-15)
        }
        if(gameMode){
            let xDist = (screen.width*13/15)
            let insaneMode = selectDifficulty.value()=='PESADELO'?true:false
            balls.forEach(ball => {
                let index = balls.indexOf(ball)
                if((screen.width*13/15)-ball.x<=xDist&&(!insaneMode||ball.horizontalControl==1)){
                    xDist = (screen.width*13/15)-ball.x
                    closestBall = index
                }
            })
            let target = balls[closestBall].y+(AISpeed*2.5*AIrandomizer*player2.height/(screen.height/4))
            player2.y = !player2.activatedIce&&(player2.y+(player2.height/2)>target&&player2.y>0)?player2.y-AISpeed:player2.y
            player2.y = !player2.activatedIce&&(player2.y+(player2.height/2)<target&&player2.y+player2.height<screen.height)?player2.y+AISpeed:player2.y
            player1.y = !player1.activatedIce&&!player1.activatedInverted&&(mouseY-(player1.height/2)>=0&&mouseY+(player1.height/2)<=screen.height)?mouseY-(player1.height/2):player1.y
            player1.y = player1.activatedInverted&&(screen.height-mouseY+(player1.height/2)<=screen.height&&screen.height-mouseY-(player1.height/2)>=0)?screen.height-mouseY-(player1.height/2):player1.y
            player1.moved = true
            player2.moved = true
        }
        else{
            if(device){
                touches.forEach(touch => {
                    if(touch.x < (screen.width*13/15)/2){
                        player1.y = !player1.activatedIce&&!player1.activatedInverted&&(touch.y-(player1.height/2)>=0&&touch.y+(player1.height/2)<=screen.height)?touch.y-(player1.height/2):player1.y
                        player1.y = player1.activatedInverted&&(screen.height-touch.y+(player1.height/2)<=screen.height&&screen.height-touch.y-(player1.height/2)>=0)?screen.height-touch.y-(player1.height/2):player1.y
                    }
                    else{
                        player2.y = !player2.activatedIce&&!player2.activatedInverted&&(touch.y-(player2.height/2)>=0&&touch.y+(player2.height/2)<=screen.height)?touch.y-(player2.height/2):player2.y
                        player2.y = player2.activatedInverted&&(screen.height-touch.y+(player2.height/2)<=screen.height&&screen.height-touch.y-(player2.height/2)>=0)?screen.height-touch.y-(player2.height/2):player2.y
                    }
                })
                player1.moved = true
                player2.moved = true
            }
            else{
                if(!player1.activatedIce&&(keyIsDown(SHIFT)&&!player1.activatedInverted)||(keyIsDown(CONTROL)&&player1.activatedInverted)){
                    player1.y = player1.y<=0?player1.y:player1.y-15
                    player1.moved = true
                }
                if(!player1.activatedIce&&(keyIsDown(CONTROL)&&!player1.activatedInverted)||(keyIsDown(SHIFT)&&player1.activatedInverted)){
                    player1.y = player1.y+player1.height>=screen.height?player1.y:player1.y+15
                    player1.moved = true
                }
                if(!player2.activatedIce&&(keyIsDown(UP_ARROW)&&!player2.activatedInverted)||(keyIsDown(DOWN_ARROW)&&player2.activatedInverted)){
                    player2.y = player2.y<=0?player2.y:player2.y-15
                    player2.moved = true
                }
                if(!player2.activatedIce&&(keyIsDown(DOWN_ARROW)&&!player2.activatedInverted)||(keyIsDown(UP_ARROW)&&player2.activatedInverted)){
                    player2.y = player2.y+player2.height>=screen.height?player2.y:player2.y+15
                    player2.moved = true
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
            ball.distance += (screen.width*13/15)/1350
            ball.horizontalControl = -1
            playerMoved = player2.moved
            changeAngle(player2, index)
            if(player2.activatedFire){
                clearTimeout(stopPowerInterval2)
                stopPower(0, player2)
                ball.distance += (screen.width*13/15)/70
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
            ball.distance += (screen.width*13/15)/1350
            ball.horizontalControl = 1
            playerMoved = player1.moved
            changeAngle(player1, index)
            if(player1.activatedFire){
                clearTimeout(stopPowerInterval1)
                stopPower(0, player1)
                ball.distance += (screen.width*13/15)/70
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
        if(ball.distance>=((screen.width*13/15)/70)+((screen.width*13/15)/120)){
            if(ball.scoreValue==1){ball.ballColorIndex = 1}
            else{ball.ballColorIndex = 3}
        }
    })
    player1.moved = false
    player2.moved = false
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
    if(player1.score>=scoreLimit&&scoreLimit!=0){
        subtitle = 'Jogador 1 venceu!\n'+player1.score+' - '+player2.score
        start()
        return
    }
    if(player2.score>=scoreLimit&&scoreLimit!=0){
        subtitle = 'Jogador 2 venceu\n'+player1.score+' - '+player2.score
        start()
        return
    }
    balls = [{
            x: (screen.width*13/15)/2,
            y: screen.height/2,
            ballColor: [],
            ballColorIndex: 0,
            ballTrack: [],
            horizontalControl: 1,
            verticalControl: 1,
            distance: (screen.width*13/15)/120,
            angle: 0,
            lastPlayerHit: 1,
            scoreValue: 1
        }]
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0), color(138,43,226))
    player1.y = screen.height*7/16
    player2.y = screen.height*7/16
}

function start(){
    if(!gameplaying){
        gameMode = selectMode.value() === '1 Player'?true:false
        if(!gameMode&&firstWarning){
            alert("MOBILE: cada um controla a barra no seu lado da tela\nPC: use as teclas Shift/Control e as setas cima/baixo \n(clique novamente na tela cheia 2 vezes)")
            firstWarning = false
        }
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
                AISpeed = screen.height/28
                break
        }
        isPowers = powersSelect.value() === 'Com poderes'?true:false
        if(isPowers){
            powerInterval = setInterval(spawnPower, 6000)
            setTimeout(spawnPower, 1000)
        }
        gameplaying = true
        subtitle = 'Deixe o dispositivo na horizontal,\nrecarregue a pagina e deixe em tela cheia\n(botao em cima na direita), nessa ordem!'
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
        gameplaying = false
        isPower = false
        canSpawnPower = false
        balls = [{
            x: (screen.width*13/15)/2,
            y: screen.height/2,
            ballColor: [],
            ballColorIndex: 0,
            ballTrack: [],
            horizontalControl: 1,
            verticalControl: 1,
            distance: (screen.width*13/15)/100,
            angle: 0,
            lastPlayerHit: 1,
            scoreValue: 1
        }]
        balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0), color(138,43,226))
        player1.score = 0
        player1.y = screen.height*7/16
        player1.powerGot = false
        stopPower(player1.lastPower, player1)
        player2.score = 0
        player2.y = screen.height*7/16
        player2.powerGot = false
        stopPower(player2.lastPower, player2)
        stylemenu()
        startButton.html("Start")
        fill(255)
        textSize(14)
        textAlign(LEFT)
        text('patch 1.5', 5, 15)
        textAlign(CENTER)
        textSize(20)
        text(subtitle, (screen.width*13/15)/2, screen.height*2/7)
        selectMode.show()
        selectDifficulty.show()
        powersSelect.show()
        title.show()
        scoreDisplay.show()
    }
}

function stylemenu(){
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
}