	
document.getElementById('start').addEventListener("click",function(){
	document.getElementById("gameStart").className = "hide";
	document.getElementById("cover").className = "gameScreen";
	return garyGame();
});

function pause(){
	if(!gary.grinding){
		clearInterval(sample2);
		clearInterval(sample);
		clearInterval(gameTimer);
		if (confirm("Game Paused.\nDo you want to quit the game(Click OK) or continue playing(Click cancel)") == true){
        	// txt = "You pressed OK!";
        	
        	location.reload();
		} 
	    else{
			sample2 = setInterval(moveGuard, 300);
			sample = setInterval(characterMovement, 200);	
			window.gameTimer = setInterval(gameTime,1000);	
			window.addEventListener('keydown', pressed);
			window.addEventListener('keyup', unpressed);
	    }
	}	
}


function garyGame(){

	window.addEventListener("contextmenu", pause);
	window.keys = [];	
	window.gary = garyMaker();
	window.barrierListGlobal = []
	window.guardsListGlobal = [];
	barrierListGlobal = barrierMaker();
	guardsListGlobal = guardMaker();
	window.girlListGlobal = girlMaker();
	window.score = 0;
	window.time = 90;
	window.pressured = false;
	window.grindedArray=[];
	document.getElementById("score").innerHTML = score;
	sample2 = setInterval(moveGuard, 300);
	sample = setInterval(characterMovement, 200);	
	window.gameTimer = setInterval(gameTime,1000);	

}

function characterMovement(){

	moveGary();
	for(var i = 0; i < guardsListGlobal.length; i++){
		if(guardsListGlobal[i]){
			positionMap(guardsListGlobal[i]);
		}
	}
	positionMap(gary);
	printLife();	

}

function printLife(){

	var currentLife = document.getElementById("life");
	currentLife.innerHTML = "";
	for(var i = 0; i < gary.life; i++){
		currentLife.innerHTML += "<img src='resources/confidenceShots.gif' />";
	}

}

guardIndex = 3;
function gameTime(){
	if((score>=10000&&score<=20000)&&(guardIndex==3)||
		(score>20000&&score<=30000)&&(guardIndex==1)){
		if(guardIndex==3){
			guardIndex = 1;
		}
		else{
			guardIndex = 3;
		}
		if(guardIndex==1||guardIndex==3){
			setTimeout(function(){
				var guards = document.getElementsByClassName("guard");
				console.log("GUARDS GENERATE");
				guardsListGlobal[guardIndex] = new Guard(guards[guardIndex].id,guardIndex);
				document.getElementById(guardsListGlobal[guardIndex].id).style.display = "block";
				positionMap(guardsListGlobal[guardIndex]);
				console.log(guardsListGlobal);	
			}, 2000)
			
		}

	}
	var timer = document.getElementById("time");
	timer.innerHTML = time;
	if(time <= 10){
		timer.style.color = "red";
	}
	else{
		timer.style.color = "green";
	}
	if(time<0){
		gameLose();

	}
	time--;
}

//=================================================================================================
//GARY=============================================================================================

//Object constructor for Gary
function Gary(id, x, y, grinding){
	this.x =x;
	this.y =y;
	this.id = id;
	this.grinding = grinding;
	this.life = 3;
	// console.log(this.id + " " + this.x + " " + this.y + " ");
}

function garyMaker(){
	var gary = new Gary('gary', 0, 0,false)	
	// positionMap(gary);
	window.addEventListener('keydown', pressed);
	window.addEventListener('keyup', unpressed);
	return gary;
}

