$(document).ready(function() {
  $("table#rolls > tbody > tr.roll").click(function() {
    var result_tr = $(this).next();

    if (result_tr.css("display") == "none")
    {
      result_tr.show("fast", function() {
        $(this).addClass("loading");
        $(this).append('<td colspan="4"><div class="spinner"><img src="ajax-loader.gif"></img></div></td>');
        $.get("ordertable", function(data) {
          var result_tr = $(".loading");
          result_tr.removeClass("loading");
          result_tr.empty();
          result_tr.append('<td colspan="4">' + data + '</td>');
        });
      });
    }
    else
    {
      result_tr.hide("fast", function() {
        result_tr.empty();
      });
    }
  });
});
