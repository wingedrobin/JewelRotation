"use strict" ;

var assert	= chai.assert ;
var comp	= gxd.comp || { } ;

/**
 * @class
 * @abstract
 * @extend		cc.Class
 */
comp.ControlSignalReceiver = cc.Class.extend(
/** @lends gxd.comp.ControlSignalReceiver */
{
	_attached	: null ,
	_listener	: null ,
	_delegate	: null ,
	
	/**
	 * @function
	 * @param		{cc.Node||null}	delegate
	 */
	ctor : function( delegate )
	{
		this._attached = false ;
		
		if( delegate )
			this.setDelegate( delegate ) ;
	} ,
	
	free : function( )
	{
		this._delegate = null ;
	} ,
	
	/**
	 * Initiate the event listener. Please override after extends.
	 * @abstract
	 * @private
	 */
	_initListener : function( )
	{
	} ,
	
	/**
	 * @param	{cc.Node}	delegate
	 */
	setDelegate : function( delegate )
	{
		// assert.isTrue( util.isNull( this._delegate ) ,
					   // "Delegate of touch sensor can only set once." ) ;
		assert.isNull( this._delegate ) ;
		assert.instanceOf( delegate , cc.Node ) ;
		
		this._delegate = delegate ;
		this._initListener( ) ;
	} ,
	
	/**
	 * @return	{cc.Node}
	 */
	getDelegate : function( )
	{
		return this._delegate ;
	} ,
	
	/**
	 * attach on delegate.
	 */
	attach : function( )
	{
		assert.isNotNull( this._listener ) ;
		assert.isNotNull( this._delegate ) ;
		assert.isFalse( this._attached , "Touch Sensor is already attached on delegate." ) ;
		
		cc.eventManager.addListener( this._listener , this._delegate ) ;
		this._attached = true ;
	} ,
	
	/**
	 *
	 * @return	{boolean}
	 */
	isAttached : function( )
	{
		return this._attached ;
	} ,
	
	/**
	 * 
	 */
	detach : function( )
	{
		assert.isNotNull( this._listener ) ;
		
		cc.eventManager.removeListener( this._listener ) ;
		this._attached = false ;
	}
} ) ;

comp.TouchDelegate = cc.Class.extend(
/** @lends gxd.comp.TouchDelegate */
{
	/**
	 * @param	{cc.Touch}	touch
	 * @param	{cc.Event}	event
	 */
	_onTouchBegan : function( touch , event ) { } ,
	
	/**
	 * @param	{cc.Touch}	touch
	 * @param	{cc.Event}	event
	 */
	_onTouchMoved : function( touch , event ) { } ,
	
	/**
	 * @param	{cc.Touch}	touch
	 * @param	{cc.Event}	event
	 */
	_onTouchEnded : function( touch , event ) { } ,
	
	/**
	 * @param	{cc.Touch}	touch
	 * @param	{cc.Event}	event
	 */
	_onTouchCancelled : function( touch , evnet ) {	}
} ) ;

/**
 * @class
 * @extends cc.Class
 */
comp.TouchSensor = comp.ControlSignalReceiver.extend(
/** @lends gxd.comp.TouchSensor */
{
	_swallowed	: null ,
	
	/**
	 * @param	{null|cc.Node}	delegate
	 * @param	{null|boolean}	swallowed
	 *
	 * @example	new gxd.comp.TouchSensor( ) ;
	 * @example	new gxd.comp.TouchSensor( delegate ) ;
	 * @example	new gxd.comp.TouchSensor( swallowed ) ;
	 * @example	new gxd.comp.TouchSensor( delegate , swallowed ) ;
	 */
	ctor : function( delegate , swallowed )
	{
		// If there has only one argument which is boolean type.
		if( arguments.length === 1 &&
			typeof delegate === "boolean" )
		{
			// Set the boolean value from delegate to swallowed.
			swallowed	= delegate ;
			
			// Set delegate as null.
			delegate	= null ;
		}
		// No/two argument or one argument but not boolean type.
		else
		{
			// Set swallowed as argument or default.
			swallowed = swallowed ? swallowed : comp.TouchSensor.DEFAULT_SWALLOW_TOUCHES ;
		}
		
		assert.isBoolean( swallowed ) ;
		
		this._swallowed = swallowed ;
		this._super( delegate ) ;
	} ,
	
	/**
	 * 
	 */
	free : function( )
	{
		this.detach( ) ;
		
		this._listener.release( ) ;
		this._listener	= null ;
		
		this._super( ) ;
	} ,
	
	/**
	 * @private
	 * @override
	 */
	_initListener : function( )
	{
		assert.isBoolean( this._swallowed ) ;
		assert.isNotNull( this._delegate ) ;
		
		var delegate			= this._delegate ;
		var onTouchBegan		= delegate._onTouchBegan ? delegate._onTouchBegan.bind( delegate ) : null ;
		var onTouchMoved		= delegate._onTouchMoved ? delegate._onTouchMoved.bind( delegate ) : null ;
		var onTouchEnded		= delegate._onTouchEnded ? delegate._onTouchEnded.bind( delegate ) : null ;
		var onTouchCancelled	= delegate._onTouchCancelled ? delegate._onTouchCancelled.bind( delegate ) : null ;
		
		this._listener			= cc.EventListener.create(
		{
			event				: cc.EventListener.TOUCH_ONE_BY_ONE ,
			swallowTouches		: this._swallowed ,
			onTouchBegan		: onTouchBegan ,
			onTouchMoved		: onTouchMoved ,
			onTouchEnded		: onTouchEnded ,
			onTouchCancelled	: onTouchCancelled
		} ) ;
		
		this._listener.retain( ) ;
	} ,
	
	/**
	 * @return	{boolean}
	 */
	isSwallowed : function( )
	{
		return this._swallowed ;
	} ,
	
	/**
	 * @param	{cc.Touch}	touch
	 * @param	{cc.Event}	event
	 */
	isTouchInside : function( touch , event )
	{
		var target			= event.getCurrentTarget( ) ;
		var locationInNode	= target.convertToNodeSpace( touch.getLocation( ) ) ;
		var targetSize		= target.getContentSize( ) ;
		var targetRect		= cc.rect( 0 , 0 , targetSize.width , targetSize.height ) ;
		
		return cc.rectContainsPoint( targetRect , locationInNode ) ;
	}
} ) ;

