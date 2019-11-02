class Menstruation < ApplicationRecord
  has_many :movies
  validates :name, presence: true, uniqueness: true

  def self.my_menstruation(date)
    menstrual_cycle = ((Date.today - date).to_i % 28) / 7
    menstrual_cycle = 2 if menstrual_cycle == 3
    Menstruation.all[menstrual_cycle]
  end
end
