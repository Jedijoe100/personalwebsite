$(document).ready(function () {
    $("form.add_to_task").on('submit', function (e) {
        e.preventDefault();
        let id = e.target.id;
        let hour_object = $('#' + id + ' input[name=hours]')[0];
        let minute_object = $('#' + id + ' input[name=minutes]')[0];
        let hours, minutes;
        if (parseInt(hour_object.value)) {
            hours = parseInt(hour_object.value);
        } else {
            hours = 0
        }
        if (parseInt(minute_object.value)) {
            minutes = parseInt(minute_object.value);
        } else {
            minutes = 0
        }

        console.log(hours, minutes);
        hour_object.value = 0;
        minute_object.value = 0;

        let time_information = $("#time-" + id.split("-")[1])[0].innerText;
        let total_hours = parseInt(time_information.substring(0, time_information.search("hours")) + 1) + hours + Math.floor((parseInt(time_information.substring(time_information.search("and ") + 3, time_information.search(" minutes"))) + minutes) / 60);
        let total_minutes = (parseInt(time_information.substring(time_information.search("and ") + 3, time_information.search(" minutes"))) + minutes) % 60;

        $("#time-" + id.split("-")[1])[0].innerText = total_hours + " hours and " + total_minutes + " minutes";

        let time_added = Math.round((hours + minutes / 60) * 1000000) / 1000000;
        compressed = id.split("-")[1] + "|" + time_added;
        $.ajax({
            type: 'post',
            url: '/todo/update_task'+query_value,
            data: {input: compressed},
            success: function (result) {
                console.log("successful update")
            }
        })
    });
    $("form#add_task").on('submit', function (e) {
        e.preventDefault();
        let name = $("#add_new_name").val()
        $("#task_information")[0].innerHTML += "<div class=\"col\">\n" +
            "                <h4>" + name + "</h4>\n" +
            "                <h5 id=\"time-" + name + "\">0 hours and 0 minutes</h5>\n" +
            "                <hr>\n" +
            "                <form class=\"add_to_task\" id=\"update_task-" + name + "\">\n" +
            "                    <h5>Add time</h5>\n" +
            "                    <input type=\"number\" min=\"0\" name=\"hours\" value=\"0\">\n" +
            "                    <p>hours</p>\n" +
            "                    <br>\n" +
            "                    <input type=\"number\" max=\"59\" min=\"0\" name=\"minutes\" value=\"0\">\n" +
            "                    <p>minutes</p>\n" +
            "                    <br>\n" +
            "                    <input type=\"submit\" value=\"Submit\">\n" +
            "                </form>\n" +
            "            </div>";
        $.ajax({
            type: 'post',
            url: '/todo/add_task'+query_value,
            data: {input: name},
            success: function (result) {
                console.log("successful update")
            }
        })
    });
    $("form.delete_task").on('submit', function (e) {
        e.preventDefault();
        let id = e.target.id;
        let name = id.split("-")[1]
        $('#holder-' + name).remove();
        $.ajax({
            type: 'post',
            url: '/todo/delete_task'+query_value,
            data: {input: name},
            success: function (result) {
                console.log("successful update")
            }
        })
    });
    $("form#todo_list").on('submit', function (e) {
        e.preventDefault();
        let data = $("form#todo_list input[type=checkbox]:checked");
        let information = []
        for (let i = 0; i < data.length; i++) {
            information.push(data[i].value)
        }
        let compressed = information.map(value => {
            return value.replace("todo-", "")
        }).join("|||")
        //remove checkboxed items
        let data_1 = $("form#todo_list input[type=checkbox]:not(:checked)");
        let information_1 = []
        for (let i = 0; i < data_1.length; i++) {
            information_1.push(data_1[i].nextElementSibling.innerText)
        }
        let storage = ""
        information_1.forEach(value => {
            storage += "<input class=\"todo_items\" type=\"checkbox\" id=\"todo-" + value.split(" ").join("_").toLowerCase() + "\" value=\"todo-" + value.split(" ").join("_").toLowerCase() + "\">\n" +
                "                <label for=\"todo-" + value.split(" ").join("_").toLowerCase() + "\">" + value + "</label>\n" +
                "                <br>";
        })
        $('#todo_list_storage')[0].innerHTML = storage;
        $.ajax({
            type: 'post',
            url: '/todo/update_list'+query_value,
            data: {input: compressed},
            success: function (result) {
                console.log("successful update")
            }
        })
    });
    $("form#add_to_do_item").on('submit', function (e) {
        e.preventDefault();
        let name = $("#add_new_todo_item").val()
        $('#todo_list_storage')[0].innerHTML += "<input class=\"todo_items\" type=\"checkbox\" id=\"todo-" + name.split(" ").join("_").toLowerCase() + "\" value=\"todo-" + name.split(" ").join("_").toLowerCase() + "\">\n" +
            "                <label for=\"todo-" + name.split(" ").join("_").toLowerCase() + "\">" + name + "</label>\n" +
            "                <br>";
        $("#add_new_todo_item")[0].value = "";
        //remove checkboxed items
        $.ajax({
            type: 'post',
            url: '/todo/add_todo'+query_value,
            data: {input: name},
            success: function (result) {
                console.log("successful update")
            }
        })
    });
});
