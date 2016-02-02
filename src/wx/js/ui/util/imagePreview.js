export function imagePreview (e,thumbBox){
    e = e || window.event;
    var files = e.target.files;
    console.log(files);
    var imgReg = /image\.*/i,
        placeholder = document.getElementById(thumbBox);

    for(var i=0, f; f = files[i]; i++){
      if(!f.type.match(imgReg)){
        var p = document.createElement('p');
        p.innerHTML = f.name + 'is not a picture.';
        placeholder.appendChild(p);
        continue;
      }
      var reader = new FileReader();

      reader.onload = (function(file){
          return function(e){
              var span = document.createElement('span');
              var img = new Image;
              img.alt = file.name;
              img.src = this.result;
              span.innerHTML = '<img class="thumb" src="'+ this.result +'" alt="'+ file.name +'" />';
              placeholder.appendChild(span);
          }
      })(f);
      reader.readAsDataURL(f);
    }

}