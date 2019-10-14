class CycleRecord < ApplicationRecord
  belongs_to :user
  validates :date, presence: true, uniqueness: true
  validates :body_temperature, presence: true
  validates :body_weight, presence: true
  validates :symptom, presence: true, length: { maximum: 1000 }

end
