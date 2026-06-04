const { Jimp } = require('jimp');

Jimp.read('public/logo.png')
  .then(image => {
    let colorCounts = {};
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      var r = this.bitmap.data[idx + 0];
      var g = this.bitmap.data[idx + 1];
      var b = this.bitmap.data[idx + 2];
      var a = this.bitmap.data[idx + 3];
      
      // ignore transparent and very light colors (backgrounds)
      if (a > 200 && (r < 240 || g < 240 || b < 240)) {
        let hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }
    });
    
    let maxCount = 0;
    let dominantHex = '';
    for (let hex in colorCounts) {
        if (colorCounts[hex] > maxCount) {
            maxCount = colorCounts[hex];
            dominantHex = hex;
        }
    }
    console.log('DOMINANT COLOR: #' + dominantHex);
  })
  .catch(err => {
    console.error(err);
  });
