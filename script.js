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
        scoreValue: 1,
        sneak: false
    }
]
let player1 = {
    p: 'player1',
    x: 10,
    y: screen.height*7/16,
    height: screen.height/3,
    color: 'white',
    lastPower: 0,
    powerGot: false,
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    moved: false
}
let player2 = {
    p: 'player2',
    x: (screen.width*13/15)-10,
    y: screen.height*7/16,
    height: screen.height/3,
    color: 'white',
    lastPower: 0,
    powerGot: false,
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    moved: false
}
let gameplaying = false
let timeout = false
let playerMoved = false
let isFull = false
let canSpawnPower = false
let scoreLimit = 5
let isPower = false
let allPowers = [{p:'Fogo', t:7500, c:'green', active:true}, {p:'Invertido', t:7500, c:'red', active:true}, {p:'Multibola', t:7500, c:'white', active:true},
{p:'Gol de ouro', t:7500, c:'white', active:true}, {p:'Grande', t:7500, c:'green', active:true}, {p:'Pequeno', t:7500, c:'red', active:true}, {p:'Congelado', t:2000, c:'red', active:true},
{p:'Invisivel', t:3750, c:'red', active:true}, {p:'Sorrateiro', t:7500, c:'green', active:true}, {p:'Temporizador', t:7500, c:'white', active:true}]
let currentAllPowers = []
let AIrandomizer = 1
let myCanvas,startButton,selectMode,selectDifficulty,AISpeed,fullScreen,page,imgdiv,gameMode,
powersSelect,title,powerInterval,stopPowerInterval1,stopPowerInterval2,scoreDisplay, powerSpeedSelect,
scoreLimitSelect,mainmenu,currentPower,font,spawnedPower,isPowers,timeinterval, closestBall, powerSpeed,
Fireb,Iceb,Bigb,Smallb,Invertedb,Goldb,Multib,Timeb,Sneakb,Invisibleb,Configs, subtitle, buttonMenu

function preload(){
    font = loadFont('koulen.ttf')
}
function setup(){
    myCanvas = createCanvas((screen.width*13/15),screen.height)
    myCanvas.parent('page')
    background("#000000")
    myCanvas.position(screen.width/15,0,"fixed")
    textFont(font)
    fill(255)
    mainmenu = createDiv()
    mainmenu.parent('page')
    mainmenu.id('mainmenu')
    mainmenu.addClass('mainmenu')
    title = createDiv('Pong do Morgs')
    title.addClass('titulo')
    title.parent('mainmenu')
    subtitle = createDiv('Deixe o dispositivo na horizontal, recarregue a pagina e deixe em tela cheia (botao em cima na direita), nessa ordem!')
    subtitle.addClass('subtitle')
    subtitle.parent('mainmenu')
    buttonMenu = createDiv('')
    buttonMenu.addClass('buttonmenu')
    buttonMenu.parent('mainmenu')
    buttonMenu.id('buttonmenu')
    startButton = createButton("Start")
    startButton.mousePressed(start)
    startButton.parent('buttonmenu')
    selectMode = createSelect();
    selectMode.option('1 Player')
    selectMode.option('2 Players')
    selectMode.parent('buttonmenu')
    selectDifficulty = createSelect()
    selectDifficulty.option('Facil')
    selectDifficulty.option('Medio')
    selectDifficulty.option('Dificil')
    selectDifficulty.option('PESADELO')
    selectDifficulty.selected('Medio')
    selectDifficulty.parent('buttonmenu')
    powersSelect = createSelect()
    powersSelect.option('Com poderes')
    powersSelect.option('Sem poderes')
    powersSelect.parent('buttonmenu')
    scoreDisplay = createDiv('Pontos para vencer')
    scoreDisplay.id('lim')
    scoreDisplay.parent('buttonmenu')
    scoreLimitSelect = createInput(5, 'number')
    scoreLimitSelect.parent('lim')
    scoreLimitSelect.input(setInput)
    powerSpeedSelect = createSelect()
    powerSpeedSelect.option('Devagar')
    powerSpeedSelect.option('Normal')
    powerSpeedSelect.option('Loucura')
    powerSpeedSelect.parent('buttonmenu')
    fullScreen = createImg('screen.png')
    fullScreen.position((screen.width*13/15)-60, 10)
    fullScreen.mousePressed(activateFullscreen)
    fullScreen.size(40,40)
    fullScreen.parent('page')
    imgdiv = createDiv()
    imgdiv.position((screen.width*13/15)-60, 10)
    imgdiv.size(40,40)
    imgdiv.mousePressed(activateFullscreen)
    imgdiv.parent('page')
    configsmenu = createDiv()
    configsmenu.parent('page')
    configsmenu.id('configsmenu')
    configsmenu.addClass('configs')
    configsmenu.hide()
    Fireb = createButton()
    Fireb.mousePressed(changePowerActive('Fogo'))
    Fireb.parent('configsmenu')
    Iceb = createButton()
    Iceb.mousePressed(changePowerActive('Congelado'))
    Iceb.parent('configsmenu')
    Bigb = createButton()
    Bigb.mousePressed(changePowerActive('Grande'))
    Bigb.parent('configsmenu')
    Smallb = createButton()
    Smallb.mousePressed(changePowerActive('Pequeno'))
    Smallb.parent('configsmenu')
    Invertedb = createButton()
    Invertedb.mousePressed(changePowerActive('Invertido'))
    Invertedb.parent('configsmenu')
    Goldb = createButton()
    Goldb.mousePressed(changePowerActive('Gol de ouro'))
    Goldb.parent('configsmenu')
    Multib = createButton()
    Multib.mousePressed(changePowerActive('Multibola'))
    Multib.parent('configsmenu')
    Invisibleb = createButton()
    Invisibleb.mousePressed(changePowerActive('Invisivel'))
    Invisibleb.parent('configsmenu')
    Sneakb = createButton()
    Sneakb.mousePressed(changePowerActive('Sorrateiro'))
    Sneakb.parent('configsmenu')
    Timeb = createButton()
    Timeb.mousePressed(changePowerActive('Temporizador'))
    Timeb.parent('configsmenu')
    page = document.getElementById('page')
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0), color(138,43,226))
    textAlign(LEFT)
    textSize(12)
    text('patch 1.52', 5, 15)
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
function loadPowersActive(){
    allPowers.forEach(anypower => {
        if(anypower.active){
            console.log('opa')
            currentAllPowers.push(anypower)
        }
    })
    console.log(currentAllPowers)
}
function changePowerActive(power){
    let index = allPowers.findIndex(powers => {
        return powers.p === power
    })
    allPowers[index].active = !allPowers[index].active
}

