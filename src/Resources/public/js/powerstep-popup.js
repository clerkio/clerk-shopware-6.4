const init_clerk_powerstep = (event_target) => {
    var popup = $("#clerk-powerstep");
    var buyWidget = $(".buy-widget");
    $("body").click(function() {
        if (popup.is(":visible")) {
            popup.hide();
        }
    });
    var product_Id = event_target.querySelector('input[name=product-id]').value;
    if (event_target.querySelector('input[name=product-parentId]').value !== "") {
        product_Id = event_target.querySelector('input[name=product-parentId]').value;
    }
    var product_name = event_target.querySelector('input[name=product-name').value;
    var product_category = event_target.querySelector('input[name=product-category').value;
    var clerk_powerstep_header = $('#clerk_powerstep_header_h2');
    var product_image = '';

    if (event_target.querySelector('input[name=product-image') !== null) {
        product_image = event_target.querySelector('input[name=product-image').value;
    }

    var clerk_powerstep_image = $('#clerk_powerstep_image_img');
    clerk_powerstep_header.text(product_name+' added to cart');
    clerk_powerstep_image.attr("src", product_image);
    clerk_powerstep_image.attr("alt", product_name);

    $('.clerk-powerstep-recommendation').each(function( index ) {
        $(this).attr('data-products','["'+product_Id+'"]');
        $(this).attr('data-category', product_category);
        Clerk('content','#clerk-powerstep-'+ $(this).data('template').replace('@',''));
    });

    popup.show();
    $(".offcanvas").toggle();
    setTimeout(function(){
        $(".modal-backdrop").toggle();
        $('html').removeClass('no-scroll');
    }, 100);
}

document.addEventListener('DOMContentLoaded', (load_event) => {
    const buyForms = document.querySelectorAll('form.buy-widget');
    for(let i=0;i<buyForms.length;i++){
        const buyForm = buyForms[i];
        buyForm.addEventListener('submit', (submit_event) => {
            const el = submit_event.target;
            if(el){
                init_clerk_powerstep(el);
            }
        });
        const submitButtons = buyForm.querySelectorAll('button.btn-buy.btn-primary');
        for(let j=0;j<submitButtons.length;j++){
            const submitButton = submitButtons[j];
            submitButton.addEventListener('click', (submit_event) => {
                const el = submit_event.target.closest('form');
                if(el){
                    init_clerk_powerstep(el);
                }
            });
        }
    }
});