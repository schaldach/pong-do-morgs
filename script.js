let windowHeight = screen.height
let windowWidth = screen.width
let balls = [
    {
        x: (windowWidth*13/15)/2,
        y: windowHeight/2,
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: 1,
        verticalControl: 1,
        distance: (windowWidth*13/15)/120,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1,
        sneak: false,
        timeangle: 0,
        horizontaltime: 1,
        verticaltime: 1,
        timetravel: false,
        timereturn: false
    }
]
let player1 = {
    p: 'player1',
    x: 10,
    y: windowHeight*7/16,
    height: windowHeight/3,
    color: 'white',
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    activatedInvisible: false,
    moved: false,
    onlinePowers: []
}
let player2 = {
    p: 'player2',
    x: (windowWidth*13/15)-10,
    y: windowHeight*7/16,
    height: windowHeight/3,
    color: 'white',
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    activatedInvisible: false,
    moved: false,
    onlinePowers: []
}
let ballColors = []
let gameplaying = false
let timeout = false
let playerMoved = false
let isFull = false
let canSpawnPower = false
let anyPowerActive = true
let paused = false
let scoreLimit = 5
let isPower = false
let allPowers = [{p:'Fogo', t:7500, c:'green', active:true}, {p:'Invertido', t:5000, c:'red', active:true}, 
{p:'Multibola', t:5000, c:'white', active:true},{p:'Gol de ouro', t:5000, c:'white', active:true}, 
{p:'Grande', t:7500, c:'green', active:true}, {p:'Pequeno', t:7500, c:'red', active:true}, 
{p:'Congelado', t:1750, c:'red', active:true},{p:'Invisivel', t:3500, c:'red', active:true}, 
{p:'Sorrateiro', t:7500, c:'green', active:true}, {p:'Temporizador', t:3250, c:'white', active:true}]
let currentAllPowers = []
let AIrandomizer = 1
let numberOfPowers = 10
let currentPower = 0
let powerInterval

