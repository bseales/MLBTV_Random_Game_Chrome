$( document ).ready(function() {
    $("#goButton").on('click', function(){
        getGames($("#teamSelect").val(), $("#seasonSelect").val());
    });
    
    // Pings MLB API to get a list of games for a given team.
    function getGames(teamID, year) {
        var url = "https://statsapi.mlb.com/api/v1/schedule?lang=en&sportId=1&season=" + year + "&startDate=" + year + "-03-24&endDate=" + year + "-10-30&teamId=" + teamID + "&eventTypes=primary&scheduleTypes=games";
        var gamesList = [];
        fetch(url).then((resp)=>{ return resp.json() }).then((json)=>{ 
            _.each(json.dates, function(date) {
                gamesList.push({
                    "date": date.date.replace("-", "/").replace("-", "/"),
                    "gameID": date.games[0].gamePk,
                    "isHome": date.games[0].teams.home.team.id == teamID
                });
            })
            var random = Math.floor(Math.random() * gamesList.length - 1);
            var urlDate = (gamesList[random].date);
            var tvURL = "https://cors-anywhere.herokuapp.com/https://www.mlb.com/live-stream-games/" + urlDate;
            fetch(tvURL).then((resp)=>{ return resp.text() }).then((html)=>{ 
                // If the selected team is away, they have the first link. Otherwise they have the second link.
                var htmlIndexOfGameURL = gamesList[random].isHome ? html.indexOf("https://www.mlb.com/tv/g" + gamesList[random].gameID, html.indexOf("https://www.mlb.com/tv/g" + gamesList[random].gameID) + 68) : html.indexOf("https://www.mlb.com/tv/g" + gamesList[random].gameID);
                var newURL = html.substring(htmlIndexOfGameURL, htmlIndexOfGameURL + 68);
                chrome.tabs.create({ url: newURL });
            });
        });
    }

});
