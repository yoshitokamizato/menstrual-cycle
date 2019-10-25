class CycleRecordsController < ApplicationController
  before_action :authenticate_user!

  def index
    gon.cycle_records = CycleRecord.chart_data(current_user)
    gon.start_date = gon.cycle_records.first[:date].strftime('%Y-%m-%d')
    gon.end_date = gon.cycle_records.last[:date].strftime('%Y-%m-%d')
  end

  def new
    gon.unselectable_dates = current_user.cycle_records.map(&:date)
    gon.default_date = gon.unselectable_dates.include?(Date.today) ? nil : Date.today
    @cycle_record = current_user.cycle_records.build
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
    gon.cycle_records = CycleRecord.get_data(current_user)
    @cycle_record = current_user.cycle_records.build
  end

  def update
    @cycle_record = CycleRecord.find_by(date: params[:cycle_record][:date])
    if params[:_destroy].nil?
      if @cycle_record.update(cycle_record_params)
        redirect_to cycle_records_path, success: '記録を修正しました。'
      else
        flash.now[:warning] = @cycle_record.errors.full_messages.join(", ")
        render :edit
      end
    else
      if @cycle_record.destroy
        redirect_to cycle_records_path, success: '記録を削除しました。'
      else
        flash.now[:warning] = @cycle_record.errors.full_messages.join(", ")
        render :edit
      end
    end
  end

  private

  def cycle_record_params
    params.require(:cycle_record).permit(:date, :body_temperature, :body_weight, :symptom)
  end
end