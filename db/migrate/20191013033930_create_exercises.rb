class CreateExercises < ActiveRecord::Migration[5.2]
  def change
    create_table :exercises do |t|
      t.string :menstrual_cycle
      t.string :image
      t.text :comment
      t.string :user_id
      t.timestamps
    end
  end
end
