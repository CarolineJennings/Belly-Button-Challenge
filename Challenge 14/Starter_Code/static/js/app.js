// Define url for data fetch
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function for dropdown menu 
function dropdown_menu(){
  // Fetch data 
  d3.json(url).then(function(samples) {
    let selector = d3.select("#selDataset");
    let sampleNames = samples.names;
      
    // iterate through each sample name
    sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });
    // Update table and charts with the first sample's data
    table_metatable(sampleNames[0])
    bar_bubble_chart(sampleNames[0])



  })
}

// Initialise the dropdown
dropdown_menu()


// function for dropdown selection
function optionChanged(x){
  //update table and graphs from sample selected
  table_metatable(x)
  bar_bubble_chart(x)

}
// Update metadata table with selected sample's data
function table_metatable(x){
// fetch data
  d3.json(url).then(function(samples) {
    //select the metadata
    let selector = d3.select("#sample-metadata");
    //extract metadata for samples
    let sampleNames = samples.metadata;
    //filter metadata for selected sample
    let newArray = sampleNames.filter(number => number.id == x)[0];
    //clear existing
    selector.html('')
    //display metadata in table
    Object.entries(newArray).forEach(entry => {
      const [key, value] = entry;
      console.log(key, value);
      selector
      .append("h6")
      .text(`${key}: ${value}`)

    });
          
  })
}

// Update bar and bubble charts with selected sample's data
function bar_bubble_chart(x){
  //fetch data
  d3.json(url).then(function(samples_data) {
    //extract sample data for all
    let sampleNames = samples_data.samples;
    //filter sample data for selected
    let newArray = sampleNames.filter(number => number.id == x)[0];
    //get data for charts
    let otu_ids = newArray.otu_ids
    let sample_values = newArray.sample_values
    let otu_labels = newArray.otu_labels

    //bar trace
    let trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.map((index) => `otu ${index}`).slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Top 10 OTUs",
        type: "bar",
        orientation: "h"
      };
      
      // // Data array
    let bar_data = [trace1];
    
      // // Apply a title to the layout
    let bar_layout = {
        title: "Top 10 OTUs"
        
      };
      
      //plot
    Plotly.newPlot("bar", bar_data, bar_layout);

    // bubble chart trace
    var trace2 = {
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode: 'markers',
      marker: {
        color:otu_ids,
        size:sample_values
      }
    };
    
    //Data array
    var bubble_data = [trace2];
    
    //layout and title
    var bubble_layout = {
      title: 'Bubble Chart',
      showlegend: false,
     
    };
    
    //plot
    Plotly.newPlot('bubble', bubble_data, bubble_layout);

            
  })
}

