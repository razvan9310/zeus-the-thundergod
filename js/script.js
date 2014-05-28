$(document).ready(function() {    
    $.playSound("sounds/battle_begins_long");
    
    var zeus = new Zeus({
        zeus_id: "#zeus",
        gold_id: "#gold",
        missed_id: "#missed",
        lvl_id: "#lvl",
        xp_id: "#xp",
        mana_id: "#mana",
        arc_cd: "#arc_cooldown",
        thunder_cd: "#ult_cooldown"
    }, {
        standing: "images/zeus_standing.png",
        standing_top: "700px",
        casting: "images/zeus_casting.png",
        casting_top: "675px",
        coins: "images/gold.png",
        lightning: "images/lightning.png"
    }, {
        thundergodsWrath: ("http://hydra-media.cursecdn.com/dota2.gamepedia.com/5/5c/Thundergods_wrath"),
        coins: "sounds/coins"
    });
    $("#gold").text("Gold: 0");
    $("#missed").text("Missed: 0");
    $("#lvl").text("Level: 1");
    $("#xp").text("XP: 0/" + zeus.treshold(1));
    $("#mana").text("Mana: " + zeus.treshold(1) + "/" + zeus.treshold(1));
    
    zeus.enableKeyboard();
    zeus.regenerate();
    
    creepSpawner1 = null;
    creepSpawner2 = null;
    creepSpawner3 = null;
    creepSpawner4 = null;
    var period = 0;
    
    setInterval(function() {
        setTimeout(function() {
            creepSpawner1 = new CreepSpawner({
                zeus_id: "#zeus",
                gold_id: "#gold",
                missed_id: "#missed"
            }, "images/creep.png");
            creepSpawner1.startSpawn(zeus);
            if (period) {
                creepSpawner2.stop();
            }

            setTimeout(function() {
                creepSpawner2 = new CreepSpawner({
                    zeus_id: "#zeus",
                    gold_id: "#gold",
                    missed_id: "#missed"
                }, "images/creep.png");
                creepSpawner2.startSpawn(zeus);
                if (period) {
                    creepSpawner3.stop();
                }

                setTimeout(function() {
                    creepSpawner3 = new CreepSpawner({
                        zeus_id: "#zeus",
                        gold_id: "#gold",
                        missed_id: "#missed"
                    }, "images/creep.png");
                    creepSpawner3.startSpawn(zeus);
                    if (period) {
                        creepSpawner4.stop();
                    }
                    
                    setTimeout(function() {
                        period = 1;
                        creepSpawner4 = new CreepSpawner({
                            zeus_id: "#zeus",
                            gold_id: "#gold",
                            missed_id: "#missed"
                        }, "images/creep.png");
                        creepSpawner4.startSpawn(zeus);
                        if (period) {
                            creepSpawner1.stop();
                        }
                    }, 3000);
                }, 3000);
            }, 3000);
        }, 3000);
    }, 3000);
});