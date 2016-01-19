//making correct odds
function formatOdds(d){
	var processedBetTitle = [];
    var formatedDataArray = [];

    var sportdescriptor = d.sportdescriptor;
    if(d.Odds == undefined || d.Odds == null){
        alert('');
    }
    for(var i = 0; i < d.Odds.length; i++) {
    		var obj = d.Odds[i];
    		var oddtag = obj.oddtag;
    		var betTitle = obj.betTitle;
    		var betStatus = obj.betStatus;
    		var value = obj.value;
    		var v1 = '';
    		var v2 = '';
    		var v3 = '';
    		var odd1,odd2,odd3;
    		var countBets;
    		if($.inArray(betTitle, processedBetTitle) == -1) {
    			processedBetTitle.push(betTitle);
    		} else {
    			continue;
    		}

    		// 1 X 2
    		// 1X 12 X2
    		// U O
    		// ODD EVEN
    		// UNDER OVER
    		// YES NO
    		countBets = twoOrThreeBets(oddtag).split(',');
    		if (countBets[0] == '0') // sequential output in three columns; e.g. "Correct score" of market
    		{
    			odd1 = getOddByOddtagBetTitle(d.Odds, oddtag, betTitle);
    			if (odd1 != null) {
    				v1 = odd1.value;
    			}
    			odd2 = null;
    			odd3 = null;
    		}
    		else // 2 (central tag is empty) or 3 tags
    		{
    			odd1 = getOddByOddtagBetTitle(d.Odds, countBets[1], betTitle);
    			odd2 = getOddByOddtagBetTitle(d.Odds, countBets[2], betTitle);
    			odd3 = getOddByOddtagBetTitle(d.Odds, countBets[3], betTitle);
    			if (odd1 != null) {
    				v1 = odd1.value;
    			}
    			if (odd2 != null) {
    				v2 = odd2.value;
    			}
    			if (odd3 != null) {
    				v3 = odd3.value;
    			}
    		}

        formatedData = {};
        var tags = [];
        var values = [];
        var isClickable = [];
		var isBetStatus=[];

		formatedData.betTitle = betTitle;
		if( v1 != null && odd1 != null ){
		    tags.push(odd1.oddtag);
		    values.push(v1);
		    isClickable.push(true);
		}
		if( v2 != null && odd2 != null ){
            tags.push(odd2.oddtag);
		    values.push(v2);
		    isClickable.push(true);
        }
        if( v3 != null && odd3 != null ){
            tags.push(odd3.oddtag);
		    values.push(v3);
		    isClickable.push(true);
        }
        if( tags.length < 3 ){
            setThirdTag(betTitle, sportdescriptor, tags, values, isClickable);
        }

		formatedData.tags = tags;
        formatedData.values = values;
        formatedData.updown = [];
        formatedData.isClickable = isClickable;
		formatedData.isBetStatus = betStatus;

		formatedDataArray[i] = formatedData;
	}
	formatedDataArray = formatedDataArray.filter(function(n){ return n != undefined });
	return formatedDataArray;
}

function getValueByOddtagBetTitle(items, oddtag, betTitle){
	for(var i = 0; i < items.length; i++) {
		var obj = items[i];
		if(obj['oddtag'] == oddtag && obj['betTitle'] == betTitle)
			return obj.value;
	}
	return '';
}

function getOddByOddtagBetTitle(items, oddtag, betTitle){
	if ((oddtag != null) && (oddtag.length > 0)) {
		for(var i = 0; i < items.length; i++) {
			var obj = items[i];
			if(obj['oddtag'] == oddtag && obj['betTitle'] == betTitle) {
				return obj;
			}
		}
	}
	return null;
}

function twoOrThreeBets( oddtag ){
	if (oddtag == '1' || oddtag == 'X' || oddtag == '2') {
		return '3,1,X,2';
    } else if (oddtag == 'U' || oddtag == 'O') {
        return '2,U,,O';
    } /*else if (oddtag == '2B' || oddtag == '3B') {
        return '2,2B,,3B';
	}*/ else if (oddtag == '1X' || oddtag == '12' || oddtag == 'X2') {
		return '3,1X,12,X2';
	} else if (oddtag == 'ODD' || oddtag == 'EVEN') {
		return '2,ODD,,EVEN';
	} else if (oddtag == 'UNDER' || oddtag == 'OVER') {
		return '2,UNDER,,OVER';
	} else if (oddtag == 'YES' || oddtag == 'NO') {
		return '2,YES,,NO';
	} else {
		return '0,,,';
	}
}

function setThirdTag(betTitle, sportdescriptor, tags, values, isClickable){
    if(betTitle.indexOf('Total number of games in Set') + 1) {
        tags.unshift("Set");
        values.unshift(getValueBetweenBkt(betTitle));
        isClickable.unshift(false);
        return;
    }
    if(betTitle.indexOf('Total for match including overtime') + 1) {
        tags.unshift("Goal");
        values.unshift(getValueBetweenBkt(betTitle));
        isClickable.unshift(false);
        return;
    }
    if(betTitle.indexOf('Total') + 1) {
        tags.unshift("Goal");
        values.unshift(getValueBetweenBkt(betTitle));
        isClickable.unshift(false);
        return;
    }


}

function getValueBetweenBkt(betTitle){
    firstIndex = betTitle.indexOf('(');
    secondIndex = betTitle.indexOf(')');
    valueLength = secondIndex - firstIndex - 1;
    value = betTitle.substr(firstIndex + 1, valueLength);
    return value;
}