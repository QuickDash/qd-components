# qd-components

This library slaps a few handy extra features on to the excellent [DC.js](http://dc-js.github.io/dc.js/) dashboard framework.

Use it wherever you would use DC.js.

## Getting Started

Install

```
npm install qd-components
```

Require in your code

```
var dc = require('qd-components');
```

# API Reference

## dc.filterBuilder(parent)

filterBuilder provides two things that are lacking in a typical DC dashboard:

* A clear display of current filter state in one place
* A searchable menu method for filtering on any value of any chart

You can see it in action [here](https://explorer.usaid.gov/aid-trends.html) and [here](https://explorer.usaid.gov/aid-dashboard.html)

### .filterSources(filterableCharts)

Wires up the filterBuilder to handle filter creation and display for a set of charts. 

| Param           | Type  | Description |
|-----------------|-------|-------------|
| filterableCharts | Array | An array of objects like  __{chart: *SomeDcJsChart*, label:  *StringLabelForChart* }__ |

```
// Example Usage

var filterBuilder = dc.filterBuilder('#filter-builder-id')
  .filterSources([{chart: fooChart, label: "Foo"}, 
                  {chart: barChart, label: "Bar"}, 
                  {chart: bazChart, label: "Baz"}]);
```

## dc.dynatableComponent(parent)

DynatableComponent turns a simple table into a dimensional table that responds to your DC charts. This means any time your DC charts get filtered, the data in the Dynatable also gets filtered. 

You can see it in action [here](https://explorer.usaid.gov/aid-dashboard.html)

### .dimension(dimension)

Pass the crossfilter dimension to dynatableComponent. This dimension should be something different than any of your chart dimensions. A dimension that uses a column for data IDs would be suitable.

| Param           | Type   | Description                 |
|-----------------|--------|-----------------------------|
| dimension       | object | Crossfilter dimension object|

### .group(group)

Pass the crossfilter group to dynatableComponent. 

| Param           | Type   | Description                 |
|-----------------|--------|-----------------------------|
| group           | object | Crossfilter group object    |

### .columns(columns)

Pass an array of column objects to dynatableComponent, describing what columns to use from the data, and the display label of those columns. 

| Param           | Type   | Description                 |
|-----------------|--------|-----------------------------|
| columns         | Array  | Array of objects with the properties label and csvColumnName. The label is what the column header will be in the table. The csvColumnName is the name of the column in the data.    |

### .shortLoad(initialRecordSize)

Pass an initial record size to dynatableComponent. If initialRecordSize is set to true, the record set will be defaulted to 10, otherwise you can specify a specific initial record size. 

| Param            | Type              | Description                 |
|----------------- |-------------------|-----------------------------|
| initialRecordSize| boolean or number | Initial record set. Use this if you have a huge amount of data you don't want to block the page load.    |

```
//Example Usage

var dc = require('qd-components');

var data = crossfilter(someData);
var tableListingDimension = data.dimension(function(d) { return d.data_column_name;});
var tableListingGroup = tableListingDimension.group();

var dynatable = dc.dynatableComponent('#dynatable-id')
				.dimension(tableListingDimension)
				.group(tableListingGroup);
dynatable.columns([{label: "Foo", csvColumnName: "foo_name"},
					   {label: "Bar", csvColumnName: "bar_column"}]);

//optional ability to only load the first 10 records for speedier initial load
//you can then manually load all the rest of your records by doing dynatable.redraw() after the initial rendering
dynatable.shortLoad(true);

```

## dc.audioDash(chartList)

Simply pass the charts that you would like to be readable by an audio browser, to the audioDash component. Also pass in a formatter to specify how the data should be read. 

```
var dc = require('qd-components');

var formatterFunction = function(key, value) { return key + ": " + value};
var audioDash = dc.audioDash('#audio-dash-id')
				  .charts({
				  		"Foo title": {chart: fooChart, formatter: formatterFunction}
				  });

```

## dc.sizeBoxify(chart)

Provides easy addition of dynamic resize capability to any DC chart component instance.

```
// Example Usage

var dc = require('qd-components');

var myFooChart;

// Minimal setup example. Will resize myFooChart based on dimensions of myFooChart.parent()
dc.sizeBoxify(myFooChart);

// Custom example
dc.sizeBoxify(myFooChart, function(){
	// custom resize code here
});
```

## dc.toolTipsify(chart, toolTipConfig)
Makes it easy to add high quality tooltips to any of your DC charts. 

You can see it in action [here](https://explorer.usaid.gov/aid-dashboard.html)

Pass your chart, and tool tip config to tool tipsify. The config allows you to customize the tooltip position, and how to display its content. 

| Param         | Type    | Description             |
|---------------|---------|-------------------------|
| toolTipConfig | object  | This object can have optional properties for a content function, number formatting function, positioning, and offset.|

### content: function(chartData)
The content function will tell toolTipsify how to deal with data coming from the chart. This is useful when data should be manipulated or displayed in a certain way in the tooltip. 

### position: "mouse" or any ordinal coordinates like 'n', 's', 'e', 'w', or combos like 'ne' etc. 
Set the position to 'mouse' if you want the tool tip to follow the mouse. The ordinal coordinates will fix the tooltip in a specific location.

### offset: [y, x]
Add coordinate offsets for custom positioning of the tooltip.

### formatter: function(chartData)
The formatter function is useful for formatting a chart data value. This function will only have an effect if the default content function is being used, and a custom one is not provided. The default formatter will default to d3.format(",") 

```
// Example Usage

var dc = require('qd-components');

var myFooChart = dc.somechart;

dc.toolTipsify(myFooChart, {position: 'n', offset: [5, 0], content: contentFunc})
 
```

## Todo

|Component            | Implemented | Demo | Unit Tests | Documented | Assigned    | Priority |
|---------------------|:-----------:|:----:|:----------:|:----------:|-------------|----------|
| filterBuilder       | ✔           | ✔    | partial    | ✔          | jackcompton | Hot      |
| dynaTableComponent  | ✔           | ✔    |            | ✔          | tehandyb    | Hot      |
| audioDash           | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |
| sizeBoxify          |             |      |            | ✔          | jackcompton | Hot      |
| toolTipsify         | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |



