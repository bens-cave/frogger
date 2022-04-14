function init() {

  // ? Elements
  const grid = document.querySelector('#grid')
  const levelno = document.querySelector('#froglevelno')
  const levelbox = document.querySelector('.froglevel')
  const face = document.querySelector('.face')
  const livesleft = document.querySelector('#froglivesleft')
  const livesbox = document.querySelector('.froglives')
  const gamename = document.querySelector('#postbanner')
  const audioPlayer = document.querySelector('audio')
  audioPlayer.volume = 0.1

  // ? Grid creation
  const width = 10 // potential to scale to bigger grid, but would need to add more enemy intervals and 'instances'
  const cellCount = width * width
  const cells = []
  let frogLives = 9
  let level = 1

  const welcome = document.querySelector('#welcome')
  const startBtn = document.querySelector('#startBtn')
  const bodyEffect = document.querySelector('body')
  grid.appendChild(welcome)
  // 
  function prepGame(){  // removes the start button and plays the intro gif and audio
    welcome.removeChild(startBtn)
    grid.removeChild(welcome)
    audioPlayer.src = 'assets/show_me_wyg.mov'
    audioPlayer.play()
    grid.style.backgroundImage = 'url("assets/show_me.gif")'
    setTimeout(startGame, 3800) // start the games once intro complete
    function startGame(){
      face.style.backgroundImage = 'url(assets/frog_face_wary.png)'
      face.style.backgroundColor = 'white'
      levelno.style.color = 'white'
      livesleft.style.color = 'white'
      audioPlayer.src = 'assets/intro.mp3'
      audioPlayer.play()
      audioPlayer.loop = true
      grid.style.backgroundImage = 'url("assets/purple_space.jpeg")'
      function createGrid(){
        for (let i = 0; i < cellCount; i++){
          const cell = document.createElement('div')
          cell.id = i
          grid.appendChild(cell)
          cells.push(cell)
        }
        // Add frog and enemies at start of game
        addFrog(currPos)
        addEnemyOne(startPosEOne, enemyOneClass)
        addEnemyOne(startPosEOneA, enemyOneAClass)
        addEnemyOne(startPosEOneB, enemyOneBClass)
        addEnemyTwo(startPosETwo, enemyTwoClass)
        addEnemyTwo(startPosETwoA, enemyTwoAClass)
        cells[width - 1].classList.add('portal')
      }

      // ? Character setup  // rather a lot of game-global variables...
      let frogClass = 'frog' 
      const startPos = cellCount - Math.floor(width / 2) 
      let currPos = startPos
      const startPosL2 = width - 1
      const enemyOneClass = 'enemyone'
      const startPosEOne = (cellCount) - (width * 2) // start of 2nd from bottom i.e. row 2
      const enemyOneAClass = 'enemyoneA'
      const startPosEOneA = (cellCount) - (width * 5)
      const enemyOneBClass = 'enemyoneB'
      const startPosEOneB = (cellCount) - (width * 7)
      const enemyTwoClass = 'enemytwo'
      const startPosETwo = (cellCount - 1) - (width * 3) // end of row 4
      const enemyTwoAClass = 'enemytwoA'
      const startPosETwoA = (cellCount - 1) - (width * 7) // end of row 8
      const enemyThreeClass = 'enemythree'
      const boom = 'explosion'
      const freddy = 'freddy'
      const startPosFreddy = 0
      let freddyCurPos = 0
      let hereHeComes
      const suit = 'suit'
      const suitspin = 'suitspin'
      const suitClass = 'frogangryl'
      const laser = 'laser'
      let beamIndex = 0
      let zapIt = 0

      // ? Executions
      function addFrog(position){
        if (level < 3){
          cells[position].classList.add(frogClass)
        } else if (level === 3) {
          cells[position].classList.remove(frogClass)
          frogClass = suitClass
          cells[position].classList.add(frogClass)
        }
      }
      function addEnemyOne(position, enemyClass){
        for (let i = position; i < position + (width - 1); i++){
          cells[i].classList.add(enemyClass)
          i++
        }
      }
      function addEnemyTwo(position, enemyClass){
        for (let i = position; i > (position - width); i--){
          cells[i].classList.add(enemyClass)
          i--
          cells[i].classList.add(enemyClass)
          i--
          if (position - width > 3){
            i++
          }
          i--
          i--
        }
      }
      function addFreddy(position){
        cells[position].classList.add(freddy)
      }
      function removeFrog(position){
        cells[position].classList.remove(frogClass)
      }
      function removeEnemyThree(position){
        cells[position].classList.remove(enemyThreeClass)
      }

      // * Movement functions
      function handleKeyDown(event){
        const key = event.keyCode
        const left = 37
        const right = 39
        const up = 38
        const down = 40
        const spaceBar = 32

        // Remove frog whilst currPos matches the old frog position
        removeFrog(currPos)
        if (level < 3) { // ! currently, frog will disappear if you try to go off screen! but is still there
          if (key === left && currPos % width !== 0){
            cells[currPos].classList.remove(frogClass)
            currPos--
            frogClass = 'frogleft'
            cells[currPos].classList.add(frogClass)
          } else if (key === right && currPos % width !== width - 1){
            cells[currPos].classList.remove(frogClass)
            currPos++
            frogClass = 'frog'
            cells[currPos].classList.add(frogClass)
          } else if (key === up && currPos >= width){
            cells[currPos].classList.remove(frogClass)
            currPos -= width
            cells[currPos].classList.add(frogClass)
          } else if (key === down && currPos + width < cellCount){
            cells[currPos].classList.remove(frogClass)
            currPos += width
            cells[currPos].classList.add(frogClass)
          } else {
            console.log('INVALID KEY')
          }
          collisionCheck(currPos)
        } else if (level === 3) { // special movement for level 3, removes vertical movement and adds spacebar
          if (key === left && currPos % width !== 0){
            cells[currPos].classList.remove(frogClass)
            face.style.backgroundImage = 'url(assets/frog_face_suit_angry_l.png)'
            currPos--
            console.log(currPos)
            frogClass = 'frogangryl'
            cells[currPos].classList.add(frogClass)
          } else if (key === right && currPos % width !== width - 1){
            cells[currPos].classList.remove(frogClass)
            face.style.backgroundImage = 'url(assets/frog_face_suit_angry_r.png)'
            currPos++
            console.log(currPos)
            frogClass = 'frogangryr'
            cells[currPos].classList.add(frogClass)
          } else if (key === up){
            cells[currPos].classList.remove(frogClass)
            frogClass = 'frogaway'
            cells[currPos].classList.add(frogClass)
            console.log('Invalid key')
          } else if (key === down){
            console.log('Invalid key')
          } else if (key === spaceBar) {
            event.preventDefault()
            frogClass = 'frogfire'
            // audioPlayer.src = 'assets/zap.mov'  // gun sound removes for now. Maybe create 2nd audio player
            // audioPlayer.play()
            cells[currPos].classList.add(frogClass)
            beamIndex = currPos - width
            cells[beamIndex].classList.add(laser)
            // document.removeEventListener('keydown', handleKeyDown)  // kept whilst debugging laser
            zapIt = setInterval(() => {
              if (beamIndex < width){
                cells[beamIndex].classList.remove(laser)
                clearInterval(zapIt)
                // document.addEventListener('keydown', handleKeyDown)
              } else {
                cells[beamIndex].classList.remove(laser)
                beamIndex = beamIndex - width
                cells[beamIndex].classList.add(laser)
                hitCheck(beamIndex)
              }
            }, 150)
          } else {
            console.log('INVALID KEY')
          }
        }
        if (level < 3){
          changeFace()
        }
      }
      // * Enemy movement carousels
      const enemyOneInterval = setInterval(moveEnemyOne, 850, startPosEOne, enemyOneClass)
      const enemyOneAInterval = setInterval(moveEnemyOne, 800, startPosEOneA, enemyOneAClass)
      const enemyOneBInterval = setInterval(moveEnemyOne, 450, startPosEOneB, enemyOneBClass)
      const enemyTwoInterval = setInterval(moveEnemyTwo, 500, startPosETwo, enemyTwoClass)
      const enemyTwoAInterval = setInterval(moveEnemyTwo, 300, startPosETwoA, enemyTwoAClass)
      const checkEndL1Interval = setInterval(checkEndL1, 500)
      let enemyOneInterval2
      let enemyOneAInterval2
      let enemyOneBInterval2
      let enemyTwoInterval2
      let enemyTwoAInterval2
      const checkEndL2Interval = setInterval(checkEndL2, 200)

      function moveEnemyOne(position, enemyClass) {
        // enemyone default movement L ---> R
        collisionCheck(position)
        if (cells[position].classList.contains(enemyClass)){
          for (let i = position; i < (position + (width)); i++){
            cells[i].classList.remove(enemyClass)
            i++
            cells[i].classList.add(enemyClass)
            collisionCheck(i)
          }
        } else {
          for (let i = position; i < (position + (width - 1)); i++){
            cells[i].classList.add(enemyClass)
            collisionCheck(i)
            i++
            cells[i].classList.remove(enemyClass)
          }
        }
        if (level === 3){
          for (let i = position; i < (position + (width)); i++){
            cells[i].classList.remove(enemyClass)
          }
        }
      }  

      function moveEnemyTwo(position, enemyClass) {
        // enemytwo default movement L <--- R
        for (let i = (position - (width - 1)); i < position + 1; i++) {
          if ((cells[i].classList.contains(enemyClass))) {
            cells[i].classList.remove(enemyClass)
            const currentPos = i - 1
            cells[currentPos].classList.add(enemyClass)
            collisionCheck(currentPos)
          }
        } // Can't do right to left movement without messing up the cells[0] value
        // What am I doing here below...? sorting out the first cell in row
        const foo = position - (width)
        if (cells[foo].classList.contains(enemyClass)){
          cells[foo].classList.remove(enemyClass)
          cells[position].classList.add(enemyClass)
          collisionCheck(position)
        }
      }

      function moveFreddy(){
        if (level === 2) {
          if (currPos > freddyCurPos) {
            if (currPos - freddyCurPos < 10){
              cells[freddyCurPos].classList.remove(freddy)
              freddyCurPos++
              cells[freddyCurPos].classList.add(freddy)
            } else {
              cells[freddyCurPos].classList.remove(freddy)
              freddyCurPos = freddyCurPos + width
              cells[freddyCurPos].classList.add(freddy)
            }
            collisionCheck(freddyCurPos)
          } else if (currPos < freddyCurPos) {
            if (freddyCurPos - currPos < 10){
              cells[freddyCurPos].classList.remove(freddy)
              freddyCurPos--
              cells[freddyCurPos].classList.add(freddy)
            } else {
              cells[freddyCurPos].classList.remove(freddy)
              freddyCurPos = freddyCurPos - width
              cells[freddyCurPos].classList.add(freddy)
            }
            collisionCheck(freddyCurPos)
          }
        } else {
          clearInterval(hereHeComes)
          cells[freddyCurPos].classList.remove(freddy)
        }
      }

      function collisionCheck(position){ // function runs throughout levels 1 and 2 to check for collisions
        if (cells[position].classList.contains(frogClass) && (cells[position].classList.contains(enemyOneClass) || cells[position].classList.contains(enemyTwoClass) ||
        cells[position].classList.contains(enemyOneAClass) || cells[position].classList.contains(enemyOneBClass) || cells[position].classList.contains(enemyTwoAClass))) {
          console.log('Collision!')
          frogLives--
          cells[position].classList.add(boom)
          const boomStop = () => cells[position].classList.remove(boom)
          setTimeout(boomStop, 700)
          livesleft.textContent = `Lives: ${frogLives}`
          removeFrog(position)
          if (frogLives === 0) {
            face.style.backgroundImage = 'url(assets/frog_face_yell.png)'
            console.log('GAME OVER')
            cells[width - 1].classList.remove('portal')
            clearInterval(enemyOneInterval)
            clearInterval(enemyOneAInterval)
            clearInterval(enemyOneBInterval)
            clearInterval(enemyTwoInterval)
            clearInterval(enemyTwoAInterval)
            document.removeEventListener('keydown', handleKeyDown)
            grid.style.backgroundImage = 'url(assets/big_boom.gif)'
            setTimeout(() => {
              grid.style.backgroundImage = 'url(assets/show_me_boo.gif)'
              audioPlayer.src = 'assets/boo.mov'
              audioPlayer.volume = 0.3
              audioPlayer.play()
            }, 3200)
            clearBoard()
          } else {
            if (level === 2) { 
              currPos = startPosL2
              addFrog(currPos)
            } else if (level === 1){ 
              currPos = startPos
              frogClass = 'frog'
              addFrog(currPos)
              face.style.backgroundImage = 'url(assets/frog_face_wary.png)'
            }
          }
        }
      }

      function hitCheck(position) { // function runs throughout level 3 to check for laser hits on enemies
        if (cells[position].classList.contains(enemyThreeClass) && cells[position].classList.contains(laser)) {
          // document.addEventListener('keydown', handleKeyDown)
          removeEnemyThree(position)
          cells[position].classList.remove(laser)
          cells[position].classList.add(boom)
          const boomStop = () => cells[position].classList.remove(boom)
          setTimeout(boomStop, 500)
          clearInterval(zapIt)
        }
        win()
      }
      // ? Events
      document.addEventListener('keydown', handleKeyDown)

      // Initial setup
      createGrid()

      function checkEndL1(){  // runs on interval, checking if frog has entered portal
        if (cells[width - 1].classList.contains(frogClass)){ //checks for presence of frog in cells[0->width]
          document.removeEventListener('keydown', handleKeyDown)
          cells[startPosL2].classList.remove('portal')
          cells[startPosL2].classList.add('redportal')
          grid.style.backgroundImage = 'url(assets/wrong_portal.gif)'
          audioPlayer.src = 'assets/portal_long.mov'
          audioPlayer.volume = 0.5
          audioPlayer.play()
          audioPlayer.loop = false
          clearInterval(enemyOneInterval)
          clearInterval(enemyOneAInterval)
          clearInterval(enemyOneBInterval)
          clearInterval(enemyTwoInterval)
          clearInterval(enemyTwoAInterval)
          clearBoard()
          setTimeout(() => {  // level 2 intro
            audioPlayer.src = 'assets/freddy_appear.mov'
            audioPlayer.play()
            bodyEffect.classList.add('redImg')
          }, 5000)
          setTimeout(() => {  // level 2 intro continued
            grid.style.backgroundImage = 'url(assets/freddy_run.gif)'
            bodyEffect.classList.remove('redImg')
          }, 8000)
          setTimeout(endLevelOne, 10000)  // level 2 intro continued
          face.style.backgroundImage = 'url(assets/frog_face_bashful.png)'
          clearInterval(checkEndL1Interval)
        }
        function endLevelOne() { // sets up level 2
          // * audio scary / chase music
          audioPlayer.src = 'assets/level_2.mov'
          audioPlayer.play()
          audioPlayer.loop = true
          gamename.innerText = `'s FROG-SCARY-MAN?`
          document.addEventListener('keydown', handleKeyDown)
          cells[startPosL2].classList.remove('redportal')
          face.style.backgroundImage = 'url(assets/frog_face_scared.png)'
          grid.style.backgroundImage = 'url(assets/freddy_background.jpeg)'
          addFreddy(startPosFreddy)
          level = 2
          addEnemyOne(startPosEOne, enemyOneClass)
          addEnemyOne(startPosEOneA, enemyOneAClass)
          addEnemyOne(startPosEOneB, enemyOneBClass)
          addEnemyTwo(startPosETwo, enemyTwoClass)
          addEnemyTwo(startPosETwoA, enemyTwoAClass)
          levelno.textContent = `Level: ${level}`
          enemyOneInterval2 = setInterval(moveEnemyOne, 1850, startPosEOne, enemyOneClass)
          enemyOneAInterval2 = setInterval(moveEnemyOne, 1800, startPosEOneA, enemyOneAClass)
          enemyOneBInterval2 = setInterval(moveEnemyOne, 1450, startPosEOneB, enemyOneBClass)
          enemyTwoInterval2 = setInterval(moveEnemyTwo, 1500, startPosETwo, enemyTwoClass)
          enemyTwoAInterval2 = setInterval(moveEnemyTwo, 1300, startPosETwoA, enemyTwoAClass)
          hereHeComes = setInterval(moveFreddy, 1800, freddyCurPos)
          cells[startPos].classList.add(suit)
        }
        // }
      }

      function checkEndL2(){
        if (cells[currPos].classList.contains(suit) && level === 2) {
          document.removeEventListener('keydown', handleKeyDown)
          cells[startPos].classList.remove(frogClass)
          cells[startPos].classList.remove(suit)
          cells[startPos].classList.add(suitspin)
          clearInterval(hereHeComes)
          cells[freddyCurPos].classList.remove(freddy)
          audioPlayer.src = 'assets/level_3.mov'
          audioPlayer.play()
          audioPlayer.loop = true
          setTimeout(grid.style.backgroundImage = 'url(assets/showtime.gif)', 2500)
          setTimeout(endLevelTwo, 5200)
          clearInterval(enemyOneInterval)
          clearInterval(enemyOneAInterval)
          clearInterval(enemyOneBInterval)
          clearInterval(enemyTwoInterval)
          clearInterval(enemyTwoAInterval)
          clearInterval(enemyOneInterval2)
          clearInterval(enemyOneAInterval2)
          clearInterval(enemyOneBInterval2)
          clearInterval(enemyTwoInterval2)
          clearInterval(enemyTwoAInterval2)
          // clear the board of enemies - maybe just cells.map to remove all enemy types?
          clearBoard()
        }
        function endLevelTwo(){
          face.style.backgroundImage = 'url(assets/frog_face_suit_angry_l.png)'
          levelno.textContent = ''
          livesleft.textContent = ''
          levelbox.style.backgroundImage = 'url(assets/spacebar.gif)'
          livesbox.style.backgroundImage = 'url(assets/morty_laser.gif)'
          grid.style.backgroundImage = 'url(assets/invade.gif)'
          document.addEventListener('keydown', handleKeyDown)
          gamename.innerText = `'s FROG-SCARY-MAN... uh..INVADERS?`
          clearInterval(checkEndL2Interval)
          level = 3
          levelno.textContent = `Level: ${level}`
          cells[startPos].classList.remove(suitspin)
          frogClass = 'frogaway'
          currPos = startPos
          cells[currPos].classList.add(frogClass)
          // add level 3 enemy army
          for (let y = width + 2; y < (cellCount - (width * 4)); y){
            cells[y].classList.add(enemyThreeClass)
            y++
            cells[y].classList.add(enemyThreeClass)
            y++
            cells[y].classList.add(enemyThreeClass)
            y++
            cells[y].classList.add(enemyThreeClass)
            y++
            cells[y].classList.add(enemyThreeClass)
            y++
            cells[y].classList.add(enemyThreeClass)
            y += 5
          }
        }
      }
      function changeFace(){
        if (frogLives === 0){
          face.style.backgroundImage = 'url(assets/frog_face_yell.png)'
        } else if (level === 2){
          face.style.backgroundImage = 'url(assets/frog_face_scared.png)'
        } else if (level === 3){
          face.style.backgroundImage = 'url(assets/frog_face_suit_angry_l.png)'
        } else if (level === 1 && currPos > 0 && currPos < cellCount - 2){
          if (cells[currPos - 1].classList.contains(enemyOneClass) || cells[currPos + 1].classList.contains(enemyOneClass)){
            face.style.backgroundImage = 'url(assets/frog_face_gulp.png)'
            // * audio gulp noise
          } else if (cells[currPos - 1].classList.contains(enemyOneAClass) || cells[currPos + 1].classList.contains(enemyOneAClass)) {
            face.style.backgroundImage = 'url(assets/frog_face_gulp.png)'
          } else if (cells[currPos - 1].classList.contains(enemyOneBClass) || cells[currPos + 1].classList.contains(enemyOneBClass)) {
            face.style.backgroundImage = 'url(assets/frog_face_gulp.png)'
          } else if (cells[currPos - 1].classList.contains(enemyTwoClass) || cells[currPos + 1].classList.contains(enemyTwoClass)) {
            face.style.backgroundImage = 'url(assets/frog_face_gulp.png)'
            // * audio gulp noise
          } else if (cells[currPos - 1].classList.contains(enemyTwoAClass) || cells[currPos + 1].classList.contains(enemyTwoAClass)) {
            face.style.backgroundImage = 'url(assets/frog_face_gulp.png)'
            // * audio eww/scared/gasp noise
          } else {
            face.style.backgroundImage = 'url(assets/frog_face_wary.png)'
          }
        }
      }
      function clearBoard() {
        for (let i = startPosEOne; i < startPosEOne + width; i++){
          cells[i].classList.remove(enemyOneClass)
        }
        for (let i = startPosEOneA; i < startPosEOneA + width; i++){
          cells[i].classList.remove(enemyOneAClass)
        }
        for (let i = startPosEOneB; i < startPosEOneB + width; i++){
          cells[i].classList.remove(enemyOneBClass)
        }
        for (let i = 20; i < 30; i++){
          cells[i].classList.remove(enemyTwoAClass)
        }
        for (let i = 60; i < 70; i++){
          cells[i].classList.remove(enemyTwoClass)
        }
      }
      function win() {
        let countEnemies = 0
        for (let i = 0; i < cellCount - width * 3; i++){
          if (cells[i].classList.contains(enemyThreeClass)){
            countEnemies++
          } else {
            if (i === 69 && countEnemies === 0) {
              document.removeEventListener('keydown', handleKeyDown)
              levelno.textContent = ''
              levelbox.style.backgroundImage = ''
              livesbox.style.backgroundImage = ''
              removeFrog(currPos)
              console.log('Got them all!!!')
              audioPlayer.src = 'assets/good_job.mov'
              audioPlayer.play()
              grid.style.backgroundImage = 'url(assets/show_me_yeah.gif)'
              face.style.backgroundImage = 'url(assets/frog_face_happy.png)'
              setTimeout(() => {
                grid.style.backgroundImage = 'url(assets/p.png)'
                audioPlayer.src = 'assets/schwifty.mov'
                audioPlayer.play()
                audioPlayer.loop = false
              }, 2900)
              setTimeout(() => {
                grid.style.backgroundImage = 'url(assets/schwifty.gif)'
              }, 7900)
              setTimeout(() => {
                grid.style.backgroundImage = 'url(assets/start_page.png)'
              }, 24450)
            }
          }
        }
      }
    }
  }
  startBtn.addEventListener('click', prepGame) 

}

window.addEventListener('DOMContentLoaded', init)