function garyCollision(objects, left){
	garyLeft = left;
	garyRight = left + 40;
	garyTop = gary.y;
	garyBottom = gary.y + 60;

	for(var i = 0; i < objects.length; i++){

		objectLeft = objects[i].x;
		objectTop = objects[i].y;
		if((!objects[i].x)&&(!objects[i].y)){
			objectRight = undefined;					
			objectBottom = undefined;
		}

		if(objects[i].id.includes("girl")){
			objectRight = objects[i].x + 40;
			objectBottom = objects[i].y + 60;
		}
		else if(objects[i].id.includes("barrier")){
			objectRight = objects[i].x + 40;
			objectBottom = objects[i].y + 300;
		}

		if((garyTop==objectBottom&&garyTop>objectTop)&&((garyRight>=objectLeft&&garyRight<=objectRight)||
			(garyLeft<=objectRight&&garyLeft>=objectLeft))){
			return 1;
		}
		if((garyBottom==objectTop&&garyBottom<=objectBottom)&&((garyRight>objectLeft&&garyRight<=objectRight)||
			(garyLeft<objectRight&&garyLeft>=objectLeft))){
			return 2;
		}
		if((garyLeft>objectLeft && garyLeft<=objectRight)&&((garyBottom>objectTop&&garyBottom<=objectBottom)||
			(garyTop<objectBottom&&garyTop>=objectTop))){ 
			//Left
			objects[i].collide = true;
			return 3;
		}   
		if((garyRight<objectRight && garyRight>=objectLeft)&&((garyBottom>objectTop&&garyBottom<=objectBottom)||
			(garyTop<objectBottom&&garyTop>=objectTop))){ 
			//Right
			objects[i].collide = true;
			return 4;
		}
		objects[i].collide = false;
	}

}

function moveGary(event){
	var collide = false;
	var column;
	var collisionArray = [[girlListGlobal[0], barrierListGlobal[0]],
						[girlListGlobal[1], barrierListGlobal[1]],
						[girlListGlobal[2], barrierListGlobal[2]],
						[girlListGlobal[3], barrierListGlobal[3]],
						[girlListGlobal[4]]];

	for(var x = 0; x <= 900; x+=180){
		if(x <= gary.x){
			column = x/180;
		}
	}
	var collide1 = garyCollision(collisionArray[column], (gary.x - (180 * column)));
	var collide2;
	if(column < 4){
		collide2 = garyCollision(collisionArray[column + 1], (gary.x - (180 * (column + 1))));
	}
	else{
		collide2 = garyCollision(collisionArray[column], (gary.x - (180 * column)));
	}

	if(keys[0]){
		if(collide1 != 1 && collide2 != 1){
			gary.y += -10;
			document.getElementById(gary.id).firstChild.src="resources/GaryMovesRight.gif";
			positionMap(gary);
		}
	}
	else if(keys[1]){
		if(collide1 != 2 && collide2 != 2){
			gary.y += 10;
			document.getElementById(gary.id).firstChild.src="resources/GaryMovesLeft.gif";
			positionMap(gary);
		}
	}
	else if(keys[2]){
		if(collide1 != 3 && collide2 != 3){
			document.getElementById(gary.id).firstChild.src="resources/GaryMovesLeft.gif";
			gary.x += -10;
			positionMap(gary);
		}
	}
	else if(keys[3]){
		if(collide1 != 4 && collide2 != 4){
			gary.x += 10;
			document.getElementById(gary.id).firstChild.src="resources/GaryMovesRight.gif";
			positionMap(gary);
		}
	}
}

function pressed(event){	
	var arrow;
	if(event.keyCode=="38"){
		arrow = document.getElementById("AUp");
		arrow.style.backgroundColor = "#ff9f2b";
		keys[0] = true;

	}
	//DOWN ARROW PRESSED
	else if(event.keyCode=="40"){
		arrow = document.getElementById("ADown");
		arrow.style.backgroundColor = "#ff9f2b";
		keys[1] = true;
	}
	//LEFT ARROW PRESSED
	else if(event.keyCode=="37"){
		arrow = document.getElementById("ALeft");
		arrow.style.backgroundColor = "#ff9f2b";
		keys[2] = true;
	}
	//RIGHT ARROW PRESSED
	else if(event.keyCode=="39"){
		arrow = document.getElementById("ARight");
		arrow.style.backgroundColor = "#ff9f2b";
		keys[3] = true;
	}

	if(event.keyCode == "32"){
		// keys[4] = true;
		arrow = document.getElementById("ASpace");
		arrow.style.backgroundColor = "#ff9f2b";
		window.removeEventListener("keydown", pressed);
		grind();
	}

	if(event.keyCode == "27"){
		window.removeEventListener("keydown", pressed);
		pause();
	}
}

