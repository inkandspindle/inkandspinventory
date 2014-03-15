class AddAllocatedToRoll < ActiveRecord::Migration
  def change
    add_column :rolls, :allocated, :float
  end
end
