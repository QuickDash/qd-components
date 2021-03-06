var dc = require('dc');
var detectElementResize = require('detect-element-resize');

require('../../src/stylesheets/kpi-gauge.scss');

var KPIGauge = function(parent, options) {

  var _chart = {kpiBar: {}, kpiNumber: {}};
  var _dimension, _group;
  var gaugeClassName = 'kpi-gauge';
  var numberClassName = 'kpi-number';
  var formatter = d3.format(",");
  var title = "Total";
  var barWidth = function () {return d3.select(parent).property('offsetWidth')};
  var barHeight = 9;
  
  if(options) {
    if(options.formatter) {
      formatter = options.formatter;
    }

    if(options.title) {
      title = options.title;
    }

    if(options.width) {
      width = options.width;
    }

    if(options.height) {
      height = options.height;
    }

  }

	var root = d3.select(parent);
  root.classed('kpi-component-container', true);
	
	root.append('div').classed(gaugeClassName, true);
	root.append('div').classed(numberClassName, true);
  root.append('h3').html(title);

	_chart.kpiNumber = dc.numberDisplay(parent + ' .' + numberClassName)
      .valueAccessor(function(d) { return d;})
      .formatNumber(formatter);

  _chart.kpiBar = dc.barGauge(parent + ' .' + gaugeClassName)
    .width(barWidth())
    .height(barHeight)
    .orientation('horizontal')
    .margins({top:0,right:0,bottom:0,left:0})
    .usePercentageLength(true);

  _chart.dimension = function(_) {
    if(!arguments.length) return _dimension; 
    _dimension = _;
    _chart.kpiBar.dimension(_);

    return _chart;
  }

  _chart.group = function(_) {
    if(!arguments.length) return _group;
    _group = _;
    _chart.kpiNumber.group(_);
    _chart.kpiBar.group(_).totalCapacity(_.value());

    return _chart;
  }

  var resize = function() {
    _chart.kpiBar.width(barWidth()).render();
  };

  //In the future, refactor kpi gauge sizing into sizeboxify
  window.addEventListener('resize:qd', resize, true);

  //If the chart parent/container element size changes then resize the chart
  detectElementResize.addResizeListener(d3.select(parent).node(), checkForResize);
  function checkForResize() {
    //Only resize if the chart has its dimension added meaning everything has loaded
    if(dc.autoResize() === true && _chart.dimension() && _chart.group())
      resize();
  }

  return _chart;
};

module.exports = KPIGauge;