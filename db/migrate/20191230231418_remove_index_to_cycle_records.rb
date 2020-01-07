class RemoveIndexToCycleRecords < ActiveRecord::Migration[5.2]
  def change
    remove_index :cycle_records, column: :date
    add_index :cycle_records, [:user_id, :date], unique: true
  end
end
