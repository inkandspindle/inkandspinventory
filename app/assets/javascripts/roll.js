updateRollNumbers = function(rollId)
{
  $.get(
    'rolls/' + rollId + '/variable_numbers.html',
    function(html) {
      rollTr = $('tr.roll[data-roll_id="' + rollId + '"]');
      rollTr.find(".variable").remove();
      rollTr.find(".name").after(html);
    }
  );
}

loadOrderTable = function(rollId)
{
  var resultTr = $('tr.order-table-container[data-roll_id="' + rollId + '"]');
  resultTr.empty();
  resultTr.append('<td colspan="5"><div class="spinner"><img src="ajax-loader.gif"></img></div></td>');
  resultTr.addClass("loading");

  $.get("rolls/" + rollId + "/ordertable", function(data) {
    var resultTr = $(".loading");

    resultTr.removeClass("loading");
    resultTr.empty();

    resultTr.append('<td colspan="5">' + data + '</td>');

    resultTr.find('td.printed input[type="checkbox"]').click(function() {
      var rollId = $(this).closest("tr.order-table-container").data("roll_id");
      var orderId = $(this).closest("tr.order").data("order_id");
      $.ajax({
        type: 'PUT',
        url: 'rolls/' + rollId + '/orders/' + orderId,
        dataType: "json",
        data: { "order": { "done": ($(this).prop("checked") ? 1 : 0) } }
      });
    });

    resultTr.find('tr.neworder a.submit').click(function() {
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
    });
  });
}

$(document).ready(function() {
  $("table#rolls > tbody > tr.roll").click(function() {
    var resultTr = $(this).next();

    if (resultTr.css("display") == "none")
    {
      resultTr.show("fast", function() {
        loadOrderTable($(this).data("roll_id"));
      });
    }
    else
    {
      resultTr.hide("fast", function() {
        $(this).empty();
      });
    }
  });
});
