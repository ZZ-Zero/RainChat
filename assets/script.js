$(function(){
  var socket = io.connect()

  var index = {
    init: function () {
      this.canvasBg()
      this.bindEvent()
    },
    canvasBg: function () {
      var c = $('#canvasBg')[0]
      var ctx = c.getContext('2d')

      //making the canvas full screen
      c.height = window.innerHeight;
      c.width = window.innerWidth;

      //bgText characters - taken from the unicode charset
      var bgText = "123456789ABCDEF";
      //converting the string into an array of single characters
      bgText = bgText.split("");

      var font_size = 14;
      var columns = c.width/font_size; //number of columns for the rain
      //an array of drops - one per column
      var drops = [];
      //x below is the x coordinate
      //1 = y co-ordinate of the drop(same for every drop initially)
      for(var x = 0; x < columns; x++)
      	drops[x] = 1;

      //drawing the characters
      function draw()
      {
      	//Black BG for the canvas
      	//translucent BG to show trail
      	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      	ctx.fillRect(0, 0, c.width, c.height);

      	ctx.fillStyle = "#0F0"; //green text
      	ctx.font = font_size + "px arial";
      	//looping over drops
      	for(var i = 0; i < drops.length; i++)
      	{
      		//a random bgText character to print
      		var text = bgText[Math.floor(Math.random()*bgText.length)];
      		//x = i*font_size, y = value of drops[i]*font_size
      		ctx.fillText(text, i*font_size, drops[i]*font_size);

      		//sending the drop back to the top randomly after it has crossed the screen
      		//adding a randomness to the reset to make the drops scattered on the Y axis
      		if(drops[i]*font_size > c.height && Math.random() > 0.975)
      			drops[i] = 0;

      		//incrementing Y coordinate
      		drops[i]++;
      	}
      }

      setInterval(draw, 53);
    },
    bgColor: function (color) {
      var c = $('#canvasBg')[0]
      var ctx = c.getContext('2d')
      ctx.fillStyle = color
    },
    bindEvent: function () {
      $('#login').click(function () {
        var name = $('.login input').val()
        socket.emit('login', name)
        console.log(name)
      })

      socket.on('loginSuccess', function () {
        $('.login').fadeOut()
        $('.center').fadeIn()
      })
    }
  }
  index.init()
})
