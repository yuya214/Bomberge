var DIR_LEFT  = 0;
var DIR_RIGHT = 1;
var DIR_UP    = 2;
var DIR_DOWN  = 3;

enchant();

var CHARA_IMAGE_NAME = "images/chara0.png";
var game;

// エネミークラス
var Enemy = enchant.Class.create(enchant.Sprite, {
    // 初期化
    initialize: function(x,y) {
        Sprite.call(this, 32, 32);	// 親クラスの初期化を忘れないように気をつけよう♪
		this.image = game.assets[CHARA_IMAGE_NAME];	// 画像をセット
        this.x = x;
        this.y = y;
        game.rootScene.addChild(this);
    }
});
        
window.onload = function() {
    game = new Game(320, 400);
    var tile = 16;//タイルのサイズ
    game.preload('images/map2.png','images/chara0.png','images/icon0.png');
    game.onload = function() {      
        var m_data  = new Array();  //表示用マップ領域
        var m_hit   = new Array();  //衝突判定用マップ領域
        //マップの初期化
        for (i = 0; i < 19; i++){
            m_data[i] = new Array();
            m_hit[i] = new Array();
            for (ii = 0; ii < 19; ii++){
                var flag=2;
                if(i>0 && i<18 && ii>0 && ii<18){
                    if(i%2 || ii%2){
                    flag=1; 
                    }
                }
                m_data[i][ii] = flag;
                m_hit[i][ii]  = flag-1; //壁の時１、壁以外の時0を入れる。
            }       
        }
         
        //迷路作成
        dx = [1,0,-1,0];
        dy = [0,1,0,-1];
        for(i = 2;i < 18; i+=2){
            for(ii = 2;ii < 18; ii+=2){
                var r=3;
                if(i==2){r=4;}  //一番上のみ上の方向を追加。
                var rand = Math.floor(Math.random()*r);
                m_data[i+dy[rand]][ii+dx[rand]] = 2;
                m_hit[i+dy[rand]][ii+dx[rand]] = 1;
            }
        }
        
        //指定した方向の通路を壁で埋める。
        var map = new Map(16, 16);
        map.image = game.assets['images/map2.png'];
        map.loadData(m_data);
        map.collisionData = m_hit;
        game.rootScene.addChild(map);
         
        //プレイヤーの初期化
        var player = new Sprite(32, 32);
        player.image = game.assets['images/chara0.png'];
        player.x = 8;
        player.y = -1;
        player.dir   = DIR_DOWN;
        player.anim  = [
             9, 10, 11, 10, //左
            18, 19, 20, 19, //右
            27, 28, 29, 28, //上
             0,  1,  2,  1];//下
        game.rootScene.addChild(player);
        //プレイヤーの定期処理
        player.tick = 0;
        player.addEventListener(Event.ENTER_FRAME, function() {
            //上へ移動
            if (game.input.up) {
                player.dir = DIR_UP;
                player.y -= 4;
                if (map.hitTest(player.x + 10, player.y + 20)) player.y += 4;
            }
            //下へ移動
            else if (game.input.down) {
                player.dir = DIR_DOWN;
                player.y += 4;
                if (map.hitTest(player.x + 10, player.y + 32)) player.y -= 4;
            } 
            //左へ移動
            else if (game.input.left) {
                player.dir = DIR_LEFT;
                player.x -= 4;
                if (map.hitTest(player.x + 10, player.y + 32)) player.x += 4;
            }
            //右へ移動
            else if (game.input.right) {
                player.dir = DIR_RIGHT;
                player.x += 4;
                if (map.hitTest(player.x + 20, player.y + 32)) player.x -= 4;
            } 
            
            //フレームの指定
            player.tick++;
            if (!game.input.up && !game.input.down && 
                !game.input.left && !game.input.right) player.tick = 1;//静止
            player.frame = player.anim[player.dir * 4 + (player.tick % 4)];
            
        });
        
        //エネミーの作成
            var x = 264;
            var y = -1;
            var enemy1 = new Enemy(x,y);
            enemy1.frame = 7;
        enemy1.addEventListener('enterframe', function(e) {
                if(this.intersect(player)){
                    score = 0;
                }
                this.xx = this.x;
                this.yy = this.y;
                if(this.direction == 0){this.yy = this.y+enemy_spd;}
                if(this.direction == 1){this.xx = this.x-enemy_spd;}
                if(this.direction == 2){this.xx = this.x+enemy_spd;}
                if(this.direction == 3){this.yy = this.y-enemy_spd;}
                if(!map.hitTest(this.xx+1,this.yy+1)&&!map.hitTest(this.xx+14,this.yy+14)){
                    this.x = this.xx;
                    this.y = this.yy;
                }else{
                    this.direction = (this.direction + Math.floor(Math.random()*3))%4;
                }
            });
            return enemy1;
       
        
            var x = 264;
            var y = 255;
            var enemy2 = new Enemy(x,y);
            enemy2.frame = 7;
            
            var x = 8;
            var y = 255;
            var enemy3 = new Enemy(x,y);
            enemy3.frame = 7;
        
            // scene に更新イベントリスナを登録
            var scene = game.rootScene;
            //制限時間の設定
            game.tick =16 * 30;
        
            var label = new Label();
            label.text = "";
	       label.moveTo(20, 20)
           label.x = 8;
           label.y = 305;
           scene.addChild(label);
            game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
            game.tick--;
	       scene.onenterframe = function() {
	       label.text = "";
	       // 経過秒数
	       // フレーム数を fps で割れば求めることができます
	       label.text += "制限時間 : " + Math.floor(game.tick/16) + "<br />";
	       
            // ゲームエンド
            if(( game.tick) == 0) { 
            game.end();
	       }
           }
        });
    };
    game.start();
}