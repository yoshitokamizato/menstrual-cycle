class Menstruation < ApplicationRecord
  has_many :movies
  validates :name, presence: true, uniqueness: true

  def self.my_menstruation(date)
    menstrual_cycle = ((Date.today - date).to_i % 28) / 7
    # 生理周期を３つに分ける場合は，黄体期を１４日分とする
    menstrual_cycle = 2 if Menstruation.count == 3 && menstrual_cycle == 3
    Menstruation.all[menstrual_cycle]
  end
end