function preload(){
    font = loadFont('koulen.ttf')
}
function setup(){
    myCanvas = createCanvas((windowWidth*13/15),windowHeight)
    myCanvas.parent('page')
    background("#000000")
    myCanvas.position(windowWidth/15,0,"fixed")
    textFont(font)
    fill(255)
    mainmenu = createDiv()
    mainmenu.parent('page')
    mainmenu.id('mainmenu')
    mainmenu.addClass('mainmenu')
    title = createDiv('Pong do Morgs')
    title.addClass('titulo')
    title.parent('mainmenu')
    subtitle = createDiv('Jogue em tela cheia e horizontal!<br/>(botao em cima na direita)')
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
    advancedConfigs = createButton('Outras Configs')
    advancedConfigs.parent('buttonmenu')
    advancedConfigs.mousePressed(goToConfigs)
    fullScreen = createImg('screen.png')
    fullScreen.addClass('imgdiv')
    fullScreen.parent('page')
    imgdiv = createDiv()
    imgdiv.addClass('imgdiv')
    imgdiv.mousePressed(activateFullscreen)
    imgdiv.parent('page')
    advancedmenu = createDiv('Poderes disponiveis')
    advancedmenu.parent('page')
    advancedmenu.id('admenu')
    advancedmenu.addClass('admenu')
    configsmenu = createDiv()
    configsmenu.parent('admenu')
    configsmenu.id('configsmenu')
    configsmenu.addClass('configs')
    advancedmenu.hide()
    Fireb = createButton('Fogo')
    Fireb.mousePressed(() => changePowerActive('Fogo', Fireb))
    Fireb.parent('configsmenu')
    Iceb = createButton('Congelado')
    Iceb.mousePressed(() => changePowerActive('Congelado', Iceb))
    Iceb.parent('configsmenu')
    Bigb = createButton('Grande')
    Bigb.mousePressed(() => changePowerActive('Grande', Bigb))
    Bigb.parent('configsmenu')
    Smallb = createButton('Pequeno')
    Smallb.mousePressed(() => changePowerActive('Pequeno', Smallb))
    Smallb.parent('configsmenu')
    Invertedb = createButton('Invertido')
    Invertedb.mousePressed(() => changePowerActive('Invertido', Invertedb))
    Invertedb.parent('configsmenu')
    Goldb = createButton('Gol de ouro')
    Goldb.mousePressed(() => changePowerActive('Gol de ouro', Goldb))
    Goldb.parent('configsmenu')
    Multib = createButton('Multibola')
    Multib.mousePressed(() => changePowerActive('Multibola', Multib))
    Multib.parent('configsmenu')
    Invisibleb = createButton('Invisivel')
    Invisibleb.mousePressed(() => changePowerActive('Invisivel', Invisibleb))
    Invisibleb.parent('configsmenu')
    Sneakb = createButton('Sorrateiro')
    Sneakb.mousePressed(() => changePowerActive('Sorrateiro', Sneakb))
    Sneakb.parent('configsmenu')
    Timeb = createButton('Temporizador')
    Timeb.mousePressed(() => changePowerActive('Temporizador', Timeb))
    Timeb.parent('configsmenu')
    spawnSpeed = createDiv('Velocidade dos poderes')
    spawnSpeed.parent('admenu')
    spawnSpeed.id('sped')
    spawnSpeed.addClass('sped')
    powerSpeedSelect = createSelect()
    powerSpeedSelect.option('Devagar')
    powerSpeedSelect.option('Normal')
    powerSpeedSelect.option('Loucura')
    powerSpeedSelect.parent('sped')
    powerSpeedSelect.selected('Normal')
    mainConfigs = createButton('Voltar')
    mainConfigs.mousePressed(goToMain)
    mainConfigs.parent('admenu')
    pauseButton = createButton('Pause')
    pauseButton.addClass('pausebutton')
    pauseButton.mousePressed(pausegame)
    pauseButton.hide()
    pauseButton.parent('page')
    pauseMenu = createDiv('')
    pauseMenu.id('pausemenu')
    pauseMenu.parent('page')
    pauseMenu.hide()
    pauseMenu.addClass('pausemenu')
    resumeButton = createButton('Voltar')
    resumeButton.mousePressed(resume)
    resumeButton.parent('pausemenu')
    resetButton = createButton('Resetar')
    resetButton.parent('pausemenu')
    resetButton.mousePressed(reset)
    p1powers = createDiv()
    p1powers.addClass('powershow')
    p1powers.style('right','37.5vw')
    p1powers.id('p1powers')
    p1powers.parent('page')
    p2powers = createDiv()
    p2powers.addClass('powershow')
    p2powers.style('left','37.5vw')
    p2powers.id('p2powers')
    p2powers.parent('page')
    page = document.getElementById('page')
    ballColors.push(color(255,255,255), color(255,0,0), color(255,255,0), color(255,0,230), color(30,225,232))
    textAlign(LEFT)
    textSize(14)
    text('patch 1.62', 5, 15)
    noStroke()
}
function setInput(){
    scoreLimit = parseInt(this.value())
}
window.addEventListener("resize", function() {
    windowHeight = screen.height
    windowWidth = screen.width
    myCanvas = createCanvas((windowWidth*13/15),windowHeight)
    background("#000000")
    myCanvas.position(windowWidth/15,0,"fixed")
    textAlign(LEFT)
    textSize(14)
    text('patch 1.62', 5, 15)
    balls[0].x = (windowWidth*13/15)/2
    balls[0].y = windowHeight/2
    balls[0].distance = (windowWidth*13/15)/120
    player1.y = windowHeight*7/16
    player1.height = windowHeight/3
    player2.x = (windowWidth*13/15)-10
    player2.y = windowHeight*7/16
    player2.height = windowHeight/3
});
window.addEventListener("orientationchange", function() {
    windowHeight = screen.height
    windowWidth = screen.width
    myCanvas = createCanvas((windowWidth*13/15),windowHeight)
    background("#000000")
    myCanvas.position(windowWidth/15,0,"fixed")
    textAlign(LEFT)
    textSize(14)
    text('patch 1.62', 5, 15)
    balls[0].x = (windowWidth*13/15)/2
    balls[0].y = windowHeight/2
    balls[0].distance = (windowWidth*13/15)/120
    player1.y = windowHeight*7/16
    player1.height = windowHeight/3
    player2.x = (windowWidth*13/15)-10
    player2.y = windowHeight*7/16
    player2.height = windowHeight/3
});
function activateFullscreen(){
    if (page.requestFullscreen && !isFull) { 
        page.requestFullscreen({navigationUI:'hide'})
        isFull = true
        if(device&&windowHeight > windowWidth){
            screen.orientation.lock("landscape-primary")
        }
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
    allPowers.forEach(power => {
        if(power.active){
            currentAllPowers.push(power)
        }
    })
    numberOfPowers = currentAllPowers.length
    if(numberOfPowers<1){
        anyPowerActive = false
    }
}
function changePowerActive(power, button){
    let index = allPowers.findIndex(powers => {
        return powers.p === power
    })
    allPowers[index].active = !allPowers[index].active
    if(allPowers[index].active){
        button.removeClass('redbutton')
        anyPowerActive = true
    }
    else{button.addClass('redbutton')}
}
function spawnPower(){
    canSpawnPower = true
}
function updatePowerShow(){
    p1powers.html('')
    p2powers.html('')
    player1['onlinePowers'].forEach(onpower => {
        let div = createDiv(currentAllPowers[onpower.index].p)
        div.addClass(currentAllPowers[onpower.index].c)
        div.parent('p1powers')
    })
    player2['onlinePowers'].forEach(onpower => {
        let div = createDiv(currentAllPowers[onpower.index].p)
        div.addClass(currentAllPowers[onpower.index].c)
        div.parent('p2powers')
    })
}
function powerCatch(power, player, ball){
    switch(currentAllPowers[power].p){
        case 'Grande':
            player.height = windowHeight*11/20
            break
        case 'Fogo':
            player.activatedFire = true
            determinePlayerColors(player)
            break
        case 'Congelado':
            player.activatedIce = true
            determinePlayerColors(player)
            break
        case 'Multibola':
            balls.push({
                    x: ball.x,
                    y: ball.y,        
                    ballColorIndex: 0,
                    ballTrack: [],
                    horizontalControl: ball.horizontalControl*-1,
                    verticalControl: ball.verticalControl*-1,
                    distance: 0,
                    angle: ball.angle,
                    lastPlayerHit: 1,
                    scoreValue: 1,
                    sneak: false,
                    timeangle: 0,
                    horizontaltime: 1,
                    verticaltime: 1,
                    timetravel: false,
                    timereturn: false
                })
            balls.forEach(ball => {
                ball.distance = (windowWidth*13/15)/120
            })
            break
        case 'Invertido':
            player.y = 0
            player.activatedInverted = true
            break
        case 'Pequeno':
            player.height = windowHeight/6
            break
        case 'Gol de ouro':
            ball.scoreValue = 2
            break
        case 'Invisivel':
            player.activatedInvisible = true
            determinePlayerColors(player)
            break
        case 'Sorrateiro':
            player.activatedSneak = true
            determinePlayerColors(player)
            break
        case 'Temporizador':
            if(ball.timetravel||ball.timereturn){return}
            ball.timeangle = ball.angle
            ball.horizontaltime = ball.horizontalControl
            ball.verticaltime = ball.verticalControl
            ball.ballTrack = []
            ball.timetravel = true
            break
        default:
            break
    }
    player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== power)
    let time = new Date()
    player['onlinePowers'].push({
        index: power,
        expire: time.getTime()+currentAllPowers[power].t,
        ball: balls.indexOf(ball)
    })
    updatePowerShow()
}

