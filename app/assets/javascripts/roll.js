toggleOrderTableDisplay = function()
{
  var resultTr = $(this).next('tr.order-table-container');

  if (resultTr.css("display") == "none")
  {
    resultTr.show("fast", function() { loadOrderTable($(this).data("roll_id")); });
  }
  else
  {
    resultTr.hide("fast", function() { $(this).empty(); });
  }
}

addNewOrder = function()
{
  var resultTr = $(this).closest("tr.order-table-container");
  var rollId = resultTr.data("roll_id");
  var newOrderTr = $(this).closest("tr.neworder");
  $.post(
    'rolls/' + rollId + '/orders',
    { "order": {
      "design": newOrderTr.find('input[name="design"]').val(),
      "colour1": newOrderTr.find('input[name="colour1"]').val(),
      "colour2": newOrderTr.find('input[name="colour2"]').val(),
      "length": newOrderTr.find('input[name="length"]').val()
    } },
    function(data) {
      updateRollNumbers(data["roll_id"]);
      loadOrderTable(data["roll_id"]);
    },
    "json"
  );
  return false;
}

addNewRoll = function()
{
  var newRollTr = $(this).closest("tr.newroll");
  $.post(
    'rolls',
    { "roll": { "name": newRollTr.find('input[name="name"]').val(), "length": newRollTr.find('input[name="length"]').val() } },
    function(data) {
      location.reload(false);
    },
    "json"
  );
  return false;
}

setDoneStatus = function()
{
  var rollId = $(this).closest("tr.order-table-container").data("roll_id");
  var orderId = $(this).closest("tr.order").data("order_id");
  $.ajax({
    type: 'PUT',
    url: 'rolls/' + rollId + '/orders/' + orderId,
    dataType: "json",
    data: { "order": { "done": ($(this).prop("checked") ? 1 : 0) } }
  })
    .done(function() { updateRollNumbers(rollId) });
}

updateRollNumbers = function(rollId)
{
  $.get(
    'rolls/' + rollId + '/variable_numbers.html',
    function(html) {
      rollTr = $('tr.roll[data-roll_id="' + rollId + '"]');
      rollTr.find(".variable").remove();
      rollTr.find(".editlinks").after(html);
    }
  );
}

var designFinder;
var colourFinder;

var addTypeahead = function(e, name, finder) {
  e.typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: name,
    displayKey: 'value',
    source: finder.ttAdapter()
  });
}

loadOrderTable = function(rollId)
{
  var resultTr = $('tr.order-table-container[data-roll_id="' + rollId + '"]');
  resultTr.empty();
  resultTr.append('<td colspan="6"><div class="spinner"><img src="ajax-loader.gif"></img></div></td>');

  $.get("rolls/" + rollId + "/ordertable", function(data) {
    resultTr.empty();
    resultTr.append('<td colspan="6">' + data + '</td>');

    resultTr.find('a.deleteorder').click(deleteOrder);
    resultTr.find('td.printed input[type="checkbox"]').click(setDoneStatus);
    resultTr.find('a.editorder').click(editOrder);
    resultTr.find('tr.neworder a.submit').click(addNewOrder);

    addTypeahead(resultTr.find('tr.neworder input[name="design"]'), 'designs', designFinder);
    addTypeahead(resultTr.find('tr.neworder input[name="colour1"]'), 'colours', colourFinder);
    addTypeahead(resultTr.find('tr.neworder input[name="colour2"]'), 'colours', colourFinder);
  });
}

deleteOrder = function()
{
  var rollId = $(this).closest('tr.order-table-container').data('roll_id');
  var orderId = $(this).closest('tr.order').data('order_id');
  if (confirm('Are you sure you want to delete this order?'))
  {
    $.post("rolls/" + rollId + "/deleteorder/" + orderId, {}, function(data) {
      updateRollNumbers(rollId);
      loadOrderTable(rollId);
    });
  }
  return false;
}

