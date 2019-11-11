class CreateMonologues < ActiveRecord::Migration[5.2]
  def change
    create_table :monologues do |t|

      t.timestamps
    end
  end
end
