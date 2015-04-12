// Put all your game code within this function definition
window.onload = function() {

  var game = new Phaser.Game(800, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update });

  function preload() {

    game.load.image('sky', 'images/sky.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('star', 'images/star.png');
    game.load.spritesheet('dude', 'images/Po.png', 24, 32);

  }

  var platforms;
  var player;
  var alreadyJumped = false;
  var facingLeft = true;

  function create() {

      //  We're going to be using physics, so enable the Arcade Physics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //  A simple background for our game
      game.add.sprite(0, 0, 'sky');

      //  The platforms group contains the ground and the 2 ledges we can jump on
      platforms = game.add.group();

      //  We will enable physics for any object that is created in this group
      platforms.enableBody = true;

      // Here we create the ground.
      var ground = platforms.create(0, game.world.height - 64, 'ground');

      //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
      ground.scale.setTo(2, 2);

      //  This stops it from falling away when you jump on it
      ground.body.immovable = true;

      //  Now let's create two ledges
      var ledge = platforms.create(400, 400, 'ground');

      ledge.body.immovable = true;

      ledge = platforms.create(-150, 250, 'ground');

      ledge.body.immovable = true;

      player = game.add.sprite(64, game.world.height - 150, 'dude');
      player.scale.x = 2;
      player.scale.y = 2;

      //  We need to enable physics on the player
      game.physics.arcade.enable(player);
            player.body.facing = 1;

      //  Player physics properties. Give the little guy a slight bounce.
      // player.body.bounce.y = 0.2;
      player.body.gravity.y = 600;
      player.body.collideWorldBounds = true;

      //  Our two animations, walking left and right.
      player.animations.add('left', [110, 111, 112, 113], 10, true);
      player.animations.add('right', [38, 39, 40, 41], 10, true);
      player.animations.add('standingLeft', [108], 10, true);
      player.animations.add('standingRight', [36], 10, true);
      player.animations.add('jumpingLeft', [118], 10, true);
      player.animations.add('jumpingRight', [0], 10, true);
      player.animations.add('fallingLeft', [120], 10, true);
      player.animations.add('fallingRight', [0], 10, true);

  }

  function update() {
    console.log(player.body.facing)
    game.physics.arcade.collide(player, platforms);

    var cursors = game.input.keyboard.createCursorKeys();

    if (alreadyJumped && player.body.touching.down && !cursors.up.isDown) {
      alreadyJumped = false;
    }

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        facingLeft = true;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        facingLeft = false;
    }
    // else
    // {
    //     //  Stand still
    //     if (player.animations.currentAnim.name == 'left') {
    //       // player.animations.play('standingLeft')
    //       player.frame = 108
    //     }
    //     else if (player.animations.currentAnim.name == 'right') {
    //       // player.animations.play('standingRight')
    //       player.frame = 36
    //     }
    // }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && !alreadyJumped)
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
    //standing still
    // else {
    //   if (player.body.facing == 1) {
    //     player.frame = 121;
    //   }
    //   else {

    //   } 
    // }
  }
};

