class AddContentToMonologues < ActiveRecord::Migration[5.2]
  def change
    add_column :monologues, :content, :text
  end
end
