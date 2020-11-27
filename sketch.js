var score = 0;
var PLAY = 1;
var END = 0;
var poleGrp,obsGrp,coinGrp,platformGrp;
var gameState = PLAY;

function preload(){
 
  ground_Img = loadImage("images/ground.png");

  platform1_Img = loadImage("images/platform1.png");

  cloud1_Img = loadImage("images/cloud1.png");
  cloud2_Img = loadImage("images/cloud2.png");
  cloud3_Img = loadImage("images/cloud3.png");
  cloud4_Img = loadImage("images/cloud4.png");
  cloud5_Img = loadImage("images/cloud5.png");

  
  coin_Img = loadAnimation("images/coin1.png","images/coin2.png","images/coin3.png","images/coin4.png");
  

  lepord_Img = loadAnimation("images/lepord1.png","images/lepord2.png","images/lepord3.png","images/lepord4.png")
  lepordStopped_Img = loadAnimation("images/lepord3.png");

  coinStopped_Img = loadAnimation("images/coin1.png");

  man_running = loadAnimation("images/tile001.png","images/tile002.png","images/tile003.png");
  man_stopped = loadAnimation("images/tile000.png");
  man_fall = loadAnimation("images/tile006.png");

  gameOver_Img = loadImage("images/gameOver.png");
  restart_Img = loadImage("images/restart.png");
  
}

function setup() {
  createCanvas(windowWidth-10 ,windowHeight/2 + 100);
  
  man = createSprite(100,height-250);
  man.addAnimation("running",man_running);
  man.addAnimation("stopped",man_stopped);
  man.addAnimation("fall",man_fall);
  man.setCollider("rectangle",0,0,man.width-20,man.height-10);
 // man.debug = true;
  man.scale = 0.8;

  ground = createSprite(0,height-20);
  ground.addImage(ground_Img);
  ground.velocityX = -6;

  invisibleGround = createSprite(width/2,height-50,width,10);
  invisibleGround.visible = false;

  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOver_Img);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restart_Img);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;

  gameOver.visible = false;
  restart.visible = false;

  obsGrp = new Group();
  coinGrp = new Group();
  poleGrp = new Group();
  platformGrp = new Group();
  enemyGrp = new Group();
  cloudGrp = new Group();
  invisiblePlatformGrp = new Group();
}

function draw() {
  background("lightblue"); 
  if((keyDown("space") || keyDown(UP_ARROW)) && man.y >= 100){
    man.velocityY = -10;
    man.changeAnimation("running",man_running);
  }

  man.velocityY = man.velocityY + 0.8;

  if(gameState === PLAY){
    spawnEnemy();
    spawnPlatform();
    spawnCoins();
    spawnClouds();
   
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    getScore();

    if(obsGrp.isTouching(man)){
      //man.scale = 0.4;
      man.setVelocity(0,0);
    }

    if(enemyGrp.isTouching(man)){    
      for(var i=0;i<enemyGrp.length; i++){
        enemyGrp.get(i).changeAnimation("lepordStop",lepordStopped_Img);
      }
      gameState = END;
    }

   //Stop on platform
    if(invisiblePlatformGrp.isTouching(man)){
      man.setVelocity(0,0);
      man.changeAnimation("stopped",man_stopped);
    }
  }
  else if (gameState === END){
    ground.setVelocity(0,0);
    man.setVelocity(0,0);
    man.changeAnimation("fall",man_fall);

    gameOver.visible = true;
    restart.visible = true;

    coinGrp.setVelocityXEach(0);
   // obsGrp.setVelocityXEach(0);
    enemyGrp.setVelocityXEach(0);
    platformGrp.setVelocityXEach(0);
    cloudGrp.setVelocityXEach(0);
    invisiblePlatformGrp.destroyEach();

   // obsGrp.setLifetimeEach(-1);
    enemyGrp.setLifetimeEach(-1);
    coinGrp.setLifetimeEach(-1);
    platformGrp.setLifetimeEach(-1);
    cloudGrp.setLifetimeEach(-1);

    if(mousePressedOver(restart)) {
      reset();
    }
  }

  man.collide(invisibleGround);

  drawSprites();

  textSize(20);
  fill("blue");
  text("Score : "+score,width-200,50);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  enemyGrp.destroyEach();
 // obsGrp.destroyEach();
  coinGrp.destroyEach();
  platformGrp.destroyEach();
  invisiblePlatformGrp.destroyEach();
  cloudGrp.destroyEach();
  
  man.changeAnimation("running",man_running);
  score = 0;
}

function getScore(){
    for(var i=0;i<coinGrp.length; i++){
      if(coinGrp.get(i).isTouching(man)){
        score = score +100;

        // if(score%2 === 0)
        //     man.scale = 0.7;

        coinGrp.get(i).destroy();
      }
    }
}

function spawnEnemy(){
  if(frameCount % 300 === 0){
    enemy = createSprite(width/2+100,height-77);
  //  cactus.scale = 0.3;
    enemy.addAnimation("ememyMove",lepord_Img);
    enemy.addAnimation("lepordStop",lepordStopped_Img);

    //  var num = Math.round(random(1,2));
    // switch(num){
    //   case 1 : enemy.addAnimation("ememyMove",lepord_Img);
    //             break;
    //   case 2 : enemy.addAnimation("cactusMove",cactus_Img);
    //             break;
    //   default : break;
    // }

    enemy.velocityX = -3;
    enemy.lifetime = 350;
    enemyGrp.add(enemy);
  }
}

function spawnCoins(){
  if(frameCount % 100 === 0){
    coin = createSprite(width/2-100,height/2-90);
    coin.scale = 0.4;
    coin.addAnimation("coinAni",coin_Img);
    coin.velocityX = -3;
    coin.lifetime = 350;
    coinGrp.add(coin);
  }
}

function spawnClouds(){
  if(frameCount % 150 === 0){
    cloud = createSprite(width/2,70);
    cloud.scale = 0.3;
  
   var selectCloud = Math.round(random(1,3));
    
    switch(selectCloud){
      case 1 : cloud.addImage(cloud1_Img);
                break;
      case 2 : cloud.addImage(cloud2_Img);
                break;
      case 3 : cloud.addImage(cloud3_Img);
                break;
      case 4 : cloud.addImage(cloud4_Img);
                break;
      case 5 : cloud.addImage(cloud5_Img);
                break;
      default : break;
    }

    cloud.velocityX = -3;
    cloud.lifetime = 350;
    cloudGrp.add(cloud);
  }
}

function spawnPlatform(){
  if(frameCount % 100 === 0){
    platform = createSprite(width/2-100,height/2-60);
    platform.addImage(platform1_Img);
    platform.scale = 0.3;

    invisiblePlatform = createSprite(width/2-100,height/2-70);
   // invisiblePlatform.x = platform.x;
    invisiblePlatform.scale =0.3;
    invisiblePlatform.width = platform.width;
    invisiblePlatform.height = 3;
    invisiblePlatform.visible = false;
   // invisiblePlatform.debug = true;

    platform.velocityX = -3;
    platform.lifetime = 350;

    
    invisiblePlatform.velocityX = -3;
    invisiblePlatform.lifetime = 350;

    platformGrp.add(platform);
    invisiblePlatformGrp.add(invisiblePlatform);
  }
}