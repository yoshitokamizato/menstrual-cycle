class RenameMessagesToMonologues < ActiveRecord::Migration[5.2]
  def change
    rename_table :messages, :monologues
  end
end
