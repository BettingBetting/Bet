var webSocket =
       new WebSocket('ws://134.17.25.120:28081/betting/webSocketFeed');
	 // new WebSocket('ws://127.0.0.1:28081/betting/webSocketFeed');

    webSocket.onerror = function(event) {
    };

    webSocket.onopen = function(event) {
    };

    webSocket.onmessage = function(event) {
      onMessage(event);
    };
var soccerSportName = "soccer";
var tennisSportName = "tennis";
var basketballSportName = "basketball";
var icehockeySportName = "icehockey";
var handballSportName = "handball";
var volleyballSportName = "volleyball";
var rugbySportName = "rugby";
var sportList = {}; // soccer = {matchid = []; matchid = []}
sportList[soccerSportName] = {};
sportList[tennisSportName] = {};
sportList[basketballSportName] = {};
sportList[icehockeySportName] = {};
sportList[handballSportName] = {};
sportList[volleyballSportName] = {};
sportList[rugbySportName] = {};

var sportsCountries = {}; // soccer = {italy = 12, spain = 3 }
sportsCountries[soccerSportName] = {};
sportsCountries[tennisSportName] = {};
sportsCountries[basketballSportName] = {};
sportsCountries[icehockeySportName] = {};
sportsCountries[handballSportName] = {};
sportsCountries[volleyballSportName] = {};
sportsCountries[rugbySportName] = {};

var openedLeftSideBars = {};
openedLeftSideBars[soccerSportName] = false;
openedLeftSideBars[tennisSportName] = false;
openedLeftSideBars[basketballSportName] = false;
openedLeftSideBars[icehockeySportName] = false;
openedLeftSideBars[handballSportName] = false;
openedLeftSideBars[volleyballSportName] = false;
openedLeftSideBars[rugbySportName] = false;

var countrySportFilter = {}; //{sport : countries{  }, count }
//matchid of opened in details match
var openedId;

function onMessage(event) {

    if (onMessage.counter === undefined) {
        onMessage.counter = 0;
        onInitMessageHandler(event);
       onUpdateMessageHandler(event);
	}
	else{
        onUpdateMessageHandler(event);
	}
}

function onInitMessageHandler(event) {
    hideAllAtStart();
    var matches = JSON.parse(event.data);
    for(var i = 0; i < matches.length; i++){
        if(matches[i].Odds === undefined) continue;//remove not match info json
        addNewMatchObject(matches[i]);
    }
}

function onUpdateMessageHandler(event) {

    var matches = JSON.parse(event.data);
    for(var i = 0; i < matches.length; i++){
        if(matches[i].Odds === undefined) continue;
        updateMatchObject(matches[i]);
    }
}





function addNewMatchObject(match){
    if(match.Odds === undefined || match.Odds.length < 1){//return if no match odds
        return;
    }
    try {
        match.Odds = formatOdds(match);
        sportList[match.sportdescriptor][match.matchid] = match;
        match.contentItem = makeContentWithTable(match);
        updateCountriesList(match.sportdescriptor, match.country, true);
        appendMatchContentToContainer(match);
    }
    catch(e) {};
}




function updateMatchObject(match){

    if(sportList[match.sportdescriptor] === undefined){//return if sport name undefined
        if((match.status === "Ended" || match.status === "Stopped") && match.matchid !== undefined && match.matchid !== null){

            for(sport in sportList){
                if(sportList[sport][match.matchid] !== undefined){
                    match.sportdescriptor = sport;
                    match.country = sportList[sport][match.matchid].country;
                    removeMatch(match);
                    return;
                }
            }
        }
        return;
    }



    if(sportList[match.sportdescriptor][match.matchid] === undefined){//if no match with this matchid - make new match content
        addNewMatchObject(match);
        return;
    }

    if( match.status === "Stopped"){//delete match and return if no match odds or match is ended
        removeMatch(match);
        return;
    }


    if(match.Odds.length < 1 || match.status === "Ended" || match.status === "Stopped"){//delete match and return if no match odds or match is ended
        removeMatch(match);

        return;
    }

    match.Odds = formatOdds(match);
    var tmpOldMatch = sportList[match.sportdescriptor][match.matchid];
    tmpOldMatch.contentItem.remove();
    setUpDownOdd(tmpOldMatch.Odds, match.Odds);
    sportList[match.sportdescriptor][match.matchid] = match;
    //if odd was deleted, remove betSlip from match
    if(bsSingleList[match.matchid] !== undefined){
        var isDeletedOdd = true;
        for(var i = 0; i < match.Odds.length; i++){
            if(match.Odds[i].betTitle === bsSingleList[match.matchid].betTitle){
                isDeletedOdd = false;
                break;
            }
        }
        if(isDeletedOdd){
            removeSingleBsItemFromList(match.matchid);
        }
    }






    match.contentItem = makeContentWithTable(match);
    appendMatchContentToContainer(match);
    if(match.matchid === openedId){
        makeDetails(match);
    }

}






