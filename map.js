$(function(){
    $('#mapdiv').click(function(e) {
        if($("#popup").attr("display") == "block")
            $("#popup").attr("display","none");
    });
});

var emptyMap = {
    "title": "Canada",
    "version": "1.1.0",
    "type": "FeatureCollection",
    "copyright": "Copyright (c) 2014 Highsoft AS, Based on data from Natural Earth",
    "copyrightShort": "Natural Earth",
    "copyrightUrl": "http://www.naturalearthdata.com",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:EPSG:102002"
        }
    },
    "hc-transform": {
        "default": {
            "rotation": -0.0872664625997,
            "crs": "+proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
            "scale": 0.000128658751263,
            "jsonres": 15.5,
            "jsonmarginX": -999,
            "jsonmarginY": 9851.0,
            "xoffset": -2521511.95594,
            "yoffset": 4974352.42937
        }
    },
    "features": []
};

var feature = {
    "type": "",
    "id": "",
    "properties": {
        "hc-middle-x": 0.52,
        "hc-middle-y": 0.50,
        "name" : "",
        "hc-key": ""
    },
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": []
    }
};

var area_info = [];
var highest_map_level = 0;
var lowest_map_level = 2;
var current_map_level = 0;
var max_array_level = 0;
var map_generator_pressed = false;

var my_data = [{"hc-key": "ca-ab","name":"Alberta","value": 1},{"hc-key": "ca-bc","name":"British Columbia","value": 2}, {"hc-key": "ca-mb","name":"Manitoba","value":3}, {"hc-key": "ca-nb","name":"New Brunswick","value": 4}, {"hc-key": "ca-nl","name":"Newfoundland and Labrador","value": 5}, {"hc-key": "ca-ns","name":"Nova Scotia","value": 6}, {"hc-key": "ca-nt","name":"Northwest Territories","value": 7}, {"hc-key": "ca-nu","name":"Nunavut","value": 8}, {"hc-key": "ca-on","name":"Ontario","value": 9}, {"hc-key": "ca-pe","name":"Prince Edward Island","value": 10}, {"hc-key": "ca-qc","name":"Quebec","value": 11}, {"hc-key": "ca-sk","name":"Saskatchewan","value": 12}, {"hc-key": "ca-yt","name":"Yukon","value": 13}];

var my_custom_data = [{"my-hc-key": "ca-pr","name":"Prairies","value": 1},{"my-hc-key": "ca-wc","name":"Western Canada","value": 2}, {"my-hc-key": "ca-ac","name":"Atlantic Canada","value": 4}, {"my-hc-key": "ca-nc","name":"Northern Canada","value": 7}, {"my-hc-key": "ca-on","name":"Ontario","value": 9}, {"my-hc-key": "ca-qc","name":"Quebec","value": 11}];

var pr_data = [{"my-hc-key": "ca-pr","name":"Prairies","value": 100}];
var wcpron_data = [{"my-hc-key": "ca-wc","name":"Western Canada","value": 56},{"my-hc-key": "ca-pr","name":"Prairies","value": 81},{"my-hc-key": "ca-on","name":"Ontario","value": 120}];

//my_data = [];

var Highmaps = null;

function selectMap(){
    Highmaps = Highcharts.maps[$("#mapselector").val()];
    if ($("#mapselector").val() == "countries/ca/ca-all")
        loadMapData(my_data,"hc-key");
    else if ($("#mapselector").val() == "countries/ca/ca-custom-all")
        loadMapData(my_custom_data,"my-hc-key");
    else if ($("#mapselector").val() == "countries/ca/ca-pr-all")
        loadMapData(pr_data,"my-hc-key");
    else if ($("#mapselector").val() == "countries/ca/ca-wcpron-all")
        loadMapData(wcpron_data,"my-hc-key");
    else
        loadMapData([],"hc-key");
}

function zoomPoint(selectedPoint){
    $("#mapselector").val(selectedPoint);
    $("#mapselector").change();
}

