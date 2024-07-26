const init_clerk_powerstep = (event_target) => {
    var page = document.querySelector("#clerk-powerstep");
    var pageContent = document.querySelectorAll(".content-main > .container");
    var cmsPageContent = document.querySelectorAll(".content-main > .container-main");

    const product_id_input = event_target.querySelector('input[name=product-id]') ?? null;
    const product_parent_id_input = event_target.querySelector('input[name=product-parentId]') ?? null;
    const product_id = product_parent_id_input?.value ?? product_id_input?.value;

    const product_name = event_target.querySelector('input[name=product-name')?.value ?? '';
    const product_category = event_target.querySelector('input[name=product-category')?.value ?? '';
    const product_image = event_target.querySelector('input[name=product-image')?.value ?? '';

    const clerk_powerstep_header = document.querySelector('#clerk_powerstep_header_h2');
    const clerk_powerstep_image = document.querySelector('#clerk_powerstep_image_img');

    clerk_powerstep_header.textContent = `${product_name} added to cart`;
    clerk_powerstep_image.src = product_image;
    clerk_powerstep_image.alt = product_name;

    document.querySelectorAll('.clerk-powerstep-recommendation').forEach(el => {
        el.dataset.products = `["${product_id}"]`;
        el.dataset.category = product_category;
        const span_id = el.dataset?.template ? el.dataset?.template.replace('@', '') : '';
        Clerk('content', `#clerk-powerstep-${span_id}`);
    });

    pageContent.forEach(el => {
        el.style.display = "none";
    })
    cmsPageContent.forEach(el => {
        el.style.display = "none";
    })
    page.style.display = 'contents';

    const offcanvas = document.querySelector(".offcanvas");
    if (offcanvas) {
        if (offcanvas.style.display == "none") {
            offcanvas.removeAttribute("style");
        } else {
            offcanvas.style.display = "none";
        }
    }

    setTimeout(() => {
        const modal_backdrop = document.querySelector(".modal-backdrop");
        if (modal_backdrop) {
            if (modal_backdrop.style.display == "none") {
                modal_backdrop.removeAttribute("style");
            } else {
                modal_backdrop.style.display = "none";
            }
        }
        document.documentElement.classList.remove('no-scroll');
    }, 100);

    document.querySelectorAll(".clerk_powerstep_close").forEach(el => {
        el.addEventListener("click", () => {
            page.style.display = "none";
            pageContent.forEach(el => {
                el.style.display = "block";
            });
            cmsPageContent.forEach(el => {
                el.style.display = "block";
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', (load_event) => {
    const buyForms = document.querySelectorAll('form.buy-widget');
    for (let i = 0; i < buyForms.length; i++) {
        const buyForm = buyForms[i];
        buyForm.addEventListener('submit', (submit_event) => {
            const el = submit_event.target;
            if (el) {
                init_clerk_powerstep(el);
            }
        });
        const submitButtons = buyForm.querySelectorAll('button.btn-buy.btn-primary');
        for (let j = 0; j < submitButtons.length; j++) {
            const submitButton = submitButtons[j];
            submitButton.addEventListener('click', (submit_event) => {
                const el = submit_event.target.closest('form');
                if (el) {
                    init_clerk_powerstep(el);
                }
            });
        }
    }
});
