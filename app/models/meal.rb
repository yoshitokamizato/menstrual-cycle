class Meal < ApplicationRecord
  mount_uploader :image, ImageUploader
  belongs_to :user
  validates :menstrual_cycle, presence: true
  validates :comment, presence: true
  validates :user_id, presence: true
  validate  :picture_size
end
