class Movie < ApplicationRecord
  belongs_to :menstruation

  validates :url, presence: true,
end