function removeMatch(match){

    if(match.matchid === openedId){
        $('.details-back').click();
    }
    sportList[match.sportdescriptor][match.matchid].contentItem.remove();
    delete sportList[match.sportdescriptor][match.matchid];
    updateCountriesList(match.sportdescriptor, match.country, false);
    if(bsSingleList[match.matchid] !== undefined){
        removeSingleBsItemFromList(match.matchid);
    }

}


//show match content and table
function appendMatchContentToContainer(match){
    sportContainer =  $('#' + match.sportdescriptor + '-content-container');
    //sportContainer.append(match.contentItem);
    sortAndShow(match.sportdescriptor, sportContainer);
}

//making content and table for match
function makeContentWithTable(match){
    var matchid = match.matchid;
    var matchminute = match.matchminute;
    var periodinfo = match.periodinfo;
    var commands = match.home + " - " + match.away;
    var score = match.score || " ";
    var tournament = match.tournament;
    var country = match.country;
    var sportName = match.sportdescriptor;
    var isBetStatus = match.Odds.isBetStatus;
    var contentDiv = document.createElement('div');
    contentDiv.setAttribute("class", "stats-item");
    contentDiv.setAttribute("id", matchid);
    var statsItemInfoDiv = document.createElement('div');
    var status=match.status;

    try{
        /**********************************************************/

        if( status=="Stopped" && periodinfo != 'Paused'){
         var   color_class="";
            color_class='gray';
        } else {
            if (periodinfo == "Not Started" || status == 'NotStarted') {
                color_class = "";
                color_class = 'red';
            }else {
                color_class = ColorStatsItemInfo(sportName, periodinfo, matchminute, score);
            }

            if ( periodinfo == 'Paused' && status!="Stopped") {
                color_class = "";
                color_class = 'yellow';
            }
        }

        /***********************************************************************/
    } catch(e){}

    statsItemInfoDiv.setAttribute("class", "stats-item-info " + color_class);
        var statsItemInfoTopDiv = document.createElement('div');
        statsItemInfoTopDiv.setAttribute("class", "stats-item-info-top");
        var statsItemInfoBottomDiv = document.createElement('div');
       statsItemInfoBottomDiv.setAttribute("class", "stats-item-info-bottom");

    /*****************************************************************************************/
    statsItemInfoBottomDiv.setAttribute("class", "stats-item-info-bottom");

    /*if(status!="Stopped") {
        console.log(status);
    }*/


    if(status!="Stopped") {
        if(sportName != "tennis" && sportName != "volleyball"){

            statsItemInfoTopDiv.innerHTML = matchminute + "<br> min";
            statsItemInfoBottomDiv.innerHTML = periodinfo
        }else{
            if(periodinfo != "Not Started") {
                statsItemInfoTopDiv.innerHTML = "Set";
                statsItemInfoBottomDiv.innerHTML = periodinfo.split(' ')[0];
            }else {
                statsItemInfoTopDiv.innerHTML = "Not";
                statsItemInfoBottomDiv.innerHTML= "Started";
            }
        }
    }else
    {
        if(periodinfo != 'Paused') {
            if (sportName != "tennis" && sportName != "volleyball") {
                statsItemInfoTopDiv.innerHTML = matchminute + "<br> min";
                statsItemInfoBottomDiv.innerHTML ="Stopped" + "<br>" + periodinfo;
            } else {
                statsItemInfoTopDiv.innerHTML = "Set";
                statsItemInfoBottomDiv.innerHTML = "Stopped"
            }
            if (periodinfo == "Not Started") {
                statsItemInfoTopDiv.innerHTML = "Not";
                statsItemInfoBottomDiv.innerHTML = "Started";
            }

        }
    }




    /*******************************************************************************/
    statsItemInfoDiv.appendChild(statsItemInfoTopDiv);
    statsItemInfoDiv.appendChild(statsItemInfoBottomDiv);
    var statsItemContentDiv = document.createElement('div');
    statsItemContentDiv.setAttribute("class", "stats-item-content");
        var statsItemHeaderDiv = document.createElement('div');
        statsItemHeaderDiv.setAttribute("class", "stats-item-header");
        statsItemHeaderDiv.innerHTML = commands;
        var table = document.createElement('table');
        table.setAttribute("class", "stats-item-table");
        table.setAttribute("id", matchid + "Table");
            var tr1 = document.createElement('tr');
                var td1 = document.createElement('td');
                    var span1 = document.createElement('span');
                    span1.innerHTML = score;
                td1.appendChild(span1);
            tr1.appendChild(td1);
            var tr2 = document.createElement('tr');
                var td2 = document.createElement('td');
                    var span2 = document.createElement('span');
                    span2.innerHTML = tournament;
                td2.appendChild(span2);
            tr2.appendChild(td2);
        table.appendChild(tr1);
        table.appendChild(tr2);
    statsItemContentDiv.appendChild(statsItemHeaderDiv);
    statsItemContentDiv.appendChild(table);
    contentDiv.appendChild(statsItemInfoDiv);
    contentDiv.appendChild(statsItemContentDiv);
    //add odd columns to table, max 3.
    for(var i = 0; i < match.Odds.length; i++){
        if (i < 3)
        {
            addColumn(table, match.Odds[i], i, sportName, matchid);
        }else{
            break;
        }
    }
    makeAddDetailsBtn(table, match.Odds.length - 3, sportName, matchid);
    return contentDiv;
}






