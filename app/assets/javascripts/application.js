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
//= require_tree .

window.addEventListener('turbolinks:load', function () {
    if (document.getElementById("chartBodyTemperature") == null ||
        document.getElementById("chartBodyWeight") == null) {
        return;
    }
    var ctx_temp = document.getElementById('chartBodyTemperature').getContext('2d');
    var ctx_weight = document.getElementById('chartBodyWeight').getContext('2d');
    var data_temp = {
            labels: gon.dates,
            datasets: [{
                label: '基礎体温(℃)',
                data: gon.body_temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                spanGaps: true
            }]
        };
    var data_weight = {
        labels: gon.dates,
        datasets: [{
            label: '体重(kg)',
            data: gon.body_weights,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            spanGaps: true
        }]
    };

    new Chart(ctx_temp, {
        type: 'line',
        data: data_temp,
        options: {
        }
    });

    new Chart(ctx_weight, {
        type: 'line',
        data: data_weight,
        options: {
        }
    });
});

