const { Vibrant } = require('node-vibrant/node');
Vibrant.from('public/logo.png').getPalette((err, palette) => {
    if (err) {
        console.error("Error reading colors:", err);
        return;
    }
    console.log("Vibrant:", palette.Vibrant.hex);
    console.log("DarkVibrant:", palette.DarkVibrant ? palette.DarkVibrant.hex : 'none');
    console.log("LightVibrant:", palette.LightVibrant ? palette.LightVibrant.hex : 'none');
    console.log("Muted:", palette.Muted ? palette.Muted.hex : 'none');
    console.log("DarkMuted:", palette.DarkMuted ? palette.DarkMuted.hex : 'none');
    console.log("LightMuted:", palette.LightMuted ? palette.LightMuted.hex : 'none');
});
