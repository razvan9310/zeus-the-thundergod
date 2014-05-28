$(document).ready(function() {    
    var zeus = new Zeus({
        zeus_id: "#zeus",
        gold_id: "#gold",
        missed_id: "#missed",
        lvl_id: "#lvl",
        xp_id: "#xp",
        mana_id: "#mana"
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
    $("#gold").text("Gold: 0");
    $("#missed").text("Missed: 0");
    $("#lvl").text("LVL: 1");
    $("#xp").text("XP: 0/" + zeus.treshold(1));
    $("#mana").text("Mana: " + zeus.treshold(1) + "/" + zeus.treshold(1));
    
    zeus.enableKeyboard();
    zeus.regenerate();
    
    var spawnersQueue = [];
    var spawnManager = 1;
    
    setInterval(function() {        
        if (spawnManager % 3 != 0) {
            spawnersQueue.push(new CreepSpawner({
                zeus_id: "#zeus",
                gold_id: "#gold",
                missed_id: "#missed"
            }, "images/creep.png"));
            spawnersQueue[spawnersQueue.length - 1].startSpawn(zeus);
        } else {
            spawnersQueue[0].stop();
            spawnersQueue.shift();
        }
        
        ++spawnManager;
        if (spawnManager == 15) {
            for (var i = 0; i < 4; ++i) {
                spawnersQueue[0].stop();
                spawnersQueue.shift();
            }
            spawnManager = 1;
        }
    }, 3000);
});