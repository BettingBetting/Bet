$(document).ready(function () {


    ////////////////size///////////////////////////////////

//    $(function () {
//        $(window).bind('resize', function () {
//            resizeMe();
//        }).trigger('resize');
//    });
//
//    var resizeMe = function () {
//        //Standard width, for which the body font size is correct
//        var preferredWidth = 1900;
//        //Base font size for the page
//        var fontsize = 10;
//
//
//        var displayWidth = $(window).width();
//        var percentage = displayWidth / preferredWidth;
//        var newFontSize = fontsize * percentage;
//        $("html").css("font-size", newFontSize);
//
////        $("html").css("font-size", 7);
//    };

    
//    if ($('#single-advanced').is(':checked')) {
////        $('.bet-slip-stake-name-input').hide();
//        alert('test');
//    };
    
    $('.correct-score-header').click(function() {
        $('.correct-score-lists').slideToggle();
    });
    
    $('.results-item').click(function () {
        $(this).toggleClass('active');
    });




    
    $('#single-advanced').click(function () {
       // $(".bet-slip-stake-name-input").fadeToggle(this.checked);
       $('.bet-slip-single').find('.bet-slip-overall').toggleClass('hidden');

    });

    $('#multiple-advanced').click(function () {
        //$(".bet-slip-stake-name-input").fadeToggle(this.checked);
        $('.bet-slip-multiple').find('.bet-slip-overall').toggleClass('hidden');
    });


    $('#system-advanced').click(function () {
       // $(".bet-slip-stake-name-input").fadeToggle(this.checked);
        $('.bet-slip-system').find('.bet-slip-overall').toggleClass('hidden');
    });




    
    $('.bet-slip-menu-item.multiple').click(function() {
        $('.bet-slip-menu-item').removeClass('active');
        $(this).addClass('active');
        $('.bet-slip-single').hide();
        $('.bet-slip-system').hide();
        $('.bet-slip-multiple').fadeIn();
    });
    
    $('.bet-slip-menu-item.single').click(function() {
        $('.bet-slip-menu-item').removeClass('active');
        $(this).addClass('active');
        $('.bet-slip-multiple').hide();
        $('.bet-slip-system').hide();
        $('.bet-slip-single').fadeIn();

    });





    if( $('.bet-slip-menu-item.single')) {
        $("#single-same-stake").prop("checked", false);
        $('#single-same-stake').click(function () {

            if ($('#single-same-stake').prop('checked')) {

                $('.bet-slip-single').find('.bet-slip-bottom-stake').addClass('display-block');
                $('.bet-slip-single').find('.bet-slip-bottom-stake').toggleClass('hidden');
                $('.bet-slip-single').find('.bet-slip-details-stakes').toggleClass('hidden');
                $('.bet-slip-single').find('.bet-slip-item-link').toggleClass('bottom');
            }

            else {
                $('.bet-slip-single').find('.bet-slip-details-stakes').toggleClass('hidden');
                $('.bet-slip-single').find('.bet-slip-bottom-stake').removeClass('display-block');
                $('.bet-slip-single').find('.bet-slip-item-link').toggleClass('bottom');
                $('.bet-slip-single').find('.bet-slip-bottom-stake').addClass('display-block');
                $('.bet-slip-single').find('.bet-slip-bottom-stake').toggleClass('hidden');

            }
        });
    }


    if( $('.bet-slip-menu-item.system')) {
        $('#system-bankers').click(function () {
            if ($('#system-bankers').prop('checked')) {
                $('.bet-slip-item-header-logo').addClass('active');
            }else {
                $('.bet-slip-item-header-logo').removeClass('active');
            }
        });
    }






    $(document).ready(function(){
        $('.bet-slip-bottom-stake-input').keyup( function() {
            var $this = $(this);
            if($this.val().length > 8)
                $this.val($this.val().substr(0, 8));
        });
    });

    $('.bet-slip-header-button').click(function() {
        $('.bet-slip-wrapper').slideToggle();
    });



    $('.bet-slip-menu-item.system').click(function() {
        $('.bet-slip-menu-item').removeClass('active');
        $(this).addClass('active');
        $('.bet-slip-multiple').hide();
        $('.bet-slip-single').hide();
        $('.bet-slip-system').fadeIn();
    });


    //////////////////////////////////////////////////////
    /**
     * sidebar
     */
    
    $('.add-funds-header .visa-icon').click(function() {
        $('.add-funds-payment-method').removeClass('mastercard-icon');
        $('.add-funds-payment-method').addClass('visa-icon');
    });
    
    $('.add-funds-header .mastercard-icon').click(function() {
        $('.add-funds-payment-method').removeClass('visa-icon');
        $('.add-funds-payment-method').addClass('mastercard-icon');
    });
    
    $('.sports-item-country-header').click(function () {
        $(this).find('.sports-item-badge').fadeToggle();
        $(this).next('.sports-item-country-leagues').slideToggle();
        $(this).find('.sports-item-country-arrow').toggleClass('active');
    });
    
    $('.sports-item-header').click(function () {
        $(this).find('.sports-item-badge').fadeToggle();
        $(this).next('.sports-item-countries-list').slideToggle();
        $(this).find('.sports-arrow').toggleClass('active');
    });

    $('.center-sports-button').click(function (event) {
        var name = event.currentTarget.id.split('_')[0];//get sport name from button id
        $('.results-wrapper-outer-item').toggleClass('hidden');
        //$('.stats-item').toggleClass('hidden');
        //$('.content-stats').toggleClass('hidden');
        //$('#' + name + '-content-container').toggleClass('hidden');
        //$('.content-stats').slideToggle();
        $('#' + name + '-content-container').slideToggle();
    });

    $('.center-sports-header.green .center-sports-button').click(function () {
        $('.markets-match-country-item').slideToggle();
        $('.match-content-wrapper').slideToggle();
    });

    $('.center-sports-button-green').click(function () {
        $('.match-content-wrapper').slideToggle();
    });
    
    $('.results-header-arrow').click(function () {
        $(this).parents('.results-wrapper-outer-item').find('.results-content-wrapper').slideToggle();
    });
    

    $('.markets-header').click(function () {
        $('.leagues-list').fadeToggle();
        $('.content-stats').fadeToggle();

    });

    $('.sports-item-country').click(function () {
        $(this).parents('.sports-item-line').find('.sports-item-line-1').slideToggle();
        $(this).parents('.sports-item-line').find('.soccer-list-item-arrow').toggleClass('active');
    });

    $('.soccer-list-item-arrow').each(function () {
        $(this).parents('.sports-item-line').find('.sports-item-line-1').hide();
    });
    
    $('.bet-slip-item-header-logo').click(function() {
        $(this).toggleClass('active');
        $(this).next('.bet-slip-item-header-name').toggleClass('active');
    });

    /**
     * Balans
     */

    $('.logged-arrow').click(function () {
        $('.last-win-wrapper').fadeToggle();
        $(this).toggleClass('active');
    });


    /**
     * language list
     */

    $('.current-language').click(function () {
        $('.languages-list-wrapper').slideToggle();
    });

    $('.leagues-list-item-arrow').each(function () {
        $(this).parents('.leagues-list li').find('.country-leagues').hide();
    });


    $('.league-list-item-header').click(function () {
        $(this).parents('.leagues-list li').find('.country-leagues').slideToggle();
        $(this).parents('.leagues-list li').find('.leagues-list-item-arrow').toggleClass('active');
    });


    $('.leagues-list input').change(function () {
        $(this).parents('.league-list-item-header').toggleClass('dark-gray');
    });

    $('.country-leagues input').change(function () {
        $(this).parents('.country-leagues li').toggleClass('dark-gray');
    });






    /**
     * search
     */
    $('.search-button').click(function () {
        $('.search-container').fadeToggle();
    });


    /***
     * Soccer
     */
    //+12
    $('.go-details').click(function () {
        $('.content-center-main').hide();
        $('.content-center-details').fadeIn();
    });


    $('.details-back').click(function () {
        $('.content-center-main').fadeIn();
        $('.content-center-details').hide();
        openedId = 0;
    });

    //menu

    $('.tab').click(function () {
        $(this).parent('.tabs-list').find('.tab').removeClass('active')
        $(this).addClass('active');
    });

    //menu2
    $('.sidebar-tab-sport').click(function () {
        $(this).parent('.sidebar-left-tabs').find('.sidebar-tab-live').removeClass('active ');
        $(this).parent('.sidebar-left-tabs').find('.sidebar-tab-sport').addClass('sidebar-tab-live active');
        window.location = "leagues.html";
    });

    $('.sidebar-tab-live').click(function () {
        $(this).parent('.sidebar-left-tabs').find('.sidebar-tab-sport').removeClass('sidebar-tab-live active ');
        $(this).parent('.sidebar-left-tabs').find('.sidebar-tab-live').addClass('sidebar-tab-live active  ');
        window.location = "index.html";
    });
    
    /*$('.content-stats .stats-table-result-bottom').click(function() {
        $(this).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
        $(this).addClass('red');
        $(this).parents('.stats-item').find('.stats-table-result-bottom').not(this).addClass('light-gray');
    });*/


    $('.matches-stats .stats-table-result-bottom').click(function() {
        $(this).parents('.match-table').find('.stats-table-result-bottom').removeClass('green light-gray');
        $(this).toggleClass('green');
        $(this).parents('.match-table').find('.stats-table-result-bottom').not(this).addClass('light-gray');
    });
    
//    $('.registration input[type="password"]').focus(function() {
//        $('.password-advice').fadeIn();
//    });


    //color stavok

//        $('.stats-table-result-bottom').click(function() {
//            var $this = $(this);
//            var isClicked = $this.data('is_clicked');
//            if (isClicked) {
//                $(this).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
//                $(".stats-table-result-bottom").each(function () {$(this).parents('.details-bets-table').find('.stats-table-result-bottom').not(this).removeClass('red light-gray')});
//                $this.data('is_clicked',false);
//            }else{
//                $this.data('is_clicked', true);
//                    $(this).parents('.stats-item').find('.stats-table-result-bottom').removeClass('red light-gray');
//                    $(this).parents('.stats-item').find('.stats-table-result-bottom').addClass('red');
//                    $(".stats-table-result-bottom").each(function () {$(this).parents('.details-bet-item').find('.stats-table-result-bottom').not(this).addClass('light-gray')});
//                    $(this).parents('.stats-item').find('.stats-table-result-bottom').not(this).addClass('light-gray');
//            }
//        });

//    $('.stats-table-result-bottom').click(function () {
//        var $this = $(this);
//        var isClicked = $this.data('is_clicked');
//        if (isClicked) {
//            $(this).parents('.details-bets-table').find('.stats-table-result-bottom').removeClass('red light-gray');
//            $(".stats-table-result-bottom").each(function () {
//                $(this).parents('.stats-item').find('.stats-table-result-bottom').not(this).removeClass('light-gray');
//            });
//            $this.data('is_clicked', false);
//        } else {
//            $this.data('is_clicked', true);
//            $(this).parents('.details-bet-item').find('.stats-table-result-bottom').removeClass('red light-gray');
//            $(this).parents('.details-bet-item').find('.stats-table-result-bottom').addClass('red');
//            $(".stats-table-result-bottom").each(function () {
//                $(this).parents('.stats-item').find('.stats-table-result-bottom').not(this).addClass('light-gray');
//            });
//            $(this).parents('.details-bets-table').find('.stats-table-result-bottom').not(this).addClass('light-gray');
//        }
//    });




    $('.correct-score-arrow').click(function () {
        $('.correct-score-lists').slideToggle();
    });

    $('.results-header-arrow').click(function () {
        $(this).parents('.results-wrapper-outer-item').find('.results-content').slideToggle();
    });

    $('.results .center-sports-button').click(function () {
        $(this).parents('.results-table-item').find('.user-content').slideToggle();
    });

    $('.result-selects .standart-select').click(function () {
        $(this).find('.result-select-list').slideToggle();
    });


    $('.details-bet-item .stats-table-result-bottom').click(function () {
        $(this).toggleClass('green');
    });
    
    
    $('.info-column-button').click(function () {
        $(this).parents('.info-column').find('.info-form').slideToggle();
        $(this).toggleClass('active');
    });

    $('.who-wins-button').click(function() {
        $('.who-wins-menu').slideToggle();
    });

    $('.total-goals-button').click(function() {
        $('.total-goals-menu').slideToggle();
    });
    
    $('.registration input[type="password"]').focus(function() {
        $('.password-advice').fadeIn();
    });
    
    $('.standart-select.country .result-select-list').perfectScrollbar();
    
    $('.standart-select.tournament .result-select-list').perfectScrollbar();

    $('.sports-item-header').click(function () {
         item = $(this)[0];
         sportName = item.id.split('-')[0];
         openedLeftSideBars[sportName] = !openedLeftSideBars[sportName];
         setAvailableMidSportList(sportName);
    });
})

