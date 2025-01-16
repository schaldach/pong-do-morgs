let windowHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
let balls = [
    {
        x: (windowWidth*4/5)/2,
        y: windowHeight/2,
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: 1,
        verticalControl: 1,
        distance: (windowWidth*4/5)/120,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1,
        sneak: false,
        timeangle: 0,
        horizontaltime: 1,
        verticaltime: 1,
        timetravel: false,
        timereturn: false,
        laser: false,
        shielded: false,
        sneakBalls: []
    }
]
let player1 = {
    p: 'player1',
    x: 10,
    y: windowHeight*7/16,
    speed: windowHeight/60,
    height: windowHeight/3,
    color: 'white',
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    activatedInvisible: false,
    activatedThief: false,
    activatedHook: false,
    borderless: false,
    wind: {active:false,direction:''},
    moved: false,
    onlinePowers: [],
    up: false,
    down: false
}
let player2 = {
    p: 'player2',
    x: (windowWidth*4/5)-10,
    y: windowHeight*7/16,
    speed: windowHeight/60,
    height: windowHeight/3,
    color: 'white',
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    activatedInvisible: false,
    activatedThief: false,
    activatedHook: false,
    borderless: false,
    wind: {active:false,direction:''},
    moved: false,
    onlinePowers: [],
    up: false,
    down: false
}
let ballColors = []
let sound = false
let gameplaying = false
let timeout = false
let playerMoved = false
let isFull = false
let canSpawnPower = false
let anyPowerActive = true
let paused = false
let lastStartingHorizontalControl = 1
let firstwarning2 = true
let firstwarning1 = true
let musicajogo = new Audio('./assets/audio/musicadomenu.mp3')
let efeito1 = new Audio('./assets/audio/hitsound1.mp3')
let efeito2 = new Audio('./assets/audio/hitsound2.mp3')
let efeito3 = new Audio('./assets/audio/hitsound3.mp3')
let menusom = new Audio('./assets/audio/menusound.mp3')
let vitoriasom = new Audio('./assets/audio/win.mp3')
let powerpickupsom = new Audio('./assets/audio/pickup.mp3')
let pointsom = new Audio('./assets/audio/point.mp3')
let scoreLimit = 5
let allPowers = [{p:'Fire', t:7500, c:'green', active:true}, {p:'Inverted', t:5000, c:'red', active:true}, 
{p:'Multiball', t:5000, c:'white', active:true}, {p:'Big', t:7500, c:'green', active:true}, 
{p:'Small', t:7500, c:'red', active:true}, {p:'Golden goal', t:5000, c:'white', active:true},
{p:'Flares', t:7500, c:'green', active:true}, {p:'Frozen', t:1750, c:'red', active:true},
{p:'Timer', t:3000, c:'white', active:true}, {p:'Hook', t:7500, c:'green', active:true}, 
{p:'Invisivel', t:3500, c:'red', active:true}, {p:'Black hole', t:10000, c:'white', active:true},
{p:'Laser', t:750, c:'green', active:true}, {p:'Discoordinated', t:5000, c:'red', active:true},
{p:'Thief', t:7500, c:'white', active:true}, {p:'Shield',t:6000, c:'green', active:true},
{p:'Wind', t:5000, c:'red', active:true},{p:'Infinite Edge', t:7500, c:'white', active:true}]
let currentAllPowers = []
let allBlackHoles = []
let allShields = []
let powersSpawned = []
let allParticles = []
let particleColors = []
let pauseStart = 0
let pauseEnd = 0
let AIrandomizer = 1
let numberOfPowers = 10
let powerInterval

