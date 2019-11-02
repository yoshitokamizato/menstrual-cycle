ApplicationRecord.transaction do
  AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
  puts '管理者画面の初期データインポートに成功しました。'

  User.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password', name: '管理者', flag: true)
  puts 'ユーザーの初期データインポートに成功しました。'

  user = User.find_by(email: 'admin@example.com')

  cycle_records = []
# 低温期，高温期の判定用変数
  cycle_record_number = 0

  ((Date.today - 5.months)..(Date.today + 1.months)).each do |date|
    cycle_record_number += 1
    cycle_record_number = 1 if cycle_record_number > 28
    # 1/5の確率で入力忘れを出す
    if rand(5) > 0
      if cycle_record_number < 15
        # 低温期の基礎体温を設定
        body_temperature = rand(3645..3655).to_f / 100
      else
        # 高温期の基礎体温を設定
        body_temperature = rand(3675..3690).to_f / 100
      end
      body_weight = rand(460..480).to_f / 10
      symptom = (body_temperature < 36.65) ? '低温期です' : '高温期です'
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
  puts '生理周期記録の初期データインポートに成功しました。'

  menstruation = [
      {name: '生理期'},
      {name: '卵胞期'},
      {name: '黄体期'}
  ]
  Menstruation.create!(menstruation)
  puts '生理周期名の初期データインポートに成功しました。'

  menstruation_1 = Menstruation.first
  menstruation_2 = Menstruation.second
  menstruation_3 = Menstruation.last
  movies = [
      {menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=WuHr7lXA5ck'},
      {menstruation_id: menstruation_1.id, url: 'https://youtu.be/eSi0nshRyz8'},
      {menstruation_id: menstruation_2.id, url: 'https://youtu.be/pIjZ51xajkA?t=83'},
      {menstruation_id: menstruation_3.id, url: 'https://www.youtube.com/watch?v=-LTt2sLgpAk'},
      {menstruation_id: menstruation_2.id, url: 'https://www.youtube.com/watch?v=Yawrrgcvg5Y'},
      {menstruation_id: menstruation_3.id, url: 'https://www.youtube.com/watch?v=8fDQXlO7a2U'}
  ]
  Movie.create!(movies)
  puts '動画URLの初期データインポートに成功しました。'
end
puts '-------------------------------------'
puts '全ての初期データインポートに成功しました！'