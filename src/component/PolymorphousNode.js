"use strict" ;

var assert	= chai.assert ;
var util	= gxd.util || { } ;
var comp	= gxd.comp || { } ;

comp.PolymorphousNode = cc.Node.extend(
{
	_stages			: null ,
	_currentStage	: null ,
	_switchAction	: null ,
	
	ctor : function( )
	{
		this._super( ) ;
		this.setAnchorPoint( 0.5 , 0.5 ) ;
		
		this._stages = new util.Dictionary( ) ;
	} ,
	
	free : function( )
	{
		this._stages.free( ) ;
		this._stages = null ;
	} ,
	
	/**
	 * @function
	 * @param		{}	New stage of node.
	 */
	// setStage : function( stage )
	// {
		// this._currentStage = stage ;
		// this._switchStage( stage ) ;
	// } ,
	
	setStage : function( stage , form )
	{
		if( this._stages.hasKey( stage ) )
			this._stages.remove( stage ) ;
		this._stages.add( stage , form ) ;
	} ,
	
	_switchStage : function( stage )
	{
		// virtual function.
	} ,
	
	getStageLength : function( )
	{
		return this._stages.length ;
	}
} ) ;

/**
 * @class
 * @extends	gxd.comp.PolymorphousNode
 */
comp.Button = comp.PolymorphousNode.extend(
/** @lends gxd.comp.Button */
{
	_triggerType	: null ,
	_enable			: null ,
	_touchSensor	: null ,
	_callback		: null ,
	_target			: null ,
	
	/**
	 * @function
	 * @param		{cc.Sprite|cc.SpriteFrame}		nomal
	 * @param		{null|cc.Sprite|cc.SpriteFrame}	selected
	 * @param		{null|cc.Sprite|cc.SpriteFrame}	disable
	 * @param		{null|function}					callback
	 * @param		{null|cc.Node}					target
	 * @param		{null|boolean}					swallow
	 *
	 * @example		new gxd.comp.Button( normal ) ;
	 * @example		new gxd.comp.Button( normal , selected ) ;
	 * @example		new gxd.comp.Button( normal , selected , disable ) ;
	 * @example		new gxd.comp.Button( normal , selected , callback , target , swallow ) ;
	 * @example		new gxd.comp.Button( normal , selected , disable , callback , target , swallow ) ;
	 */
	ctor : function( normal , selected , disable , callback , target , swallow )
	{
		this._super( ) ;
		
		this._currentStage	= comp.Button.STAGE.NORMAL ;
		this._enable		= true ;
		
		/**/
		if( disable && typeof disable === "function" )
		{
			swallow		= target ;
			target		= callback ;
			callback	= disable ;
			disable		= null ;
		}
		/**/
		
		swallow				= util.isNull( swallow ) ? comp.Button.DEFAULT_SWALLOW : swallow ;
		// this._touchSensor	= new comp.TouchSensor( true , this ) ;
		this._touchSensor	= new comp.TouchSensor( swallow , this ) ;
		
		this.setTriggerType( comp.Button.TRIGGER_TYPE.PRESSED ) ;
		
		this.initWithImages( normal , selected , disable ) ;
		this.setCallback( callback , target ) ;
	} ,
	
	/**
	 *
	 */
	free : function( )
	{
		this._triggerType	= null ;
		this._enable		= null ;
	
		this._touchSensor.free( ) ;
		this._touchSensor	= null ;
		
		this._callback		= null ;
		this._target		= null ;
		
		this._super( ) ;
	} ,
	
	initStages : function( )
	{
		for( var stage of argumens )
			this._stages.push( arguments[ i ] ) ;
	} ,
	
	/**
	 * @param	{cc.Sprite}	normal
	 * @param	{cc.Sprite}	selected
	 * @param	{cc.Sprite}	disable
	 */
	initWithImages : function( normal , selected , disable )
	{
		this.setNormalImage( normal ) ;
		this.setSelectedImage( selected ) ;
		this.setDisableImage( disable ) ;
	} ,
	
	/**
	 * @param	{cc.Sprite}	image
	 */
	setNormalImage : function( image )
	{
		assert( util.isNull( image ) || image instanceof cc.Sprite || image instanceof cc.SpriteFrame ,
				"Parameter *image* should be *null*, *cc.Sprite* or *cc.SpriteFrame*." ) ;
		
		var normalSprite = this._stages.getValue( comp.Button.STAGE.NORMAL.toString( ) ) ;
		
		// Current *normal sprite* and *image* are reference to same image.
		if( normalSprite === image )
			return ;
		
		// Remove the original *normal sprite*.
		if( normalSprite )
			this.removeChild( normalSprite ) ;
		
		if( !image )
		{
			this._stages.remove( comp.Button.STAGE.NORMAL.toString( ) ) ;
			return ;
		}
		
		normalSprite = ( image instanceof cc.Sprite ) ? image : new cc.Sprite( image ) ;
		normalSprite.setPosition( normalSprite.width * 0.5 , normalSprite.height * 0.5 ) ;
		this._stages.add( comp.Button.STAGE.NORMAL.toString( ) , normalSprite ) ;
		
		this.setContentSize( normalSprite.getContentSize( ) ) ;
		
		this.addChild( normalSprite ) ;
		
		// this._switchStage( this._currentStage ) ;
	} ,
	
	/**
	 * @return	{cc.Sprite}
	 */
	getNormalImage : function( )
	{
		return this._stages.getValue( comp.Button.STAGE.NORMAL.toString( ) ) ;
	} ,
	
	/**
	 * @param	{cc.Sprite}	image
	 */
	setSelectedImage : function( image )
	{
		assert( util.isNull( image ) || image instanceof cc.Sprite || image instanceof cc.SpriteFrame ,
				"Parameter *image* should be *null*, *cc.Sprite* or *cc.SpriteFrame*." ) ;
		
		var selectedSprite = this._stages.getValue( comp.Button.STAGE.SELECTED.toString( ) ) ;
		
		// Current *selected sprite* and *image* are reference to same image.
		if( selectedSprite === image )
			return ;
		
		// Remove the original *selected sprite*.
		if( selectedSprite )
			this.removeChild( selectedSprite ) ;
		
		if( !image )
		{
			this._stages.remove( comp.Button.STAGE.SELECTED.toString( ) ) ;
			return ;
		}
		
		selectedSprite = ( image instanceof cc.Sprite ) ? image : new cc.Sprite( image ) ;
		selectedSprite.setPosition( selectedSprite.width * 0.5 , selectedSprite.height * 0.5 ) ;
		this._stages.add( comp.Button.STAGE.SELECTED.toString( ) , selectedSprite ) ;
		
		selectedSprite.setVisible( false ) ;
		this.addChild( selectedSprite ) ;
		
		// this._switchStage( this._currentStage ) ;
	} ,
	
	/**
	 * @return	{cc.Sprite}
	 */
	getSelectedImage : function( )
	{
		return this._stages.getValue( comp.Button.STAGE.SELECTED.toString( ) ) ;
	} ,
	
	/**
	 * @param	{cc.Sprite}	image
	 */
	setDisableImage : function( image )
	{
		assert( util.isNull( image ) || image instanceof cc.Sprite || image instanceof cc.SpriteFrame ,
				"Parameter *image* should be *null*, *cc.Sprite* or *cc.SpriteFrame*." ) ;
		
		var disableSprite = this._stages.getValue( comp.Button.STAGE.DISABLE.toString( ) ) ;
		
		if( disableSprite === image )
			return ;
		
		if( disableSprite )
			this.removeChild( disableSprite ) ;
		
		if( !image )
		{
			this._stages.remove( comp.Button.STAGE.DISABLE.toString( ) ) ;
			return ;
		}
		
		disableSprite = ( image instanceof cc.Sprite ) ? image : new cc.Sprite( image ) ;
		disableSprite.setPosition( disableSprite.width * 0.5 , disableSprite.height * 0.5 ) ;
		this._stages.add( comp.Button.STAGE.DISABLE.toString( ) , disableSprite ) ;
		
		disableSprite.setVisible( false ) ;
		this.addChild( disableSprite ) ;
		
		// this._switchStage( this._currentStage ) ;
	} ,
	
	/**
	 * @return	{cc.Sprite}
	 */
	getDisableImage : function( )
	{
		return this._stages.getValue( comp.Button.STAGE.DISABLE.toString( ) ) ;
	} ,
	
	/**
	 * @param	{function}		callback	
	 * @param	{null|cc.Node}	target
	 */
	setCallback : function( callback , target )
	{
		assert( util.isNull( callback ) || cc.isFunction( callback ) ,
				"Parameter *callback* should be *null* or a *function*." ) ;
		
		this._callback = callback ;
		
		if( !util.isNull( target ) )
			this.setTarget( target ) ;
	} ,
	
	/**
	 * @param	{cc.Node}	target
	 */
	setTarget : function( target )
	{
		assert( util.isNull( target ) || target instanceof cc.Node ,
				"Parameter *target* should be instance of *cc.Node*." ) ;
		
		this._target = target ;
	} ,
	
	/**
	 * @param	{boolean}	enable
	 */
	setEnable : function( enable )
	{
		assert.isBoolean( enable ) ;
		
		var stage		= null ;
		this._enable	= enable ;
		
		if( this._enable )
		{
			this._touchSensor.attach( ) ;
			stage = comp.Button.STAGE.NORMAL ;
		}
		else
		{
			this._touchSensor.detach( ) ;
			stage = comp.Button.STAGE.DISABLE ;
		}
		
		this._switchStage( stage ) ;
	} ,
	
	/**
	 * @return	{boolean}
	 */
	isEnable : function( )
	{
		return this._enable ;
	} ,
	
	/**
	 * @param	{Enum}	type
	 */
	setTriggerType : function( type )
	{
		// assert.include( Enum , type ) ;
		this._triggerType = type ;
	} ,
	
	/**
	 * @return	{Enum}
	 */
	getTriggerType : function( )
	{
		return this._triggerType ;
	} ,
	
	/**
	 * @private
	 * @override
	 */
	_switchStage : function( stage )
	{
		if( this._currentStage === stage )
			return ;
		
		var currentSprite = this._stages.getValue( this._currentStage.toString( ) ) ;
		
		if( currentSprite )
			currentSprite.setVisible( false ) ;
		
		if( this._enable )
		{
			var nextSprite = this._stages.getValue( stage.toString( ) ) ;
			
			if( nextSprite )
				nextSprite.setVisible( true ) ;
		}
		else
		{
			var disableSprite ;
			
			if( this._stages.hasKey( comp.Button.STAGE.DISABLE.toString( ) ) )
				disableSprite = this._stages.getValue( comp.Button.STAGE.DISABLE.toString( ) ) ;
			else
				if( this._stages.hasKey( comp.Button.STAGE.NORMAL.toString( ) ) )
					disableSprite = this._stages.getValue( comp.Button.STAGE.NORMAL.toString( ) ) ;
			
			if( disableSprite )
				disableSprite.setVisible( true ) ;
			
		}
		
		this._currentStage	= stage ;
	} ,
	
	/**
	 * @private
	 * @param	{cc.Touch}	touch	
	 * @param	{cc.Event}	event	
	 * @return	{boolean}	
	 */
	_onTouchBegan : function( touch , event )
	{
		if( !this._enable )
			return false ;
		
		var isTouchInside = this._touchSensor.isTouchInside( touch , event ) ;
		
		if( isTouchInside )
		{
			this._switchStage( comp.Button.STAGE.SELECTED ) ;
			
			if( this._callback && this._triggerType === comp.Button.TRIGGER_TYPE.PRESSED )
			{
				if( this._target )
					this._callback.call( this._target ) ;
				else
					this._callback( ) ;
			}
		}
		
		return isTouchInside ;
	} ,
	
	/**
	 * @private
	 * @param	{cc.Touch}	touch	
	 * @param	{cc.Event}	event	
	 */
	_onTouchMoved : function( touch , event )
	{
		var isTouchInside = this._touchSensor.isTouchInside( touch , event ) ;
		
		if( isTouchInside )
			this._switchStage( comp.Button.STAGE.SELECTED ) ;
		else
			this._switchStage( comp.Button.STAGE.NORMAL ) ;
	} ,
	
	/**
	 * @private
	 * @param	{cc.Touch}	touch	
	 * @param	{cc.Event}	event	
	 */
	_onTouchEnded : function( touch , event )
	{
		this._switchStage( comp.Button.STAGE.NORMAL ) ;
		var isTouchInside = this._touchSensor.isTouchInside( touch , event ) ;
		
		if( !isTouchInside )
			return ;
		
		if( this._callback && this._triggerType === comp.Button.TRIGGER_TYPE.RELEASED )
		{
			if( this._target )
				this._callback.call( this._target ) ;
			else
				this._callback( ) ;
		}
	} ,
	
	/**
	 * @private
	 * @param	{cc.Touch}	touch	
	 * @param	{cc.Event}	event	
	 */
	_onTouchCancelled : function( touch , event )
	{
		this._switchStage( comp.Button.STAGE.NORMAL ) ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
		
		// Attach the touch sensor on button.
		this._touchSensor.attach( ) ;
	} ,
	
	onExitTransitionDidFinish : function( )
	{
		this._super( ) ;
		
		// Detach the touch sensor on button.
		this._touchSensor.detach( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
	}
} ) ;

Object.defineProperty( comp.Button , "DEFAULT_SWALLOW" ,
{
	value		: true ,
	enumerable	: true
} ) ;

/**
 * @enum	{Enum}	Stage of button.
 */
comp.Button.STAGE = new Enum(
{
	NORMAL			: 0 ,
	SELECTED		: 1 ,
	DISABLE			: 2
} ,
{
	name :
	{
		this		: "Stage of Button" ,
		NORMAL		: "Normal" ,
		SELECTED	: "Selected" ,
		DISABLE		: "Disable"
	}
} ) ;

/**
 * @enum	{Enum}	Stage of button.
 */
comp.Button.TRIGGER_TYPE = new Enum(
{
	PRESSED			: 0 ,
	RELEASED		: 1
} ,
{
	name :
	{
		this		: "Trigger type of button" ,
		PRESSED		: "Pressed" ,
		RELEASED	: "Released"
	}
} ) ;