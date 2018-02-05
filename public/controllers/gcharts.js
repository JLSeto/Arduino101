var socket = io()
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(init);

socket.on('connect', function() {
  console.log('Connected to server');
});

function init() {
  var options = {
    //width: 800,
    //height: 480,
    vAxis: {minValue:-1000, maxValue:1000},
    animation: {
      duration: 0,
      easing: 'linear'
    }
  };

  var chart = new google.visualization.LineChart(
      document.getElementById('visualization'));
  var data = new google.visualization.DataTable();
  data.addColumn('string', 't');
  data.addColumn('number', 'x');
  data.addColumn('number', 'y');
  data.addColumn('number', 'z');

  function drawChart() {
    // Disabling the socket while the chart is drawing.
    socket.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          socket.disabled = false;
        });
    chart.draw(data, options);
  }

  var add = (function () {
    var counter = 0;
    return function (event) {return counter += event;}
  })();

    socket.on('something', function(event){
      if (data.getNumberOfRows() > 12) {
        data.removeRow(0);  //data.getNumberOfRows()
      }
      var t = add(event.t);
      var x = event.ax;
      var y = event.ay;
      var z = event.az;
      var where = data.getNumberOfRows();
      data.insertRows(where, [[t.toString(), x, y, z]]);
      drawChart();
    });

  drawChart();
}