//add column to match table
function addColumn(table, odd, oddPos, sportName, matchid, isDeletedOdd){
	var rows = table.rows;
    var isBetStatus = odd.isBetStatus;
	var td0 = document.createElement('td');
	var colspanV = odd.tags.length;
    td0.setAttribute("colspan", colspanV + "");
    td0.innerHTML = odd.betTitle;
    table.rows[0].appendChild(td0);
     for(var i = 0; i < odd.tags.length; i++){
            var divBClass = 'stats-table-result-bottom'+' '+ 'isBetStatus'+isBetStatus;
            var td = document.createElement('td');
            td.setAttribute("style", "width: 6rem");
            if(colspanV == 2){
              td.setAttribute("style", "width: 9rem");
            }
            var divT = document.createElement('div');
            divT.setAttribute("class", "stats-table-result-top");
            var divB = document.createElement('div');
            divB.setAttribute("id", matchid + "_odd_" + oddPos + "_" + i );
            //check is odd was clicked



            if(bsSingleList[matchid] !== undefined){
                var divBClass = 'stats-table-result-bottom light-gray'+' '+ 'isBetStatus'+isBetStatus;
                if (bsSingleList[matchid].betTitle == odd.betTitle && bsSingleList[matchid].tag == odd.tags[i] ) {
                        divBClass = 'stats-table-result-bottom red' + ' ' + 'isBetStatusC' +isBetStatus;
                        bsSingleList[matchid].clickedOdd = divB;
                        bsSingleList[matchid].value = odd.values[i];
                        updateBsItems(matchid, bsSingleList[matchid]);
                    }
            }

/***************************************************************************************************/

         if(bsSingleList[matchid] !== undefined && bsSingleList[matchid].betTitle == odd.betTitle  ) {
             if (odd.isBetStatus !="I") {
                 $('#' + matchid + betSlipItemId).removeClass('light-gray');
             }else {
                 $('#' + matchid + betSlipItemId).addClass('light-gray');
             }
         }

         if(!odd.isClickable[i]){
                 divBClass = "stats-table-result-top";
                    }else{
                 divB.setAttribute("onclick", "oddClickI(this," + i + "," + oddPos + ",'" + sportName + "'," + matchid + ")");
             }
/*****************************************************************************************************/
            divB.setAttribute("class", divBClass);
            var img = document.createElement('img');
            table.rows[1].appendChild(td);
            td.appendChild(divT);
            td.appendChild(divB);
            divT.innerHTML = odd.tags[i];
            divB.innerHTML = odd.values[i];
            if ( odd.updown[i] == 0){
                img.setAttribute("src","img/arrow-green.svg");
                img.setAttribute("class","stats-arrow up");
                divB.appendChild(img);
            }
            if ( odd.updown[i] == 1){
                img.setAttribute("src","img/arrow-red.svg");
                img.setAttribute("class","stats-arrow up");
                divB.appendChild(img);
            }
        }

}




