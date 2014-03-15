class Order < ActiveRecord::Base
  belongs_to :roll

  after_save :update_roll_used_count

  private

    def update_roll_used_count
      roll.update_attribute(:used, roll.orders.sum(&:length))
    end

end
