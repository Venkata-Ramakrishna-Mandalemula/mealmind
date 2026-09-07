# Home prototype photo sources

The following stock photographs illustrate the fictional Day 2 restaurant collection. They do not depict actual MealMind restaurants, menu offerings, or verified ingredients. Original approved design references remain unchanged.

Photos were downloaded on 2026-09-07 from Unsplash's image CDN, with `auto=format&fit=crop&w=1200&q=85` for a bounded local asset size. Their use follows the [Unsplash license](https://unsplash.com/license). Attribution is retained here for provenance even though that license does not require it. No photographer names are asserted without verified metadata.

| Local asset under `apps/web/public/images/food/` | Source |
| --- | --- |
| `discovery-bowl.jpg` | [Bowl photo](https://images.unsplash.com/photo-1546069901-ba9599a7e63c) |
| `indian-table.jpg` | [Curry photo](https://images.unsplash.com/photo-1565557623262-b51c2513a641) |
| `sushi.jpg` | [Sushi photo](https://images.unsplash.com/photo-1579871494447-9811cf80d66c) |
| `pizza.jpg` | [Pizza photo](https://images.unsplash.com/photo-1565299624946-b28f40a0ae38) |
| `salad.jpg` | [Salad photo](https://images.unsplash.com/photo-1512621776951-a57141f2eefd) |
| `tacos.jpg` | [Tacos photo](https://images.unsplash.com/photo-1565299585323-38d6b0865b47) |

Files are served locally through `next/image`; visitors do not request them from Unsplash. Next.js handles responsive image optimization. The missing-photo bakery uses an HTML/CSS fallback, not an invented stock photograph.
