class Movie < ApplicationRecord
  belongs_to :menstruation
  validates :menstruation_id, presence: true
  validates :url, presence: true
end