function spawnPower(){
    canSpawnPower = true
}

function powerCatch(power, player, ball){
    if(ball.horizontalControl===1){
        clearTimeout(stopPowerInterval1)
        stopPowerInterval1 = setTimeout(stopPower, currentAllPowers[power].t, power, player)
    }
    else{
        clearTimeout(stopPowerInterval2)
        stopPowerInterval2 = setTimeout(stopPower, currentAllPowers[power].t, power, player)
    }
    player.lastPower = power
    switch(currentAllPowers[power].p){
        case 'Grande':
            player.height = screen.height*11/20
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
                    scoreValue: 1,
                    sneak: false
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
            player.height = screen.height/6
            break
        case 'Gol de ouro':
            ball.scoreValue = 2
            ball.ballColorIndex = 2
            break
        case 'Invisivel':
            player.color = 'black'
            break
        case 'Sorrateiro':
            player.activatedSneak = true
            player.color = 'green'
            break
        case 'Temporizador':
            break
        default:
            break
    }
}

function stopPower(power, player){
    player.powerGot = false
    switch(currentAllPowers[power].p){
        case 'Pequeno':
        case 'Grande':
            player.height = screen.height/3
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
        case 'Invisivel':
            player.color = 'white'
        case 'Sorrateiro':
            player.activatedSneak = false
            player.color = 'white'
            break
        case 'Temporizador':
            break
        default:
            break
    }
}

function spawnNewPower(){
    let xPos = Math.floor(Math.random()*(screen.width*13/15)*2/3)+(screen.width*13/15)/6
    let yPos = Math.floor(Math.random()*screen.height*2/3)+screen.height/6
    currentPower = Math.floor(Math.random()*9)
    spawnedPower = {x: xPos, y: yPos}
    canSpawnPower = false
    isPower = true
}

function drawPowerCircle(){
    let thisColor = color(170,0,255)
    thisColor.setAlpha(70)
    fill(thisColor)
    ellipse(spawnedPower.x, spawnedPower.y, screen.height*2/5)
    thisColor.setAlpha(255)
    textSize(40)
    textAlign(CENTER)
    text('?',spawnedPower.x, spawnedPower.y+10)
}

function goToConfigs(){
    mainmenu.style('display','none')
    configsmenu.style('display','grid')
}
function goToMain(){
    mainmenu.style('display','flex')
    configsmenu.style('display','none')
}