Object.defineProperty( comp.TouchSensor , "DEFAULT_SWALLOW_TOUCHES" ,
{
	value		: true ,
	enumerable	: true
} ) ;

comp.KeyboardEventDelegate = cc.Class.extend(
{
	/**
	 * @param	{}	keyCode
	 * @param	{cc.Event}	event
	 */
	_onKeyPressed : function( keyCode, event ) { } ,
	
	/**
	 * @param	{}	keyCode
	 * @param	{cc.Event}	event
	 */
	_onKeyReleased : function( keyCode, event ) { }
} ) ;

/**
 * @class
 * @extends	gxd.comp.ControlSignalReceiver
 */
comp.KeyboardEventReceiver = comp.ControlSignalReceiver.extend(
/** @lends gxd.comp.KeyboardEventReceiver */
{
	ctor : function( delegate )
	{
		this._super( delegate ) ;
	} ,
	
	free : function( )
	{
		this.detach( ) ;
		
		this._listener.release( ) ;
		this._listener = null ;
		
		this._super( ) ;
	} ,
	
	/**
	 * Initiate the keyboard event listener.
	 * @private
	 * @override
	 */
	_initListener : function( )
	{
		assert.isNotNull( this._delegate ) ;
		
		var delegate		= this._delegate ;
		var onKeyPressed	= delegate._onKeyPressed ? delegate._onKeyPressed : null ;
		var onKeyReleased	= delegate._onKeyReleased ? delegate._onKeyReleased : null ;
		
		this._listener = cc.EventListener.create(
		{
			event			: cc.EventListener.KEYBOARD ,
			onKeyPressed	: onKeyPressed.bind( delegate ) ,
			onKeyReleased	: onKeyReleased.bind( delegate ) ,
		} ) ;
		
		this._listener.retain( ) ;
	}
} ) ;

comp.MouseEventDelegate = cc.Class.extend(
/** @lends gxd.comp.MouseEventDelegate */
{
	/**
	 * @param	{cc.Event}	event
	 */
	_onMouseMove : function( event ) { } ,
	
	/**
	 * @param	{cc.Event}	event
	 */
	_onMouseUp : function( event ) { } ,
	
	/**
	 * @param	{cc.Event}	event
	 */
	_onMouseDown : function( event ) { } ,
	
	/**
	 * @param	{cc.Event}	event
	 */
	_onMouseScroll : function( event ) { }
} ) ;

/**
 * @class
 * @extends	gxd.comp.ControlSignalReceiver
 */
comp.MouseEventReceiver = comp.ControlSignalReceiver.extend(
/** @lends gxd.comp.MouseEventReceiver */
{
	ctor : function( delegate )
	{
		this._super( delegate ) ;
	} ,
	
	free : function( )
	{
		this.detach( ) ;
		
		this._listener.release( ) ;
		this._listener = null ;
		
		this._super( ) ;
	} ,
	
	/**
	 * Initiate the mouse event listener.
	 * @private
	 * @override
	 */
	_initListener : function( )
	{
		assert.isNotNull( this._delegate ) ;
			
		var delegate		= this._delegate ;
		var onMouseMove		= delegate._onMouseMove ? delegate._onMouseMove : null ;
		var onMouseUp		= delegate._onMouseUp ? delegate._onMouseUp : null ;
		var onMouseDown		= delegate._onMouseDown ? delegate._onMouseDown : null ;
		var onMouseScroll	= delegate._onMouseScroll ? delegate._onMouseScroll : null ;
			
		this._listener = cc.EventListener.create(
		{
			event			: cc.EventListener.MOUSE,
			onMouseMove		: onMouseMove.bind( delegate ) ,
			onMouseUp		: onMouseUp.bind( delegate ) ,
			onMouseDown		: onMouseDown.bind( delegate ) ,
			onMouseScroll	: onMouseScroll.bind( delegate )
		} ) ;
		
		this._listener.retain( ) ;
	}
} ) ;

comp.AccelerometerDelegate = cc.Class.extend(
{
	/**
	 * @param	{}	acc
	 * @param	{cc.Event}	event
	 */
	_callback : function( acc , event ) { }
} ) ;

/**
 * @class
 * @extend	gxd.comp.ControlSignalReceiver
 */
comp.AccelerometerSensor = comp.ControlSignalReceiver.extend(
/** @lends gxd.comp.AccelerometerSensor */
{
	ctor : function( )
	{
		this._super( ) ;
	} ,
	
	free : function( )
	{
		this.detach( ) ;
		
		this._listener.release( ) ;
		this._listener = null ;
		
		this._super( ) ;
	} ,
	
	/**
	 * @private
	 * @override
	 */
	_initListener : function( )
	{
		assert.isNotNull( this._delegate ) ;
			
		var delegate		= this._delegate ;
		var callback		= delegate._callback ? delegate._callback : null ;
			
		this._listener = cc.EventListener.create(
		{
			event			: cc.EventListener.ACCELERATION ,
			callback		: callback.bind( delegate )
		} ) ;
		
		this._listener.retain( ) ;
	}
} ) ;