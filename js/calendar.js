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
  
      // init and load data from localstore
      calendar.data = localStorage.getItem("cal-" + calendar.currentMonth + "-" + calendar.currentYear);
      if (calendar.data==null) {
        localStorage.setItem("cal-" + calendar.currentMonth + "-" + calendar.currentYear, "{}");
        calendar.data = {};
      } else {
        calendar.data = JSON.parse(calendar.data);
      }
  
      // determine the number of blank squares before start of month
      var squares = [];
      if (startDay != 0) {
        for (var i = 0; i < startDay; i++) {
          squares.push("b");
        }
      }
  
      // populate the days of the month
      for (var i = 1; i <= daysInMonth; i++) {
        squares.push(i);
      }
  
      // determine the number of blank squares after end of month
      if (endDay != 6) {
        var blanks = endDay == 0 ? 6 : 6 - endDay;
        for (var i = 0; i < blanks; i++) {
          squares.push("b");
        }
      }

      // container and calendar table
      var container = document.getElementById("container"),
          cTable = document.createElement("table");
      cTable.id = "calendar";
      cTable.className += "table table-bordered";
      container.innerHTML = "";
      container.appendChild(cTable);
  
      // days
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
  
      // days in month
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
  
      // fetch existing data
      calendar.currentDay = el.getElementsByClassName("dd")[0].innerHTML;
  
      // form
      var tForm = "<h1 class='form-title'>" + (calendar.data[calendar.currentDay] ? "edit" : "add") + " event</h1>";
      tForm += "<div>" + calendar.currentDay + " " + calendar.monthName[calendar.currentMonth] + " " + calendar.currentYear + "</div>";
      tForm += "<textarea id='evt-details' required>" + (calendar.data[calendar.currentDay] ? calendar.data[calendar.currentDay] : "") + "</textarea>";
      tForm += "<input class='form-control btn btn-danger' type='button' value='Delete' onclick='calendar.del()'/>";
      tForm += "<input class='form-control btn btn-success' type='submit' value='Save'/>";
  
      // attach
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
  
  // draw month and year selector
  window.addEventListener("load", function () {
    // date now
    var now = new Date(),
        nowMonth = now.getMonth(),
        nowYear = parseInt(now.getFullYear());
  
    // append months
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
  
    // append years
    // set to 20 years range.
    var year = document.getElementById("year");
    for (var i = nowYear - 10; i <= nowYear + 20; i++) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = i;
      if (i == nowYear) {
        opt.selected = true;
      }
      year.appendChild(opt);
    }
  
    // draw calendar
    calendar.list();
  });