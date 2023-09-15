function previous_month(){
    if (month > 0){
        month -= 1
    }else{
        month = 11;
        year -= 1;
    }
    $.ajax({
        type: 'post',
        url: '/calendar/month' + query_value,
        data: {month: month, year: year},
        success: function (result) {
            $('.calendar_holder').html(result);
        }
    })
}
function next_month(){
    if (month < 11){
        month += 1
    }else{
        month = 0;
        year += 1;
    }
    $.ajax({
        type: 'post',
        url: '/calendar/month' + query_value,
        data: {month: month, year: year},
        success: function (result) {
            $('.calendar_holder').html(result);
        }
    })
}
$(document).ready(function () {
    $("form#add_event").on('submit', function (e) {
        e.preventDefault();
        let name = $("#event_name").val();
        let date = $("#event_date").val();
        let time = $("#event_time").val();
        console.log(name, date, time);
        $.ajax({
            type: 'post',
            url: '/calendar/add_event'+query_value,
            data: {month: month, year: year, event_name: name, event_date: date, event_time: time},
            success: function (result) {
                $('.calendar_holder').html(result);
            }
        })
    });
})
