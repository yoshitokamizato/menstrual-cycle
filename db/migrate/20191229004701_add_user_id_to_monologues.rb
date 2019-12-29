class AddUserIdToMonologues < ActiveRecord::Migration[5.2]
  def change
    add_column :monologues, :user_id, :integer, null: false
  end
end
