$(function(){
    $('#mapdiv').click(function(e) {
        //alert(e.pageX+ ' , ' + e.pageY);
        if($("#popup").attr("display") == "block")
            $("#popup").attr("display","none");
    });
});

var emptyMap = {
    "title": "Empty Map",
    "version": "1.0.0",
    "features": [
        {

        }
    ]
};

var highest_map_level = 0;
var lowest_map_level = 2;
var current_map_level = 0;

var my_data = [{"hc-key": "ca-ab","name":"Alberta","value": 1},{"hc-key": "ca-bc","name":"British Columbia","value": 2}, {"hc-key": "ca-mb","name":"Manitoba","value":3}, {"hc-key": "ca-nb","name":"New Brunswick","value": 4}, {"hc-key": "ca-nl","name":"Newfoundland and Labrador","value": 5}, {"hc-key": "ca-ns","name":"Nova Scotia","value": 6}, {"hc-key": "ca-nt","name":"Northwest Territories","value": 7}, {"hc-key": "ca-nu","name":"Nunavut","value": 8}, {"hc-key": "ca-on","name":"Ontario","value": 9}, {"hc-key": "ca-pe","name":"Prince Edward Island","value": 10}, {"hc-key": "ca-qc","name":"Quebec","value": 11}, {"hc-key": "ca-sk","name":"Saskatchewan","value": 12}, {"hc-key": "ca-yt","name":"Yukon","value": 13}];

var Highmaps = null;

function selectMap(){
    Highmaps = Highcharts.maps[$("#mapselector").val()];
    if ($("#mapselector").val() == "countries/ca/ca-all")
        loadMapData(my_data);
    else
        loadMapData([]);
}

function zoomPoint(selectedPoint){
    $("#mapselector").val(selectedPoint);
    $("#mapselector").change();
}

function loadMapData(data){
    $("#region_list").html("");
    for(var i = 0; i < Highmaps.features.length; i++){
        var el = Highmaps.features[i];
        $("#region_list").append($("<option></option>").attr("value",el.properties["hc-key"]).text(el.properties.name));
    }

    $("#selected_region").html("");

    // Initiate the chart
    $('#mapdiv').highcharts('Map', {
        title : {
            text : 'Highmaps map selector'
        },

        /*subtitle : {
         text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-all.js">Canada</a>'
         },*/

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        tooltip: {
            formatter: function () {
                return 'Area Name: ' + this.point.name + '<br>' + 'Value: ' + this.point.value;
            }
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function (e) {
                            //zoomPoint("countries/ca/" + this["hc-key"] + "-all");
                            var posX = $(this).position().left,posY = $(this).position().top;
                            alert( (e.pageX - posX) + ' , ' + (e.pageY - posY));
                        }
                    }
                }
            }
        },
        series : [{
            data : data,
            mapData: Highmaps,
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
}

function showSelectedLocation(){
    var data = [{}];
    data[0]["hc-key"] = $("#region_list").find(':selected').val();
    data[0].value = Math.round(Math.random() * 1000);
    data[0].color = "#abcdef";
    $('#mapdiv').highcharts().series[0].setData(data);
}

function addRegion(){
    var txt = $("#region_list").find(':selected').text();
    var val = $("#region_list").find(':selected').val();
    $("#selected_region").append($("<option></option>").attr("value",val).text(txt));

    var data = [];

    $("#selected_region option").each(function(i){
        if($(this).val() != "--") {
            data[i] = {};
            data[i]["hc-key"] = $(this).val();
            data[i].value = Math.round(Math.random() * 1000);
            data[i].color = "#abcdef";
            data[i].selectAreaName = "Random Name " + Math.round(Math.random() * 1000);
        }
    });

    $('#mapdiv').highcharts().series[0].setData(data);
}

function removeRegion(){
    $("#selected_region option:selected").remove();

    var data = [];
    $("#selected_region option").each(function(i){
        data[i] = {};
        data[i]["hc-key"] = $(this).val();
        data[i].value = Math.round(Math.random() * 1000);
        data[i].color = "#abcdef";
        data[i].selectAreaName = "Random Name " + Math.round(Math.random() * 1000);
    });

    $('#mapdiv').highcharts().series[0].setData(data);
}

function addSeparator(){
    $("#selected_region").append($("<option></option>").attr("value","--").text("----------"));
}

function getSelectedRegionMapCoordinates(){
    var coordinates = [];
    $("#selected_region option").each(function(i){
        coordinates[i] = {};
        var hc_key = $(this).val();

        for(var i = 0; i < Highmaps.features.length; i++){
            if(Highmaps.features[i].properties["hc-key"] == hc_key)
                coordinates[i].coordinates = Highmaps.features[i].properties["coordinates"];
        }
    });
}

function showPopup(id,data,pos){

}