function draw(){
    if(gameplaying&&!timeout){
        clear()
        background("#000000")
        fill(255)
        textAlign(LEFT)
        textSize(12)
        text('patch 1.52', 5, 15)
        textAlign(CENTER)
        textSize(37)
        text(player1.score+" - "+player2.score, (screen.width*13/15)/2, screen.height/9)
        if(canSpawnPower){
            spawnNewPower()
        }
        if(isPower){
            drawPowerCircle()
            balls.forEach(ball => {
                if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+screen.height/5){
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
        textSize(26)
        if(player1.powerGot){
            fill(currentAllPowers[player1.lastPower].c)
            textAlign(LEFT)
            text(currentAllPowers[player1.lastPower].p, 5, screen.height-16)
        }
        if(player2.powerGot){
            fill(currentAllPowers[player2.lastPower].c)
            textAlign(RIGHT)
            text(currentAllPowers[player2.lastPower].p, (screen.width*13/15)-5, screen.height-16)
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
            let target = balls[closestBall].y+(AISpeed*4*AIrandomizer*player2.height/(screen.height/3))
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
            if(ball.sneak){
                fill('green')
                rect(ball.x-15,0,30,screen.height)
            }
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
                const fireIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Fogo';
                })
                clearTimeout(stopPowerInterval2)
                stopPower(fireIndex, player2)
                ball.distance += (screen.width*13/15)/70
            }
            if(player2.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Sorrateiro';
                })
                clearTimeout(stopPowerInterval2)
                stopPower(sneakIndex, player2)
                ball.sneak = true
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
                const fireIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Fogo';
                })
                clearTimeout(stopPowerInterval1)
                stopPower(fireIndex, player1)
                ball.distance += (screen.width*13/15)/70
            }
            if(player1.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Sorrateiro';
                })
                clearTimeout(stopPowerInterval1)
                stopPower(sneakIndex, player1)
                ball.sneak = true
            }
            if((ball.y-10>player1.y+player1.height)||(ball.y+10<player1.y)){
                player2.score+=ball.scoreValue
                timeout = true
                timeinterval = setTimeout(winner, 250)
                return
            }
        }
        if(ball.horizontalControl===1){
            if(ball.x>screen.width/2){ball.sneak=false}
        }
        if(ball.horizontalControl===-1){
            if(ball.x<screen.width/2){ball.sneak=false}
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
            scoreValue: 1,
            sneak: false
        }]
    balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0), color(138,43,226))
    player1.y = screen.height*7/16
    player2.y = screen.height*7/16
}

function start(){
    if(!gameplaying){
        gameMode = selectMode.value() === '1 Player'?true:false
        switch(selectDifficulty.value()){
            case 'Facil':
                AISpeed = screen.height/160
                break
            case 'Medio':
                AISpeed = screen.height/125
                break
            case 'Dificil':
                AISpeed = screen.height/80
                break
            case 'PESADELO':
                AISpeed = screen.height/40
                break
        }
        switch(powerSpeedSelect.value()){
            case 'Devagar':
                powerSpeed = 9000
                break
            case 'Normal':
                powerSpeed = 6000
                break
            case 'Loucura':
                powerSpeed = 3000
                break
        }
        isPowers = powersSelect.value() === 'Com poderes'?true:false
        if(isPowers){
            powerInterval = setInterval(spawnPower, powerSpeed)
            setTimeout(spawnPower, 1000)
        }
        gameplaying = true
        startButton.html("Resetar")
        goToMain()
        selectMode.hide()
        selectDifficulty.hide()
        powersSelect.hide()
        scoreDisplay.hide()
        powerSpeedSelect.hide()
        title.hide()
        subtitle.hide()
        loadPowersActive()
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
            scoreValue: 1,
            sneak: false
        }]
        balls[0]['ballColor'].push(color(255,255,255), color(255,0,0), color(255,255,0), color(138,43,226))
        player1.score = 0
        player1.y = screen.height*7/16
        player1.powerGot = false
        clearTimeout(stopPowerInterval1)
        stopPower(player1.lastPower, player1)
        player2.score = 0
        player2.y = screen.height*7/16
        player2.powerGot = false
        clearTimeout(stopPowerInterval2)
        stopPower(player2.lastPower, player2)
        startButton.html("Start")
        fill(255)
        textSize(14)
        textAlign(LEFT)
        text('patch 1.52', 5, 15)
        powerSpeedSelect.show()
        selectMode.show()
        selectDifficulty.show()
        powersSelect.show()
        title.show()
        scoreDisplay.show()
        subtitle.show()
    }
}