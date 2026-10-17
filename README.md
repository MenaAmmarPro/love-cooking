# Our Kitchen — love-cooking

A little cookbook for Mena and Ammar. Ten starter dishes with ingredients and
method, plus your own. Pick a dish, cook it together, and tick it off.

Live: https://menaammarpro.github.io/love-cooking/

## How it works

- **Pick a dish** — "What's for tonight?" suggests one you haven't cooked yet.
- **The recipe book** — tap any card to read the ingredients and method.
- **We cooked this** — dates the dish and counts it toward your total.
- **Add a recipe** — name, ingredients and method (one item per line).
- **Copy a recipe link** — shares `?cook=<slug>`; whoever opens it sees
  *"Ammar wants to cook ... with you tonight"* and the recipe opens.

## Storage key

- `mena-cooking` — `{ cooked: { "<slug>": "YYYY-MM-DD" }, custom: [{ slug, name, tag, ingredients, steps }] }`

Made with love, just for you ♥
