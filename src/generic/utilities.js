"use strict" ;

var assert	= chai.assert ;
var util	= gxd.util || { } ;

/**
 * 
 * @function
 * @param		{object}	
 * @return		{boolean}
 */
util.isNull = function( value )
{
	return value ? false : true ;
} ;

/**
 *
 * @function	
 * @param		{number}	Lower bound.
 * @param		{number}	Upper bound.
 * @return		{number}	Random number between min and max.
 * @example		util.randomBetween( 5 , 10 ) ;
 */
util.randomBetween = function( min , max )
{
	return Math.random( ) * ( max - min ) + min ;
} ;

/**
 * Get a random boolean value.
 * @function	
 * @return		{boolean}
 */
util.randomBoolean = function( )
{
	return Math.round( Math.random( ) ) === 1 ;
} ;

/**
 * @function
 * @param		
 */
util.shuffle = function( source )
{
	var i		= source.length ;
	var random	= null ;
	var temp	= null ;
	
	while( i )
	{
		random				= Math.floor( Math.random( ) * i ) ;
		temp				= source[ -- i ] ;
		source[ i ]			= source[ random ] ;
		source[ random ]	= temp ;
	}
	
	return source ;
} ;

/**
 * @class
 * @extends	cc.Class
 */
util.Dictionary = cc.Class.extend(
/** @lends gxd.util.Dictionary */
{
	/**
	 * @param	{object}
	 */
	ctor : function( value )
	{
		for( var key in value )
		{
			if( typeof value[ key ] !== "function" )
				this[ key ] = value[ key ] ;
		}
	} ,
	
	/**
	 *
	 */
	free : function( )
	{
		this.clean( ) ;
	} ,
	
	/**
	 * @param	{string}	key
	 * @param	{object}	value
	 */
	add : function( key , value )
	{
		assert.isString( key ) ;
		assert.notOk( this.hasKey( key ) , key + " is all ready exist." ) ;
		
		this[ key ] = value ;
	} ,
	
	/**
	 * @param	{string}	key
	 */
	remove : function( key )
	{
		assert.isString( key ) ;
		assert.ok( this.hasKey( key ) , key + " is not exist." ) ;
		
		this[ key ] = null ;
		delete this[ key ] ;
	} ,
	
	/**
	 * @param	{string}	key
	 * @return	{boolean}
	 */
	hasKey : function( key )
	{
		assert.isString( key ) ;
		
		return this.hasOwnProperty( key ) ;
	} ,
	
	/**
	 * @param	{string}	key
	 * @return	{boolean}
	 */
	hasValue : function( key )
	{
		assert.isString( key ) ;
		
		return this[ key ] ? true : false ;
	} ,
	
	/**
	 * @return	{object}
	 */
	getValue : function( key )
	{
		assert.isString( key ) ;
		// assert.ok( this.hasKey( key ) , key + " is not exist." ) ;
		
		return this[ key ] ;
	} ,
	
	/**
	 * @return	{array}
	 */
	getValues : function( )
	{
		var values = [ ] ;
		
		for( var key in this )
		{
			if( key === "__instanceId" )
				continue ;
			
			if( typeof this[ key ] !== "function" )
				values.push( this[ key ] ) ;
		}
		
		return values ;
	} ,
	
	/**
	 * @
	 */
	clone : function( )
	{
		var copy = new util.Dictionary( ) ;
		
		for( var key in this )
			copy[ key ] = this[ key ] ;
		
		return copy ;
	} ,
	
	/**
	 * @
	 */
	clean : function( )
	{
		for( var key in this )
		{
			this.remove( key ) ;
		}
	}
} ) ;