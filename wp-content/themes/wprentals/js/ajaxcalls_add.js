/*global $, jQuery, ajaxcalls_vars, document, control_vars, mapbase_vars,window, control_vars, submit_change,wpestate_timeConverter, ajaxcalls_add_vars, dashboard_vars, google, wprentals_google_fillInAddress, wpestate_check_booking_valability_internal, wpestate_mark_as_booked_actions*/
jQuery(document).ready(function ($) {
    "use strict";

    $('#allinone_set_custom').on('click',function(event){

        $('#allinone_set_custom').text(ajaxcalls_vars.saving);
        if (jQuery('#block_dates').is(':checked')  ){
            wpestate_check_booking_valability_internal_allinone();
        }else{
            wpestate_allinone_owner_insert_customprice_internal();
        }

    });



function    wpestate_allinone_owner_insert_customprice_internal(){
    var   period_extra_price_per_guest, period_price_per_weekeend, period_checkin_change_over, period_checkin_checkout_change_over, period_min_days_booking,start_from, end_to, listing_edit, new_price, ajaxurl;

    start_from      =   jQuery('#start_date_owner_book').val();
    end_to          =   jQuery('#end_date_owner_book').val();
    listing_edit    =   jQuery('#property_id').val();
    new_price       =   jQuery('#new_custom_price').val();
    period_min_days_booking             =   jQuery('#period_min_days_booking').val();
    period_extra_price_per_guest        =   jQuery('#period_extra_price_per_guest').val();
    period_price_per_weekeend           =   jQuery('#period_price_per_weekeend').val();
    period_checkin_change_over          =   jQuery('#period_checkin_change_over').val();
    period_checkin_checkout_change_over =   jQuery('#period_checkin_checkout_change_over').val();

    ajaxurl         =   control_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wprentals_allinone').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_add_allinone_custom',
            'book_from'         :   start_from,
            'book_to'           :   end_to,
            'listing_id'        :   listing_edit,
            'new_price'         :   new_price,
            'period_min_days_booking'               :   period_min_days_booking,
            'period_extra_price_per_guest'          :   period_extra_price_per_guest,
            'period_price_per_weekeend'             :   period_price_per_weekeend,
            'period_checkin_change_over'            :   period_checkin_change_over,
            'period_checkin_checkout_change_over'   :   period_checkin_checkout_change_over,
            'security'                              :   nonce,
        },
        success: function (data) {

            location.reload();


        },
        error: function (errorThrown) {
        }

    });
}



function wpestate_check_booking_valability_internal_allinone() {

    var book_from, book_to, listing_edit, ajaxurl,internal,hour_from,hour_to;
    jQuery('#book_dates').empty().text(ajaxcalls_vars.saving);
    book_from       =   jQuery('#start_date_owner_book').val();
    book_to         =   jQuery('#end_date_owner_book').val();
    if(jQuery('#start_date_owner_book_hour').length>0 ){
        hour_from   =   jQuery('#start_date_owner_book_hour').val();
        book_from   =   book_from+' '+hour_from;
        hour_to     =   jQuery('#end_date_owner_book_hour').val();
        book_to     =   book_to+' '+hour_to;
    }

    listing_edit    =   jQuery('#listing_edit').val();
    ajaxurl         =   control_vars.admin_url + 'admin-ajax.php';
    internal        =   1;
    var nonce = jQuery('#wprentals_allinone').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_check_booking_valability_internal',
            'book_from'         :   book_from,
            'book_to'           :   book_to,
            'listing_id'        :   listing_edit,
            'internal'          :   internal,
            'security'          :   nonce,
            'allinone'          :   1
        },
        success: function (data) {

            if ( data.trim() === 'run') {
                wpestate_allin_one_owner_insert_book_internal();

            } else {
                jQuery('#book_dates').empty().text(ajaxcalls_vars.reserve);
            }
        },
        error: function (errorThrown) {
        }
    });
}

