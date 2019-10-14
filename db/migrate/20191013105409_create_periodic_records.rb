class CreatePeriodicRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :periodic_records do |t|
      t.integer :user_id, null: false
      t.date :date, null: false
      t.float :body_temperature
      t.float :body_weight
      t.string :symptom

      t.timestamps
    end
  end
end
