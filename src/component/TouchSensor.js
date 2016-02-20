"using strict"

var assert	= chai.assert || { } ;
var comp	= gxd.comp || { } ;
var util	= gxd.util || { } ;

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
comp.TouchSensor = cc.Class.extend(
/** @lends gxd.comp.TouchSensor */
{
	_swallowed	: null ,
	_attached	: null ,
	_listener	: null ,
	_delegate	: null ,
	
	/**
	 * @param	{null|boolean}	swallow
	 * @param	{null|cc.Node}	delegate
	 *
	 * @example	new gxd.comp.TouchSensor( ) ;
	 * @example	new gxd.comp.TouchSensor( swallow ) ;
	 * @example	new gxd.comp.TouchSensor( delegate ) ;
	 * @example	new gxd.comp.TouchSensor( swallow , delegate ) ;
	 */
	ctor : function( swallow , delegate )
	{
		// If there has no argument.
		if( arguments.length === 0 )
		{
			// Set the _swallowed as default.
			this._swallowed = comp.TouchSensor.DEFAULT_SWALLOW_TOUCHES ;
		}
		// If there has one argument.
		else if( arguments.length === 1 )
		{
			if( typeof swallow === "boolean" )
				this._swallowed = swallow ;
			else if( swallow instanceof cc.Node )
				this.setDelegate( swallow ) ;
			else
				// throw new Errow( "Wrong type of parameter swallow." ) ;
				assert.fail( swallow ,
							 typeof swallow === "boolean" || swallow instanceof cc.Node ,
							 "Wrong type of parameter swallow." ) ;
		}
		// Has at least two arguments.
		else
		{
			assert.isBoolean( swallow ) ;
			assert.instanceOf( delegate , cc.Node ) ;
			
			this._swallowed	= swallow ;
			this.setDelegate( delegate ) ;
		}
		
		this._attached = false ;
	} ,
	
	/**
	 * 
	 */
	free : function( )
	{
		this.detach( ) ;
		this._listener.release( ) ;
		this._listener	= null ;
		
		this._delegate	= null ;
	} ,
	
	/**
	 * @private
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
	 */
	detach : function( )
	{
		assert.isNotNull( this._listener ) ;
		
		cc.eventManager.removeListener( this._listener ) ;
		this._attached = false ;
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