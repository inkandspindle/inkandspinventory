class OrdersController < ApplicationController
  before_action :set_roll
  before_action :set_order, only: [:show, :edit, :update, :destroy]

  def table
    @orders = @roll.orders
    sleep 1
    render partial: "table"
  end

  # GET /orders
  def index
    @orders = Order.all
  end

  # GET /orders/1
  def show
  end

  # GET /orders/new
  def new
    @order = Order.new
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  def create
    @order = Order.new(order_params)

    if @order.save
      redirect_to @order, notice: 'Order was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /orders/1
  def update
    if @order.update(order_params)
      redirect_to @order, notice: 'Order was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /orders/1
  def destroy
    @order.destroy
    redirect_to orders_url, notice: 'Order was successfully destroyed.'
  end

  private
    def set_roll
      @roll = Roll.find(params[:roll_id])
    end
    def set_order
      @order = Order.find(params[:id])
    end

    def order_params
      params.require(:order).permit(:roll_id, :name, :length)
    end
end
