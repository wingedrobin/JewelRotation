/**
 *
 * @file
 * @author	Yong-Quan Chen
 * @copyright
 * @license
 */

"use strict" ;

var assert	= chai.assert ;
var comp	= gxd.comp || { } ;

comp.InterfaceLayer = comp.GridPage.extend(
{
	ctor : function( width , height , rows , columns )
	{
		this._super( width , height , rows , columns ) ;
	} ,
	
	lockButtons : function( )
	{
		for( var i = 0 ; i < this._rows ; i ++ )
			for( var j = 0 ; j < this._columns ; j ++ )
				this._gridNodes[ i ][ j ].setEnable( false ) ;
	} ,
	
	unlockButtons : function( )
	{
		for( var i = 0 ; i < this._rows ; i ++ )
			for( var j = 0 ; j < this._columns ; j ++ )
				this._gridNodes[ i ][ j ].setEnable( true ) ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	onExitTransitionDidStart : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
	}
} ) ;