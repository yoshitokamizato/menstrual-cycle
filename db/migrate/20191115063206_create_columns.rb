class CreateColumns < ActiveRecord::Migration[5.2]
  def change
    create_table :columns do |t|
      t.string :title, null: false
      t.text :content, null: false

      t.timestamps
    end
    add_index :columns, :created_at
  end
end
