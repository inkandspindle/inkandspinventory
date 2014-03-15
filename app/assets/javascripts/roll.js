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
    { "order": { "name": newOrderTr.find('input[name="name"]').val(), "length": newOrderTr.find('input[name="length"]').val() } },
    function(data) {
      updateRollNumbers(data["roll_id"]);
      loadOrderTable(data["roll_id"]);
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

loadOrderTable = function(rollId)
{
  var resultTr = $('tr.order-table-container[data-roll_id="' + rollId + '"]');
  resultTr.empty();
  resultTr.append('<td colspan="5"><div class="spinner"><img src="ajax-loader.gif"></img></div></td>');

  $.get("rolls/" + rollId + "/ordertable", function(data) {
    resultTr.empty();
    resultTr.append('<td colspan="5">' + data + '</td>');

    resultTr.find('td.printed input[type="checkbox"]').click(setDoneStatus);
    resultTr.find('tr.neworder a.submit').click(addNewOrder);
  });
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

  $(document).on('keyup.canceledit', function(e) {
    if (e.keyCode == 27)
    {
      nameTd.html(origName);
      lengthTd.html(origLength);
      editLink.html("edit");
      editLink.off("click").click(editRoll);
      $(document).off('keyup.canceledit');
    }
  });

  return false;
}

$(document).ready(function() {
  $("table#rolls > tbody > tr.roll").click(toggleOrderTableDisplay);
  $("table#rolls > tbody > tr.roll a.editroll").click(editRoll);
});
