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

// '2020-01-12'のような文字列から，Javascriptの日付オブジェクトを取得する関数
// setHoursを使用しないと，時差の影響で0時にならないため注意！
const convertDate = (date) => {
    return new Date(new Date(date).setHours(0, 0, 0, 0))
}

// カレンダーのフォーム（flatpickr）
document.addEventListener("turbolinks:load", function () {
    flatpickr.localize(flatpickr.l10ns.ja);

    if (document.getElementById('start-calendar')) {
        // データの初日・最終日
        const START_DATE = convertDate(gon.cycle_records[0].date)
        const END_DATE = convertDate(gon.cycle_records[gon.cycle_records.length - 1].date)

        // 開始日・終了日カレンダーで日付を選択したとき期間内のグラフを描く関数
        const drawGraphForPeriod = () => {
            let from = convertDate(document.getElementById('start-calendar').value)
            let to = convertDate(document.getElementById('end-calendar').value)

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

        // 生理周期日選択カレンダー
        flatpickr('#edit-calendar', {
            disableMobile: true,
            // 記録のある日付のみ選択できるようにする
            enable: gon.recorded_dates,
            // 記録が無い場合は日付を選択できないようにする
            noCalendar: gon.recorded_dates.length === 0,
            onChange: inputEditForm
        })

        const TODAY = convertDate(new Date())
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
                let date = convertDate(record.date)
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

    // 記録編集用のカレンダー
    flatpickr('#menstruation-calendar', {
        disableMobile: true,
        maxDate: 'today'
    })

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