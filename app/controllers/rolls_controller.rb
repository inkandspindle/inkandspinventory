class RollsController < ApplicationController
  before_action :set_roll, only: [:show, :edit, :update, :destroy]

  # GET /rolls
  def index
    @rolls = Roll.all
  end

  # GET /rolls/1
  def show
  end

  # GET /rolls/new
  def new
    @roll = Roll.new
  end

  # GET /rolls/1/edit
  def edit
  end

  # POST /rolls
  def create
    @roll = Roll.new(roll_params)

    if @roll.save
      redirect_to @roll, notice: 'Roll was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /rolls/1
  def update
    if @roll.update(roll_params)
      redirect_to @roll, notice: 'Roll was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /rolls/1
  def destroy
    @roll.destroy
    redirect_to rolls_url, notice: 'Roll was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_roll
      @roll = Roll.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def roll_params
      params.require(:roll).permit(:name, :length)
    end
end
