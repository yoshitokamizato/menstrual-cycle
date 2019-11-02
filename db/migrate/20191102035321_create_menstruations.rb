class CreateMenstruations < ActiveRecord::Migration[5.2]
  def change
    create_table :menstruations do |t|
      t.string :name

      t.timestamps
    end
  end
end
