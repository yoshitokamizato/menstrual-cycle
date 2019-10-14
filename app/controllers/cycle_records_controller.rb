class CycleRecordsController < ApplicationController
  before_action :authenticate_user!

  def index
    @cycle_records = current_user.cycle_records.order(date: :desc)
    chart_data_settings(last_week)
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

  def last_week
    from = Date.today - 6
    to = Date.today
    from..to
  end

  def chart_data_settings(period)
    weeks = ["月", "火", "水", "木", "金", "土", "日"]
    gon.dates = period.map { |date| date.strftime("%-m/%-d(#{weeks[date.strftime("%u").to_i - 1]})") }
    gon.body_temperatures = []
    gon.body_weights = []
    period.each do |date|
      record = CycleRecord.find_by(date: date)
      gon.body_temperatures << record&.body_temperature
      gon.body_weights << record&.body_weight
    end
  end
end