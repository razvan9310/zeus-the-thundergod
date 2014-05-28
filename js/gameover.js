$(document).ready(function() {
    var dice = Math.random() * 4;
    if (dice < 1) {
        $("h1").text("You got reported...");
    } else if (dice < 2) {
        $("h1").text("Oh my God, please report Zeus!");
    } else if (dice < 3) {
        $("h1").text("Never play mid again!");
    } else {
        $("h1").text("Seriously... can you even last hit?");
    }
    
    var stats = JSON.parse(localStorage.stats);
    $("#lvl").append(stats.level);
    $("#gold").append(stats.gold);
})