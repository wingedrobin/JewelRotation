/**
 *
 * @file
 * @author	Yong-Quan Chen
 * @license
 */
 
"use strict" ;

// var assert	= chai.assert ;
var comp	= gxd.comp || { } ;

/**
 * @class
 * @extends	cc.LayerColor
 * 
 */
comp.TouchBlockedLayer = cc.LayerColor.extend(
/** @lends gxd.comp.TouchBlockedLayer */
{
	_touchSensor	: null ,
	
	/**
	 *
	 * @function
	 * @param		{cc.color}	color
	 * @param		{number}	width
	 * @param		{number}	height
	 */
	ctor : function( color , width , height )
	{
		this._super( color , width , height ) ;
		
		this._touchSensor = new comp.TouchSensor( this , true ) ;
	} ,
	
	/**
	 *
	 * @function
	 */
	free : function( )
	{
		this._touchSensor.free( ) ;
		this._touchSensor = null ;
	} ,
	
	/**
	 *
	 * @function
	 * @param		{node||null}	node
	 */
	show : function( node )
	{
		var parent = cc.director.getRunningScene( ) ;
		
		if( node )
			this.addChild( node ) ;
		
		this.setParent( parent ) ;
	} ,
	
	/**
	 *
	 * @function
	 */
	hide :function( )
	{
		this.removeFromParent( ) ;
		this.removeAllChildren( ) ;
	} ,
	
	/**
	 *
	 * @private
	 * @param		{cc.touch}	touch
	 * @param		{cc.event}	event
	 * @return		{boolean}
	 */
	_onTouchBegan : function( touch , event )
	{
		// Swallow the touch event, so return always be true.
		return true ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
		this._touchSensor.attach( ) ;
	} ,
	
	onExitTransitionDidStart : function( )
	{
		this._super( ) ;
		this._touchSensor.detach( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
	}
} ) ;