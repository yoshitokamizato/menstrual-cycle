class CreateCycleRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :cycle_records do |t|
      t.integer :user_id, null: false
      t.date :date, null: false, unique: true, index: true
      t.float :temperature, null: false
      t.float :weight, null: false
      t.string :symptom, null: false
      t.string :content
      t.timestamps
    end
  end
end
