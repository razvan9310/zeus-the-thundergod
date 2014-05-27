var Movement = function() {
    this.min = 0;
    this.max = 0.963 * $("body").width();
    this.move_amt = 20;
};

var Zeus = function() {
    this.startMotion = function() {
        var movement = new Movement();

        $("body").keydown(function(e) {
          var position = $("#zeus").offset();
          if(e.which == 37) { // left
            var new_left = ((position.left - movement.move_amt < movement.min) 
                            ? movement.min : position.left - movement.move_amt);
            $("#zeus").offset({ left: new_left})
          }
          else if(e.which == 39) { // right
            var new_left = ((position.left + movement.move_amt > movement.max) 
                            ? movement.max : position.left + movement.move_amt);
            $("#zeus").offset({ left: new_left})
          }
        });
    };
};

$(document).ready(function() {
    var zeus = new Zeus();
    zeus.startMotion();
});