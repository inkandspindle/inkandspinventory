$(document).ready(function() {
  $("table#rolls > tbody > tr.roll").click(function() {
    var resultTr = $(this).next();

    if (resultTr.css("display") == "none")
    {
      resultTr.show("fast", function() {
        $(this).addClass("loading");
        $(this).append('<td colspan="5"><div class="spinner"><img src="ajax-loader.gif"></img></div></td>');
        $.get("rolls/" + $(this).data("roll_id") + "/ordertable", function(data) {
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
              dataType: "xml",
              data: { "order": { "done": ($(this).prop("checked") ? 1 : 0) } }
            });
          });
        });
      });
    }
    else
    {
      resultTr.hide("fast", function() {
        resultTr.empty();
      });
    }
  });
});
