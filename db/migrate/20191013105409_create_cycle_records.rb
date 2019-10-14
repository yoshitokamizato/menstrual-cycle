class CreateCycleRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :cycle_records do |t|
      t.integer :user_id, null: false
      t.date :date, null: false, unique: true, index: true
      t.float :body_temperature, null: false
      t.float :body_weight, null: false
      t.text :symptom, null: false

      t.timestamps
    end
  end
end
