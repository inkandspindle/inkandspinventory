class AddUsedToRoll < ActiveRecord::Migration
  def change
    add_column :rolls, :used, :float
  end
end
