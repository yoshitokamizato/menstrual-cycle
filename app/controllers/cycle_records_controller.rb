class CycleRecordsController < ApplicationController
  before_action :authenticate_user!

  def index
    @cycle_records = current_user.cycle_records.order(date: :desc)
    chart_data_settings(all_period)
  end

  def new
    @cycle_record = current_user.cycle_records.build(date: Date.today)
  end

  def create
    @cycle_record = current_user.cycle_records.build(cycle_record_params)
    if @cycle_record.save
      redirect_to cycle_records_path, success: '記録しました。'
    else
      flash.now[:warning] = @cycle_record.errors.full_messages.join(", ")
      render :new
    end
  end

  def edit
    @cycle_record = CycleRecord.find(params[:id])
  end

  def update
    @cycle_record = CycleRecord.find(params[:id])
    if @cycle_record.update(cycle_record_params)
      redirect_to cycle_records_path, success: '修正しました。'
    else
      flash.now[:warning] = @cycle_record.errors.full_messages.join(", ")
      render :edit
    end
  end

  def destroy
    @cycle_record = CycleRecord.find(params[:id])
    @cycle_record.destroy
    redirect_to cycle_records_path, success: '削除しました。'
  end

  private

  def cycle_record_params
    params.require(:cycle_record).permit(:date, :body_temperature, :body_weight, :symptom)
  end

  def all_period
    @cycle_records.last.date..@cycle_records.first.date
  end

  def chart_data_settings(period)
    weeks = ["月", "火", "水", "木", "金", "土", "日"]
    gon.dates = period.map { |date| date.strftime("%-m/%-d(#{weeks[date.strftime("%u").to_i - 1]})") }
    # データを単純に取り出すと，日付が不連続なデータになるため，日付が連続するデータを作成する。
    gon.cycle_records = []
    period.each do |date|
      cycle_record = @cycle_records.find do |record|
        record.date == date
      end
      if cycle_record.present?
        gon.cycle_records << cycle_record.slice(:date, :body_temperature, :body_weight)
      else
        gon.cycle_records << {date: date, body_temperature: nil, body_weight: nil}
      end
    end
  end
end