"use strict" ;

var assert	= chai.assert ;
var util	= gxd.util || { } ;

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

/*
var a = {
	name : "abc" ,
  age : 10
} ;

console.log( a.name ) ;
console.log( a["name"] ) ;
console.log( a.age ) ;
console.log( a["age"] ) ;

var foo = function( n , a )
{
	this.name = n ;
  this["age"] = a ;
} ;

var obj = new foo( "abc" , 10 ) ;

console.log( obj.name ) ;
console.log( obj["name"] ) ;
console.log( obj.age ) ;
console.log( obj["age"] ) ;
*/