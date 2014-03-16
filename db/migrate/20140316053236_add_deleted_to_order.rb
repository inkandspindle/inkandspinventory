class AddDeletedToOrder < ActiveRecord::Migration
  def change
    add_column :orders, :deleted, :boolean
  end
end
