const init_clerk_powerstep = (event_target) => {
    var popup = $("#clerk-powerstep");

    $("body").click(function() {
        if (popup.is(":visible")) {
            popup.hide();
        }
    });

    const product_id_input = event_target.querySelector('input[name=product-id]') ?? null;
    const product_parent_id_input = event_target.querySelector('input[name=product-parentId]') ?? null;
    const product_id = product_parent_id_input?.value ?? product_id_input?.value;

    const product_name = event_target.querySelector('input[name=product-name')?.value ?? '';
    const product_category = event_target.querySelector('input[name=product-category')?.value ?? '';
    const product_image = event_target.querySelector('input[name=product-image')?.value ?? '';

    var clerk_powerstep_header = $('#clerk_powerstep_header_h2');
    var clerk_powerstep_image = $('#clerk_powerstep_image_img');

    clerk_powerstep_header.text(product_name+' added to cart');
    clerk_powerstep_image.attr("src", product_image);
    clerk_powerstep_image.attr("alt", product_name);

    $('.clerk-powerstep-recommendation').each(function( index ) {
        $(this).attr('data-products','["'+product_id+'"]');
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