class CycleRecordsController < ApplicationController
  before_action :authenticate_user!

  def index
    gon.cycle_records = CycleRecord.chart_data(current_user)
    period = gon.cycle_records.map { |record| record[:date] }

    gon.start_date = period.first.strftime('%Y-%m-%d')
    gon.end_date = period.last.strftime('%Y-%m-%d')
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
end