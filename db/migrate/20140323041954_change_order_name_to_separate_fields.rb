class ChangeOrderNameToSeparateFields < ActiveRecord::Migration
  def up
    add_column :orders, :design, :string
    add_column :orders, :colour1, :string
    add_column :orders, :colour2, :string
    Order.all.each do |o|
      outer_matches = /(.*) in (.*)/.match(o.name)
      if outer_matches
        o.design = outer_matches[1]
        inner_matches = /(.*) (&|and) (.*)/.match(outer_matches[2])
        if inner_matches
          o.colour1 = inner_matches[1]
          o.colour2 = inner_matches[3]
        else
          o.colour1 = outer_matches[2]
        end
      else
        o.design = o.name
      end
      o.save
    end
    remove_column :orders, :name, :string
  end
  def down
    add_column :orders, :name, :string
    Order.all.each do |o|
      o.update_attribute(:name, o.design + ' in ' + o.colour1 + ' & ' + o.colour2)
    end
    remove_column :orders, :colour2, :string
    remove_column :orders, :colour1, :string
    remove_column :orders, :design, :string
  end
end
