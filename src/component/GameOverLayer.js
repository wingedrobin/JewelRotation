"use strict" ;

var comp = gxd.comp || { } ;

comp.GameOverLayer = cc.LayerColor.extend(
{
	_messageLabel	: null ,
	_menu			: null ,
	
	ctor : function( color , width , height )
	{
		this._super( color , width , height ) ;
		this._initMessageLabel( ) ;
		this._initMenu( ) ;
	} ,
	
	_initMessageLabel : function( )
	{
		this._messageLabel = new cc.LabelTTF( ) ;
		this._messageLabel.setFontName( "Arial" ) ;
		this._messageLabel.setFontSize( 100 ) ;
		this._messageLabel.setFontFillColor( cc.color( 143 , 121 , 100 ) ) ;
		this._messageLabel.setPosition( this.getContentSize( ).width * 0.5 ,
										this.getContentSize( ).height * 0.5 ) ;
		
		this.addChild( this._messageLabel ) ;
	} ,
	
	_initMenu : function( )
	{
		var leaveButton		= new cc.MenuItemSprite( new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( "leave_normal.png" ) ) ,
													 new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( "leave_selected.png" ) ) ,
													 this._onLeaveCallback ,
													 this ) ;
		
		var tryAgainButton	= new cc.MenuItemSprite( new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( "try_again_normal.png" ) ) ,
													 new cc.Sprite( cc.spriteFrameCache.getSpriteFrame( "try_again_selected.png" ) ) ,
													 this._onTryAgainCallback ,
													 this ) ;
		
		this._menu			= new cc.Menu( leaveButton , tryAgainButton ) ;
		
		this._menu.alignItemsHorizontallyWithPadding( 50 ) ;
		this._menu.setPosition( this.getContentSize( ).width * 0.5 ,
								this.getContentSize( ).height * 0.3 ) ;
		
		this.addChild( this._menu ) ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	setGameCompleteState : function( state )
	{
		var message = state ? comp.GameOverLayer.completeMessage : comp.GameOverLayer.FailedMessage ;
		
		this._setGameOverMessage( message ) ;
	} ,
	
	_setGameOverMessage : function( message )
	{
		this._messageLabel.setString( message ) ;
	} ,
	
	_onLeaveCallback : function( )
	{
		cc.log( "onLeaveCallback" ) ;
		this.getParent( ).onLeave( ) ;
	} ,
	
	_onTryAgainCallback : function( )
	{
		cc.log( "onTryAgainCallback" ) ;
		this.getParent( ).onTryAgain( ) ;
	} ,
	
	onExitTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
	}
} ) ;

Object.defineProperty( comp.GameOverLayer , "completeMessage" ,
{
	value		: "You Win!" ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.GameOverLayer , "FailedMessage" ,
{
	value		: "Game Over" ,
	enumerable	: true
} ) ;