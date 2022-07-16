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
        timereturn: false
    }
]
let player1 = {
    p: 'player1',
    x: 10,
    y: windowHeight*7/16,
    speed: 13,
    height: windowHeight/3,
    color: 'white',
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    activatedInvisible: false,
    moved: false,
    onlinePowers: [],
    up: false,
    down: false
}
let player2 = {
    p: 'player2',
    x: (windowWidth*4/5)-10,
    y: windowHeight*7/16,
    speed: 13,
    height: windowHeight/3,
    color: 'white',
    score: 0,
    activatedFire: false,
    activatedIce: false,
    activatedInverted: false,
    activatedSneak: false,
    activatedInvisible: false,
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
let allPowers = [{p:'Fogo', t:7500, c:'green', active:true}, {p:'Invertido', t:5000, c:'red', active:true}, 
{p:'Multibola', t:5000, c:'white', active:true}, {p:'Grande', t:7500, c:'green', active:true}, 
{p:'Pequeno', t:7500, c:'red', active:true}, {p:'Gol de ouro', t:5000, c:'white', active:true},
{p:'Flares', t:7500, c:'green', active:true}, {p:'Congelado', t:1750, c:'red', active:true},
{p:'Temporizador', t:3250, c:'white', active:true}, {p:'Gancho', t:7500, c:'green', active:true}, 
{p:'Invisivel', t:3500, c:'red', active:true}, {p:'Buraco Negro', t:7500, c:'white', active:true},
{p:'Laser', t:3000, c:'green', active:true}, {p:'Desordenado', t:0, c:'red', active:true},
{p:'Trapaceiro', t:7500, c:'white', active:true},]
let currentAllPowers = []
let allBlackHoles = []
let powersSpawned = []
let allParticles = []
let particleColors = []
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
    player1upbutton = createButton()
    player1upbutton.parent('controlbuttons')
    player1downbutton = createButton()
    player1downbutton.parent('controlbuttons')
    player2upbutton = createButton()
    player2upbutton.parent('controlbuttons')
    player2downbutton = createButton()
    player2downbutton.parent('controlbuttons')
    mainmenu = createDiv()
    mainmenu.parent('page')
    mainmenu.id('mainmenu')
    mainmenu.addClass('mainmenu main')
    title = createDiv('Pong do Morgs')
    title.addClass('titulo')
    title.parent('mainmenu')
    subtitle = createDiv('Jogue em tela cheia e horizontal!<br/>aperte o botao em cima na direita<br/>(Funciona em PC e Mobile)')
    subtitle.addClass('subtitle')
    subtitle.parent('mainmenu')
    gamemodes = createDiv()
    gamemodes.id('gamemodes')
    gamemodes.addClass('gamemodes')
    gamemodes.parent('mainmenu')
    campaignbutton = createButton('Campanha')
    campaignbutton.parent('gamemodes')
    campaignbutton.mousePressed(goToUnfinished)
    customgamebutton = createButton('Jogo Customizado')
    customgamebutton.mousePressed(goToCustom)
    customgamebutton.parent('gamemodes')
    onlinebutton = createButton('Multiplayer')
    onlinebutton.mousePressed(goToUnfinished)
    onlinebutton.parent('gamemodes')
    mainconfigsbutton = createButton('Configs')
    mainconfigsbutton.parent('mainmenu')
    mainconfigsbutton.mousePressed(goToMainConfigs)
    mainmenuconfigs = createDiv()
    mainmenuconfigs.addClass('admenu')
    mainmenuconfigs.id('mainconfigs')
    mainmenuconfigs.hide()
    particleDiv = createDiv('Particulas')
    particleDiv.parent('mainconfigs')
    particleDiv.id('partc')
    particleDiv.addClass('sped')
    particleSelect = createSelect()
    particleSelect.option('Ativadas')
    particleSelect.option('Desativadas')
    particleSelect.parent('partc')
    particleSelect.selected('Ativadas')
    musicVolumeControl = createDiv('Volume da musica')
    musicVolumeControl.parent('mainconfigs')
    musicVolumeControl.id('mvc')
    musicSlider = createSlider(0, 1, 0.2, 0.05)
    musicSlider.size(80)
    musicSlider.parent('mvc')
    musicSlider.addClass('slider')
    sfxVolumeControl = createDiv('Volume dos efeitos')
    sfxVolumeControl.parent('mainconfigs')
    sfxVolumeControl.id('svc')
    sfxSlider = createSlider(0, 1, 0.4, 0.05)
    sfxSlider.style('width', '80px')
    sfxSlider.parent('svc')
    sfxSlider.addClass('slider')
    mainmenuButton2 = createButton('Voltar')
    mainmenuButton2.mousePressed(goToMain)
    mainmenuButton2.parent('mainconfigs')
    unfinished = createDiv('Em breve...')
    unfinished.id('unfinish')
    unfinished.parent('page')
    unfinished.addClass('mainmenu')
    unfinished.hide()
    unfinishedbutton = createButton('Voltar')
    unfinishedbutton.parent('unfinish')
    unfinishedbutton.mousePressed(goToMain)
    customgamemenu = createDiv()
    customgamemenu.parent('page')
    customgamemenu.id('customgamemenu')
    customgamemenu.addClass('mainmenu')
    customgamemenu.hide()
    title2 = createDiv('Pong do Morgs')
    title2.addClass('titulo')
    title2.parent('customgamemenu')
    subtitle2 = createDiv('Jogue em tela cheia e horizontal!<br/>aperte o botao em cima na direita<br/>(Funciona em PC e Mobile)')
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
    selectDifficulty.option('Facil')
    selectDifficulty.option('Medio')
    selectDifficulty.option('Dificil')
    selectDifficulty.option('PESADELO')
    selectDifficulty.selected('Medio')
    selectDifficulty.parent('buttonmenu')
    scoreDisplay = createDiv('Pontos para vencer')
    scoreDisplay.id('lim')
    scoreDisplay.parent('buttonmenu')
    scoreLimitSelect = createInput(5, 'number')
    scoreLimitSelect.parent('lim')
    scoreLimitSelect.input(setInput)
    advancedConfigs = createButton('Outras Configs')
    advancedConfigs.parent('buttonmenu')
    advancedConfigs.mousePressed(goToCustomConfigs)
    mainmenuButton = createButton('Menu principal')
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
    customgameconfigs = createDiv('Poderes disponiveis')
    customgameconfigs.parent('page')
    customgameconfigs.id('admenu')
    customgameconfigs.addClass('admenu')
    configsmenu = createDiv()
    configsmenu.parent('admenu')
    configsmenu.id('configsmenu')
    configsmenu.addClass('configs')
    text1 = createDiv('Positivos')
    text1.parent('configsmenu')
    text1.addClass('green')
    text2 = createDiv('Negativos')
    text2.parent('configsmenu')
    text2.addClass('red')
    text3 = createDiv('Neutros')
    text3.parent('configsmenu')
    customgameconfigs.hide()
    allPowers.forEach(power => {
        let button = createButton(power.p)
        button.mousePressed(() => changePowerActive(power.p, button))
        button.parent('configsmenu')
    })
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
    custommenu = createButton('Voltar')
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
    warning1 = createDiv('PC: Use o Mouse<br/><br/>Mobile: Use o toque<br/><br/>')
    warning1.addClass('warning')
    warning1.id('warning1')
    warning1.parent('page')
    warning1.hide()
    warningButton1 = createButton('Entendido')
    warningButton1.mousePressed(start)
    warningButton1.parent('warning1')
    warning2 = createDiv('PC:<br/> Jogador 1 - W e S<br/>Jogador 2 - ↑ e ↓<br/><br/>Mobile:<br/> Cada um controla <br/>seu lado com o toque<br/><br/>')
    warning2.addClass('warning')
    warning2.id('warning2')
    warning2.parent('page')
    warning2.hide()
    warningButton2 = createButton('Entendido')
    warningButton2.mousePressed(start)
    warningButton2.parent('warning2')
    page = document.getElementById('page')
    ballColors.push(color(255,255,255), color(255,0,0), color(255,255,0), color(255,0,230), color(30,225,232))
    particleColors.push(color(255,0,0),color(170,0,255))
    textAlign(LEFT)
    textSize(14)
    text('patch 1.7', 5, 15)
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
window.addEventListener("resize", function() {
    windowHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    myCanvas = createCanvas((windowWidth*4/5),windowHeight)
    background("#000000")
    myCanvas.position(windowWidth/10,0,"fixed")
    textAlign(LEFT)
    textSize(14)
    text('patch 1.7', 5, 15)
    balls[0].x = (windowWidth*4/5)/2
    balls[0].y = windowHeight/2
    balls[0].distance = (windowWidth*4/5)/120
    player1.y = windowHeight*7/16
    player1.height = windowHeight/3
    player2.x = (windowWidth*4/5)-10
    player2.y = windowHeight*7/16
    player2.height = windowHeight/3
});
window.addEventListener("orientationchange", function() {
    windowHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    myCanvas = createCanvas((windowWidth*4/5),windowHeight)
    background("#000000")
    myCanvas.position(windowWidth/10,0,"fixed")
    textAlign(LEFT)
    textSize(14)
    text('patch 1.7', 5, 15)
    balls[0].x = (windowWidth*4/5)/2
    balls[0].y = windowHeight/2
    balls[0].distance = (windowWidth*4/5)/120
    player1.y = windowHeight*7/16
    player1.height = windowHeight/3
    player2.x = (windowWidth*4/5)-10
    player2.y = windowHeight*7/16
    player2.height = windowHeight/3
});
function activateFullscreen(){
    if (page.requestFullscreen && !isFull) { 
        page.requestFullscreen()
        isFull = true
        screen.orientation.lock("landscape-primary")
    }
    else if(document.exitFullscreen && isFull){
        document.exitFullscreen()
        isFull = false
        screen.orientation.unlock()
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
function powerCatch(power, player, ball, referencex, referencey){
    if(sound){powerpickupsom.play()}
    switch(currentAllPowers[power].p){
        case 'Grande':
            let smallIndex = currentAllPowers.findIndex(power => {return power.p === 'Pequeno'})
            player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== smallIndex)
            player.height = windowHeight/2
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
                ball.distance = (windowWidth*4/5)/120
            })
            break
        case 'Invertido':
            player.activatedInverted = true
            break
        case 'Pequeno':
            let bigIndex = currentAllPowers.findIndex(power => {return power.p === 'Grande'})
            player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== bigIndex)
            player.height = windowHeight/6
            break
        case 'Gol de ouro':
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
        case 'Temporizador':
            if(ball.timetravel||ball.timereturn){return}
            ball.timeangle = ball.angle
            ball.horizontaltime = ball.horizontalControl
            ball.verticaltime = ball.verticalControl
            ball.ballTrack = []
            ball.timetravel = true
            break
        case 'Buraco Negro':
            allBlackHoles.push({x:referencex, y:referencey, frame:0, circumpherence:Math.PI*2*windowHeight/6})
            break
        case 'Desordenado':
            break
        default:
            break
    }
    if(currentAllPowers[power].p!=='Buraco Negro'){
        player['onlinePowers'] = player['onlinePowers'].filter(onpower => onpower.index !== power)
    }
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
        case 'Flares':
            player.activatedSneak = false
            determinePlayerColors(player)
            break
        case 'Temporizador':
            if(!balls[ball].timereturn){
                balls[ball].timetravel = false
                balls[ball].timereturn = true
            }
        case 'Buraco Negro':
            allBlackHoles.shift()
        default:
            break
    }
}
function drawParticles(){
    allParticles.forEach(particlearea => {
        if(particlearea.frame>30){allParticles = allParticles.filter(part => part!==particlearea)}
        let rightcolor = particleColors[particlearea.color]
        rightcolor.setAlpha(70)
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
        else{
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
        particlearea.frame++
    })
}
function spawnNewPower(){
    let xPos = Math.floor(Math.random()*(windowWidth*4/5)*2/3)+(windowWidth*4/5)/6
    let yPos = Math.floor(Math.random()*windowHeight*2/3)+windowHeight/6
    let numberOfPowersSpawned
    let allPowersChosen = []
    let randomNumber = Math.random()
    if(randomNumber<0.6){numberOfPowersSpawned=1}
    else if(randomNumber<0.85){numberOfPowersSpawned=2}
    else if(randomNumber<0.95){numberOfPowersSpawned=3}
    else if(randomNumber<0.99){numberOfPowersSpawned=4}
    else{numberOfPowersSpawned=10}
    if(numberOfPowersSpawned>numberOfPowers){numberOfPowersSpawned=numberOfPowers}
    if(numberOfPowersSpawned===10){allPowersChosen.push(0,1,2,3,4,5,6,7,8,9)}
    else{
        for(i=0; i<numberOfPowersSpawned; i++){
            for(y=0; y>=0; y++){
                powerChosen = Math.floor(Math.random()*numberOfPowers)
                if(allPowersChosen.indexOf(powerChosen)===-1){
                    allPowersChosen.push(powerChosen)
                    break
                }
            }
        }
    }
    let time = new Date()
    powersSpawned.push({n:numberOfPowersSpawned, x: xPos, y: yPos, p:allPowersChosen, expiretrack: time.getTime(), powerflicker:[4,8,12,16,20,24,26,28,29,30,31,32]})
    canSpawnPower = false
}
function drawPowerCircle(spawnedPower){
    let time = new Date()
    if(time.getTime()>spawnedPower.expiretrack+2.5*powerSpeed){
        powersSpawned = powersSpawned.filter(spower => spower!==spawnedPower)
        allParticles.push({x:spawnedPower.x, y:spawnedPower.y, type:'despawn', color:1, frame:0, particles:[]})
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
function goToUnfinished(){
    mainmenu.style('display', 'none')
    unfinished.style('display', 'flex')
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
    unfinished.style('display', 'none')
    customgamemenu.style('display','none')
    mainmenuconfigs.style('display','none')
}
function goToCustom(){
    mainmenu.style('display','none')
    customgameconfigs.style('display', 'none')
    customgamemenu.style('display','flex')
    subtitle2.html('Jogo customizado')
}
function pausegame(){
    pauseButton.hide()
    pauseMenu.style('display', 'flex')
    functiondiv.style('display', 'flex')
    paused = true
}
function resume(){
    pauseButton.show()
    pauseMenu.hide()
    functiondiv.hide()
    paused = false
}
window.addEventListener('keydown', (event) => {
    if(event.key === 'w'){player1.up = true}
    else if(event.key === 's'){player1.down = true}
    if(event.key === 'ArrowUp'){player2.up = true}
    else if(event.key === 'ArrowDown'){player2.down = true}
})
window.addEventListener('keyup', (event) => {
    if(event.key === 'w'){player1.up = false}
    else if(event.key === 's'){player1.down = false}
    if(event.key === 'ArrowUp'){player2.up = false}
    else if(event.key === 'ArrowDown'){player2.down = false}
})
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
        text('patch 1.7', 5, 15)
        textAlign(CENTER)
        textSize(37)
        text(player1.score+" - "+player2.score, (windowWidth*4/5)/2, windowHeight/7)
        allBlackHoles.forEach(blackhole => {
            particleColors[1].setAlpha(255)
            stroke(particleColors[1])
            fill(0)
            if(isParticles){
                for(i=0; i<40; i++){
                    let angle = Math.PI*2*i/40+Math.PI*2*blackhole.frame/375
                    push()
                    translate(blackhole.x+Math.cos(angle)*windowHeight/6, blackhole.y+Math.sin(angle)*windowHeight/6)
                    rotate(angle)
                    rect(0, 0, 1, 55)
                    pop()
                }
            }
            ellipse(blackhole.x, blackhole.y, windowHeight/3)
            blackhole.frame++
        })
        noStroke()
        if(canSpawnPower){
            spawnNewPower()
        }
        powersSpawned.forEach(spawnedPower => {
            drawPowerCircle(spawnedPower)
            balls.forEach(ball => {
                if(dist(ball.x, ball.y, spawnedPower.x, spawnedPower.y)<10+windowHeight/6){
                    let rightPlayer = ball.lastPlayerHit==1?player1:player2
                    spawnedPower['p'].forEach(chosenPower => {
                        powerCatch(chosenPower, rightPlayer, ball, spawnedPower.x, spawnedPower.y)
                    })
                    powersSpawned = powersSpawned.filter(spower => spower!==spawnedPower)
                    allParticles.push({x:spawnedPower.x, y:spawnedPower.y, type:'despawn', color:1, frame:0, particles:[]})
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
        if(!player1.activatedIce){
            if((player1.up&&!player1.activatedInverted)||(player1.down&&player1.activatedInverted)){
                player1.y = player1.y<=0?player1.y:player1.y-13
                player1.moved = true
            }
            if((player1.down&&!player1.activatedInverted)||(player1.up&&player1.activatedInverted)){
                player1.y = player1.y+player1.height>=windowHeight?player1.y:player1.y+13
                player1.moved = true
            }
        }
        if(!player2.activatedIce){
            if((player2.up&&!player2.activatedInverted)||(player2.down&&player2.activatedInverted)){
                player2.y = player2.y<=0?player2.y:player2.y-13
                player2.moved = true
            }
            if((player2.down&&!player2.activatedInverted)||(player2.up&&player2.activatedInverted)){
                player2.y = player2.y+player2.height>=windowHeight?player2.y:player2.y+13
                player2.moved = true
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
                const fireIndex = currentAllPowers.findIndex(power => {return power.p === 'Fogo'})
                stopPower(fireIndex, player2)
                allParticles.push({x:ball.x, y:ball.y, direction:-1, type:'fire', color:0, frame:0, particles:[]})
                ball.distance += (windowWidth*4/5)/70
                if(sound){efeito3.play()}
            }
            if(player2.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {return power.p === 'Flares'})
                stopPower(sneakIndex, player2)
                ball.sneak = true
            }
        }
        if(ball.x-10<=player1.x){
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
                const fireIndex = currentAllPowers.findIndex(power => {return power.p === 'Fogo'})
                stopPower(fireIndex, player1)
                allParticles.push({x:ball.x, y:ball.y, direction:1, type:'fire', color:0, frame:0, particles:[]})
                ball.distance += (windowWidth*4/5)/70
                if(sound){efeito3.play()}
            }
            if(player1.activatedSneak){
                const sneakIndex = currentAllPowers.findIndex(power => {return power.p === 'Flares'})
                stopPower(sneakIndex, player1)
                ball.sneak = true
            }
        }
        if(ball.sneak&&ball.horizontalControl===1){
            if(ball.x>(windowWidth*4/5)*3/7){ball.sneak=false}
        }
        if(ball.sneak&&ball.horizontalControl===-1){
            if(ball.x<(windowWidth*4/5)*4/7){ball.sneak=false}
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
        if(ball.distance>((windowWidth*4/5)/70)+((windowWidth*4/5)/120)){
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
        subtitle2.html(`Jogador 1 venceu!<br/>${player1.score} - ${player2.score}`)
        if(sound){
            musicajogo.pause()
            vitoriasom.play()
        }
        reset()
        return
    }
    else if(player2.score>=scoreLimit&&scoreLimit>0){
        subtitle2.html(`Jogador 2 venceu!<br/>${player1.score} - ${player2.score}`)
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
        horizontalControl: Math.random()>0.5?1:-1,
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
        timereturn: false
    }]
    let timeIndex = currentAllPowers.findIndex(power => {return power.p === 'Temporizador'})
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
        warning1.show()
        customgamemenu.hide()
        firstwarning1 = false
        return
    }
    if(!gameMode&&firstwarning2){
        warning2.show()
        customgamemenu.hide()
        firstwarning2 = false
        return
    }
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
            powerSpeed = 8000
            break
        case 'Normal':
            powerSpeed = 5000
            break
        case 'Loucura':
            powerSpeed = 2000
            break
    }
    loadPowersActive()
    if(anyPowerActive){
        powerInterval = setInterval(spawnPower, powerSpeed)
    }
    isParticles = particleSelect.value() === 'Ativadas'?true:false
    gameplaying = true
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
        timereturn: false
    }]
    player1.score = 0
    player1.y = windowHeight*7/16
    player1['onlinePowers'].forEach(onpower => {stopPower(onpower.index, player1, 0)})
    player1['onlinePowers'] = []
    player2.score = 0
    player2.y = windowHeight*7/16
    player2['onlinePowers'].forEach(onpower => {stopPower(onpower.index, player2, 0)})
    player2['onlinePowers'] = []
    currentAllPowers = []
    balls[0].timereturn = false
    fill(255)
    textSize(14)
    textAlign(LEFT)
    text('patch 1.7', 5, 15)
    customgamemenu.style('display', 'flex')
    imgdiv.style('display', 'flex')
    functiondiv.style('display', 'flex')
    pauseMenu.hide()
    pauseButton.hide()
}