define(['./lang'], function (L) {
	/**
	 * ReactiveJS (a fork)
	 * Reactive.js will augment ("reactify") a given Javascript function so that it may track dependencies on other reactive functions.
	 * Credits to  https://github.com/mattbaker/Reactive.js
	 * @param  {[type]} fnc     [function return a value that other functions depend on]
	 * @param  {[type]} context [fnc's context]
	 * @return {[type]}         [a reactive function]
	 */

	//Private


	function topo(rootFnc) {
		var explored = {};

		function search(rFnc) {
			if (explored[rFnc.id]) {
				return [];
			}
			explored[rFnc.id] = true;
			return rFnc.dependents.reduce(function (acc, dep) {
				return acc.concat(search(dep));
			}, []).concat(rFnc);
		}

		return search(rootFnc).reverse();
	}

	function wrap(v) {
		return v && (v._isReactive || v == $R._) ? v : $R(function () {
			return v;
		});
	}


	//public api


	function $R(fnc, context) {
		var rf = function () {
				var dirtyNodes = topo(rf);
				var v = dirtyNodes[0].run.apply(rf, arguments);
				if(v === $R._){
					return;
				}
				dirtyNodes.slice(1).forEach(function (n) {
					n.run();
				});
				return v;
			};
		rf.id = L._uniqueId();
		rf.context = context || null;
		rf.fnc = fnc;
		rf.dependents = [];
		rf.dependencies = [];
		rf.memo = $R.empty;
		return L.extend(rf, reactiveExtensions, $R.pluginExtensions);
	}
	$R._ = {};
	$R.empty = {};
	$R.state = function (initial) {
		var rFnc = $R(function () {
			if (arguments.length) {
				this.val = arguments[0];
			}
			return this.val;
		});
		rFnc.context = rFnc;
		rFnc.val = initial;
		return rFnc;
	};

	$R.pluginExtensions = {};

	var reactiveExtensions = {
		_isReactive: true,
		toString: function () {
			return this.fnc.toString();
		},
		get: function () {
			return this.memo === $R.empty ? this.run() : this.memo;
		},
		run: function () {
			var unboundArgs = Array.prototype.slice.call(arguments);
			this.memo = this.fnc.apply(this.context, this.argumentList(unboundArgs));
			return this.memo;
		},
		bindTo: function () {
			var newDependencies = Array.prototype.slice.call(arguments).map(wrap);
			var oldDependencies = this.dependencies;
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

			this.dependencies = newDependencies;
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
			this.dependents = this.dependents.filter(function (d) {
				return d !== rFnc;
			});
		},
		addDependent: function (rFnc) {
			if (!this.dependents.some(function (d) {
				return d === rFnc;
			})) {
				this.dependents.push(rFnc);
			}
		},
		argumentList: function (unboundArgs) {
			return this.dependencies.map(function (dependency) {
				if (dependency === $R._) { //as $R._ stands for the placeholder, fill the args accordingly
					return unboundArgs.shift();
				} else if (dependency._isReactive) { // get dependency value first before executing function itself
					return dependency.get();
				} else {
					return undefined;
				}
			}).concat(unboundArgs);
		}
	};

	return {
		_R:$R
	};
});