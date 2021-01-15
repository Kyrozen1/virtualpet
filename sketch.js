//Create variables here
var dog;
var database, foodS, foodStock;
var dogImg, happydogImg;
var feed, addFood;
var fedTime, lastFed;
var foodObj;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png")
  happydogImg = loadImage("images/dogImg1.png")
}

function setup() {
	createCanvas(1000,500);
  
  database = firebase.database();

  dog = createSprite(850, 250, 10, 10);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock)

  feed = createButton("Feed the dog");
  feed.position(1000, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1100, 95);
  addFood.mousePressed(addFoods)

  foodObj = new Food()
  foodObj.getFoodStock()
  foodObj.updateFoodStock()
  foodObj.deductFood()
}


function draw() {  
  background(46,139,87)

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed:" + lastFed%12 + "PM", 350,60);
  }else if(lastFed==0){
    text("Last Feed: 12 AM",350,95);
  }else{
    text("Last Feed:" + lastFed + "AM", 350,60);
  }
  
  drawSprites();
}

function feedDog(){
  dog.addImage(happydogImg);
  dog.scale = 0.2;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
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

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<=0){
    x=0
  }
  else{
    x=x-1
  }
  database.ref('/').update({
    Food:x
  })
}