function setAvailableMidSportList(sportName){
      if(openedLeftSideBars[sportName] || (countrySportFilter[sportName] !== undefined && countrySportFilter[sportName].count > 0)){
        $('#' + sportName + '-header').show();
        $('#' + sportName + '-content-container').show();
      }else{
        $('#' + sportName + '-header').hide();
        $('#' + sportName + '-content-container').hide();
      }
}

function countryFilterClick(item){
    id = item.id;
    sport = id.split('-')[0];
    country = id.split('-')[1];
    if(countrySportFilter[sport] == undefined){
        countrySportFilter[sport] = {};
        countrySportFilter[sport].count = 0;
    }
    if(countrySportFilter[sport][country] == undefined){
        countrySportFilter[sport][country] = {};
        countrySportFilter[sport].count += 1;
        setCountryCheckBoxChecked(item);
    }
    else{
        delete countrySportFilter[sport][country];
        countrySportFilter[sport].count -= 1;
        setCountryCheckBoxUnchecked(item);
    }
    filterSport(sport);
}

function setCountryCheckBoxChecked(item){
    var checkBox = $(item).find('.fake-checkbox');
    checkBox.addClass('fake-checkbox-checked');
    var label = $(item).find('.sports-item-country-text');
    label.addClass('sports-item-country-text-checked');
}

function setCountryCheckBoxUnchecked(item){
    var checkBox = $(item).find('.fake-checkbox');
    checkBox.removeClass('fake-checkbox-checked');
    var label = $(item).find('.sports-item-country-text');
    label.removeClass('sports-item-country-text-checked');
}
