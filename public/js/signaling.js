
(function()
{
	Signaling = function( httpPath )
	{
		if( httpPath ) {
			this._socket = io.connect(httpPath);
			this._socket.on( "onEvent", this.__onServerMessage.bind(this) );
		}
	}
	
	Signaling.prototype._socket;
	Signaling.prototype._callback;
	
	/*
	 * PUBLIC API
	 */
	
	Signaling.prototype.send = function( data ) {
		if( this._socket ) this._socket.emit( "dispatchEvent", data );
	}
	
	Signaling.prototype.onMessage = function( callback ) {
		if( typeof(callback) != "function" ) return;
		this._callback = callback;
	}

	/*
	 * PRIVATE API
	 */

	Signaling.prototype.__onServerMessage = function( event ) {
		if( this._callback ) this._callback(event);
	}
})();