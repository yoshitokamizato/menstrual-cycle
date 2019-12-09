class CycleRecordsController < ApplicationController

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
      output_error_messages(new_cycle_record_path)
    end
  end

  def edit
    gon.cycle_records = CycleRecord.get_data(current_user)
    @cycle_record = current_user.cycle_records.build
  end

  def update
    @cycle_record = CycleRecord.find_by(date: params[:cycle_record][:date])
    if @cycle_record.nil?
      error_message = "#{params[:cycle_record][:date].gsub(/-0*/, '/')}の記録がありません。"
      flash.now[:warning] = error_message
      respond_to do |format|
        format.html { redirect_to cycle_records_edit_path, warning: error_message }
        format.js
      end
    elsif params[:_destroy].nil?
      if @cycle_record.update(cycle_record_params)
        redirect_to cycle_records_path, success: '記録を修正しました。'
      else
        output_error_messages(cycle_records_edit_path)
      end
    else
      if @cycle_record.destroy
        redirect_to cycle_records_path, success: '記録を削除しました。'
      else
        output_error_messages(cycle_records_edit_path)
      end
    end
  end

  private

  def cycle_record_params
    params.require(:cycle_record).permit(:date, :body_temperature, :body_weight, :symptom)
  end

  def output_error_messages(path)
    flash.now[:warning] = error_message = @cycle_record.errors.full_messages.join(", ")
    respond_to do |format|
      format.html { redirect_to path, warning: error_message }
      format.js
    end
  end
end