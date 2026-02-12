/**
 * This is the main JavaScript file for the
 * Northdocks CI WP Theme.
 *
 * TODO Clean up, this is a quick and rough
 *      version due to a tight given deadline.
 *
 * @author Florian Roth
 */

const helper = {
    // "2023-08-16 10:33:58"
    cookie_date_str: _ => {
        const d = new Date();
        return `${d.getFullYear()}-${
                (d.getMonth()+1).toString().padStart(2, "0")}-${
                d.getDate().toString().padStart(2, "0")} ${
                d.getHours().toString().padStart(2, "0")}:${
                d.getMinutes().toString().padStart(2, "0")}:${
                d.getSeconds().toString().padStart(2, "0")}`;

    },
}

/**
 * Init Main Menu
 */
function init_main_menu() {
    var nav = jQuery('nav');
    var nav_list = jQuery('nav ul');
    var nav_burger = jQuery('#nd-nav-burger');
    var nav_bg = jQuery('#nd-nav-bg');
    var nav_socials = jQuery('#nd-socials');
    var nav_legal_links = jQuery('#nd-legal-links');
    var nav_search = jQuery('#nd-search-form');
    var nav_anim_speed = 300;

    // Menu List
    var nav_list_right = -(nav_list.width() + parseInt(nav_list.css('padding-right')) + 50);
    var nav_list_right_dst = 0;
    nav_list.css('right', nav_list_right + 'px');

    // Background
    var nav_bg_right = -nav_bg.width();
    var nav_bg_right_dst = -640;
    nav_bg.css('right', nav_bg_right + 'px');

    function show_socials() {
        nav_socials.stop().fadeIn(nav_anim_speed);
        nav_legal_links.stop().fadeIn(nav_anim_speed);
    }

    function hide_socials()
    {
        // Responsive XS only.
        if (jQuery(window).width() > 480) {
            return;
        }

        nav_socials.stop().fadeOut(nav_anim_speed);
        nav_legal_links.stop().fadeOut(nav_anim_speed);
    }

    function show_search() {
        nav_search.stop().fadeIn(nav_anim_speed);
    }

    function hide_search() {
        nav_search.stop().fadeOut(nav_anim_speed);
    }

    function show_menu()
    {
        nav_list.stop().animate({
            'right': nav_list_right_dst + 'px'
        }, nav_anim_speed);

        nav_bg.stop().animate({
            'right': nav_bg_right_dst + 'px'
        }, nav_anim_speed, function () {
            show_socials();
            show_search();
        });

        nav.attr('data-visible', true);
    }

    function hide_menu()
    {
        nav_list.stop().animate({
            'right': nav_list_right + 'px'
        }, nav_anim_speed);

        nav_bg.stop().animate({
            'right': nav_bg_right + 'px'
        }, nav_anim_speed);

        hide_socials();
        hide_search();

        nav.attr('data-visible', false);
    }
    
    nav_burger.click(function (e) {
        if (nav.attr('data-visible') === "false") {
            show_menu();
        } else {
            hide_menu();
        }
    });

    // Navigation
    /*var nav_list_items = jQuery('nav ul li a');

    nav_list_items.each(function (index) {
        var link = jQuery(this).attr('href');

        jQuery(this).click(function (e) {
            hide_menu();

            // TODO Jump to given page. Ajax?
        });
    });*/

    // Hide menu when the user clicked anywhere within the
    // page container.
    jQuery('#nd-page-container, nav ul li').click(function (e) {
        hide_menu();
    });
}

/**
 * Init Page Navigation
 */
