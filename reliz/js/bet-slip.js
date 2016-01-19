var bsSingleList = {}; // key; value
bsSingleList.size = 0;

var betSlipItemId = "_BSI";
var betSlipCloseId = "_BSC";
var betSlipItemLinkId = "_BSIL";
var betSlipItemValueId = "_BSIV";
var betSlipItemHeaderNameId = "_BSIHN";
var betSlipResultId = "_BSResult";
var betSlipRateValueId = "_BSRate";
var betSlipTeamId = "_BST"
var betSlipStakeNameInputValue1Id = "_BSSNIV1"
var betSlipStakeNameInputValue2Id = "_BSSNIV2"

var bsMultipleItemId = "_bsmI";
var bsMultipleCloseId = "_bsmC";
var bsMultipleItemLinkId = "_bsmIL";
var bsMultipleItemValueId = "_bsmIV";
var bsMultipleItemHeaderNameId = "_bsmIHN";
var bsMultipleResultId = "_bsmResult";
var bsMultipleRateValueId = "_bsmRate";
var bsMultipleTeamId = "_bsmT"

var bsSystemItemId = "_bsSysI";
var bsSystemCloseId = "_bsSysC";
var bsSystemItemLinkId = "_bsSysIL";
var bsSystemItemValueId = "_bsSysIV";
var bsSystemItemHeaderNameId = "_bsSysIHN";
var bsSystemResultId = "_bsSysResult";
var bsSystemRateValueId = "_bsSysRate";
var bsSystemTeamId = "_bsSysT"

//clickedOdd - in live, clickedOddD - in detail
function changeSingleBsItem(clickedOdd, clickedOddD, match, oddPos, tagPos){
    var matchid = match.matchid;
    var matchminute = match.matchminute;
    var periodinfo = match.periodinfo;
    var score = match.score || " ";
    var commands = match.home + " - " + match.away;
    var betTitle = match.Odds[oddPos].betTitle;
    var isBetStatus= match.Odds[oddPos].isBetStatus;
    var tag = match.Odds[oddPos].tags[tagPos];
    var value = match.Odds[oddPos].values[tagPos];
    var oddsCount = match.Odds.length;
    var oddTarget = "";
    if(tag === "1"){
        oddTarget = match.home;
    }else if(tag === "2"){
        oddTarget = match.away;
    }else if(tag === "X"){
        oddTarget = "Draw";
    }else if(tag === "OVER" || tag === "O"){
        oddTarget = "OVER";
    }else if(tag === "UNDER" || tag === "U"){
        oddTarget = "UNDER";
    }else {
        oddTarget = tag;
    }
    var bsObject = {};
    bsObject.commands = commands;
    bsObject.betTitle = betTitle;
    bsObject.isBetStatus =isBetStatus;
    bsObject.value = value;
    bsObject.oddTarget = oddTarget;
    bsObject.tag = tag;
    bsObject.oddsCount = oddsCount;
    bsObject.clickedOdd = clickedOdd;
    bsObject.clickedOddD = clickedOddD;
    bsObject.sportName = match.sportdescriptor;

    if(bsSingleList[matchid] != undefined){// if bsSingleList[matchid] exist
        bsSingleList[matchid] = bsObject;
        removeSingleBsItem(matchid, bsObject);
        return;

    }else{
        bsSingleList[matchid] = bsObject;
        bsSingleList.size = bsSingleList.size + 1;
        setBsBtnVisibility();
        addSingleBsItem(bsObject, matchid);
        addMultipleBsItem(bsObject, matchid);
        addSystemBsItem(bsObject, matchid);
       AddStyleBetSlipMenuItemSingleToo();
    }


}


function   AddStyleRemoveSingleBsItem(){
    document.getElementById("bsSingleBtn").style.display = "block";
    $('.bet-slip-menu-item').removeClass('active');
    document.querySelector(".bet-slip-not-start").style.display = "block";
    $('.bet-slip-menu-item.single').addClass('hidden');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-checkboxes').removeClass('display-block');
    $('.bet-slip-menu-item').parents('.bet-slip-wrapper').find('.bet-slip-checkboxes').removeClass('display-block');
    $('.bet-slip-overall-item').removeClass('display-block');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-bottom-stake').removeClass('display-block');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-bottom-top').addClass('hidden');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-overall').addClass('hidden');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-limit-message').removeClass('display-block');
}




