// Put all your game code within this function definition
window.onload = function() {

  var game = new Phaser.Game(800, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update });


  function preload() {
    game.world.setBounds(0,0,2560, 1280);
    game.load.image('sky', 'images/sky.png');
    game.load.image('ground', 'images/platform.png');
    game.load.spritesheet('po', 'images/Po.png', 24, 32);
    game.load.image('redNode', 'images/redNode.png');
    game.load.image('blueNode', 'images/blueNode.png');
    game.load.image('coi', 'images/coi.png');
    game.load.image('key', 'images/key.png')
    game.load.image('locked', 'images/lockedExit.png')
    game.load.image('open', 'images/openExit.png')

  }

  var platforms;
  var redNodes;
  var blueNodes;
  var redKeys;
  var blueKeys;
  var coi;
  var player;
  var alreadyJumped = false;
  var facingLeft = true;
  var playerSpeed = 150;
  var exit;
  var text;

  function create() {

    text = game.add.text(2200, 300, "- Looks like you won. -\nClick to maybe play again?", { font: "65px Arial", fill: "#ff0044", align: "center" });
    text.anchor.set(0.5);



    game.physics.startSystem(Phaser.Physics.ARCADE);

    sky = game.add.sprite(0, 0, 'sky');
    sky.width = game.world.width;
    sky.height = game.world.height;

    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.width = game.world.width;
    ground.body.immovable = true;

    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(1500, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(2400, 200, 'ground');
    ledge.body.immovable = true;

    exit = game.add.sprite(game.world.width - 50, 66, 'locked');
    exit.enableBody = true;
    game.physics.arcade.enable(exit);

    redNodes = game.add.group();
    blueNodes = game.add.group();
    redKeys = game.add.group();
    blueKeys = game.add.group();

    redNodes.enableBody = true;
    var node = redNodes.create(100, game.world.height - 250, 'redNode');
    node = redNodes.create(900, 200, 'redNode');
    node = redNodes.create(1300, 200, 'redNode');
    node = redNodes.create(2000, 200, 'redNode');

    blueNodes.enableBody = true;
    node = blueNodes.create(400, 200, 'blueNode');
    node = blueNodes.create(2200, 400, 'blueNode');

    //blueKeys.enableBody = true;
    var key1 = blueKeys.create(1000, game.world.height - 100, 'key')
    key1.tint = 0x0000ff;
    game.physics.arcade.enable(blueKeys);
    key1.body.gravity.y = 600;
    key1.collideWorldBounds = true;

    //redKeys.enableBody = true;

    var key2 = redKeys.create(0, 500, 'key');
    key2.tint = 0xFF0000;
    game.physics.arcade.enable(key2);
    key2.body.gravity.y = 600;
    key2.collideWorldBounds = true;

    player = game.add.sprite(32, game.world.height - 150, 'po');
    player.scale.x = 2;
    player.scale.y = 2;
    game.physics.arcade.enable(player);
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [110, 111, 112, 113], 10, true);
    player.animations.add('right', [38, 39, 40, 41], 10, true);
    game.camera.follow(player);

    coi = game.add.sprite(player.body.x - player.width/2, player.body.y - player.height/2, 'coi');
    coi.scale.x = 2;
    coi.scale.y = 2;
    game.physics.arcade.enable(coi);
    coi.exists = false;


  }

  function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(blueKeys, platforms);
    game.physics.arcade.collide(redKeys, platforms);
    game.physics.arcade.collide(exit, platforms);

    if (alreadyJumped && player.body.touching.down && !(game.input.keyboard.isDown(Phaser.Keyboard.UP))) {
      alreadyJumped = false;
    }

    player.body.velocity.x = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        //  Move to the left
        Math.max(player.body.velocity.x -= 100, playerSpeed);
        facingLeft = true;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        //  Move to the right
        Math.min(player.body.velocity.x += 100, playerSpeed);
        facingLeft = false;
    }

    //  Allow the player to jump if they are touching the ground and have released the key from the last jump.
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.body.touching.down && !alreadyJumped)
    {
        alreadyJumped = true;
        player.body.velocity.y = -350;
    }

    //Fall frames
    if (player.body.velocity.y > 0) {
      if (facingLeft) {
        player.frame = 120;
      }
      else {
        player.frame = 48
      }
    }
    //Jumping
    else if (player.body.velocity.y < 0) {
      if (facingLeft) {
        player.frame = 120;
      }
      else {
        player.frame = 124;
      }  
    }
    else if (player.body.touching.down) {
      if (facingLeft) {
        //Running left
        if (player.body.velocity.x < 0) {
          player.animations.play('left');
        }
        //Standing still
        else {
          player.frame = 108
        }
      }
      else {
        //Running right
        if (player.body.velocity.x > 0) {
          player.animations.play('right');
        }
        //Standing still
        else {
          player.frame = 36
        }
      }  
    }
    else {
      if (facingLeft) {
        player.frame = 120;
      }
      else {
        player.frame = 124;
      }  
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
      coi.body.x = player.body.x - 3.5 * player.width;
      coi.body.y = player.body.y - 2.5 * player.height;
      coi.tint = 0xff0000;
      coi.exists = true;

      game.physics.arcade.overlap(coi, redNodes, playerAttract, null, this);
      game.physics.arcade.overlap(coi, blueNodes, playerRepel, null, this);
      game.physics.arcade.overlap(redKeys, coi, keyAttract, null, this);
      game.physics.arcade.overlap(blueKeys, coi, keyRepel, null, this);

    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      coi.body.x = player.body.x - 3.5 * player.width;
      coi.body.y = player.body.y - 2.5 * player.height;
      coi.tint = 0x0000ff;
      coi.exists = true;

      game.physics.arcade.overlap(coi, redNodes, playerRepel, null, this);
      game.physics.arcade.overlap(coi, blueNodes, playerAttract, null, this);
      game.physics.arcade.overlap(redKeys, coi, keyRepel, null, this);
      game.physics.arcade.overlap(blueKeys, coi, keyAttract, null, this);      
    }
    else {
      coi.exists = false;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.P)) {
      // player.body.x = 32;
      // player.body.y = game.world.height - 150;
      player.body.x = game.world.width - 32;
      player.body.y = 10;
    }

    if (game.physics.arcade.overlap(exit, player, win, null, this));
  }

  function playerRepel(coi, node) {
    repel(player, node);
  }

  function playerAttract(coi, node) {
    attract(player, node);
  }

  function keyAttract(key, coi) {
    attract(key, player);
    console.log('hit');
  }

  function keyRepel(key, coi) {
    repel(key, player);
  }

  function attract(attracted, attractor) {
    attracted.body.velocity.x += (0.5 * playerSpeed * (attractor.body.x - attracted.body.x)/(Math.abs(attractor.body.x - attracted.body.x)+Math.abs(attractor.body.y - attracted.body.y)));
    attracted.body.velocity.y += (0.5 * playerSpeed * (attractor.body.y - attracted.body.y)/(Math.abs(attractor.body.x - attracted.body.x)+Math.abs(attractor.body.y - attracted.body.y)));
    game.physics.arcade.overlap(attracted, attractor, stick, null, this);
    console.log('hit');
  }

  function repel(repelled, repellent){
    repelled.body.velocity.x -= (0.5 * playerSpeed * (repellent.body.x - repelled.body.x)/(Math.abs(repellent.body.x - repelled.body.x)+Math.abs(repellent.body.y - repelled.body.y)));
    repelled.body.velocity.y -= (0.5 * playerSpeed * (repellent.body.y - repelled.body.y)/(Math.abs(repellent.body.x - repelled.body.x)+Math.abs(repellent.body.y - repelled.body.y)));
  }

  function stick(attracted, attractor) {
    attracted.body.x = attractor.body.x - attracted.body.width/2;
    attracted.body.velocity.x = 0;
    attracted.body.y = attractor.body.y - attracted.body.height/2;
    attracted.body.velocity.y = 0;
  }

  function win() {
    console.log('win');
    text = game.add.text(300, 1000, "- Good job. -\nNow do it again.", { font: "65px Arial", fill: "#ff0044", align: "center" });
    text.anchor.set(0.5);
    player.body.x = 32;
    player.body.y = game.world.height - 150;


  }

  function removeText() {
    text.destroy();
    player.body.x = 32;
    player.body.y = game.world.height - 150;
  }
};

