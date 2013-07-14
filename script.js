enchant();
window.onload = function() {
    var game = new Game(320, 400);
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
        var player = new Sprite(16, 16);
        player.image = game.assets['images/icon0.png'];
        player.x     = tile*1;
        player.y     = 8;
        game.rootScene.addChild(player);
         
        player.direction = 0;
        player.walk=0;
        var p_spd   = 1;            //プレイヤーの移動スピード
        var a_spd   = 3;            //プレイヤーのアニメーションスピード
 
        player.addEventListener('enterframe', function(e) {
            this.xx = this.x;
            this.yy = this.y;
            if (game.input.left){this.xx = this.x - p_spd;this.direction = 1;}
            if (game.input.right){this.xx = this.x + p_spd;this.direction = 2;}
            if (game.input.up) {this.yy = this.y - p_spd;this.direction = 3;}
            if (game.input.down){ this.yy = this.y + p_spd;this.direction = 0;}
             
            //移動予定地this.xx,this.yyが壁かどうかを調べる。
            var asobi = 4;  //遊び幅
            if(!map.hitTest(this.xx+asobi,this.yy+8+asobi)
               &&!map.hitTest(this.xx+15-asobi,this.yy+8+asobi)
               &&!map.hitTest(this.xx,this.yy+20+asobi)
               &&!map.hitTest(this.xx+15,this.yy+14-asobi))
            {
                this.x=this.xx;this.y=this.yy;
            }
             
            if (!(game.frame % a_spd)){this.walk++;}
            if(this.walk == 3){this.walk = 0;}
            this.frame = this.direction*6 + this.walk;
        });
         
        var score = 0;      //点数の初期化
        var state = new Label();
        state.text = "Score:0";
        state.color = "#000000";
        state.x = 200;
        state.y = 310;
        game.rootScene.addChild(state);
    }
    game.start();
}