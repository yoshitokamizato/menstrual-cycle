class AddMenstruationDateToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :menstruation_date, :date
  end
end
