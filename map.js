$(function(){
});

var emptyMap = {
    "title": "Empty Map",
    "version": "1.0.0",
    "features": [
        {

        }
    ]
};

var Highmaps = null;
function selectMap(){
    Highmaps = Highcharts.maps[$("#mapselector").val()];
    loadMapData([]);
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
                format: '{point.selectAreaName}'
            },
            point:{
                events:{
                    click: function(){

                    }
                }
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