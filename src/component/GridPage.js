"use strict" ;

var assert	= chai.assert ;
var comp	= gxd.comp || { } ;

comp.GridPage = cc.Layer.extend(
{
	_rows			: null ,
	_columns		: null ,
	_gridSize		: null ,
	_gridOriginals	: null ,
	_gridNodes		: null ,
	_drawNode		: null ,
	
	ctor : function( width , height , rows , columns )
	{
		assert.isNumber( width ) ;
		assert.isNumber( height ) ;
		assert.isNumber( rows ) ;
		assert.isNumber( columns ) ;
		
		this._super( ) ;
		
		this.setContentSize( width , height ) ;
		
		this._rows		= rows ;
		this._columns	= columns ;
		this._gridOriginals	= [ ] ;
		
		// this._gridNodes = [ ] ;
		
		// for( var i = 0 ; i < this._rows ; i ++ )
			// this._gridNodes[ i ] = [ ] ;
		this.reset( ) ;
		
		this._calcGridSize( ) ;
		this._calcGridOriginals( ) ;
	} ,
	
	free : function( )
	{
		if( this._drawNode )
		{
			this._drawNode.clean( ) ;
			this._drawNode.release( ) ;
		}
		
		this._gridNodes.length	= 0 ;
		this._gridNodes			= null ;
	} ,
	
	reset : function( )
	{
		if( !this._gridNodes )
		{
			this._gridNodes = [ ] ;
			
			for( var i = 0 ; i < this._rows ; i ++ )
			this._gridNodes[ i ] = [ ] ;
		}
		else
		{
			for( var i = 0 ; i < this._rows ; i ++ )
			{
				for( var j = 0 ; j < this._columns ; j ++ )
				{
					if( this._gridNodes[ i ][ j ] )
					{
						this.removeChild( this._gridNodes[ i ][ j ] , true ) ;
						this._gridNodes[ i ][ j ] = null ;
					}
				}
			}
		}
	} ,
	
	_calcGridSize : function( )
	{
		this._gridSize = cc.size( this.width / this._columns , this.height / this._rows ) ;
	} ,
	
	getRows : function( )
	{
		return this._rows ;
	} ,
	
	getColumns : function( )
	{
		return this._columns ;
	} ,
	
	getGridSize : function( )
	{
		return this._gridSize ;
	} ,
	
	_calcGridOriginals : function( )
	{
		for( var i = 0 ; i < this._rows ; i ++ )
		{
			this._gridOriginals[ i ] = [ ] ;
			
			for( var j = 0 ; j < this._columns ; j ++ )
			{
				this._gridOriginals[ i ][ j ] = cc.p( j * this._gridSize.width ,
													  i * this._gridSize.height ) ;
			}
		}
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	setGridLineVisible : function( visible )
	{
		assert.isBoolean( visible ) ;
		
		if( visible )
		{
			if( !this._drawNode )
			{
				this._drawNode = new cc.DrawNode( ) ;
				this._drawNode.retain( ) ;
			}
			
			this.addChild( this._drawNode ) ;
			this._drawGridLine( ) ;
		}
		else
		{
			if( !this._drawNode )
			{
				this._drawNode.clean( ) ;
				this.removeChild( this._drawNode ) ;
			}
		}
	} ,
	
	_drawGridLine : function( )
	{
		for( var i = 1 ; i < this._rows ; i ++ )
		{
			var to = cc.p( this._gridOriginals[ i ][ this._columns - 1 ].x + this._gridSize.width ,
						   this._gridOriginals[ i ][ this._columns - 1 ].y ) ;
			
			this._drawNode.drawSegment( this._gridOriginals[ i ][ 0 ] ,
										to ,
										comp.GridPage.GRID_LINE_WIDTH ,
										comp.GridPage.GRID_LINE_COLOR ) ;
		}
		
		for( var j = 1 ; j < this._columns ; j ++ )
		{
			var to = cc.p( this._gridOriginals[ this._rows - 1 ][ j ].x ,
						   this._gridOriginals[ this._rows - 1 ][ j ].y + this._gridSize.height ) ;
			
			this._drawNode.drawSegment( this._gridOriginals[ 0 ][ j ] ,
										to ,
										comp.GridPage.GRID_LINE_WIDTH ,
										comp.GridPage.GRID_LINE_COLOR ) ;
		}
	} ,
	
	setGridNodeAtIndex : function( node , index )
	{
		assert.instanceOf( node , cc.Node ) ;
		assert.isNumber( index ) ;
		
		var row		= Math.floor( index / this._columns ) ;
		var column	= index % this._columns ;
		
		node.setPosition( this._gridOriginals[ row ][ column ].x + this._gridSize.width * 0.5 ,
						  this._gridOriginals[ row ][ column ].y + this._gridSize.height * 0.5 ) ;
		this._gridNodes[ row ][ column ] = node ;
		this.addChild( this._gridNodes[ row ][ column ] ) ;
	} ,
	
	setGridNodeAtRowColumn : function( node , row , column )
	{
		assert.instanceOf( node , cc.Node ) ;
		assert.isNumber( row ) ;
		assert.isNumber( column ) ;
		
		node.setPosition( this._gridOriginals[ row ][ column ].x + this._gridSize.width * 0.5 ,
						  this._gridOriginals[ row ][ column ].y + this._gridSize.height * 0.5 ) ;
		this._gridNodes[ row ][ column ] = node ;
		this.addChild( this._gridNodes[ row ][ column ] ) ;
	} ,
	
	getGridNodeAtIndex : function( index )
	{
		assert.isNumber( index ) ;
		
		var row		= Math.floor( index / this._columns ) ;
		var column	= index % this._columns ;
		
		return this._gridNodes[ row ][ column ] ;
	} ,
	
	getGridNodeAtRowColumn : function( row , column )
	{
		assert.isNumber( row ) ;
		assert.isNumber( column ) ;
		
		this._gridNodes[ row ][ column ] ;
	} ,
	
	getGridNodesOfRow : function( row )
	{
		assert.isNumber( row ) ;
		
		var nodes = [ ] ;
		
		for( var i = 0 ; i < this._columns ; i ++ )
			nodes.push( this._gridNodes[ row ][ i ] ) ;
		
		return nodes ;
	} ,
	
	getGridNodesOfColumn : function( column )
	{
		assert.isNumber( column ) ;
		
		var nodes = [ ] ;
		
		for( var i = 0 ; i < this._rows ; i ++ )
			nodes.push( this._gridNodes[ i ][ column ] ) ;
		
		return nodes ;
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

Object.defineProperty( comp.GridPage , "GRID_LINE_WIDTH" ,
{
	value		: 3 ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.GridPage , "GRID_LINE_COLOR" ,
{
	value		: cc.color( "#ADADAD" ) ,
	enumerable	: true
} ) ;