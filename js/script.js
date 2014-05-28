var Movement = function() {
    this.min = 0;
    this.max = 0.963 * $("body").width();
    this.move_amt = 20;
};

var Zeus = function() {
    this.thundergodsWrath = function() {
        $.playSound("sounds/thundergod");
        
        $("#zeus").attr("src", "images/zeus_casting.png");
        $("#zeus").css("top", "775px");
        setTimeout(function() {
            $("#zeus").attr("src", "images/zeus_standing.png");
            $("#zeus").css("top", "800px");
        }, 250);
    }
    
    this.enableKeyboard = function() {
        var movement = new Movement();
        var _this = this;

        $("body").keydown(function(e) {
            var position = $("#zeus").offset();
            if (e.which == 37) { // left
                var new_left = ((position.left - movement.move_amt < movement.min) 
                            ? movement.min : position.left - movement.move_amt);
                $("#zeus").offset({ left: new_left})
            } 
            else if (e.which == 39) { // right
                var new_left = ((position.left + movement.move_amt > movement.max) 
                            ? movement.max : position.left + movement.move_amt);
                $("#zeus").offset({ left: new_left})  
            } 
            else if (e.which == 82) { // R
                _this.thundergodsWrath(); 
                
                var creeps = $(".creep");
                creeps.each(function() {
                    var lightning = $('<img class="lightning" src="images/lightning.png" alt="lightning">');
                    lightning.css("position", "absolute");
                    lightning.css("top", $(this).position().top);
                    lightning.css("left", $(this).position().left);
                    lightning.insertAfter(this);
                    
                    var coins = $('<img class="coins" src="images/gold.png" alt="coins">');
                    coins.css("position", "absolute");
                    coins.css("top", $(this).position().top);
                    coins.css("left", $(this).position().left);
                    coins.insertAfter(this);

                    $.playSound("sounds/coins");
                    
                    coins_new_top = $(this).position().top - 150;
                    coins.animate({top: coins_new_top + "px"}, {
                        duration: 2000,
                        queue: false,
                        complete: function() {
                            coins.remove();    
                        }
                    });
                });
                
                setTimeout(function() {
                    $(".lightning").remove();
                }, 250);

                _this.gold += 43 * creeps.length;
                _this.cs += creeps.length;
                $("#gold").text("Gold: " + _this.gold);
                $("#cs").text("CS: " + _this.cs);
                creeps.remove();
            }
            
        });
    };
    
    this.gold = 0;
    this.cs = 0;
};

var CreepSpawner = function() {
    this.spawnInterval = 0;
    
    this.spawn = function(zeus) {
        this.spawnInterval = setInterval(function() {
            var creep = $('<img class="creep" src="images/creep.png" alt="creep">');
            creep.css({
                "left": Math.random() * $("body").width() * 0.93 + "px"
            });
            $("body").append(creep);
            
            creep.animate({top: "885px"}, {
                duration: 5000 - Math.random() * 0.5 * zeus.gold,
                step: function(now, fx) {
                    var creep_position = creep.position();
                    var zeus_position = $("#zeus").position();
                    if (creep_position.top + creep.height() >= zeus_position.top) {
                        if ((creep_position.left < zeus_position.left &&
                            creep_position.left + creep.width() >= zeus_position.left) ||
                            creep_position.left >= zeus_position.left &&
                            creep_position.left <= zeus_position.left + $("#zeus").width()) {
                            
                            var coins = $('<img class="coins" src="images/gold.png" alt="coins">');
                            coins.css("position", "absolute");
                            coins.css("top", creep_position.top);
                            coins.css("left", creep_position.left);
                            coins.insertAfter(creep);
                            
                            $.playSound("sounds/coins");
                            
                            coins_new_top = creep_position.top - 150;
                            coins.animate({top: coins_new_top + "px"}, {
                                duration: 2000,
                                queue: false,
                                complete: function() {
                                    coins.remove();    
                                }
                            });
                            
                            zeus.gold += 43;
                            ++zeus.cs;
                            $("#gold").text("Gold: " + zeus.gold);
                            $("#cs").text("CS: " + zeus.cs);
                            creep.remove();
                        }
                    }
                },
                queue: false,
                complete: function() {
                    creep.remove();
                }
            });
        }, 5000 - 0.1 * zeus.gold);
    };
    
    this.stop = function() {
        clearInterval(this.spawnInterval);
    }
};



$(document).ready(function() {    
    var zeus = new Zeus();
    $("#gold").text("Gold: " + zeus.gold);
    $("#cs").text("CS: " + zeus.cs);;
    zeus.enableKeyboard();
    
    var spawnersQueue = [];
    var spawnManager = 0;
    
    setInterval(function() {        
        if (spawnManager < 2) {
            ++spawnManager;
            spawnersQueue.push(new CreepSpawner());
            spawnersQueue[spawnersQueue.length - 1].spawn(zeus);
        } else {
            spawnManager = 0;
            spawnersQueue[0].stop();
            spawnersQueue.shift();
        }
    }, 3000);
});