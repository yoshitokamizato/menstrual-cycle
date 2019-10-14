class PeriodicRecordsController < ApplicationController
  before_action :authenticate_user!

  def index
    @periodic_records = PeriodicRecord.all.order(date: :desc)
  end

  def new
    @periodic_record = current_user.periodic_records.build
  end

  def create
    @periodic_record = current_user.periodic_records.build(periodic_record_params)
    if @periodic_record.save
      redirect_to periodic_records_path, success: '記録しました。'
    else
      flash.now[:warning] = @periodic_record.errors.full_messages.join(", ")
      render :new
    end
  end

  def edit
    @periodic_record = PeriodicRecord.find(params[:id])
  end

  def update
    @periodic_record = PeriodicRecord.find(params[:id])
    if @periodic_record.update(periodic_record_params)
      redirect_to periodic_records_path, success: '修正しました。'
    else
      flash.now[:warning] = @periodic_record.errors.full_messages.join(", ")
      render :edit
    end
  end

  def destroy
    @periodic_record = PeriodicRecord.find(params[:id])
    @periodic_record.destroy
    redirect_to periodic_records_path, success: '削除しました。'
  end

  private

  def periodic_record_params
    params.require(:periodic_record).permit(:date, :body_temperature, :body_weight, :symptom)
  end
end