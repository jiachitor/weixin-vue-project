define(function () {
	/**
	 * ReactiveJS (a little tweak about original, make $R as a object constructor,
	 * so that the extension functions can be shared through prototype)
	 * Reactive.js will augment ("reactify") a given Javascript function so that it may track dependencies on other reactive functions.
	 * Credits to  https://github.com/mattbaker/Reactive.js
	 * @param  {[type]} fnc     [function return a value that other functions depend on]
	 * @param  {[type]} context [fnc's context]
	 * @return {[type]}         [a reactive function]
	 */

	//Private
	var extend = function (target /*,objs*/ ) {
			var i = 1,
				key, cur;
			if (target === undefined || target === null) {
				target = {};
			}
			cur = arguments[1];
			while (cur) {
				for (key in cur) {
					if (cur.hasOwnProperty(key)) {
						target[key] = cur[key];
					}
				}
				cur = arguments[++i];
			}
			return target;
		};

	function topo(rootFnc) {
		var explored = {};

		function search(rFnc) {
			if (explored[rFnc._id]) {
				return [];
			}
			explored[rFnc._id] = true;
			return rFnc._dependents.reduce(function (acc, dep) {
				return acc.concat(search(dep));
			}, []).concat(rFnc);
		}

		return search(rootFnc).reverse();
	}

	function wrap(v) {
		return v && (v instanceof $R || v == $R._) ? v : $R(function () {
			return v;
		});
	}


	//public api

	function $R(fnc, context) {
		//enforce new
		if (!(this instanceof $R)) {
			return new $R(fnc, context);
		}
		this.init(fnc, context);
	}

	var _id = 1;
	extend($R.prototype, {
		init: function (fnc, context) {
			this._context = context || null;
			this._fnc = fnc;
			this._dependents = [];
			this._dependencies = [];
			this._memo = $R.empty;
			this._id = _id++;
			var self = this;
			var rf = function () {
					var dirtyNodes = topo(self);
					var v = dirtyNodes[0].run.apply(self, arguments);
					if (v === $R._) {
						return;
					}
					dirtyNodes.slice(1).forEach(function (n) {
						n.run();
					});
					return v;
				};
			
			this.fn = rf;
		}

	});

	
	$R._ = {};
	$R.empty = {};
	$R.state = function (initial) {
		var rFnc = $R(function () {
			if (arguments.length) {
				this._val = arguments[0];
			}
			return this._val;
		});
		rFnc._context = rFnc;
		rFnc._val = initial;
		return rFnc;
	};


	$R.pluginExtensions = {
		map: function(fn){
			var self = this,
				partialArgs = Array.prototype.slice.call(arguments, 1),
				orgFnc = this._fnc;
			this._fnc = function(){
				var result = orgFnc.apply(this, arguments);
				return fn.apply(this,[result].concat(partialArgs));
			};
			return this;
		}
	};

	var reactiveExtensions = {
		toString: function () {
			return this._fnc.toString();
		},
		get: function () {
			return this._memo === $R.empty ? this.run() : this._memo;
		},
		run: function () {
			var unboundArgs = Array.prototype.slice.call(arguments);
			this._memo = this._fnc.apply(this._context, this.argumentList(unboundArgs));
			return this._memo;
		},
		bindTo: function () {
			var newDependencies = Array.prototype.slice.call(arguments).map(wrap);
			var oldDependencies = this._dependencies;
			//avoid infinite self invoke 
			newDependencies = newDependencies.filter(function (d) {
				return d !== this;
			}, this);

			oldDependencies.forEach(function (d) {
				if (d !== $R._) {
					d.removeDependent(this);
				}
			}, this);

			newDependencies.forEach(function (d) {
				if (d !== $R._) {
					d.addDependent(this);
				}
			}, this);

			this._dependencies = newDependencies;
			return this;
		},
		//control of inversion
		boundBy: function () {
			var newDependents = Array.prototype.slice.call(arguments).map(wrap);

			//avoid infinite self invoke 
			newDependents = newDependents.filter(function (d) {
				return d !== this;
			}, this);

			if (newDependents.length > 0) {
				newDependents.forEach(function (d) {
					d.bindTo(this);
				}, this);
			}
			return this;
		},
		removeDependent: function (rFnc) {
			this._dependents = this._dependents.filter(function (d) {
				return d !== rFnc;
			});
		},
		addDependent: function (rFnc) {
			if (!this._dependents.some(function (d) {
				return d === rFnc;
			})) {
				this._dependents.push(rFnc);
			}
		},
		argumentList: function (unboundArgs) {
			return this._dependencies.map(function (dependency) {
				if (dependency === $R._) { //as $R._ stands for the placeholder, fill the args accordingly
					return unboundArgs.shift();
				} else if (dependency instanceof $R) { // get dependency value first before executing function itself
					return dependency.get();
				} else {
					return undefined;
				}
			}).concat(unboundArgs);
		}
	};

	extend($R.prototype, reactiveExtensions, $R.pluginExtensions);
	return {
		_R: $R
	};
});