function makeAddDetailsBtn(table, num, sportName, matchid){
    if(num < 1) {
        num = 0;
    }
   var td = document.createElement('td');
   td.setAttribute("rowspan","2");
   var a = document.createElement('a');
   a.setAttribute("href","#");
   a.setAttribute("class","go-details");
   a.setAttribute("onclick", "goDetailsClick(" + matchid + ", '" + sportName + "')");
   var div = document.createElement('div');
   var img = document.createElement('img');
   img.setAttribute("src","img/stats-arrow-right.svg");
   img.setAttribute("class","stats-arrow-right");
   td.appendChild(a);
   a.appendChild(div);
   a.appendChild(img)
   div.innerHTML = "+" + num;
   var row = table.rows[0];
   row.appendChild(td);
}


//need to refactor
function setUpDownOdd(oddsOld, oddsNew){
    for(var i = 0; i < oddsNew.length; i++){
        for ( var k = 0; k < oddsOld.length; k++ ) {
            if( oddsNew[i].betTitle === oddsOld[k].betTitle ) {
                for ( var x = 0; x < oddsNew[i].values.length; x++ ) {
                    if ( oddsNew[i].values[x] > oddsOld[k].values[x] ) {
                        oddsNew[i].updown[x] = 0;
                        return;
                    }
                    if ( oddsNew[i].values[x] < oddsOld[k].values[x] ) oddsNew[i].updown[x] = 1;
                }
            }
        }
    }
}
//isAdd: true - add, false - delete
function updateCountriesList(sportName, countryName, isAdd){
    var  countryNameFull = countryName; //country name with spaces
    countryName = countryName.replace(/\s/g, '');//remove spaces from country name, for id
    if(isAdd){
        if(sportsCountries[sportName][countryName] === undefined){
            sportsCountries[sportName][countryName] = 1;
            makeSportCountriesList(sportName, countryName, countryNameFull);
            sortCountriesList(sportName);
        } else{
            sportsCountries[sportName][countryName] = sportsCountries[sportName][countryName] + 1;
        }
        $('#' + sportName + '-' + countryName + '-countries-sport-count')[0].innerHTML = sportsCountries[sportName][countryName];
    } else {
        if(sportsCountries[sportName][countryName] !== undefined){
            sportsCountries[sportName][countryName] = sportsCountries[sportName][countryName] - 1;
            $('#' + sportName + '-' + countryName + '-countries-sport-count')[0].innerHTML = sportsCountries[sportName][countryName];
            if(sportsCountries[sportName][countryName] < 1){
                delete sportsCountries[sportName][countryName];
                $('#' + sportName + '-' + countryName + "-item-country").remove();
                if(countrySportFilter[sportName] !== undefined && countrySportFilter[sportName][countryName] !== undefined) {
                    delete countrySportFilter[sportName][countryName];
                    countrySportFilter[sportName].count -= 1;
                }
            }
        }
    }
    var count = countSportMatches(sportName);
    if(count < 1){
        rollupSportsItemHeader(sportName);
        hideSport(sportName);
    } else {
        showSport(sportName);
    }
    $('#' + sportName + '-matches-count')[0].innerHTML = count;
}

function countSportMatches(sportName){
    t = Object.keys(sportList[sportName]).length;
    return Object.keys(sportList[sportName]).length;
}

function showSport(sportName){
    $('#' + sportName + '-left-side-bar').show();
}

function hideSport(sportName){
    $('#' + sportName + '-header').hide();
    $('#' + sportName + '-content-container').hide();
    $('#' + sportName + '-left-side-bar').hide();
}



function rollupSportsItemHeader(sportName) {
    var item = $('#' + sportName + '-left-item-header');
    $(item).find('.sports-arrow').removeClass('active');
    $('#' + sportName + '-matches-count').show();
    $('#' + sportName + '-countries-list').hide();
    openedLeftSideBars[sportName] = false;
}

function hideAllAtStart(){
    for(sportName in sportList){
        hideSport(sportName);
    }
}

