// window.onload = function(){
	document.getElementById('help').addEventListener("click",showHelp);
	document.getElementById('scores').addEventListener("click",showScores);
	document.getElementById('about').addEventListener("click",showAbout);
	//document.getElementById('back').addEventListener("click",exitPage);

	exitButton = document.getElementsByClassName('back');
// }

function showScores(){
	document.getElementById('gameStart').className = "hide";
	document.getElementById('scorePage').className = "gameScreen";

	cookieStorage = [];
	// function keyCookies(){
		
		var totalCookies = document.cookie;
		table = document.getElementById('scoreBoard');
		table.innerHTML = "<p style='text-align:center'> No Hokages played yet</p>";
		if(totalCookies!=""){

			cookieArray = totalCookies.split(';');
					
			for(var i=0; i<cookieArray.length;i++){
				name = cookieArray[i].split('=')[0];
				score = cookieArray[i].split('=')[1];
				cookieStorage.push({
					key: name,
					value: score
				});
				console.log(cookieStorage[i].key);
			}

			 cookieStorage = cookieStorage.sort(function (a,b){
			 	return b.value - a.value;
			 });
			 
			row="";
			for(var i=9;i>=0;i--){
				if(!cookieStorage[i]){
				}
				else{
					row = "<tr><td>" +(i+1)+ "</td><td>"  + cookieStorage[i].key + "</td><td>" + cookieStorage[i].value + "</td></tr>" + row;
				}	
				console.log("I: " + i);
			}
			table.innerHTML = "<table class='hokageTable'><tbody><tr><th>Rank</th><th>Name</th><th>Score</th></tr>" + row + "</tbody></table>" ;		
		}		
	// }

	exitButton[0].addEventListener("click",function(){
		exitPage('scorePage');
	});

}

function showHelp(){
	document.getElementById('gameStart').className = "hide";
	document.getElementById('helpPage').className = "gameScreen";
	exitButton[1].addEventListener("click",function(){
		exitPage('helpPage');
	});
}

function showAbout(){
	document.getElementById('gameStart').className = "hide";
	document.getElementById('aboutPage').className = "gameScreen";
	exitButton[2].addEventListener("click",function(){
		exitPage('aboutPage');
	});
}

function exitPage(page){
	console.log(page);
	this.page = page;
	document.getElementById('gameStart').className = "gameScreen";
	document.getElementById(page).className = "hide";
	//document.getElementById('scores').innerHTML=document.cookie;
}
