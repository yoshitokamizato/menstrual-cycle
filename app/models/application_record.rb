class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  scope :recent, -> { order(created_at: :desc) }

  def picture_size
    if image.size > 5.megabytes
      errors.add(:picture, "should be less than 5MB")
    end
  end
end
