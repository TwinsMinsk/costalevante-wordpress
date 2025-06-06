<?php
global $wpestate_curent_fav;
global $wpestate_currency;
global $wpestate_where_currency;
global $show_compare;
global $wpestate_show_compare_only;
global $show_remove_fav;
global $wpestate_options;
global $isdashabord;
global $align;
global $align_class;
global $is_shortcode;
global $is_widget;
global $wpestate_row_number_col;
global $wpestate_full_page;
global $wpestate_listing_type;
global $wpestate_property_unit_slider;
global $wpestate_book_from;
global $wpestate_book_to;
global $wpestate_guest_no;
global $post;

$booking_type       =   wprentals_return_booking_type($post->ID);
$rental_type        =   wprentals_get_option('wp_estate_item_rental_type');




if($wpestate_listing_type==3){
    include(locate_template('templates/property_unit_3.php') );
    return true;
}else if($wpestate_listing_type==4){
    include(locate_template('templates/property_unit_4.php') );
    return true;
}

$pinterest          =   '';
$previe             =   '';
$compare            =   '';
$extra              =   '';
$property_size      =   '';
$property_bathrooms =   '';
$property_rooms     =   '';
$measure_sys        =   '';

$col_class  =   'col-md-6';
$col_org    =   4;
$title      =   get_sanitized_truncated_title($post->ID, 0);



if(isset($is_shortcode) && $is_shortcode==1 ){
    $col_class='col-md-'.esc_attr($wpestate_row_number_col).' shortcode-col';
}

if(isset($is_widget) && $is_widget==1 ){
    $col_class='col-md-12';
    $col_org    =   12;
}

if(isset($wpestate_full_page) && $wpestate_full_page==1 ){
    $col_class='col-md-4 ';
    $col_org    =   3;
    if(isset($is_shortcode) && $is_shortcode==1 && $wpestate_row_number_col==''){
        $col_class='col-md-'.esc_attr($wpestate_row_number_col).' shortcode-col';
    }
}

$link                       =   esc_url ( get_permalink());
$wprentals_is_per_hour      =   wprentals_return_booking_type($post->ID);
$link                       =   wprentals_card_link_autocomplete($post->ID,$link,$wprentals_is_per_hour);

$preview        =   array();
$preview[0]     =   '';
$favorite_class =   'icon-fav-off';
$fav_mes        =   esc_html__( 'add to favorites','wprentals');
if($wpestate_curent_fav){
    if ( in_array ($post->ID,$wpestate_curent_fav) ){
    $favorite_class =   'icon-fav-on';
    $fav_mes        =   esc_html__( 'remove from favorites','wprentals');
    }
}

$listing_type_class='property_unit_v2';
if($wpestate_listing_type==1){
    $listing_type_class='property_unit_v1';
}


global $schema_flag;
if( $schema_flag==1) {
   $schema_data='itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem" ';
}else{
   $schema_data=' itemscope itemtype="http://schema.org/Product" ';
}
?>


<div <?php print trim($schema_data);?> class="listing_wrapper <?php print esc_attr($col_class).' '.esc_attr($listing_type_class); ?>  property_flex " data-org="<?php print esc_attr($col_org);?>" data-listid="<?php print esc_attr($post->ID);?>" >

    <?php if( $schema_flag==1) {?>
        <meta itemprop="position" content="<?php print esc_html($prop_selection->current_post);?>" />
    <?php } ?>

    <div class="property_listing " >
        <?php

            $featured           =   intval  ( get_post_meta($post->ID, 'prop_featured', true) );
            $price              =   intval( get_post_meta($post->ID, 'property_price', true) );
            $property_city      =   get_the_term_list($post->ID, 'property_city', '', ', ', '') ;
            $property_area      =   get_the_term_list($post->ID, 'property_area', '', ', ', '');
            $property_action    =   get_the_term_list($post->ID, 'property_action_category', '', ', ', '');
            $property_categ     =   get_the_term_list($post->ID, 'property_category', '', ', ', '');
            $currency_code      =   wprentals_get_option('wp_estate_currency_symbol', '');
            ?>


            <?php wpestate_print_property_unit_slider($post->ID,$wpestate_property_unit_slider,$wpestate_listing_type,$wpestate_currency,$wpestate_where_currency,$link,''); ?>



            <?php
            if($featured==1){
                print '<div class="featured_div">'.esc_html__( 'featured','wprentals').'</div>';
            }

            echo wpestate_return_property_status($post->ID);
            ?>

            <div class="title-container">

                <?php
                if($wpestate_listing_type==1){
                    $price_per_guest_from_one       =   floatval( get_post_meta($post->ID, 'price_per_guest_from_one', true) );

                    if($price_per_guest_from_one==1){
                        $price          =   floatval( get_post_meta($post->ID, 'extra_price_per_guest', true) );
                    }else{
                        $price          =   floatval( get_post_meta($post->ID, 'property_price', true) );
                    }
                   print wprentals_card_property_price($post->ID);
                }
                ?>

                <?php
                $total_stars = get_post_meta($post->ID , 'property_stars', TRUE);
                if (!$total_stars) {
                    $total_stars = wpestate_calculate_property_rating($post->ID );
                }


                $tmp_rating = json_decode($total_stars, TRUE);
                //$review_number = number_format( ($tmp_rating['rating']),2,'.');

                $review_number = number_format((float)$tmp_rating['rating'], 2, '.', '');

                print   '<meta itemprop="ratingValue" content="'.floatval($review_number).'"/>';
                if(wpestate_has_some_review($post->ID)!==0){
                    print wpestate_display_property_rating( $post->ID );
                }else{
                    print '<div class=rating_placeholder></div>';
                }
                ?>

                


                <?php echo wprentals_card_owner_image($post->ID); ?>


                <div class="category_name">
                    <?php   include(locate_template('templates/property_card_templates/property_card_title.php'));   ?>

                    <div class="category_tagline map_icon">
                        <?php
                        if ($property_area != '') {
                            print trim($property_area).', ';
                        }
                        print trim($property_city);?>
                    </div>

                    <div class="category_tagline actions_icon">
                        <?php print wp_kses_post($property_categ.' / '.$property_action);?>
                    </div>
                </div>

                <?php 
                if($wpestate_listing_type==2){ 
                ?>
                <div class="property_unit_action">
                    <span class="icon-fav <?php print esc_attr($favorite_class); ?>" data-original-title="<?php print esc_attr($fav_mes); ?>" data-postid="<?php print intval($post->ID); ?>"><i class="fas fa-heart"></i></span>
                </div>
                <?php
                }
                ?>
            </div>


        <?php

        if ( isset($show_remove_fav) && $show_remove_fav==1 ) {
            print '<span class="icon-fav icon-fav-on-remove" data-postid="'.intval($post->ID).'"> '.esc_html($fav_mes).'</span>';
        }
        ?>

        </div>
    </div>
