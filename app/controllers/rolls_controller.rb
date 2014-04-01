class RollsController < ApplicationController
  before_action :set_roll, only: [:show, :variable_numbers, :edit, :update, :destroy]

  # GET /rolls
  def index
    @rolls = Roll.all
    @rolls.sort!
  end

  # GET /rolls/1
  def show
  end

  def variable_numbers
    render partial: "variable_numbers", locals: { roll: @roll }
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

    respond_to do |format|
      if @roll.save
        format.html { redirect_to @roll, notice: 'Roll was successfully created.' }
        format.json { render json: @roll, status: :created, location: roll_path(@roll) }
      else
        format.html { render action: 'new' }
        format.json { render json: @roll.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /rolls/1
  def update
    respond_to do |format|
      if @roll.update(roll_params)
        format.html { redirect_to @roll, notice: 'Roll was successfully updated.' }
        format.json { render json: @roll, status: :accepted, location: roll_path(@roll) }
      else
        format.html { render action: 'edit' }
        format.json { render json: @roll.errors, status: :unprocessable_entity }
      end
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
