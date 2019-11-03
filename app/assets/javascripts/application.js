// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require Chart.min
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require jquery3
//= require popper
//= require bootstrap-sprockets
//= require flatpickr
//= require flatpickr/l10n/ja
//= require_tree .

var chart_temperature;
var chart_weight;
var chart_existence = false;

var today = new Date();
var a_week_ago = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
var two_weeks_ago = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13);
var a_month_ago = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
var three_months_ago = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
var a_year_ago = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

// カレンダーのフォーム（flatpickr）
$(document).on('turbolinks:load', function () {
    flatpickr.localize(flatpickr.l10ns.ja);
    // 新規記録ページ用カレンダー
    if (document.getElementById('cycle-record-date-new')) {
        var dates = gon.unselectable_dates;
        var default_date = gon.default_date;
        flatpickr('#cycle-record-date-new', {
            disableMobile: true,
            defaultDate: default_date,
            disable: dates,
            minDate: a_year_ago,
            maxDate: 'today'
        });
    }

    // 編集ページ用カレンダー
    if (document.getElementById('cycle-record-date-edit')) {
        var dates = gon.cycle_records.map(function (record) {
            return record.date;
        });
        flatpickr('#cycle-record-date-edit', {
            disableMobile: true,
            enable: dates
        });
        var button = document.getElementById('cycle-record-button');
        var destroy_button = document.getElementById('cycle-record-button-destroy');
        button.disabled = 'disabled';
        destroy_button.disabled = 'disabled';
    }

    // グラフ用カレンダー
    if (document.getElementById('start-date')) {
        var start_date = gon.start_date;
        var end_date = gon.end_date;
        chart_existence = false;
        flatpickr('#start-date', {
            disableMobile: true,
            minDate: start_date,
            maxDate: end_date
        });
        flatpickr('#end-date', {
            disableMobile: true,
            minDate: start_date,
            maxDate: end_date
        });
        // グラフの初期表示
        onButtonClickWeek();
    }
});

// 開始日と終了日を引数とした，基礎体温と体重のグラフを描く関数
function drawGraphs(from, to) {
    var cycle_records = gon.cycle_records.filter(function (record) {
        date = new Date(record.date);
        return from <= date && date <= to;
    });
    var dates_data = cycle_records.map(function (record) {
        return record.date.replace(/^\d+-0*(\d+)-0*(\d+)$/, '$1/$2');
    });
    var body_temperatures_data = cycle_records.map(function (record) {
        return record.body_temperature;
    });
    var body_weights_data = cycle_records.map(function (record) {
        return record.body_weight;
    });

    var body_temperature_data_list = {
        labels: dates_data,
        datasets: [{
            label: '基礎体温(℃)',
            data: body_temperatures_data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            spanGaps: true
        },]
    };
    var body_weight_data_list = {
        labels: dates_data,
        datasets: [{
            label: '体重(kg)',
            data: body_weights_data,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            spanGaps: true
        }]
    };

    var body_temperature_label = function (tooltipItem) {
        return '基礎体温: ' + cycle_records[tooltipItem.index].body_temperature + '℃';
    };
    var body_weight_label = function (tooltipItem) {
        return '体重: ' + cycle_records[tooltipItem.index].body_weight + 'kg';
    };
    var symptom_footer = function (tooltipItems) {
        var symptom = '';
        tooltipItems.forEach(function (tooltipItem) {
            symptom += cycle_records[tooltipItem.index].symptom;
        });
        return '症状: ' + symptom;
    };

    var chart_temperature_callbacks = {
        label: body_temperature_label,
        afterLabel: body_weight_label,
        footer: symptom_footer,
    };
    var chart_weight_callbacks = {
        label: body_weight_label,
        afterLabel: body_temperature_label,
        footer: symptom_footer,
    };

    if (chart_existence) {
        chart_temperature.data = body_temperature_data_list;
        chart_temperature.options.tooltips.callbacks = chart_temperature_callbacks;
        chart_temperature.update();

        chart_weight.data = body_weight_data_list;
        chart_weight.options.tooltips.callbacks = chart_weight_callbacks;
        chart_weight.update();
    } else {
        var ctx_temperature = document.getElementById('chartBodyTemperature').getContext('2d');
        var ctx_weight = document.getElementById('chartBodyWeight').getContext('2d');


        chart_temperature = new Chart(ctx_temperature, {
            type: 'line',
            data: body_temperature_data_list,
            options: {
                tooltips: {
                    callbacks: chart_temperature_callbacks
                }
            }
        });

        chart_weight = new Chart(ctx_weight, {
            type: 'line',
            data: body_weight_data_list,
            options: {
                tooltips: {
                    callbacks: chart_weight_callbacks
                }
            }
        });
        chart_existence = true;
    }
}

// 日付フォームに入力する関数
function inputDate(date_id, date) {
    var year = date.getFullYear();
    var month = ("00" + (date.getMonth() + 1)).slice(-2);
    var day = ("00" + date.getDate()).slice(-2);

    document.getElementById(date_id).value = year + '-' + month + '-' + day;
}

// 期間指定のボタン機能
function onButtonClickPeriod() {
    var from = new Date(document.getElementById('start-date').value);
    var to = new Date(document.getElementById('end-date').value);
    var three_months_later = new Date(from.getFullYear(), from.getMonth() + 3, from.getDate());

    if (from.getTime() > to.getTime()) {
        alert('指定期間を正しく入力して下さい。');
    } else if (three_months_later.getTime() < to.getTime()) {
        alert('期間は３ヶ月以内として下さい。');
        drawGraphs(from, three_months_later);
    } else {
        drawGraphs(from, to);
    }
}

// 過去◯日間のボタン機能
function onButtonClickPast(from) {
    // 過去◯日前のデータが無い場合は，最も古いデータを開始日とする
    var start_date = new Date(gon.start_date);

    if (start_date.getTime() < from.getTime()) {
        start_date = from;
    }

    drawGraphs(start_date, today);

    inputDate('start-date', start_date);
    inputDate('end-date', today);
}

function onButtonClickWeek() {
    onButtonClickPast(a_week_ago);
}

function onButtonClickTwoWeek() {
    onButtonClickPast(two_weeks_ago);
}

function onButtonClickMonth() {
    onButtonClickPast(a_month_ago);
}

function onButtonClickThreeMonth() {
    onButtonClickPast(three_months_ago);
}

// 編集ページ（日付からデータを取得）

function GetCycleRecordData() {
    var calendar = document.getElementById('cycle-record-date-edit');
    var body_temperature = document.getElementById('cycle-record-body-temperature');
    var body_weight = document.getElementById('cycle-record-body-weight');
    var symptom = document.getElementById('cycle-record-symptom');
    var button = document.getElementById('cycle-record-button');
    var destroy_button = document.getElementById('cycle-record-button-destroy');
    if (calendar.value) {
        var get_record = gon.cycle_records.find(function (record) {
            return record.date === calendar.value;
        });
        if (get_record) {
            body_temperature.value = get_record.body_temperature;
            body_weight.value = get_record.body_weight;
            symptom.value = get_record.symptom;
            button.disabled = '';
            destroy_button.disabled = '';
        } else {
            alert('記録がありません。');
            body_temperature.value = '';
            body_weight.value = '';
            symptom.value = '';
            button.disabled = 'disabled';
            destroy_button.disabled = 'disabled';
        }
    }
}
