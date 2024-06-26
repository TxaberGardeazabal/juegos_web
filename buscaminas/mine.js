var gridHeight = 14;
var gridWidth = 14;
var numMines = 50;
var mines = [];
var flags = 0;
var playing = false;

function generateGrid() {
    var html = "<div>minas: <b id=\"flagLabel\"></b></div>";
    html += "<table>";
    for (let i = 0; i < gridHeight; i++) {
        html += "<tr>";
        for (let j = 0; j < gridWidth; j++) {
            html += "<td onmousedown=\"tilePress(event,"+i+","+j+")\"><div id=\""+i+","+j+"\">"+"</td>";
            
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("container").innerHTML = html;
}

function populateGrid() {
    for (let i = 0; i < numMines; i++) {
        var x = Math.floor(Math.random() * gridHeight);
        var y = Math.floor(Math.random() * gridWidth);
        
        var dupe = false;
        for (let j = 0; j < mines.length; j++) {
            var ids = mines[j].split(",");
            if (ids[0] == x && ids[1] == y) {
                dupe=true;
                break;
            }
        }
        if(!dupe) {
            mines[i] = x+","+y;
        } else {
            i--;
        }
    }
    //alert(mines.length);
}

function revealTile(x,y) {
    if (x < 0 || x > gridHeight-1 || y < 0 || y > gridWidth-1) {
        return;
    }

    var id = x+","+y;
    var tile = document.getElementById(id);
    if (tile.classList.contains("open") || tile.classList.contains("flagged")) {
        return;
    }
    tile.classList.add("open");

    if(checkTile(x,y) != 0) {
        tile.style.backgroundImage ="url(assets/mine.png)";
        tile.style.backgroundColor = "maroon";
        playing = false;
        return;
    }

    var numMines = 0;
    numMines += checkTile(x,y+1);
    numMines += checkTile(x+1,y+1);
    numMines += checkTile(x+1,y);
    numMines += checkTile(x+1,y-1);
    numMines += checkTile(x,y-1);
    numMines += checkTile(x-1,y-1);
    numMines += checkTile(x-1,y);
    numMines += checkTile(x-1,y+1);

    if(numMines == 0) {
        revealTile(x,y+1);
        revealTile(x+1,y+1);
        revealTile(x+1,y);
        revealTile(x+1,y-1);
        revealTile(x,y-1);
        revealTile(x-1,y-1);
        revealTile(x-1,y);
        revealTile(x-1,y+1);
        tile.style.backgroundImage = "";
    }
    else {
        tile.style.backgroundImage ="url(assets/"+numMines+".png)";
    }
}

function checkTile(x,y){
    if (x < 0 || x > gridHeight-1 || y < 0 || y > gridWidth-1) {
        return 0;
    }

    var id = x+","+y;
    for (let i = 0; i < mines.length; i++) {
        if(id == mines[i]){
            return 1;
        }
    }
    return 0;
}

function checkWin() {
    var openTiles = 0;
    for (var i = 0; i < gridHeight; i++) {
        for (var j=0;j < gridWidth; j++) {
            var tile = document.getElementById(i+","+j);
            if (tile.classList.contains("open")) {
                openTiles++;
            }
        }
    }
    if ((openTiles + mines.length) == (gridWidth*gridHeight)) {
        revealMines();
        alert("ganaste");
        playing = false;
    }
}

function markTile(x,y) {
    if (x < 0 || x > gridHeight-1 || y < 0 || y > gridWidth-1) {
        return;
    }

    var id = x+","+y;
    var tile = document.getElementById(id);
    if (tile.classList.contains("open")) {
        return;
    } else if(tile.classList.contains("flagged")){
        tile.classList.remove("flagged");
        tile.style.backgroundImage = "";
        flags++;
        document.getElementById("flagLabel").innerHTML = flags;
    } else {
        tile.classList.add("flagged");
        tile.style.backgroundImage = "url(assets/bandera.png)";
        flags--;
        document.getElementById("flagLabel").innerHTML = flags;
    }
}

function revealMines() {
    for (let i = 0; i < numMines; i++) {
        var tile = document.getElementById(mines[i]);

        tile.style.backgroundImage = "url(assets/mine.png)";
        tile.style.backgroundColor = "lime";
    }
}

function tilePress(event,x,y) {
    if(playing) {
        //alert(event.button);
        switch (event.button) {
            case 2:
                markTile(x,y);
                break;
            case 0:
                revealTile(x,y);
            default:
                break;
        }    
        
    }
    if(playing) {
        checkWin();
    }
}

function newGame() {
    gridHeight = document.getElementById("altura").value;
    gridWidth = document.getElementById("anchura").value;
    numMines = document.getElementById("minas").value;
    
    mines = [];
    flags = numMines;
    generateGrid();
    populateGrid();
    document.getElementById("flagLabel").innerHTML = numMines;
    playing = true;
}

newGame();
