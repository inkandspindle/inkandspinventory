class CreateRolls < ActiveRecord::Migration
  def change
    create_table :rolls do |t|
      t.string :name
      t.float :length

      t.timestamps
    end
  end
end
