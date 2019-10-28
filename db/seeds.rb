AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
User.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password', name: '管理者', flag: true)

user = User.find_by(email: 'admin@example.com')

cycle_records = []
data_number = 0
((Date.today - 5.months)..(Date.today + 1.months)).each do |date|
  data_number += 1
  # 1/5の確率で入力忘れを出す
  if rand(5) > 0
    body_temperature = rand(3630..3700).to_f / 100
    body_weight = rand(450..500).to_f / 10
    symptom = (body_temperature < 36.65) ? '平熱です。' : '微熱です。'
    cycle_records << {
        user_id: user.id,
        date: date,
        body_temperature: body_temperature,
        body_weight: body_weight,
        symptom: symptom
    }
  end
end

CycleRecord.create!(cycle_records)
puts 'インポートに成功しました！'