function makeSportCountriesList(sportName, countryName, countryNameFull){
        var listTag = $('#' + sportName + '-countries-list')[0];
        var li = document.createElement('li');
        li.setAttribute("class", "sports-item-country");
        li.setAttribute("id", sportName + '-' + countryName + "-item-country");
        li.setAttribute("onclick", 'countryFilterClick(this)');
//        li.setAttribute("for", sportName + '-' + countryName);
            var div = document.createElement('div');
            div.setAttribute("class", "country-checkbox");
//                var input = document.createElement('input');
//                input.setAttribute("type", "checkbox");
//                input.setAttribute("id", sportName + '-' + countryName);
                var label1 = document.createElement('label');
                label1.setAttribute("class", "fake-checkbox");
//                label1.setAttribute("for", sportName + '-' + countryName);
//                label1.setAttribute("onclick", 'countryFilterClick(this)')
                var label2 = document.createElement('label');
                label2.setAttribute("class", "sports-item-country-text");
//                label2.setAttribute("for", sportName + '-' + countryName);
//                label2.setAttribute("onclick", 'countryFilterClick(this)');
                label2.innerHTML = countryNameFull;
//            div.appendChild(input);
            div.appendChild(label1);
            div.appendChild(label2);
            var divBadge = document.createElement('div');
            divBadge.setAttribute("class", "sports-item-badge-2");
            divBadge.setAttribute("id", sportName + '-' + countryName + '-countries-sport-count');
        li.appendChild(div);
        li.appendChild(divBadge);
        listTag.appendChild(li);
}




function filterSport(sportName){
    $('#' + sportName + '-content-container')[0].innerHTML = "";
    if(countrySportFilter[sportName] != undefined && countrySportFilter[sportName].count > 0){
        for(match in sportList[sportName]){
            var country = sportList[sportName][match].country.replace(/\s/g, ''); //country name without spaces;
            if(countrySportFilter[sportName][country]){
                appendMatchContentToContainer(sportList[sportName][match]);
            }
        }
    }else{
        for(match in sportList[sportName]){
            appendMatchContentToContainer(sportList[sportName][match]);
        }
    }
}




function sortCountriesList(sportName){
    var ul = $('#' + sportName + '-countries-list')[0];
    var new_ul = ul.cloneNode(false);
    // Add all lis to an array
    var lis = [];
    for(var i = ul.childNodes.length; i--;){
        if(ul.childNodes[i].nodeName === 'LI')
            lis.push(ul.childNodes[i]);
    }
    // Sort the lis in descending order
    lis.sort(function(a, b){
        var contentA = a.textContent;
        var contentB = b.textContent;
        return (contentA > contentB) ? 1 : (contentA < contentB) ? -1 : 0;
    });
    // Add them into the ul in order
    for(var i = 0; i < lis.length; i++)
        new_ul.appendChild(lis[i]);
    ul.parentNode.replaceChild(new_ul, ul);
}



function sortAndShow(sportName, sportContainer) {
    var matchList = [];
    for (matchid in sportList[sportName]) {
        var match = sportList[sportName][matchid];
        /*   if(match.status === "Stopped"){
         return;
         }*/
        //show if country in filter
        if (countrySportFilter[match.sportdescriptor] !== undefined && countrySportFilter[match.sportdescriptor].count > 0 && countrySportFilter[match.sportdescriptor][match.country.replace(/\s/g, '')] === undefined) {
        } else {
            matchList.push(match);
        }
    }

    if (match.status != "Stopped") {

        matchList.sort(function (a, b) {
        var contentA = a.matchminute;
        var contentB = b.matchminute;

        if (a.sportdescriptor != tennisSportName || a.sportdescriptor != volleyballSportName) {

            if (contentA > contentB && contentA - contentB < 1) {
                contentA = "";
                contentB = "";
            }

            if (contentB > contentA && contentB - contentA < 1) {
                contentA = "";
                contentB = "";
            }
            if (contentB == contentA) {
                contentA = a.matchminute;
                contentB = b.matchminute;
            }
            if (contentA === "Not" || contentA === "Paused" || contentA === "Not Started") {
                contentA = "";
            }
            if (contentB == "Not" || contentB === "Paused" || contentB === "Not Started") {
                contentB = "";
            }
            return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
        } else {

            if (a.sportdescriptor === tennisSportName || a.sportdescriptor === volleyballSportName) {
                var contentA = a.periodinfo;
                var contentB = b.periodinfo;

            }

            if (a.sportdescriptor === tennisSportName || a.sportdescriptor === volleyballSportName) {


                if (contentA === "Not" || contentA === "Paused" || contentA === "Not Started") {
                    contentA = "";
                }
                if (contentB == "Not" || contentB === "Paused" || contentB === "Not Started") {
                    contentB = "";
                }
            }
            return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
        }


    });
}



    var itemList = [];
    for(var i =0; i < matchList.length; i++){
        var t = matchList[i].contentItem;
        matchList[i].contentItem.remove();
        sportContainer.append(matchList[i].contentItem);
    }
}