function loadMapData(data,key){
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
            joinBy: key,
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

function addSeparator(e){
    $("#selected_region").append($("<option></option>").attr("value","--").text("----------"));
    $("#input_vals").css("display","block").css("left",e.clientX + "px").css("top",e.clientY+"px");
    $("#area_name").focus();
}


function getLevel(my_arr){
    var l = 0;
    if(Object.prototype.toString.call( my_arr ) === '[object Array]'){
        for(var i=0; i<my_arr.length; i++)
            l = 1 + getLevel(my_arr[i]);
    }
    else
        return 0;
    if(l > max_array_level)
        max_array_level = l;
    else
        max_array_level = 0;
    return max_array_level;
}

function generateMap2(){
    var this_feature = JSON.parse(JSON.stringify(feature));
    var coordinates = "";
    var areas_indices = [];
    var levels = [];
    var j = 0;
    var output_coordinates = [];
    var area_number = 0;

    if($("#selected_region option").last().val() != "--"){
        var x = $("#genBtn").position();
        $("#input_vals").css("display","block").css("left",x.left + "px").css("top",x.top+"px");
        $("#area_name").focus();
        map_generator_pressed = true;
        $("#selected_region").append($("<option></option>").attr("value","--").text("----------"));
        return;
    }

    if($("#selected_region option").length > 0) {
        $("#selected_region option").each(function (i) {
            var hc_key = $(this).val();
            if (hc_key == "--") {
                output_coordinates = [];
                var idx = 0;
                for(var k=0; k<areas_indices.length; k++){
                    if(Highmaps.features[areas_indices[k]].geometry.type=="Polygon"){
                        output_coordinates[idx] = Highmaps.features[areas_indices[k]].geometry.coordinates;
                        idx++;
                    }
                    else {
                        for (var l = 0; l < Highmaps.features[areas_indices[k]].geometry.coordinates.length; l++) {
                            output_coordinates[idx] = Highmaps.features[areas_indices[k]].geometry.coordinates[l];
                            idx++;
                        }
                    }
                }

                this_feature.geometry.coordinates = output_coordinates;
                this_feature.properties.name = area_info[area_number].name;
                this_feature.properties["hc-key"] = area_info[area_number].key;
                area_number++;
                emptyMap["features"].push(this_feature);
                this_feature = JSON.parse(JSON.stringify(feature));
                areas_indices = [];
                j = 0;
            }
            else{
                for (var i = 0; i < Highmaps.features.length; i++) {
                    if (Highmaps.features[i].properties["hc-key"] == hc_key) {
                        areas_indices[j] = i;
                        j++;
                    }
                }
            }
        });
        if(areas_indices.length > 0){
            output_coordinates = [];
            var idx = 0;
            for(var k=0; k<areas_indices.length; k++){
                if(Highmaps.features[areas_indices[k]].geometry.type=="Polygon"){
                    output_coordinates[idx] = Highmaps.features[areas_indices[k]].geometry.coordinates;
                    idx++;
                }
                else {
                    for (var l = 0; l < Highmaps.features[areas_indices[k]].geometry.coordinates.length; l++) {
                        output_coordinates[idx] = Highmaps.features[areas_indices[k]].geometry.coordinates[l];
                        idx++;
                    }
                }
            }

            this_feature.geometry.coordinates = output_coordinates;
            this_feature.properties.name = area_info[area_number].name;
            this_feature.properties["hc-key"] = area_info[area_number].key;
            emptyMap["features"].push(this_feature);
        }
    }

    $("#output").text(JSON.stringify(emptyMap));
}

function hideAreaInfo(){
    var name = $("#area_name").val().trim();
    var key = $("#area_key").val().trim();
    if(name == '' || key == ''){
        alert("Both fields are mandatory");
    }
    else{
        area_info.push({"name": name, "key": key});
        $("#area_name").val("");
        $("#area_key").val("");
        $("#input_vals").hide();
        if(map_generator_pressed)
            generateMap2();
    }
}