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
        var imageCreator = new ImageCreator();
        var creep = imageCreator.createImage(null, "creep", _this.creep_image, "creep");
        ++this.spawnedCreeps;
        
        if (Math.random() >= 0.5) {
            _this.flipHorizontally(creep);
        }
        creep.css({
            "left": Math.random() * $("body").width() * 0.93 + "px"
        });
        $("body").append(creep);
        
        creep.animate({top: "785px"}, {
            duration: 7000 - Math.min(Math.random() * 0.5 * zeus.gold, 4000),
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
                        $(zeus.ids.gold_id).text("Gold: " + zeus.gold);
                        
                        creep.css("visibility", "hidden");
                        creep.remove();
                    }
                }
            },
            queue: false,
            complete: function() {
                if (creep.css("visibility") != "hidden") {
                    ++zeus.missed;
                    $(zeus.ids.missed_id).text("Missed: " + zeus.missed);
                    
                    if (zeus.missed == 50) {
//                        window.location.replace("gameover.html");
                    }
                }
                creep.remove();
            }
        });
    }
    
    this.startSpawn = function(zeus) {
        _this = this;
        
        this.spawnInterval = setInterval(function() {
            if (zeus.ultimate.lastUsed != -1 &&
                Date.now() - zeus.ultimate.lastUsed <= 1000) {
                return;
            }
            _this.spawn(zeus);
        }, 5000 - Math.min(0.5 * zeus.gold, 4000));
    }
    
    this.stop = function() {
        clearInterval(this.spawnInterval);
    }
}