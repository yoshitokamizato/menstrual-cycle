class Column < ApplicationRecord
  validates :title, presence: true
  validates :content, presence: true
  scope :recent, -> { order(created_at: :desc) }
end
