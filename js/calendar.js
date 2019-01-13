// function displayCalendar(){
 
//     var htmlContent = "";
//     var FebNumberOfDays = "";
//     var counter = 1;
//     var dateNow = new Date();
//     var month = dateNow.getMonth();
//     var nextMonth = month + 1;
//     var prevMonth = month - 1 ;
//     var day = dateNow.getDate();
//     var year = dateNow.getFullYear();
    
    
//     //Determing if February (28,or 29)  
//     if (month == 1) {
//        if ((year % 100 != 0) && (year % 4 == 0) || (year % 400 == 0)) {
//          FebNumberOfDays = 29;
//        } else {
//          FebNumberOfDays = 28;
//        }
//     }
    
//     // names of months and week days.
//     var monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
//     var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday", "Saturday"];
//     var dayPerMonth = ["31", "" + FebNumberOfDays + "", "31","30","31","30","31","31","30","31","30","31"]
    
//     // days in previous month and next one , and day of week.
//     var nextDate = new Date(nextMonth + ' 1 ,' + year);
//     var weekdays= nextDate.getDay();
//     var weekdays2 = weekdays
//     var numOfDays = dayPerMonth[month];
        
//     // this leave a white space for days of pervious month.
//     while (weekdays > 0) {
//        htmlContent += "<td class='monthPre'></td>";
    
//     // used in next loop.
//         weekdays --;
//     }
    
//     // loop to build the calander body.
//     while (counter <= numOfDays){
    
//         // When to start new line.
//        if (weekdays2 > 6) {
//            weekdays2 = 0;
//            htmlContent += "</tr><tr>";
//        }
    
//        // if counter is current day.
//        // highlight current day using the CSS defined in header.
//        if (counter == day) {
//            htmlContent += "<td data-toggle='modal' data-target='#exampleModal' class='dayNow' onMouseOver='this.style.background=\"#17a2b8\"; this.style.color=\"#FFFFFF\"' "+
//            "onMouseOut='this.style.background=\"#FFFFFF\"; this.style.color=\"#17a2b8\"'>" + counter + "</td>";
//        } else {
//            htmlContent += "<td data-toggle='modal' data-target='#exampleModal' class='monthNow' onMouseOver='this.style.background=\"\"; this.style.color=\"#FFFFFF\"'"+
//            " onMouseOut='this.style.background=\"#FFFFFF\"; this.style.color=\"#4b4b4b\"'>" + counter + "</td>";    
//        }
       
//        weekdays2 ++;
//        counter ++;
//     }
    
//     // building the calendar html body.
//     var calendarBody = "<table class='calendar table-bordered'> <tr class='monthNow'><th colspan='7'>"
//     + monthNames[month] + " " + year +"</th></tr>";
//     calendarBody += "<tr class='dayNames'><td>Sun</td><td>Mon</td><td>Tue</td>" +
//     "<td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr>";
//     calendarBody += "<tr>";
//     calendarBody += htmlContent;
//     calendarBody += "</tr></table>";
//     // set the content of div .
//     document.getElementById("calendar").innerHTML=calendarBody;
    
//    }

