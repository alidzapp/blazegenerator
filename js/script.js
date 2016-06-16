/**
 * Created by pc on 6/16/2016.
 */
var fonts = [ 'Arial', 'Impact','Abril Fatface','Alfa Slab One','Allan','Amatica SC','Arima Madurai','Atma','Audiowide','Baloo','Baloo Bhai','Baloo Da','Baloo Thambi','Bangers','Baumans','Bevan','Black Ops One','Boogaloo','Bowlby One SC','Bubblegum Sans','Bungee','Bungee Hairline','Bungee Inline','Bungee Outline','Bungee Shade','Cabin Sketch','Carter One','Ceviche One','Changa One','Chelsea Market','Cherry Cream Soda','Chewy','Cinzel Decorative','Coda','Coiny','Comfortaa','Contrail One','Corben','Creepster','Ewert','Farsan','Finger Paint','Fontdiner Swanky','Forum','Freckle Face','Fredericka the Great','Fredoka One','Frijole','Fruktur','Fugaz One','Galada','Graduate','Gravitas One','Gruppo','Hanalei Fill','Jomhuria','Katibeh','Kavoon','Kelly Slab','Kumar One','Kumar One Outline','Lalezar','Lemon','Lemonada','Lilita One','Limelight','Lobster','Lobster Two','Londrina Solid','Luckiest Guy','Macondo Swash Caps','Mirza','Mogra','Monoton','Nixie One','Nova Oval','Nova Square','Oleo Script','Oleo Script Swash Caps','Overlock','Passion One','Patua One','Peralta','Piedra','Playball','Poiret One','Pompiere','Press Start 2P','Prosto One','Racing Sans One','Rakkas','Ravi Prakash','Righteous','Sansita One','Share','Shrikhand','Sigmar One','Simonetta','Slackey','Special Elite','Squada One', 'Unica One', 'Yatra One' ];
var gen = {};
gen.$can = $(".generator");
gen.canvas = gen.$can[0];
gen.canvas.width = 500;
gen.canvas.height = 500;
gen.offset = {};
gen.offset.get = gen.$can.offset();
gen.offset.x = gen.offset.get.left;
gen.offset.y = gen.offset.get.top;
gen.offset.scrollX = gen.$can.scrollLeft();
gen.offset.scrollY = gen.$can.scrollTop();
gen.fonts = [];
gen.mouse = {};
gen.mouse.x = 0;
gen.mouse.y = 0;
gen.ctx = gen.canvas.getContext('2d');
gen.image_dir = "/blazegenerator/images/";
gen.selected = -1;
gen.oldInput = "";
gen.images = {
    1: "1.jpg",
    2: "2.jpg",
    3: "3.jpg",
    4: "4.jpg"
};
gen.imgIndex = 4;
gen.lines = [
    {
        text: "Joaquim",
        x: 170,
        y: 250
    },
    {
        text: "Blaze",
        x: 250,
        y: 250
    }
];
gen.settings = {
    font_size : 40,
    font : fonts[1],
    color : "#FFF"
};
var $download = $('.download');
var $pre = $(".preloader");
var $tl = $(".textline");
var $cb = $(".showControl");
var $con = $(".control");
var $color_pick = $("#color-pick");
gen.preload_images = function () {
    var toLoad = gen.images;
    gen.images = {};
    Object.keys(toLoad).forEach(function (path) {
        $pre.find("span").text("Loading " + path + " of " + Object.keys(toLoad).length + " images.");
        var image = new Image;
        image.onload = function () {
            gen.images[path] = image;
            if (Object.keys(gen.images).length == Object.keys(toLoad).length) {
                gen.images_loaded();
            }
        };
        image.onerror = function () {
            gen.preload_failed();
        };
        image.src = gen.image_dir + toLoad[path];
    });
};
gen.preload_failed = function () {
    $pre.find('span').text("Unable to preload load images");
};
gen.images_loaded = function () {
    gen.preload_fonts();
};

gen.fonts_loaded = function(){
    for(var i = 0; i < fonts.length; i++){
        var font = fonts[i];
        $(".font").append("<option style='font-family:" + font + ";'>" + font + "</option>")
    }
    $pre.find("span").text("Fonts & Images Loaded.");
    $pre.fadeOut();
    gen.ready();
    $(".showControl").show();
    $(".download").show();
};

gen.fontload_failed = function(){
    $pre.find('span').text("Unable to load some fonts.");
    setTimeout(gen.fonts_loaded, 1000);
};

