# 管理者ユーザー情報
EMAIL = 'admin@example.com'
PASSWORD = 'password'

columns_number = 25

ApplicationRecord.transaction do
  CycleRecord.destroy_all
  Menstruation.destroy_all
  Movie.destroy_all
  Column.destroy_all
  puts "現在のデータを全て削除しました。"
  puts '-------------------------------------'

  if Rails.env.production?
    AdminUser.find_or_create_by!(email: ENV['ADMIN_EMAIL']) do |user|
      user.password = ENV['ADMIN_PASSWORD']
      puts '管理者画面の初期データインポートに成功しました。'
    end
  else
    AdminUser.find_or_create_by!(email: EMAIL) do |user|
      user.password = PASSWORD
      puts '管理者画面の初期データインポートに成功しました。'
    end
  end

  user = User.find_or_create_by!(email: EMAIL) do |user|
    user.password = PASSWORD
    user.name = '管理者'
    user.flag = true
    puts 'ユーザーの初期データインポートに成功しました。'
  end

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
        temperature = rand(3645..3655).to_f / 100
      else
        # 高温期の基礎体温を設定
        temperature = rand(3675..3690).to_f / 100
      end
      weight = rand(460..480).to_f / 10
      symptom = CycleRecord.symptoms.sample
      content = (temperature < 36.65) ? '低温期です' : '高温期です'
      cycle_records << {
        user_id: user.id,
        date: date,
        temperature: temperature,
        weight: weight,
        symptom: symptom,
        content: content
      }
    end
  end


  CycleRecord.create!(cycle_records)
  puts '生理周期記録の初期データインポートに成功しました。'

  menstruation = [
    { name: '生理期' },
    { name: '卵胞期' },
    { name: '黄体期' }
  ]
  Menstruation.create!(menstruation)
  puts '生理周期名の初期データインポートに成功しました。'

  menstruation_1 = Menstruation.first
  menstruation_2 = Menstruation.second
  menstruation_3 = Menstruation.last
  movies = [
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=WuHr7lXA5ck' },
    { menstruation_id: menstruation_1.id, url: 'https://youtu.be/eSi0nshRyz8' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=-LTt2sLgpAk' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=_HnkdknrWu8' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=_HOlAtBUbQ0' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=Ss2dFeHgmm8' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=EfSm96IomiU' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=_vvC2Ki75TI' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=gD3emeZ7DMw' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=hSQoPXsbZDY' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=wxART4__ruY' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=l0KIsvmpoO8' },
    { menstruation_id: menstruation_1.id, url: 'https://www.youtube.com/watch?v=ciDWKE_CO54' },
    { menstruation_id: menstruation_2.id, url: 'https://youtu.be/pIjZ51xajkA?t=83' },
    { menstruation_id: menstruation_3.id, url: 'https://www.youtube.com/watch?v=-LTt2sLgpAk' },
    { menstruation_id: menstruation_2.id, url: 'https://www.youtube.com/watch?v=Yawrrgcvg5Y' },
    { menstruation_id: menstruation_3.id, url: 'https://www.youtube.com/watch?v=8fDQXlO7a2U' },
  ]
  Movie.create!(movies)
  puts '動画URLの初期データインポートに成功しました。'

  columns = []
  (columns_number - 1).times do |n|
    content = <<~TEXT
      こちらはテスト投稿その#{n + 1}です。
    TEXT
    columns << {
      title: "テスト投稿 その#{n + 1}",
      content: content,
    }
  end
  last_content = <<~TEXT
  
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
##### 見出し5
###### 見出し6

1. リスト1

1. リスト1
1. リスト2
2. リスト3

1. リスト2
10. リスト3

**強調**
*イタリック*

***

`1行のコード`

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <title>HTMLの書き方</title>
  </head>
  <body>
    <h1>HTMLの書き方</h1>
    <p>はじめてのHTMLを作りました</p>
  </body>
</html>
```

[Google](https://www.google.com/)
  TEXT
  columns << {
    title: "テスト投稿 その#{columns_number}",
    content: last_content
  }

  Column.create!(columns)
  Column.all.each_with_index do |column, n|
    column.created_at -= (columns_number - n).day
    column.save!
  end

  puts 'コラムの初期データインポートに成功しました。'
end
puts '-------------------------------------'
puts '全ての初期データインポートに成功しました！'