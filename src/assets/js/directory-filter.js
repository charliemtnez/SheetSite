document.addEventListener("DOMContentLoaded", function () {
  var filter = document.getElementById("directory-filter");
  var grid = document.getElementById("directory-grid");
  if (!filter || !grid) return;

  filter.addEventListener("change", function () {
    var value = filter.value;
    var cards = grid.querySelectorAll("[data-filter-value]");
    var visibleCount = 0;

    cards.forEach(function (card) {
      var match = !value || card.getAttribute("data-filter-value") === value;
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    // Announce to screen readers
    var countEl = document.getElementById("directory-count");
    if (countEl) {
      countEl.textContent = "Showing " + visibleCount + " of " + cards.length + " results.";
    }
  });
});
