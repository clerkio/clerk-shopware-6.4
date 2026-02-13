# Clerk.io for Shopware 6

The official [Clerk.io](https://clerk.io) plugin for Shopware 6. It connects your store to Clerk.io's AI platform, giving you personalized search, product recommendations, and visitor tracking.

**Version:** 1.2.9 · **PHP:** 7.4+ · **Shopware:** 6.4+

---

## What It Does

Unlike the Magento/WooCommerce/PrestaShop extensions, this plugin is **purely frontend**. It does not provide data feed endpoints — product/category/order sync is handled separately by the Clerk.io platform. This plugin handles:

1. **Renders Clerk.io on the frontend** — Injects [Clerk.js](https://docs.clerk.io/docs/clerkjs-quick-start) via Twig template overrides, which handles search results, live search, recommendation sliders, exit-intent popups, and powerstep.

2. **Tracks visitor behavior** — Logs page views, email, and completed orders so Clerk.io's AI can learn.

### Feature Overview

| Feature | What it does |
|---------|-------------|
| **Search** | Replaces Shopware's native search page with Clerk.io's. Supports faceted filtering. Suppresses native search-suggest dropdown. |
| **Live Search** | Type-ahead dropdown. 5 configurable injection positions (header-search, meta, footer, footer-minimal, navbar). |
| **Recommendations** | Sliders on product pages (cross-selling block or after description), category pages, and cart. |
| **Powerstep** | After add-to-cart, shows a popup, full-page overlay, or side-cart recommendations. Triggered via JS on `form.buy-widget` submit. |
| **Exit Intent** | Overlay triggered when the visitor moves to leave the page. |
| **Sales Tracking** | `<span>` on order finish page that logs the sale to Clerk.io. Uses `parentId` for variants. |
| **Email Collection** | Logs logged-in customer's email to Clerk.io on every page. |
| **Multi-Language** | Maps language IDs to different public API keys. |
| **CMS Shortcodes** | Embed `[[clerk@template-name]]` in CMS content to place recommendation widgets anywhere. |

---

## Installation

**Via Composer (recommended):**

```bash
composer require clerkio/clerkio64
bin/console plugin:refresh
bin/console plugin:install --activate clerkio64
bin/console cache:clear
```

**Manual:** Download from [GitHub Releases](https://github.com/clerkio/clerk-shopware/releases), extract to `custom/plugins/clerkio64/`, then run the commands above (skip composer).

After install, go to **Settings > System > Plugins > Clerk.io > Config** and enter your public API key from [my.clerk.io](https://my.clerk.io).

Full setup guide: [help.clerk.io/integrations/shopware-6/get-started](https://help.clerk.io/integrations/shopware-6/get-started/)

---

## How It Works Under the Hood

### No data feed endpoints

This plugin does **not** expose product/order/category sync endpoints. All data sync is handled by the Clerk.io platform directly (e.g. via Clerk.io's own import or a separate feed). The plugin is purely a frontend integration.

### Everything is Twig templates

The plugin works by extending Shopware's default Storefront Twig templates using `{% sw_extends %}`. There is almost no server-side PHP logic — just one event subscriber (which is essentially a stub) and one admin API test endpoint. All the work happens client-side via Clerk.js.

### How Clerk.js Gets Loaded

`views/storefront/layout/meta.html.twig` extends the `layout_head_javascript_tracking` block. When the plugin is enabled and a public key is set, it:

1. Loads `https://custom.clerk.io/{sales-channel-slug}.js`
2. Calls `Clerk('config', {...})` with the public key, locale, language ID, tax state/rate, and currency formatters
3. Sets page context (product ID, category ID, or page name)
4. Logs customer email if collecting emails
5. Scans for `[[clerk@template-name]]` shortcodes in CMS content and replaces them with Clerk spans

### How Search Works

`page/search/index.html.twig` completely replaces the `base_content` block on the search page with a Clerk search span (`data-query`, `data-target`). The native search-suggest dropdown is suppressed in `layout/header/search-suggest.html.twig` (parent block not called).

### How Recommendations Work

Product, category, and cart recommendations each override a Shopware Twig block and inject `<span class="clerk" data-template="@...">` elements. Product recommendations can replace the cross-selling block or appear after the description.

### How Powerstep Works

Three types: **popup**, **page**, **side-cart**. All work by listening to `form.buy-widget` submit events in JavaScript, reading hidden inputs for product data, and showing a recommendation overlay. No server-side redirect — it's all client-side JS.

---

## Structure

```
├── src/
│   ├── clerkio64.php                          ← Main plugin class (lifecycle methods — all no-op)
│   ├── Controller/Api/ApiTestController.php   ← Admin "Test API Keys" endpoint
│   ├── Core/Checkout/Event/
│   │   └── LineItemAddedSubscriber.php        ← Event subscriber (stub — adds empty extension)
│   └── Resources/
│       ├── config/
│       │   ├── config.xml                     ← All admin configuration fields
│       │   └── services.xml                   ← Symfony DI (registers subscriber + controller)
│       ├── public/
│       │   ├── css/                           ← Powerstep, search page, exit intent styles
│       │   ├── js/
│       │   │   ├── powerstep-popup.js         ← Popup powerstep logic
│       │   │   └── powerstep-page.js          ← Full-page powerstep logic
│       │   └── administration/js/clerkio64.js ← Compiled admin bundle (API test button)
│       ├── app/administration/src/            ← Admin source (Vue component, API test service)
│       └── views/storefront/
│           ├── base.html.twig                 ← Powerstep container on all pages
│           ├── layout/
│           │   ├── meta.html.twig             ← Clerk.js init + tracking + email + shortcodes
│           │   ├── header/
│           │   │   ├── header.html.twig       ← Exit intent
│           │   │   ├── search.html.twig       ← Live search (header-search position)
│           │   │   └── search-suggest.html.twig ← Suppresses native search suggest
│           │   ├── footer/footer.html.twig    ← Live search (footer position)
│           │   └── navbar/navbar.html.twig    ← Live search (navbar position)
│           ├── page/
│           │   ├── search/index.html.twig     ← Clerk search page + facets
│           │   ├── product-detail/            ← Product recommendations + powerstep hidden inputs
│           │   ├── checkout/
│           │   │   ├── cart/index.html.twig   ← Cart recommendations
│           │   │   └── finish/index.html.twig ← Sale tracking
│           │   └── content/index.html.twig    ← Powerstep on CMS pages
│           └── component/
│               ├── product/
│               │   ├── listing.html.twig      ← Category recommendations
│               │   └── card/action.html.twig  ← Powerstep hidden inputs on product cards
│               └── checkout/
│                   └── offcanvas-cart.html.twig ← Side-cart powerstep
│
├── composer.json                              ← Package: clerkio/clerkio64
└── pack_module.sh                             ← Build script (creates .zip)
```

---

## Customizing & Extending

If you need to customize the plugin, here are the parts to be careful with.

**It's all Twig templates.** There's almost no PHP to extend. If you need to change behavior, you're overriding Twig blocks in your theme. The plugin uses `{% sw_extends %}` on standard Storefront templates, so your theme can override the plugin's templates by placing files in the matching path under your theme's `views/` directory.

**Native search-suggest is completely suppressed.** When live search is enabled, `search-suggest.html.twig` doesn't call the parent block at all. The native Shopware search dropdown is gone. If you need it back, you'll need to override this template.

**Search page is completely replaced.** `page/search/index.html.twig` replaces the entire `base_content` block. Native Shopware search results are gone when the Clerk search page is enabled.

**Product recommendations can replace cross-selling.** When `productRecommendationsLocation` is set to `cross`, the plugin overrides the `page_product_detail_cross_selling` block, removing Shopware's native cross-selling section.

**Powerstep intercepts form submits.** `powerstep-popup.js` and `powerstep-page.js` listen to `form.buy-widget` submit events. They prevent the default offcanvas cart behavior and show Clerk recommendations instead. If you have custom add-to-cart forms, they may need the hidden inputs (`product-image`, `product-parentId`, `product-id`, `product-category`) that the plugin injects.

**No data feed.** If you need to customize what product data gets sent to Clerk.io, you can't do it through this plugin. Data sync is handled on the Clerk.io platform side.

---

## Troubleshooting

- **Plugin not visible:** Run `bin/console plugin:refresh && bin/console plugin:list | grep clerk`.
- **Nothing rendering:** Check that `enabled` is `true` and a public key is set. Open browser console for Clerk.js errors.
- **Search not working:** Verify `searchPageEnabled` is `true`. Check that the search input selector matches your theme (default: `.header-search-input`).
- **Powerstep not triggering:** Make sure your add-to-cart forms are `form.buy-widget` and have the hidden inputs. Check browser console for JS errors.
- **Cache issues:** Run `bin/console cache:clear`. Shopware aggressively caches Twig templates.

---

## Links

- [Setup Guide](https://help.clerk.io/integrations/shopware-6/get-started/)
- [Plugin Configuration](https://help.clerk.io/integrations/shopware-6/plugin/)
- [Clerk.js Docs](https://docs.clerk.io/docs/clerkjs-quick-start)
- [Design Template Language](https://docs.clerk.io/docs/clerkjs-template-language)
- [API Reference](https://docs.clerk.io/reference)
- [Dashboard](https://my.clerk.io)

---

## Contributing

1. Fork and branch from `master`
2. Test against a Shopware 6.4+ instance
3. Use `./pack_module.sh` to package for testing
4. Open a PR with a clear description

Issues & feature requests: [github.com/clerkio/clerk-shopware/issues](https://github.com/clerkio/clerk-shopware/issues)

---

## Support

- [help.clerk.io](https://help.clerk.io) · [support@clerk.io](mailto:support@clerk.io) · [status.clerk.io](https://status.clerk.io)
