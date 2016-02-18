"use strict" ;

var comp = gxd.comp || { } ;
var proj = gxd.proj || { } ;

var color =
[
	"red" , "orange" , "yellow" , "green" , "blue" , "indigo" , "purple"
] ;

var MainGameScene = cc.Scene.extend(
{
	_backgroundLayer	: null ,
	_mainLayer			: null ,
	_interfaceLayer		: null ,
	_gameOverLayer		: null ,
	_startTime			: null ,
	_tipImages			: null ,
	
	ctor : function( )
	{
		this._super( ) ;
		
		cc.spriteFrameCache.addSpriteFrames( proj.Resources.JewelRotation.JewelRotation_plist ,
											 proj.Resources.JewelRotation.JewelRotation_png ) ;
		
		cc.loader.loadJson( "res/configuration.json" ,
							this._onConfigJsonLoadedCallback.bind( this ) ) ;
	} ,
	
	_onConfigJsonLoadedCallback : function( error , json )
	{
		if( !error )
		{
			proj.config = json ;
			
			this._init( ) ;
		}
	} ,
	
	_init : function( )
	{
		var winSize				= cc.director.getWinSize( ) ;
		var jewelLayerConfig	= proj.config.jewelLayer ;
		
		this._backgroundLayer	= new cc.Layer( ) ;
		var background			= new cc.Sprite( proj.Resources.JewelRotation.Background_png ) ;
		background.setPosition( winSize.width * 0.5 , winSize.height * 0.5 ) ;
		this._backgroundLayer.addChild( background ) ;
		this.addChild( this._backgroundLayer ) ;
		
		this._mainLayer = new comp.JewelLayer( jewelLayerConfig.width ,
											   jewelLayerConfig.height ,
											   jewelLayerConfig.rows ,
											   jewelLayerConfig.columns ) ;
		this.addChild( this._mainLayer ) ;
		
		this._initJewels( ) ;
		
		var buttonLayerWidth = jewelLayerConfig.width / jewelLayerConfig.columns * ( jewelLayerConfig.columns - 1 ) ;
		var buttonLayerHeight = jewelLayerConfig.height / jewelLayerConfig.rows * ( jewelLayerConfig.rows - 1 ) ;
		
		this._interfaceLayer = new comp.InterfaceLayer( buttonLayerWidth ,
														buttonLayerHeight ,
														jewelLayerConfig.rows - 1 ,
														jewelLayerConfig.columns - 1 ) ;
		
		this._interfaceLayer.setPosition( jewelLayerConfig.width / jewelLayerConfig.columns * 0.5 ,
										  jewelLayerConfig.height / jewelLayerConfig.rows * 0.5 ) ;
		this.addChild( this._interfaceLayer ) ;
		
		this._initButtons( ) ;
		
		this._initJewelRotatedListener( ) ;
		
		this._initTipImage( ) ;
	} ,
	
	_initJewels : function( )
	{
		var jewelLayerConfig	= proj.config.jewelLayer ;
		var jewelsAmount		= jewelLayerConfig.rows * jewelLayerConfig.columns ;
		var randomIndex			= [ ] ;
		
		for( var i = 0 ; i < jewelsAmount ; i ++ )
			randomIndex[ i ] = i ;
		
		randomIndex = util.shuffle( randomIndex ) ;
		
		var index			= null ;
		var colorName		= null ;
		var imageName		= null ;
		var jewewlSprite	= null ;
		
		for( var i = 0 ; i < jewelsAmount ; i ++ )
		{
			index			= Math.floor( randomIndex[ i ] % jewelLayerConfig.columns ) ;
			colorName		= proj.config.colors[ index ] ;
			imageName		= "jewel_" + colorName + ".png" ;
			
			jewewlSprite	= new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( imageName ) ) ;
			jewewlSprite.setTag( index ) ;
			
			this._mainLayer.setGridNodeAtIndex( jewewlSprite , i ) ;
		}
	} ,
	
	_initButtons : function( )
	{
		var buttonAmount = ( proj.config.jewelLayer.rows - 1 ) * ( proj.config.jewelLayer.columns - 1 ) ;
		
		var flipped			= null ;
		var normalSprite	= null ;
		var selectedSprite	= null ;
		var disableSprite	= null ;
		var callback		= null ;
		var button			= null ;
		
		for( var i = 0 ; i < buttonAmount ; i ++ )
		{
			flipped			= util.randomBoolean( ) ;
			normalSprite	= new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( "rotate_normal.png" ) ) ;
			selectedSprite	= new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( "rotate_selected.png" ) ) ;
			disableSprite	= new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( "rotate_disable.png" ) ) ;
			
			normalSprite.setFlippedX( flipped ) ;
			selectedSprite.setFlippedX( flipped ) ;
			disableSprite.setFlippedX( flipped ) ;
			
			callback = flipped ? this.roteteJewelCounterClockwise : this.rotateJewelClockwise ;
			
			button = new comp.Button( normalSprite ,
									  selectedSprite ,
									  disableSprite ,
									  callback.bind( this , i ) ,
									  this ) ;
			
			this._interfaceLayer.setGridNodeAtIndex( button , i ) ;
		}
	} ,
	
	_initBackgroundImage : function( )
	{
	},
	
	_initTipImage : function( )
	{
		var colors		= proj.config.colors ;
		var imageName	= null ;
		var tipImage	= null ;
		
		for( var i = 0 ; i < colors.length ; i ++ )
		{
			imageName	= "triangle_" + colors[ i ] + ".png" ;
			tipImage	= new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( imageName ) ) ;
			tipImage.setTag( i ) ;
			
			this._backgroundLayer.addChild( tipImage ) ;
		}
		
		this._resetTipImage( ) ;
	} ,
	
	_resetTipImage : function( )
	{
		var colorLength = proj.config.colors.length ;
		var randomIndex = [ ] ;
		
		for( var i = 0 ; i < colorLength ; i ++ )
			randomIndex[ i ] = i ;
		
		randomIndex			= util.shuffle( randomIndex ) ;
		
		this._mainLayer.setColorOfColumns( randomIndex ) ;
		
		var tipImage		= null ;
		var gridWidth		= this._mainLayer.getGridSize( ).width ;
		var tipImageHeight	= ( proj.config.jewelLayer.height + cc.director.getWinSize( ).height ) * 0.5 ;
		
		
		for( var i = 0 ; i < colorLength ; i ++ )
		{
			tipImage = this._backgroundLayer.getChildByTag( randomIndex[ i ] ) ;
			tipImage.setPosition( ( 0.5 + i ) * gridWidth , tipImageHeight ) ;
		}
	} ,
	
	_initJewelRotatedListener : function( )
	{
		this._jewelRotatedListener = cc.EventListener.create(
		{
			event		: cc.EventListener.CUSTOM ,
			eventName	: "JEWEL_MOVED" ,
			callback	: this._buttonsEnable.bind( this )
		} ) ;
		
		cc.eventManager.addListener( this._jewelRotatedListener , 1 ) ;
	} ,
	
	rotateJewelClockwise : function( index )
	{
		this._interfaceLayer.lockButtons( ) ;
		
		var row = Math.floor( index / this._interfaceLayer.getColumns( ) ) ;
		this._mainLayer.rotateClockwise( index + row ) ;
	} ,
	
	roteteJewelCounterClockwise : function( index )
	{
		this._interfaceLayer.lockButtons( ) ;
		
		var row = Math.floor( index / this._interfaceLayer.getColumns( ) ) ;
		this._mainLayer.rotateCounterClockwise( index + row ) ;
	} ,
	
	_buttonsEnable : function( )
	{
		this._interfaceLayer.unlockButtons( ) ;
	} ,
	
	gameOver : function( )
	{
		var duration = ( new Date( ) - this._startTime ) / 1000 ;
		var message = String( duration ) + " 秒" ;
		
		if( this._gameOverLayer )
			this.addChild( this._gameOverLayer , 10 ) ;
		else
		{
			this._gameOverLayer = new comp.GameOverLayer( cc.color( 255 , 237 , 151 , 150 ) ,
														  cc.director.getWinSize( ).width ,
														  cc.director.getWinSize( ).height ) ;
			
			this._gameOverLayer.setPosition( this._mainLayer.getPosition( ) ) ;
			this._gameOverLayer.retain( ) ;
			this.addChild( this._gameOverLayer , 10 ) ;
		}
		
		this._gameOverLayer._setGameOverMessage( message ) ;
	} ,
	
	onLeave : function( )
	{
		cc.log( "app's onLeaveCallback" ) ;
		cc.director.end( ) ;
	} ,
	
	onTryAgain : function( )
	{
		cc.log( "app's onTryAgainCallback" ) ;
		this._mainLayer.reset( ) ;
		this._initJewels( ) ;
		
		this._interfaceLayer.reset( ) ;
		this._initButtons( ) ;
		
		this._resetTipImage( ) ;
		
		this.removeChild( this._gameOverLayer ) ;
		this._startTime = new Date( ) ;
	} ,
	
    onEnter:function( )
	{
        this._super( ) ;
    } ,
	
	onEnterTransitionDidFinish : function( )
	{
        this._super( ) ;
		
		this._startTime = new Date( ) ;
	} ,
	
	onExitTransitionDidFinish : function( )
	{
        this._super( ) ;
	} ,
	
	onExit : function( )
	{
		cc.log( "app.js's onExit" ) ;
        this._super( ) ;
	}
} ) ;