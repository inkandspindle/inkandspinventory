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
