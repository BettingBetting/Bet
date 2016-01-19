var webSocket =
       new WebSocket('ws://134.17.25.120:28081/betting/webSocketFeed');
	  //new WebSocket('ws://127.0.0.1:28081/betting/webSocketFeed');

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

//matchId of opened in details match
var openedId;

function onMessage(event) {
    if (onMessage.counter === undefined) {
        onMessage.counter = 0;
        onInitMessageHandler(event);
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
    match.Odds = formatOdds(match);
    sportList[match.sportdescriptor][match.matchid] = match;
    match.contentItem = makeContentWithTable(match);
    updateCountriesList(match.sportdescriptor, match.country, true);
    //show if country in filter
    /*if(countrySportFilter[match.sportdescriptor] !== undefined && countrySportFilter[match.sportdescriptor].count > 0 && countrySportFilter[match.sportdescriptor][match.country.replace(/\s/g, '')] === undefined ){

    }else{*/
        appendMatchContentToContainer(match);
    //}

}


function stackMatchObject(match){
    var i=0;

    var arr=[];

    var soccer=sportList[soccerSportName];
    for(var name in soccer) {
        arr[i] = parseInt(soccer[name].matchminute)+':'+name;
            i++;
    }

    arr.sort();


 for(i=0;i<arr.length;i++){
     if(arr[i].split(":")[0]>match.matchminute) {
         if (arr[i].split(":")[0] - match.matchminute < 3) {
          var  date=arr[i].split(":")[1];
         }
     }else{
         if ( match.matchminute-arr[i].split(":")[0] < 3) {
             date=arr[i].split(":")[1];
         }
     }

   var slon=  sportList[match.sportdescriptor][date];

 }
   // console.log(slon.matchminute);










   /* var date=[];
    for (var i = 0; i < arr.length-1; i++)
    for (var j = i+1; j <= arr.length-1; j++) {

        if(arr[j].split(":")[0] >arr[i].split(":")[0]) {
           if( arr[j].split(":")[0]-arr[i].split(":")[0]<90)
                 date[j]=arr[j].split(":")[1];
                 date[i]=arr[i].split(":")[1];
        }else{
              if(arr[j].split(":")[0]-arr[j].split(":")[0]<90)
                  date[j]=arr[j].split(":")[1];
                  date[i]=arr[i].split(":")[1];
        }

    }

    console.log(date);
    */

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
        stackMatchObject(match)
        addNewMatchObject(match);
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
    match.contentItem = makeContentWithTable(match);
    appendMatchContentToContainer(match);
    if(match.matchid === openedId){
        makeDetails(match);
    }
}

function removeMatch(match){
    sportList[match.sportdescriptor][match.matchid].contentItem.remove();
    delete sportList[match.sportdescriptor][match.matchid];
    updateCountriesList(match.sportdescriptor, match.country, false);
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
    var sportName = match.sportdescriptor;
    var status = match.status;



    var contentDiv = document.createElement('div');
    contentDiv.setAttribute("class", "stats-item");
    contentDiv.setAttribute("id", matchid);
    var statsItemInfoDiv = document.createElement('div');
	
	
	
    try{


        /**********************************************************/
        if(status=="Stopped") {
          var  color_class = ColorStatsItemInfoWithStatus(status);
        }else if(periodinfo == "Not Started"){
              color_class='red';
        }
        else{
            color_class = ColorStatsItemInfo(sportName, periodinfo, matchminute, score);
        }

        /***********************************************************************/
    } catch(e){}
    statsItemInfoDiv.setAttribute("class", "stats-item-info " + color_class);
        var statsItemInfoTopDiv = document.createElement('div');
        statsItemInfoTopDiv.setAttribute("class", "stats-item-info-top");
        var statsItemInfoBottomDiv = document.createElement('div');
        statsItemInfoBottomDiv.setAttribute("class", "stats-item-info-bottom");



    /*******************************************************************/

    var  period_info_split = periodinfo.split(' ');
    if(status=="Stopped") {
        periodinfo = period_info_split[1] + " " + period_info_split[0];
        period_info_split= periodinfo.split(' ');

    }
    var PeriodOverTime =period_info_split;


    if (sportName != "tennis" && sportName != "volleyball" ) {
        if(status!="Stopped") {
            matchminute = matchminute+ "<br> min";
            periodinfo = periodinfo;
        }else{
            matchminute = matchminute+ "<br> min";
            periodinfo = "Stopped"+"<br>"+PeriodOverTime[1]+"<br>"+PeriodOverTime[0];
        }
    }else{
        if(status!="Stopped") {
            matchminute = "Set";
            periodinfo = period_info_split[0];
        }else{
            matchminute ="Set" ;
            periodinfo = "Stopped";
        }

    }

    /*****************************************************************/

    statsItemInfoTopDiv.innerHTML = matchminute;
    statsItemInfoBottomDiv.innerHTML = periodinfo;

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
function addColumn(table, odd, oddPos, sportName, matchId, isDeletedOdd){
	var rows = table.rows;
	var td0 = document.createElement('td');
	var colspanV = odd.tags.length;
    td0.setAttribute("colspan", colspanV + "");
    td0.innerHTML = odd.betTitle;
    table.rows[0].appendChild(td0);

     for(var i = 0; i < odd.tags.length; i++){
            var divBClass = "stats-table-result-bottom";
            var td = document.createElement('td');
            td.setAttribute("style", "width: 60px");
            if(colspanV == 2){
              td.setAttribute("style", "width: 90px");
            }
            var divT = document.createElement('div');
            divT.setAttribute("class", "stats-table-result-top");
            var divB = document.createElement('div');

            divB.setAttribute("id", matchId + "_odd_" + oddPos + "_" + i );

            if(!odd.isClickable[i]){
                var divBClass = "stats-table-result-top";
            }else{
                divB.setAttribute("onclick", "oddClick(this," + i + "," + oddPos + ",'" + sportName +  "'," + matchId + ")");
            }
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
            var div = document.createElement('div');
            div.setAttribute("class", "country-checkbox");
                var input = document.createElement('input');
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", sportName + '-' + countryName);
                var label1 = document.createElement('label');
                label1.setAttribute("class", "fake-checkbox unchecked");
                label1.setAttribute("for", sportName + '-' + countryName);
                label1.setAttribute("onclick", 'countryFilterClick(this)')
                var label2 = document.createElement('label');
                label2.setAttribute("class", "sports-item-country-text");
                label2.setAttribute("for", sportName + '-' + countryName);
                label2.setAttribute("onclick", 'countryFilterClick(this)');
                label2.innerHTML = countryNameFull;
            div.appendChild(input);
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

function sortAndShow(sportName, sportContainer){
    var  matchList = [];
    for(match in sportList[sportName]){
        matchList.push(sportList[sportName][match]);
    }
    matchList.sort(function (a, b) {
          var contentA = a.matchminute;
          var contentB = b.matchminute;
          if(contentA == "Not") {
              contentA = 0;
          }
          if(contentB == "Not") {
              contentB = 0;
          }
          return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });
    var itemList = [];
    for(var i =0; i < matchList.length; i++){
        var t = matchList[i].contentItem;
        matchList[i].contentItem.remove();
        sportContainer.append(matchList[i].contentItem);
    }
}


function  ColorStatsItemInfoWithStatus(status ) {
    var color_class="";
    if (status == 'Stopped') {
        color_class = 'gray';
    }
    return color_class;
}


function ColorStatsItemInfo(sportName, periodinfo, matchminute, score) {

    var color="";
    switch (sportName) {
        case "basketball":
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
        case 'tennis':
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


                color = 'green';
                if(typeof(IntSoccerElem1) != NaN) {
                    if (IntSoccerElem1> 4) {
                        color = 'red';
                        break;
                    }
                }
                if(typeof(IntSoccerElem2) != NaN) {
                    if (IntSoccerElem2> 4) {
                        color = 'red';
                        break;
                    }
                }
            }
            break;
        case 'soccer':
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
        case 'volleyball' :
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


                color = 'green';
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
            break;


        case 'icehockey' :
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



        case 'handball' :
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


        case 'rugby' :
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


    if (periodinfo == 'Paused') {
        color = 'yellow';
    } else if (periodinfo == 'Stopped') {
        color = 'gray';
    } else if (periodinfo == 'Not Started') {
        color = 'red';
    }

    return color;
}











function goDetailsClick(id, sportName) {
    openedId = id;
    makeDetails(sportList[sportName][id]);
    $('.content-center-main').hide();
    $('.content-center-details').fadeIn();

    if (sportName == "volleyball" || sportName == "tennis") {
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

function addColumnToDetailsTable(odd, oddPos, sportName, matchId){
    var OddFilter={};
    var tags=[];
    var values=[];
    var betTitle=odd.betTitle;
    var updown=odd.updown;
    var OddBetTitleSplit=odd.betTitle.split(' ');
    if($.inArray('Total',  OddBetTitleSplit) != -1) {
        var j=0;
        for (i = 0; i < odd.tags.length; i++) {
            if (odd.tags[i] != 'Goal' && odd.tags[i] != 'Set') {
                tags[j]= odd.tags[i];
                values[j] = odd.values[i];
                j++;
            }
        }
        OddFilter['betTitle']=betTitle;
        OddFilter['tags']=tags;
        OddFilter['updown']=updown;
        OddFilter['values']=values;
    }else{
        OddFilter=odd;
    }
    odd=OddFilter;
    var tBody = $(".content-center-details .details-bets-table")[0];
    var tr = document.createElement('tr');
    tr.setAttribute("class", "details-bet-item");
    var td0 = document.createElement('td');
    td0.setAttribute("class", "details-bet-item-header");
    var colspanV = 4 - odd.tags.length;
    td0.setAttribute("colspan", colspanV + "");
    tBody.appendChild(tr);
    tr.appendChild(td0);
    td0.innerHTML = odd.betTitle;
    for(var i = 0; i < odd.tags.length; i++){
        var divBClass = "stats-table-result-bottom";
        var td = document.createElement('td');
        var divT = document.createElement('div');
        divT.setAttribute("class", "stats-table-result-top");
        var divB = document.createElement('div');
        divB.setAttribute("onclick", "oddInDetailClick(this," + i + "," + oddPos + ",'" + sportName +  "'," + matchId + ")");
        divB.setAttribute("id", "de" + matchId + "_odd_" + oddPos + "_" + i );
        divB.setAttribute("class", divBClass);
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