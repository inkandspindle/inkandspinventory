class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.integer :roll_id
      t.string :name
      t.float :length
      t.boolean :done

      t.timestamps
    end
  end
end
