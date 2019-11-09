class CreateMovies < ActiveRecord::Migration[5.2]
  def change
    create_table :movies do |t|
      t.integer :menstruation_id
      t.text :url

      t.timestamps
    end
  end
end
