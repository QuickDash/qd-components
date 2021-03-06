dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');
var dataFilePath = './data/bubble_map_table.csv';
var countriesGeoJsonFilePath = './data/countries.geo.json';

require('./stylesheets/tool-tipsify.demo.scss');

var data;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
var yearId, yearDimension, yearGroup, yearChart;
var countryId, countryDimension, countryGroup, countryChart;
var toolTipFunc = function(d) {return d.data.key + ": " + d.data.value;};
var yearToolTipFunc = function(d) {return "Year: " + d.data.key + "<br/>Value: " + d.data.value}

d3.csv(dataFilePath, function(d) {

  //add more charts, and show the tool tip positions, add any more documentation
  data = crossfilter(d);

  assistanceCategoryId = 'assistance-category-chart';
  regionId = 'region-chart';
  yearId = 'year-chart';
  countryId = 'country-chart';

  assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
  assistanceCategoryGroup = assistanceCategoryDimension.group();

  regionDimension = data.dimension(function(d) { return d.region_name; });
  regionGroup = regionDimension.group();

  yearDimension = data.dimension(function(d) { return Number(d.fiscal_year); });
  yearGroup = yearDimension.group();//.reduceSum(function(d) { return d.value;});

  countryDimension = data.dimension(function(d) { return d.country_code;});
  countryGroup = countryDimension.group();

  regionChart = dc.pieChart('#' + regionId);
  regionChart.dimension(regionDimension).group(regionGroup)
    .width(600).height(200)
    .radius(100)
    .innerRadius(40)
    .title(function(d) {return d.region})
    .transitionDuration(0);

  assistanceCategoryChart = dc.rowChart('#' + assistanceCategoryId);
  assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
    .width(600).height(200).gap(10)
    .transitionDuration(0);

  yearChart = dc.barChart('#' + yearId)
    .dimension(yearDimension).group(yearGroup)
    .width(600).height(200).gap(10)
    .elasticY(true)
    .x(d3.scale.ordinal().domain([2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]))
    .xUnits(dc.units.ordinal);

    d3.json(countriesGeoJsonFilePath, function(geoJson) {
      var geoJsonKeyField = 'id';
      var _layerName = 'country';

      countryChart = dc.geoChoroplethChart('#' + countryId)
        .width(700)
        .height(300)
        .dimension(countryDimension)
        .group(countryGroup)
        .overlayGeoJson(geoJson.features, _layerName, function(d) {
          return d[geoJsonKeyField];
        });



      //*********tipsify your charts**************
      // regionChart has the automatic toolTipsify behavior
      assistanceCategoryChart.toolTipsify({position: 'e', offset: [0, 5]});
      yearChart.toolTipsify({position: 'n', content: yearToolTipFunc, offset: [-5, 0]});

      dc.renderAll();

    });







  

  }
);
  