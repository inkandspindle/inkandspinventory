class Roll < ActiveRecord::Base
  include Comparable

  has_many :orders

  before_save :default_values

  def onshelf
    length ? length - used : 0.0
  end
  def available
    length ? length - allocated : 0.0
  end

  def <=>(other)
    comparison_number <=> other.comparison_number
  end

  def comparison_number
    if length && length > 0 && onshelf > 0
      # Those with defined lengths still on the shelf appear first (at offset 0 * BIG_TIME) sorted by created_at desc.
      0 * BIG_TIME + (BIG_TIME - created_at.to_i)
    elsif !length || length == 0
      # Those with no length appear second (at offset 1 * BIG_TIME) sorted by created_at.
      1 * BIG_TIME + created_at.to_i
    else
      # Those not on the shelf with a defined length appear last (at offset 2 * BIG_TIME) sorted by created_at desc.
      2 * BIG_TIME + (BIG_TIME - created_at.to_i)
    end
  end

  private

    BIG_TIME = Time.new(2030).to_i

    def default_values
      self.allocated ||= 0
      self.used ||= 0
    end

end
