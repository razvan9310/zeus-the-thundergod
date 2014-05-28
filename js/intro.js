$(document).ready(function() {
    var canvas = $("canvas")[0];
    var ctx = canvas.getContext("2d");
    
    
    var z = [[5, 5], [65, 5], [5, 100], [65, 100]];
    ctx.beginPath();
    for (var i = 0; i < 3; ++i) {
        ctx.moveTo(z[i][0], z[i][1]);
        ctx.lineTo(z[i + 1][0], z[i + 1][1]);
        ctx.stroke();
    }
    ctx.closePath();
    
    var e = [[135, 5], [75, 5], [105, 52.5], [75, 100], [135, 100]];
    ctx.beginPath();
    for (var i = 0; i < 4; ++i) {
        ctx.moveTo(e[i][0], e[i][1]);
        ctx.lineTo(e[i + 1][0], e[i + 1][1]);
        ctx.stroke();
    }
    ctx.closePath();
    
    var u = [[145, 5], [145, 100], [205, 100], [205, 5]];
    ctx.beginPath();
    for (var i = 0; i < 3; ++i) {
        ctx.moveTo(u[i][0], u[i][1]);
        ctx.lineTo(u[i + 1][0], u[i + 1][1]);
        ctx.stroke();
    }
    ctx.closePath();
    
    var s = [[275, 5], [215, 37], [275, 68], [215, 100]];
    ctx.beginPath();
    for (var i = 0; i < 3; ++i) {
        ctx.moveTo(s[i][0], s[i][1]);
        ctx.lineTo(s[i + 1][0], s[i + 1][1]);
        ctx.stroke();
    }
    ctx.closePath();
    
    setTimeout(function() {
        window.location.replace("game.html");
    }, 5000);
})