function stopPower(power, player, ball){
    player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== power)
    updatePowerShow()
    switch(currentAllPowers[power].p){
        case 'Pequeno':
        case 'Grande':
            player.height = windowHeight/3
            break
        case 'Fogo':
            player.activatedFire = false
            determinePlayerColors(player)
            break
        case 'Congelado':
            player.activatedIce = false
            determinePlayerColors(player)
            break
        case 'Invertido':
            player.activatedInverted = false
            break
        case 'Invisivel':
            player.activatedInvisible = false
            determinePlayerColors(player)
        case 'Sorrateiro':
            player.activatedSneak = false
            determinePlayerColors(player)
            break
        case 'Temporizador':
            if(!balls[ball].timereturn){
                balls[ball].timetravel = false
                balls[ball].timereturn = true
            }
        default:
            break
    }
}
function spawnNewPower(){
    let xPos = Math.floor(Math.random()*(windowWidth*13/15)*2/3)+(windowWidth*13/15)/6
    let yPos = Math.floor(Math.random()*windowHeight*2/3)+windowHeight/6
    currentPower = Math.floor(Math.random()*numberOfPowers)
    spawnedPower = {x: xPos, y: yPos}
    canSpawnPower = false
    isPower = true
}
function drawPowerCircle(){
    let thisColor = color(170,0,255)
    thisColor.setAlpha(70)
    fill(thisColor)
    ellipse(spawnedPower.x, spawnedPower.y, windowHeight*2/5)
    thisColor.setAlpha(255)
    textSize(40)
    textAlign(CENTER)
    text('?',spawnedPower.x, spawnedPower.y+10)
}
function goToConfigs(){
    mainmenu.style('display','none')
    advancedmenu.style('display','flex')
}
function goToMain(){
    mainmenu.style('display','flex')
    advancedmenu.style('display','none')
}
function pausegame(){
    pauseButton.hide()
    pauseMenu.style('display', 'flex')
    paused = true
}
function resume(){
    pauseButton.show()
    pauseMenu.hide()
    paused = false
}