function ColorStatsItemInfo(sportName, periodinfo, matchminute, score) {
    var color="";
    switch (sportName) {
        case basketballSportName:
            var periodinfo_clear = parseInt(periodinfo.split(' ')[0].replace(/\D+/g, ""));
            if (periodinfo_clear == 1 && matchminute > 9) {
                color = 'red';
            } else if (periodinfo_clear == 2 && matchminute > 18) {
                color = 'red';
            } else if (periodinfo_clear == 3 && matchminute > 28) {
                color = 'red';
            } else if (periodinfo_clear == 4 && matchminute > 38) {
                color = 'red';
            } else {
                color = 'green';
            }
            break;



        case tennisSportName:
            color = 'green';
            var ScoreClearString = score.split(' ')[1];
            if (ScoreClearString != 'undefined') {
                ScoreClearString = ScoreClearString.split('(');
                if (ScoreClearString[1] != 'undefined') {
                    ScoreClearString = ScoreClearString[1].split(')');
                    if (ScoreClearString[0] != 'undefined') {
                        var IntSoccerElements = ScoreClearString[0].split('-');
                    }
                }
            }

            for (var i = 0; i < IntSoccerElements.length; i++) {
                var   IntSoccerElem=IntSoccerElements[IntSoccerElements.length-1];
                var IntSoccerElem1 = parseInt(IntSoccerElem.split(':')[1]);
                var  IntSoccerElem2 = IntSoccerElem=parseInt(IntSoccerElem.split(':')[0]);

                if (IntSoccerElem1> 4) {
                    color = 'red';
                    break;
                }
                if (IntSoccerElem2> 4) {
                    color = 'red';
                    break;
                }
            }

            ScoreClearString2= score.split(' ')[0];

            ScoreClearString = score.split(' ')[1];
            if( ScoreClearString=="(0:0)" ){
                color = 'green';
            }
            if( ScoreClearString2=="0:0" && IntSoccerElem1==" " || ScoreClearString2=="0:0" && IntSoccerElem2==" " ){
                color = 'green';
            }
            /*if( ScoreClearString2=="0:0"){
                color = 'green';
            }*/



            if (periodinfo == 'Not Started') {
                color="";
                color = 'red';
            }
            break;




        case soccerSportName:
            if (matchminute > 29 && matchminute < 46) {
                color = 'red';
            }
            else if (matchminute > 74 && matchminute < 91) {
                color = 'red';
            }
            else {
                color = 'green';
            }
            break;
        case volleyballSportName:
               color = 'green';
            var ScoreClearString = score.split(' ')[1];
            if (ScoreClearString != 'undefined') {
                ScoreClearString = ScoreClearString.split('(');
                if (ScoreClearString[1] != 'undefined') {
                    ScoreClearString = ScoreClearString[1].split(')');
                    if (ScoreClearString[0] != 'undefined') {
                        var IntSoccerElements = ScoreClearString[0].split('-');
                    }
                }
            }
            for (var i = 0; i < IntSoccerElements.length; i++) {
                var   IntSoccerElem=IntSoccerElements[IntSoccerElements.length-1];
                var IntSoccerElem1 = parseInt(IntSoccerElem.split(':')[1]);
                var  IntSoccerElem2 = IntSoccerElem=parseInt(IntSoccerElem.split(':')[0]);
                if(typeof(IntSoccerElem1) != NaN) {
                    if (IntSoccerElem1> 20) {
                        color = 'red';
                        break;
                    }
                }
                if(typeof(IntSoccerElem2) != NaN) {
                    if (IntSoccerElem2> 20) {
                        color = 'red';
                        break;
                    }
                }
            }
            var ScoreClearString = score.split(' ')[1];
            var ScoreClearString2= score.split(' ')[0];


            if( ScoreClearString=="(0:0)"){
                color = 'green';
            }
            if( ScoreClearString2=="0:0" && IntSoccerElem1==0 || ScoreClearString2=="0:0" && IntSoccerElem2==0 ){
                color = 'green';
            }
            if (periodinfo == 'Not Started') {
                color="";
                color = 'red';
            }
            break;






        case icehockeySportName :
            if (matchminute > 14 && matchminute < 21) {
                color = 'red';
            }
            else if (matchminute > 34 && matchminute < 41) {
                color = 'red';
            }
            else if (matchminute > 54 && matchminute < 61) {
                color = 'red';
            }
            else {
                color = 'green';
            }
            break;



        case handballSportName :
            if (matchminute > 24 && matchminute < 31) {
                color = 'red';
            }
            else if (matchminute > 54 && matchminute < 61) {
                color = 'red';
            }
            else {
                color = 'green';
            }
            break;




        case rugbySportName :
            if (matchminute > 29 && matchminute < 41) {
                color = 'red';
            }
            else if (matchminute > 69 && matchminute < 81) {
                color = 'red';
            }
            else {
                color = 'green';
            }
            break;
    }
    return color;

}







