class User < ApplicationRecord
  validates :name, uniqueness: true, length: { minimum: 2, maximum: 40 }
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # :registerable 新規登録を不可能にする
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :cycle_records, dependent: :destroy
  has_many :meals, dependent: :destroy
  has_many :exercises, dependent: :destroy
  has_many :monologues, dependent: :destroy

  # 利用者フラグ(flag)が false ならばログインできないように変更
  def active_for_authentication?
    super && self.flag?
  end

  # 利用者フラグ(flag)が false ならば ログインしようとしたときのメッセージを変更
  def inactive_message
    self.flag ? super : :message_that_flag_is_false
  end

  def menstruation
    return Cycle.menstruation[0] if self.menstruation_date.blank?
    self.menstruation_base
  end

  def menstruation_top
    return '未登録' if self.menstruation_date.blank?
    self.menstruation_base
  end

  def menstruation_base
    menstrual_cycle = ((Date.today - self.menstruation_date).to_i % 28) / 7
    menstrual_cycle = 2 if menstrual_cycle == 3
    Cycle.menstruation[menstrual_cycle]
  end

end
