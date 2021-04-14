var dog,Dog,happyDog,milk , database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState = 0;
var bedroomimg,gardenimg,washroomimg,livingroomimg;

function preload(){
Dog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
milk=loadImage("images/MilkBottleImage.png");
bedroomimg =loadImage("images/Bed Room.png");
gardenimg =loadImage("images/Garden.png");
washroomimg =loadImage("images/Wash Room.png");
livingroomimg =loadImage("images/Living Room.png");
sadDog = loadImage("images/deadDog.png")
}

function setup() {
  database=firebase.database();
  createCanvas(500,500);

  foodObj = new Food();

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
});

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(Dog);
  dog.scale=0.3;
  
  
}

function draw() {
  background(46,139,87);
  foodObj.display();

  writeStock(foodS);

  if (foodS ==0){
    dog.addImage(happyDog);
    milkBotltle2.visible=false;
  }else{
    dog.addImage(sadDog);
    milkbotltle2.visible=true
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("LastFeed: "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("LastFeed: 12 AM",350,30);
   }else{
     text("LastFeed: "+ lastFed + " AM", 350,30);
   }

   

if (gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}
 currentTime = hour();
   if(currentTime==(lastFed+1)){
     update("Playing");
     garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
    foodObj.bedroom();
}else if (currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
  update("Bathing")
  washroom();
}else{
  update("Hungry");
  foodObj.display();
}

 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
database.ref('/').update({
  food:x
})
}


function feedDog(){
  
  imageMode(CENTER);
  image(milk,680,250,100,100);
  dog.addImage(happyDog);

  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}



function bedroom(){
  background(bedroomimg,550,500);
}

 function garden(){
  background(gardenimg,550,500);
}

function washroom(){
  background(washroomimg,550,500);
}

function livingroom(){
  background(livingroomimg,550,500);
}