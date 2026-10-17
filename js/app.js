"use strict";

(function () {
  var KEY = "mena-cooking";

  var RECIPES = [
    { name: "Pizza Night", tag: "Her favourite", ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil", "Olive oil"], steps: ["Warm the oven as hot as it goes.", "Stretch the dough with your hands.", "Spoon on sauce, add cheese, scatter basil.", "Bake until the edges blister."] },
    { name: "Chicken Biryani", tag: "A Sunday from home", ingredients: ["Basmati rice", "Chicken", "Yoghurt", "Fried onions", "Biryani masala", "Saffron"], steps: ["Marinate the chicken in yoghurt and spice.", "Par-boil the rice with whole spices.", "Layer rice over the chicken, add saffron milk.", "Cover and steam on a low flame."] },
    { name: "Sarmale", tag: "Mena's Romania", ingredients: ["Cabbage leaves", "Minced meat", "Rice", "Onion", "Tomato", "Sour cream"], steps: ["Mix the filling with rice and onion.", "Roll it into cabbage leaves.", "Layer in a pot with tomato.", "Simmer slowly for two hours."] },
    { name: "Chai & Paratha", tag: "A slow morning", ingredients: ["Tea leaves", "Milk", "Sugar", "Flour", "Ghee"], steps: ["Knead a soft dough.", "Roll and fry the paratha until golden.", "Boil the tea with milk and sugar.", "Share while it is hot."] },
    { name: "Cozonac", tag: "Sweet bread for a sweet day", ingredients: ["Flour", "Milk", "Yeast", "Walnuts", "Cocoa", "Sugar"], steps: ["Make a soft, sweet dough and let it rise.", "Spread walnuts and cocoa over it.", "Roll, braid, and let it rise again.", "Bake until it smells like a holiday."] },
    { name: "Mango Lassi", tag: "Cool and easy", ingredients: ["Ripe mango", "Yoghurt", "Milk", "Sugar", "Ice"], steps: ["Blend everything until smooth.", "Pour into two tall glasses."] },
    { name: "Pasta for Two", tag: "When we're tired but happy", ingredients: ["Pasta", "Tomatoes", "Garlic", "Olive oil", "Parmesan"], steps: ["Boil the pasta.", "Warm the garlic in olive oil.", "Toss with tomatoes and pasta.", "Finish with parmesan."] },
    { name: "Salata de Boeuf", tag: "A holiday table", ingredients: ["Boiled potatoes", "Carrots", "Peas", "Chicken", "Mayonnaise", "Pickles"], steps: ["Dice everything small.", "Fold together with mayonnaise.", "Chill, then decorate on top."] },
    { name: "Haleem", tag: "When we need comfort", ingredients: ["Wheat", "Lentils", "Meat", "Fried onions", "Garam masala"], steps: ["Soak the grains overnight.", "Cook with the meat until it falls apart.", "Blend smooth and simmer.", "Top with onions and lemon."] },
    { name: "Chocolate Cake", tag: "For the small celebrations", ingredients: ["Flour", "Cocoa", "Butter", "Sugar", "Eggs", "Dark chocolate"], steps: ["Beat the butter, sugar and eggs.", "Fold in the flour and cocoa.", "Bake until the middle is just set.", "Melt the chocolate and pour it over."] }
  ];

  function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function $(id) { return document.getElementById(id); }

  var els = {
    sentNote: $("sent-note"),
    tonight: $("tonight"),
    tonightResult: $("tonight-result"),
    cookedCount: $("cooked-count"),
    list: $("recipe-list"),
    view: $("recipe-view"),
    closeView: $("close-view"),
    viewName: $("view-name"),
    viewTag: $("view-tag"),
    viewIngredients: $("view-ingredients"),
    viewSteps: $("view-steps"),
    viewCooked: $("view-cooked"),
    markCooked: $("mark-cooked"),
    addName: $("add-name"),
    addIngredients: $("add-ingredients"),
    addSteps: $("add-steps"),
    add: $("add"),
    addMsg: $("add-msg"),
    share: $("share"),
    note: $("note")
  };

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1);
    if (m.length < 2) m = "0" + m;
    var day = String(d.getDate());
    if (day.length < 2) day = "0" + day;
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { cooked: {}, custom: [] };
      var data = JSON.parse(raw);
      return {
        cooked: data && data.cooked && typeof data.cooked === "object" ? data.cooked : {},
        custom: data && Array.isArray(data.custom) ? data.custom : []
      };
    } catch (e) {
      return { cooked: {}, custom: [] };
    }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = load();
  var currentSlug = null;

  function allRecipes() {
    var out = [];
    var used = {};
    function push(r) {
      var base = r.slug || slugify(r.name) || "dish";
      var slug = base;
      var n = 2;
      while (used[slug]) { slug = base + "-" + n; n++; }
      used[slug] = true;
      out.push({
        slug: slug, name: r.name, tag: r.tag || "",
        ingredients: r.ingredients || [], steps: r.steps || [],
        custom: !!r.custom
      });
    }
    var i;
    for (i = 0; i < RECIPES.length; i++) push(RECIPES[i]);
    for (i = 0; i < state.custom.length; i++) push(state.custom[i]);
    return out;
  }

  function findRecipe(slug) {
    var all = allRecipes();
    for (var i = 0; i < all.length; i++) { if (all[i].slug === slug) return all[i]; }
    return null;
  }

  function render() {
    var recipes = allRecipes();
    els.list.textContent = "";

    for (var i = 0; i < recipes.length; i++) {
      var r = recipes[i];
      var done = !!state.cooked[r.slug];

      var card = document.createElement("button");
      card.type = "button";
      card.className = "recipe-card" + (done ? " done" : "");
      card.setAttribute("data-slug", r.slug);

      var name = document.createElement("span");
      name.className = "rc-name";
      name.textContent = r.name;
      card.appendChild(name);

      if (r.tag) {
        var tag = document.createElement("span");
        tag.className = "rc-tag";
        tag.textContent = r.tag;
        card.appendChild(tag);
      }

      if (done) {
        var d = document.createElement("span");
        d.className = "rc-done";
        d.textContent = "Cooked " + state.cooked[r.slug];
        card.appendChild(d);
      }

      (function (slug) {
        card.addEventListener("click", function () { openRecipe(slug); });
      })(r.slug);

      els.list.appendChild(card);
    }

    els.cookedCount.textContent = String(Object.keys(state.cooked).length);
  }

  function openRecipe(slug) {
    var r = findRecipe(slug);
    if (!r) return;
    currentSlug = slug;
    els.viewName.textContent = r.name;
    els.viewTag.textContent = r.tag || "\u00a0";

    els.viewIngredients.textContent = "";
    for (var i = 0; i < r.ingredients.length; i++) {
      var li = document.createElement("li");
      li.textContent = r.ingredients[i];
      els.viewIngredients.appendChild(li);
    }

    els.viewSteps.textContent = "";
    for (var j = 0; j < r.steps.length; j++) {
      var s = document.createElement("li");
      s.textContent = r.steps[j];
      els.viewSteps.appendChild(s);
    }

    var done = state.cooked[slug];
    els.viewCooked.textContent = done ? "Cooked together on " + done : "Not cooked yet \u2014 shall we?";
    els.markCooked.textContent = done ? "Cook it again" : "We cooked this";
    els.view.hidden = false;
  }

  function closeRecipe() {
    els.view.hidden = true;
    currentSlug = null;
  }

  function markCooked() {
    if (!currentSlug) return;
    if (state.cooked[currentSlug]) { delete state.cooked[currentSlug]; }
    else { state.cooked[currentSlug] = todayISO(); }
    save(state);
    openRecipe(currentSlug);
    render();
  }

  function tonight() {
    var recipes = allRecipes();
    if (!recipes.length) return;
    var uncooked = recipes.filter(function (r) { return !state.cooked[r.slug]; });
    var pool = uncooked.length ? uncooked : recipes;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    els.tonightResult.textContent = "Tonight: " + pick.name + (pick.tag ? " \u2014 " + pick.tag : "");
    return pick.slug;
  }

  function add() {
    var name = String(els.addName.value || "").trim();
    if (!name) { els.addMsg.textContent = "Give the dish a name first."; return; }
    var ingredients = String(els.addIngredients.value || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    var steps = String(els.addSteps.value || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    var slug = slugify(name) || "dish";
    if (findRecipe(slug)) { els.addMsg.textContent = "\u201c" + name + "\u201d is already in the book."; return; }
    state.custom.push({ slug: slug, name: name, tag: "Our own", ingredients: ingredients, steps: steps });
    save(state);
    els.addName.value = "";
    els.addIngredients.value = "";
    els.addSteps.value = "";
    els.addMsg.textContent = "Added to the book \u2665";
    render();
  }

  function copy(text, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { els.note.textContent = message; },
        function () { els.note.textContent = text; }
      );
    } else {
      els.note.textContent = text;
    }
  }

  function share() {
    var slug = currentSlug;
    if (!slug) {
      var recipes = allRecipes();
      if (recipes.length) slug = recipes[Math.floor(Math.random() * recipes.length)].slug;
    }
    var base = window.location.origin + window.location.pathname;
    var link = slug ? base + "?cook=" + encodeURIComponent(slug) : base;
    copy(link, "Recipe link copied \u2014 send it to Ammar.");
  }

  function arrival() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("cook");
    if (!slug) return;
    var r = findRecipe(slug);
    if (r) openRecipe(slug);
    els.sentNote.hidden = false;
    els.sentNote.textContent = r
      ? "\u2665 Ammar wants to cook \u201c" + r.name + "\u201d with you tonight."
      : "\u2665 Ammar wants to cook something with you tonight.";
  }

  function init() {
    render();
    arrival();
    if (els.tonight) els.tonight.addEventListener("click", tonight);
    if (els.closeView) els.closeView.addEventListener("click", closeRecipe);
    if (els.markCooked) els.markCooked.addEventListener("click", markCooked);
    if (els.add) els.add.addEventListener("click", add);
    if (els.share) els.share.addEventListener("click", share);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
