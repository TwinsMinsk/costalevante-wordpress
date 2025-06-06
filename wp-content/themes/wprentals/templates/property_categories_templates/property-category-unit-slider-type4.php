<?php
global $wpestate_full_page;
global $is_shortcode;
global $wpestate_places_slider;
global $wpestate_row_number_col;
global $place_id;
global $place_per_row;
$place_id                       =   intval($place_id);
$category_attach_id             =   '';
$category_tax                   =   '';
$category_featured_image        =   '';
$category_name                  =   '';
$category_featured_image_url    =   '';
$term_meta                      =   get_option( "taxonomy_$place_id");
$category_tagline               =   ''; 
$col_class                      =   'col-md-6';
$col_org                        =   4;


if(isset($is_shortcode) && $is_shortcode==1 ){
    $col_class='col-md-'.esc_attr($wpestate_row_number_col).' shortcode-col';
}

if(isset($is_widget) && $is_widget==1 ){
    $col_class='col-md-12';
    $col_org    =   12;
}

$term = get_term( $place_id );
$category_description   =   '';
$category_name='';
$category_tax = '';
$term_link='';
$category_count=0;
if(!is_wp_error($term)){
    $category_tax ='';
    if(isset($term->taxonomy)){
        $category_tax = $term->taxonomy;
    }
    $category_name='';
    if(isset($term->name)){
        $category_name = $term->name;
    }
  
    $category_count=0;
    if(isset($term->count)){
        $category_count = $term->count;
    }

   
    $term_link =  get_term_link( $place_id, $category_tax );
}



$term_meta                      =   get_option( "taxonomy_$place_id");
if(isset($term_meta['category_attach_id'])){
    $category_attach_id=$term_meta['category_attach_id'];
    $category_tagline = $term_meta['category_tagline'];    
    $category_featured_image= wp_get_attachment_image_src( $category_attach_id, 'property_full');
    $category_featured_image_url='';
    if(isset($category_featured_image[0])){
        $category_featured_image_url=$category_featured_image[0];
    }

}
if(isset($term_meta['category_featured_image'])){
    $category_featured_image=$term_meta['category_featured_image'];
}

if(isset($term_meta['category_attach_id'])){
    $category_attach_id=$term_meta['category_attach_id'];
    $category_tagline = $term_meta['category_tagline'];    
    $category_featured_image= wp_get_attachment_image_src( $category_attach_id, 'property_full');
    $category_featured_image_url='';
    if(isset($category_featured_image[0])){
        $category_featured_image_url=$category_featured_image[0];
    }
}
        


 if(isset($term_meta['category_tagline'])){
    $category_tagline=  stripslashes( $term_meta['category_tagline'] );           
}

if($category_featured_image_url==''){
    $category_featured_image_url=get_stylesheet_directory_uri().'/img/defaultimage.jpg';
}

if (is_wp_error($term_link)) {
    $term_link='';
}
?>  

<div class="places_slider_wrapper_type_4" data-link="<?php echo esc_url($term_link);?>" style="background-image: url(<?php print esc_url($category_featured_image_url); ?>)"> 
       
    <div class="places_cover" ></div>
    <div class="places_slider_type_1_content"  >
        <h4><a href="<?php echo esc_url($term_link); ?>">
            <?php
                echo mb_substr( $category_name,0,44); 
                if(mb_strlen($category_name)>44){
                    echo '...';   
                } 
            ?>
            </a> 
        </h4> 
        
        <div class="places_slider_type_1_tagline">
            <?php print esc_html($category_tagline);?>
        </div>
        
        <div class="places_slider_type_1_listings_no">
            <?php echo esc_html($category_count).' '.__('Listings','wprentals' )?>   
        </div>
        
    </div>          
</div>