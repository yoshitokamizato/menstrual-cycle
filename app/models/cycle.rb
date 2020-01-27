class Cycle < ApplicationRecord

  validates :cycle, presence: true, format: { with: /生理期|卵胞期|黄体期/,
                                             message: "は変更できません" }
  validates :content, presence: true

  def self.menstruation
    %w(生理期 卵胞期 黄体期)
  end
end