function wpestate_allin_one_owner_insert_book_internal() {

    var fromdate, todate, listing_edit, nonce, ajaxurl, comment, booking_guest_no,hour_from,hour_to;
    ajaxurl             =   control_vars.admin_url + 'admin-ajax.php';
    fromdate            =   jQuery("#start_date_owner_book").val();
    todate              =   jQuery("#end_date_owner_book").val();
    listing_edit        =   jQuery('#listing_edit').val();
    comment             =   jQuery("#book_notes").val();
    booking_guest_no    =   jQuery('#booking_guest_no_wrapper').attr('data-value');
    
    if(jQuery('.guest_no_hidden').length>0){
        booking_guest_no            =   parseInt( jQuery('.guest_no_hidden').val(),10);
    }

    if(jQuery('#start_date_owner_book_hour').length>0 ){
        hour_from   =   jQuery('#start_date_owner_book_hour').val();
        fromdate    =   fromdate+' '+hour_from;
        hour_to     =   jQuery('#end_date_owner_book_hour').val();
        todate      =   todate+' '+hour_to;
    }
    var nonce = jQuery('#wprentals_allinone').val();

    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_add_booking',
            'fromdate'          :   fromdate,
            'todate'            :   todate,
            'listing_edit'      :   listing_edit,
            'comment'           :   comment,
            'booking_guest_no'  :   booking_guest_no,
            'confirmed'         :   1,
            'security'          :   nonce,
            'allinone'          :   1
        },
        success: function (data) {

            wpestate_allinone_owner_insert_customprice_internal();
        },
        error: function (errorThrown) {
        }
    });
}











    var all_calendar_click = 0;
    var curent_id;
    $('.booking-calendar-wrapper-allinone .has_future').on('click',function (event) {

        var has_reservation, parent, detect_start, start_date, end_date;
        has_reservation =   0;
        detect_start    =   0;

        if ($(this).hasClass('calendar-reserved') || $(this).hasClass('pick_block_dates')) { // click on a booked spot
            return;
        }else{
            $(this).addClass('calendar-selected');
        }



        if (all_calendar_click === 0) { // start a new period
            all_calendar_click = 1;
            $(this).addClass('calendar-reserved-start');
            curent_id=$(this).attr('data-curent-id');

            $('.booking-calendar-wrapper-allinone .has_future[data-curent-id!='+curent_id+']').addClass('pick_block_dates');

        } else {
            var curent_id = $(this).attr('data-curent-id');

            all_calendar_click = 0;
            $(this).addClass('calendar-reserved-stop');
            parent = $(this).parent().parent();
            $('.has_future[data-curent-id="'+curent_id+'"]').each(function () {


                if ($(this).hasClass('calendar-reserved-start')) {
                    detect_start = 1;
                    start_date = $(this).attr('data-curent-date');
                }


                if (detect_start === 1) {
                   // $(this).addClass('calendar-reserved');
                    if ( $(this).hasClass('calendar-reserved') ){
                        has_reservation=1;
                    }
                }

                if ($(this).hasClass('calendar-reserved-stop')) {
                    detect_start = 0;
                    //$(this).addClass('calendar-reserved');
                    end_date = $(this).attr('data-curent-date');
                }

            });


            $('.clean_reservation').show();
            if(has_reservation==1){
                $('.clean_reservation').hide();
            }


            $('.booking-calendar-wrapper-allinone .calendar-selected').removeClass('calendar-selected ');
            $('.booking-calendar-wrapper-allinone .has_future').removeClass('pick_block_dates calendar-reserved-stop calendar-reserved-start');
            allinone_mark_as_booked(parent, start_date, end_date,curent_id);
        }
    });


    function allinone_mark_as_booked(parent, start_date, end_date,curent_id) {

      
        var modal_all_inone = jQuery('#allinone_reservation_modal');
        modal_all_inone.appendTo("body");



        jQuery('#allinone_reservation_modal').modal();
        jQuery('#start_date_owner_book').val( wpestate_convert_selected_days_reverse( wpestate_timeConverter_noconver(start_date) ) );
        jQuery('#end_date_owner_book').val(wpestate_convert_selected_days_reverse ( wpestate_timeConverter_noconver(end_date) ) );
        


        jQuery('#property_id').val(curent_id);
        jQuery('#listing_edit').val(curent_id);

    }


    // delete custom period
    $('.delete_custom_period a').on('click',function (event) {
        event.preventDefault();
        var parent,ajaxurl, edit_id,from_date,to_date;
        ajaxurl     = ajaxcalls_add_vars.admin_url + 'admin-ajax.php';

        edit_id     = parseInt( jQuery(this).parent().attr('data-editid'),10  );
        from_date   = parseInt( jQuery(this).parent().attr('data-fromdate'),10  );
        to_date     = parseInt( jQuery(this).parent().attr('data-todate'),10  );
        parent      =    jQuery(this).parent().parent();

         var nonce = jQuery('#wprentals_delete_custom_period_nonce').val();
         $.ajax({
            type:       'POST',
            url:        ajaxurl,

            data: {
                'action'            :  'wpestate_ajax_delete_custom_period',
                'edit_id'           :  edit_id,
                'from_date'         :  from_date,
                'to_date'           :  to_date,
                'security'          :   nonce

            },
            success: function (data) {
                parent.remove();
                location.reload();
            },
            error: function (errorThrown) {
            }
        });

    });




    $('#form_submit_1').on('click',function () {

        if( !$(this).hasClass('externalsubmit') ){
            return;
        }

        jQuery(this).unbind('click');

        var children_as_guests,overload_guest,max_extra_guest_no,property_affiliate,security,ajaxurl,title,prop_category,prop_action_category,property_city,property_area_front,property_country,property_description,guest_no,new_estate,instant_booking;

        title               = jQuery('#title').val();
        prop_category       = jQuery('#prop_category_submit').val();
        prop_action_category= jQuery('#prop_action_category_submit').val();
        property_city       = jQuery('#property_city').val();

        if(property_city === '' || typeof(property_city)==='undefined'){
            property_city       = jQuery('#property_city_front_autointernal').val();
        }

        instant_booking=0;
        if (jQuery('#instant_booking').is(':checked')  ){
            instant_booking        =  1;
        }
        
        children_as_guests=0;
        if (jQuery('#children_as_guests').is(':checked')  ){
            children_as_guests        =  1;
        }

        max_extra_guest_no             =    jQuery('#max_extra_guest_no').val();
        overload_guest              =   0;
        if (jQuery('#overload_guest').is(':checked')  ){
            overload_guest        =  1;
        }


        property_area_front = jQuery('#property_area_front').val();
        property_country    = jQuery('#property_country').val();
        property_description= jQuery('#property_description').val();
        guest_no            = jQuery('#guest_no').val();
        property_affiliate  = jQuery('#property_affiliate').val();
        new_estate          = jQuery('#new_estate').val();
        security            = jQuery('#security-login-submit').val();
        ajaxurl             =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';



        if( wpestate_check_for_mandatory() ) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#new_post").offset().top
            }, 500);

            return;
        }
        //dataType:   'json',




        $.ajax({
            type:       'POST',
            url:        ajaxurl,

            data: {
                'action'                :  'wpestate_ajax_front_end_submit',
                'title'                 :  title,
                'prop_category'         :  prop_category,
                'prop_action_category'  :  prop_action_category,
                'property_city'         :  property_city,
                'property_area_front'   :  property_area_front,
                'property_country'      :  property_country,
                'property_description'  :  property_description,
                'guest_no'              :  guest_no,
                'new_estate'            :  new_estate,
                'instant_booking'       :  instant_booking,
                'children_as_guests'    :  children_as_guests,
                'property_affiliate'    :  property_affiliate,
                'overload_guest'        :  overload_guest,
                'max_extra_guest_no'    :  max_extra_guest_no,
                'security'              :  security
            },
            success: function (data) {

                jQuery("#new_estate").val('');
                jQuery('#wp-login-but').attr('data-mixval',data);
                wpestate_show_login_form(1,0,data);

            },
            error: function (errorThrown) {
            }
        });

    });






    var curent_m,curent_m_set, input , defaultBounds, options, componentForm, autocomplete, place, calendar_click, calendar_click_price;
    curent_m=2;
    curent_m_set=1;
    var max_month = parseInt(ajaxcalls_vars.max_month_no);

    $('#calendar-next').on('click',function () {
        if (curent_m < (max_month-2) ) {
            curent_m = curent_m + 1;
        } else {
            curent_m = max_month;
        }

        $('.booking-calendar-wrapper').hide();
        $('.booking-calendar-wrapper').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m || curent === curent_m + 1) {
                $(this).fadeIn();
            }
        });
    });

    $('#calendar-prev').on('click',function () {
        if (curent_m > 3) {
            curent_m = curent_m - 1;
        } else {
            curent_m = 2;
        }

        $('.booking-calendar-wrapper').hide();
        $('.booking-calendar-wrapper').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m || curent === curent_m - 1) {
                $(this).fadeIn();
            }
        });
    });


    $('#calendar-next-internal').on('click',function () {
        if (curent_m < (max_month-2)) {
            curent_m = curent_m + 1;
        } else {
            curent_m = max_month-1;
        }

        $(".booking-calendar-wrapper-in").hide();
        $('.booking-calendar-wrapper-in').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m || curent === curent_m + 1 || curent === curent_m + 2) {
               // $(this).fadeIn();
                $(this).css('display','inline-block');
            }
        });

    });

    $('#calendar-prev-internal').on('click',function () {
        if (curent_m > 3) {
            curent_m = curent_m - 1;
        } else {
            curent_m = 3;
        }

        $('.booking-calendar-wrapper-in').hide();
        $('.booking-calendar-wrapper-in').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m || curent === curent_m - 1  || curent === curent_m - 2) {
                //$(this).fadeIn();
                 $(this).css('display','inline-block');
            }
        });
    });

    $('#calendar-prev-internal-set').on('click',function () {
        if (curent_m_set > 1) {
            curent_m_set = curent_m_set - 1;
        } else {
            curent_m_set = 1;
        }

        $('.booking-calendar-wrapper-in').hide();
        $('.booking-calendar-wrapper-in').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m_set ) {
                //$(this).fadeIn();
                 $(this).css('display','inline-block');
            }
        });
    });

       $('#calendar-next-internal-set').on('click',function () {
        if (curent_m_set < (max_month-2)) {
            curent_m_set = curent_m_set + 1;
        } else {
            curent_m_set = max_month-1;
        }

        $(".booking-calendar-wrapper-in").hide();
        $('.booking-calendar-wrapper-in').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m_set ) {
               // $(this).fadeIn();
                $(this).css('display','inline-block');
            }
        });

    });

     $('#calendar-prev-internal-allinone').on('click',function () {
        if (curent_m_set > 1) {
            curent_m_set = curent_m_set - 1;
        } else {
            curent_m_set = 1;
        }

        $('.booking-calendar-wrapper-allinone').hide();
        $('.booking-calendar-wrapper-allinone').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m_set ) {
                //$(this).fadeIn();
                 $(this).css('display','inline-block');
            }
        });
    });

    $('#calendar-next-internal-allinone').on('click',function () {

        if (curent_m_set < (max_month-2) )  {
            curent_m_set = curent_m_set + 1;
        } else {
            curent_m_set = max_month-1;
        }

        $(".booking-calendar-wrapper-allinone ").hide();
        $('.booking-calendar-wrapper-allinone ').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m_set ) {
               // $(this).fadeIn();
                $(this).css('display','inline-block');
            }
        });

    });




   // booking-calendar-wrapper-in-price
    $('#calendar-next-internal-price').on('click',function () {
        if (curent_m < (max_month-2) ) {
            curent_m = curent_m + 1;
        } else {
            curent_m = max_month-1;
        }

        $(".booking-calendar-wrapper-in-price").hide();
        $('.booking-calendar-wrapper-in-price').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m || curent === curent_m + 1 ) {
                $(this).fadeIn();
            }
        });

    });

    $('#calendar-prev-internal-price').on('click',function () {
        if (curent_m > 2) {
            curent_m = curent_m - 1;
        } else {
            curent_m = 2;
        }

        $('.booking-calendar-wrapper-in-price').hide();
        $('.booking-calendar-wrapper-in-price').each(function () {
            var curent;
            curent   =   parseInt($(this).attr('data-mno'), 10);
            if (curent === curent_m || curent === curent_m - 1 ) {
                $(this).fadeIn();
            }
        });
    });




    $('#close_custom_price_internal').on('click',function () {
        $('.booking-calendar-wrapper-in-price td').each(function () {
            $(this).removeClass('calendar-reserved-start-price');
            $(this).removeClass('calendar-reserved-stop-price');
            $(this).removeClass('calendar-reserved-price');
        });
    });

    $('#close_reservation_internal').on('click',function () {
        var start_remove = 0;
        $('.calendar-reserved').each(function () {
            if ($(this).hasClass('calendar-reserved-start')) {
                $(this).removeClass('calendar-reserved-start');
                $(this).removeClass('calendar-reserved');
                start_remove = 1;
            }
            if (start_remove === 1) {
                $(this).removeClass('calendar-reserved');
            }

            if ($(this).hasClass('calendar-reserved-stop')) {
                $(this).removeClass('calendar-reserved-stop');
                $(this).removeClass('calendar-reserved');
                start_remove = 0;
            }
        });
    });


    ////////////////////////////////////////////////////////////////////////////
    /// autocomplete for submission step 1
    ////////////////////////////////////////////////////////////////////////////

    if (typeof google === 'object' && typeof google.maps === 'object' && parseInt( mapbase_vars.wprentals_places_type) == 1 ) {
        input = (document.getElementById('property_city_front'));
        defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-90, -180),
            new google.maps.LatLng(90, 180)
        );

        options = {
            bounds: defaultBounds,
            types: ['(cities)'],

        };

        componentForm = {
            establishment: 'long_name',
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'long_name',
            administrative_area_level_2: 'long_name',
            administrative_area_level_3: 'long_name',
            administrative_area_level_4: 'long_name',
            country: 'long_name',
            postal_code: 'short_name',
            postal_code_prefix: 'short_name',
            neighborhood: 'long_name',
            colloquial_area:'long_name',
            natural_feature:'long_name',
            sublocality_level_1: 'long_name',
            sublocality: 'long_name',
        };


        if (document.getElementById('property_city_front')) {
            autocomplete = new google.maps.places.Autocomplete(input, options);

            if(ajaxcalls_add_vars.limit_country==='yes' && ajaxcalls_add_vars.limit_country_select!='' ){
                autocomplete.setComponentRestrictions(
                    {'country': [ajaxcalls_add_vars.limit_country_select]});
                  
            }

          

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                place = autocomplete.getPlace();
                wprentals_google_fillInAddress(place);
            });
        }
    }















    function wprentals_google_fillInAddress(place) {
        var i, addressType, temp, val ,have_city,admin_area;
        have_city=0;
        admin_area='';
        var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
        var map_city = new google.maps.Map(document.getElementById('property_country'), {
            center: pyrmont,
            zoom: 15
        });


        for (i = 0; i < place.address_components.length; i++) {
            addressType = place.address_components[i].types[0];
            temp = '';
            val = place.address_components[i][componentForm[addressType]];

            if (addressType === 'street_number' || addressType === 'route') {
              //  document.getElementById('property_address').value =  document.getElementById('property_address').value +', '+ val;
            } else if (
                addressType === 'sublocality_level_1' || 
                addressType === 'sublocality' || 
                addressType === 'neighborhood') {

                $('#property_area_front').val(val);
            } else if (addressType === 'postal_code_prefix') {

            } else if (addressType === 'postal_code') {

            } else if (addressType === 'administrative_area_level_4') {
                admin_area = wpestate_build_admin_area(admin_area,val);
            } else if (addressType === 'administrative_area_level_3') {
                admin_area = wpestate_build_admin_area(admin_area,val);
            } else if (addressType === 'administrative_area_level_2') {
                admin_area = wpestate_build_admin_area(admin_area,val);
            } else if (addressType === 'administrative_area_level_1') {
                admin_area = wpestate_build_admin_area(admin_area,val);
            } else if (addressType === 'locality' ){
                 $('#property_city').val(val); have_city=1;
            } else if ( addressType === 'colloquial_area'  ){
                $('#property_city').val(val); have_city=1;
            } else if (addressType === 'country' || addressType === 'natural_feature') {
                $('#property_country').val(val); have_city=1;
            } else {

            }
            if(have_city===0){
                wpestate_second_measure_city_submit('property_city',place.adr_address);
            }
        }


        if( $('#property_city').val()!==''){
            $('#property_admin_area').val( $('#property_city').val()+", "+admin_area);
        }

//       / submit_change();
    }

    function  wpestate_second_measure_city_submit(stringplace,adr_address){
        var new_city;
        new_city = $(adr_address).filter('span.locality').html() ;

        $('#'+stringplace).val(new_city);
    }

    function wpestate_build_admin_area(admin_area,val,map_city){
       // wpestate_translate_google_fuckups(val);
        if(admin_area ===''){
            admin_area = admin_area+val;
        }else{
            admin_area = admin_area+", "+val;
        }

        $('#property_admin_area').val(admin_area);

        return admin_area;
    }


    function wpestate_translate_google_fuckups(translate){


        var request = {
            query: translate
        };

        var service = new google.maps.places.PlacesService(map_city);
        service.textSearch(request, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

        }
    }


    ////////////////////////////////////////////////////////////////////////////
    //calendar function
    ////////////////////////////////////////////////////////////////////////////
    function wpestate_custom_price_set(parent, start_date, end_date) {
        jQuery('#owner_price_modal').modal();
        jQuery('#start_date_owner_book').val( wpestate_convert_selected_days_reverse( wpestate_timeConverter_noconver(start_date) ) );
        jQuery('#end_date_owner_book').val(wpestate_convert_selected_days_reverse ( wpestate_timeConverter_noconver(end_date) ) );
        wpestate_mark_as_price_actions();
    }

    function wpestate_mark_as_price_actions(){


        var   period_price_per_month,period_price_per_week,period_extra_price_per_guest, period_price_per_weekeend, period_checkin_change_over, period_checkin_checkout_change_over, period_min_days_booking,start_from, end_to, listing_edit, new_price, ajaxurl;
        $('#set_price_dates').on('click',function () {
            jQuery('#book_dates').empty().text(ajaxcalls_vars.saving);
            start_from                          =   jQuery('#start_date_owner_book').val();
            end_to                              =   jQuery('#end_date_owner_book').val();
            listing_edit                        =   jQuery('#listing_edit').val();
            new_price                           =   jQuery('#new_custom_price').val();
            period_min_days_booking             =   jQuery('#period_min_days_booking').val();
            period_extra_price_per_guest        =   jQuery('#period_extra_price_per_guest').val();
            period_price_per_weekeend           =   jQuery('#period_price_per_weekeend').val();
            period_checkin_change_over          =   jQuery('#period_checkin_change_over').val();
            period_checkin_checkout_change_over =   jQuery('#period_checkin_checkout_change_over').val();
            period_price_per_week               =   jQuery('#period_week_price').val();
            period_price_per_month              =   jQuery('#period_month_price').val();

            ajaxurl         =   control_vars.admin_url + 'admin-ajax.php';
            var nonce = jQuery('#wprentals_custom_price').val();


            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    'action'                                :   'wpestate_ajax_add_custom_price',
                    'book_from'                             :   start_from,
                    'book_to'                               :   end_to,
                    'listing_id'                            :   listing_edit,
                    'new_price'                             :   new_price,
                    'period_min_days_booking'               :   period_min_days_booking,
                    'period_extra_price_per_guest'          :   period_extra_price_per_guest,
                    'period_price_per_weekeend'             :   period_price_per_weekeend,
                    'period_checkin_change_over'            :   period_checkin_change_over,
                    'period_checkin_checkout_change_over'   :   period_checkin_checkout_change_over,
                    'period_price_per_week'                 :   period_price_per_week,
                    'period_price_per_month'                :   period_price_per_month,
                    'security'                              :   nonce,
                },
                success: function (data) {

                    jQuery(this).removeClass('calendar-reserved-stop-price');
                    jQuery(this).removeClass('calendar-reserved-start-price');
                    jQuery('#owner_price_modal').modal('hide');
                    jQuery('.booking-calendar-wrapper-in-price .calendar-reserved-price .price-day').remove();
                    jQuery('.booking-calendar-wrapper-in-price .calendar-reserved-price .custom_set_price').remove();
                    jQuery('.booking-calendar-wrapper-in-price .calendar-reserved-price').append('<span class="custom_set_price">'+data+'</span>');
                    jQuery('.booking-calendar-wrapper-in-price .calendar-reserved-price').removeClass('calendar-reserved-price,calendar-reserved-start-price,calendar-reserved-stop-price');
                    jQuery('#book_dates').empty().text(ajaxcalls_vars.reserve);
                    jQuery('#book_notes').val('');
                    jQuery('.booking-calendar-wrapper-in-price td').removeClass('calendar-reserved-stop-price');
                    jQuery('.booking-calendar-wrapper-in-price td').removeClass('calendar-reserved-start-price');
                    jQuery('.booking-calendar-wrapper-in-price td').removeClass('calendar-reserved-price');
                    location.reload();
                },
                error: function (errorThrown) {

                }
            });
        });
    }


    function wpestate_mark_as_booked(parent, start_date, end_date) {
        jQuery('#owner_reservation_modal').modal();


        var date_format = control_vars.date_format.toUpperCase();

        start_date =                 moment.unix(start_date).utc().format(date_format);
        jQuery('#start_date_owner_book').val(start_date);

        end_date =                 moment.unix(end_date).utc().format(date_format);
        jQuery('#end_date_owner_book').val(end_date);


        wpestate_mark_as_booked_actions();
    }

    function wpestate_mark_as_booked_actions() {
        $('#book_dates').unbind('click');
        $('#book_dates').on('click',function () {
            wpestate_check_booking_valability_internal();
        });
    }

    calendar_click = 0;
    $('.booking-calendar-wrapper-in .has_future').on('click',function (event) {

        if ($(this).hasClass('calendar-reserved')) { // click on a booked spot
            if (!$(this).hasClass('start_reservation') ){
                return;
            } else{

                if(calendar_click === 0){
                    return;
                }else{
                    $(this).addClass('calendar-selected');
                }

            }

        }else{
            $(this).addClass('calendar-selected');
        }

        var parent, detect_start, start_date, end_date;
        detect_start = 0;

        if (calendar_click === 0) { // start a new period
            calendar_click = 1;
            $(this).addClass('calendar-reserved-start');
        } else {
            calendar_click = 0;
            $(this).addClass('calendar-reserved-stop');
            parent = $(this).parent().parent();
            $('.has_future').each(function () {
                if ($(this).hasClass('calendar-reserved-start')) {
                    detect_start = 1;
                    start_date = $(this).attr('data-curent-date');
                }
                if ($(this).hasClass('calendar-reserved-stop')) {
                    detect_start = 0;
                    $(this).addClass('calendar-reserved');
                    end_date = $(this).attr('data-curent-date');
                }
                if (detect_start === 1) {
                    $(this).addClass('calendar-reserved');
                }
            });
            $('.booking-calendar-wrapper-in .calendar-selected').removeClass('calendar-selected');
            wpestate_mark_as_booked(parent, start_date, end_date);
        }
    });

    // custom adding price
    calendar_click_price = 0;
    $('.booking-calendar-wrapper-in-price .has_future').on('click',function () {

        $(this).addClass('calendar-selected');


        var parent, detect_start, start_date, end_date;
        detect_start = 0;

        if (calendar_click_price === 0) { // start a new period
            calendar_click_price = 1;
            $(this).addClass('calendar-reserved-start-price');
        } else {
            calendar_click_price = 0;
            $(this).addClass('calendar-reserved-stop-price');
            parent = $(this).parent().parent();
            $('.has_future').each(function () {
                if ($(this).hasClass('calendar-reserved-start-price')) {
                    detect_start = 1;
                    start_date = $(this).attr('data-curent-date');
                }
                if ($(this).hasClass('calendar-reserved-stop-price')) {
                    detect_start = 0;
                    $(this).addClass('calendar-reserved-price');
                    end_date = $(this).attr('data-curent-date');
                }
                if (detect_start === 1) {
                    $(this).addClass('calendar-reserved-price');
                }
            });
            $('.booking-calendar-wrapper-in-price .calendar-selected').removeClass('calendar-selected');
            wpestate_custom_price_set(parent, start_date, end_date);
        }
    });

     function wpestate_timeConverter_noconver(UNIX_timestamp) {
        var a, year, month, date, time;


        a       = new Date(UNIX_timestamp * 1000);
        year    = a.getUTCFullYear();
        month   = a.getUTCMonth() + 1;
        date    = a.getUTCDate();

        time    = year + '-' + ('0' + month).slice(-2)   + '-' + date;
        return time;
    }


    function wpestate_timeConverter(UNIX_timestamp) {
        var a, year, month, date, time;
        var d = new Date();
        var n = d.getTimezoneOffset();


        a       = new Date(UNIX_timestamp * 1000+n*60000);
        year    = a.getUTCFullYear();
        month   = a.getMonth() + 1;
        date    = a.getDate();



        time    = year + '-' + ('0' + month).slice(-2)   + '-' + date;
        return time;
    }

    ////////////////////////////////////////////////////////////////////////////
    //edit property location
    ////////////////////////////////////////////////////////////////////////////
    $('#edit_prop_ammenities').on('click',function () {


        var jsonData, ajaxurl, listing_edit, custom_fields_amm, counter, i;
        listing_edit    =  jQuery('#listing_edit').val();

        custom_fields_amm='';
        $('.feature_list_save').each(  function(){
            if( $(this).prop('checked')  ) {
                custom_fields_amm=custom_fields_amm+$(this).attr('data-feature')+"~";
            }
        } );



        wpestate_scrollToAnchor('all_wrapper');
        if( wpestate_check_for_mandatory(1) ) {
            return;
        }

        var nonce = jQuery('#wprentals_amm_features_nonce').val();
        ajaxurl  =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';
        $('#profile_message').empty().append('<div class="login-alert">' +  ajaxcalls_vars.saving + '<div>');
        $.ajax({
            type:       'POST',
            url:        ajaxurl,
            dataType:   'json',
            data: {
                'action'                :  'wpestate_ajax_update_listing_ammenities',
                'listing_edit'          :  listing_edit,
                'custom_fields_amm'     :  custom_fields_amm,
                'security'              :   nonce
            },
            success: function (data) {
                if (data.edited) {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                } else {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                }
                var redirect = jQuery('.next_submit_page').attr('href');
                window.location = redirect;
            },
            error: function (errorThrown) {
            }
        });
    });
    ////////////////////////////////////////////////////////////////////////////
    //edit property location
    ////////////////////////////////////////////////////////////////////////////
    $('#edit_prop_locations').on('click',function () {
        var jsonData, ajaxurl, listing_edit, property_county, property_state, property_address, property_zip, property_latitude, property_longitude, google_camera_angle, property_google_view;
        jsonData = JSON.parse(ajaxcalls_add_vars.tranport_custom_array);
        property_address        =  jQuery('#property_address').val();
        property_zip            =  jQuery('#property_zip').val();
        property_county         =  jQuery('#property_county').val();
        property_state          =  jQuery('#property_state').val();

        property_latitude       =  jQuery('#property_latitude').val();
        property_longitude      =  jQuery('#property_longitude').val();
        google_camera_angle     =  jQuery('#google_camera_angle').val();
        listing_edit            =  jQuery('#listing_edit').val();


        wpestate_scrollToAnchor('all_wrapper');
        if( wpestate_check_for_mandatory() ) {
            return;
        }
        var nonce = jQuery('#wprentals_edit_prop_locations_nonce').val();
        ajaxurl         =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';
        $('#profile_message').empty().append('<div class="login-alert">' +  ajaxcalls_vars.saving + '<div>');
        $.ajax({
            type:       'POST',
            url:        ajaxurl,
            dataType:   'json',
            data: {
                'action'                    :  'wpestate_ajax_update_listing_location',
                'property_address'          :  property_address,
                'property_zip'              :  property_zip,
                'property_latitude'         :  property_latitude,
                'property_longitude'        :  property_longitude,
                'google_camera_angle'       :  google_camera_angle,
                'property_state'            :   property_state,
                'property_county'           :   property_county,
                'listing_edit'              :   listing_edit,
                'security'                  :   nonce

            },
            success: function (data) {

                if (data.edited) {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                } else {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                }
                var redirect = jQuery('.next_submit_page').attr('href');
                window.location = redirect;
            },
            error: function (errorThrown) {
            }
        });
    });
        ////////////////////////////////////////////////////////////////////////////
    //edit property calendar
    ////////////////////////////////////////////////////////////////////////////
    $('#edit_calendar').on('click',function () {
        var jsonData, ajaxurl, listing_edit, property_icalendar_import,array_labels,array_feeds;

        property_icalendar_import   =  jQuery('#property_icalendar_import').val();
        listing_edit                =  jQuery('#listing_edit').val();

        ajaxurl         =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';
        $('#profile_message2').empty().append('<div class="login-alert">' +  ajaxcalls_vars.saving + '<div>');

        array_labels=[];
        $('.property_icalendar_import_name_new').each(function(){
            array_labels.push( $(this).val() );
        });

        array_feeds=[];
         $('.property_icalendar_import_feed_new').each(function(){
            array_feeds.push( $(this).val() );
        });

        var nonce = jQuery('#wprentals_edit_calendar_nonce').val();

        $.ajax({
            type:       'POST',
            url:        ajaxurl,
            dataType:   'json',
            data: {
                'action'                    :  'wpestate_ajax_update_ical_feed',
                'property_icalendar_import' :   property_icalendar_import,
                'listing_edit'              :   listing_edit,
                'array_feeds'               :   array_feeds,
                'array_labels'              :   array_labels,
                'security'                  :   nonce

            },
            success: function (data) {

                if (data.edited) {
                    $('#profile_message2').empty().append('<div class="login-alert">' + data.response + '<div>');
                    if(ajaxcalls_add_vars.submit_redirect!==''){
                      window.setTimeout(function(){
                        window.location.href=ajaxcalls_add_vars.submit_redirect;
                      },3000)

                    }

                } else {
                    $('#profile_message2').empty().append('<div class="login-alert">' + data.response + '<div>');
                }

            },
            error: function (errorThrown) {

            }
        });
    });


    $('.delete_imported_dates_singular').on('click',function(event){
        event.preventDefault();
        var edit_id,key, ajaxurl,parent;

        edit_id         =  jQuery(this).attr('data-edit-id');
        key             =  jQuery(this).attr('data-edit-id-key');
        ajaxurl         =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';


        $(this).parent().remove();
        var nonce = jQuery('#wprentals_edit_calendar_nonce').val();
        $.ajax({
            type:       'POST',
            url:        ajaxurl,

            data: {
                'action'    :  'wpestate_ajax_delete_imported_dates',
                'edit_id'   :   edit_id,
                'key'       :   key,
                'security'  :   nonce
            },
            success: function (data) {
                if(data=='done'){
                    location.reload();
                }
            },
            error: function (errorThrown) {
            }
        });
    });



    ////////////////////////////////////////////////////////////////////////////
    //edit property details
    ////////////////////////////////////////////////////////////////////////////
    $('#edit_prop_details').on('click',function () {
        "use strict";
        var value,temp_opt,i, jsonData, ajaxurl, property_size, property_rooms, property_bedrooms, property_bathrooms, listing_edit, custom_fields_val, variable, counter;
        property_size       =  jQuery('#property_size').val();
        property_rooms      =  jQuery('#property_rooms').val();
        property_bedrooms   =  jQuery('#property_bedrooms').val();
        property_bathrooms  =  jQuery('#property_bathrooms').val();
        listing_edit        =  jQuery('#listing_edit').val();
        custom_fields_val   =   '';
        jsonData = JSON.parse(ajaxcalls_add_vars.tranport_custom_array);
        for (i = 0; i < jsonData.length; i++) {
            counter = jsonData[i];
            value =$("#" + counter).val();
            if(typeof value==='undefined'){
                value='';
            }
            custom_fields_val = custom_fields_val + "~" + value;
        }

        wpestate_scrollToAnchor('all_wrapper');
        if( wpestate_check_for_mandatory() ) {
            return;
        }

        var extra_details_options              =    [];

        $('.extra_detail_option_wrapper').each(function(){
            temp_opt    =   '';
            temp_opt    =   $(this).find('.extra_option_name').val();
            temp_opt    =   temp_opt + '|' + $(this).find('.extra_option_value ').val();
            extra_details_options.push(temp_opt);
        });


        var beds_options = [];
        $('.beds_no ').each(function(){

            beds_options.push(jQuery(this).val());
        });

        var cancellation_policy     =  jQuery('#cancellation_policy').val();
        var other_rules             =  jQuery('#other_rules').val();
        var smoking_allowed         =  jQuery("input[name='smoking_allowed']:checked"). val();
        var pets_allowed            =  jQuery("input[name='pets_allowed']:checked"). val();
        var party_allowed           =  jQuery("input[name='party_allowed']:checked"). val();
        var children_allowed        =  jQuery("input[name='children_allowed']:checked"). val();








        ajaxurl         =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';
        $('#profile_message').empty().append('<div class="login-alert">' +  ajaxcalls_vars.saving + '<div>');



        var nonce = jQuery('#wprentals_edit_prop_details_nonce').val();
        $.ajax({
            type:       'POST',
            url:        ajaxurl,
            dataType:   'json',
            data: {
                'action'                :  'wpestate_ajax_update_listing_details',
                'property_size'         :  property_size,
                'property_rooms'        :  property_rooms,
                'property_bedrooms'     :  property_bedrooms,
                'property_bathrooms'    :  property_bathrooms,
                'listing_edit'          :  listing_edit,
                'custom_fields_val'     :  custom_fields_val,
                'extra_details_options' :  extra_details_options,
                'beds_options'          :   beds_options,
                'cancellation_policy'   :   cancellation_policy,
                'other_rules'           :   other_rules,
                'smoking_allowed'       :   smoking_allowed,
                'pets_allowed'          :   pets_allowed,
                'party_allowed'         :   party_allowed,
                'children_allowed'      :   children_allowed,
                'security'              :   nonce
            },
            success: function (data) {

                if (data.edited) {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                } else {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                }

                var redirect = jQuery('.next_submit_page').attr('href');
                window.location = redirect;
            },
            error: function (errorThrown) {
            }
        });
    });
    ////////////////////////////////////////////////////////////////////////////
    //edit property images
    ////////////////////////////////////////////////////////////////////////////
    $('#edit_prop_image').on('click',function () {



        var ajaxurl, video_type, video_id, attachid, attachthumb, listing_edit,virtual_tour;
        video_type    =  jQuery('#embed_video_type').val();
        video_id      =  jQuery('#embed_video_id').val();
        attachid      =  jQuery('#attachid').val();
        attachthumb   =  jQuery('#attachthumb').val();
        listing_edit  =  jQuery('#listing_edit').val();
        virtual_tour  =  jQuery('#virtual_tour').val();
        ajaxurl         =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';

        wpestate_scrollToAnchor('all_wrapper');
        if( wpestate_check_for_mandatory() ) {
            return;
        }

        var nonce = jQuery('#wprentals_edit_prop_image_nonce').val();

        $('#profile_message').empty().append('<div class="login-alert">' +  ajaxcalls_vars.saving + '<div>');
        $.ajax({
            type:       'POST',
            url:        ajaxurl,
            dataType:   'json',
            data: {
                'action'         :  'wpestate_ajax_update_listing_images',
                'video_type'     :  video_type,
                'video_id'       :  video_id,
                'attachid'       :  attachid,
                'attachthumb'    :  attachthumb,
                'listing_edit'   :  listing_edit,
                'virtual_tour'   :  virtual_tour,
                'security'       :   nonce

            },
            success: function (data) {
                if (data.edited) {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                } else {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                }
                var redirect = jQuery('.next_submit_page').attr('href');
                window.location = redirect;
            },
            error: function (errorThrown) {
            }
        });
    });


    ////////////////////////////////////////////////////////////////////////////
    //edit property price
    ////////////////////////////////////////////////////////////////////////////
    $('#edit_prop_price').on('click',function () {
        var booking_start_hour,booking_end_hour,book_type,temp_opt,extra_pay_options,early_bird_days,early_bird_percent,property_price_before_label,property_price_after_label,security_deposit,city_fee_percent,property_taxes,overload_guest,ajaxurl,checkin_checkout_change_over, checkin_change_over, price_per_weekeend,extra_price_per_guest,price_per_guest_from_one, price, price_label, price_week, price_month, listing_edit, city_fee, cleaning_fee,cleaning_fee_per_day,city_fee_per_day,min_days_booking;
        book_type       =  jQuery('#local_booking_type').val();
        price           =  jQuery('#property_price').val();
        city_fee        =  jQuery('#city_fee').val();
        cleaning_fee    =  jQuery('#cleaning_fee').val();
        price_label     =  jQuery('#property_label').val();
        price_week      =  jQuery('#property_price_per_week').val();
        price_month     =  jQuery('#property_price_per_month').val();
        listing_edit    =  jQuery('#listing_edit').val();


        property_taxes                 =    jQuery('#property_taxes').val();
        cleaning_fee_per_day           =    jQuery('#cleaning_fee_per_day').val();
        city_fee_per_day               =    jQuery('#city_fee_per_day').val();
        security_deposit               =    jQuery('#security_deposit').val();
        property_price_after_label     =    jQuery('#property_price_after_label').val();
        property_price_before_label    =    jQuery('#property_price_before_label').val();
        early_bird_percent             =    jQuery('#early_bird_percent').val();
        early_bird_days                =    jQuery('#early_bird_days').val();
        extra_pay_options              =    [];
        booking_start_hour             =    jQuery('#booking_start_hour').val();
        booking_end_hour               =    jQuery('#booking_end_hour').val();
       
        $('.extra_pay_option').each(function(){
            temp_opt    =   '';
            temp_opt    =   $(this).find('.extra_option_name').val();
            temp_opt    =   temp_opt + '|' + $(this).find('.extra_option_value ').val();
            temp_opt    =   temp_opt + '|' + $(this).find('select').val();
            extra_pay_options.push(temp_opt);
        });



        city_fee_percent = 0;
        if (jQuery('#city_fee_percent').is(':checked') ){
            city_fee_percent        =  1;
        }

        price_per_guest_from_one    =   0;
      
        if (jQuery('#price_per_guest_from_one').is(':checked')  ){
            price_per_guest_from_one        =  1;
        }
        
       

        min_days_booking            =  jQuery('#min_days_booking').val();
        extra_price_per_guest       =  jQuery('#extra_price_per_guest').val();
        price_per_weekeend          =  jQuery('#price_per_weekeend').val();
        checkin_change_over         =  jQuery('#checkin_change_over').val();
        checkin_checkout_change_over=  jQuery('#checkin_checkout_change_over').val();

        wpestate_scrollToAnchor('all_wrapper');
        if( wpestate_check_for_mandatory() ) {
            return;
        }


        var nonce = jQuery('#wprentals_edit_prop_price_nonce').val();
        ajaxurl         =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';
        $('#profile_message').empty().append('<div class="login-alert">' +  ajaxcalls_vars.saving + '<div>');
         //
        $.ajax({
            type:       'POST',
            url:        ajaxurl,
            dataType:   'json',
            data: {
                'action'                        :   'wpestate_ajax_update_listing_price',
                'price'                         :   price,
                'price_week'                    :   price_week,
                'price_month'                   :   price_month,
                'listing_edit'                  :   listing_edit,
                'city_fee'                      :   city_fee,
                'cleaning_fee'                  :   cleaning_fee,
                'cleaning_fee_per_day'          :   cleaning_fee_per_day,
                'city_fee_per_day'              :   city_fee_per_day,
                'min_days_booking'              :   min_days_booking,
                'price_per_guest_from_one'      :   price_per_guest_from_one,
                'price_per_weekeend'            :   price_per_weekeend,
                'checkin_change_over'           :   checkin_change_over,
                'checkin_checkout_change_over'  :   checkin_checkout_change_over,
                'extra_price_per_guest'         :   extra_price_per_guest,
                'property_taxes'                :   property_taxes,
                'security_deposit'              :   security_deposit,
                'property_price_after_label'    :   property_price_after_label,
                'property_price_before_label'   :   property_price_before_label,
                'early_bird_percent'            :   early_bird_percent,
                'early_bird_days'               :   early_bird_days,
                'extra_pay_options'             :   extra_pay_options,
                'city_fee_percent'              :   city_fee_percent,
                'book_type'                     :   book_type,
                'booking_start_hour'            :   booking_start_hour,
                'booking_end_hour'              :   booking_end_hour,
                'security'                      :   nonce
            },
            success: function (data) {

                if (data.edited) {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response +'<div>');
                } else {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                }
                var redirect = jQuery('.next_submit_page').attr('href');
                window.location = redirect;
            },
            error: function (errorThrown) {
            }
        });
    });

    ////////////////////////////////////////////////////////////////////////////
    //edit property description
    ////////////////////////////////////////////////////////////////////////////
    $('#edit_prop_1').on('click',function () {
        var ajaxurl, title,checkin_message,max_extra_guest_no,overload_guest, category, action_category, guests, city, country, area,listing_edit,prop_desc,property_admin_area,children_as_guests,instant_booking,aff_link,private_notes;
        title           =  jQuery('#title').val();
        category        =  jQuery('#prop_category_submit').val();
        action_category =  jQuery('#prop_action_category_submit').val();
        guests          =  jQuery('#guest_no').val();
        city            =  jQuery('#property_city').val();
        aff_link        =  jQuery('#property_affiliate').val();
        if(city ===''){
            city            =  jQuery('#property_city_front_autointernal').val();
        }
        if(ajaxcalls_add_vars.wpestate_autocomplete ==='no'){
            city            =  jQuery('#property_city_front_autointernal').val();
        }
        instant_booking=0;
        if (jQuery('#instant_booking').is(':checked')  ){
            instant_booking        =  1;
        }
        var wp_estate_replace_booking_form_local=0
        if (jQuery('#wp_estate_replace_booking_form_local').is(':checked')  ){
            wp_estate_replace_booking_form_local        =  1;
        }
       
        
        children_as_guests=0;
         if (jQuery('#children_as_guests').is(':checked')  ){
            children_as_guests        =  1;
        }
        
        max_extra_guest_no             =    jQuery('#max_extra_guest_no').val();
        overload_guest              =   0;
        if (jQuery('#overload_guest').is(':checked')  ){
            overload_guest        =  1;
        }



        area            =  jQuery('#property_area_front').val();
        country         =  jQuery('#property_country').val();
        listing_edit    =  jQuery('#listing_edit').val();
        prop_desc       =  jQuery('#property_description').val();
        property_admin_area = jQuery ('#property_admin_area').val();
        private_notes   =  jQuery('#private_notes').val();
        checkin_message =  jQuery('#checkin-message').val();
        ajaxurl         =  ajaxcalls_add_vars.admin_url + 'admin-ajax.php';


        wpestate_scrollToAnchor('all_wrapper');
        if( wpestate_check_for_mandatory() ) {
            return;
        }

        var nonce = jQuery('#wprentals_edit_prop_1_nonce').val();

        $('#profile_message').empty().append('<div class="login-alert">' +  ajaxcalls_vars.saving + '<div>');
        $.ajax({
            type:       'POST',
            url:        ajaxurl,
            dataType:   'json',
            data: {
                'action'            :   'wpestate_ajax_update_listing_description',
                'title'             :   title,
                'category'          :   category,
                'action_category'   :   action_category,
                'guests'            :   guests,
                'city'              :   city,
                'area'              :   area,
                'country'           :   country,
                'listing_edit'      :   listing_edit,
                'prop_desc'         :   prop_desc,
                'property_admin_area':  property_admin_area,
                'instant_booking'   :   instant_booking,
                'wp_estate_replace_booking_form_local':wp_estate_replace_booking_form_local ,              
                'children_as_guests':children_as_guests,
                'aff_link'          :   aff_link,
                'private_notes'     :   private_notes,
                'checkin_message'   :   checkin_message,
                'overload_guest'    :   overload_guest,
                'max_extra_guest_no':   max_extra_guest_no,
                'security'          :   nonce
            },
            success: function (data) {

                if (data.edited) {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                    var redirect = jQuery('.next_submit_page').attr('href');

                  window.location = redirect;
                } else {
                    $('#profile_message').empty().append('<div class="login-alert">' + data.response + '<div>');
                }

            },
            error: function (errorThrown) {
            }
        });
    });
}); // end jquery

