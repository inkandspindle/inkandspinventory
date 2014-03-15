class Roll < ActiveRecord::Base
  has_many :orders

  before_save :default_values

  private

    def default_values
      self.allocated ||= 0
      self.used ||= 0
    end

end