function preload(){
    font = loadFont('./assets/koulen.ttf')
}
function setup(){
    myCanvas = createCanvas((windowWidth*4/5),windowHeight)
    myCanvas.parent('page')
    background("#000000")
    myCanvas.position(windowWidth/10,0,"fixed")
    textFont(font)
    fill(255)
    controlbuttons = createDiv()
    controlbuttons.parent('page')
    controlbuttons.id('controlbuttons')
    controlbuttons.addClass('controlbuttons')
    controlbuttons.hide()
    player1upbutton = createDiv('↑')
    player1upbutton.parent('controlbuttons')
    player1upbutton.id('p1ub')
    player2upbutton = createDiv('↑')
    player2upbutton.parent('controlbuttons')
    player2upbutton.id('p2ub')
    player1downbutton = createDiv('↓')
    player1downbutton.parent('controlbuttons')
    player1downbutton.id('p1db')
    player2downbutton = createDiv('↓')
    player2downbutton.parent('controlbuttons')
    player2downbutton.id('p2db')
    mainmenu = createDiv()
    mainmenu.parent('page')
    mainmenu.id('mainmenu')
    mainmenu.addClass('mainmenu main')
    title = createDiv("Morgs' Pong")
    title.addClass('titulo')
    title.parent('mainmenu')
    subtitle = createDiv('Play on full and horizontal screen!<br/>press the button in the top-right corner<br/>(On Mobile, also flip the device)')
    subtitle.addClass('subtitle')
    subtitle.parent('mainmenu')
    gamemodes = createDiv()
    gamemodes.id('gamemodes')
    gamemodes.addClass('gamemodes')
    gamemodes.parent('mainmenu')
    customgamebutton = createButton('Custom Game')
    customgamebutton.mousePressed(goToCustom)
    customgamebutton.parent('gamemodes')
    mainconfigsbutton = createButton('Configs')
    mainconfigsbutton.parent('mainmenu')
    mainconfigsbutton.mousePressed(goToMainConfigs)
    creditsbutton = createButton('Credits')
    creditsbutton.mousePressed(goGoCredits)
    creditsbutton.parent('mainmenu')
    mainmenuconfigs = createDiv()
    mainmenuconfigs.addClass('admenu')
    mainmenuconfigs.id('mainconfigs')
    mainmenuconfigs.hide()
    particleDiv = createDiv('Particles')
    particleDiv.parent('mainconfigs')
    particleDiv.id('partc')
    particleDiv.addClass('sped')
    particleSelect = createSelect()
    particleSelect.option('Activated')
    particleSelect.option('Disabled')
    particleSelect.parent('partc')
    particleSelect.selected('Activated')
    musicVolumeControl = createDiv('Music volume')
    musicVolumeControl.parent('mainconfigs')
    musicVolumeControl.id('mvc')
    musicSlider = createSlider(0, 1, 0.2, 0.05)
    musicSlider.size(80)
    musicSlider.parent('mvc')
    musicSlider.addClass('slider')
    sfxVolumeControl = createDiv('Sound effects')
    sfxVolumeControl.parent('mainconfigs')
    sfxVolumeControl.id('svc')
    sfxSlider = createSlider(0, 1, 0.4, 0.05)
    sfxSlider.style('width', '80px')
    sfxSlider.parent('svc')
    sfxSlider.addClass('slider')
    mainmenuButton2 = createButton('Back')
    mainmenuButton2.mousePressed(goToMain)
    mainmenuButton2.parent('mainconfigs')
    credits = createDiv('Credits:')
    credits.parent('page')
    credits.id('creditstop')
    credits.addClass('admenu')
    credits.hide()
    creditstext = createDiv('Created and developed by:<br/>Gabriel Schaldach Morgado<br/><br/>Sound effects:<br/>Little Robot Sound Factory<br/><br/>Special Thanks:<br/>Alisson Stephens<br/>Bernardo Rebelo</br>Rafael Costa</br>Pedro Furtado<br/><br/>')
    creditstext.parent('creditstop')
    mainmenuButton3 = createButton('Main menu')
    mainmenuButton3.mousePressed(goToMain)
    mainmenuButton3.parent('creditstop')
    customgamemenu = createDiv()
    customgamemenu.parent('page')
    customgamemenu.id('customgamemenu')
    customgamemenu.addClass('mainmenu')
    customgamemenu.hide()
    title2 = createDiv("Morgs' Pong")
    title2.addClass('titulo')
    title2.parent('customgamemenu')
    subtitle2 = createDiv('Play on full and horizontal screen!<br/>press the button in the top-right corner<br/>(On Mobile, also flip the device)')
    subtitle2.addClass('subtitle')
    subtitle2.parent('customgamemenu')
    buttonMenu = createDiv('')
    buttonMenu.addClass('buttonmenu')
    buttonMenu.parent('customgamemenu')
    buttonMenu.id('buttonmenu')
    startButton = createButton("Start")
    startButton.mousePressed(start)
    startButton.parent('buttonmenu')
    selectMode = createSelect()
    selectMode.option('1 Player')
    selectMode.option('2 Players')
    selectMode.parent('buttonmenu')
    selectDifficulty = createSelect()
    selectDifficulty.option('Easy')
    selectDifficulty.option('Medium')
    selectDifficulty.option('Hard')
    selectDifficulty.option('NIGHTMARE')
    selectDifficulty.selected('Medium')
    selectDifficulty.parent('buttonmenu')
    scoreDisplay = createDiv('Points to win')
    scoreDisplay.id('lim')
    scoreDisplay.parent('buttonmenu')
    scoreLimitSelect = createInput(5, 'number')
    scoreLimitSelect.parent('lim')
    scoreLimitSelect.id('scorelimitselect')
    scoreLimitSelect.input(setInput)
    sls = document.getElementById('scorelimitselect')
    sls.onblur = function(){onResize()}
    advancedConfigs = createButton('Other Configs')
    advancedConfigs.parent('buttonmenu')
    advancedConfigs.mousePressed(goToCustomConfigs)
    mainmenuButton = createButton('Main menu')
    mainmenuButton.mousePressed(goToMain)
    mainmenuButton.parent('buttonmenu')
    imgdiv = createDiv()
    imgdiv.addClass('imgdiv')
    imgdiv.id('imgdiv')
    imgdiv.parent('page')
    functiondiv = createDiv()
    functiondiv.addClass('imgdiv')
    functiondiv.id('fundiv')
    functiondiv.parent('page')
    fullScreen = createImg('./assets/images/screen.png')
    fullScreen.addClass('imgfunction')
    fullScreen.parent('imgdiv')
    fullScreendiv = createDiv()
    fullScreendiv.addClass('imgfunction')
    fullScreendiv.mousePressed(activateFullscreen)
    fullScreendiv.parent('fundiv')
    soundActive = createImg('./assets/images/sound-on.png')
    soundActive.addClass('imgfunction')
    soundActive.parent('imgdiv')
    soundOff = createImg('./assets/images/sound-off.png')
    soundOff.addClass('imgfunction')
    soundOff.parent('imgdiv')
    soundActive.hide()
    soundActivediv = createDiv()
    soundActivediv.addClass('imgfunction')
    soundActivediv.mousePressed(toggleSound)
    soundActivediv.parent('fundiv')
    customgameconfigs = createDiv('Avaiable powerups')
    customgameconfigs.parent('page')
    customgameconfigs.id('admenu')
    customgameconfigs.addClass('admenu')
    configsmenu = createDiv()
    configsmenu.parent('admenu')
    configsmenu.id('configsmenu')
    configsmenu.addClass('configs')
    text1 = createDiv('Positives')
    text1.parent('configsmenu')
    text1.addClass('green')
    text2 = createDiv('Negatives')
    text2.parent('configsmenu')
    text2.addClass('red')
    text3 = createDiv('Neutral')
    text3.parent('configsmenu')
    customgameconfigs.hide()
    allPowers.forEach(power => {
        let button = createButton(power.p)
        button.mousePressed(() => changePowerActive(power.p, button))
        button.parent('configsmenu')
    })
    spawnSpeed = createDiv('Powerups speed')
    spawnSpeed.parent('admenu')
    spawnSpeed.id('sped')
    spawnSpeed.addClass('sped')
    powerSpeedSelect = createSelect()
    powerSpeedSelect.option('Slow')
    powerSpeedSelect.option('Normal')
    powerSpeedSelect.option('Craziness')
    powerSpeedSelect.parent('sped')
    powerSpeedSelect.selected('Normal')
    custommenu = createButton('Back')
    custommenu.mousePressed(goToCustom)
    custommenu.parent('admenu')
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
    resumeButton = createButton('Back')
    resumeButton.mousePressed(resume)
    resumeButton.parent('pausemenu')
    resetButton = createButton('Reset')
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
    warning1 = createDiv('PC:<br/> Use W and S to<br/>go up and down<br/><br/>Mobile:<br/> Use the buttons </br>highlighted to</br> go up and down<br/><br/>')
    warning1.addClass('warning')
    warning1.id('warning1')
    warning1.parent('page')
    warning1.hide()
    warningButton1 = createButton('Understood')
    warningButton1.mousePressed(start)
    warningButton1.parent('warning1')
    warning2 = createDiv('PC:<br/> Player 1 - W and S<br/>Player 2 - ↑ and ↓<br/>to go up and down<br/><br/>Mobile:<br/> Each one controls <br/>their side with the buttons<br/>to go up and down<br/><br/>')
    warning2.addClass('warning')
    warning2.id('warning2')
    warning2.parent('page')
    warning2.hide()
    warningButton2 = createButton('Understood')
    warningButton2.mousePressed(start)
    warningButton2.parent('warning2')
    page = document.getElementById('page')
    ballColors.push(color(255,255,255), color(255,0,0), color(255,255,0), color(255,0,230), color(30,225,232))
    particleColors.push(color(255,0,0),color(170,0,255),color(255,255,255))
    textAlign(LEFT)
    textSize(12)
    text('alpha patch 1.81', 5, 15)
    noStroke()
}
function toggleSound(){
    if(!sound){
        sound = true
        musicajogo.play()
        soundActive.show()
        soundOff.hide()
    }
    else{
        sound = false
        musicajogo.pause()
        soundActive.hide()
        soundOff.show()
    }
}
function setInput(){
    scoreLimit = parseInt(this.value())
}
vitoriasom.addEventListener('ended', function() {
    musicajogo.play()
})
musicajogo.addEventListener('ended', function() {
    this.play()
}, false)
window.addEventListener('click', function(){
    if(sound){menusom.play()}
})
function onResize(){
    windowHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    myCanvas = createCanvas((windowWidth*4/5),windowHeight)
    background("#000000")
    myCanvas.position(windowWidth/10,0,"fixed")
    textAlign(LEFT)
    textSize(12)
    text('alpha patch 1.81', 5, 15)
    balls[0].x = (windowWidth*4/5)/2
    balls[0].y = windowHeight/2
    balls[0].distance = (windowWidth*4/5)/120
    player1.y = windowHeight*7/16
    player1.height = windowHeight/3
    player2.x = (windowWidth*4/5)-10
    player2.y = windowHeight*7/16
    player2.height = windowHeight/3
}
window.addEventListener("resize", function() {
    onResize()
});
window.addEventListener("orientationchange", function() {
    onResize()
});
function activateFullscreen(){
    if (!isFull && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
        isFull = true
    }
    else if ( isFull && document.exitFullscreen){
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
        let string = onpower.stolen?currentAllPowers[onpower.index].p+' (Stolen)':currentAllPowers[onpower.index].p
        let div = createDiv(string)
        div.addClass(currentAllPowers[onpower.index].c)
        div.parent('p1powers')
    })
    player2['onlinePowers'].forEach(onpower => {
        let string = onpower.stolen?currentAllPowers[onpower.index].p+' (Stolen)':currentAllPowers[onpower.index].p
        let div = createDiv(string)
        div.addClass(currentAllPowers[onpower.index].c)
        div.parent('p2powers')
    })
}
function powerCatch(power, player, ball, referencex, referencey, stolen){
    if(sound){powerpickupsom.play()}
    switch(currentAllPowers[power].p){
        case 'Big':
            let smallIndex = currentAllPowers.findIndex(power => {return power.p === 'Small'})
            player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== smallIndex)
            player.height = windowHeight/2
            break
        case 'Fire':
            player.activatedFire = true
            determinePlayerColors(player)
            break
        case 'Frozen':
            player.activatedIce = true
            determinePlayerColors(player)
            break
        case 'Multiball':
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
                    timereturn: false,
                    laser: false,
                    shielded: false,
                    sneakBalls: []
                })
            balls.forEach(ball => {
                ball.distance = (windowWidth*4/5)/120
            })
            break
        case 'Inverted':
            player.activatedInverted = true
            break
        case 'Small':
            let bigIndex = currentAllPowers.findIndex(power => {return power.p === 'Big'})
            player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== bigIndex)
            player.height = windowHeight/6
            break
        case 'Golden goal':
            ball.scoreValue = 2
            break
        case 'Invisivel':
            player.activatedInvisible = true
            determinePlayerColors(player)
            break
        case 'Flares':
            player.activatedSneak = true
            determinePlayerColors(player)
            break
        case 'Timer':
            if(ball.timetravel||ball.timereturn){return}
            ball.timeangle = ball.angle
            ball.horizontaltime = ball.horizontalControl
            ball.verticaltime = ball.verticalControl
            ball.ballTrack = []
            ball.timetravel = true
            break
        case 'Black hole':
            allBlackHoles.push({x:referencex, y:referencey, frame:0, circumpherence:Math.PI*2*windowHeight/6})
            break
        case 'Discoordinated':
            player.speed = windowHeight/12
            break
        case 'Hook':
            player.activatedHook = true
            break
        case 'Thief':
            player.activatedThief = true
            break
        case 'Laser':
            ball.laser = true
            break
        case 'Shield':
            stopPower(power, player)
            allShields.push({x:player.x, y:Math.random()*windowHeight/2+windowHeight/4, p:player===player1?1:2})
            break
        case 'Infinite Edge':
            player.borderless = true
            break
        case 'Wind':
            rightParticleX = player===player1?10:(windowWidth*4/5)-60
            allParticles = allParticles.filter(part => part.type !== 'wind'||part.x !== rightParticleX)
            player.wind.active = true
            player.wind.direction = Math.random()>0.5?'up':'down'
            rightX = player === player1?0:-50
            allParticles.push({x:player.x+rightX, y:0, type:'wind', frame:0, frameLimit:1000, particles:[], color:2, direction:player.wind.direction === 'down'?1:-1})
            break
        default:
            break
    }
    if(currentAllPowers[power].p!=='Black hole'){
        player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== power)
    }
    let time = new Date()
    player['onlinePowers'].push({
        index: power,
        expire: time.getTime()+currentAllPowers[power].t,
        ball: balls.indexOf(ball),
        stolen: stolen
    })
    updatePowerShow()
}
function stopPower(power, player, ball, time){
    if(currentAllPowers[power].p === 'Black hole'){player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== power||onpower.expire !== time)}
    else{player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== power)}
    updatePowerShow()
    switch(currentAllPowers[power].p){
        case 'Small':
        case 'Big':
            player.height = windowHeight/3
            break
        case 'Fire':
            player.activatedFire = false
            determinePlayerColors(player)
            break
        case 'Frozen':
            player.activatedIce = false
            determinePlayerColors(player)
            break
        case 'Inverted':
            player.activatedInverted = false
            break
        case 'Invisivel':
            player.activatedInvisible = false
            determinePlayerColors(player)
        case 'Flares':
            player.activatedSneak = false
            determinePlayerColors(player)
            break
        case 'Timer':
            if(!balls[ball].timereturn){
                balls[ball].timetravel = false
                balls[ball].timereturn = true
            }
            break
        case 'Black hole':
            allBlackHoles.shift()
            break
        case 'Discoordinated':
            player.speed = windowHeight/50
            break
        case 'Thief':
            player.activatedThief = false
            break
        case 'Laser':
            balls[ball].laser = false
            targetPlayer = player === player1?player2.x-10:player1.x+10
            if(isParticles){allParticles.push({x: targetPlayer, y: balls[ball].y, width: balls[ball].x-targetPlayer, type: 'laser', color:0, frame:0, frameLimit: 15})}
            balls[ball].x = targetPlayer
            console.log('push')
            break
        case 'Hook':
            player.activatedHook = false
            break
        case 'Shield':
            playernumber = player===player1?1:2
            allShields = allShields.filter(shield => shield.p!==playernumber)
            break
        case 'Infinite Edge':
            player.borderless = false
            break
        case 'Wind':
            rightParticleX = player===player1?10:(windowWidth*4/5)-60
            allParticles = allParticles.filter(part => part.type !== 'wind'||part.x !== rightParticleX)
            player.wind.active = false
            break
        default:
            break
    }
}
function drawParticles(){
    allParticles.forEach(particlearea => {
        if(particlearea.frame>particlearea.frameLimit){allParticles = allParticles.filter(part => part!==particlearea)}
        let rightcolor = particleColors[particlearea.color]
        rightcolor.setAlpha(100)
        fill(rightcolor)
        if(particlearea.type === 'despawn'){
            if(!particlearea['particles'].length){
                for(i=0; i<25; i++){
                    let xRandomizer = Math.random()>0.5?1:-1
                    let xPosition = Math.floor(Math.random()*windowHeight/10)
                    let yRandomizer = Math.random()>0.5?1:-1
                    let yPosition = Math.floor(Math.random()*windowHeight/10)
                    particlearea['particles'].push({x: xPosition*xRandomizer, y: yPosition*yRandomizer, horizontal:xRandomizer, vertical: yRandomizer})
                }
            }
            particlearea['particles'].forEach(part => {
                ellipse(particlearea.x+part.x+particlearea.frame*2*part.horizontal*Math.abs(part.x)*10/windowHeight, particlearea.y+part.y+particlearea.frame*2*part.vertical*Math.abs(part.y)*10/windowHeight, 5)
            })
        }
        else if(particlearea.type === 'fire'){
            if(!particlearea['particles'].length){
                for(i=0; i<25; i++){
                    let xPosition = Math.floor(Math.random()*20)
                    let yRandomizer = Math.random()>0.5?1:-1
                    let yPosition = Math.floor(Math.random()*20)
                    particlearea['particles'].push({x: xPosition*particlearea.direction, y: yPosition*yRandomizer, vertical: yRandomizer})
                }
            }
            particlearea['particles'].forEach(part => {
                ellipse(particlearea.x+part.x+particlearea.frame*12*particlearea.direction*Math.abs(part.x)/20, particlearea.y+part.y+particlearea.frame*4*part.vertical*Math.abs(part.y)/20, 10)
            })
        }
        else if(particlearea.type === 'laser'){
            console.log('laser')
            rect(particlearea.x,particlearea.y,particlearea.width,-30/particlearea.frame)
            rect(particlearea.x,particlearea.y,particlearea.width,30/particlearea.frame)
        }
        else if(particlearea.type === 'wind'){
            if(!particlearea['particles'].length){
                for(i=0; i<20; i++){
                    let xPosition = Math.floor(Math.random()*50)+particlearea.x
                    let yPosition = Math.floor(Math.random()*windowHeight)
                    particlearea['particles'].push({x:xPosition,y:yPosition})
                }
            }
            particlearea['particles'].forEach(part => {
                rect(part.x, part.y,2,30)
                part.y += 5*particlearea.direction
                if(part.y<0&&particlearea.direction===-1){
                    particlearea['particles'].push({x:part.x,y:windowHeight})
                    particlearea['particles'] = particlearea['particles'].filter(innerpart => innerpart.x!==part.x||innerpart.y!==part.y)
                }
                if(part.y+30>windowHeight&&particlearea.direction===1){
                    particlearea['particles'].push({x:part.x,y:0})
                    particlearea['particles'] = particlearea['particles'].filter(innerpart => innerpart.x!==part.x||innerpart.y!==part.y)
                }
            })
        }
        particlearea.frame++
    })
}
function spawnNewPower(){
    let xPos = Math.floor(Math.random()*(windowWidth*4/5)*2/3)+(windowWidth*4/5)/6
    let yPos = Math.floor(Math.random()*windowHeight*2/3)+windowHeight/6
    let numberOfPowersSpawned = 1
    let allPowersChosen = []
    let randomNumber = Math.random()
    if(randomNumber<0.75){numberOfPowersSpawned=1}
    else if(randomNumber<0.90){numberOfPowersSpawned=2}
    else if(randomNumber<0.98){numberOfPowersSpawned=3}
    else{numberOfPowersSpawned=4}
    if(numberOfPowersSpawned>numberOfPowers){numberOfPowersSpawned=numberOfPowers}
    for(i=0; i<numberOfPowersSpawned; i++){
        for(y=0; y>=0; y++){
            powerChosen = Math.floor(Math.random()*numberOfPowers)
            if(allPowersChosen.indexOf(powerChosen)===-1){
                allPowersChosen.push(powerChosen)
                break
            }
        }
    }
    let time = new Date()
    powersSpawned.push({n:numberOfPowersSpawned, x: xPos, y: yPos, p:allPowersChosen, expiretrack: time.getTime(), powerflicker:[4,8,12,16,20,24,26,28,29,30,31,32,33,34,35,36]})
    canSpawnPower = false
}
function drawPowerCircle(spawnedPower){
    let time = new Date()
    if(time.getTime()>spawnedPower.expiretrack+2.5*powerSpeed){
        powersSpawned = powersSpawned.filter(spower => spower!==spawnedPower)
        allParticles.push({x:spawnedPower.x, y:spawnedPower.y, type:'despawn', color:1, frame:0, frameLimit:30, particles:[]})
        return
    }
    if(time.getTime()-spawnedPower.expiretrack>powerSpeed*2.5-(powerSpeed*2.5/spawnedPower['powerflicker'][0])){
        spawnedPower['powerflicker'].shift()
        return
    }
    particleColors[1].setAlpha(70)
    fill(particleColors[1])
    ellipse(spawnedPower.x, spawnedPower.y, windowHeight/3)
    particleColors[1].setAlpha(255)
    textSize(40)
    textAlign(CENTER)
    text(spawnedPower.n,spawnedPower.x, spawnedPower.y+10)
}
function goToMainConfigs(){
    mainmenu.style('display','none')
    mainmenuconfigs.style('display','flex')
}
function goToCustomConfigs(){
    customgamemenu.style('display','none')
    customgameconfigs.style('display','flex')
}
function goToMain(){
    mainmenu.style('display','flex')
    customgamemenu.style('display','none')
    mainmenuconfigs.style('display','none')
    credits.style('display', 'none')
}
function goToCustom(){
    mainmenu.style('display','none')
    customgameconfigs.style('display', 'none')
    customgamemenu.style('display','flex')
    subtitle2.html('Jogo customizado')
}
function goGoCredits(){
    mainmenu.style('display', 'none')
    credits.style('display', 'flex')
}
function pausegame(){
    let time = new Date()
    pauseStart = time.getTime()
    pauseButton.hide()
    pauseMenu.style('display', 'flex')
    functiondiv.style('display', 'flex')
    paused = true
}
function resume(){
    let time = new Date()
    pauseEnd = time.getTime()
    player1['onlinePowers'].forEach(onpower => {
        onpower.expire += pauseEnd-pauseStart
    })
    player2['onlinePowers'].forEach(onpower => {
        onpower.expire += pauseEnd-pauseStart
    })
    pauseButton.show()
    pauseMenu.hide()
    functiondiv.hide()
    paused = false
}
window.addEventListener('keydown', (event) => {
    if(event.key === 'w'){player1.up = true}
    else if(event.key === 's'){player1.down = true}
    if(event.key === 'ArrowUp'&&!gameMode){player2.up = true}
    else if(event.key === 'ArrowDown'&&!gameMode){player2.down = true}
})
window.addEventListener('keyup', (event) => {
    if(event.key === 'w'){player1.up = false}
    else if(event.key === 's'){player1.down = false}
    if(event.key === 'ArrowUp'){player2.up = false}
    else if(event.key === 'ArrowDown'){player2.down = false}
})
function setLineDash(list) {
    drawingContext.setLineDash(list);
}
function draw(){
    if(!gameplaying){
        volumeparaefeitos = sfxSlider.value()
        volumeparamusicas = musicSlider.value()
        musicajogo.volume = volumeparamusicas
        vitoriasom.volume = volumeparamusicas
        efeito1.volume = volumeparaefeitos
        efeito2.volume = volumeparaefeitos
        efeito3.volume = volumeparaefeitos
        menusom.volume = volumeparaefeitos
        powerpickupsom.volume = volumeparaefeitos
        pointsom.volume = volumeparaefeitos
    }
    else if(!timeout&&!paused){
        clear()
        background("#000000")
        fill(255)
        textAlign(LEFT)
        textSize(14)
        text('alpha patch 1.81', 5, 15)
        textAlign(CENTER)
        textSize(37)
        text(player1.score+"        "+player2.score, (windowWidth*4/5)/2, windowHeight/7)
        setLineDash([12, 12])
        stroke(255)
        strokeWeight(2)
        line((windowWidth*4/5)/2, 0, (windowWidth*4/5)/2, windowHeight)
        setLineDash([0, 0])
        if(player1.borderless||player2.borderless){
            strokeWeight(4)
            stroke('blue')
            line(0,0,(windowWidth*4/5),0)
            line(0,windowHeight,(windowWidth*4/5),windowHeight)
        }
        allBlackHoles.forEach(blackhole => {
            particleColors[1].setAlpha(255)
            stroke(particleColors[1])
            fill(0)
            if(isParticles){
                for(i=0; i<30; i++){
                    let angle = Math.PI*2*i/30+Math.PI*2*blackhole.frame/375
                    push()
                    translate(blackhole.x+Math.cos(angle)*windowHeight/10, blackhole.y+Math.sin(angle)*windowHeight/10)
                    rotate(angle)
                    rect(0, 0, 1, 40)
                    pop()
                }
            }
            ellipse(blackhole.x, blackhole.y, windowHeight/5)
            blackhole.frame++
        })
        noStroke()
        allShields.forEach(shield => {
            ballColors[4].setAlpha(100)
            fill(ballColors[4])
            ellipse(shield.x, shield.y, windowHeight*2/3)
            ballColors[4].setAlpha(255)
        })
        if(canSpawnPower){
            spawnNewPower()
        }
        powersSpawned.forEach(spawnedPower => {
            drawPowerCircle(spawnedPower)
            balls.forEach(ball => {
                if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+windowHeight/6){
                    let rightPlayer = ball.lastPlayerHit==1?player1:player2
                    let stolen = false
                    if(rightPlayer===player1&&player2.activatedThief){
                        rightPlayer=player2
                        const thiefIndex = currentAllPowers.findIndex(power => {return power.p === 'Thief'})
                        stopPower(thiefIndex, player2)
                        stolen = true
                    }
                    if(rightPlayer===player2&&player1.activatedThief){
                        rightPlayer=player1
                        const thiefIndex = currentAllPowers.findIndex(power => {return power.p === 'Thief'})
                        stopPower(thiefIndex, player1)
                        stolen = true
                    }
                    spawnedPower['p'].forEach(chosenPower => {
                        powerCatch(chosenPower, rightPlayer, ball, spawnedPower.x, spawnedPower.y, stolen)
                    })
                    powersSpawned = powersSpawned.filter(spower => spower!==spawnedPower)
                    allParticles.push({x:spawnedPower.x, y:spawnedPower.y, type:'despawn', color:1, frame:0, frameLimit:30, particles:[]})
                }
            })
        })
        if(isParticles){drawParticles()}
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
        }
        if(device){
            touches.forEach(touch => {
                if(touch.x<(windowWidth*4/5)/2){
                    if(touch.y>windowHeight/2){
                        player1.down = true
                    }
                    else{
                        player1.up = true
                    }
                }
                else if(!gameMode){
                    if(touch.y>windowHeight/2){
                        player2.down = true
                    }
                    else{
                        player2.up = true
                    }
                }
            })
        }
        if(!player1.activatedIce){
            if((player1.up&&!player1.activatedInverted)||(player1.down&&player1.activatedInverted)){
                player1.y = player1.y<=0?player1.y:player1.y-player1.speed
                player1.moved = true
            }
            if((player1.down&&!player1.activatedInverted)||(player1.up&&player1.activatedInverted)){
                player1.y = player1.y+player1.height>=windowHeight?player1.y:player1.y+player1.speed
                player1.moved = true
            }
        }
        if(!player2.activatedIce){
            if((player2.up&&!player2.activatedInverted)||(player2.down&&player2.activatedInverted)){
                player2.y = player2.y<=0?player2.y:player2.y-player2.speed
                player2.moved = true
            }
            if((player2.down&&!player2.activatedInverted)||(player2.up&&player2.activatedInverted)){
                player2.y = player2.y+player2.height>=windowHeight?player2.y:player2.y+player2.speed
                player2.moved = true
            }
        }
        if(player1.wind.active&&((player1.y>=0&&player1.wind.direction==='up')||(player1.y+player1.height<=windowHeight&&player1.wind.direction==='down'))){
            player1.y = player1.wind.direction === 'down'?player1.y+player1.speed/2:player1.y-player1.speed/2
        }
        if(player2.wind.active&&((player2.y>=0&&player2.wind.direction==='up')||(player2.y+player2.height<=windowHeight&&player2.wind.direction==='down'))){
            player2.y = player2.wind.direction === 'down'?player2.y+player2.speed/2:player2.y-player2.speed/2
        }
        if(device){
            player1.up = false
            player1.down = false
            player2.up = false
            player2.down = false
        }
        balls.forEach(ball => {
            if(ball['ballTrack'].length>5&&!ball.timetravel&&!ball.timereturn&&!ball.sneak){ball['ballTrack'].shift()}
            if(!ball.timereturn){ball['ballTrack'].push({x: ball.x, y:ball.y})}
            ball['ballTrack'].forEach(past => {
                ballColors[ball.ballColorIndex].setAlpha(50)
                fill(ballColors[ball.ballColorIndex])
                ellipse(past.x, past.y, 20)
                ballColors[ball.ballColorIndex].setAlpha(255)
            })
            fill(ballColors[ball.ballColorIndex])
            ellipse(ball.x, ball.y, 20)
            if(ball.sneak&&!ball.laser){
                ball['sneakBalls'].forEach(sneakball => {
                    if(sneakball.y-10<0){sneakball.verticalControl=1}
                    if(sneakball.y+10>windowHeight){sneakball.verticalControl=-1}
                    sneakball.x = ball.x
                    let verticalballDistance = Math.sin(sneakball.angle)*ball.distance
                    sneakball.y += verticalballDistance*sneakball.verticalControl
                    ellipse(sneakball.x, sneakball.y, 20)
                    ballColors[ball.ballColorIndex].setAlpha(50)
                    fill(ballColors[ball.ballColorIndex])
                    sneakball['sneakTrack'].forEach(pastsneak => {
                        ellipse(pastsneak.x, pastsneak.y, 20)
                    })
                    ballColors[ball.ballColorIndex].setAlpha(255)
                    fill(ballColors[ball.ballColorIndex])
                    sneakball['sneakTrack'].push({x: sneakball.x, y: sneakball.y})
                })
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
            stopPower(onpower.index, player1, onpower.ball, onpower.expire)
        }
    })
    player2['onlinePowers'].forEach(onpower => {
        if(time.getTime()>onpower.expire){
            stopPower(onpower.index, player2, onpower.ball, onpower.expire)
        }
    })
}

