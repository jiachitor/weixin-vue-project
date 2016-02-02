//high order function makers
define(['./lang', './array', './object'], function (L, ArrUtil, ObjUtil) {
	var fail = function (str) {
			throw new Error('FAIL: ' + str);
		};

	var doWhen = function (condition, action) {
			if (condition) {
				return action();
			} else {
				return void 0;
			}
		};
	//returns a function that will invoke that method on any 'target' object given
	var invoker = function (name, method) {
			return function (target /*,args...*/ ) {
				if (!L.isExist(target)) fail("Must provide a target");
				var targetMethod = target[name];
				var args = ArrUtil.rest(arguments);
				return doWhen((L.isExist(targetMethod) && method === targetMethod), function () {
					return targetMethod.apply(target, args);
				});
			};
		};

	var fnull = function (fun /*, defaults */ ) {
		var defaults = ArrUtil.rest(arguments);
		return function ( /* args */ ) {
			var args = ArrUtil.map(arguments, function (e, i) {
				return existy(e) ? e : defaults[i];
			});
			return fun.apply(null, args);
		};
	};

	var dispatch = function(/*funs*/){
		var funs = ArrUtil.toArray(arguments),
			size = funs.length;
		return function(target/*, args*/){
			var ret = void 0,
				args = ArrUtil.rest(arguments),
				funIdx, fun;
			for(funIdx = 0; funIdx < size; funIdx++){
				fun = funs[funIdx];
				ret = fun.apply(fun, [target].concat(args));
				if(L.isExist(ret)){
					return ret;
				}
			}
			return ret;

		};
	};

	var curryRight = function(fun/*,rightArgs*/){
		var rightArgs = ArrUtil.slice(arguments,1);
		return function(arg){
			return fun.apply(fun, [arg].concat(rightArgs));
		};
	};
	return {
		_fn:{
			invoker: invoker,
			fnull: fnull,
			dispatch: dispatch,
		}
	};
});