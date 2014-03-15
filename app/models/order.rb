class Order < ActiveRecord::Base
  belongs_to :roll

  after_save :update_roll_used_count

  private

    def update_roll_used_count
      roll.update_attribute(:allocated, roll.orders.sum(:length))
      roll.update_attribute(:used, roll.orders.where(done: true).sum(:length))
    end

end