function goDetailsClick(id, sportName) {
    openedId = id;
    makeDetails(sportList[sportName][id]);
    $('.content-center-main').hide();
    $('.content-center-details').fadeIn();
    if (sportName == volleyballSportName || sportName ==tennisSportName ) {
        $(".details-info-top").css('display', 'none');
    } else {
        $(".details-info-top").css('display', '-webkit-box');
        $(".details-info-top").css('display', '-ms-flexbox');
        $(".details-info-top").css('display', 'flex');
    }
}




//details inset
function makeDetails(match){
    var matchminute = match.matchminute;
    var sportName = match.sportdescriptor;
    var periodinfo = match.periodinfo;
    var score = match.score || " ";
    var commands = match.home + " - " + match.away;
    //если заголовок >36--перенос
    if(commands.length > 36){
        commands = match.home + " - <br>" + match.away;
    }
    //get url icon for head
    var icon_path = getUrlImgSport(sportName);
    var x = $(".content-center-details .details-term");
    x[0].innerHTML = periodinfo;
    $(".content-center-details .details-sport-icon")[0].src= icon_path;
    $(".content-center-details .details-header-content")[0].innerHTML = commands;
    $(".content-center-details .score")[0].innerHTML = score;
    $(".content-center-details .match-time")[0].innerHTML = matchminute + " min";
    $(".content-center-details .details-bets-table")[0].innerHTML = "";
    for(var i = 0; i < match.Odds.length; i++){
        addColumnToDetailsTable(match.Odds[i], i, sportName, match.matchid);
    }
}





function addColumnToDetailsTable(odd, oddPos, sportName, matchid){
    var isBetStatus = odd.isBetStatus;
    var tBody = $(".content-center-details .details-bets-table")[0];
    var tr = document.createElement('tr');
    tr.setAttribute("class", "details-bet-item");
    var td0 = document.createElement('td');
    td0.setAttribute("class", "details-bet-item-header");
    var colspanV = 4 - odd.tags.length;
    for(var i = 0; i < odd.tags.length; i++){
        if(!odd.isClickable[i]) colspanV = colspanV + 1;
    }
    td0.setAttribute("colspan", colspanV + "");
    tBody.appendChild(tr);
    tr.appendChild(td0);
    td0.innerHTML = odd.betTitle;
    for(var i = 0; i < odd.tags.length; i++){
        if(!odd.isClickable[i]) continue;
        var divBClass = 'stats-table-result-bottom'+' '+ 'isBetStatus'+isBetStatus;
        var td = document.createElement('td');
        var divT = document.createElement('div');
        divT.setAttribute("class", "stats-table-result-top");
        var divB = document.createElement('div');
        divB.setAttribute("id", "de" + matchid + "_odd_" + oddPos + "_" + i );

        if (isBetStatus != "I") {
            $('#' + matchid + betSlipItemId).removeClass('light-gray');
        }else {
            $('#' + matchid + betSlipItemId).addClass('light-gray');
        }
            if (bsSingleList[matchid] !== undefined) {
                var divBClass = 'stats-table-result-bottom light-gray'+' '+ 'isBetStatus'+isBetStatus;
                if (bsSingleList[matchid].betTitle == odd.betTitle && bsSingleList[matchid].tag == odd.tags[i]) {
                    divBClass = 'stats-table-result-bottom red' + ' ' + 'isBetStatusC'+isBetStatus;
                    bsSingleList[matchid].clickedOddD = divB;
                    bsSingleList[matchid].value = odd.values[i];
                    updateBsItems(matchid, bsSingleList[matchid]);
                }


            }
        divBClass= divBClass;
        divB.setAttribute("class", divBClass);

        if(bsSingleList[matchid] !== undefined && bsSingleList[matchid].betTitle == odd.betTitle  ) {
            if (odd.isBetStatus !="I") {
                $('#' + matchid + betSlipItemId).removeClass('light-gray');
            }else {
                $('#' + matchid + betSlipItemId).addClass('light-gray');
            }
        }



            divB.setAttribute("onclick", "oddInDetailClick(this," + i + "," + oddPos + ",'" + sportName + "'," + matchid + ")");
        var img = document.createElement('img');
        tr.appendChild(td);
        td.appendChild(divT);
        td.appendChild(divB);
        divT.innerHTML = odd.tags[i];
        divB.innerHTML = odd.values[i];
         if ( odd.updown[i] == 0){
            img.setAttribute("src","img/arrow-green.svg");
            img.setAttribute("class","stats-arrow up");
            divB.appendChild(img);
         }
         if ( odd.updown[i] == 1){
            img.setAttribute("src","img/arrow-red.svg");
            img.setAttribute("class","stats-arrow up");
            divB.appendChild(img);
         }
    }
}







