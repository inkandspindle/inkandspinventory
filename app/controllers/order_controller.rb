class OrderController < ApplicationController

  def table
    sleep 1
    render partial: "table"
  end

end
