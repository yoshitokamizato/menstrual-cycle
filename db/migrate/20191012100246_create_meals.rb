class CreateMeals < ActiveRecord::Migration[5.2]
  def change
    create_table :meals do |t|
      t.string :menstrual_cycle
      t.string :image
      t.text :comment
      t.timestamps
    end
  end
end
