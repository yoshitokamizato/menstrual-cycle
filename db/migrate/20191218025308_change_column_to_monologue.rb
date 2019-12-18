class ChangeColumnToMonologue < ActiveRecord::Migration[5.2]
  def change
    change_column_null :monologues, :content, false
  end
end
