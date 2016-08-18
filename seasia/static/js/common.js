
var csrftoken = $('meta[name=csrf-token]').attr('content');

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
        console.log(csrftoken);
    }
});

function getResults(route, resultType, formData, callback){
    console.log('requesting '+route);
    console.log('formdata: '+JSON.stringify(formData));
	$.ajax(route,{
		type: 'post',
		data: JSON.stringify(formData, null, '\t'),
		dataType: resultType,
		contentType: 'application/json;charset=UTF-8',
		success: function(result){
			callback(result);
		},
		error: function(result){
			console.log(result);
			console.log('Something went wrong :( \nTry to reload this page (F5 or Ctrl+R)');
            
		}
	});
}

const DAY = 86400000;

function inArray(needle,haystack)
{
    var count=haystack.length;
    for(var i=0;i<count;i++)
    {
        if(haystack[i]===needle){return true;}
    }
    return false;
}

function shuffle(a){
    for (i=0; i<a.length; i++){
        var rnd = Math.floor(Math.random()*a.length);
        var t = a[rnd];
        a[rnd]=a[i];
        a[i]=t;
    }
    return a;
}


