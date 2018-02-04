google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(init);

function init() {
  var options = {
    //width: 800,
    //height: 480,
    vAxis: {minValue:-4, maxValue:4},
    animation: {
      duration: 200,
      easing: 'in'
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
    return function () {return counter += 1;}
  })();

  socket.onmessage = function (event) {
    var obj = JSON.parse(event.data);
    document.getElementById('x').innerHTML = obj.d.accelX;
    document.getElementById('y').innerHTML = obj.d.accelY;
    document.getElementById('z').innerHTML = obj.d.accelZ;

   if (data.getNumberOfRows() > 12) {
     data.removeRow(0);  //data.getNumberOfRows()
   }
   // Generating a random x, y pair and inserting it so rows are sorted.
   var t = add();
   var x = parseFloat(obj.d.accelX);
   var y = parseFloat(obj.d.accelY);
   var z = parseFloat(obj.d.accelZ);
   var where = data.getNumberOfRows();
   console.log(x);
   data.insertRows(where, [[t.toString(), x, y, z]]);
   drawChart();
 };

  drawChart();
}
