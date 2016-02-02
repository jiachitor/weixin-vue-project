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

	
});