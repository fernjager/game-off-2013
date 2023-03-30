/* Screens, inheritance would be nice */
function LoadingScreen( stage, gameState ){
	var that = this;
	this.lastPercent = -1;
    this.picture = new createjs.Bitmap( "res/screens/LoadingScreen/Loading-Title.png" );
    this.pictureFront = new createjs.Bitmap( "res/screens/LoadingScreen/PanFront.png" );
    this.cooking = new createjs.Bitmap( "res/screens/LoadingScreen/TextCooking.png" );
    this.done = new createjs.Bitmap( "res/screens/LoadingScreen/TextDone.png" );
	this.start = new createjs.Bitmap( "res/screens/LoadingScreen/TextStart.png" );
    this.turkeyState = [ new createjs.Bitmap( "res/screens/LoadingScreen/Turkey0.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey25.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey50.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey75.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/TurkeyDone.png" ) ];

	this.done.alpha= 0;
	this.start.alpha = 0;
	stage.addChild( this.picture );
	stage.addChild( this.cooking );
	stage.addChild( this.turkeyState[0] );

	var textContent = new createjs.Text( "0 %", "25px Arial", "black" );
	textContent.x = 500;
	textContent.y = 20;
	stage.addChild( textContent);

	gameState.pubsub.subscribe( "Load", function(percent){
		textContent.text = (percent * 25).toFixed(2) + " %";
		var wholeNum = Math.floor(percent);
		if( that.lastPercent != percent){
			that.lastPercent = percent;
			stage.addChild( that.turkeyState[wholeNum] );
			stage.addChild( that.pictureFront );
			stage.addChild( that.start );
		}

		//If we're still on image one, don't fade it out, it's the base image!
		if(  wholeNum != 0 )
			that.turkeyState[wholeNum].alpha = percent.toFixed(2) - wholeNum;

		// Done!
		if(  wholeNum == 4 ){
			that.turkeyState[4].alpha = 1;
			that.cooking.alpha=0;
			that.done.alpha = 1;
			that.start.alpha = 2;

			that.start.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
		 	that.start.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 			that.start.addEventListener( "click",  function(){ gameState.pubsub.publish("SwitchScreen", "MainScreen"); });

			that.turkeyState[4].addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
		 	that.turkeyState[4].addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 			that.turkeyState[4].addEventListener( "click",  function(){ gameState.pubsub.publish("SwitchScreen", "MainScreen"); });
		}
	});

	stage.addChild( this.done );
	stage.addChild( this.pictureFront );


	return {
		blit : function(){
		}
	}
}


function MainScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/screens/MainScreen/Main-Screen.png" );
    stage.addChild( this.background );

    var turkeyAnimations = { peck:[14,24,"peck"], ruffle:[0,13,"ruffle"], stare:[25,35,"stare"] };
	var data = {
    	images: ["res/screens/MainScreen/TurkeySprite.png"],
     	frames: { width:400, height:350 },
     	animations: turkeyAnimations
 	};

	var spriteSheet = new createjs.SpriteSheet(data);
 	var animation = new createjs.Sprite(spriteSheet, "stare");
 	animation.x = 140;
 	animation.y = 210;

 	animation.addEventListener("tick", handleTick);
 	function handleTick(event){
 		if ( turkeyAnimations[event.currentTarget.currentAnimation][1] == event.currentTarget.currentFrame ){
 			event.currentTarget.paused = true;
 		}
	    // Click happened.
 	}
 	stage.addChild(animation);

 	this.grassLayer = new createjs.Bitmap( "res/screens/MainScreen/Grass.png" );
 	this.grassLayer.x = -60;
 	stage.addChild( this.grassLayer );

	// buttons info/credits/start
 	new ImgButton( stage, gameState, 571,527, "res/screens/MainScreen/ButtonStart.png", "res/screens/MainScreen/ButtonStart.png","SwitchScreen", "DifficultyScreen", "Click"  );
 	new ImgButton( stage, gameState, 17,470, "res/screens/MainScreen/ButtonHelp.png", "res/screens/MainScreen/ButtonHelp.png",null, null, "Click", function(){ gameState.pubsub.publish("ShowHelp",""); } );
 	
	new ImgButton( stage, gameState, 17,527, "res/screens/MainScreen/ButtonCredits.png", "res/screens/MainScreen/ButtonCredits.png","SwitchScreen", "CreditsScreen", "Click"  );

	//Mute button
	new VolumeButton(stage, gameState, 730, 20, "ToggleMute", null, "Click", null)

 	gameState.pubsub.publish( "BackgroundLoop", {name:"TitleMusic", pos:5650, volume:0.7} );
    this.uiElems = [];

    return {
		blit : function(){
			if( createjs.Ticker.getTicks() %50 == 0 ){

				animation.gotoAndPlay(["peck", "ruffle", "stare"][UtilityFunctions.randRange(0,2)]);
			}
			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}

//start button
}

function DifficultyScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/screens/DifficultyScreen/Difficulty-SelectionRevised.png" );
    stage.addChild( this.background );

    var turkeyAnimations = { peck:[14,24,"peck"], ruffle:[0,13,"ruffle"], stare:[25,35,"stare"] };
	var data = {
    	images: ["res/screens/MainScreen/TurkeySprite.png"],
     	frames: { width:400, height:350 },
     	animations: turkeyAnimations
 	};

	var spriteSheet = new createjs.SpriteSheet(data);
 	var animation = new createjs.Sprite(spriteSheet, "stare");
 	animation.x = 140;
 	animation.y = 210;

 	animation.addEventListener("tick", handleTick);
 	function handleTick(event) {
 		if ( turkeyAnimations[event.currentTarget.currentAnimation][1] == event.currentTarget.currentFrame ){
 			event.currentTarget.paused = true;
 		}
	    // Click happened.
 	}
 	stage.addChild(animation);

 	this.grassLayer = new createjs.Bitmap( "res/screens/MainScreen/Grass.png" );
 	this.grassLayer.x = -60;
 	stage.addChild( this.grassLayer );

 	// Difficulty selection UI
 	this.buttonsAndText = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonsandTextRevised.png" );
 	stage.addChild( this.buttonsAndText );

 	this.malePlayerSelection = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonPlayerMale.png" );
 	stage.addChild( this.malePlayerSelection );

 	this.femalePlayerSelection = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonPlayerFemale.png" );
 	this.femalePlayerSelection.alpha = 0;
 	stage.addChild( this.femalePlayerSelection );

	this.malePartnerSelection = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonPartnerMale.png" );
 	stage.addChild( this.malePartnerSelection );

 	this.femalePartnerSelection = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonPartnerFemale.png" );
 	this.femalePartnerSelection.alpha = 0;
 	stage.addChild( this.femalePartnerSelection );

	// Difficulty
	this.casualMode = new createjs.Bitmap( "res/screens/DifficultyScreen/DifficultyCasual.png" );
 	stage.addChild( this.casualMode );

 	this.hardcoreMode = new createjs.Bitmap( "res/screens/DifficultyScreen/DifficultyHardcore.png" );
 	this.hardcoreMode.alpha = 0;
 	stage.addChild( this.hardcoreMode );

 	var nameInput = new createjs.Text( "", "48px Arial", "black" );

	//Create cursor text object
	var cursor = new createjs.Text( "|", "48px Arial", "black" );

	//Append to nameInput text
	nameInput.text += cursor.text;
	
   	
	nameInput.x = 47;
	nameInput.y = 85;
	nameInput.lineWidth = 175;

	stage.addChild( nameInput );
	
	// handle keyboard typing
    document.onkeyup = function(event){
    	// keycode
    	var keynum = 48;
    	  if(window.event){ // IE
            	keynum = event.keyCode;
            }
           else{
              	if(event.which){ // Netscape/Firefox/Opera
            		keynum = event.which;
                }
            }

            if( keynum != 8 && keynum < 91 && keynum > 47 && nameInput.text.length < 22 ){

				let len = nameInput.text.length
            	nameInput.text = nameInput.text.substring(0,len-1) + String.fromCharCode(keynum) + cursor.text;
            	gameState.name = nameInput.text.substring(0,len);
				
            }
    };


    // Backspace gets special treatment
    document.onkeydown = function(event){
    	    	var keynum = 0;
    	  if(window.event){ // IE
            	keynum = event.keyCode;
            }
           else{
              	if(event.which){ // Netscape/Firefox/Opera
            		keynum = event.which;
                }
            }

            if(keynum == 8 && nameInput.text.length > 0 ){
				len = nameInput.text.length
            	nameInput.text = nameInput.text.substring(0, len-2);
				nameInput.text += cursor.text
            	gameState.name = nameInput.text.substring(0,len-2)

            }
        event.preventDefault();
    }

 	// Player and partner gender
 	stage.addChild( new Button( stage, gameState, 530, 205, 50, 25, "ChangePlayerGender", "Male" ) );
 	stage.addChild( new Button( stage, gameState, 625, 205, 50, 25, "ChangePlayerGender", "Female" ) );

	stage.addChild( new Button( stage, gameState, 530, 290, 50, 25, "ChangePartnerGender", "Male" ) );
 	stage.addChild( new Button( stage, gameState, 625, 290, 50, 25, "ChangePartnerGender", "Female" ) );

	// Easy/Hard Button
 	// stage.addChild( new Button( stage, gameState, 535, 335, 160, 40, null, null, function(){ document.onkeyup = function(){}; gameState.hard = false; gameState.gameStarted = true; gameState.hardcoreModifier=1; gameState.pubsub.publish("SwitchScreen", "KitchenScreen"); } ) );
 	// stage.addChild( new Button( stage, gameState, 535, 435, 160, 40, null, null, function(){ document.onkeydown = function(){};  gameState.hard = true;  gameState.gameStarted = true; gameState.hardcoreModifier=20; gameState.pubsub.publish("SwitchScreen", "KitchenScreen"); } ) );

	stage.addChild( new Button( stage, gameState, 535, 335, 160, 40, "SetDifficulty", "Casual" ) );
 	stage.addChild( new Button( stage, gameState, 535, 435, 160, 40, "SetDifficulty", "Hardcore" ) );

	// back button
 	stage.addChild( new Button( stage, gameState, 35, 495, 85, 55, "SwitchScreen", "MainScreen" ) );

	// start button
	stage.addChild( new Button( stage, gameState, 535, 530, 200, 50, "StartGame", null ) );

	//Mute button
	new VolumeButton(stage, gameState, 730, 20, "ToggleMute", null, "Click", null)

 	gameState.pubsub.subscribe( "ChangePlayerGender", function(gender){
 		gameState.playerGender=gender;
 		if( gender == "Male" ){
 			that.malePlayerSelection.alpha = 1;
 			that.femalePlayerSelection.alpha = 0;
 			gameState.playerPronoun = "he";
 		}else{
 			that.malePlayerSelection.alpha = 0;
 			that.femalePlayerSelection.alpha = 1;
 			gameState.playerPronoun = "she";
 		}
 	})
	 gameState.pubsub.subscribe( "ChangePartnerGender", function(gender){
		gameState.partnerGender=gender;
		if( gender == "Male" ){
			that.malePartnerSelection.alpha = 1;
			that.femalePartnerSelection.alpha = 0;
			gameState.partnerPronoun = "he";
		}else{
			that.malePartnerSelection.alpha = 0;
			that.femalePartnerSelection.alpha = 1;
			gameState.partnerPronoun = "she";
		}
	})

	gameState.pubsub.subscribe( "SetDifficulty", function(difficulty){
		if ( difficulty == "Casual") {
			gameState.hard = false;
			gameState.hardcoreModifier = 1;
			that.casualMode.alpha = 1;
			that.hardcoreMode.alpha = 0;
		} else {
			gameState.hard = true;
			gameState.hardcoreModifier = 20;
			that.casualMode.alpha = 0;
			that.hardcoreMode.alpha = 1;
		}
	})

	gameState.pubsub.subscribe( "StartGame", function(){
		gameState.gameStarted = true; 
		gameState.pubsub.publish("SwitchScreen", "KitchenScreen");
	})

	return {
		blit : function(){
			if( createjs.Ticker.getTicks() %50 == 0 ){
				animation.gotoAndPlay(["peck", "ruffle", "stare"][UtilityFunctions.randRange(0,2)]);
			}

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
}

function KitchenScreen( stage, gameState ){
	var that = this;

	// Fade out any other sounds
	gameState.pubsub.publish( "FadeOut", "" );

	//gameState.pubsub.publish( "BackgroundLoop", {name:"Sizzle", pos:0, volume:0.5} );
	this.uiElems = [];

	this.uiElems.push( new WindowUI( stage, gameState ) );
	this.background = new createjs.Bitmap( "res/screens/KitchenScreen/KitchenScreen.png" );
    stage.addChild( this.background );
    if(DEBUG) console.log(gameState.purchasedItems);
    if(DEBUG) console.log("KitchenScreen");
	for(var i in gameState.purchasedItems ){
		if(DEBUG) console.log(gameState.purchasedItems);
		gameState.purchasedItems[i].draw( stage );
	}

	this.uiElems.push( gameState.ovenUI ? gameState.ovenUI.render() : ( gameState.ovenUI = new OvenUI( stage, gameState ) ).render() );
	this.uiElems.push( new ClockUI( stage, gameState ) );

	if( gameState.alarmBought )
		this.uiElems.push( new AlarmUI(stage, gameState) );


	stage.addChild( new Button( stage, gameState, 14, 17, 73, 45, null,null, function(){ gameState.pubsub.publish("ShowHelp","");} ) );

	new ImgButton( stage, gameState, 0,0, "res/screens/KitchenScreen/StoreBrochure.png", "res/screens/KitchenScreen/StoreBrochureGlow.png", null,null, "Click", function(){
		gameState.pubsub.publish("SwitchScreen", "MarketScreen");
 		gameState.storeVisits++;
	} );

	new VolumeButton(stage, gameState, 730, 50, "ToggleMute", null, "Click", null)

	// If player did not buy a turkey
	if( !gameState.turkeyBought ){
		// Display the tutorial
		DisplayTutorial(stage, gameState, 1);
	}
	else {
		// If they have bought a turkey, let them know that it's already in the oven
		gameState.pubsub.publish( "ShowDialog", {seq:"BoughtTurkey", autoAdvance:false} );
	}


	return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
}

function DisplayTutorial( stage, gameState, tutorialNum ){
	var tutToDisplay;
	var tutorialText;
	var nextText;
	var tutorialDone = false;
	if (tutorialNum == 1) {
		tutToDisplay = "res/screens/KitchenScreen/Tutorial1.png";
		
		tutorialText = new createjs.Text( "Click the help button anytime to see all available controls and options", "22px Arial", "black" );
		tutorialText.x = 155;
		tutorialText.y = 105;
		tutorialText.lineWidth = 325;
		tutorialText.lineHeight = 30;

		nextText = new createjs.Text("Next >", "20px Arial", "black");
		nextText.x = 455;
		nextText.y = 220;

	} else if (tutorialNum == 2) {
		tutToDisplay = "res/screens/KitchenScreen/Tutorial2.png"

		tutorialText = new createjs.Text( "Click the oven door to open it a crack, and click and drag the door to open it fully", "22px Arial", "black" );
		tutorialText.x = 265;
		tutorialText.y = 275;
		tutorialText.lineWidth = 325;
		tutorialText.lineHeight = 30;

		nextText = new createjs.Text("Next >", "20px Arial", "black");
		nextText.x = 575;
		nextText.y = 390;

	} else if (tutorialNum == 3) {
		if (gameState.hard == true) {
			tutToDisplay = "res/screens/KitchenScreen/TutorialFinal.png"
			tutorialDone = true;

			tutorialText = new createjs.Text( "Click on the brochure to go to the store. Your turkey awaits!", "22px Arial", "black" );
			tutorialText.x = 275;
			tutorialText.y = 275;
			tutorialText.lineWidth = 325;
			tutorialText.lineHeight = 30;

			nextText = new createjs.Text("Finish", "20px Arial", "black");
			nextText.x = 590;
			nextText.y = 375;
		} else {
			tutToDisplay = "res/screens/KitchenScreen/Tutorial3Casual.png"

			tutorialText = new createjs.Text( "Click the clock to skip ahead by 20 minutes", "22px Arial", "black" );
			tutorialText.x = 345;
			tutorialText.y = 90;
			tutorialText.lineWidth = 325;
			tutorialText.lineHeight = 30;

			nextText = new createjs.Text("Next >", "20px Arial", "black");
			nextText.x = 660;
			nextText.y = 195;

		}
	} else if (tutorialNum == 4) {
		tutToDisplay = "res/screens/KitchenScreen/TutorialFinal.png"
		tutorialDone = true;

		tutorialText = new createjs.Text( "Click on the brochure to go to the store. Your turkey awaits!", "22px Arial", "black" );
		tutorialText.x = 275;
		tutorialText.y = 275;
		tutorialText.lineWidth = 325;
		tutorialText.lineHeight = 30;

		nextText = new createjs.Text("Finish", "20px Arial", "black");
		nextText.x = 590;
		nextText.y = 375;
	}
	
	var tutorial = new createjs.Bitmap( tutToDisplay );

	tutorial.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
	tutorial.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
	tutorial.addEventListener( "click", NextTutorial);


    stage.addChild( tutorial );
	stage.addChild( tutorialText );
	stage.addChild( nextText );


	function NextTutorial(){ 
		stage.removeChild(tutorial);
		stage.removeChild(tutorialText);
		stage.removeChild(nextText);
		if (tutorialDone) {
			// Once the tutorial is done, bring up dialogue that tells the user to go buy a turkey
			gameState.pubsub.publish( "ShowDialog", {seq:"KitchenInitial", autoAdvance:false} ) 
		} else {
			DisplayTutorial(stage, gameState, tutorialNum+1) 
		}
	};
}

function MarketScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/screens/MarketScreen/MarketScreen.png" );
    var price = new createjs.Text( "", "16px Arial", "black" );
    	price.x = 120;
	 	price.y = 560;

	var wallet = new createjs.Text( "$" + parseFloat(gameState.wallet).toFixed(2), "20px Arial", "black" );
   		wallet.x = 725;
	 	wallet.y = 550;

 	var walletTag = new createjs.Bitmap("res/items/Wallet.png");
		walletTag.x = 670;
		walletTag.y = 535;

	var clipboardImg = new createjs.Bitmap("res/items/Clipboard.png");
		clipboardImg.x = 5;
		clipboardImg.y = 315;

	var clipboardTitle = new createjs.Text( "Shopping List", "18px Arial", "black" );
   		clipboardTitle.x = 25;
	 	clipboardTitle.y = 385;
	 	clipboardTitle.lineWidth = 175;

	var clipboardText = new createjs.Text( "Turkey", "16px Arial", "black" );
   		clipboardText.x = 23;
	 	clipboardText.y = 425;
	 	clipboardText.lineWidth = 173;

	var clipboardWeight = new createjs.Text( "", "16px Arial", "black" );
   		clipboardWeight.x = 120;
	 	clipboardWeight.y = 540;
	 	clipboardWeight.lineWidth = 175;

	if (window.muted){
		// Mute sounds
		gameState.pubsub.publish( "Play", {name:"Entrance", volume:0} );
		gameState.pubsub.publish( "BackgroundLoop", {name:"MarketMusic", volume:0} );
		gameState.pubsub.publish( "BackgroundLoop", {name:"MarketBackgroundSound", volume:0} );
	}
	else{
		// Play soundz
		gameState.pubsub.publish( "Play", {name:"Entrance", volume:0.3} );
		gameState.pubsub.publish( "BackgroundLoop", {name:"MarketMusic", volume:1} );
		gameState.pubsub.publish( "BackgroundLoop", {name:"MarketBackgroundSound", volume:0.4} );
	}


    stage.addChild(this.background);

    stage.addChild(wallet);
    stage.addChild(walletTag);
    stage.addChild(clipboardImg);

    stage.addChild(clipboardTitle);
    stage.addChild(clipboardText);
    stage.addChild(clipboardWeight);
    stage.addChild(price);

    this.uiElems = [];
    this.uiElems.push( new ImgButton( stage, gameState, 690,0, "res/items/ExitSign.png", "res/items/ExitGlow.png","SwitchScreen", "KitchenScreen", "Click"  ) );
	

    var marketItemKeys = Object.keys(gameState.marketItems);
    for (var index in marketItemKeys ) {
    	gameState.marketItems[marketItemKeys[index]].draw( stage );
    }

	this.topground = new createjs.Bitmap( "res/screens/MarketScreen/MarketTopShelf.png" );
	stage.addChild( this.topground );


	this.showPrice = function( cost ){
		price.text = "$ " + ( cost == NaN ? "" : parseFloat(cost).toFixed(2) );
	}

	this.clearClipboard = function(){
		price.text = "";
		clipboardTitle.text = "";
		clipboardText.text = "";
		clipboardWeight.text = "";
	}

	this.showDesc = function( desc ){
	 	clipboardTitle.text = desc.title;
	 	clipboardText.text = desc.desc;
	 	if( desc.weight ){
	 		clipboardWeight.text = desc.weight.toFixed(2) + " lbs.";
	 	}
	}

    this.setWalletAmount = function(newAmount){
    	wallet.text="$" + ( gameState.wallet=newAmount.toFixed(2) );
    }

    gameState.pubsub.subscribe("ShowDesc", this.showDesc);
	gameState.pubsub.subscribe("ShowPrice", this.showPrice );
    gameState.pubsub.subscribe("WalletAmount", this.setWalletAmount);
    gameState.pubsub.subscribe("ClearClipboard", this.clearClipboard);

	new VolumeButton(stage, gameState, 730, 70, "ToggleMute", null, "Click", null)

    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function ScoreScreen( stage, gameState ){
	var that = this;

    // All the text for the entries
    var totalCookTime = gameState.turkeyCookCounter;
    var realTimeElapsed = Date.now() - gameState.startTime;
    console.log("total cook time:"+ realTimeElapsed);

	var turkeyState = gameState.ovenModel.getTurkeyState();
    var totalScore = 0;

    var skinScoreChart  = {
    	"raw": -1000,
    	"undercooked": -100,
    	"slightly cooked": 75,
    	"cooked": 500,
    	"overcooked": 200,
    	"dry": -300,
    	"burnt": -500
    };

    var coreScoreChart  = {
    	"raw": 0,
    	"undercooked": 125,
    	"slightly cooked": 600,
    	"cooked": 1000,
    	"overcooked": 750,
    	"dry": 400,
    	"burnt": 0
    };

    var typeToMod = {
    	"Organic Turkey" : 1.03,
	    "Free Range Turkey" : 1.02,
	    "Sunny Farms Turkey" : 0.98,
	    "Pastured Turkey": 1.05,
		"General Turkey": 1.00
    };

     // Optimal Temperature to be served at
	this.scoreDistribution= function(inputTemp, layer) {
		desiredAverage = 165;
 		if(layer=="skin") desiredAverage = 260;

		variance = 1000; //Std Deviation 31.62
 		return(Math.exp(-(Math.pow((inputTemp-desiredAverage),2)/(2*variance))))
	};

	// Temperature Score
	var outerTemp = UtilityFunctions.C2F(turkeyState.skin.highest).toFixed(2);
	var coreTemp = UtilityFunctions.C2F(turkeyState.core.temp).toFixed(2);

	var outerTempScore = that.scoreDistribution( outerTemp, "skin" ) * 200;
	var coreTempScore = that.scoreDistribution( coreTemp ) * 200;

	totalScore += parseInt(skinScoreChart[ turkeyState.skin.cond[2]]);
	totalScore += parseInt(coreScoreChart[ turkeyState.core.cond[2]]);
	totalScore += parseInt(outerTempScore.toFixed(0));
	totalScore += parseInt(coreTempScore.toFixed(0));

	resultsDialogue = [];

	var rating = ''

	if (totalScore>=1800) {
		randomDiag = perfect;
		rating = ' (Perfect)';
	}
	else if (totalScore>=1400) {
		randomDiag = great;
		rating = ' (Great)';
	}
	else if (totalScore>=1000) {
		randomDiag = average;
		rating = ' (Average)';
	}
	else if (totalScore>=400) {
		randomDiag = subPar;
		rating = ' (Subpar)';
	}
	else {
		randomDiag = terrible;
		rating = ' (Terrible)';
	}

	for (var i = 0; i<=5; i++) {
		resultsDialogue.push(randomString(randomDiag));
	}
	messages["end"] = resultsDialogue;

	function randomString(stringArray) {
		var index = UtilityFunctions.randRange(0, stringArray.length-1);
		var stringResult = stringArray[index];
		stringArray.splice(index,1);
		return (stringResult)
	}

	function updateScores(score){

		if (isNaN(score)){
			return;
		}

		//High Score
		if (!('highScore' in localStorage)){
			localStorage.setItem("highScore", score);
		}
		else{
			if(localStorage.getItem("highScore") < score){
				localStorage.setItem("highScore", score);
			}
		}

		//Past scores
		if (!('pastScores' in localStorage)){
			var scores = JSON.stringify([score]);
			localStorage.setItem("pastScores", scores);
		}
		else{
			
			var pastScores = JSON.parse(localStorage.getItem("pastScores"));
			
			if(pastScores.length == 3){
				pastScores.shift()
			}
			pastScores.push(score)

			localStorage.setItem("pastScores", JSON.stringify(pastScores));
			
		}

		//Calculate Average Score
		var averageScore = 0;
		var pastScores = JSON.parse(localStorage.getItem("pastScores"));
		averageScore = pastScores.reduce((a, b) => a + b, 0)/pastScores.length
		localStorage.setItem("averageScore", averageScore);

		
    }

	gameState.pubsub.publish( "FadeOut", "" );

    this.background = new createjs.Bitmap( "res/screens/ScoreScreen/Score-Evaluation-1.png" );
    this.background.alpha = 1;
    stage.addChild( this.background );

    background1 = new createjs.Bitmap( "res/screens/ScoreScreen/Score-Evaluation-2.png" );
    background1.alpha = 0;
	stage.addChild( background1 );
	
	new VolumeButton(stage, gameState, 730, 50, "ToggleMute", null, "Click", null);

	for (i in gameState.turkeyStates){
		gameState.turkeyStates[i].scaleX = gameState.turkeyStates[i].scaleY = 1;
		gameState.turkeyStates[i].x = 490;
		gameState.turkeyStates[i].y = 110;
		stage.addChild(gameState.turkeyStates[i]);
	}

 	gameState.pubsub.publish( "BackgroundLoop", {name:"TitleMusic", pos:5650, volume:0.7} );

	gameState.pubsub.publish( "ShowDialog", {seq:"end", autoAdvance:true, endFunc:function(){
		background1.alpha=1;

		stage.addChild( new Button( stage, gameState, 590, 540, 190, 50, null, null, function(){ document.location.reload(); } ) );

		// Cooking stats
		var hours = parseInt( totalCookTime / 3600 ) % 24;
		var minutes = parseInt( totalCookTime / 60 ) % 60;
		var seconds = totalCookTime % 60;
		var timeText = ("00"+hours.toFixed(0)).slice(-2) + ":" + ("00"+minutes.toFixed(0)).slice(-2) + ":" + ("00"+seconds.toFixed(0)).slice(-2);

		var totalCookTimeText = new createjs.Text( timeText, "20px Arial", "black" );
		totalCookTimeText.x = 270;
		totalCookTimeText.y = 107;

		realTimeElapsed = realTimeElapsed / 1000;
		hours = parseInt( realTimeElapsed / 3600 ) % 24;
		minutes = parseInt( realTimeElapsed / 60 ) % 60;
		seconds = realTimeElapsed % 60;
		timeText = ("00"+hours.toFixed(0)).slice(-2) + ":" + ("00"+minutes.toFixed(0)).slice(-2) + ":" + ("00"+seconds.toFixed(0)).slice(-2);

		var realtimeElapsedText = new createjs.Text( timeText, "20px Arial", "black" );
		realtimeElapsedText.x = 270;
		realtimeElapsedText.y = 127;

		var ovenOpenedText = new createjs.Text( gameState.ovenOpened, "20px Arial", "black" );
		ovenOpenedText.x = 270;
		ovenOpenedText.y = 147;

		var dialogueHeardText = new createjs.Text( gameState.dialogueHeard, "20px Arial", "black" );
		dialogueHeardText.x = 270;
		dialogueHeardText.y = 167;

		stage.addChild( totalCookTimeText );
		stage.addChild( realtimeElapsedText );
		stage.addChild( ovenOpenedText );
		stage.addChild( dialogueHeardText );

		// Cookedness Score

		var outerConditionDesc = new createjs.Text( turkeyState.skin.cond[2], "20px Arial", "black" );
		outerConditionDesc.x = 150;
		outerConditionDesc.y = 320;

		var coreConditionDesc = new createjs.Text( turkeyState.core.cond[2], "20px Arial", "black" );
		coreConditionDesc.x = 150;
		coreConditionDesc.y = 340;

		var outerConditionText = new createjs.Text( skinScoreChart[ turkeyState.skin.cond[2] ], "20px Arial", "black" );
		outerConditionText.x = 310;
		outerConditionText.y = 320;

		var coreConditionText = new createjs.Text( coreScoreChart[  turkeyState.core.cond[2] ], "20px Arial", "black" );
		coreConditionText.x = 310;
		coreConditionText.y = 340;


		stage.addChild( coreConditionText );
		stage.addChild( outerConditionText );

		stage.addChild( coreConditionDesc );
		stage.addChild( outerConditionDesc );

		// Temperature Score

		var outerTemperatureText = new createjs.Text( outerTempScore.toFixed(0), "20px Arial", "black" );
		outerTemperatureText.x = 680;
		outerTemperatureText.y = 320;

		var coreTemperatureText = new createjs.Text( coreTempScore.toFixed(0), "20px Arial", "black" );
		coreTemperatureText.x = 680;
		coreTemperatureText.y = 340;

		var outerTemperatureDesc = new createjs.Text( outerTemp + " F", "20px Arial", "black" );
		outerTemperatureDesc.x = 530;
		outerTemperatureDesc.y = 320;



		var coreTemperatureDesc = new createjs.Text( coreTemp + " F", "20px Arial", "black" );
		coreTemperatureDesc.x = 530;
		coreTemperatureDesc.y = 340;



		stage.addChild( outerTemperatureText );
		stage.addChild( coreTemperatureText );

		stage.addChild( coreTemperatureDesc );
		stage.addChild( outerTemperatureDesc );

		// Modifiers
		var turkeyMod = typeToMod[gameState.turkeyType];
		var turkeyTypeModifierText = new createjs.Text( -1*((1-turkeyMod)*100).toFixed(0) + "%", "20px Arial", "black" );
		turkeyTypeModifierText.x = 310;
		turkeyTypeModifierText.y = 437;

		totalScore *= turkeyMod;

		var stuffingTypeModifierText = new createjs.Text( -1*((1-gameState.stuffingTypeModifier)*100).toFixed(0)+"%" , "20px Arial", "black" );
		stuffingTypeModifierText.x = 310
		stuffingTypeModifierText.y = 457;

		totalScore *= gameState.stuffingTypeModifier;

		var frillsModifierText = new createjs.Text( "x"+gameState.frillsModifier, "20px Arial", "black" );
		frillsModifierText.x = 310
		frillsModifierText.y = 477;

		totalScore *= gameState.frillsModifier;

		var hardcoreModifierText = new createjs.Text( "x"+gameState.hardcoreModifier, "20px Arial", "black" );
		hardcoreModifierText.x = 310
		hardcoreModifierText.y = 497;

		totalScore *= gameState.hardcoreModifier;

		updateScores(totalScore);

		var totalText = new createjs.Text( totalScore.toFixed(0) + rating, "32px Arial", "black" );
		totalText.x = 250;
		totalText.y = 550;
		stage.addChild( totalText );

		//High Score Text
		var highScore = localStorage.getItem('highScore') ?  localStorage.getItem('highScore') : '';
		var highScoreText = new createjs.Text( isNaN(parseInt(highScore).toFixed(0)) ? '' : parseInt(highScore).toFixed(0), "20px Arial", "black" );
		highScoreText.x = 600;
		highScoreText.y = 400;
		stage.addChild( highScoreText );

		//Average Score Text
		var averageScore = localStorage.getItem('averageScore') ?  localStorage.getItem('averageScore') : '';
		var averageScoreText = new createjs.Text( isNaN(parseInt(averageScore).toFixed(0)) ? '' : parseInt(averageScore).toFixed(0), "20px Arial", "black" );
		averageScoreText.x = highScoreText.x;
		averageScoreText.y = highScoreText.y + 30;
		stage.addChild( averageScoreText );

		//Most Recent Score text
		var pastScore1 = JSON.parse(localStorage.getItem('pastScores'))[2] ?  JSON.parse(localStorage.getItem('pastScores'))[2] : '';
		var pastScoreText1 = new createjs.Text( isNaN(parseInt(pastScore1).toFixed(0)) ? '' : parseInt(pastScore1).toFixed(0), "20px Arial", "black" );
		pastScoreText1.x = averageScoreText.x;
		pastScoreText1.y = averageScoreText.y + 30;
		stage.addChild( pastScoreText1 );

		//Second Most Recent Score text
		var pastScore2 = JSON.parse(localStorage.getItem('pastScores'))[1] ?  JSON.parse(localStorage.getItem('pastScores'))[1] : '';
		var pastScoreText2 = new createjs.Text( isNaN(parseInt(pastScore2).toFixed(0)) ? '' : parseInt(pastScore2).toFixed(0), "20px Arial", "black" );
		pastScoreText2.x = pastScoreText1.x;
		pastScoreText2.y = pastScoreText1.y + 20;
		stage.addChild( pastScoreText2 );

		//Third Most Recent Score text
		var pastScore3 = JSON.parse(localStorage.getItem('pastScores'))[0] ?  JSON.parse(localStorage.getItem('pastScores'))[0] : '';
		var pastScoreText3 = new createjs.Text( isNaN(parseInt(pastScore3).toFixed(0)) ? '' : parseInt(pastScore3).toFixed(0), "20px Arial", "black" );
		pastScoreText3.x = pastScoreText2.x;
		pastScoreText3.y = pastScoreText2.y + 20;
		stage.addChild( pastScoreText3 );

		stage.addChild( stuffingTypeModifierText );
		stage.addChild( turkeyTypeModifierText );
		stage.addChild( frillsModifierText );
		stage.addChild( hardcoreModifierText );



	}} );


    return {
		blit : function(){}
	}
}

function CreditsScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/screens/HelpCreditsScreen/Credits.png" );
    stage.addChild( this.background );
    stage.addChild( new Button( stage, gameState, 698, 533, 80, 50, "SwitchScreen", "MainScreen" ) );

    this.uiElems = [];
	this.uiElems.push(new VolumeButton(stage, gameState, 730, 50, "ToggleMute", null, "Click", null));
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
	//
}
