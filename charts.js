function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray1 = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result1 = resultArray1[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_result = result1.otu_ids;
    var otu_labels_result = result1.otu_labels;
    var sample_values_result = result1.sample_values;
    var wash =0;
    var wash = metadata[0].wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = 1;
    

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      y: otu_ids_result.slice(0, 10).map(otuID => "OTU".concat(String(otuID))).reverse(),
      x: sample_values_result.slice(0,10).reverse(),
      text: otu_labels_result.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"

    }

    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     width: 400, height: 360, margin: { t: 0, b: 0 }  
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout );
  

// *** Bar and Bubble charts ***//

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
       {
        x: otu_ids_result,
        y: sample_values_result,
        text: otu_labels_result,
        mode: 'markers',
        marker: {
          size: sample_values_result.map(dt => dt*0.5),
          color : otu_ids_result,
        }    
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
    
      xaxis : {title: "OTU ID"},

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

// ** gaugeData **//
    var gaugeData = [
     {
      value: wash,
      domain:{x:[0,1], y:[0,1]},
      title: { text: "Belly Button Washing Frequency <br><sup> Scrubs per week </sup>"},
      
		type: "indicator",
		mode: "gauge+number",
    gauge: {
      bar: {color: 'black'},
      axis: {range: [0,10]},
      steps: [
        {range: [0, 2], color: "red"},
        {range: [2, 4], color: "orange"},
        { range: [4, 6], color: "yellow"},
        {range: [6, 8], color: "lightgreen"},
        {range: [8, 10], color:"darkgreen"},
        

      ],
      }}
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400, height: 360, margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  });
}

