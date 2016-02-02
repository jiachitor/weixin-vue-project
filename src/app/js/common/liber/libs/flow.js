define(['./lang','./array'],function(L,Arr){
	//enable one flow function can be composed with other flows
	var base = function(){
				var args = Arr.toArray(arguments);
				args.unshift(null);//add no-error arg
				return this.apply(this,args);
			};
	/*  Flow - async flow control function
	*  	Step functions passed in will execute from left to the right in order.
	*	In each step fn, just call 'this(err,args...)' to return and step into
	*	the next step fn. 'this' stands for the context of the step fn object,
	*	and args are arguments passed to the next step fn.
	*	Step could be an array of fns, and will be execute in parallel, the aggregated results
	*	will be passed to the next step as a single array in the same order as their fns do.
	*	Each parallel fn will finish or generate an error, and one error will not compromise other fns's execution.
	*	Step could also be a flow fn itself.
	*	Error handler can be designated with "flow.error(handler)" function.
	*/
	var Flow = function(/*steps*/){
		if(arguments.length == 1) return arguments[0];
		var step = base;
		Arr.forEach(Arr.toArray(arguments).reverse(),function(s){
			var child = step;
			step = function(){
				var self = this;
				var stepArgs = arguments;
				try{
					if(isArray(s)){//steps in array - s execute in parallel
						var results = [];
						var errs = [];
						var count = s.length;
						Arr.forEach(s,function(m,index){
							m.apply(function(err){
								var args = Arr.toArray(arguments,1);
								count--;
								results[index] = err?(errs.push(err),err):(args.length>1?args:args[0]);

								if(count == 0){
									if(errs.length > 0){
										return Flow.ErrorHandler(errs);
									}
									return child.apply(self,results);
								}
							},stepArgs);
						});

					}else{
							s.apply(function(err){
								if(err){
									return Flow.ErrorHandler(err);
								}
								var args = slice.call(arguments,1);
								return child.apply(self,args);
							},stepArgs);
					}
				}catch(err){
					return Flow.ErrorHandler(err);
				}
			}

		});
		step.error = function(cb){Flow.ErrorHandler  = cb;return this;}
		return step;
	};
	Flow.ErrorHandler = function(err){

		if(!isArray(err)){
			return console.log(err);
		}

		err.forEach(function(e){
			console.log(e);
		});
	};

	return {
		_Flow:Flow
	};
});
