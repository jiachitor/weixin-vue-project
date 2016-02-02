define(['./lang', './array', './object', './function', './string'], function (L, ArrUtil, ObjUtil, FunUtil, S) {
	/**
	 * simple event handling system:
	 * {
	 *	//event's format :'event.sub.subsub'
	 *	on:   function(event, callback, [context]){...}, 
	 *	//	when context is missing, removes all
	 *	//  callbacks with that callback function. If `callback` is null, 
	 *	//  removes all callbacks for the event. If `event` is null, removes 
	 *	//  all  bound  callbacks for all events.
	 *	off:  function(event, [callback], [context]){...},
	 *	once: function(event, callback, [context]){...},
	 *	//when emit 'event.sub.subsub', any callbacks on this event path, like 'event' or 'event.sub' or "event.sub.subsub"'s callbacks  will be  invoked
	 *	emit: function(event, [args...]){...},  
	 *	addListener: on,
	 *	addListenerOnce: once,
	 *	removeListener : off,
	 *	trigger: emit	
	 * }
	 *
	 * one event hanlder is consists of a callback and a context, and it can only be identified by these two combined together.
	 * one event handler can only be registered once for a specific event , if there is a duplicate registration the handler is just
	 * ignored.
	 */
	/*-----------------------private-----------------------------*/
	var eventSpliter = /\s+/;
	var _makeEvtHandler = function (handler, context) {
			if (!L.isFunction(handler)) {
				throw new Error('handler must be a function!');
			}
			return [handler, context];
		};

	var _invokeEvtHandler = function (evtHandler) {
			evtHandler[0].apply(evtHandler[1], ArrUtil.slice(arguments, 1));
		};
	//register handler for single event
	var _registerHandler = function (eventMap, event, callback, context) {
			eventMap[event] = eventMap[event] || [];
			if (!ArrUtil.some(eventMap[event], function (handler) {
				return handler[0] === callback && handler[1] === context;
			})) {
				eventMap[event].push(_makeEvtHandler(callback, context));
			}

		};

	var _removeHandler = function (eventMap, event, callback, context) {
			if (L.isEmpty(eventMap[event])) {
				return;
			}
			if (callback === void 0) {
				delete eventMap[event];
				return;
			}
			eventMap[event] = ArrUtil.filter(eventMap[event], function (handler) {
				return handler[0] !== callback || (context === void 0 ? false : handler[1] !== context);
			});
			if (L.isEmpty(eventMap[event])) {
				delete eventMap[event];
			}
		};

	var _emitHandler = function (eventMap, event, args) {
			if (!/^(?:\w+)(?:\.\w+)*$/.test(event)) {
				throw new Error("The format of event str '" + event + "' is invalid!");
			}
			var paths = event.split('.'),
				evts = [];
			ArrUtil.reduce(paths, function (memo, path) {
				var pre = memo[memo.length - 1],
					next;

				if (L.isEmpty(pre)) {
					next = path;
				} else {
					next = [pre, path].join('.');
				}

				memo.push(next);
				return memo;
			}, evts);

			ArrUtil.forEach(evts, function (evt) {
				if(eventMap[evt]){
					ArrUtil.forEach(eventMap[evt], function (handler) {
						_invokeEvtHandler.apply(null, [handler].concat(args));
					});
				}
			});
		};

	/*-----------------------public-----------------------------*/
	var on = function (event, callback, context) {
			if (L.isEmpty(event)) {
				throw new Error('event must not be empty!');
			}
			if (!L.isFunction(callback)) {
				throw new Error('handler must be a function!');
			}
			var self = this,
				events = L.isString(event) ? event.trim().split(eventSpliter) : [],
				eventMap = this._eventMap = this._eventMap || {};
			//default context is the eventified obj itself
			context = context || this;

			ArrUtil.forEach(events, function (evt) {
				_registerHandler(eventMap, evt, callback, context);
			});
		};

	var once = function (event, callback, context) {
			var self = this;

			this.on(event, function onceCallback() {
				callback.apply(this, arguments);
				self.off(event, onceCallback, this);
			}, context);
		};

	var off = function (event, callback, context) {
			var self = this,
				events = L.isString(event) ? event.trim().split(eventSpliter) : [],
				eventMap = this._eventMap;
			if (L.isEmpty(eventMap)) {
				return;
			}
			if (arguments.length === 0) {
				this._eventMap = {};
			}

			ArrUtil.forEach(events, function (evt) {
				_removeHandler(eventMap, evt, callback, context);
			});
		};

	var emit = function (event) {
			var self = this,
				events = L.isString(event) ? event.trim().split(eventSpliter) : [],
				eventMap = this._eventMap,
				args = ArrUtil.slice(arguments, 1);
			if(L.isEmpty(eventMap)){
				return;
			}
			ArrUtil.forEach(events, function (evt) {
				_emitHandler(eventMap, evt, args);
			});
		};

	var EvtSuper = function () {};
	EvtSuper.prototype = {
		on: on,
		addListener: on,
		once: once,
		addListenerOnce: once,
		off: off,
		removeListener: off,
		emit: emit,
		trigger: emit
	};


	var _evtify = function (obj) {
			if (L.isFunction(obj)) {
				FunUtil._inherits(obj, EvtSuper);
			} else if (L.isObject(obj)) {
				L.extend(obj, EvtSuper.prototype);
			}
			return obj;
		};
	return {
		_eventify: _evtify,
		_evtify:_evtify
	};
});