function draw(){
    if(gameplaying&&!timeout&&!paused){
        clear()
        background("#000000")
        fill(255)
        textAlign(LEFT)
        textSize(14)
        text('patch 1.62', 5, 15)
        textAlign(CENTER)
        textSize(37)
        text(player1.score+" - "+player2.score, (windowWidth*13/15)/2, windowHeight/7)
        if(canSpawnPower){
            spawnNewPower()
        }
        if(isPower){
            drawPowerCircle()
            balls.forEach(ball => {
                if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+windowHeight/5){
                    let rightPlayer = ball.lastPlayerHit==1?player1:player2
                    powerCatch(currentPower, rightPlayer, ball)
                    spawnedPower = {}
                    isPower = false
                }
            })
        }
        textSize(26)
        if(gameMode){
            let xDist = 0
            balls.forEach(ball => {
                let index = balls.indexOf(ball)
                if(ball.x>xDist){
                    xDist = ball.x
                    closestBall = index
                }
            })
            let target = balls[closestBall].y+(AISpeed*4*AIrandomizer*player2.height/(windowHeight/3))
            player2.y = !player2.activatedIce&&(player2.y+(player2.height/2)>target&&player2.y>0)?player2.y-AISpeed:player2.y
            player2.y = !player2.activatedIce&&(player2.y+(player2.height/2)<target&&player2.y+player2.height<windowHeight)?player2.y+AISpeed:player2.y
            player1.y = !player1.activatedIce&&!player1.activatedInverted&&(mouseY-(player1.height/2)>=0&&mouseY+(player1.height/2)<=windowHeight)?mouseY-(player1.height/2):player1.y
            player1.y = player1.activatedInverted&&(windowHeight-mouseY+(player1.height/2)<=windowHeight&&windowHeight-mouseY-(player1.height/2)>=0)?windowHeight-mouseY-(player1.height/2):player1.y
            player1.moved = true
            player2.moved = true
        }
        else{
            if(device){
                touches.forEach(touch => {
                    if(touch.x < (windowWidth*13/15)/2){
                        player1.y = !player1.activatedIce&&!player1.activatedInverted&&(touch.y-(player1.height/2)>=0&&touch.y+(player1.height/2)<=windowHeight)?touch.y-(player1.height/2):player1.y
                        player1.y = player1.activatedInverted&&(windowHeight-touch.y+(player1.height/2)<=windowHeight&&windowHeight-touch.y-(player1.height/2)>=0)?windowHeight-touch.y-(player1.height/2):player1.y
                    }
                    else{
                        player2.y = !player2.activatedIce&&!player2.activatedInverted&&(touch.y-(player2.height/2)>=0&&touch.y+(player2.height/2)<=windowHeight)?touch.y-(player2.height/2):player2.y
                        player2.y = player2.activatedInverted&&(windowHeight-touch.y+(player2.height/2)<=windowHeight&&windowHeight-touch.y-(player2.height/2)>=0)?windowHeight-touch.y-(player2.height/2):player2.y
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
                    player1.y = player1.y+player1.height>=windowHeight?player1.y:player1.y+15
                    player1.moved = true
                }
                if(!player2.activatedIce&&(keyIsDown(UP_ARROW)&&!player2.activatedInverted)||(keyIsDown(DOWN_ARROW)&&player2.activatedInverted)){
                    player2.y = player2.y<=0?player2.y:player2.y-15
                    player2.moved = true
                }
                if(!player2.activatedIce&&(keyIsDown(DOWN_ARROW)&&!player2.activatedInverted)||(keyIsDown(UP_ARROW)&&player2.activatedInverted)){
                    player2.y = player2.y+player2.height>=windowHeight?player2.y:player2.y+15
                    player2.moved = true
                }
            }
        }
        balls.forEach(ball => {
            if(ball['ballTrack'].length>5&&!ball.timetravel&&!ball.timereturn){ball['ballTrack'].shift()}
            if(!ball.timereturn){ball['ballTrack'].push({x: ball.x, y:ball.y})}
            ball['ballTrack'].forEach(past => {
                ballColors[ball.ballColorIndex].setAlpha(50)
                fill(ballColors[ball.ballColorIndex])
                ellipse(past.x, past.y, 20)
                ballColors[ball.ballColorIndex].setAlpha(255)
            })
            fill(ballColors[ball.ballColorIndex])
            ellipse(ball.x, ball.y, 20)
            if(ball.sneak){
                let horizontalballDistance = Math.cos(ball.angle)*ball.distance*6.5*ball.horizontalControl
                fill('green')
                rect(ball.x-horizontalballDistance,0,horizontalballDistance+15*ball.horizontalControl,windowHeight)
            }
        })
        fill(player1.color)
        rect(player1.x, player1.y, -10, player1.height)
        fill(player2.color)
        rect(player2.x, player2.y, 10, player2.height)
        checkActivePowers()
        calculateball()
    }
}

function checkActivePowers(){
    let time = new Date()
    player1['onlinePowers'].forEach(onpower => {
        if(time.getTime()>onpower.expire){
            stopPower(onpower.index, player1, onpower.ball)
        }
    })
    player2['onlinePowers'].forEach(onpower => {
        if(time.getTime()>onpower.expire){
            stopPower(onpower.index, player2, onpower.ball)
        }
    })
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
            playerMoved = player2.moved
            ball.horizontalControl = -1
            ball.distance += (windowWidth*13/15)/1400
            changeAngle(player2, index)
            if((ball.y-10>player2.y+player2.height)||(ball.y+10<player2.y)){
                player1.score+=ball.scoreValue
                timeout = true
                setTimeout(winner, 250)
                return
            }
            if(player2.activatedFire){
                const fireIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Fogo';
                })
                stopPower(fireIndex, player2)
                ball.distance += (windowWidth*13/15)/70
            }
            if(player2.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Sorrateiro';
                })
                stopPower(sneakIndex, player2)
                ball.sneak = true
            }
        }
        if(ball.x-10<=player1.x){
            ball.lastPlayerHit = 1
            playerMoved = player1.moved
            ball.horizontalControl = 1
            ball.distance += (windowWidth*13/15)/1400
            changeAngle(player1, index)
            if((ball.y-10>player1.y+player1.height)||(ball.y+10<player1.y)){
                player2.score+=ball.scoreValue
                timeout = true
                setTimeout(winner, 250)
                return
            }
            if(player1.activatedFire){
                const fireIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Fogo';
                })
                stopPower(fireIndex, player1)
                ball.distance += (windowWidth*13/15)/70
            }
            if(player1.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {
                    return power.p === 'Sorrateiro';
                })
                stopPower(sneakIndex, player1)
                ball.sneak = true
            }
        }
        if(ball.sneak&&ball.horizontalControl===1){
            if(ball.x>(windowWidth*13/15)*3/7){ball.sneak=false}
        }
        if(ball.sneak&&ball.horizontalControl===-1){
            if(ball.x<(windowWidth*13/15)*4/7){ball.sneak=false}
        }
        if(ball.timereturn){
            let length = ball['ballTrack'].length
            ball.x = ball['ballTrack'][length-1].x
            ball.y = ball['ballTrack'][length-1].y
            ball['ballTrack'].pop()
            if(length-1 === 0){
                ball.horizontalControl = ball.horizontaltime*-1
                ball.verticalControl = ball.verticaltime*-1
                ball.angle = ball.timeangle
                ball.timereturn = false
            }
        }
        else{
            if(ball.y+10>windowHeight){
                ball.verticalControl = -1
            }
            if(ball.y-10<0){
                ball.verticalControl = 1
            }
            ball.x += horizontalballDistance*ball.horizontalControl
            ball.y += verticalballDistance*ball.verticalControl
        }
    })
    determineColors()
    player1.moved = false
    player2.moved = false
}
function determineColors(){
    balls.forEach(ball => {
        ball.ballColorIndex = 0
        if(ball.timetravel||ball.timereturn){ball.ballColorIndex=4}
        if(ball.scoreValue===2){ball.ballColorIndex=2}
        if(ball.distance>((windowWidth*13/15)/70)+((windowWidth*13/15)/120)){
            if(ball.scoreValue===2){ball.ballColorIndex=3}
            else{ball.ballColorIndex=1}
        }
    })
}
function determinePlayerColors(player){
    player.color = 'white'
    if(player.activatedSneak){player.color = 'green'}
    if(player.activatedIce){player.color = 'blue'}
    if(player.activatedFire){player.color = 'red'}
    if(player.activatedInvisible){player.color = 'black'}
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
    if(player1.score>=scoreLimit&&scoreLimit>0){
        subtitle.html(`Jogador 1 venceu!<br/>${player1.score} - ${player2.score}`)
        reset()
        return
    }
    else if(player2.score>=scoreLimit&&scoreLimit>0){
        subtitle.html(`Jogador 2 venceu!<br/>${player1.score} - ${player2.score}`)
        reset()
        return
    }
    balls = [{
        x: (windowWidth*13/15)/2,
        y: windowHeight/2,
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: Math.random()>0.5?1:-1,
        verticalControl: 1,
        distance: (windowWidth*13/15)/120,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1,
        sneak: false,
        timeangle: 0,
        horizontaltime: 1,
        verticaltime: 1,
        timetravel: false,
        timereturn: false
    }]
    player1.y = windowHeight*7/16
    player2.y = windowHeight*7/16
}