function calculateball(){
    balls.forEach(ball => {
        let index = balls.indexOf(ball)
        let horizontalballDistance, verticalballDistance
        if(ball.shielded){
            horizontalballDistance = Math.cos(ball.angle)*(windowWidth*4/5)/240
            verticalballDistance = Math.sin(ball.angle)*(windowWidth*4/5)/240
        }
        else{
            horizontalballDistance = Math.cos(ball.angle)*ball.distance
            verticalballDistance = Math.sin(ball.angle)*ball.distance
        }
        if(ball.x+10>=player2.x){
            if(gameMode){
                AIrandomizer = Math.random()>0.5?1:-1
            }
            if(player2.activatedHook){
                const hookIndex = currentAllPowers.findIndex(power => {return power.p === 'Hook'})
                stopPower(hookIndex, player2)
            }
            ball.lastPlayerHit = 2
            playerMoved = player2.moved
            ball.horizontalControl = -1
            ball.distance += (windowWidth*4/5)/1400
            changeAngle(player2, index)
            if((ball.y-10>player2.y+player2.height)||(ball.y+10<player2.y)){
                player1.score+=ball.scoreValue
                timeout = true
                if(sound){pointsom.play()}
                setTimeout(winner, 250)
                return
            }
            if(sound){efeito2.play()}
            if(player2.activatedFire){
                const fireIndex = currentAllPowers.findIndex(power => {return power.p === 'Fire'})
                stopPower(fireIndex, player2)
                allParticles.push({x:ball.x, y:ball.y, direction:-1, type:'fire', color:0, frame:0, frameLimit:20, particles:[]})
                ball.distance += (windowWidth*4/5)/70
                if(sound){efeito3.play()}
            }
            if(player2.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {return power.p === 'Flares'})
                stopPower(sneakIndex, player2)
                for(i=0;i<8;i++){
                    ball['sneakBalls'].push({x:ball.x, y:ball.y, angle:Math.random()*Math.PI/3, horizontalControl:ball.horizontalControl, verticalControl:Math.random()>0.5?1:-1, sneakTrack:[]})
                }
                ball.sneak = true
            }
        }
        if(ball.x-10<=player1.x){
            if(player1.activatedHook){
                const hookIndex = currentAllPowers.findIndex(power => {return power.p === 'Hook'})
                stopPower(hookIndex, player1)
            }
            ball.lastPlayerHit = 1
            playerMoved = player1.moved
            ball.horizontalControl = 1
            ball.distance += (windowWidth*4/5)/1400
            changeAngle(player1, index)
            if((ball.y-10>player1.y+player1.height)||(ball.y+10<player1.y)){
                player2.score+=ball.scoreValue
                timeout = true
                if(sound){pointsom.play()}
                setTimeout(winner, 250)
                return
            }
            if(sound){efeito1.play()}
            if(player1.activatedFire){
                const fireIndex = currentAllPowers.findIndex(power => {return power.p === 'Fire'})
                stopPower(fireIndex, player1)
                allParticles.push({x:ball.x, y:ball.y, direction:1, type:'fire', color:0, frame:0, frameLimit:20, particles:[]})
                ball.distance += (windowWidth*4/5)/70
                if(sound){efeito3.play()}
            }
            if(player1.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {return power.p === 'Flares'})
                stopPower(sneakIndex, player1)
                for(i=0;i<8;i++){
                    ball['sneakBalls'].push({x:ball.x, y:ball.y, angle:Math.random()*Math.PI/3, horizontalControl:ball.horizontalControl, verticalControl:Math.random()>0.5?1:-1, sneakTrack:[]})
                }
                ball.sneak = true
            }
        }
        if(ball.sneak&&ball.horizontalControl===1&&ball.x>(windowWidth*4/5)*4/7){
            ball.sneak=false; ball['sneakBalls'] = []; ball['ballTrack'] = [{x:ball.x, y:ball.y}]
        }
        if(ball.sneak&&ball.horizontalControl===-1&&ball.x<(windowWidth*4/5)*3/7){
            ball.sneak=false; ball['sneakBalls'] = []; ball['ballTrack'] = [{x:ball.x, y:ball.y}]
        }
        if(ball.horizontalControl===1&&player2.activatedHook&&ball.x>(windowWidth*4/5)/2){
            let control = Math.abs(player2.y+(player2.height/2)-ball.y)/(player2.x-ball.x)
            if(ball.y>player2.y+player2.height/2){ball.verticalControl=-1}
            else{ball.verticalControl=1}
            let rightAngle = Math.atan(control)
            ball.angle = rightAngle
            stroke('green')
            strokeWeight(3)
            line(ball.x, ball.y, player2.x, player2.y+player2.height/2)
            if(isParticles){
                push()
                fill(0)
                translate(ball.x,ball.y)
                rotate(Math.PI/4)
                for(i=0;i<5;i++){
                    rect(0,0,1,40)
                    rotate(Math.PI/2)
                }
                pop()
                noStroke()
            }
            
        }
        if(ball.horizontalControl===-1&&player1.activatedHook&&ball.x<(windowWidth*4/5)/2){
            let control = Math.abs(player1.y+(player1.height/2)-ball.y)/(ball.x-player1.x)
            if(ball.y>player1.y+player1.height/2){ball.verticalControl=-1}
            else{ball.verticalControl=1}
            let rightAngle = Math.atan(control)
            ball.angle = rightAngle
            stroke('green')
            strokeWeight(3)
            line(ball.x, ball.y, player1.x, player1.y+player1.height/2)
            if(isParticles){
                push()
                fill(0)
                translate(ball.x,ball.y)
                rotate(Math.PI/4)
                for(i=0;i<4;i++){
                    rect(0,0,1,40)
                    rotate(Math.PI/2)
                }
                pop()
                noStroke()
            }
        }
        allBlackHoles.forEach(blackhole => {
            if(dist(ball.x, ball.y, blackhole.x, blackhole.y)<windowHeight/5){
                particleColors[1].setAlpha(50)
                stroke(particleColors[1])
                strokeWeight(25)
                line(ball.x, ball.y, blackhole.x, blackhole.y)
                let control = ball.y>blackhole.y?-1:1
                let control2 = 1
                if(ball.verticalControl !== control){control2=-1}
                if(ball.angle+control2*Math.PI/70<0){
                    ball.verticalControl=ball.verticalControl*-1
                    control2 = control2*-1
                }
                if(ball.angle+control2*Math.PI/70>Math.PI/2){
                    ball.horizontalControl= ball.horizontalControl*-1
                }
                ball.angle = ball.angle+control2*Math.PI/70
                noStroke()
            }
        })
        ball.shielded = false
        allShields.forEach(shield => {
            if(dist(ball.x, ball.y, shield.x, shield.y)<windowHeight/3){
                ball.shielded = true
            }
        })
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
        else if(ball.laser){
            thirdx = ball.horizontalControl === 1?ball.x+50:ball.x-50
            if(isParticles){
                fill(125)
                triangle(ball.x, ball.y+60, ball.x, ball.y+10, thirdx, ball.y+10)
                triangle(ball.x, ball.y-60, ball.x, ball.y-10, thirdx, ball.y-10)
            }
        }
        else{
            if(ball.y+10>windowHeight){
                if(player1.borderless||player2.borderless){ball.y=10}
                else{ball.verticalControl = -1}
            }
            if(ball.y-10<0){
                if(player1.borderless||player2.borderless){ball.y=windowHeight-10}
                else{ball.verticalControl = 1}
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
        if(ball.distance>((windowWidth*4/5)/70)+((windowWidth*4/5)/120)){ball.ballColorIndex=1}
        if(ball.scoreValue===2){ball.ballColorIndex=2}
        if(ball.sneak){ball.ballColorIndex=3}
    })
}
function determinePlayerColors(player){
    player.color = 'white'
    if(player.activatedSneak){player.color = ballColors[3]}
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
        subtitle2.html(`Player 1 wins!<br/>${player1.score} - ${player2.score}`)
        if(sound){
            musicajogo.pause()
            vitoriasom.play()
        }
        reset()
        return
    }
    else if(player2.score>=scoreLimit&&scoreLimit>0){
        subtitle2.html(`Player 2 wins!<br/>${player1.score} - ${player2.score}`)
        if(sound){
            musicajogo.pause()
            vitoriasom.play()
        }
        reset()
        return
    }
    balls = [{
        x: (windowWidth*4/5)/2,
        y: windowHeight/2,
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: lastStartingHorizontalControl*-1,
        verticalControl: 1,
        distance: (windowWidth*4/5)/120,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1,
        sneak: false,
        timeangle: 0,
        horizontaltime: 1,
        verticaltime: 1,
        timetravel: false,
        timereturn: false,
        laser: false,
        shielded: false,
        sneakBalls: []
    }]
    lastStartingHorizontalControl = lastStartingHorizontalControl*-1
    let timeIndex = currentAllPowers.findIndex(power => {return power.p === 'Timer'})
    if(timeIndex>=0){
        stopPower(timeIndex, player1, 0)
        stopPower(timeIndex, player2, 0)
    }
    player1.y = windowHeight*7/16
    player2.y = windowHeight*7/16
    balls[0].timereturn = false
}

