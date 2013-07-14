enchant();

var IMG = ['images/chara0.png','images/chara1.png'];

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 16;
    game.preload(IMG);
    game.tick = 0;
    /*
    var add = function(){
        var bear = new Sprite(32,32);
        bear.x = Math.random()*200;
        bear.y = 0;
        bear.image = game.assets['images/chara1.png'];
        bear.frame = 5;
        game.rootScene.addChild(bear);
    };
    */
    
    var Spr = enchant.Class.create(enchant.Sprite,{
        initialize: function(type){
            enchant.Sprite.call(this,32,32);
            this.x = Math.random()*20;
            this.y = 160;
            this.frame = 5;
        }
    });
    
    var Human = enchant.Class.create(Spr,{
        initialize: function(){
            Spr.call(this);
            this.image = game.assets[IMG[0]];
            game.rootScene.addChild(this);
        }
    });
    
    var Bear = enchant.Class.create(Spr,{
        initialize: function(){
            Spr.call(this);
            this.image = game.assets[IMG[1]];
            game.rootScene.addChild(this);
        }
    });
    
    game.onload = function(){
        game.addEventListener(Event.ENTER_FRAME,function(){
            if(game.tick % 16 == 0){
                new Bear();
            }
            game.tick++;
        });
    };
    game.start();
};

