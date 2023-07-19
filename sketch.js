var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var boy,boy_running,boy_collided;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  boy_running = loadAnimation("boy_1.png","boy_2.png","boy_3.png");
  boy_collided = loadAnimation("boy_collided.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("background.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(windowWidth-1250,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
 
  boy = createSprite(windowWidth-1000,160,20,30);
  boy.addAnimation("running",boy_running);
  boy.addAnimation("collided",boy_collided);

  trex.scale = 1.2;
  
  ground = createSprite(200,windowHeight-105,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=1.2
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 1.5;
  restart.scale = 1.5;
  
  invisibleGround = createSprite(200,windowHeight-95,windowWidth+1000,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle",0,0,350,trex.height);
  trex.debug = false;
  
  boy.setCollider("circle",0,0,50);
  boy.debug = false ;
  score = 0;
  
}

function draw() {
  
  background("lightblue");
  
  text("Score: "+ score,windowWidth-100,windowHeight-600);
 
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
   
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if( keyDown("space")&& boy.y >= windowHeight-250) {
        boy   .velocityY = -12;
        jumpSound.play();
    }
    
   
    trex.velocityY = trex.velocityY + 0.8
    boy.velocityY = boy.velocityY + 0.8
   
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(boy)){
        boy.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    if(obstaclesGroup.isTouching(trex)){
      trex.velocityY=-12;
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
    
      trex.collide(invisibleGround)
      trex.changeAnimation("collided",trex_collided)
      boy.changeAnimation("collided", boy_collided);
      trex.x=boy.x

      ground.velocityX = 0;
      trex.velocityY = 0;
      boy.velocityY = 0;
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
    if(mousePressedOver(restart)) {
      reset();
    }
   
   }
  

  trex.collide(invisibleGround);
  boy.collide(invisibleGround);
 

  drawSprites();
}

function reset(){
  gameState=PLAY;
  score=0;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  trex.x=windowWidth-1250
  boy.changeAnimation("running",boy_running);
}


function spawnObstacles(){
 if (frameCount % 120 === 0){
   var obstacle = createSprite(windowWidth-150,windowHeight-125,10,40);
   obstacle.velocityX = -(6 + score/100);
   
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
             
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              
              break;
      default: break;
    }
   
             
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
  
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
 
  if (frameCount % 150 === 0) {
    var cloud = createSprite(windowWidth-200,180,40,10);
    cloud.y = Math.round(random(windowHeight-500,windowHeight-620));
    cloud.addImage(cloudImage);
    cloud.scale = 0.8;
    cloud.velocityX = -3;
    
    
    cloud.lifetime = 400;
    
   
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    
    cloudsGroup.add(cloud);
  }
}

