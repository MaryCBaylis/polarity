// Put all your game code within this function definition
window.onload = function() {

  var game = new Phaser.Game(800, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update });


  function preload() {
    game.world.setBounds(0,0,2560, 1280);
    game.load.image('sky', 'images/sky.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('star', 'images/star.png');
    game.load.spritesheet('po', 'images/Po.png', 24, 32);
    game.load.image('redNode', 'images/redNode.png');
    game.load.image('blueNode', 'images/blueNode.png');
    game.load.image('coi', 'images/coi.png');

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

  function create() {

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

    redNodes = game.add.group();
    blueNodes = game.add.group();
    redKeys = game.add.group();
    blueKeys = game.add.group();

    redNodes.enableBody = true;
    //var node = redNodes.create(100, game.world.height - 100, 'redNode');
    var node = redNodes.create(100, game.world.height - 250, 'redNode');

    blueNodes.enableBody = true;
    node = blueNodes.create(400, 200, 'blueNode');
    
    // node = game.add.sprite(100, game.world.height - 100, 'redNode');
    // game.physics.arcade.enable(node);

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
    player.body.gravity.y = 600;

    //var cursors = game.input.keyboard.createCursorKeys();

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

    if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
      coi.body.x = player.body.x - 3.5 * player.width;
      coi.body.y = player.body.y - 2.5 * player.height;
      coi.tint = 0xff0000;
      coi.exists = true;

      game.physics.arcade.overlap(coi, redNodes, attract, null, this);
      game.physics.arcade.overlap(coi, blueNodes, repel, null, this);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      coi.body.x = player.body.x - 3.5 * player.width;
      coi.body.y = player.body.y - 2.5 * player.height;
      coi.tint = 0x0000ff;
      coi.exists = true;

      game.physics.arcade.overlap(coi, redNodes, repel, null, this);
      game.physics.arcade.overlap(coi, blueNodes, attract, null, this);
    }
    else {
      coi.exists = false;
    }
  }

  function attract(coi, node) {
    console.log('hit')
    player.body.velocity.x += (0.5 * playerSpeed * (node.body.x - player.body.x)/(Math.abs(node.body.x - player.body.x)+Math.abs(node.body.y - player.body.y)));
    console.log(3 * playerSpeed * (node.body.x - player.body.x)/(Math.abs(node.body.x - player.body.x)+Math.abs(node.body.y - player.body.y)))
    player.body.velocity.y += (0.5 * playerSpeed * (node.body.y - player.body.y)/(Math.abs(node.body.x - player.body.x)+Math.abs(node.body.y - player.body.y)));
    game.physics.arcade.overlap(player, node, stick, null, this);
    //player.body.gravity.y = 200;
  }

  function repel(coi, node){
    player.body.velocity.x -= (playerSpeed * (node.body.x - player.body.x)/(Math.abs(node.body.x - player.body.x)+Math.abs(node.body.y - player.body.y)));
    console.log(3 * playerSpeed * (node.body.x - player.body.x)/(Math.abs(node.body.x - player.body.x)+Math.abs(node.body.y - player.body.y)))
    player.body.velocity.y -= (playerSpeed * (node.body.y - player.body.y)/(Math.abs(node.body.x - player.body.x)+Math.abs(node.body.y - player.body.y)));
    game.physics.arcade.overlap(player, node, stick, null, this);
    //player.body.gravity.y = 200;
  }

  function stick(player, node) {
    player.body.x = node.body.x - player.body.width/2;
    player.body.velocity.x = 0;
    player.body.y = node.body.y - player.body.height/2;
    player.body.velocity.y = 0;
  }
};

