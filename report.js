/**
 * Created by Mahmud on 02/01/2015.
 */

var current_map_level = 1;
var min_map_level = 1;
var max_map_level = 2;
var clicked_point = null;

/*var my_data = [{"hc-key": "ca-ab","name":"Alberta","value": 1,"id": 1},{"hc-key": "ca-bc","name":"British Columbia","value": 2,"id": 2}, {"hc-key": "ca-mb","name":"Manitoba","value":3,"id": 3}, {"hc-key": "ca-nb","name":"New Brunswick","value": 4,"id": 4}, {"hc-key": "ca-nl","name":"Newfoundland and Labrador","value": 5,"id": 5}, {"hc-key": "ca-ns","name":"Nova Scotia","value": 6,"id": 6}, {"hc-key": "ca-nt","name":"Northwest Territories","value": 7,"id": 7}, {"hc-key": "ca-nu","name":"Nunavut","value": 8,"id": 8}, {"hc-key": "ca-on","name":"Ontario","value": 9,"id": 9}, {"hc-key": "ca-pe","name":"Prince Edward Island","value": 10,"id": 10}, {"hc-key": "ca-qc","name":"Quebec","value": 11,"id": 11}, {"hc-key": "ca-sk","name":"Saskatchewan","value": 12,"id": 12}, {"hc-key": "ca-yt","name":"Yukon","value": 13,"id": 13}];

var map_data = Highcharts.maps["countries/ca/ca-all"];*/

var my_data = null;
var map_data = null;

function showKeys(obj){
    console.log(Object.keys(obj));
}

function getDataFromServer(current_map_level, hc_key){
    $.ajax({
        url: "http://opi.oliverslm.ca/onlinetesting/get_map_data.php?current_map_level="+current_map_level+"&map_key="+hc_key,
        async : false,
        dataType: "json",
        success: function(data){
            if(data != "") {
                var m_data = data;
                my_data = m_data.data;
                map_data = m_data.map_data;
                loadMapData(map_data, my_data);
            }
        }
    });
}

function hidePopup(){
    $("#point_menu_div").hide();
}

function createPopupMenu(){
    $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("View Detail").addClass("view_detail"));
    if(current_map_level > min_map_level)
        $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("Go Up").addClass("go_up"));
    if(current_map_level < max_map_level)
        $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("Drill Down").addClass("go_down"));
}

function loadMapData(map_data, data){
    $('#report_map_div').highcharts('Map', {
        title : {
            text : map_data.title
        },
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
                return 'Area Name: ' + this.point.title + '<br>' + 'Value: ' + this.point.value;
            }
        },
        chart: {
            plotBackgroundColor: '#666666',
            events: {
                click: function (e) {
                    $("#point_menu_div").css("display","none");
                }
            }
        },
        series : [{
            data : data,
            mapData: map_data,
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
            },
            point: {
                events: {
                    click: function (e) {
                        $("#point_menu_div").css("display","none");
                        $("#point_menu_div").css("display","block").css("left",e.clientX + "px").css("top",e.clientY+"px");
                        clicked_point = this.id;
                    }
                }
            }
        }]
    });
}

$(function(){
    $("#close_link").click(function(){
        hidePopup();
        return false;
    });
    getDataFromServer(current_map_level,'ca');
    createPopupMenu();
    $(".go_up").click(function(e){
        hidePopup();
        alert("id : " + clicked_point + " > Going up");
    });
    $(".go_down").click(function(e){
        hidePopup();
        alert("id : " + clicked_point + " > Drilling down");
    });
    $(".view_detail").click(function(e){
        hidePopup();
        alert("id : " + clicked_point + " > Loading detail");
    });
});
