class Movie < ApplicationRecord
  belongs_to :menstruation
  validates :menstruation_id, presence: true
  validates :url, presence: true

  def extract_youtube_id
    pattern = /\A.*\/(?:watch\?)?(?:v=)?(?:feature=[a-z_]+&)?(?:v=)?([a-zA-Z0-9=_-]+)(?:&feature=[a-z_]*)?(?:\?t=[0-9]+)?\z/
    matched = self.url.match(pattern)
    if matched.present?
      matched[1]
    else
      nil
    end
  end
end