function unpressed(event){

	if(event.keyCode=="38"){
		arrow = document.getElementById("AUp");
		arrow.style.backgroundColor = "";
		document.getElementById(gary.id).firstChild.src="resources/GaryStandRight.png";
		keys[0] = false;
	}
	//DOWN ARROW PRESSED
	else if(event.keyCode=="40"){
		arrow = document.getElementById("ADown");
		arrow.style.backgroundColor = "";
		document.getElementById(gary.id).firstChild.src="resources/GaryStandLeft.png";
		keys[1] = false;
	}
	//LEFT ARROW PRESSED
	else if(event.keyCode=="37"){
		arrow = document.getElementById("ALeft");
		arrow.style.backgroundColor = "";
		document.getElementById(gary.id).firstChild.src="resources/GaryStandLeft.png";
		keys[2] = false;
	}
	//RIGHT ARROW PRESSED
	else if(event.keyCode=="39"){
		arrow = document.getElementById("ARight");
		arrow.style.backgroundColor = "";
		document.getElementById(gary.id).firstChild.src="resources/GaryStandRight.png";
		keys[3] = false;
	}

	if(event.keyCode == "32"){
		window.addEventListener("keydown", pressed);
		arrow = document.getElementById("ASpace");
		arrow.style.backgroundColor = "";
		document.getElementById("meterPanel").className = "hide";
		if(gary.grinding){
			gary.grinding=false;
			document.getElementById(gary.id).firstChild.src="resources/GaryStandRight.png";
			clearInterval(grinding);
			if(pressured){
				girlRestart();
			}
		}
	}

	if(event.keyCode == "27"){
		window.addEventListener("keydown", pressed);
	}

}

function grind(){
	for(var x=0; x < girlListGlobal.length; x++){
		if(girlListGlobal[x].collide){
			document.getElementById("scoreAdded").innerHTML = " ";
			gary.grinding = true;
			console.log("Grinding with girl " + girlListGlobal[x].id);
			//console.log("Stamina " + girlListGlobal[x].stamina + "Score " + girlListGlobal[x].scoreEarn);
			window.grinding = setInterval(garyScores, 1000, x);
			
		}
	}
	document.getElementById(gary.id).firstChild.src="resources/GaryDance.gif";
}

//gary scoresssss!!!!!! if girl is done, push index of girl to last element of grinded array, hide girl, change x and y to null para
//--indi mabunggo si gary sa x and y sang girl even though hidden ang girl. Stop grinding interval. Regenerate girl in 10 seconds  
function garyScores(girlIndex){

	var currentGirl = girlListGlobal[girlIndex];
	var defaultStamina;
	
	if(currentGirl.type == 1){
		defaultStamina = 10;
	}
	else if(currentGirl.type == 2){
		defaultStamina = 7;
	}
	else if(currentGirl.type == 3){
		defaultStamina = 5;
	}

	document.getElementById("meterPanel").className = "";
	var meterBig = document.getElementById("meterBig");
	var percentage = (currentGirl.stamina/defaultStamina) * 100;
	var staminaBig = document.getElementById("staminaValue");
	var expression = document.getElementById("exp" + (girlIndex + 1));
	// console.log("exp" + girlIndex);



	var sumScore = girlListGlobal[girlIndex].scoreEarn;
	window.resetIndex = girlIndex;
	meterBig.style.width = percentage + "%";
	staminaBig.innerHTML = Math.floor(percentage);
	currentGirl.stamina--;

	if(currentGirl.stamina <= currentGirl.pressure){
		sumScore = currentGirl.scoreEarn * 2;
		pressured = true;
		console.log("YAKK GARY DIS YOU?!!");
		meterBig.style.backgroundColor = "red";
	}
	else{
		meterBig.style.backgroundColor = "green";
	}

	if(girlListGlobal[girlIndex].stamina <= 0){
		window.pressured = true;
		document.getElementById("meterPanel").className = "hide";
		expression.className = "girlExpression";
		gary.life--;
		clearInterval(grinding);
		setTimeout(function(){
			girlRestart();	
			expression.className = "hide";
		}, 2000);
		
		if(gary.life<=0){
			gameLose();
		}
		return 0;
	}

	var addedScore = document.getElementById("scoreAdded");
	addedScore.style.display = 'block';
	window.setTimeout(function(){
		addedScore.style.display = "none";
	}, 500);

	score += sumScore;

	document.getElementById("scoreAdded").innerHTML = "+ " + sumScore;
	document.getElementById('score').innerHTML = score;
}

function gainConfidence(){

	if(gary.life<5){
		gary.life = gary.life+1;
		console.log("Life: " + gary.life);
	}
	else if(gary.life>5){
		console.log("Life: " + gary.life);
		gary.life = 5;
	}
	document.getElementById('scoreAdded').innerHTML = "+1 Confidence";
	
}

