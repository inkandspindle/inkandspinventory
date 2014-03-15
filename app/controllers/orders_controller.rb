class OrdersController < ApplicationController
  before_action :set_roll
  before_action :set_order, only: [:show, :edit, :update, :ajax_update, :destroy]

  def table
    @orders = @roll.orders.order(created_at: :asc)
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

    respond_to do |format|
      if @order.save
        format.html { redirect_to roll_order_path(@roll, @order), notice: 'Order was successfully created.' }
        format.json { render json: @order, status: :created, location: roll_order_path(@roll, @order) }
      else
        format.html { render action: 'new' }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /orders/1
  def update
    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to roll_order_path(@roll, @order), notice: 'Order was successfully updated.' }
        format.json { render json: @order, status: :accepted, location: roll_order_path(@roll, @order) }
      else
        format.html { render action: 'edit' }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
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
