class Order < ActiveRecord::Base
  belongs_to :roll

  after_initialize :default_values
  after_save :update_roll_used_count

  private

    def default_values
      self.done ||= false
      self.deleted ||= false
      true
    end

    def update_roll_used_count
      roll.update_attribute(:allocated, roll.orders.where(deleted: false).sum(:length))
      roll.update_attribute(:used, roll.orders.where(deleted: false).where(done: true).sum(:length))
    end

end