//=================================================================================================
//GIRLS============================================================================================
// Object Constructor for creating girls
function Girl(id, x, y, collide, type){
	this.x = x;
	this.y = y;
	this.id = id;
	this.collide = collide;
	this.type =type;
	if(type==1){
		document.getElementById(id).firstChild.src="resources/KokakDance.gif";
		this.scoreEarn = 100;
		this.stamina = 10;
		this.pressure = 3;
		this.timeAdd=10;
	}
	else if(type==2){
		document.getElementById(id).firstChild.src="resources/MeowDance.gif";
		this.scoreEarn = 200;
		this.stamina = 7;
		this.pressure = 2;
		this.timeAdd=10;
	}
	else{
		document.getElementById(id).firstChild.src="resources/WoofDance.gif";
		this.scoreEarn = 300;
		this.stamina = 5;
		this.pressure = 2;
		this.timeAdd=10;
	}
}

//creates array of girls and generates position
function girlMaker(){
	var girlList = ['girl1','girl2','girl3','girl4','girl5'];
	for(var x = 0; x < girlList.length; x++){
		var randomizeType = Math.random();
		var type = Math.floor(((randomizeType*(4-1)) + 1));
		girlList[x] = new Girl(girlList[x], 0, 0, false, type);
	}

	for (var x=0; x<girlList.length; x++){
		girlPositionGenerator(girlList[x], x);
	}
	return girlList;
}

function girlPositionGenerator(girlObject, column){
	var x,y;
	do{
		girlObject.x=randX(0, 140)
		girlObject.y=randY();
		console.log("Generating " + girlObject.id);
	}while(avoidGary(girlObject, column));
	avoidBarrier(girlObject);

	positionMap(girlObject);
	return girlObject;
}

function randX(min,max){	
	var randX;
	var randGen = Math.random();
	randX = Math.floor(((randGen*(max-min)) + min)/10);
	randX *= 10;
	if(randX == 0){
		randX += 10;
	}
	return parseInt(randX);
}

function randY(){	
	var randY;
	while(randY==null||randY>540){
		randY = Math.floor((Math.random()*1000)/10);
		randY *= 10;
	}
	return parseInt(randY);
}

//to avoid overlap generation of girls over gary
function avoidGary(girlObject, column){
	var xPosition = girlObject.x + (180 * column);
	console.log(xPosition + " " + gary.x);
	if(((xPosition < (gary.x))||(xPosition > (gary.x + 40) )) && 
		((girlObject.y < (gary.y - 60))||(girlObject.y > (gary.y + 120)))){
		console.log(girlObject.id + " not clashed with gary");
		return false;
	}
	else{
		console.log(girlObject.id + " clashed with gary");
		return true;
	}
}

function avoidBarrier(girlObject){
	var counter = 0;
	if(girlObject.x + 40 >= barrierListGlobal[0].x){
		girlObject.x -= 50;
	}
}

function girlRegenerator(grindedArray){
		if(grindedArray.length%2==0 && grindedArray.length>0){
		 	gainConfidence();
		}
 		girlIndex = grindedArray.shift();
 		var randomizeType = Math.random();
 		var type = Math.floor(((randomizeType*(4-1)) + 1));
		girlListGlobal[girlIndex] = new Girl(girlListGlobal[girlIndex].id, 0, 0, false, type);
 		girlListGlobal[girlIndex] = girlPositionGenerator(girlListGlobal[girlIndex], girlIndex);
 		document.getElementById(girlListGlobal[girlIndex].id).style.display = "block";
}

function girlRestart(){
	// clearInterval(grinding);
	document.getElementById("scoreAdded").style.display = "none";
	if(pressured){
		pressured = false;
		time+=girlListGlobal[resetIndex].timeAdd;
		document.getElementById(girlListGlobal[resetIndex].id).style.display = "none";
		girlListGlobal[resetIndex].x = undefined;
		girlListGlobal[resetIndex].y = undefined;
		grindedArray.push(resetIndex);
		setTimeout(function(){
			girlRegenerator(grindedArray);
		},10000);
	}
	else{
		console.log("Stil ok");
	}
}
//=================================================================================================
//GUARD============================================================================================

//Object Constructor for Guard
function Guard(id, column){

	this.id = id;
	var number = Math.floor(Math.random() * 10);
	if(number % 2 == 0){
		this.movement = "up";
		this.x = 0;
		this.y = 500;
	}
	else{
		this.movement = "down";
		this.x = 0;
		this.y = 0;
	}
	this.column = column;
}

