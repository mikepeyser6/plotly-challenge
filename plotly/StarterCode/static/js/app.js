d3.json("samples.json").then((imp) => {
    // assigns data to a variable
    var data = imp[0];
    // prints data to consol
    console.log(data);
    // seprates and stores samples and metadata
    var samples = data.samples;
    var metadata = data.metadata;
    // prints samples and metadata to consol
    console.log(samples);
    console.log(metadata);
    // creates variable for the panel that displays demographic info
    var demo = d3.select("#sample-metadata")
    // creates variable for select drop down
    var selecter = d3.select("select");
    // populates selecter with sample ids
    samples.forEach(element => {
        // attaches options
        var item = selecter.append("option")
        // fills options text and value with sample ids
        .text(element.id)
        .attr("value", element.id)
       
    });
    // creates variable that stores current selected id
    var selected = d3.select("#selDataset")
    // function that build bar and bubble chats, as well as displays demographic info
    function build_charts() {
        // variable stores current selected id
        var val = selecter.property("value");
        // prints selected id to consol
        console.log(val);
        // finds and displays demographic info based on selected id
        metadata.forEach(meta => {
            if(meta.id === Number(val)) {
                // empties panal
                demo.html("");
                // prints selected metadata to consol
                console.log(meta);
                // inserts metadate into display panal
                Object.entries(meta).forEach(([k,v]) => {
                    var demo_info = demo.append("p").text(`${k}: ${v}`);
                })
            }
        }) 
        // builds bar and bubble charts
        samples.forEach(sample => {
            // selects sample based on selected sample id
            if (sample.id === val){
                // maps required info to variables
                var values = sample.sample_values.map(x => x)
                var labels = sample.otu_ids.map(x => `OTU ${x}`)
                var ids = sample.otu_ids.map(x => x)
                var hovers = sample.otu_labels.map(x => x)
                // prints data from variables to consol
                console.log(values);
                console.log(labels);
                console.log(hovers);
                // creates bar plot traces
                var bar_trace = {
                    x: values.reverse(),
                    y: labels,
                    text: hovers,
                    type: "bar",
                    orientation: 'h'
                  };
                  
                  var bar_data = [bar_trace];
                  // creates bar plot layout
                  var bar_layout = {
                    title: "Bar Chart",
                    xaxis: { title: "OTU Values"},
                    yaxis: { title: "OTU IDS"}
                  };
                  // displays bar chart on webpage
                  Plotly.newPlot("bar", bar_data, bar_layout);
                  // creates bubble taces
                  var bubble_trace = {
                    x: ids,
                    y: values,
                    text: hovers,
                    mode: 'markers',
                    marker: {
                       color: ids,
                      size: values
                    }
                  };
                  
                  var bubble_data = [bubble_trace];
                  // creates bubble layout
                  var bubble_layout = {
                    xaxis: { title: "OTU IDS"},
                    showlegend: false,
                  };
                  // displays bubble chart on webpage
                  Plotly.newPlot('bubble', bubble_data, bubble_layout);
            }
        })
    }
    // build charts when page is loaded
    build_charts()
    // updates charts when selecter is changed
    selected.on("change", build_charts)
})