function AddStyleBetSlipMenuItemSingleToo(){
    document.getElementById("bsSingleBtn").style.display = "block";
    document.querySelector(".bet-slip-not-start").style.display = "none";
    $('.bet-slip-menu-item').removeClass('active');
    $('.bet-slip-menu-item.single').addClass('active');
    $('.bet-slip-menu-item.single').removeClass('hidden');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-checkboxes').addClass('display-block');
    $('.bet-slip-overall-item').addClass('display-block');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-bottom-stake').addClass('display-block');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-bottom-top').removeClass('hidden');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-overall').addClass('hidden');
    $('.bet-slip-menu-item.single').parents('.bet-slip-wrapper').find('.bet-slip-limit-message').addClass('display-block');
}






function addSingleBsItem(bsObject, matchid){

    var isSingleSameStake = null;
    if($('#single-same-stake').prop('checked')){
        isSingleSameStake = true;
    }else{
        isSingleSameStake = false;
    }
    var divItem = document.createElement('div');
    divItem.setAttribute("class", "bet-slip-item");
    divItem.setAttribute("id", matchid + betSlipItemId);

    var divClose = document.createElement('div');
    divClose.setAttribute("class", "bet-slip-close");
    divClose.setAttribute("id", matchid + betSlipCloseId);
    divClose.setAttribute("onclick", "closeSingleBsItemClick(this)");

    var divItemLink = document.createElement('div');
    divItemLink.setAttribute("class", "bet-slip-item-link");
    if(isSingleSameStake) divItemLink.setAttribute("class", "bet-slip-item-link bottom");
    divItemLink.setAttribute("id", matchid + betSlipItemLinkId);
    divItemLink.setAttribute("onclick", "goDetailsClick(" + matchid + ", '" + bsObject.sportName + "')");
    var spanIL = document.createElement('span');
    spanIL.setAttribute("id", matchid + betSlipItemValueId);
    spanIL.innerHTML = "+" + bsObject.oddsCount;
    var imgLink = document.createElement('img');
    imgLink.setAttribute("src","img/arrow-white-right.svg");
    imgLink.setAttribute("class","bet-slip-item-link-arrow");
    divItemLink.appendChild(spanIL);
    divItemLink.appendChild(imgLink);

    var divItemHeader = document.createElement('div');
    divItemHeader.setAttribute("class", "bet-slip-item-header");
    var divItemHeaderName = document.createElement('div');
    divItemHeaderName.setAttribute("class", "bet-slip-item-header-name");
    divItemHeaderName.setAttribute("id", matchid + betSlipItemHeaderNameId);
    divItemHeaderName.innerHTML = bsObject.commands;
    divItemHeader.appendChild(divItemHeaderName);

    var divItemStats = document.createElement('div');
    divItemStats.setAttribute("class", "bet-slip-item-stats");
    var divResult = document.createElement('div');
    divResult.setAttribute("class", "bet-slip-result");
    divResult.setAttribute("id", matchid + betSlipResultId);
    divResult.innerHTML = bsObject.betTitle;
    var divRate = document.createElement('div');
    divRate.setAttribute("class", "bet-slip-rate");
    var spanRate = document.createElement('span');
    spanRate.setAttribute("id", matchid + betSlipRateValueId);
    spanRate.innerHTML = bsObject.value;
    divRate.appendChild(spanRate);
    divItemStats.appendChild(divResult);
    divItemStats.appendChild(divRate);

    var divDetails = document.createElement('div');
    divDetails.setAttribute("class", "bet-slip-details");
    var divTeam = document.createElement('div');
    divTeam.setAttribute("class", "bet-slip-team");
    divTeam.setAttribute("id", matchid + betSlipTeamId);
    divTeam.innerHTML = bsObject.oddTarget;
    var divDetailsStakes = document.createElement('div');
    divDetailsStakes.setAttribute("class", "bet-slip-details-stakes");
    if(isSingleSameStake) divDetailsStakes.setAttribute("class", "bet-slip-details-stakes hidden");
    var divStakesItem1 = document.createElement('div');
    divStakesItem1.setAttribute("class", "bet-slip-stakes-item");
    var divStakeName1 = document.createElement('div');
    divStakeName1.setAttribute("class", "bet-slip-stake-name");
    divStakeName1.innerHTML = "Stake";
    var inputStakeName1 = document.createElement('input');
    inputStakeName1.setAttribute("class", "bet-slip-stake-name-input");
    inputStakeName1.setAttribute("id", matchid + betSlipStakeNameInputValue1Id);
    inputStakeName1.setAttribute("type", "text");
    divStakesItem1.appendChild(divStakeName1);
    divStakesItem1.appendChild(inputStakeName1);

    var divStakesItem2 = document.createElement('div');
    divStakesItem2.setAttribute("class", "bet-slip-stakes-item");
    var divStakeName2 = document.createElement('div');
    divStakeName2.setAttribute("class", "bet-slip-stake-name");
    divStakeName2.innerHTML = "Est Win";
    var inputStakeName2 = document.createElement('input');
    inputStakeName2.setAttribute("class", "bet-slip-stake-name-input");
    inputStakeName2.setAttribute("id", matchid + betSlipStakeNameInputValue2Id);
    inputStakeName2.setAttribute("type", "text");
    divStakesItem2.appendChild(divStakeName2);
    divStakesItem2.appendChild(inputStakeName2);
    divDetailsStakes.appendChild(divStakesItem1);
    divDetailsStakes.appendChild(divStakesItem2);
    divDetails.appendChild(divTeam);
    divDetails.appendChild(divDetailsStakes);
    divItem.appendChild(divClose);
    divItem.appendChild(divItemLink);
    divItem.appendChild(divItemHeader);
    divItem.appendChild(divItemStats);
    divItem.appendChild(divDetails);

    $('#bsSingleForm').prepend(divItem);
}



