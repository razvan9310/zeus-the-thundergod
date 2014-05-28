var Movement = function() {
    this.min = 0;
    this.max = 0.963 * $("body").width();
    this.move_amt = 20;
}

var ImageCreator = function() {
    this.createImage = function(id_attr, class_attr, src_attr, alt_attr) {
        var image = $('<img src="' + src_attr + '" alt="' + alt_attr + '">');
        if (id_attr != null) {
            image.attr("id", id_attr);
        }
        if (class_attr != null) {
            image.attr("class", class_attr);
        }
        return image;
    }
}

var Zeus = function(ids, images, sounds) {
    this.ids = ids;
    this.images = images;
    this.sounds = sounds;
    
    this.ultimate = {
        cooldown: 10000,
        lastUsed: -1,
        lastFailedAttempt: -1,
        failedAttemptsCount: 0
    };
    this.gold = 0;
    this.cs = 0;
    
    this.thundergodsWrath = function() {
        $.playSound(this.sounds.thundergodsWrath);
        
        $(this.ids.zeus_id).attr("src", this.images.casting);
        $(this.ids.zeus_id).css("top", this.images.casting_top);
        _this = this;
        
        setTimeout(function() {
            $(_this.ids.zeus_id).attr("src", _this.images.standing);
            $(_this.ids.zeus_id).css("top", _this.images.standing_top);                
        }, 250);
    }
    
    this.killCreeps = function(usedUltimate, target) {
        imageCreator = new ImageCreator();
        var coins = imageCreator.createImage(null, "coins", this.images.coins, "coins");
        coins.css("position", "absolute");
        
        if (usedUltimate == true) {
            var _this = this;

            target.each(function() {
                var lightning = imageCreator.createImage(null, "lightning", _this.images.lightning, "lightning");
                lightning.css("position", "absolute");
                lightning.css("top", $(this).position().top);
                lightning.css("left", $(this).position().left);
                lightning.insertAfter(this);

                
                coins.css("top", $(this).position().top);
                coins.css("left", $(this).position().left);
                coins.insertAfter(this);

                $.playSound(_this.sounds.coins);

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
        } else {
            
            coins.css("top", target.position().top);
            coins.css("left", target.position().left);
            coins.insertAfter(target);

            $.playSound(this.sounds.coins);

            coins_new_top = target.position().top - 150;
            coins.animate({top: coins_new_top + "px"}, {
                duration: 2000,
                queue: false,
                complete: function() {
                    coins.remove();    
                }
            });
        }
    }
    
    this.enableKeyboard = function() {
        var movement = new Movement();
        var _this = this;

        $("body").keydown(function(e) {
            var position = $(_this.ids.zeus_id).offset();
            if (e.which == 37) { // left
                var new_left = ((position.left - movement.move_amt < movement.min) 
                            ? movement.min : position.left - movement.move_amt);
                $(_this.ids.zeus_id).offset({ left: new_left})
            } 
            else if (e.which == 39) { // right
                var new_left = ((position.left + movement.move_amt > movement.max) 
                            ? movement.max : position.left + movement.move_amt);
                $(_this.ids.zeus_id).offset({ left: new_left})  
            } 
            else if (e.which == 82) { // R
                if (_this.ultimate.lastUsed == -1 || 
                    _this.ultimate.lastUsed + _this.ultimate.cooldown <= Date.now()) {
                    _this.ultimate.lastUsed = Date.now();
                    
                    _this.thundergodsWrath();
                    var creeps = $(".creep");
                    _this.killCreeps(true, creeps);
                    _this.gold += 43 * creeps.length;
                    _this.cs += creeps.length;
                    $(_this.ids.gold_id).text("Gold: " + _this.gold);
                    $(_this.ids.cs_id).text("CS: " + _this.cs);
                    creeps.remove();
                } else {
                    
                }
            }
            
        });
    }
}

var CreepSpawner = function(ids, creep_image) {
    this.ids = ids;
    this.creep_image = creep_image;
    this.spawnInterval = 0;
    
    this.flipHorizontally = function(creep) {
        creep.css("transform", "scaleX(-1)");
        creep.css("-ms-transform", "scaleX(-1)");
        creep.css("-moz-transform", "scaleX(-1)");
        creep.css("-webkit-transform", "scaleX(-1)");
        creep.css("-o-transform", "scaleX(-1)");
    }
    
    this.spawn = function(zeus) {
        _this = this;
        
        this.spawnInterval = setInterval(function() {
            var imageCreator = new ImageCreator();
            var creep = imageCreator.createImage(null, "creep", _this.creep_image, "creep");
            if (Math.random() >= 0.5) {
                _this.flipHorizontally(creep);
            }
            creep.css({
                "left": Math.random() * $("body").width() * 0.93 + "px"
            });
            $("body").append(creep);
            
            creep.animate({top: "885px"}, {
                duration: 5000 - Math.random() * 0.5 * zeus.gold,
                step: function(now, fx) {
                    var creep_position = creep.position();
                    var zeus_position = $(_this.ids.zeus_id).position();
                    if (creep_position.top + creep.height() >= zeus_position.top) {
                        if ((creep_position.left < zeus_position.left &&
                            creep_position.left + creep.width() >= zeus_position.left) ||
                            creep_position.left >= zeus_position.left &&
                            creep_position.left <= zeus_position.left + $(_this.ids.zeus_id).width()) {

                            zeus.killCreeps(false, creep);
                            zeus.gold += 43;
                            ++zeus.cs;
                            $(_this.ids.gold_id).text("Gold: " + zeus.gold);
                            $(_this.ids.cs_id).text("CS: " + zeus.cs);
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
    }
    
    this.stop = function() {
        clearInterval(this.spawnInterval);
    }
}



$(document).ready(function() {    
    var zeus = new Zeus({
        zeus_id: "#zeus",
        gold_id: "#gold",
        cs_id: "#cs"
    }, {
        standing: "images/zeus_standing.png",
        standing_top: "800px",
        casting: "images/zeus_casting.png",
        casting_top: "775px",
        coins: "images/gold.png",
        lightning: "images/lightning.png"
    }, {
        thundergodsWrath: "sounds/thundergod",
        coins: "sounds/coins"
    });
    $("#gold").text("Gold: " + zeus.gold);
    $("#cs").text("CS: " + zeus.cs);;
    zeus.enableKeyboard();
    
    var spawnersQueue = [];
    var spawnManager = 0;
    
    setInterval(function() {        
        if (spawnManager < 2) {
            ++spawnManager;
            spawnersQueue.push(new CreepSpawner({
                zeus_id: "#zeus",
                gold_id: "#gold",
                cs_id: "#cs"
            }, "images/creep.png"));
            spawnersQueue[spawnersQueue.length - 1].spawn(zeus);
        } else {
            spawnManager = 0;
            spawnersQueue[0].stop();
            spawnersQueue.shift();
        }
    }, 3000);
});