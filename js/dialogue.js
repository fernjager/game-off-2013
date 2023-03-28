function DialogueSequence( sequence ){

	var targetStory = story[sequence] ? story[sequence].slice(0) : (  messages[sequence] ?  messages[sequence].slice(0) : [] );

	return {
		next: function(){
			return targetStory.shift().split(": ");
		},
		more: function(){
			return targetStory.length > 0;
		}
	}
}

function DialogUI( stage, gameState ){
	var that = this;
	// Dialog States
	var DIALOG_RECEDING = 0;
	var DIALOG_SHOWING = 1;
	var DIALOG_PAUSING = 2;
	var MILLIS_PER_CHAR = 100;

	var peopleImg = {
		"Boyfriend": new createjs.Bitmap("res/people/Boyfriend.png"),
		"Brother": new createjs.Bitmap("res/people/Brother.png"),
		"Cat": new createjs.Bitmap("res/people/Cat.png"),
		"Dad": new createjs.Bitmap("res/people/Dad.png"),
		"Girlfriend": new createjs.Bitmap("res/people/Girlfriend.png"),
		"Grandma": new createjs.Bitmap("res/people/Grandma.png"),
		"Grandpa": new createjs.Bitmap("res/people/Grandpa.png"),
		"Mom": new createjs.Bitmap("res/people/Mom.png"),
		"Female": new createjs.Bitmap("res/people/PlayerFemale.png"),
		"Male": new createjs.Bitmap("res/people/PlayerMale.png"),
		"Turkey": new createjs.Bitmap("res/people/TurkeyGhost.png")
	};

	var dialogueList = Object.keys(story);

	this.dialogSpeed = 30;
	this.dialogState = DIALOG_PAUSING;

	this.dialogMotionQueue = [DIALOG_RECEDING];
	this.currDialogueSeq = new DialogueSequence("Null");
	dialogQueue = [];

	this.dialogBox = new createjs.Bitmap("res/screens/GUI/DialogueBox.png");
	this.dialogBox.x = 0;
	this.dialogBox.y = 250;

	this.autoplayOff = new createjs.Bitmap( "res/screens/GUI/DialogueBoxAutoplayOff.png" );

	this.autoplayOn = new createjs.Bitmap( "res/screens/GUI/DialogueBoxAutoplayOn.png" );
 	this.autoplayOn.alpha = 0;


	this.currentFace = peopleImg["Male"];
	this.currentFace.x = 0;

	this.textContent = new createjs.Text( "", "24px Arial", "black" );
	this.textContent.x = 205;
	this.textContent.y = 705;
	this.textContent.lineWidth = 565;
	this.textContent.lineHeight = 30;
	this.textContent.textBaseline = "alphabetic";
	
	this.autoplayText = new createjs.Text( "Autoplay", "12px Arial", "gray" );
	this.autoplayText.x = 220;
	this.autoplayText.y = 705; //565
	// this.autoplayText.lineWidth = 565;
	// this.autoplayText.lineHeight = 30;
	// this.autoplayText.textBaseline = "alphabetic";

	this.dialogBox.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	this.dialogBox.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	this.dialogBox.addEventListener( "click",  function(){ setTimeout( clickEvent, 100); });

	this.textContent.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	this.textContent.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	this.textContent.addEventListener( "click", function(){ setTimeout( clickEvent, 100); });
	
	this.autoplayButton = new Button( stage, gameState, 190, 285, 90, 50, "Autoplay", null )

	 gameState.pubsub.subscribe( "Autoplay", function(){
		 if (that.autoplayOn.alpha == 0) {
			gameState.autoplay = true;
			that.autoplayOn.alpha = 1;
			that.autoplayOff.alpha = 0;
		} else {
			gameState.autoplay = false;
			that.autoplayOn.alpha = 0;
			that.autoplayOff.alpha = 1;
		}
	 })
 	// negate double setTimeout if clicked
 	var oldTime = new Date().getTime();
 	var delayCounter = 0;

	this.endFunc = function(){};

 	this.showDialog= function( textSeq ){
 		if(DEBUG) console.log("showing"+ textSeq);
 		if( !peopleImg["Me"] ){
 		   	 peopleImg["Me"] = peopleImg[gameState.playerGender];
 		}

		if( !peopleImg["Spouse"] ){
			if( gameState.partnerGender == "Male" ){
				peopleImg["Spouse"] = peopleImg["Boyfriend"] ;
			}else{
				peopleImg["Spouse"] = peopleImg["Girlfriend"] ;
			}
		}

 		if( textSeq.seq == "custom" ){
 			messages["custom"] = ["Me: " + textSeq.customText ];
 		}


 		if( textSeq.random ){
 			that.showRandomConvo();
 			return;
 		}
 		delayCounter = 0;
 		oldTime = new Date().getTime();
 		that.currDialogueSeq = new DialogueSequence( textSeq.seq );
 		var nextDialogue = that.currDialogueSeq.next();

 		that.endFunc = textSeq.endFunc || function(){};

 		that.textContent.text=nextDialogue[1].replace(/\[GenderPronoun\]/g, gameState.pronoun ).replace(/\[Player\]/g, gameState.name || "Sam" );

 		that.currentFace.y = 250;
 		that.currentFace = peopleImg[nextDialogue[0]] || that.currentFace;
 		// that.autoAdvance = textSeq.autoAdvance;
		that.autoAdvance = gameState.autoplay;
 		that.dialogMotionQueue = [DIALOG_SHOWING];
 	}

 	this.showRandomConvo = function(){
 		// No more stories, thanks for playing
 		if( dialogueList.length == 0 ) return;

 		dialogueList = Object.keys(story);
 		var randomKey = UtilityFunctions.randRange(0, dialogueList.length);

 		// check if there is something going on
 		if( !that.currDialogueSeq.more() ){
 			if(DEBUG) console.log("random story");
 			this.showDialog( {seq: dialogueList[ randomKey ] || "Dad Tells a bad Joke", autoAdvance:gameState.autoplay } );
 			delete story[ dialogueList[ randomKey ] ];
 			gameState.dialogueHeard++;
 		}
 	}

 	gameState.pubsub.subscribe( "ShowDialog", this.showDialog );

 	var clickEvent = function( timer ){

 		if( !peopleImg["Me"] ){
 		   	 peopleImg["Me"] = peopleImg[gameState.gender];
 		}

 		// if there is more dialogue text, then keep going, otherwise, recede
 		if( that.currDialogueSeq.more() ){
 			var nextDialogue = that.currDialogueSeq.next();

 			that.dialogMotionQueue.push(DIALOG_SHOWING);
 			that.textContent.text=nextDialogue[1].replace(/\[GenderPronoun\]/g, gameState.pronoun ).replace(/\[Player\]/g, gameState.name || "Sam" );
 			if(DEBUG) console.log("showing face:" +nextDialogue[0] );

 			// swap out face immediately
 			that.currentFace.y = 250;
 			that.currentFace = peopleImg[nextDialogue[0]] || that.currentFace;
 			that.currentFace.y = 0;
 		}else{
 			// pause and close dialog
 			setTimeout( function(){
 				that.dialogMotionQueue.push(DIALOG_RECEDING);
 				if( that.endFunc )
 					that.endFunc();
 			}, 250 );
 		}
 			delayCounter = 0;
			oldTime = new Date().getTime();
 	}

	stage.addChild( this.dialogBox );
	stage.addChild( this.autoplayOff );
	stage.addChild( this.autoplayOn );
	stage.addChild( this.autoplayText );
	stage.addChild( this.textContent );
	stage.addChild( this.autoplayButton );

	for(var i in peopleImg ){
		peopleImg[i].alpha = 1;
		peopleImg[i].y = 250;
		stage.addChild( peopleImg[i] );
	}

    return {
    	tick: function(){

    		if( gameState.autoplay == true && that.dialogBox.y ==0 && delayCounter > ( (that.textContent.text.length * MILLIS_PER_CHAR) < 2000 ? 2000 : (that.textContent.text.length * MILLIS_PER_CHAR)  ) ){
    			clickEvent();
    		}

    		if( that.dialogState == DIALOG_RECEDING ){
	    		that.dialogBox.y+=that.dialogSpeed;
	    		that.textContent.y += that.dialogSpeed;
	    		that.currentFace.y += that.dialogSpeed;
				that.autoplayText.y += that.dialogSpeed;
				that.autoplayOff.y += that.dialogSpeed;
				that.autoplayOn.y += that.dialogSpeed;
				that.autoplayButton.y += that.dialogSpeed;
	    		//if(DEBUG) console.log( "Receding" + that.dialogBox.y );
    		}
    		if( that.dialogState == DIALOG_SHOWING ){
    			that.dialogBox.y-=that.dialogSpeed;
    			that.textContent.y -= that.dialogSpeed;
    			that.currentFace.y -= that.dialogSpeed;
				that.autoplayText.y -= that.dialogSpeed;
				that.autoplayOff.y -= that.dialogSpeed;
				that.autoplayOn.y -= that.dialogSpeed;
				that.autoplayButton.y -= that.dialogSpeed;

    			//if(DEBUG) console.log( "Advancing" + that.dialogBox.y );
    		}

    		// toggle states
    		if( that.dialogBox.y > 250 && that.dialogState == DIALOG_RECEDING ){
    			that.dialogBox.y = 250;
    			that.textContent.y = 735;
    			that.currentFace.y = 250;
				that.autoplayText.y = 815;
				that.autoplayOff.y = 250;
				that.autoplayOn.y = 250;
				that.autoplayButton.y = 515; //815
    			that.dialogState = DIALOG_PAUSING;
    			//if(DEBUG) console.log( "Pausing on recede" + that.dialogBox.y );

    		}
    		if( that.dialogBox.y < 0 && that.dialogState == DIALOG_SHOWING ){
    			that.dialogBox.y = 0;
    			that.textContent.y = 480;
    			that.currentFace.y = 0;
				that.autoplayText.y = 565;
				that.autoplayOff.y = 0;
				that.autoplayOn.y = 0;
				that.autoplayButton.y = 250; //565
    			that.dialogState = DIALOG_PAUSING;
    			//if(DEBUG) console.log( "Pausing on showing" + that.dialogBox.y );
    		}

    		/* next states if there are any on the queue */
    		if( that.dialogMotionQueue.length > 0 && that.dialogState == DIALOG_PAUSING ){
    			that.dialogState = that.dialogMotionQueue.shift();
    		}
    		delayCounter = new Date().getTime() - oldTime;
    	},

    	minDialog: function(){
    		that.dialogMotionQueue.push( DIALOG_RECEDING );
    	},

    	maxDialog: function(){
    		that.dialogMotionQueue.push( DIALOG_SHOWING );
    	},
    	render: function(){
			stage.addChild( that.dialogBox );
			stage.addChild( that.textContent );
			stage.addChild( that.autoplayText );
			stage.addChild( that.autoplayOff );
			stage.addChild( that.autoplayOn );
			stage.addChild( that.autoplayButton );

			for(var i in peopleImg ){
				peopleImg[i].alpha = 1;
				stage.addChild( peopleImg[i] );
			}
    	}
	}
}