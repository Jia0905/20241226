

let sprites = {
    // 第一個角色的精靈圖（原有的）
    player1: {
      idle: {
        img: null,
        width: 32,
        height: 36,
        frames: 1
      },
      walk: {
        img: null,
        width: 40,
        height: 36,
        frames: 6
      },
      jump: {
        img: null,
        width: 40,
        height: 36,
        frames: 6
      },
     
    },
    // 第二個角色的精靈圖
    player2: {
      idle: {
        img: null,
        width: 42,
        height: 34,
        frames: 6
      },
      
      walk: {
        img: null,
        width: 42,
        height: 34,
        frames: 6
      },
      jump: {
        img: null,
        width: 42,
        height: 34,
        frames: 6
      },
      
    },
     
    bullet: {  //發射子彈
      img: null,
      width:24,
      height: 20,
      frames: 1
    }
  };
  let bgLayers = {
    background: {
      img: null,
      x: 0,
      speed: 1
    },
    
  };
  let player1 = {
    x: 100,
    y: 200,
    speedX: 5,
    speedY: 0,
    gravity: 0.8,
    jumpForce: -15,
    isJumping: false,
    groundY: 550,
    currentFrame: 0,
    currentAction: 'idle',
    direction: 1,
    bullets: [],
    health: 100 // 生命值
  };
  
  // 新增第二個角色
  let player2 = {
    x: 800,
    y: 200,
    speedX: 5,
    speedY: 0,
    gravity: 0.8,
    jumpForce: -15,
    isJumping: false,
    groundY: 550,
    currentFrame: 0,
    currentAction: 'idle',
    direction: -1,
    bullets: [],
    health: 100
  };
  
  
  
  function preload() {
    bgLayers.background.img =loadImage('background.png');
    // 載入三個不同的精靈圖
    sprites.player1.idle.img = loadImage('idle.png');
    sprites.player1.walk.img = loadImage('walk1.png');
    sprites.player1.jump.img = loadImage('walk1.png');
    sprites.player2.idle.img = loadImage('walk2.png');
    sprites.player2.walk.img = loadImage('walk2.png');
    sprites.player2.jump.img = loadImage('walk2.png');
   // sprites.explosion.img = loadImage('explosion.png');
    sprites.bullet.img = loadImage('bullet1.png');
    
  }
  
  
  
  function setup() {
    createCanvas(windowWidth,windowHeight);
    frameRate(12); // 設定動畫速度
   
  }
  
  
  
  function draw() {
    drawbackground(); 
      push();
      textSize(200);
      textAlign(CENTER, CENTER);
      fill(100); // 深灰色
      text('TKU', width/2, height/2);
      pop();
    // 更新物理
    updatePhysics(player1);
    updatePhysics(player2);
    
    // 檢查按鍵
    checkKeys();
    
    // 檢查碰撞
    checkCollisions();
    
    // 繪製角色
    drawCharacter(player1, sprites.player1);
    drawCharacter(player2, sprites.player2);
    
    // 繪製子彈
    drawBullets(player1);
    drawBullets(player2);
    
    // 繪製生命值
    drawHealth();
    
  
    // 顯示操作方法
    displayControls();
  
    
  
  
  }
  
  
  function displayControls() {
    fill(255);
    textSize(20);
    
    // 顯示控制說明
    text("控制方法:", 10, 20);
    text("玩家1 (A, D - 左右移動, W - 跳躍, E - 發射子彈)", 10, 40);
    text("玩家2 (箭頭 - 左右移動, 上箭頭 - 跳躍, 空白鍵 - 發射子彈)", 10, 60);
  
  }
  
  
  
  function drawCharacter(player, playerSprites) {
    let currentSprite = playerSprites[player.currentAction];
    player.currentFrame = (player.currentFrame + 1) % currentSprite.frames;
    let sx = player.currentFrame * currentSprite.width;
  
    push();
    translate(player.x + (player.direction === -1 ? currentSprite.width : 0), player.y);
    scale(player.direction, 1);
    image(currentSprite.img, 
      0, 0, 
      currentSprite.width, currentSprite.height, 
      sx, 0, 
      currentSprite.width, currentSprite.height
    );
    pop();
  
    // 繪製角色頭上的血量條
    drawHealth(player, currentSprite.width);
  }
  
  
  function drawHealth() {
    
    // 玩家1生命值 
    fill(255, 0, 0);
    rect(player1.x, player1.y - 10, player1.health, 5,10);
    fill(255); // 設置文本顏色為白色
    text(player1.health + '/100', player1.x, player1.y - 15); // 顯示玩家1的生命值
  
    // 玩家2生命值 
    fill(0, 0, 255);
    rect(player2.x, player2.y - 10, player2.health, 5, 10);  // 修正了位置和參數順序
    fill(255); // 設置文本顏色為白色
    text(player2.health + '/100', player2.x, player2.y - 15); // 顯示玩家2的生命值 
  }
  
  
  // 檢查碰撞