function getUrlImgSport(sportName) {
    var icon_path;
    switch (sportName) {
        case basketballSportName:
            var icon_path='img/basketball-icon.png';
            break;
        case tennisSportName:
            icon_path='img/tennis-icon.png';
            break;
        case soccerSportName:
            icon_path='img/soccer-icon.png';
            break;
        case volleyballSportName:
            icon_path='img/volleyball-icon.png';
            break;
        case icehockeySportName :
            icon_path='img/icehockey-icon.png';
            break;
        case handballSportName :
            icon_path='img/handball-icon.png';
            break;
        case rugbySportName :
            icon_path='img/rugby-icon.png';
            break;
        default:
            icon_path = null;
    }
    return icon_path;
}





function oddClickI(item, tagPos, oddPos, sportName, matchid) {//item - clicked odd value
    var match = sportList[sportName][matchid];

    var ClassDate = item.className.split(' ');

    for (var i  in ClassDate) {
        if (ClassDate[i] == "isBetStatusCI") {
            changeClickedOddToGray(item);
        }else {
            changeClickedOdd(item);
        }
    }
    changeSingleBsItem(item, null, match, oddPos, tagPos);
}







function oddInDetailClick(item, tagPos, oddPos, sportName, matchid){//item - clicked odd value
    changeClickedDetailOdd(item);
    var ClassDate = item.className.split(' ');
    var match = sportList[sportName][matchid];
    id = item.id.split('de')[1];
    itemL = $('#' + id)[0];
    //if no selected odd on live page, but exist odd in details
    for (var i  in ClassDate) {
        if (ClassDate[i] == "isBetStatusCI") {

            changeClickedOddToGray(item);

        }else {
            if(itemL === undefined){
                itemL = $('#' + matchid + "_odd_" + 1 + "_" + 1);
                changeOddsToGray(itemL);
            }else{
                changeClickedOdd(itemL);
            }
        }
    }

    changeSingleBsItem(itemL, item, match, oddPos, tagPos);
}



function changeClickedOddToGray(item) {
    $(item).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
    $(item).addClass('light-grayI');
    $(item).parents('.stats-item').find('.stats-table-result-bottom').not(item).removeClass('light-grayI');
}


function changeClickedOdd(item){
    $(item).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
    $(item).addClass('red');
    $(item).parents('.stats-item').find('.stats-table-result-bottom').not(item).addClass('light-gray');
}

function changeOddsToGrayOdd(item){
    $(item).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
    $(item).addClass('light-gray');
    $(item).parents('.stats-item').find('.stats-table-result-bottom').not(item).addClass('light-gray');
}


function changeOddsToGray(item){
    $(item).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
    $(item).parents('.stats-item').find('.stats-table-result-bottom').addClass('light-gray');
}
function restoreClickedOddMatch(item){
    $(item).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
}
function changeClickedDetailOdd(item){
    $(item).parents('.content-center-details').find('.stats-table-result-bottom').removeClass('red light-gray');
    $(item).addClass('red');
    $(item).parents('.content-center-details').find('.stats-table-result-bottom').not(item).addClass('light-gray');
}
function restoreClickedDetailOddMatch(item){
    $(item).parents('.content-center-details').find('.stats-table-result-bottom').removeClass('red light-gray');
}







