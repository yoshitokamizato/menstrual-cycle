class CycleRecordsController < ApplicationController

  def index
    gon.cycle_records = CycleRecord.chart_data(current_user)
    gon.recorded_dates = current_user.cycle_records.map(&:date)
  end

  def create
    @cycle_record = current_user.cycle_records.build(cycle_records_params)
    if @cycle_record.save
      date = @cycle_record.date.strftime('%Y/%-m/%-d')
      flash[:notice] = "#{date}の記録を追加しました"
    else
      flash[:alert] = 'エラーが発生しました'
    end
    redirect_to cycle_records_path
  end

  def update
    @cycle_record = current_user.cycle_records.find_by(date: params[:cycle_record][:date])
    date = @cycle_record.date.strftime('%Y/%-m/%-d')
    if @cycle_record.nil?
      flash[:alert] = 'エラーが発生しました'
    elsif params[:_destroy].nil? && @cycle_record.update(cycle_records_params)
      flash[:notice] = "#{date}の記録を修正しました"
    elsif params[:_destroy].present? && @cycle_record.destroy
      flash[:alert] = "#{date}の記録を削除しました"
    else
      flash[:alert] = 'エラーが発生しました'
    end
    redirect_to cycle_records_path
  end

  private

  def cycle_records_params
    params.require(:cycle_record).permit(:date, :temperature, :weight, :symptom, :content)
  end

end