# Vendored scripts

Served from this site instead of a CDN, so no page load depends on a third
party and the versions are pinned.

| File | Source | Licence |
| --- | --- | --- |
| `jquery-3.6.1.min.js` | jQuery 3.6.1, `dist/jquery.min.js` of the npm package (identical to the cdnjs copy the theme loaded) | MIT |
| `feather-4.29.2.min.js` | feather-icons 4.29.2, `dist/feather.min.js` of the npm package | MIT |

The theme's `fresh.js` reads `Modernizr.touch`; `layouts/partials/javascript.html`
defines that one value inline instead of loading Modernizr.