function addMultipleBsItem(bsObject, matchid){
    var divItem = document.createElement('div');
    divItem.setAttribute("class", "bet-slip-item");
    divItem.setAttribute("id", matchid + bsMultipleItemId);

    var divClose = document.createElement('div');
    divClose.setAttribute("class", "bet-slip-close");
    divClose.setAttribute("id", matchid + bsMultipleCloseId);
    divClose.setAttribute("onclick", "closeSingleBsItemClick(this)");

    var divItemLink = document.createElement('div');
    divItemLink.setAttribute("class", "bet-slip-item-link bottom");
    divItemLink.setAttribute("id", matchid + bsMultipleItemLinkId);
    divItemLink.setAttribute("onclick", "goDetailsClick(" + matchid + ", '" + bsObject.sportName + "')");
    var spanIL = document.createElement('span');
    spanIL.setAttribute("id", matchid + bsMultipleItemValueId);
    spanIL.innerHTML = "+" + bsObject.oddsCount;
    var imgLink = document.createElement('img');
    imgLink.setAttribute("src","img/arrow-white-right.svg");
    imgLink.setAttribute("class","bet-slip-item-link-arrow");
    divItemLink.appendChild(spanIL);
    divItemLink.appendChild(imgLink);

    var divItemHeader = document.createElement('div');
    divItemHeader.setAttribute("class", "bet-slip-item-header");
    var divItemHeaderName = document.createElement('div');
    divItemHeaderName.setAttribute("class", "bet-slip-item-header-name");
    divItemHeaderName.setAttribute("id", matchid + bsMultipleItemHeaderNameId);
    divItemHeaderName.innerHTML = bsObject.commands;
    divItemHeader.appendChild(divItemHeaderName);

    var divItemStats = document.createElement('div');
    divItemStats.setAttribute("class", "bet-slip-item-stats");
    var divResult = document.createElement('div');
    divResult.setAttribute("class", "bet-slip-result");
    divResult.setAttribute("id", matchid + bsMultipleResultId);
    divResult.innerHTML = bsObject.betTitle;
    var divRate = document.createElement('div');
    divRate.setAttribute("class", "bet-slip-rate");
    var spanRate = document.createElement('span');
    spanRate.setAttribute("id", matchid + bsMultipleRateValueId);
    spanRate.innerHTML = bsObject.value;
    divRate.appendChild(spanRate);
    divItemStats.appendChild(divResult);
    divItemStats.appendChild(divRate);

    var divDetails = document.createElement('div');
    divDetails.setAttribute("class", "bet-slip-details");
    var divTeam = document.createElement('div');
    divTeam.setAttribute("class", "bet-slip-team");
    divTeam.setAttribute("id", matchid + bsMultipleTeamId);
    divTeam.innerHTML = bsObject.oddTarget;
    divDetails.appendChild(divTeam);

    divItem.appendChild(divClose);
    divItem.appendChild(divItemLink);
    divItem.appendChild(divItemHeader);
    divItem.appendChild(divItemStats);
    divItem.appendChild(divDetails);

    $('#bsMultipleForm').prepend(divItem);


}






