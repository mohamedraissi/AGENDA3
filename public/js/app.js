//app
$(document).ready(function() {
  console.log(window.location.pathname);
    function date(date) {
    return moment(date).format("YYYY-MM-DD:HH:mm:ss");
    }
    $('#calendar').fullCalendar({
      minTime: "08:00:00",
      maxTime: "18:00:00",
      header: {
        left: 'next today',
        center: 'title',
        right: 'agendaWeek,agendaDay'
      },
      hiddenDays: [0],
      views: {
        listDay: { buttonText: 'list day' },
        agendaWeek: { buttonText: 'semaine' }
      },
      defaultView: 'agendaWeek',
      defaultDate: new Date(),
      navLinks: true, 
      selectable: true,
      selectHelper: true,
      slotDuration: '01:00:00',
      select: function(start, end, allDay) {
                var selectionStart = moment(start);
                var today = moment();

                if (selectionStart < today) {
                    $('#calendar').fullCalendar('unselect');
                }
                else {
                    var title = $("#modal").modal("show");
                     $("#debut").val(date(start));
                     $("#fin").val(date(end));
                     var eventData;
                     if ($("#btnRen").click()) {
                         eventData = {
                         start: start,
                         end: end
                       };
                       $('#calendar').fullCalendar('renderEvent', eventData, true); //
                     }
                     $('#calendar').fullCalendar('unselect');
                }
            },
      events:
        {
            url:'/agenda/res',
        }
    ,
    eventClick: function(event) {
      if ( window.location.pathname=="/user/admin/agenda") {
        if (event.url) {
            window.open(event.url);
            return false;
        }
      }
    },
      editable: false,
      eventLimit: true, // permettre "plus" de lien quand trop d'événements


    });

  });