function start(){
    gameMode = selectMode.value() === '1 Player'?true:false
    switch(selectDifficulty.value()){
        case 'Facil':
            AISpeed = windowHeight/160
            break
        case 'Medio':
            AISpeed = windowHeight/125
            break
        case 'Dificil':
            AISpeed = windowHeight/80
            break
        case 'PESADELO':
            AISpeed = windowHeight/40
            break
    }
    switch(powerSpeedSelect.value()){
        case 'Devagar':
            powerSpeed = 8500
            break
        case 'Normal':
            powerSpeed = 5500
            break
        case 'Loucura':
            powerSpeed = 2500
            break
    }
    loadPowersActive()
    isPowers = powersSelect.value() === 'Com poderes'?true:false
    if(isPowers&&anyPowerActive){
        powerInterval = setInterval(spawnPower, powerSpeed)
        setTimeout(spawnPower, 1000)
    }
    gameplaying = true
    subtitle.html('Jogue em tela cheia e horizontal!<br/>(botao em cima na direita)')
    mainmenu.hide()
    fullScreen.hide()
    imgdiv.hide()
    pauseButton.show()
}

function reset(){
    clearInterval(powerInterval)
    clear()
    background("#000000")
    p1powers.html('')
    p2powers.html('')
    gameplaying = false
    isPower = false
    canSpawnPower = false
    paused = false
    player1.score = 0
    player1.y = windowHeight*7/16
    player1['onlinePowers'].forEach(onpower => {stopPower(onpower.index, player1)})
    player1['onlinePowers'] = []
    player2.score = 0
    player2.y = windowHeight*7/16
    player2['onlinePowers'].forEach(onpower => {stopPower(onpower.index, player2)})
    player2['onlinePowers'] = []
    balls = [{
        x: (windowWidth*13/15)/2,
        y: windowHeight/2,
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: 1,
        verticalControl: 1,
        distance: (windowWidth*13/15)/100,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1,
        sneak: false,
        timeangle: 0,
        horizontaltime: 1,
        verticaltime: 1,
        timetravel: false,
        timereturn: false
    }]
    currentAllPowers = []
    fill(255)
    textSize(14)
    textAlign(LEFT)
    text('patch 1.62', 5, 15)
    mainmenu.style('display', 'flex')
    fullScreen.show()
    imgdiv.show()
    pauseMenu.hide()
    pauseButton.hide()
}