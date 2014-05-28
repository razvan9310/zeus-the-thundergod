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
        if (zeus.ultimate.lastUsed != -1 &&
            zeus.ultimate.lastUsed - Date.now() <= 1000) {

        }
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
            duration: 8000 - Math.min(Math.random() * 0.5 * zeus.gold, 5000),
            step: function(now, fx) {
                var creep_position = creep.position();
                var zeus_position = $(_this.ids.zeus_id).position();
                if (creep_position.top + creep.height() >= zeus_position.top) {
                    if ((creep_position.left < zeus_position.left &&
                        creep_position.left + creep.width() >= zeus_position.left) ||
                        creep_position.left >= zeus_position.left &&
                        creep_position.left <= zeus_position.left + $(_this.ids.zeus_id).width()) {

                        zeus.killCreeps(false, false, creep);
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
                }
                creep.remove();
            }
        });
    }
    
    this.startSpawn = function(zeus) {
        _this = this;
        
        this.spawnInterval = setInterval(function() {
            if (zeus.ultimate.lastUsed != -1 &&
                zeus.ultimate.lastUsed - Date.now() <= 1000) {
                setTimeout(_this.spawn(zeus), 100);
            } else {
                _this.spawn(zeus);
            }
        }, 5000 - 0.05 * zeus.gold);
    }
    
    this.stop = function() {
        clearInterval(this.spawnInterval);
    }
}