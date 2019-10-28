require 'rails_helper'

RSpec.describe "Sessions", type: :system do

  before do
    ActionMailer::Base.deliveries.clear
  end

  def get_url_from_email_text(mail)
    body = mail.body.encoded
    body[/http[^"]+/]
  end

  scenario "user successfully signs in" do
    user = create(:user)
    visit root_path
    expect(page).to have_http_status '200'
    find('#nav-sign-in', text: 'ログイン').click
    fill_in "user_email", with: user.email
    fill_in "user_password", with: user.password
    click_button "ログイン"
    expect(page).to have_content "ログインしました。"
  end

  scenario "user successfully reissues password" do
    user = create(:user)
    visit root_path
    expect(page).to have_http_status '200'
    find('#nav-sign-in', text: 'ログイン').click
    find('#devise-link-new-password', text: 'パスワードを忘れましたか?').click
    fill_in "user_email", with: user.email
    expect { click_button "パスワードの再設定方法を送信する" }.to change { ActionMailer::Base.deliveries.size }.by(1)
    expect(page).to have_content "パスワードの再設定について数分以内にメールでご連絡いたします。"

    mail = ActionMailer::Base.deliveries.last
    link = get_url_from_email_text(mail)

    visit link
    fill_in "user_password", with: "123456"
    fill_in "user_password_confirmation", with: "123456"
    click_button "パスワードを変更する"
    expect(page).to have_content "パスワードが正しく変更されました。"
    expect(page).to have_selector '#nav-sign-out', text: 'ログアウト'
  end
end
