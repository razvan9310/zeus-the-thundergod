$(document).ready(function() {
    var stats = JSON.parse(localStorage.stats);
    $("#lvl").append(stats.level);
    $("#gold").append(stats.gold);
})