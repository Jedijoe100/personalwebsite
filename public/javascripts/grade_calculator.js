$(document).ready(function(){
    let add = function(e){
        e.preventDefault();
        var d = document.getElementById("textboxes").innerHTML;
        document.getElementById("textboxes").innerHTML = d + "<input type=\"number\" step=\"0.001\" max=\"1\" name=\"worth\" value=\"0\"><input type=\"number\" step=\"0.001\" max=\"1\" name=\"value\" value=\"0\"><br>";
    }
    $("form#CalculationForm").on('submit', function(e){
        e.preventDefault();
        let worth = $('input[name=worth]')
        let value = $('input[name=value]')
        let information = []
        for (let i = 0; i < worth.length; i++) {
            information.push([parseFloat(worth[i].value), parseFloat(value[i].value)])
        }
        console.log(information)
        let total_grade_obtained = information.reduce((total, value)=>{console.log(value, parseFloat(total) + value[0]); return parseFloat(total) + value[0]});
        let current_value = information.reduce((total, value)=>{return parseFloat(total) + value[0]*value[1]})
        let running_grade = current_value/total_grade_obtained
        console.log(total_grade_obtained, current_value, running_grade)
        document.getElementById('amount_done').innerText = Math.round(10000*total_grade_obtained)/100 + "%"
        document.getElementById('current_grade').innerText = Math.round(10000*running_grade)/100 + "%"
    })
    $('#add_row').on('click', add)
});
