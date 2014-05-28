var Zeus = function(ids, images, sounds) {
    this.ids = ids;
    this.images = images;
    this.sounds = sounds;
    
    this.firstSpell = {
        cost: 80,
        cooldown: 1500,
        lastUsed: -1,
        lastFailedAttempt: -1,
        failedAttemptsCount: 0
    };
        
    this.ultimate = {
        cost: 225,
        cooldown: 30000,
        lastUsed: -1,
        lastFailedAttempt: -1,
        failedAttemptsCount: 0
    };
    this.gold = 0;
    this.missed = 0;
    this.xp = 0;
    this.level = 1;
    this.mana = 240;
    this.regenRate = 0.5;
    
    this.treshold = function(level) {
        if (level == 1) {
            return 240;
        }
        if (level <= 6) {
            return 20 * level + this.treshold(level - 1);
        }
        return 120 * level - 80;
    }
        
    this.thundergodsWrath = function() {
        $.playSound(this.sounds.thundergodsWrath);
        
        $(this.ids.zeus_id).attr("src", this.images.casting);
        $(this.ids.zeus_id).css("top", this.images.casting_top);
        _this = this;
        
        setTimeout(function() {
            $(_this.ids.zeus_id).attr("src", _this.images.standing);
            $(_this.ids.zeus_id).css("top", _this.images.standing_top);                
        }, 400);
    }
    
    this.killCreeps = function(usedSpell, target) {
        imageCreator = new ImageCreator();
        target.css("visibility", "hidden");

        if (this.level < 25) {
            this.xp += 12;
            var treshold = this.treshold(this.level);
            if (this.xp >= treshold) {
                this.xp -= treshold;
                ++this.level;
                this.mana = this.treshold(this.level);
                $(this.ids.lvl_id).text("Level: " + this.level);
                $(this.ids.mana_id).text("Mana: " + this.treshold(this.level) + "/" + this.treshold(this.level));
            }
            $(this.ids.xp_id).text("XP: " + this.xp + "/" + this.treshold(this.level));
        }

        if (usedSpell == true) {        
            var lightning = imageCreator.createImage(null, "lightning", this.images.lightning, "lightning");
            lightning.css("position", "absolute");
            lightning.css("top", target.position().top - 10);
            lightning.css("left", target.position().left);
            lightning.insertAfter(target);

            setTimeout(function() {
                $(".lightning").remove();
            }, 175);
        }

        var coins = imageCreator.createImage(null, "coins", this.images.coins, "coins");
        coins.css("position", "absolute");
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
    
    this.compareCreepHeights = function(creep1, creep2) {
        var creep1_position = $(creep1).position();
        var creep2_position = $(creep2).position();
        
        if (creep1_position.top > creep2_position.top) {
            return -1;
        } else {
            if (creep1_position.top < creep2_position.top) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    
    this.regenerate = function() {
        var _this = this;
        
        setInterval(function() {
            var new_mana = Math.min(_this.treshold(_this.level), _this.mana + _this.level * _this.regenRate);
            if (new_mana > _this.mana) {
                _this.mana = new_mana;
                $(_this.ids.mana_id).text("Mana: " + Math.round(_this.mana) + "/" + _this.treshold(_this.level));
            }
        }, 1000);
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
                if (_this.level >= 6) {
                    if (_this.ultimate.lastUsed == -1 || // if there's no cooldown
                        _this.ultimate.lastUsed + _this.ultimate.cooldown <= Date.now()) {
                        if (Math.round(_this.mana) >= _this.ultimate.cost) { // if there's enough mana
                        
                            _this.mana -= _this.ultimate.cost;
                            $(_this.ids.mana_id).text("Mana: " + _this.mana + "/" + _this.treshold(_this.level));
                            _this.ultimate.lastUsed = Date.now();
                            
                            $(_this.ids.thunder_cd).text("30");
                            $(_this.ids.thunder_cd).css("visibility", "visible");
                            var cooldown = setInterval(function() {
                                $(_this.ids.thunder_cd).text(((_this.ultimate.lastUsed + _this.ultimate.cooldown - Date.now()) / 1000).toFixed(0));         
                            }, 100);
                            setTimeout(function() {
                                clearInterval(cooldown);
                                $(_this.ids.thunder_cd).css("visibility", "hidden")
                            }, 30000);

                            _this.thundergodsWrath();
                            var creeps = $(".creep");
                            for (var i = 0; i < creeps.length; ++i) {
                                _this.killCreeps(true, $(creeps[i]));
                                _this.gold += 43;
                                $(_this.ids.gold_id).text("Gold: " + _this.gold);
                                $(creeps[i]).remove(); 
                            } 
                        } else { // no cooldown, but not enough mana
                            
                        }
                    } else { // cooldown

                    }
                }
            }
            else if (e.which == 81) { // Q
                if (_this.firstSpell.lastUsed == -1 || // if there's no cooldown
                    _this.firstSpell.lastUsed + _this.firstSpell.cooldown <= Date.now()) {
                    if (Math.round(_this.mana) >= _this.firstSpell.cost) { // if there's enough mana
                        
                        _this.mana -= _this.firstSpell.cost;
                        $(_this.ids.mana_id).text("Mana: " + _this.mana + "/" + _this.treshold(_this.level));
                        _this.firstSpell.lastUsed = Date.now();
                        
                        $(_this.ids.arc_cd).text("1.50");
                        $(_this.ids.arc_cd).css("visibility", "visible");
                        var cooldown = setInterval(function() {
                            $(_this.ids.arc_cd).text(((_this.firstSpell.lastUsed + _this.firstSpell.cooldown - Date.now()) / 1000).toFixed(2));         
                        }, 100);
                        setTimeout(function() {
                            clearInterval(cooldown);
                            $(_this.ids.arc_cd).css("visibility", "hidden")
                        }, 1500);

                        var creeps = $(".creep");
                        creeps.sort(_this.compareCreepHeights);

                        for (var i = 0; i < Math.min(3, creeps.length); ++i) {
                            _this.killCreeps(true, $(creeps[i]));
                            _this.gold += 43;
                            $(_this.ids.gold_id).text("Gold: " + _this.gold);
                            $(creeps[i]).remove(); 
                        } 
                    } else { // no cooldown, but not enough mana
                    
                    }
                } else { // cooldown
                    
                }
            }
            
        });
    }
}