function wpestate_scrollToAnchor(aid){
    var aTag = jQuery("#"+ aid);
    jQuery('html,body').animate({scrollTop: aTag.offset().top},'slow');
}


function wpestate_check_for_mandatory(is_check=0){
    var reply='';
    if(   ajaxcalls_add_vars.mandatory_fields.constructor === Array)  {
        ajaxcalls_add_vars.mandatory_fields.forEach( function(field) {

            var field_orignal=field;
            field=field.replace(/%/g, "");
            if( jQuery("#"+field).length > 0 ) { // daca exista


                if( jQuery("#"+field).is(':checkbox') &&  !jQuery("#"+field).prop('checked')){
                    reply=wpestate_build_warning(reply,field_orignal);
                }

                if( jQuery("#"+field).val()==='' ) { // check value
                    reply=wpestate_build_warning(reply,field_orignal);
                }


                if( field==="prop_category_submit" || field==="prop_action_category_submit" ){
                    if( jQuery("#"+field).val()==='-1' ) { // check value
                        reply=wpestate_build_warning(reply,field_orignal);
                    }
                }

                if(  field=="checkin_change_over" ||  field=="checkin_checkout_change_over" ){
                    if( jQuery("#"+field).val()==='0' ) { // check value
                        reply=wpestate_build_warning(reply,field_orignal);
                    }
                }
            }

        });
    }


    if(reply!==''){
        jQuery('#profile_message').empty().append('<div class="login-alert alert_err">'+ajaxcalls_add_vars.pls_fill +': '+ reply + '<div>');
        return true;
    }else{
        return false; // ready to edit
    }
}


function wpestate_build_warning(reply,field){

    if(reply===''){
        reply=reply+ajaxcalls_add_vars.mandatory_fields_label[field];
    }else{
        reply=reply+', '+ajaxcalls_add_vars.mandatory_fields_label[field];
    }
    return reply;
}