editOrder = function()
{
  var orderTr = $(this).closest('tr.order');
  var rollId = orderTr.closest('tr.order-table-container').data('roll_id');

  var nameTd = orderTr.find('.ordername');
  var lengthTd = orderTr.find('.orderlength');

  var origDesign = nameTd.find("span.design").html();
  var origColour1 = nameTd.find("span.colour1").html();
  if (!origColour1) origColour1 = '';
  var origColour2 = nameTd.find("span.colour2").html();
  if (!origColour2) origColour2 = '';
  var origLength = lengthTd.html();

  var designInput = $('<input type="text" name="design" value="' + origDesign + '"></input>');
  var colour1Input = $('<input type="text" name="colour1" value="' + origColour1 + '"></input>');
  var colour2Input = $('<input type="text" name="colour2" value="' + origColour2 + '"></input>');
  var lengthInput = $('<input type="number" min="0" step="0.1" name="length" value="' + origLength + '"></input>');

  nameTd.html([designInput, " in ", colour1Input, " &amp; ", colour2Input]);
  lengthTd.html(lengthInput);

  designInput.click(function() { return false; });
  colour1Input.click(function() { return false; });
  colour2Input.click(function() { return false; });
  lengthInput.click(function() { return false; });

  addTypeahead(designInput, 'designs', designFinder);
  addTypeahead(colour1Input, 'colours', colourFinder);
  addTypeahead(colour2Input, 'colours', colourFinder);

  designInput.focus();

  var editLink = $(this);
  editLink.html("done");
  editLink.off("click").click(function() {
    $.ajax({
      type: 'PUT',
      url: 'rolls/' + rollId + '/orders/' + orderTr.data("order_id"),
      dataType: "json",
      data: { "order": {
        "design": designInput.val(),
        "colour1": colour1Input.val(),
        "colour2": colour2Input.val(),
        "length": lengthInput.val()
      } }
    })
      .done(function(data) {
        nameHtml = [ $('<span class="design">' + data["design"] + '</span>') ];
        if (data["colour1"])
        {
          nameHtml.push(" in ");
          nameHtml.push($('<span class="colour1">' + data["colour1"] + '</span>'));
          if (data["colour2"])
          {
            nameHtml.push(" &amp; ");
            nameHtml.push($('<span class="colour2">' + data["colour2"] + '</span>'));
          }
        }
        nameTd.html(nameHtml);
        lengthTd.html(data["length"].toFixed(1));
        editLink.html("edit");
        editLink.off("click").click(editOrder);
        updateRollNumbers(rollId);
      });
    return false;
  });

  $(document).on('keyup.cancelorderedit', function(e) {
    if (e.keyCode == 27)
    {
      nameTd.html(origName);
      lengthTd.html(origLength);
      editLink.html("edit");
      editLink.off("click").click(editOrder);
      $(document).off('keyup.cancelorderedit');
    }
  });

  return false;
}

editRoll = function()
{
  var rollTr = $(this).closest('tr.roll');

  var nameTd = rollTr.find('.name');
  var lengthTd = rollTr.find('.length');

  var origName = nameTd.html();
  var origLength = lengthTd.html();

  var nameInput = $('<input type="text" name="name" value="' + origName + '"></input>');
  var lengthInput = $('<input type="number" min="0" step="0.1" name="length" value="' + origLength + '"></input>');

  nameTd.html(nameInput);
  lengthTd.html(lengthInput);

  nameInput.click(function() { return false; });
  lengthInput.click(function() { return false; });

  nameInput.focus();

  var editLink = $(this);
  editLink.html("done");
  editLink.off("click").click(function() {
    $.ajax({
      type: 'PUT',
      url: 'rolls/' + rollTr.data("roll_id"),
      dataType: "json",
      data: { "roll": { "name": nameInput.val(), "length": lengthInput.val() } }
    })
      .done(function(data) {
        nameTd.html(data["name"]);
        lengthTd.html(data["length"].toFixed(1));
        editLink.html("edit");
        editLink.off("click").click(editRoll);
        updateRollNumbers(rollTr.data("roll_id"));
      });
    return false;
  });

  $(document).on('keyup.cancelrolledit', function(e) {
    if (e.keyCode == 27)
    {
      nameTd.html(origName);
      lengthTd.html(origLength);
      editLink.html("edit");
      editLink.off("click").click(editRoll);
      $(document).off('keyup.cancelrolledit');
    }
  });

  return false;
}

$(document).ready(function() {
  $.get("/orders/colours", function(data) {
    var colours = data;
    colourFinder = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: $.map(colours, function(colour) { return { value: colour } })
    });
    colourFinder.initialize();
  });
  $.get("/orders/designs", function(data) {
    var designs = data;
    designFinder = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: $.map(designs, function(design) { return { value: design } })
    });
    designFinder.initialize();
  });
  $("table#rolls > tbody > tr.roll").click(toggleOrderTableDisplay);
  $("table#rolls > tbody > tr.roll a.editroll").click(editRoll);
  $("table#rolls > tbody > tr.newroll a.createroll").click(addNewRoll);
});
