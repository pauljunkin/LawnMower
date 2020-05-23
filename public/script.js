var count = 0;
var globalTime;
var globalDate;
var indexToTime = {
    "0" : "8am",
    "1" : "9am",
    "2" : "10am",
    "3" : "11am", 
    "4" : "12pm",
    "5" : "1pm",
    "6" : "2pm",
    "7" : "3pm",
    "8" : "4pm",
    "9" : "5pm"
}
$(function() {
    $( "#datepicker-13" ).datepicker();
    //$( "#datepicker-13" ).datepicker("show");
});
$(function() {
    $("#availabilty").on("click", function(){
        //var table = document.getElementById("table");
        var date = document.getElementById("datepicker-13").value;
        var res = date.split("/").join("-");
        window.location.replace(`/appointment/${res}`);
        
        /*for (let row of table.rows) 
        {
            for(let cell of row.cells) 
            {
                let val = cell.innerText; // your code below
                if( times.includes(val)){
                    $(table.rows[1].cells[cell.cellIndex]).css('background-color', 'lightgreen');
                }
            }
        }*/
    });
});

$(function() {
    $("td").on("click", function(){
        if(count == 0 && this.innerHTML != "Taken"){
            $(this).css('background-color', 'blue');
            count = 1;
            time = (this.cellIndex).toString();
            $("#chosenDay").append(`<p>Date: ${$("#checkDate").text()} Time: ${indexToTime[time]}  </p>`)
            globalTime = indexToTime[time];
            globalDate = $("#checkDate").text()
            btn = `<button id = "makeAppointment">Finalize Appointment</button>`
            $("#chosenDay").append(btn)
        }
    });
});
$(function() {
    $("#clearDate").on("click", function(){
        count = 0;
        $("#chosenDay").empty()
        table = document.getElementById("table");
        for(let cell of table.rows[1].cells) 
        {
            let val = cell.innerText; // your code below
            if(val == "Open"){
                $(cell).css('background-color', 'lime');
            }
        }
    })
});

$(function() {
    $(document).on("click", "#makeAppointment", function(){
        window.location.replace(`/create/${globalDate}?time=${globalTime}`);
    })
});