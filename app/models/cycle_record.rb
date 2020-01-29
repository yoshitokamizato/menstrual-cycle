class CycleRecord < ApplicationRecord
  belongs_to :user
  validates :date, presence: true, uniqueness: { scope: :user_id }
  validates :temperature, presence: true
  validates :weight, presence: true
  validates :symptom, presence: true, length: { maximum: 10 }
  validates :content, length: { maximum: 30 }

  # そのままデータを取り出すと，日付が不連続なデータになるため，日付の連続したデータを作成する。
  def self.chart_data(user)
    cycle_records = user.cycle_records.order(date: :asc)
    today = Date.today

    # 記録が無い場合にエラーが出るのを防止
    return [{ date: today, temperature: nil, weight: nil, symptom: nil, content: nil }] if cycle_records.empty?

    period = cycle_records[0].date..cycle_records[-1].date
    # 記録の初日から最終日までの配列データを作成
    index = 0
    period.map do |date|
      record = cycle_records[index]
      if record.date == date
        weight = record.weight
        temperature = record.temperature
        symptom = record.symptom
        content = record.content
        index += 1
      end
      # データが存在しない日付の体重は nil とする。
      { date: date, temperature: temperature, weight: weight, symptom: symptom, content: content }
    end
  end

  def self.symptoms
    %w[○調子が良い ○元気 ○だるさ ○眠気 ○イライラ ○憂うつ ○下腹部痛 ○腰痛 ○不安 ◉熱 ◉便秘]
  end
end