function start(){
    gameMode = selectMode.value() === '1 Player'?true:false
    if(gameMode&&firstwarning1){
        controlbuttons.style('display', 'flex')
        player2downbutton.hide()
        player2upbutton.hide()
        warning1.show()
        customgamemenu.hide()
        firstwarning1 = false
        return
    }
    if(!gameMode&&firstwarning2){
        controlbuttons.style('display', 'grid')
        player2downbutton.style('display', 'flex')
        player2upbutton.style('display', 'flex')
        warning2.show()
        customgamemenu.hide()
        firstwarning2 = false
        return
    }
    switch(selectDifficulty.value()){
        case 'Easy':
            AISpeed = windowHeight/160
            break
        case 'Medium':
            AISpeed = windowHeight/125
            break
        case 'Hard':
            AISpeed = windowHeight/80
            break
        case 'NIGHTMARE':
            AISpeed = windowHeight/40
            break
    }
    switch(powerSpeedSelect.value()){
        case 'Slow':
            powerSpeed = 8000
            break
        case 'Normal':
            powerSpeed = 5000
            break
        case 'Craziness':
            powerSpeed = 2000
            break
    }
    loadPowersActive()
    if(anyPowerActive){
        powerInterval = setInterval(spawnPower, powerSpeed)
    }
    isParticles = particleSelect.value() === 'Ativadas'?true:false
    gameplaying = true
    controlbuttons.hide()
    customgamemenu.hide()
    warning1.hide()
    warning2.hide()
    functiondiv.hide()
    imgdiv.hide()
    pauseButton.show()
}

