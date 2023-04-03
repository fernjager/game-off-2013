// Robert- Here be dragons

var DEBUG = 0;
window.muted = false

function GameState(){
	var that = this;

	this.pubsub = {};
	BindPubSub( this.pubsub );
	this.currentTime = Date.now(); //new Date().getTime();
    this.startTime =  Date.now();//new Date().getTime()
	this.oldTime =  Date.now();// new Date().getTime();
    this.oldDialogueTime =  Date.now();//new Date().getTime();
	this.ovenTemp = 0;

    this.gameStarted = false;
	this.name = "";
	this.gender = "Male";
	this.partnerGender = "Male";
    this.pronoun = "he";
	this.partnerPronoun = "he";
	this.autoplay = false;
	this.wallet = 45.00;
	this.hard = false;
	this.boughtOvenLight = false;
	this.turkeyWeight = 8;
    this.peekRecords = [];
    this.turkeyCooking = false;
    this.turkeyType = "";
    this.alarmTimer = 0;
    this.alarmBought = false;
    this.alarmActivated = false;
    this.turkeyCookCounter = 0;

    // stats
    this.storeVisits = 0;
    this.dialogueHeard = 0;
    this.ovenOpened = 0;

    // modifiers
    this.turkeyTypeModifier = 1;
    this.stuffingTypeModifier = 1;
    this.frillsModifier = 1;
    this.hardcoreModifier = 1;

    // Game State flags
    this.turkeyBought = false;
    var randomWeight = [ (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
                         (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
                         (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
                         (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
                         (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99))
                        ];

    // Load all our resources:
    var queue = new createjs.LoadQueue(true);
    queue.addEventListener("progress", function(event){
    	that.pubsub.publish("Load", (event.progress*100/25));
    });

    that.mainUI = new GameUI( "demoCanvas", that );
    createjs.Ticker.addEventListener( "tick", gameLoop );
    queue.addEventListener("complete", function(event){
    	// Finished loading
    });
    queue.installPlugin(createjs.Sound);

    //
    queue.loadFile( {id: "DialogueBoxFile", src:"res/screens/GUI/DialogueBox.png"} );
	queue.loadFile( {id: "DialogueBoxFile", src:"res/screens/GUI/DialogueBoxAutoplayOff.png"} );
    queue.loadFile( {id: "DialogueBoxFile", src:"res/screens/GUI/DialogueBoxAutoplayOn.png"} );

	/*queue.loadFile( {id:"res/screens/LoadingScreen/Turkey0.png", src: "res/screens/LoadingScreen/Turkey0.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/Turkey25.png", src: "res/screens/LoadingScreen/Turkey25.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/Turkey50.png", src: "res/screens/LoadingScreen/Turkey50.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/Turkey75.png", src: "res/screens/LoadingScreen/Turkey75.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/TurkeyDone.png", src: "res/screens/LoadingScreen/TurkeyDone.png"} );*/

    // Screens
    queue.loadFile( {id: "res/screens/DifficultyScreen/Difficulty-SelectionRevised.png", src:"res/screens/DifficultyScreen/Difficulty-Selection.png"} );
    queue.loadFile( {id: "res/screens/DifficultyScreen/ButtonsandTextRevised.png", src:"res/screens/DifficultyScreen/ButtonsandText.png"} );
	queue.loadFile( {id: "res/screens/DifficultyScreen/ButtonPlayerMale.png", src:"res/screens/DifficultyScreen/ButtonMale.png"} );
    queue.loadFile( {id: "res/screens/DifficultyScreen/ButtonPlayerFemale.png", src:"res/screens/DifficultyScreen/ButtonFemale.png"} );
	queue.loadFile( {id: "res/screens/DifficultyScreen/ButtonPartnerMale.png", src:"res/screens/DifficultyScreen/ButtonMale.png"} );
    queue.loadFile( {id: "res/screens/DifficultyScreen/ButtonPartnerFemale.png", src:"res/screens/DifficultyScreen/ButtonFemale.png"} );
	queue.loadFile( {id: "res/screens/DifficultyScreen/DifficultyCasual.png", src:"res/screens/DifficultyScreen/ButtonMale.png"} );
    queue.loadFile( {id: "res/screens/DifficultyScreen/DifficultyHardcore.png", src:"res/screens/DifficultyScreen/ButtonFemale.png"} );


    // Load image assets
    queue.loadFile( {id: "TurkeySpriteFile", src:"res/screens/MainScreen/TurkeySprite.png"} );
    queue.loadFile( {id: "MainBackgroundFile", src:"res/screens/MainScreen/Main-Screen.png"} );
    queue.loadFile( {id: "OverlayGrassFile", src:"res/screens/MainScreen/Grass.png"} );
    queue.loadFile( {id: "StartButtonFile", src:"res/screens/MainScreen/ButtonStart.png"} );
    queue.loadFile( {id: "HelpButtonFile", src:"res/screens/MainScreen/ButtonHelp.png"} );
    queue.loadFile( {id: "CreditsButtonFile", src:"res/screens/MainScreen/ButtonCredits.png"} );

    queue.loadFile( {id: "CreditsScreenFile", src:"res/screens/HelpCreditsScreen/Credits.png" } );
    queue.loadFile( {id: "HelpP1P2", src:"res/screens/HelpCreditsScreen/HelpP1P2.png" } );
    queue.loadFile( {id: "HelpP3P4", src:"res/screens/HelpCreditsScreen/HelpP3P4.png" } );
    queue.loadFile( {id: "HelpP5P6", src:"res/screens/HelpCreditsScreen/HelpP5P6.png" } );
    queue.loadFile( {id: "HelpP7P8", src:"res/screens/HelpCreditsScreen/HelpP7P8.png" } );
    queue.loadFile( {id: "HelpP9P10", src:"res/screens/HelpCreditsScreen/HelpP9P10.png" } );


    queue.loadFile( {id: "ScoreScreenFile", src:"res/screens/ScoreScreen/Score-Evaluation-1.png" } );
    queue.loadFile( {id: "ScoreScreenFile", src:"res/screens/ScoreScreen/Score-Evaluation-2.png" } );

    queue.loadFile( {id: "MarketScreenfile", src:"res/screens/MarketScreen/MarketScreen.png"} );

    // Load sound assets
    queue.loadFile( {id: "TitleMusicFile", src:"res/sound/turkey_in_the_straw.mp3"} );
	queue.loadFile( {id: "MarketSoundFile", src:"res/sound/Store/Waterford.mp3"} );

	// UI sounds
    queue.loadFile( {id: "UIClickFile", src:"res/sound/GUI/click.mp3"} );
    queue.loadFile( {id: "UIBuzzFile", src:"res/sound/GUI/buzz.mp3"} );
    queue.loadFile( {id: "UIDingFile", src:"res/sound/GUI/ding.mp3"} );

    // Kitchen Items
    queue.loadFile( {id: "res/screens/KitchenScreen/KitchenScreen.png", src:"res/screens/KitchenScreen/KitchenScreen.png"});
    queue.loadFile( {id: "res/screens/KitchenScreen/FinalConfirmation.png", src:"res/screens/KitchenScreen/FinalConfirmation.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState1Small.png", src:"res/screens/KitchenScreen/TurkeyState1Small.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState2Small.png", src:"res/screens/KitchenScreen/TurkeyState2Small.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState3Small.png", src:"res/screens/KitchenScreen/TurkeyState3Small.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState4Small.png", src:"res/screens/KitchenScreen/TurkeyState4Small.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState5Small.png", src:"res/screens/KitchenScreen/TurkeyState5Small.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/CookbookKitchenGlow.png", src:"res/screens/KitchenScreen/CookbookKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/CookbookKitchen.png", src:"res/screens/KitchenScreen/CookbookKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/AlarmKitchenGlow.png", src:"res/screens/KitchenScreen/AlarmKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/AlarmKitchen.png", src:"res/screens/KitchenScreen/AlarmKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/TempProbeKitchenGlow.png", src:"res/screens/KitchenScreen/TempProbeKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TempProbeKitchen.png", src:"res/screens/KitchenScreen/TempProbeKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingSpecialKitchenGlow.png", src:"res/screens/KitchenScreen/StuffingSpecialKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingSpecialKitchen.png", src:"res/screens/KitchenScreen/StuffingSpecialKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingRepurposedKitchenGlow.png", src:"res/screens/KitchenScreen/StuffingRepurposedKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingRepurposedKitchen.png", src:"res/screens/KitchenScreen/StuffingRepurposedKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingExquisiteKitchenGlow.png", src:"res/screens/KitchenScreen/StuffingExquisiteKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingExquisiteKitchen.png", src:"res/screens/KitchenScreen/StuffingExquisiteKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StoreBrochureGlow.png", src:"res/screens/KitchenScreen/StoreBrochureGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StoreBrochure.png", src:"res/screens/KitchenScreen/StoreBrochure.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/FrillsBoxKitchenGlow.png", src:"res/screens/KitchenScreen/FrillsBoxKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/FrillsBoxKitchen.png", src:"res/screens/KitchenScreen/FrillsBoxKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/DoorPeekLightOn.png", src:"res/screens/KitchenScreen/DoorPeekLightOn.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/DoorPeekLightOff.png", src:"res/screens/KitchenScreen/DoorPeekLightOff.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/DoorOpen.png", src:"res/screens/KitchenScreen/DoorOpen.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/DoorClosedLightOn.png", src:"res/screens/KitchenScreen/DoorClosedLightOn.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/DoorClosedLightOff.png", src:"res/screens/KitchenScreen/DoorClosedLightOff.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/PanFront.png", src:"res/screens/KitchenScreen/PanFront.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/OvenTurnRedState.png", src:"res/screens/KitchenScreen/OvenTurnRedState.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/LightButtonDepressed.png", src:"res/screens/KitchenScreen/LightButtonDepressed.png"});
    queue.loadFile( {id: "res/screens/KitchenScreen/Cookbook-Open.png", src:"res/screens/KitchenScreen/Cookbook-Open.png"});
    queue.loadFile( {id: "res/screens/KitchenScreen/Explosion_AnimationLowRes.png", src:"res/screens/KitchenScreen/Explosion_AnimationLowRes.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/Tutorial1.png", src:"res/screens/KitchenScreen/Tutorial1.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/Tutorial2.png", src:"res/screens/KitchenScreen/Tutorial2.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/Tutorial3Casual.png", src:"res/screens/KitchenScreen/Tutorial3Casual.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TutorialFinal.png", src:"res/screens/KitchenScreen/TutorialFinal.png"});


	// Kitchen Sounds
	queue.loadFile( {id: "res/sound/Kitchen/Oven_Door_Full_Open.mp3", src:"res/sound/Kitchen/Oven_Door_Full_Open.mp3"});
	queue.loadFile( {id: "res/sound/Kitchen/Oven_Door_Full_Close.mp3", src:"res/sound/Kitchen/Oven_Door_Full_Close.mp3"});
	queue.loadFile( {id: "res/sound/Kitchen/Oven_Door_Peek_Close.mp3", src:"res/sound/Kitchen/Oven_Door_Peek_Close.mp3"});
	queue.loadFile( {id: "res/sound/Kitchen/Oven_Door_Peek_Open.mp3", src:"res/sound/Kitchen/Oven_Door_Peek_Open.mp3"});
    queue.loadFile( {id: "res/sound/Kitchen/Close_Cookbook.mp3", src:"res/sound/Kitchen/Close_Cookbook.mp3"});
    queue.loadFile( {id: "res/sound/Kitchen/Open_Cookbook.mp3", src:"res/sound/Kitchen/Open_Cookbook.mp3"});
    queue.loadFile( {id: "res/sound/Kitchen/Explosion_Sound.mp3", src:"res/sound/Kitchen/Explosion_Sound.mp3"} );
    queue.loadFile( {id: "res/sound/Kitchen/Double_Beep.mp3", src:"res/sound/Kitchen/Double_Beep.mp3"} );

    // Market Items
    queue.loadFile( {id: "res/screens/MarketScreen/MarketTopShelf.png", src:"res/screens/MarketScreen/MarketTopShelf.png"});

	queue.loadFile( {id: "res/items/Clipboard.png", src:"res/items/Clipboard.png"});
    queue.loadFile( {id: "res/items/Wallet.png", src:"res/items/Wallet.png"});

    queue.loadFile( {id: "res/items/ExitSign.png", src:"res/items/ExitSign.png"});
    queue.loadFile( {id: "res/items/ExitGLow.png", src:"res/items/ExitGlow.png"});

    queue.loadFile( {id: "res/items/FrillsBoxNew.png", src:"res/items/FrillsBoxNew.png"});
    queue.loadFile( {id: "res/items/FrillsBoxNewGlow.png", src:"res/items/FrillsBoxNewGlow.png"});
	queue.loadFile( {id: "res/items/FrillsBoxNewGrey.png", src:"res/items/FrillsBoxNewGrey.png"});

    queue.loadFile( {id: "res/items/TempProbeNew.png", src:"res/items/TempProbeNew.png"});
    queue.loadFile( {id: "res/items/TempProbeNewGlow.png", src:"res/items/TempProbeNewGlow.png"});
	queue.loadFile( {id: "res/items/TempProbeNewGrey.png", src:"res/items/TempProbeNewGrey.png"});

	queue.loadFile( {id: "res/items/OvenLightBoxNew.png", src:"res/items/OvenLightBoxNew.png"});
    queue.loadFile( {id: "res/items/OvenLightBoxNewGlow.png", src:"res/items/OvenLightBoxNewGlow.png"});
	queue.loadFile( {id: "res/items/OvenLightBoxNewGrey.png", src:"res/items/OvenLightBoxNewGrey.png"});

	queue.loadFile( {id: "res/items/AlarmNew.png", src:"res/items/AlarmNew.png"});
    queue.loadFile( {id: "res/items/AlarmNewGlow.png", src:"res/items/AlarmNewGlow.png"});
	queue.loadFile( {id: "res/items/AlarmNewGrey.png", src:"res/items/AlarmNewGrey.png"});


	queue.loadFile( {id: "res/items/CookbookNew.png", src:"res/items/CookbookNew.png"});
    queue.loadFile( {id: "res/items/CookbookNewGlow.png", src:"res/items/CookbookNewGlow.png"});
	queue.loadFile( {id: "res/items/CookbookNewGrey.png", src:"res/items/CookbookNewGrey.png"});

	queue.loadFile( {id: "res/items/StuffingRepurposedNew.png", src:"res/items/StuffingRepurposedNew.png"});
    queue.loadFile( {id: "res/items/StuffingRepurposedNewGlow.png", src:"res/items/StuffingRepurposedNewGlow.png"});
	queue.loadFile( {id: "res/items/StuffingRepurposedNewGrey.png", src:"res/items/StuffingRepurposedNewGrey.png"});

	queue.loadFile( {id: "res/items/StuffingExquisiteNew.png", src:"res/items/StuffingExquisiteNew.png"});
    queue.loadFile( {id: "res/items/StuffingExquisiteNewGlow.png", src:"res/items/StuffingExquisiteNewGlow.png"});
	queue.loadFile( {id: "res/items/StuffingExquisiteNewGrey.png", src:"res/items/StuffingExquisiteNewGrey.png"});

	queue.loadFile( {id: "res/items/StuffingSpecialNew.png", src:"res/items/StuffingSpecialNew.png"});
    queue.loadFile( {id: "res/items/StuffingSpecialNewGlow.png", src:"res/items/StuffingSpecialNewGlow.png"});
	queue.loadFile( {id: "res/items/StuffingSpecialNewGrey.png", src:"res/items/StuffingSpecialNewGrey.png"});


	queue.loadFile( {id: "res/items/Turkey5New.png", src:"res/items/Turkey5New.png"});
    queue.loadFile( {id: "res/items/Turkey5NewGlow.png", src:"res/items/Turkey5NewGlow.png"});
	queue.loadFile( {id: "res/items/Turkey5NewGrey.png", src:"res/items/Turkey5NewGrey.png"});

    queue.loadFile( {id: "res/items/Turkey4New.png", src:"res/items/Turkey4New.png"});
    queue.loadFile( {id: "res/items/Turkey4NewGlow.png", src:"res/items/Turkey4NewGlow.png"});
	queue.loadFile( {id: "res/items/Turkey4NewGrey.png", src:"res/items/Turkey4NewGrey.png"});

	queue.loadFile( {id: "res/items/Turkey3New.png", src:"res/items/Turkey3New.png"});
    queue.loadFile( {id: "res/items/Turkey3NewGlow.png", src:"res/items/Turkey3NewGlow.png"});
	queue.loadFile( {id: "res/items/Turkey3NewGrey.png", src:"res/items/Turkey3NewGrey.png"});

	queue.loadFile( {id: "res/items/Turkey2New.png", src:"res/items/Turkey2New.png"});
    queue.loadFile( {id: "res/items/Turkey2NewGlow.png", src:"res/items/Turkey2NewGlow.png"});
	queue.loadFile( {id: "res/items/Turkey2NewGrey.png", src:"res/items/Turkey2NewGrey.png"});

	queue.loadFile( {id: "res/items/Turkey1New.png", src:"res/items/Turkey1New.png"});
    queue.loadFile( {id: "res/items/Turkey1NewGlow.png", src:"res/items/Turkey1NewGlow.png"});
	queue.loadFile( {id: "res/items/Turkey1NewGrey.png", src:"res/items/Turkey1NewGrey.png"});


    // People photos
   	queue.loadFile( {id: "res/people/Boyfriend.png", src:"res/people/Boyfriend.png"});
   	queue.loadFile( {id: "res/people/Brother.png", src:"res/people/Brother.png"});
   	queue.loadFile( {id: "res/people/Cat.png", src:"res/people/Cat.png"});
   	queue.loadFile( {id: "res/people/Dad.png", src:"res/people/Dad.png"});
   	queue.loadFile( {id: "res/people/Girlfriend.png", src:"res/people/Girlfriend.png"});
   	queue.loadFile( {id: "res/people/Grandma.png", src:"res/people/Grandma.png"});
   	queue.loadFile( {id: "res/people/Grandpa.png", src:"res/people/Grandpa.png"});
   	queue.loadFile( {id: "res/people/Mom.png", src:"res/people/Mom.png"});
   	queue.loadFile( {id: "res/people/PlayerFemale.png", src:"res/people/PlayerFemale.png"});
   	queue.loadFile( {id: "res/people/PlayerMale.png", src:"res/people/PlayerMale.png"});
    queue.loadFile( {id: "res/people/TurkeyGhost.png", src:"res/people/TurkeyGhost.png"});

    // Load Window elements
    queue.loadFile( {id: "res/screens/Window/Door1.png", src:"res/screens/Window/Door1.png"});
    queue.loadFile( {id: "res/screens/Window/Door2.png", src:"res/screens/Window/Door2.png"});
    queue.loadFile( {id: "res/screens/Window/Ground.png", src:"res/screens/Window/Ground.png"});
    queue.loadFile( {id: "res/screens/Window/Housefar.png", src:"res/screens/Window/Housefar.png"});
    queue.loadFile( {id: "res/screens/Window/Small1.png", src:"res/screens/Window/Small1.png"});
    queue.loadFile( {id: "res/screens/Window/Small2.png", src:"res/screens/Window/Small2.png"});
    queue.loadFile( {id: "res/screens/Window/Small3.png", src:"res/screens/Window/Small3.png"});
    queue.loadFile( {id: "res/screens/Window/Small4.png", src:"res/screens/Window/Small4.png"});
    queue.loadFile( {id: "res/screens/Window/Small5.png", src:"res/screens/Window/Small5.png"});
    queue.loadFile( {id: "res/screens/Window/StreetlightGlow.png", src:"res/screens/Window/StreetlightGlow.png"});
    queue.loadFile( {id: "res/screens/Window/Win1.png", src:"res/screens/Window/Win1.png"});
    queue.loadFile( {id: "res/screens/Window/Win2.png", src:"res/screens/Window/Win2.png"});
    queue.loadFile( {id: "res/screens/Window/Win3.png", src:"res/screens/Window/Win3.png"});
    queue.loadFile( {id: "res/screens/Window/Win4.png", src:"res/screens/Window/Win4.png"});
    queue.loadFile( {id: "res/screens/Window/Win5.png", src:"res/screens/Window/Win5.png"});
    queue.loadFile( {id: "res/screens/Window/Win6.png", src:"res/screens/Window/Win6.png"});
    queue.loadFile( {id: "res/screens/Window/Win7.png", src:"res/screens/Window/Win7.png"});
    queue.loadFile( {id: "res/screens/Window/Win8.png", src:"res/screens/Window/Win8.png"});
    queue.loadFile( {id: "res/screens/Window/Win9.png", src:"res/screens/Window/Win9.png"});
    queue.loadFile( {id: "res/screens/Window/Win10.png", src:"res/screens/Window/Win10.png"});
    queue.loadFile( {id: "res/screens/Window/Win11.png", src:"res/screens/Window/Win11.png"});
    queue.loadFile( {id: "res/screens/Window/Tree_Animation.png", src:"res/screens/Window/Tree_Animation.png"});
    queue.loadFile( {id: "res/screens/Window/Test4TransparencyFull.png", src:"res/screens/Window/Test4TransparencyFull.png"});
    queue.loadFile( {id: "res/screens/Window/Stars.png", src:"res/screens/Window/Stars.png"});

	//Volume images
	queue.loadFile( {id: "res/controls/volume.png", src:"res/controls/volume.png"});
	queue.loadFile( {id: "res/controls/volume-mute.png", src:"res/controls/volume-mute.png"});
	queue.loadFile( {id: "res/controls/volume-hover.png", src:"res/controls/volume-hover.png"});
	queue.loadFile( {id: "res/controls/volume-mute-hover.png", src:"res/controls/volume-mute-hover.png"});


    this.screenState = 0;
    this.newScreen = "";

	const topShelf = 75;
	const middleShelf = 250;
	const bottomShelf = 450;

	this.marketItems = {
		"Organic Turkey" : new MarketItem( this, "Organic Turkey", 60,topShelf-10, randomWeight[0]*1.2, "res/items/Turkey5New.png", "res/items/Turkey5NewGlow.png", "res/items/Turkey5NewGrey.png",null,null, "All natural. No hormones. No antibiotics. Free Range. Lead Free", parseFloat(randomWeight[0]) ),
	    "Free Range Turkey": new MarketItem( this, "Free Range Turkey", 215,topShelf+5, randomWeight[1]*1.00, "res/items/Turkey4New.png", "res/items/Turkey4NewGlow.png", "res/items/Turkey4NewGrey.png",null,null, "Our turkeys have wide open spaces to roam and are fed with only the highest quality feed.", parseFloat(randomWeight[1]) ),
	    "Sunny Farms Turkey" : new MarketItem( this, "Sunny Farms Turkey", 315,topShelf-5, randomWeight[2]*0.60, "res/items/Turkey3New.png", "res/items/Turkey3NewGlow.png", "res/items/Turkey3NewGrey.png",null,null, "100% Turkey product from Sunny Farms Heavy Industries, Ltd.", parseFloat(randomWeight[2]) ),
	    "Pastured Turkey": new MarketItem( this, "Pastured Turkey", 490,topShelf+5, randomWeight[3]*1.4, "res/items/Turkey2New.png", "res/items/Turkey2NewGlow.png", "res/items/Turkey2NewGrey.png",null,null, "Grassy fields and natural ingredients allow our turkeys to have a better life, and taste great.", parseFloat(randomWeight[3]) ),
		"General Turkey": new MarketItem( this, "General Turkey", 600,topShelf, randomWeight[4]*0.80, "res/items/Turkey1New.png", "res/items/Turkey1NewGlow.png", "res/items/Turkey1NewGrey.png",null,null, "100% General Satisfaction Guaranteed", parseFloat(randomWeight[4]) ),

		"Frills Box" : new MarketItem( this, "Frills Box", 100,middleShelf+20, 3.00, "res/items/FrillsBoxNew.png", "res/items/FrillsBoxNewGlow.png", "res/items/FrillsBoxNewGrey.png", "res/screens/KitchenScreen/FrillsBoxKitchen.png", "res/screens/KitchenScreen/FrillsBoxKitchenGlow.png", 
		"Some people dress up their dogs. Others dress up their house. Why not dress up your turkey?" ),
		"Repurposed Stuffing" : new MarketItem( this, "Repurposed Stuffing",  260,middleShelf-5, 2.00, "res/items/StuffingRepurposedNew.png", "res/items/StuffingRepurposedNewGlow.png", "res/items/StuffingRepurposedNewGrey.png", "res/screens/KitchenScreen/StuffingRepurposedKitchen.png", "res/screens/KitchenScreen/StuffingRepurposedKitchenGlow.png","At least 80% original breadcrumb. Guaranteed to contain no avian products" ),
	    "Exquisite Stuffing" : new MarketItem( this, "Exquisite Stuffing", 435,middleShelf+5, 3.00, "res/items/StuffingExquisiteNew.png", "res/items/StuffingExquisiteNewGlow.png", "res/items/StuffingExquisiteNewGrey.png", "res/screens/KitchenScreen/StuffingExquisiteKitchen.png","res/screens/KitchenScreen/StuffingExquisiteKitchenGlow.png", "Colonial merchants once traveled the four reaches of the Earth to bring back the ingredients contained in this very box" ),
	    "Special Stuffing" : new MarketItem( this, "Special Stuffing", 610,middleShelf-5, 6.00, "res/items/StuffingSpecialNew.png", "res/items/StuffingSpecialNewGlow.png", "res/items/StuffingSpecialNewGrey.png",
	    	"res/screens/KitchenScreen/StuffingSpecialKitchen.png","res/screens/KitchenScreen/StuffingSpecialKitchenGlow.png",
	    	"Once rated as the most handsome man in the universe. Scott and his patented special stuffing will set you on the path to food heaven" ),

		
		"Temperature Probe" : new MarketItem( this, "Temperature Probe", 150, bottomShelf+10, 9.00, "res/items/TempProbeNew.png", "res/items/TempProbeNewGlow.png", "res/items/TempProbeNewGrey.png", "res/screens/KitchenScreen/TempProbeKitchen.png", "res/screens/KitchenScreen/TempProbeKitchenGlow.png", "Ensure your food is cooked with this handy thermometer. Now with easy to read LED display" ),
		"Oven Light in a Box" : new MarketItem( this, "Oven Light in a Box", 270,bottomShelf+15, 15.00, "res/items/OvenLightBoxNew.png", "res/items/OvenLightBoxNewGlow.png", "res/items/OvenLightBoxNewGrey.png", null,null, "This will allow checking on your turkey without letting the heat out." ),
		"Alarm Clock" : new MarketItem( this, "Alarm Clock", 390,bottomShelf+30, 6.00, "res/items/AlarmNew.png", "res/items/AlarmNewGlow.png", "res/items/AlarmNewGrey.png", "res/screens/KitchenScreen/AlarmKitchen.png", "res/screens/KitchenScreen/AlarmKitchenGlow.png", "Have you ever wanted to control time? Now you can. Digital readout counts down until time of choice. Audible alarm" ),
		"Cookbook" : new MarketItem( this, "Cookbook", 550,bottomShelf-10, 3.00, "res/items/CookbookNew.png", "res/items/CookbookNewGlow.png", "res/items/CookbookNewGrey.png", "res/screens/KitchenScreen/CookbookKitchen.png",  "res/screens/KitchenScreen/CookbookKitchenGlow.png", "How do I cook turkey? Handy note space included for writing down temperature measurements" ),
		
	};

        // Important Model, dummy placeholder
    this.ovenModel = { secondTick:function(){}, setRawTemp:function(){}, getRawTemp:function(){}, getCookTime:function(){return 1000;} };


    /* all turkeys */
    this.turkeyStates = [
        new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState1Small.png" ),
        new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState2Small.png" ),
        new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState3Small.png" ),
        new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState4Small.png" ),
        new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState5Small.png" )
    ];

	this.purchasedItems = [];

	// did we already show the player the kitchen intro?
	this.kitchenIntro = false;

    this.addRecord = function( record ){
        that.peekRecords.push( new Record( record.type, that.currentTime, record.text, record.temp) );
    }
    that.pubsub.subscribe( "AddRecord", this.addRecord );


    function addHighScore(name, turkeyPoundage, cookTime, score){
    	var scores = {};
    	var now = new Date();
    	if( !localStorage.getItem("highScores") ){
    		scores = JSON.parse( localStorage.getItem("highScores") );
    	}

    	scores[now.getYear()+"/"+now.getMonth()+"/"+now.getDay()] = {
    			"name" : name,
    			"weight" : turkeyPoundage,
    			"cookTime" : cookTime,
    			"score" : score
    	};

    	localStorage.setItem("highScores", JSON.stringfy(scores));
    }

	function gameLoop(){
		that.mainUI.draw();
	}

	return {
	//	"main": this
	}
}


function GameUI( canvasElem, gameState ){
	var that = this;

	var SCREEN_OUT = 1;
	var SCREEN_IN  = 2;
	var SCREEN_STABLE = 0;

	this.stage = new createjs.Stage( canvasElem );
	this.stage.enableMouseOver(25);
	
	this.activeScreenName = "EndingScreen";
	this.activeScreenObj = {};

	/* Initialize All Screens */
	this.screens = {
		"LoadingScreen" 	 : LoadingScreen,
		"MainScreen" 	 	 : MainScreen,
		"DifficultyScreen" 	 : DifficultyScreen,
		"KitchenScreen"		 : KitchenScreen,
		"MarketScreen"		 : MarketScreen,
		"ScoreScreen"		 : ScoreScreen,
		"CreditsScreen"		 : CreditsScreen
	}

	var soundManager = new SoundManager( gameState );

	this.activeScreenObj = new LoadingScreen( this.stage, gameState );
	var textContent = new createjs.Text( "", "20px Arial", "white" );
	textContent.x = 750;
	textContent.y = 30;
	//this.stage.addChild( textContent);
	var overlay = new createjs.Shape();
 	overlay.graphics.beginFill("#fffffff").drawRect(0, 0, 800, 600 );
 	overlay.alpha = 0;
	this.stage.addChild(overlay);

	var dialogManager = new DialogUI( this.stage, gameState );

	// delay for fade in and fade-out
	this.switchScreen = function( screenName ){
		gameState.screenState = SCREEN_OUT;
		dialogManager.minDialog();
		if(DEBUG) console.log("Switch screen called with" + screenName);
		gameState.newScreen = screenName;
	};
	this.actuallySwitchScreen = function( screenName ){
		that.stage.removeAllChildren();
		that.activeScreenObj = new that.screens[ screenName ]( that.stage, gameState );
		//that.stage.addChild( textContent );
		that.stage.addChild( overlay );
		dialogManager.render();
	};
    new HelpUI(this.stage, gameState);

	gameState.pubsub.subscribe( "SwitchScreen", this.switchScreen );
	gameState.pubsub.subscribe( "ActuallySwitchScreen", this.actuallySwitchScreen );

	// Allow items to be removed if they don't have access to stage
	gameState.pubsub.subscribe( "RemoveItems", function(items){
		for (var index in items ){
			that.stage.removeChild(items[index]);
		}
	});
		
	return {
		draw : function(){
			if( gameState.screenState == SCREEN_OUT ){
				overlay.alpha +=0.3;
			}
			if( gameState.screenState == SCREEN_IN ){
				overlay.alpha -=0.3;
			}
			if( overlay.alpha > 1.0 ){
				gameState.screenState = SCREEN_IN;
				overlay.alpha = 1;
				gameState.pubsub.publish( "ActuallySwitchScreen", gameState.newScreen );
			}
			if( overlay.alpha  < 0.0 ){
				gameState.screenState = SCREEN_STABLE;
				overlay.alpha = 0;
			}
			soundManager.tick();
			that.activeScreenObj.blit();
			dialogManager.tick();
			textContent.text = createjs.Ticker.getMeasuredFPS().toFixed(1);
			that.stage.update();
		}
	}

}

function Record( type, dateTime, record, temp){
    return {
        getTime: function(){
            return dateTime;
        },
        getContent: function(){
            return record;
        },
        getType: function(){
            return type;
        },
		getTemp: function(){
			return temp ? temp: '0' + "\u00B0F";
		}
    }
}

    //"Turkey weight, "
    //"Opened oven for X seconds"
    //"Core temperature measured at "


function BindPubSub( obj ){
	(function(q) {
	    var topics = {}, subUid = -1;
	    q.subscribe = function(topic, func) {
	        if (!topics[topic]) {
	            topics[topic] = [];
	        }
	        var token = (++subUid).toString();
	        topics[topic].push({
	            token: token,
	            func: func
	        });
	        return token;
	    };

	    q.publish = function(topic, args) {
	        if (!topics[topic]) {
	            return false;
	        }
	        setTimeout(function() {
	            var subscribers = topics[topic],
	                len = subscribers ? subscribers.length : 0;

	            while (len--) {
	                subscribers[len].func(args);
	            }
	        }, 0);
	        return true;

	    };

	    q.unsubscribe = function(token) {
	        for (var m in topics) {
	            if (topics[m]) {
	                for (var i = 0, j = topics[m].length; i < j; i++) {
	                    if (topics[m][i].token === token) {
	                        topics[m].splice(i, 1);
	                        return token;
	                    }
	                }
	            }
	        }
	        return false;
	    };
	}(obj));
}
