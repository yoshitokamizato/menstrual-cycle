var chart_temperature;
var chart_weight;
var chart_existence = false;
var today = new Date();

// カレンダーのフォーム（flatpickr）
$(document).on('turbolinks:load', function () {
    var start_date = gon.start_date;
    var end_date = gon.end_date;

    flatpickr.localize(flatpickr.l10ns.ja);
    flatpickr('#cycle_record_date', {defaultDate: 'today'});
    flatpickr('#start-date', {disableMobile: true, minDate: start_date, maxDate: end_date});
    flatpickr('#end-date', {disableMobile: true, minDate: start_date, maxDate: end_date});
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
        }]
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

    if (chart_existence) {
        chart_temperature.data = body_temperature_data_list;
        chart_temperature.update();

        chart_weight.data = body_weight_data_list;
        chart_weight.update();
    } else {
        var ctx_temperature = document.getElementById('chartBodyTemperature').getContext('2d');
        var ctx_weight = document.getElementById('chartBodyWeight').getContext('2d');

        chart_temperature = new Chart(ctx_temperature, {
            type: 'line',
            data: body_temperature_data_list,
            options: {}
        });

        chart_weight = new Chart(ctx_weight, {
            type: 'line',
            data: body_weight_data_list,
            options: {}
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

    if (from.getTime() <= to.getTime()) {
        drawGraphs(from, to);
    } else {
        alert('指定期間を正しく入力して下さい。');
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
    var from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    onButtonClickPast(from);
}

function onButtonClickTwoWeek() {
    var from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13);
    onButtonClickPast(from);
}

function onButtonClickMonth() {
    var from = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    onButtonClickPast(from);
}

function onButtonClickThreeMonth() {
    var from = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    onButtonClickPast(from);
}

// 初期表示
$(document).on('turbolinks:load', function () {
    if (document.getElementById('start-date') != null) {
        chart_existence = false;
        onButtonClickWeek();
    }
});