function checkCollisions() {
  // 檢查玩家1的子彈是否擊中玩家2
  for (let i = player1.bullets.length - 1; i >= 0; i--) {
    let bullet = player1.bullets[i];
    if (checkBulletHit(bullet, player2)) {
      player2.health = max(0, player2.health - 10); // 確保健康值不小於0
      // 不要立即移除子彈，等爆炸動畫完成
    }
  }
  
  // 檢查玩家2的子彈是否擊中玩家1
  for (let i = player2.bullets.length - 1; i >= 0; i--) {
    let bullet = player2.bullets[i];
    if (checkBulletHit(bullet, player1)) {
      player1.health = max(0, player1.health - 10); // 確保健康值不小於0
      // 不要立即移除子彈，等爆炸動畫完成
    }
  }
}
  
  // 檢查子彈是否擊中
  function checkBulletHit(bullet, player) {
    return bullet.x > player.x && 
           bullet.x < player.x + sprites.player1.idle.width &&
           bullet.y > player.y &&
           bullet.y < player.y + sprites.player1.idle.height;
  }
  
  // 鍵盤控制
  function keyPressed() {
    // 玩家1控制 (WASD + E)
    if (key === 'E' || key === 'e') {  // 同時處理大小寫F
      shoot(player1);
      player1.currentAction = 'jump';
    }
    
    // 玩家2控制
    if (keyCode === 32) { // 空白鍵
      shoot(player2);
      player2.currentAction = 'jump';
    }
  }
  
  function checkKeys() {
    // 玩家1移動控制
    if (keyIsDown(65)) { // A鍵
      player1.x -= player1.speedX;
      player1.direction = -1;
      player1.currentAction = 'walk';
    } else if (keyIsDown(68)) { // D鍵
      player1.x += player1.speedX;
      player1.direction = 1;
      player1.currentAction = 'walk';
    } else if (!player1.isJumping) {
      player1.currentAction = 'idle';
    }
  
    if (keyIsDown(87) && !player1.isJumping) { // W鍵
      player1.speedY = player1.jumpForce;
      player1.isJumping = true;
      player1.currentAction = 'jump';
    }
  
    // 玩家2移動控制
    if (keyIsDown(LEFT_ARROW)) {
      player2.x -= player2.speedX;
      player2.direction = -1;
      player2.currentAction = 'walk';
    } else if (keyIsDown(RIGHT_ARROW)) {
      player2.x += player2.speedX;
      player2.direction = 1;
      player2.currentAction = 'walk';
    } else if (!player2.isJumping) {
      player2.currentAction = 'idle';
    }
  
    if (keyIsDown(UP_ARROW) && !player2.isJumping) {
      player2.speedY = player2.jumpForce;
      player2.isJumping = true;
      player2.currentAction = 'jump';
    }
  }
  
  // 發射子彈
  function shoot(player) {
    if (player.bullets.length < 3) {
      // 取得當前角色精靈的寬度
      let playerWidth = sprites[player === player1 ? 'player1' : 'player2'].idle.width;
      
      let bullet = {
        x: player.x + (player.direction === 1 ? playerWidth : 0), // 使用正確的角色寬度
        y: player.y + playerWidth/2, // 調整垂直位置到角色中間
        speed: 10 * player.direction,
        isExploding: false,
        currentFrame: 0,
        explosionFrame: 0
      };
      
      console.log("Shooting bullet from:", player.x, player.y); // 除錯用
      console.log("Bullet position:", bullet.x, bullet.y);
      
      player.bullets.push(bullet);
      player.currentAction = 'jump';
      
      setTimeout(() => {
        if (!player.isJumping && player.currentAction === 'jump') {
          player.currentAction = 'idle';
        }
      }, 500);
    }
  }
  function updatePhysics(player) {
    // 應用重力
    if (player.y < player.groundY) {
      player.speedY += player.gravity;
      player.isJumping = true;
    }
    
    // 更新垂直位置
    player.y += player.speedY;
    
    // 檢查是否著地
    if (player.y >= player.groundY) {
      player.y = player.groundY;
      player.speedY = 0;
      player.isJumping = false;
      if (player.currentAction === 'jump') {
        player.currentAction = 'idle';
      }
    }
    
    // 確保角色不會超出畫面範圍
    if (player.x < 0) {
      player.x = 0;
    }
    if (player.x > width - sprites.player1.idle.width) {
      player.x = width - sprites.player1.idle.width;
    }
    
    // 如果沒有其他動作，回到待機狀態
    if (!player.isJumping && player.currentAction !== 'walk') {
      player.currentAction = 'idle';
    }
  }
  function drawBullets(player) {
      
    for (let i = player.bullets.length - 1; i >= 0; i--) {
      let bullet = player.bullets[i];
      
      if (!bullet.isExploding) {
        let sx = bullet.currentFrame * sprites.bullet.width;
        
        push();
        translate(bullet.x + (bullet.speed < 0 ? sprites.bullet.width : 0), bullet.y);
        scale(bullet.speed > 0 ? 1 : -1, 1);
        image(sprites.bullet.img, 
              0, 0,
              sprites.bullet.width, sprites.bullet.height,
              sx, 0,
              sprites.bullet.width, sprites.bullet.height);
        pop();
        
        bullet.x += bullet.speed;
        
        bullet.currentFrame = (bullet.currentFrame + 1) % sprites.bullet.frames;
        
        if (bullet.x < 0 || bullet.x > width) {
          player.bullets.splice(i, 1);
          continue;
        }
        
      } 
      
    }
  }
  function drawbackground(){
    background(bgLayers.background.img);}