function reset(){
    clearInterval(powerInterval)
    clear()
    background("#000000")
    p1powers.html('')
    p2powers.html('')
    powersSpawned = []
    gameplaying = false
    canSpawnPower = false
    paused = false
    balls = [{
        x: (windowWidth*4/5)/2,
        y: windowHeight/2,
        ballColorIndex: 0,
        ballTrack: [],
        horizontalControl: 1,
        verticalControl: 1,
        distance: (windowWidth*4/5)/120,
        angle: 0,
        lastPlayerHit: 1,
        scoreValue: 1,
        sneak: false,
        timeangle: 0,
        horizontaltime: 1,
        verticaltime: 1,
        timetravel: false,
        timereturn: false,
        laser: false,
        shielded: false,
        sneakBalls: []
    }]
    player1.score = 0
    player1.y = windowHeight*7/16
    player1['onlinePowers'].forEach(onpower => {stopPower(onpower.index, player1, 0, onpower.expire)})
    player1['onlinePowers'] = []
    player2.score = 0
    player2.y = windowHeight*7/16
    player2['onlinePowers'].forEach(onpower => {stopPower(onpower.index, player2, 0, onpower.expire)})
    player2['onlinePowers'] = []
    currentAllPowers = []
    balls[0].timereturn = false
    fill(255)
    textSize(14)
    textAlign(LEFT)
    text('alpha patch 1.81', 5, 15)
    customgamemenu.style('display', 'flex')
    imgdiv.style('display', 'flex')
    functiondiv.style('display', 'flex')
    pauseMenu.hide()
    controlbuttons.hide()
    pauseButton.hide()
}