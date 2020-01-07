class RemoveIndexToCycleRecords < ActiveRecord::Migration[5.2]
  def change
    remove_index :cycle_records, column: :date
  end
end