function addSystemBsItem(bsObject, matchid){
    var divItem = document.createElement('div');
    divItem.setAttribute("class", "bet-slip-item");
    divItem.setAttribute("id", matchid + bsSystemItemId);

    var divClose = document.createElement('div');
    divClose.setAttribute("class", "bet-slip-close");
    divClose.setAttribute("id", matchid + bsSystemCloseId);
    divClose.setAttribute("onclick", "closeSingleBsItemClick(this)");

    var divItemLink = document.createElement('div');
    divItemLink.setAttribute("class", "bet-slip-item-link bottom");
    divItemLink.setAttribute("id", matchid + bsSystemItemLinkId);
    divItemLink.setAttribute("onclick", "goDetailsClick(" + matchid + ", '" + bsObject.sportName + "')");
    var spanIL = document.createElement('span');
    spanIL.setAttribute("id", matchid + bsSystemItemValueId);
    spanIL.innerHTML = "+" + bsObject.oddsCount;
    var imgLink = document.createElement('img');
    imgLink.setAttribute("src","img/arrow-white-right.svg");
    imgLink.setAttribute("class","bet-slip-item-link-arrow");
    divItemLink.appendChild(spanIL);
    divItemLink.appendChild(imgLink);

    var divItemHeader = document.createElement('div');
    divItemHeader.setAttribute("class", "bet-slip-item-header");
    var divItemHeaderLogo = document.createElement('div');
    divItemHeaderLogo.setAttribute("class", "bet-slip-item-header-logo");
    divItemHeaderLogo.innerHTML = "B";
    var divItemHeaderName = document.createElement('div');
    divItemHeaderName.setAttribute("class", "bet-slip-item-header-name");
    divItemHeaderName.setAttribute("id", matchid + bsSystemItemHeaderNameId);
    divItemHeaderName.innerHTML = bsObject.commands;
    divItemHeader.appendChild(divItemHeaderLogo);
    divItemHeader.appendChild(divItemHeaderName);

    var divItemStats = document.createElement('div');
    divItemStats.setAttribute("class", "bet-slip-item-stats");
    var divResult = document.createElement('div');
    divResult.setAttribute("class", "bet-slip-result");
    divResult.setAttribute("id", matchid + bsSystemResultId);
    divResult.innerHTML = bsObject.betTitle;
    var divRate = document.createElement('div');
    divRate.setAttribute("class", "bet-slip-rate");
    var spanRate = document.createElement('span');
    spanRate.setAttribute("id", matchid + bsSystemRateValueId);
    spanRate.innerHTML = bsObject.value;
    divRate.appendChild(spanRate);
    divItemStats.appendChild(divResult);
    divItemStats.appendChild(divRate);

    var divDetails = document.createElement('div');
    divDetails.setAttribute("class", "bet-slip-details");
    var divTeam = document.createElement('div');
    divTeam.setAttribute("class", "bet-slip-team");
    divTeam.setAttribute("id", matchid + bsSystemTeamId);
    divTeam.innerHTML = bsObject.oddTarget;
    divDetails.appendChild(divTeam);

    divItem.appendChild(divClose);
    divItem.appendChild(divItemLink);
    divItem.appendChild(divItemHeader);
    divItem.appendChild(divItemStats);
    divItem.appendChild(divDetails);

    $('#bsSystemForm').prepend(divItem);
}

