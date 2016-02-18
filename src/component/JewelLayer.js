"use strict" ;

var assert	= chai.assert ;
var comp	= gxd.comp || { } ;

comp.JewelLayer = comp.GridPage.extend(
{
	_columnColors		: null ,
	_completeColumns	: null ,
	
	ctor : function( width , height , rows , columns )
	{
		this._super( width , height , rows , columns ) ;
		
		this.reset( ) ;
	} ,
	
	free : function( )
	{
		this._columnColors.length		= 0 ;
		this._columnColors				= null ;
		
		this._completeColumns.length	= 0 ;
		this._completeColumns			= null ;
		
		this._super( ) ;
	} ,
	
	reset : function( )
	{
		this._super( ) ;
		
		this._columnColors = null ;
		this._completeColumns = new Array( this._columns ).fill( false ) ;
	} ,
	
	setColorOfColumns : function( colors )
	{
		assert.isArray( colors ) ;
		
		this._columnColors = colors ;
	} ,
	
	rotateClockwise : function( index )
	{
		assert.isNumber( index ) ;
		
		var row				= Math.floor( index / this._columns ) ;
		var column			= index % this._columns ;
		var tempNode		= null ;
		var tempPosition	= this._gridNodes[ row ][ column ].getPosition( ) ;
		
		tempNode = this._gridNodes[ row + 1 ][ column ] ;
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempNode.getPosition( ) ) ) ;
		this._gridNodes[ row + 1 ][ column ] = this._gridNodes[ row ][ column ] ;
		this._gridNodes[ row ][ column ] = tempNode ;
		
		tempNode = this._gridNodes[ row + 1 ][ column + 1 ] ;
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempNode.getPosition( ) ) ) ;
		this._gridNodes[ row + 1 ][ column + 1 ] = this._gridNodes[ row ][ column ] ;
		this._gridNodes[ row ][ column ] = tempNode ;
		
		tempNode = this._gridNodes[ row ][ column + 1 ] ;
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempNode.getPosition( ) ) ) ;
		this._gridNodes[ row ][ column + 1 ] = this._gridNodes[ row ][ column ] ;
		this._gridNodes[ row ][ column ] = tempNode ;
		
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempPosition ) ) ;
		
		this.scheduleOnce( this._onMoveActionDidFinishCallback.bind( this , column ) , comp.JewelLayer.ROTATE_DURATION ) ;
	} ,
	
	rotateCounterClockwise : function( index )
	{
		assert.isNumber( index ) ;
		
		var row				= Math.floor( index / this._columns ) ;
		var column			= index % this._columns ;
		var tempNode		= null ;
		var tempPosition	= this._gridNodes[ row ][ column ].getPosition( ) ;
		
		tempNode = this._gridNodes[ row ][ column + 1 ] ;
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempNode.getPosition( ) ) ) ;
		this._gridNodes[ row ][ column + 1 ] = this._gridNodes[ row ][ column ] ;
		this._gridNodes[ row ][ column ] = tempNode ;
		
		tempNode = this._gridNodes[ row + 1 ][ column + 1 ] ;
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempNode.getPosition( ) ) ) ;
		this._gridNodes[ row + 1 ][ column + 1 ] = this._gridNodes[ row ][ column ] ;
		this._gridNodes[ row ][ column ] = tempNode ;
		
		tempNode = this._gridNodes[ row + 1 ][ column ] ;
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempNode.getPosition( ) ) ) ;
		this._gridNodes[ row + 1 ][ column ] = this._gridNodes[ row ][ column ] ;
		this._gridNodes[ row ][ column ] = tempNode ;
		
		this._gridNodes[ row ][ column ].runAction( cc.moveTo( comp.JewelLayer.ROTATE_DURATION , tempPosition ) ) ;
		
		this.scheduleOnce( this._onMoveActionDidFinishCallback.bind( this , column ) , comp.JewelLayer.ROTATE_DURATION ) ;
	} ,
	
	_onMoveActionDidFinishCallback : function( column )
	{
		var event = new cc.EventCustom( "JEWEL_MOVED" ) ;
		cc.eventManager.dispatchEvent( event ) ;
		
		this._scanColumn( column ) ;
		this._scanColumn( column + 1 ) ;
	} ,
	
	_scanColumn : function( column )
	{
		for( var i = 0 ; i < this._rows ; i ++ )
		{
			if( this._gridNodes[ i ][ column ].getTag( ) !== this._columnColors[ column ] )
			{
				this._completeColumns[ column ] = false ;
				return ;
			}
		}
		
		this._completeColumns[ column ] = true ;
		
		if( this._isAllColumnsComplete( ) )
			this.getParent( ).gameOver( ) ;
	} ,
	
	_isAllColumnsComplete : function( )
	{
		for( var i = 0 ; i < this._completeColumns.length ; i ++ )
		{
			if( !this._completeColumns[ i ] )
				return false ;
		}
		
		return true ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
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

Object.defineProperty( comp.JewelLayer , "ROTATE_DURATION" ,
{
	value		: 0.2 ,
	enumerable	: true
} ) ;