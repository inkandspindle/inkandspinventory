$(document).ready(function() {
  $("table#rolls > tbody > tr").click(function() {
    var result_tr = $(this).next();

    if (result_tr.css("display") == "none")
    {
      result_tr.show("fast", function() {
        $(this).append('<td colspan="4"><div class="spinner"><img src="ajax-loader.gif"></img></div></td>');
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
