"use strict" ;

var util = gxd.util || { } ;

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