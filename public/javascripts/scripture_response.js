$(document).ready(function(){
	$("textarea[name=verse_guess]").keypress(function (e) {
		    if(e.which === 13 && !e.shiftKey) {
			            e.preventDefault();
			        
			            $(this).closest("form").submit();
			        }
	});
    $("form#TestAnswer").on('submit', function(e){
        e.preventDefault();
        let data = $('textarea[name=verse_guess]').val();
        $.ajax({
            type: 'post',
            url: '/scripture/attempt',
            data: {'input': data, 'reference': verse_reference},
            dataType: 'text',
            success: function(result){
                values = result.split("/")
                verse_reference = values[0];
		$('textarea[name=verse_guess]').val("");
                $('#reference').text(values[1]);
                $('#hint').html($.parseHTML(values[2]));
                $('#familiarity').text(values[3]);
                $('input[name=verse_guess]').val("")
                if(values[4] === "true"){
                    alert("You are correct")
                }else{
		    const diff = JsDiff.diffWords(values[5], values[6]);
		    let text_value = "";
		    diff.forEach((part) => {
			const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
			text_value += "<span class='color-"+color+"'color='" +color +"'>" + part.value + "</span>";
		    });
                    alert("You are not correct, you gave: \n" + values[6]+ "\n but the correct verse is: \n" + values[5])
		    $('#previous_wrong').html(text_value);
                }
            }
        })
    });
    $("form#UpdateVerses").on('submit', function(e){
        e.preventDefault();
        let data = $("form#UpdateVerses input[type=checkbox]:checked");
        let information = []
        for (let i = 0; i < data.length; i++) {
            information.push(data[i].value)
        }
        let compressed = information.map(value => {return value.replace("verse_", "")}).join()
        $.ajax({
            type: 'post',
            url: '/scripture/update_list',
            data: {input: compressed},
            success: function(result){
                alert("successful update")
            }
        })
    });

});