gen.preload_fonts = function(){
    gen.fonts = [];
    WebFont.load({
        google: {
            families: fonts
        },
        fontactive : function(fontName){
            gen.fonts.push(fontName);
            $pre.find("span").text("Preloading " + fontName);
        },
        active : gen.fonts_loaded,
        inactive : gen.fontload_failed
    });
};

gen.update_lines = function(){
    var name = $(".lines").val();
    if(name == gen.oldInput) return;
    else gen.oldInput = name;
    gen.lines = [];
    var spl = name.split(",");
    for (var i = 0; i < spl.length; i++) {
        var line = spl[i];
        gen.lines.push({
            text: line,
            x: 20,
            y: 40 + (i * 35)
        });
        gen.ready();
    }
};

gen.draw = function () {
    gen.settings.color = $color_pick.spectrum("get").toHexString().toUpperCase();
    gen.update_lines();
    gen.ctx.clearRect(0, 0, gen.canvas.width, gen.canvas.height);
    gen.draw_background();
    for(var i = 0; i < gen.lines.length; i++){
        var line = gen.lines[i];
        gen.ctx.fillStyle = gen.settings.color;
        gen.ctx.font = gen.settings.font_size + "px " + $(".font").val();
        gen.ctx.fillText(line.text, line.x, line.y);
    }
};

gen.draw_background = function(){
    gen.ctx.drawImage(gen.images[gen.imgIndex], 0, 0, gen.canvas.width, gen.canvas.height);
};

gen.ready = function(){
    for(var i = 0; i < gen.lines.length; i++){
        var line = gen.lines[i];
        $tl.text(line.text);
        $tl.css("font-family", gen.settings.font);
        $tl.css("font-size", gen.settings.font_size);
        line.width = $tl.css('width').replace("px", "");
        line.height = 20;
        gen.lines[i] = line;
        $tl.text("");
    }
    gen.selected = -1;
    gen.draw();
};

gen.isTextClicked = function(x,y,lineIndex){
    var line = gen.lines[lineIndex];
    return (x >= line.x && x <= line.x + line.width && y >= line.y - line.height && y <= line.y);
};

gen.mouse.down = function(e){
    e.preventDefault();
    gen.mouse.x = parseInt(e.clientX - gen.offset.x);
    gen.mouse.y = parseInt(e.clientY - gen.offset.y);
    for(var i = 0; i < gen.lines.length; i++){
        if(gen.isTextClicked(gen.mouse.x, gen.mouse.y, i)){
            gen.selected = i;
        }
    }
};
gen.mouse.move = function(e){
    if(gen.selected<0) return;
    e.preventDefault();
    var newx = parseInt(e.clientX - gen.offset.x);
    var newy = parseInt(e.clientY - gen.offset.y);

    var dx = newx - gen.mouse.x;
    var dy = newy - gen.mouse.y;
    gen.mouse.x = newx;
    gen.mouse.y = newy;

    var line = gen.lines[gen.selected];
    line.x += dx;
    line.y += dy;
    gen.draw();
    if(line.x < 0) line.x = 0;
    if(line.x > gen.canvas.width-line.width) line.x = gen.canvas.width-line.width;
    if(line.y < 0 - line.height) line.y = line.height;
    if(line.y > gen.canvas.height) line.y = gen.canvas.height;
};
gen.mouse.up = function(e){
    e.preventDefault();
    gen.selected = -1;
};
gen.mouse.out = function(e){
    e.preventDefault();
    gen.selected = -1;
};

gen.$can.mousedown(function(e){ gen.mouse.down(e); });
gen.$can.mousemove(function(e){ gen.mouse.move(e); });
gen.$can.mouseup(function(e){ gen.mouse.up(e); });
gen.$can.mouseout(function(e){ gen.mouse.out(e); });
$cb.on('click', function(){
    if($con.css('display') == 'block'){
        $con.fadeOut();
    } else {
        $con.fadeIn();
    }
    gen.draw();
});
$(".types img").on('click', function(){
    $('.types img').each(function(i, v){ $(v).removeClass("selected"); });
    $(this).addClass('selected');
    gen.imgIndex = $(this).data("index");
});
$download.on("click", function(e) {
    $download.attr("download", "BlazeArmy.png");
    $download.attr("href", gen.canvas.toDataURL().replace(/^data:image\/[^;]/, 'data:application/octet-stream'));
});

$color_pick.spectrum({
    color: "#FFFFFF"
});

setInterval(gen.draw, 1000);

gen.preload_images();