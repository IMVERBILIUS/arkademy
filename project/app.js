// Tame the stage
var $window = $(window);
var $root = $("html, body");
// Keep hold of major sections
var $machine = $(".machine");
var $shelves = $(".shelves");
var $selection = $(".selection");
var $coins = $(".coins");
var $form = $("form");
var $input_selection = $form.find('[name="selection"]');
var $input_coinage = $form.find('[name="coinage"]');
var $tray = $(".tray");
var $return = $(".coin_return");

// Audit and Inventory
var stock = [
  {
    cat: "F",
    name: "Apple",
    price: 40,
    count: 12
  },
  {
    cat: "F",
    name: "Banana",
    price: 30,
    count: 12
  },
  {
    cat: "F",
    name: "Watermelon",
    price: 80,
    count: 12
  },
  {
    cat: "P",
    name: "Red Salted",
    price: 60,
    count: 12
  },
  {
    cat: "P",
    name: "Salty Vinegar",
    price: 60,
    count: 12
  },
  {
    cat: "P",
    name: "Cheese in Onion",
    price: 60,
    count: 12
  },
  {
    cat: "S",
    name: "Kola",
    price: 90,
    count: 12
  },
  {
    cat: "S",
    name: "Diet",
    price: 90,
    count: 12
  },
  {
    cat: "S",
    name: "Zero",
    price: 90,
    count: 12
  }
];

// Counting items in each category
var cats = {};
// Stock the shelves
$.each(stock, function(i, item) {
  // Count item in category, or add new category
  cats[item.cat] ? cats[item.cat]++ : (cats[item.cat] = 1);
  // Create a slot for the item
  var $shelf = $("<div>")
    .addClass("shelf")
    .attr("data-item", item.name.toLowerCase().replace(/\s+/g, "_"))
    .attr("data-cat", item.cat)
    .attr("data-num", cats[item.cat])
    .attr("data-price", item.price)
    .attr("data-stock", item.count)
    .appendTo($shelves);
  // Create an element for the item
  var $item = $("<div>")
    .addClass("item")
    .attr("data-item", item.name.toLowerCase().replace(/\s+/g, "_"))
    .attr("data-cat", item.cat)
    .attr("data-num", cats[item.cat])
    .attr("data-price", item.price)
    .attr("data-stock", item.count)
    .appendTo($shelf);
  // Add human-readable elements
  var $details = $("<div>")
    .addClass("detail")
    .appendTo($shelf);
  $("<h3>")
    .text(item.name)
    .appendTo($details);
  $("<span>")
    .addClass("code")
    .text("" + item.cat + cats[item.cat])
    .appendTo($details);
  $("<span>")
    .addClass("price")
    .text(item.price)
    .appendTo($details);
});

// Make selecting as annoying as a real machine
$selection.find("a").click(function() {
  // Collect useful info
  var $selected = $(this);
  var value = $selected.text();
  var current = $input_selection.val();
  var prev = $selection.find(".active");

  // Clear trays
  $machine.removeClass("vending");
  $tray.empty();
  $return.empty();

  // First press
  if (!prev.length) {
    $selected.addClass("active");
    $input_selection.val(value);
  }

  // Second press
  if (prev.length === 1) {
    // If letter already pressed and number is pressed
    if (isNaN(prev.first().text()) && !isNaN(value)) {
      $selected.addClass("active");
      $input_selection.val(current + value);
    }
    // If number already pressed and letter is pressed
    if (!isNaN(prev.first().text()) && isNaN(value)) {
      $selected.addClass("active");
      $input_selection.val(value + current);
    }
  }

  // Start new selection
  if (prev.length === 2) {
    $selection.find("a").removeClass("active");
    $input_selection.val("");
    $selected.addClass("active");
    $input_selection.val(value);
  }
});

// Insert coins
$coins.find("a").click(function() {
  // Get useful info
  var $coin = $(this);
  var slot_class = "slotting";
  var value = parseInt($coin.attr("data-coin"));

  // Clear trays
  $machine.removeClass("vending");
  $tray.empty();
  $return.empty();

  // Animate coin
  $coin.addClass(slot_class);
  // Allow new animation
  $coin.bind("webkitAnimationEnd mozAnimationEnd animationEnd", function() {
    $coin.removeClass(slot_class);
  });

  // Update coin display
  coinage = parseInt($input_coinage.val().replace(".", ""));
  new_coin = (coinage ? coinage : 0) + value;
  $input_coinage.val((new_coin / 100).toFixed(2));
});

// On Vend
$form.submit(function(e) {
  // Don’t submit normally
  e.preventDefault();
  // Get useful info
  var code = $input_selection.val().toUpperCase();
  var item = $(
    '.shelf[data-cat="' + code[0] + '"][data-num="' + code[1] + '"]'
  );
  var price = parseInt(item.attr("data-price")) / 100;
  var coins = parseFloat($input_coinage.val());

  // No item was found
  if (!item.length) {
    $input_selection.addClass("invalid");
    setTimeout(function() {
      $input_selection.removeClass("invalid").val("");
    }, 800);
    return;
  }

  // Check coins
  if (coins < price) {
    $input_coinage.addClass("invalid");
    setTimeout(function() {
      $input_coinage.removeClass("invalid");
    }, 800);
  } else {
    // Calculate change, keep track of returned change
    var change = coins - price;
    var change_returned = parseFloat(change.toFixed(1));

    // Reset UI
    $selection.find("a").removeClass("active");
    $input_selection.val("");
    $input_coinage.val("");

    // Put item in tray
    item
      .find(".item")
      .first()
      .clone()
      .appendTo($tray);

    // Return any fifties
    if (change_returned / 0.5 >= 1) {
      var fifties = parseInt(change_returned / 0.5);
      change_returned -= fifties * 0.5;
      for (var i = 0; i < fifties; i++) {
        $coins
          .find(".coin:eq(0)")
          .clone()
          .appendTo($return);
      }
      change_returned = parseFloat(change_returned.toFixed(1));
    }
    // Return any twenties
    if (change_returned / 0.2 >= 1) {
      var twenties = parseInt(change_returned / 0.2);
      change_returned -= twenties * 0.2;
      for (var i = 0; i < twenties; i++) {
        $coins
          .find(".coin:eq(1)")
          .clone()
          .appendTo($return);
      }
      change_returned = parseFloat(change_returned.toFixed(1));
    }
    // Return any tens
    if (change_returned / 0.1 >= 1) {
      var tens = parseInt(change_returned / 0.1);
      change_returned -= tens * 0.1;
      for (var i = 0; i < tens; i++) {
        $coins
          .find(".coin:eq(2)")
          .clone()
          .appendTo($return);
      }
    }
    // Position coins in a stack-like fashion
    var pieces = $return.find(".coin");
    if (pieces.length) {
      pieces.each(function(i) {
        var pos = i + 1;
        $(this).css(
          "left",
          -50 * (1 / pieces.length) * (pieces.length / 2 + 0.5 - pos) + "%"
        );
      });
    }

    // Tell the machine it has vended, for UI animations
    setTimeout(function() {
      $machine.addClass("vending");
    }, 10);
  }
});