function guardMaker(){
	var guards = document.getElementsByClassName("guard");
	for(var i = 0; i < guards.length; i++){
		if(i % 2 == 0){
			guardsListGlobal[i] = new Guard(guards[i].id, i);
			positionMap(guardsListGlobal[i]);
		}
		else{
			guardsListGlobal[i] = null;
		}
	}
	return guardsListGlobal;
}

function moveGuard(){
	for(var i = 0; i < guardsListGlobal.length; i++){
		if(guardsListGlobal[i]){
			var guard = guardsListGlobal[i];
			if(guard.movement == "down"){
				guard.y += 10;
				catchGary(guard,i);
				if(guard.y == 500){
					guard.movement = "up";
				}
			}
			else if(guard.movement == "up"){
				guard.y -= 10;
				catchGary(guard,i);
				if(guard.y == 40){
					guard.movement = "down";
				}
			}
		}
	}
}

function catchGary(guard){
	this.guard = guard;

	guardLeft = guard.x + (179 * guard.column);  
	guardRight = guardLeft + 149;
	guardTop = guard.y;
	guardBottom = guard.y + 210;
	garyLeft = gary.x;
	garyRight = gary.x+40;
	garyTop=gary.y;
	garyBottom=gary.y+60;

	if((garyTop<guardBottom&&garyTop>=guardTop)&&
		((garyRight>=guardLeft&&garyRight<=guardRight)||
		(garyLeft<=guardRight&&garyLeft>=guardLeft))){
		console.log("collide");
		if(gary.grinding){
			console.log("UP Vision");
			console.log("Gary Left Top Bottom Right: " + garyLeft + " " + garyTop + " " + garyBottom + " " + garyRight);
			console.log("Guard Left Top Bottom Right: " + guardLeft + " " + guardTop + " " + guardBottom + " " + guardRight);
			console.log("Guard id: " + guard.column);
			return gameLose();
		}

	}
	else if((garyBottom>guardTop&&garyBottom<=guardBottom)&&
		((garyRight>guardLeft&&garyRight<=guardRight)||
			(garyLeft<guardRight&&garyLeft>=guardLeft))){
		// console.log("collide");	
		if(gary.grinding){
			console.log("Down Vision");
			console.log("Gary Left Top Bottom Right: " + garyLeft + " " + garyTop + " " + garyBottom + " " + garyRight);
			console.log("Guard Left Top Bottom Right: " + guardLeft + " " + guardTop + " " + guardBottom + " " + guardRight);
			console.log("Guard id: " + guard.column);
			return gameLose();
		}
	}
}

//=================================================================================================
//BARRIER==========================================================================================
function Barrier(id, x, y, collide){
	this.id = id;
	this.x = x;
	this.y = y;
	this.collide = collide;
}

function barrierMaker(){

	var barriers = document.getElementsByClassName("barrier");
	for(var i = 0; i < barriers.length; i++){
		if(i%2 == 0){
			barrierListGlobal[i] = new Barrier(barriers[i].id, 150, 300, false);
		}
		else{
			barrierListGlobal[i] = new Barrier(barriers[i].id, 150, 0, false);
		}
		positionMap(barrierListGlobal[i]);
	}
	return barrierListGlobal;

}

//=================================================================================================

function positionMap(object){

	if(object.x < 0){
		object.x=0;
		document.getElementById(object.id).style.left = 0 + "px";
	}
	else if(object.x > 860){
		object.x=860;
		document.getElementById(object.id).style.left = 860 + "px";
	}
	else{
		document.getElementById(object.id).style.left = object.x + "px";
	}

	
	if(object.y < 0){
		document.getElementById(object.id).style.top = 0 + "px";
		object.y=0;
	}
	else if(object.y > 540){
		document.getElementById(object.id).style.top = 540 + "px";
		object.y=540;
	}
	else{
		document.getElementById(object.id).style.top = object.y + "px";
	}

}

function gameLose(){
	clearInterval(gameTimer);
	var totalPlayers = document.cookie;
	var name = prompt("Wassup Hokage enter your name: ");
	if(!name){
		name="Unkown Hokage";
	}
	nextMonth = new Date();
    nextMonth.setTime(nextMonth.getTime()+(30*24*60*60*1000));
	document.cookie = name+ "=" + score + "; expires=" + nextMonth.toGMTString();	
	location.reload();
}
