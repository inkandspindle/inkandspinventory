class OrdersController < ApplicationController
  before_action :set_roll
  before_action :set_order, only: [:show, :edit, :update, :ajax_update, :destroy]

  def table
    @orders = @roll.orders.order(created_at: :asc)
    sleep 1
    render partial: "table"
  end

  # GET /orders
  def index
    @orders = @roll.orders
  end

  # GET /orders/1
  def show
  end

  # GET /orders/new
  def new
    @order = @roll.orders.new
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  def create
    @order = @roll.orders.new(order_params)

    if @order.save
      redirect_to roll_order_path(@roll, @order), notice: 'Order was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /orders/1
  def update
    success = @order.update(order_params)

    respond_to do |format|
      format.html {
        if success
          redirect_to roll_order_path(@roll, @order), notice: 'Order was successfully updated.'
        else
          render action: 'edit'
        end
      }
      format.xml { render xml: (success ? "Success" : "Failure") }
    end
  end

  # DELETE /orders/1
  def destroy
    @order.destroy
    redirect_to roll_orders_url(@roll), notice: 'Order was successfully destroyed.'
  end

  private
    def set_roll
      @roll = Roll.find(params[:roll_id])
    end
    def set_order
      @order = Order.find(params[:id])
    end

    def order_params
      params.require(:order).permit(:name, :length, :done)
    end
end
