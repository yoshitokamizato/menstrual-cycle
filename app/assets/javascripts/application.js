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
//= require rails-ujs
//= require activestorage
//= require Chart.min
//= require flatpickr
//= require flatpickr/l10n/ja
//= require jquery3
//= require popper
//= require bootstrap-sprockets
//= require jquery.ezdz
//= require turbolinks
// 削除の確認ダイアログが2回出るためコメントアウト
// require_tree .

// 動画の生理周期登録用
var operation = {list: false, date: false};

// カレンダーのフォーム（flatpickr）
document.addEventListener("turbolinks:load", function () {
    flatpickr.localize(flatpickr.l10ns.ja);

    if (document.getElementById('start-calendar')) {
        // データの初日・最終日
        // ' 00:00:00'が無いと，時差の影響を受けるので注意！
        const START_DATE = new Date(gon.cycle_records[0].date + ' 00:00:00')
        const END_DATE = new Date(gon.cycle_records[gon.cycle_records.length - 1].date + ' 00:00:00')

        // 開始日・終了日カレンダーで日付を選択したとき期間内のグラフを描く関数
        const drawGraphForPeriod = () => {
            let from = new Date(document.getElementById('start-calendar').value + ' 00:00:00')
            let to = new Date(document.getElementById('end-calendar').value + ' 00:00:00')

            if (from > to) {
                alert('終了日は開始日以降の日付に設定して下さい')
            } else {
                drawGraph(from, to)
            }
        }

        // 編集モーダルで日付を選択したときに，記録された体重を表示する関数
        const editCalendar = document.getElementById('edit-calendar')
        const editTemperature = document.getElementById('edit-temperature')
        const editWeight = document.getElementById('edit-weight')
        const editSymptom = document.getElementById('edit-symptom')
        const editContent = document.getElementById('edit-content')
        const inputEditForm = () => {
            let record = gon.cycle_records.find((record) => record.date === editCalendar.value)
            editTemperature.value = record.temperature
            editWeight.value = record.weight
            editSymptom.value = record.symptom
            editContent.value = record.content
        }

        const periodCalendarOption = {
            // スマートフォンでもカレンダーに「flatpickr」を使用
            disableMobile: true,
            // 選択できる期間を設定
            minDate: START_DATE,
            maxDate: END_DATE,
            // 日付選択後のイベント
            onChange: drawGraphForPeriod
        }

        // カレンダー
        const startCalendarFlatpickr = flatpickr('#start-calendar', periodCalendarOption)
        const endCalendarFlatpickr = flatpickr('#end-calendar', periodCalendarOption)

        // 新規記録用のカレンダー
        flatpickr('#new-calendar', {
            disableMobile: true,
            // 記録のある日付を選択できないようにする
            disable: gon.recorded_dates,
            defaultDate: 'today',
        })

        // 記録編集用のカレンダー
        flatpickr('#edit-calendar', {
            disableMobile: true,
            // 記録のある日付のみ選択できるようにする
            enable: gon.recorded_dates,
            // 記録が無い場合は日付を選択できないようにする
            noCalendar: gon.recorded_dates.length === 0,
            onChange: inputEditForm
        })

        const TODAY = new Date(new Date().setHours(0, 0, 0, 0))
        const A_WEEK_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 6)
        const TWO_WEEKS_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 13)
        const A_MONTH_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate() + 1)
        const THREE_MONTHS_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth() - 3, TODAY.getDate() + 1)

        // グラフを描く場所を取得
        const chartTemperatureContext = document.getElementById('chart-temperature').getContext('2d')
        const chartWeightContext = document.getElementById("chart-weight").getContext('2d')

        // グラフ（ drawGraph 関数の外で変数宣言をしなければならない!）
        let chartTemperature
        let chartWeight

        const changeEditModal = document.getElementById('change-edit-modal')
        const changeNewModal = document.getElementById('change-new-modal')

        changeEditModal.addEventListener('click',() => {
            $('#new-modal').modal('hide')
            $('#edit-modal').modal('show')
        })

        changeNewModal.addEventListener('click',() => {
            $('#edit-modal').modal('hide')
            $('#new-modal').modal('show')
        })

        // 期間を指定してグラフを描く
        const drawGraph = (from, to) => {
            // from から to までの期間のデータに絞る
            let records = gon.cycle_records.filter((record) => {
                // ' 00:00:00'が無いと，時差の影響を受けるので注意！
                let date = new Date(record.date + ' 00:00:00')
                return from <= date && date <= to
            })

            // 日付のみのデータを作成
            let dates = records.map((record) => {
                // 横軸のラベル表示は簡潔にしたいので，
                // 日付 2020-01-08 を 1/8 のような形式に変換する
                return record.date.replace(/^\d+-0*(\d+)-0*(\d+)$/, '$1/$2')
            })

            // 基礎体温のみのデータを作成
            let temperatures = records.map((record) => record.temperature)

            // 体重のみのデータを作成
            let weights = records.map((record) => record.weight)

            let temperatureData = {
                labels: dates,
                datasets: [{
                    label: '基礎体温(℃)',
                    data: temperatures,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    lineTension: 0,
                    spanGaps: true
                }]
            }

            let weightData = {
                labels: dates,
                datasets: [{
                    label: '体重(kg)',
                    data: weights,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    lineTension: 0,
                    spanGaps: true
                }]
            }

            let temperatureOption = {
                tooltips: {
                    footerFontStyle: 'normal',
                    callbacks: {
                        // ホバー（スマホならタップ）時のラベル表示を変更
                        title: (tooltipItems) => {
                            return tooltipItems[0].xLabel.replace(/^(\d+).(\d+)$/, ' $1 月 $2 日')
                        },
                        label: (tooltipItem) => {
                            return '基礎体温: ' + tooltipItem.yLabel + '℃'
                        },
                        afterLabel: (tooltipItem) => {
                            return '体重: ' + records[tooltipItem.index].weight + 'kg'
                        },
                        footer: (tooltipItems) => {
                            return '症状: ' + records[tooltipItems[0].index].symptom
                        },
                        afterFooter: (tooltipItems) => {
                            return records[tooltipItems[0].index].content
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 36.50,
                            suggestedMax: 37.00
                        }
                    }]
                }
            }

            let weightOption = {
                tooltips: {
                    footerFontStyle: 'normal',
                    callbacks: {
                        // ホバー（スマホならタップ）時のラベル表示を変更
                        title: (tooltipItems) => {
                            return tooltipItems[0].xLabel.replace(/^(\d+).(\d+)$/, ' $1 月 $2 日')
                        },
                        label: (tooltipItem) => {
                            return '体重: ' + tooltipItem.yLabel + 'kg'
                        },
                        afterLabel: (tooltipItem) => {
                            return '基礎体温: ' + records[tooltipItem.index].temperature + '℃'
                        },
                        footer: (tooltipItems) => {
                            return '症状: ' + records[tooltipItems[0].index].symptom
                        },
                        afterFooter: (tooltipItems) => {
                            return records[tooltipItems[0].index].content
                        }
                    }
                }
            }

            if (!chartTemperature) {
                // グラフが存在しないときは，作成する
                chartTemperature = new Chart(chartTemperatureContext, {
                    type: 'line',
                    data: temperatureData,
                    options: temperatureOption
                })
            } else {
                // グラフが存在するときは，更新する
                chartTemperature.data = temperatureData
                chartTemperature.options = temperatureOption
                chartTemperature.update()
            }

            if (!chartWeight) {
                // グラフが存在しないときは，作成する
                chartWeight = new Chart(chartWeightContext, {
                    type: 'line',
                    data: weightData,
                    options: weightOption
                })
            } else {
                // グラフが存在するときは，更新する
                chartWeight.data = weightData
                chartWeight.options = weightOption
                chartWeight.update()
            }
        }

        // 日付の古い方・新しい方を取得する関数
        const minDate = (date1, date2) => (date1 < date2) ? date1 : date2
        const maxDate = (date1, date2) => (date1 > date2) ? date1 : date2

        // 引数の日付から今日までのグラフを描く関数
        const drawGraphToToday = (from) => {
            // データが存在する範囲に修正
            from = maxDate(from, START_DATE)
            let to = minDate(TODAY, END_DATE)
            drawGraph(from, to)
            // フォームの開始日・終了日を変更する
            startCalendarFlatpickr.setDate(from)
            endCalendarFlatpickr.setDate(to)
        }

        // 過去◯週間のグラフを描くボタン
        document.getElementById('a-week-button').addEventListener('click', () => {
            drawGraphToToday(A_WEEK_AGO)
        })

        document.getElementById('two-weeks-button').addEventListener('click', () => {
            drawGraphToToday(TWO_WEEKS_AGO)
        })

        document.getElementById('a-month-button').addEventListener('click', () => {
            drawGraphToToday(A_MONTH_AGO)
        })

        document.getElementById('three-months-button').addEventListener('click', () => {
            drawGraphToToday(THREE_MONTHS_AGO)
        })

        // グラフの初期表示
        drawGraphToToday(A_WEEK_AGO)
    }

    // 動画の遅延読み込み
    if (document.getElementById('youtube-container')) {
        youtubeLazyLoading();
    }

    // チャット用

    window.chatInput = document.getElementById('chat-input')
    window.chatButton = document.getElementById('chat-button')

    if (chatInput) {
        let chatContent
        //
        //     chatButton.addEventListener('click', function () {
        //         chatContent = chatInput.value
        //         App.room.speak(chatContent)
        //         chatInput.value = ''
        //     })

        window.scroll(0, document.documentElement.scrollHeight)

        chatInput.addEventListener('input', () => {
            chatContent = chatInput.value
            if (chatContent === "") {
                chatButton.classList.add('disabled')
            } else {
                chatButton.classList.remove('disabled')
            }
        })
    }

    // 画像投稿フォーム（ドラッグ＆ドロップ）
    $('#image-form').ezdz({
        text: '画像',
        validators: {
            maxSize: 5 * 1024 * 1024
        },
        reject: function (file, errors) {
            if (errors.maxSize) {
                alert('画像サイズは5MB以下として下さい');
            }
        }
    });
});

