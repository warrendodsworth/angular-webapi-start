(function () {
  var newscript = document.createElement('script');
  newscript.type = 'text/javascript';
  newscript.async = true;
  newscript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(newscript);
})();

(function () {
  //http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript

  //Mailchimp image rip
  $('div a.grid-image').each(function (i, link) {

    convertToDataURLviaCanvas(link.href, 'image/png', function (base64Img) {
      // Base64DataURL
      var filename = $(link).attr('title');
      link.href = base64Img;
      link.download = filename + '.png';
      link.click();
    });
  });


  function convertToDataURLviaCanvas(url, outputFormat, callback) {

    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);

      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  }

})();



(function () {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(link);
})();