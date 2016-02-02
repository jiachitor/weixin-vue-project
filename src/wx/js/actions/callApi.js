const DEV_HOST = '172.16.7.71';
export function get(context, apiUrl, params, cb){
  params = params || {};
  var str = joinQueryUrl(params),
      url;
  apiUrl = 'http://' + DEV_HOST + apiUrl;
  if(str){
    url = apiUrl.indexOf('?') != -1 ? (apiUrl + '&' + str) : (apiUrl + '?' + str);
  }else{
    url = apiUrl;
  }

  context.$http.get(url,function(data){
      if(typeof cb == 'function'){
          cb(context, data);
      }
  });
}

export function post(context, apiUrl, data, cb){
  apiUrl = 'http://' + DEV_HOST + apiUrl;
  context.$http.post(apiUrl, data, function(data,status, request){
    console.log('status' + status + 'request' + JSON.stringify(request));
    cb(data,status, request);
  });

}

function joinQueryUrl(obj){
    var queryArray = [],
    temp;
    for(var i in obj){
        temp = obj[i];
        if(temp || temp === 0){
          queryArray.push(i+'='+obj[i]);
        }else{
          queryArray.push(i);
        }
    }

    var queryStr = queryArray.join('&');
     return queryStr;
}