// // 開始日と終了日を引数とした，基礎体温と体重のグラフを描く関数
// function drawGraphs(from, to) {
//     var cycle_records = gon.cycle_records.filter(function (record) {
//         var date = new Date(record.date).setHours(0, 0, 0, 0);
//         return from <= date && date <= to;
//     });
//     var dates_data = cycle_records.map(function (record) {
//         return record.date.replace(/^\d+-0*(\d+)-0*(\d+)$/, '$1/$2');
//     });
//     var temperatures_data = cycle_records.map(function (record) {
//         return record.temperature;
//     });
//     var weights_data = cycle_records.map(function (record) {
//         return record.weight;
//     });
//
//     var temperature_data_list = {
//         labels: dates_data,
//         datasets: [{
//             label: '基礎体温(℃)',
//             data: temperatures_data,
//             backgroundColor: 'rgba(255, 99, 132, 0.2)',
//             borderColor: 'rgba(255, 99, 132, 1)',
//             borderWidth: 1,
//             spanGaps: true
//         },]
//     };
//     var weight_data_list = {
//         labels: dates_data,
//         datasets: [{
//             label: '体重(kg)',
//             data: weights_data,
//             backgroundColor: 'rgba(255, 206, 86, 0.2)',
//             borderColor: 'rgba(255, 206, 86, 1)',
//             borderWidth: 1,
//             spanGaps: true
//         }]
//     };
//
//     var temperature_label = function (tooltipItem) {
//         return '基礎体温: ' + cycle_records[tooltipItem.index].temperature + '℃';
//     };
//     var weight_label = function (tooltipItem) {
//         return '体重: ' + cycle_records[tooltipItem.index].weight + 'kg';
//     };
//     var symptom_footer = function (tooltipItems) {
//         var symptom = '';
//         tooltipItems.forEach(function (tooltipItem) {
//             symptom += cycle_records[tooltipItem.index].symptom;
//         });
//         return '症状: ' + symptom;
//     };
//
//     var chart_temperature_callbacks = {
//         label: temperature_label,
//         afterLabel: weight_label,
//         footer: symptom_footer,
//     };
//     var chart_weight_callbacks = {
//         label: weight_label,
//         afterLabel: temperature_label,
//         footer: symptom_footer,
//     };
//
//     if (chart_existence) {
//         chart_temperature.data = temperature_data_list;
//         chart_temperature.options.tooltips.callbacks = chart_temperature_callbacks;
//         chart_temperature.update();
//
//         chart_weight.data = weight_data_list;
//         chart_weight.options.tooltips.callbacks = chart_weight_callbacks;
//         chart_weight.update();
//     } else {
//         var ctx_temperature = document.getElementById('chartBodyTemperature').getContext('2d');
//         var ctx_weight = document.getElementById('chartBodyWeight').getContext('2d');
//
//         chart_temperature = new Chart(ctx_temperature, {
//             type: 'line',
//             data: temperature_data_list,
//             options: {
//                 tooltips: {
//                     callbacks: chart_temperature_callbacks
//                 },
//                 scales: {
//                     yAxes: [{
//                         ticks: {
//                             suggestedMin: 36.5,
//                             suggestedMax: 37.0
//                         }
//                     }]
//                 }
//             }
//         });
//
//         chart_weight = new Chart(ctx_weight, {
//             type: 'line',
//             data: weight_data_list,
//             options: {
//                 tooltips: {
//                     callbacks: chart_weight_callbacks
//                 }
//             }
//         });
//         chart_existence = true;
//     }
// }
//
// // 日付フォームに入力する関数
// function inputDate(date_id, date) {
//     var year = date.getFullYear();
//     var month = ("00" + (date.getMonth() + 1)).slice(-2);
//     var day = ("00" + date.getDate()).slice(-2);
//
//     document.getElementById(date_id).value = year + '-' + month + '-' + day;
// }
//
// // 期間指定のボタン機能
// function onButtonClickPeriod() {
//     var from = new Date(document.getElementById('start-date').value + ' 00:00:00');
//     var to = new Date(document.getElementById('end-date').value + ' 00:00:00');
//     var three_months_later = new Date(from.getFullYear(), from.getMonth() + 3, from.getDate());
//
//     if (from > to) {
//         alert('指定期間を正しく入力して下さい。');
//     } else if (three_months_later < to) {
//         alert('期間は３ヶ月以内として下さい。');
//         drawGraphs(from, three_months_later);
//     } else {
//         drawGraphs(from, to);
//     }
// }
//
// // 過去◯日間のボタン機能
// function onButtonClickPast(from) {
//     // 過去◯日前のデータが無い場合は，最も古いデータを開始日とする
//     var start_date = new Date(gon.start_date + ' 00:00:00');
//
//     if (start_date < from) {
//         start_date = from;
//     }
//
//     drawGraphs(start_date, today);
//
//     inputDate('start-date', start_date);
//     inputDate('end-date', today);
// }
//
// function onButtonClickWeek() {
//     onButtonClickPast(a_week_ago);
// }
//
// function onButtonClickTwoWeek() {
//     onButtonClickPast(two_weeks_ago);
// }
//
// function onButtonClickMonth() {
//     onButtonClickPast(a_month_ago);
// }
//
// function onButtonClickThreeMonth() {
//     onButtonClickPast(three_months_ago);
// }
//
// // 編集ページ（日付からデータを取得）
//
// function GetCycleRecordData() {
//     var calendar = document.getElementById('cycle-record-date-edit');
//     var temperature = document.getElementById('cycle-record-body-temperature');
//     var weight = document.getElementById('cycle-record-body-weight');
//     var symptom = document.getElementById('cycle-record-symptom');
//     var button = document.getElementById('cycle-record-button');
//     var destroy_button = document.getElementById('cycle-record-button-destroy');
//     if (calendar.value) {
//         var get_record = gon.cycle_records.find(function (record) {
//             return record.date === calendar.value;
//         });
//         if (get_record) {
//             temperature.value = get_record.temperature;
//             weight.value = get_record.weight;
//             symptom.value = get_record.symptom;
//             button.disabled = '';
//             destroy_button.disabled = '';
//         } else {
//             alert('記録がありません。');
//             temperature.value = '';
//             weight.value = '';
//             symptom.value = '';
//             button.disabled = 'disabled';
//             destroy_button.disabled = 'disabled';
//         }
//     }
// }

