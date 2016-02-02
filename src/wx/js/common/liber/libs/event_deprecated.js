define(['./lang', './array', './object', './function', './string'], function (L, ArrUtil, ObjUtil, FunUtil, S) {

	var EventHandler = function (handler, context, etype) {
			this.handler = handler;
			this.context = context;
			this.etype = etype;
			this.validators = [];
		};
	L.extend(EventHandler.prototype, {
		invoke: function () {
			var self = this,
				args = ArrUtil.slice(arguments);

			if (self.validators.length === 0 || ArrUtil.some(this.validators, function (validator) {
				var vFn = validator[1];
				return vFn.apply(self.context, args);
			})) {
				return this.handler.apply(this.context, args);
			}
		},
		addValidator: function (validator) { //let event handler be canceled if not pass all the validation 
			var self = this;
			if (!L.isObject(validator)) {
				throw new TypeError("[EventHandler.addValidator]:" + validator + " should be a object!");
			}
			ObjUtil.forEachKey(validator, function (fn, key) {
				key = S.trim(key);
				if (L.isFunction(fn)) {
					var isExist = ArrUtil.include(self.validators, key, function (target, validator) {
						return validator[0] === target;
					});
					if (!isExist) {
						self.validators.push([key, fn]);
					}
				}

			});

		},
		removeValidator: function (keys) {
			var validators = this.validators;
			keys = S.trim(keys).split(/\s+/);
			ArrUtil.forEach(keys, function (key) {
				var index = ArrUtil.indexOf(validators, key, 0, function (targetKey, validator) {
					return validator[0] === targetKey;
				});

				if (index !== -1) {
					validators.splice(index, 1);
				}
			});

		},
		removeAllValidators: function () {
			this.validators = [];
		}


	});

	function on(event, fn, context, validator) {
		if (!L.isFunction(fn)) {
			throw new TypeError("Second param should be a function");
		}
		var self = this,
			events = this.events = this.events || {},
			parts = event ? S.trim(event).split(/\s+/) : [];
		
		context = context || this;

		ArrUtil.forEach(parts, function (evt) {
			if (!events[evt]) {
				events[evt] = {
					parsed: _parseTypeStr(evt),
					handlers: []
				};
			}
			var handler = ArrUtil.findOne(events[evt].handlers, function (handler) {
				return handler.handler === fn && handler.context === context;
			});
			if (handler === void 0) {
				handler = new EventHandler(fn, context || self, evt);
				if (validator) {
					handler.addValidator(validator);
				}
				events[evt].handlers.push(handler);
				self.emit('newListener', evt);
			} else {
				if (validator) {
					handler.addValidator(validator);
				} else {
					handler.removeAllValidators();
				}
			}

		});
		return fn;

	}

	function once(event, fn, context, validatorKey) {
		var self = this;
		this.on(event, function fnc() {
			fn.apply(this, ArrUtil.slice(arguments));
			self.removeListener(event, fnc, this, validatorKey);
		}, context, validatorKey);
	}

	function removeListener(event, fn, context,validatorKey) {
		var events = this.events;
		if (!events) return;
		context = context || this;
		ArrUtil.forEach(_getTypeList(events, event), function (evt) {
			var index;

			if ((index = ArrUtil.indexOf(events[evt].handlers, {handler:fn, context:context}, 0, function (target, handler) {
				return target.handler === handler.handler && target.context === handler.context;
			})) !== -1) {
				if (validatorKey && events[evt].handlers[index].validators.length > 0) {
					validatorKey = S.trim(validatorKey);
					events[evt].handlers[index].removeValidator(validatorKey);
					if (events[evt].handlers[index].validators.length === 0) {
						events[evt].handlers.splice(index, 1);
					}
				} else {
					events[evt].handlers.splice(index, 1);
				}
				if (events[evt].handlers.length === 0) delete events[evt];
			}
		});

	}

	function removeAllListeners() {
		var event = S.trim(arguments[0]),
			validatorKey = S.trim(arguments[1]),
			self = this;

		if (!L.hasOwn(this, 'events')) return;
		if (!event) {
			delete this.events;
		} else {
			ArrUtil.forEach(_getTypeList(events, event), function (evt) {


				ArrUtil.forEach(ArrUtil.toArray(events[evt].handlers), function (handler) {
					var index = ArrUtil.indexOf(events[evt].handlers, handler);
					if (validatorKey && handler.validators.length > 0) {
						validatorKey = S.trim(validatorKey);
						handler.removeValidator(validatorKey);
						if (handler.validators.length === 0) {
							events[evt].handlers.splice(index, 1);
						}
					} else {
						events[evt].handlers.splice(index, 1);
					}
					if (events[evt].handlers.length === 0) delete events[evt];
				});

			});
			if (ObjUtil.keys(this.events).length === 0) delete this.events;
		}
	}

	function emit(event) {
		var self = this,
			events = self.events,
			args = [].slice.call(arguments, 1);
		if (!events) return;

		ArrUtil.forEach(_getTypeList(events, event), function (etype) {
			ArrUtil.forEach(events[etype].handlers, function (handler) {
				handler.invoke.apply(handler, args);
			});


		});
	}

	function handlers(event) {
		var self = this,
			events = self.events,
			parts = event ? S.trim(event).split(/\s+/) : [],
			result = [];
		if (!events) return result;
		parts = parts.length === 0 ? ObjUtil.keys(events) : parts;

		ArrUtil.forEach(parts, function (evt) {
			//console.log(_getTypeList(events,evt));
			ArrUtil.forEach(_getTypeList(events, evt), function (etype) {
				ArrUtil.forEach(events[etype].handlers, function (handler) {
					result.push(handler);
				});
			});
		});

		return result;
	}

	function listeners(event) {
		var self = this,
			events = self.events,
			parts = event ? S.trim(event).split(/\s+/) : [],
			result = [];
		if (!events) return result;
		parts = parts.length === 0 ? ObjUtil.keys(events) : parts;

		ArrUtil.forEach(parts, function (evt) {
			//console.log(_getTypeList(events,evt));
			ArrUtil.forEach(_getTypeList(events, evt), function (etype) {
				ArrUtil.forEach(events[etype].handlers, function (handler) {
					result.push(handler.handler);
				});
			});
		});

		return result;
	}

	function hasEvent(etype) {
		var num = 0,
			events = this.events;
		etype = S.trim(etype).split(/\s+/);
		ArrUtil.forEach(etype, function (typeStr) {
			//alert(typeStr);
			var typeObj = _parseTypeStr(typeStr);
			var has = ArrUtil.some(ObjUtil.keys(events), function (evt) {
				var _typeObj = events[evt].parsed;
				return typeObj.typeStr === _typeObj.typeStr || (_typeObj.type === typeObj.type && (typeObj.nsList.length === 0 || ArrUtil.some(typeObj.nsList, function (ns) {
					return ArrUtil.include(_typeObj.nsList, ns);
				})));
			});
			if (has) num++;
		});
		return num;
	}

	//helpers


	function _parseTypeStr(typeStr) {
		typeStr = S.trim(typeStr);
		if (!/^(?:\w+)(?:\.\w+)*$/.test(typeStr)) {
			throw new Error("The format of event type str '" + typeStr + "' is invalid!");
		}
		var types = typeStr.split('.');
		return {
			type: types.shift(),
			nsList: types,
			typeStr: typeStr
		};
	}

	function _getTypeList(eventObj, typeStr) {
		var typeObj = _parseTypeStr(typeStr);

		return ArrUtil.filter(ObjUtil.keys(eventObj), function (evt) {
			var _typeObj = eventObj[evt].parsed;
			return typeObj.typeStr === _typeObj.typeStr || (_typeObj.type === typeObj.type && (typeObj.nsList.length === 0 || ArrUtil.some(typeObj.nsList, function (ns) {
				return ArrUtil.include(_typeObj.nsList, ns);
			})));
		});
	}

	var EvtSuper = function () {};
	EvtSuper.prototype = {
		on: on,
		addListener: on,
		once: once,
		removeListener: removeListener,
		removeAllListeners: removeAllListeners,
		emit: emit,
		listeners: listeners,
		handlers: handlers,
		hasEvent: hasEvent
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
		_evtify: _evtify
	};
});