function init_page_navigation() {

    // Page Container
    var page_up = jQuery('#nd-page-up');
    var page_down = jQuery('#nd-page-down');
    var page_container = jQuery('#nd-page-container');
    var page_indicator_container = jQuery('#nd-page-indicators');
    var page_indicator_fade_speed = 300;

    // Footer
    /*var page_footer = jQuery('#nd-footer');
    var page_footer_visible = false;
    var page_footer_fade_speed = 200;*/

    // Scroll
    var page_index = 0;
    var page_count = jQuery('.nd-page').length;
    var page_anim_speed = 600;
    var page_nav_fade_speed = 300;
    var page_can_scroll = true; // TODO Only on mobile devices!

    // Hide nav arrows initially; are more pages than one available?
    page_up.hide();
    page_down.hide();

    if (page_count > 1) {
        page_down.show(0);
        page_down.css('width', '100px');
        page_down.css('height', '100px');
    }

    function update_arrows()
    {
        if (page_index < 1) {
            page_up.stop().fadeOut(page_nav_fade_speed);
        } else {
            page_up.stop().fadeIn(page_nav_fade_speed);
        }

        if (page_index >= page_count - 1) {
            page_down.stop().fadeOut(page_nav_fade_speed);
        } else {
            page_down.stop().fadeIn(page_nav_fade_speed);
        }
    }

    function update_indicators()
    {
        if (page_index === 0) {
            page_indicator_container.stop().fadeOut(page_indicator_fade_speed);
        } else {
            page_indicator_container.stop().fadeIn(page_indicator_fade_speed);
        }

        page_indicator_container.find('ul li').each(function (i) {
            jQuery(this).removeClass('active');

            if (i === page_index) {
                jQuery(this).addClass('active');
            }
        });
    }

    function scroll_arrow_resize() {
        jQuery('#nd-page-down').css('width', '30px');
        jQuery('#nd-page-down').css('height', '30px');
    }

    function scroll_up()
    {

        scroll_arrow_resize();

        if (!page_can_scroll || (page_index - 1 < 0)) {
            return;
        }

        // Footer
        /*if (page_footer_visible)
        {
            page_footer.stop().animate({
                opacity: 0.0
            }, page_footer_fade_speed, function() {
                page_footer_visible = false;
                page_footer.hide();
            });
        }*/

        page_can_scroll = false;
        page_index--;

        page_container.stop().animate({
            top: (-(page_index) * 100) + '%'
        }, page_anim_speed, function () {
            page_can_scroll = true;
        });

        update_arrows();
        update_indicators();
    }

    function scroll_down()
    {

        scroll_arrow_resize();

        if (!page_can_scroll) {
            return;
        }

        if ((page_index + 1 >= page_count))
        {
            // Footer
            /*if (!page_footer_visible)
            {
                page_can_scroll = false;

                page_footer.stop().show().animate({
                    opacity: 1.0
                }, page_footer_fade_speed, function() {
                    page_footer_visible = true;
                    page_can_scroll = true;
                });
            }*/

            return;
        }

        page_can_scroll = false;
        page_index++;

        page_container.stop().animate({
            top: (-(page_index) * 100) + '%'
        }, page_anim_speed, function() {
            page_can_scroll = true;
        });

        update_arrows();
        update_indicators();
    }

    function scroll_to_page(index)
    {
        if (index < 0 || index > page_count - 1) {
            return;
        }

        // Footer
        /*if (page_footer_visible)
        {
            page_footer.stop().animate({
                opacity: 0.0
            }, page_footer_fade_speed, function() {
                page_footer_visible = false;
                page_footer.hide();
            });
        }*/

        page_index = index;

        page_container.stop().animate({
            top: (-(page_index) * 100) + '%'
        }, page_anim_speed);

        update_arrows();
        update_indicators();
    }

    // Hide footer when clicked anywhere.
    /*page_container.click(function() {

        if (page_footer.hasClass("nd-footer-relative")) {
            return;
        }

        page_footer.stop().animate({
            opacity: 0.0
        }, page_footer_fade_speed, function() {
            page_footer_visible = false;
            page_footer.hide();
        });
    });*/

    // Page Up
    page_up.click(function (e) {
        scroll_up();
    });

    // Page Down
    page_down.click(function (e) {
        scroll_down();
    });

    const findAncestor = function(el, cls) {
        if(el.classList.contains(cls)) {
            return el;
        }
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

    const mouseWheelHandler = function (e) {

        const direction = e.deltaY < 0 
            ? "UP"
            : e.deltaY > 0
                ? "DOWN"
                : null ;

        const mouseOverElement = document.elementFromPoint(e.clientX, e.clientY);
        const innerScroll = findAncestor(mouseOverElement, "inner-overflow-auto");

        if(innerScroll) {

            // scroll up && not at top
            if(direction === "UP" && innerScroll.scrollTop > 0) {
                return
            } 

            // scroll down && not at bottom
            if(direction === "DOWN" && innerScroll.scrollTop < (innerScroll.scrollHeight - innerScroll.offsetHeight)) {
                return;
            }             
        }

        if (e.deltaY < 0) {
            scroll_up();
        }
        else if (e.deltaY > 0) {
            scroll_down();
        }
    }
    
    const touchHandler = function (e) {

        const touch_end = e.originalEvent.changedTouches[0].clientY;
        let direction = null;

        if(touch_start > touch_end + 5) {
            direction = "DOWN";
        } else if(touch_start < touch_end - 5){
            direction = "UP";
        }

        const touchOverElement = document.elementFromPoint(
            e.originalEvent.changedTouches[0].clientX,
            e.originalEvent.changedTouches[0].clientY
        );
        const innerScroll = findAncestor(touchOverElement, "inner-overflow-auto");

        if(innerScroll) {

            // scroll up && not at top
            if(direction === "UP" && innerScroll.scrollTop > 0) {
                return
            } 

            // scroll down && not at bottom
            if(direction === "DOWN" && innerScroll.scrollTop < (innerScroll.scrollHeight - innerScroll.offsetHeight)) {
                return;
            }          
        }

        if(direction === "UP") {
            scroll_up();
        }
        else if(direction === "DOWN") {
            scroll_down();
        }

    }
    
    // Mouse wheel
    window.addEventListener('wheel', mouseWheelHandler);

    // Touch / Swipe
    let touch_start;
    jQuery(document).bind('touchstart', function (e){
        touch_start = e.originalEvent.touches[0].clientY;
    });
    jQuery(document).bind('touchend', touchHandler);

    // Page Indicators
    page_indicator_container.find('ul li').each(function (i) {
        jQuery(this).click(function (e) {
            scroll_to_page(parseInt(jQuery(this).data('page-index')));
        });
    });

    page_indicator_container.hide();
}

/**
 * Init Pagelink Navigation
 */
function init_pagelink_navigation() {
    var pagelinks = jQuery('.wp-block-northdocks-imagelink');
    var default_image_url = null;

    pagelinks.each(function() {
        var elem = jQuery(this);
        var link = elem.find('a');
        var image_url = elem.find('input[name="nd-imagelink-imageurl"]').val();
        var parent = elem.parent();
        var image = parent.find('.nd-page-image-fill img');
        const image_fadeout_speed = 300;
        const image_fadein_speed = 500;

        if (default_image_url === null) {
            default_image_url = image.attr('src');
        }

        link.mouseenter(function() {
            image.stop().fadeOut(image_fadeout_speed, function() {
                image.attr('src', image_url);
                image.stop().fadeIn(image_fadein_speed);
            });
        });

        link.mouseleave(function() {
            image.stop().fadeOut(image_fadeout_speed, function() {
                image.attr('src', default_image_url);
                image.stop().fadeIn(image_fadein_speed);
            });
        });
    });
}

jQuery(document).ready(function() {
    init_main_menu();
    init_pagelink_navigation();

    // Activate page navigation (smooth scrolling) only for non-Apple devices.
    var iOS = (/iPad|iPhone|iPod|Mac/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
        !window.MSStream;

    var page_container = jQuery('#nd-page-container');
    //var page_footer = jQuery('#nd-footer');

    // Normal Devices
    // if (!iOS)
    {
        init_page_navigation();
        page_container.css('overflow-x', 'initial');
        page_container.css('overflow-y', 'initial');
    }

    // Apple Devices
    // else
    // {
    //     // Enable overflow for vertical scrolling.
    //     page_container.css('overflow-x', 'hidden');
    //     page_container.css('overflow-y', 'auto');

    //     /*page_footer.addClass("nd-footer-relative");
    //     page_footer.show().css('opacity', '1.0');*/
    // }

    jQuery(".nd-page-nav-arrow").on({
        mouseenter: function () {
            this.src = this.src.replace("ndarrow.svg", "ndarrow-active.svg");
        },
        mouseleave: function () {
            this.src = this.src.replace("ndarrow-active.svg", "ndarrow.svg");
        }
    });

    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    } else {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }

});