// 動画表示ページ

function menstrualCycleButton() {
    operation.list = !operation.list;
    operation.date = false;
    menstruationDateSetting(operation);
}

function menstruationDateButton() {
    operation.list = false;
    operation.date = !operation.date;
    menstruationDateSetting(operation);
}

function menstruationReturnButton() {
    operation = {list: false, date: false};
    menstruationDateSetting(operation);
}

function menstruationDateSetting() {
    var startButton = document.getElementById('menstruation-start-button');
    var formList = document.getElementById('menstrual-cycle-form');
    var formDate = document.getElementById('menstruation-date-form');
    var returnButton = document.getElementById('menstruation-return-button');

    if (operation.list) {
        startButton.style.display = 'none';
        formList.style.display = 'block';
        formDate.style.display = 'none';
        returnButton.style.display = 'block';
    } else if (operation.date) {
        startButton.style.display = 'none';
        formList.style.display = 'none';
        formDate.style.display = 'block';
        returnButton.style.display = 'block';
    } else {
        startButton.style.display = 'flex';
        formList.style.display = 'none';
        formDate.style.display = 'none';
        returnButton.style.display = 'none';
    }
}

// 動画の遅延読み込み用関数（data-srcの値をsrcに移動）
function youtubeLazyLoading() {
    var iframes = document.querySelectorAll('.youtube');
    iframes.forEach(function (iframe) {
        if (iframe.getAttribute('data-src')) {
            iframe.setAttribute('src', iframe.getAttribute('data-src'));
        }
    });
}