var calendar = {
    monthName : ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], // Month Names
    data : null,
    currentDay : 0,
    currentMonth : 0,
    currentYear : 0, 
    list : function () {
      calendar.currentMonth = parseInt(document.getElementById("month").value);
      calendar.currentYear = parseInt(document.getElementById("year").value);
      var daysInMonth = new Date(calendar.currentYear, calendar.currentMonth+1, 0).getDate(),
          startDay = new Date(calendar.currentYear, calendar.currentMonth, 1).getDay(),
          endDay = new Date(calendar.currentYear, calendar.currentMonth, daysInMonth).getDay();
  
      // INIT & LOAD DATA FROM LOCALSTORAGE
      calendar.data = localStorage.getItem("cal-" + calendar.currentMonth + "-" + calendar.currentYear);
      if (calendar.data==null) {
        localStorage.setItem("cal-" + calendar.currentMonth + "-" + calendar.currentYear, "{}");
        calendar.data = {};
      } else {
        calendar.data = JSON.parse(calendar.data);
      }
  
      // DRAWING CALCULATION
      // Determine the number of blank squares before start of month
      var squares = [];
      if (startDay != 0) {
        for (var i = 0; i < startDay; i++) {
          squares.push("b");
        }
      }
  
      // Populate the days of the month
      for (var i = 1; i <= daysInMonth; i++) {
        squares.push(i);
      }
  
      // Determine the number of blank squares after end of month
      if (endDay != 6) {
        var blanks = endDay == 0 ? 6 : 6 - endDay;
        for (var i = 0; i < blanks; i++) {
          squares.push("b");
        }
      }
  
      // DRAW
      // Container & Table
      var container = document.getElementById("container"),
          cTable = document.createElement("table");
      cTable.id = "calendar";
      cTable.className += "table table-bordered";
      container.innerHTML = "";
      container.appendChild(cTable);
  
      // First row - Days
      var cRow = document.createElement("tr"),
          cCell = null,
          days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (var d of days) {
        cCell = document.createElement("td");
        cCell.innerHTML = d;
        cRow.appendChild(cCell);
      }
      cRow.classList.add("day");
      cTable.appendChild(cRow);
  
      // Days in Month
      var total = squares.length;
      cRow = document.createElement("tr");
      for (var i = 0; i < total; i++) {
        cCell = document.createElement("td");
        if (squares[i] == "b") {
          cCell.classList.add("blank");
        } else {
          cCell.innerHTML = "<div class='dd'>"+squares[i]+"</div>";
          if (calendar.data[squares[i]]) {
            cCell.innerHTML += "<div class='evt'>" + calendar.data[squares[i]] + "</div>";
          }
          cCell.addEventListener("click", function(){
            calendar.show(this);
          });
        }
        cRow.appendChild(cCell);
        if (i != 0 && (i + 1) % 7 == 0) {
          cTable.appendChild(cRow);
          cRow = document.createElement("tr");
        }
      }
  
      // REMOVE ANY ADD/EDIT EVENT DOCKET
      document.getElementById("event").innerHTML = "";
    },
  
    show : function (el) {
    // calendar.show() : show edit event docket for selected day
    // PARAM el : Reference back to cell clicked
  
      // FETCH EXISTING DATA
      calendar.currentDay = el.getElementsByClassName("dd")[0].innerHTML;
  
      // DRAW FORM
      var tForm = "<h1 class='form-title'>" + (calendar.data[calendar.currentDay] ? "edit" : "add") + " event</h1>";
      tForm += "<div>" + calendar.currentDay + " " + calendar.monthName[calendar.currentMonth] + " " + calendar.currentYear + "</div>";
      tForm += "<textarea id='evt-details' required>" + (calendar.data[calendar.currentDay] ? calendar.data[calendar.currentDay] : "") + "</textarea>";
      tForm += "<input class='form-control btn btn-danger' type='button' value='Delete' onclick='calendar.del()'/>";
      tForm += "<input class='form-control btn btn-success' type='submit' value='Save'/>";
  
      // ATTACH
      var eForm = document.createElement("form");
      eForm.addEventListener("submit", calendar.save);
      eForm.innerHTML = tForm;
  
      var container = document.getElementById("event");
      container.innerHTML = "";
      container.appendChild(eForm);
    },
  
    save : function (evt) {
    // calendar.save() : save event
  
      evt.stopPropagation();
      evt.preventDefault();
      calendar.data[calendar.currentDay] = document.getElementById("evt-details").value;
      localStorage.setItem("cal-" + calendar.currentMonth + "-" + calendar.currentYear, JSON.stringify(calendar.data));
      calendar.list();
    },
  
    del : function () {
    // calendar.del() : Delete event for selected date
  
      if (confirm("Remove event?")) {
        delete calendar.data[calendar.currentDay];
        localStorage.setItem("cal-" + calendar.currentMonth + "-" + calendar.currentYear, JSON.stringify(calendar.data));
        calendar.list();
      }
    }
  };
  
  // INIT - DRAW MONTH & YEAR SELECTOR
  window.addEventListener("load", function () {
    // DATE NOW
    var now = new Date(),
        nowMonth = now.getMonth(),
        nowYear = parseInt(now.getFullYear());
  
    // APPEND MONTHS
    var month = document.getElementById("month");
    for (var i = 0; i < 12; i++) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = calendar.monthName[i];
      if (i == nowMonth) {
        opt.selected = true;
      }
      month.appendChild(opt);
    }
  
    // APPEND YEARS
    // Set to 10 years range. Change this as you like.
    var year = document.getElementById("year");
    for (var i = nowYear - 10; i <= nowYear + 10; i++) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = i;
      if (i == nowYear) {
        opt.selected = true;
      }
      year.appendChild(opt);
    }
  
    // DRAW CALENDAR
    calendar.list();
  });