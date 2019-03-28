var gameList = [];

function addGame(name, by, byStaff = false, thumbnail = "media/NoThumbnail.png", link = "javascript:alert('Sorry! This game is unavailable.');", verified = false, byGPPro = false) {
    $("#gameLoader").hide();

    if (verified) {
        $("#gameList").append(`
            <a class="hidden">
                <div class="item gameItem">
                    <div class="itemThumbnailHolder">
                        <img src="media/NoThumbnail.png" class="itemThumbnail" />
                    </div>
                    <h2 class="cutOff"><span class="itemTitle">Loading...</span> <i class="material-icons">verified_user</i></h2>
                    <span class="gameByPrefix"></span><span class="gameBy">Loading...</span>
                </div>
            </a>
        `);
    } else {
        $("#gameList").append(`
            <a class="hidden">
                <div class="item gameItem">
                    <div class="itemThumbnailHolder">
                        <img src="media/NoThumbnail.png" class="itemThumbnail" />
                    </div>
                    <h2 class="cutOff"><span class="itemTitle">Loading...</span></h2>
                    <span class="gameByPrefix"></span><span class="gameBy">Loading...</span>
                </div>
            </a>
        `);
    }

    $("#gameList").children().last().find(".itemTitle").text(name);
    $("#gameList").children().last().find(".gameByPrefix").text("By ");
    $("#gameList").children().last().find(".gameBy").text(by);
    
    if (byStaff) {
        $("#gameList").children().last().find(".gameBy").css("color", "#27ef70");
    } else if (byGPPro) {
        $("#gameList").children().last().find(".gameBy").css("color", "#b3c20f");
    }

    $("#gameList").children().last().find("img").attr("src", thumbnail);
    $("#gameList").find("a").last().attr("href", link);
}

function showAll() {
    $("#gameList").html("");

    $("#gameLoader").show();

    firebase.database().ref("games").orderByChild("verified").equalTo(false).limitToLast(24).on("value", function(snapshot) {
        gameList = [];

        snapshot.forEach(function(childSnapshot) {
            gameList.unshift(childSnapshot.val());
            gameList[0]["key"] = childSnapshot.key;
        });

        $("#gameList").html("");

        if (gameList.length == 0) {
            $("#gameLoader").hide();
            $("#gameList").html("<h3 class='center'>There aren't any games to verify at the moment.</h3>");
        } else {
            for (var i = 0; i < gameList.length; i++) {
                if (gameList[i]["by"] == undefined) {
                    addGame(gameList[i]["title"], "Anonymous", gameList[i]["thumbnail"], "game.html?play=" + gameList[i]["key"], gameList[i]["verified"]);
                } else {
                    addGame(gameList[i]["title"], gameList[i]["by"].substring(0, 30), gameList[i]["byStaff"], gameList[i]["thumbnail"], "game.html?play=" + gameList[i]["key"], gameList[i]["verified"], isGameProxyPro(gameList[i]["uid"]));
                }
            }
        }
    });
}

$(function() {
    showAll();
});