function updateBsItems(matchid, bsObject){
    updateSingleBsItem(matchid, bsObject);
    updateMultipleBsItem(matchid, bsObject);
    updateSystemBsItem(matchid, bsObject);
}

function updateSingleBsItem(matchid, bsObject){

    $('#' + matchid + betSlipItemValueId)[0].innerHTML = "+" + bsObject.oddsCount;
    $('#' + matchid + betSlipResultId)[0].innerHTML = bsObject.betTitle;
    $('#' + matchid + betSlipRateValueId)[0].innerHTML = bsObject.value;
    $('#' + matchid + betSlipTeamId)[0].innerHTML = bsObject.oddTarget;
}

function updateMultipleBsItem(matchid, bsObject){
    $('#' + matchid + bsMultipleItemValueId)[0].innerHTML = "+" + bsObject.oddsCount;
    $('#' + matchid + bsMultipleResultId)[0].innerHTML = bsObject.betTitle;
    $('#' + matchid + bsMultipleRateValueId)[0].innerHTML = bsObject.value;
    $('#' + matchid + bsMultipleTeamId)[0].innerHTML = bsObject.oddTarget;
}

function updateSystemBsItem(matchid, bsObject){
    $('#' + matchid + bsSystemItemValueId)[0].innerHTML = "+" + bsObject.oddsCount;
    $('#' + matchid + bsSystemResultId)[0].innerHTML = bsObject.betTitle;
    $('#' + matchid + bsSystemRateValueId)[0].innerHTML = bsObject.value;
    $('#' + matchid + bsSystemTeamId)[0].innerHTML = bsObject.oddTarget;
}

function closeSingleBsItemClick(bsSingleItem){
    id = bsSingleItem.id.split('_')[0];
    removeSingleBsItem(id, bsSingleList[id]);
}

//remove bs and restore css class for match table values
function removeSingleBsItem(id, bsObject){
    if(bsObject.clickedOdd !== undefined){
        restoreClickedOddMatch(bsObject.clickedOdd);
    }else{
        restoreClickedOddMatch($('#' + id + "_odd_" + 1 + "_" + 1));
    }
    if(id == openedId){
        restoreClickedDetailOddMatch(bsObject.clickedOddD);
    }
    removeSingleBsItemFromList(id);
    var  betSlipNotStart= document.querySelector(".bet-slip-not-start");
    var bsSingleBtn= document.getElementById("bsSingleBtn");

    if( bsSingleList.size==0){
        AddStyleRemoveSingleBsItem();
    }

}





//remove bsItem only from list and betslip, without changing css class
function removeSingleBsItemFromList(id){



    bsSingleList.size = bsSingleList.size - 1;

    delete bsSingleList[id];
    setBsBtnVisibility();
    bsSingleItem = $('#' + id + betSlipItemId);
    bsSingleItem.remove();

    bsMultipleItem = $('#' + id + bsMultipleItemId);
    bsMultipleItem.remove();

    bsSystemItem = $('#' + id + bsSystemItemId);
    bsSystemItem.remove();


}



function setBsBtnVisibility(){
    if (bsSingleList.size < 2){
        $('#bsMultipleBtn').addClass('hidden');
        $('#bsSystemBtn').addClass('hidden');
        return
    }
    if (bsSingleList.size == 2){
        $('#bsMultipleBtn').removeClass('hidden');
        $('#bsSystemBtn').addClass('hidden');
        return
    }
    if (bsSingleList.size > 2){
        $('#bsMultipleBtn').removeClass('hidden');
        $('#bsSystemBtn').removeClass('hidden');
    }

}


