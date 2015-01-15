/**
 * Created by Mahmud on 02/01/2015.
 */

var current_map_level = 1;
var min_map_level = 1;
var max_map_level = 2;
var clicked_point = null;
var map_key = "";
var clicked_point_key = "";
var clicked_point_level = 0;
var my_data = null;
var map_data = null;
var clicked_point_obj = null;
var server_script_url = "http://opi.oliverslm.ca/onlinetesting/get_map_data.php";

function getDataFromServer(current_map_level, hc_key){

    $.ajax({
        url: server_script_url + "?current_map_level="+current_map_level+"&map_key="+hc_key,
        async : false,
        dataType: "json",
        success: function(data){
            if(data != "") {
                var m_data = data;
                my_data = m_data.data;
                map_data = m_data.map_data;
                loadMapData(map_data, my_data);
                current_map_level = m_data.map_level;
                map_key = m_data.map_key;
            }
        }
    });
}

function initParams(){

}

function hidePopup(){
    $("#point_menu_div").hide();
}

function createPopupMenu(){
    $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("View Detail").addClass("view_detail"));
    $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("Drill Down").addClass("go_down"));
    $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("Go Up").addClass("go_up"));

    $(".go_up").click(function(e){
        goUp(e);
    });

    $(".go_down").click(function(e){
        drillDown(e);
    });

    $(".view_detail").click(function(e){
        hidePopup();
        alert("id : " + clicked_point + " > Loading detail");
    });

    if(current_map_level <= min_map_level)
        $(".go_up").hide();

    if(current_map_level >= max_map_level)
        $(".go_down").hide();
}

function updatePopupMenu(){
    if(current_map_level <= min_map_level)
        $(".go_up").hide();
    else
        $(".go_up").show();

    if(current_map_level >= max_map_level)
        $(".go_down").hide();
    else
        $(".go_down").show();
}

function goUp(e){
    e.preventDefault();
    hidePopup();

    $.ajax({
        url: server_script_url + "?action=go_up&current_map_level="+current_map_level+"&key="+map_key,
        async : false,
        dataType: "json",
        success: function(data){
            if(data != "") {
                var m_data = data;
                my_data = m_data.data;
                map_data = m_data.map_data;
                loadMapData(map_data, my_data);
                current_map_level = m_data.map_level;
                map_key = m_data.map_key;
                updatePopupMenu();
            }
        }
    });
}

function drillDown(e){
    e.preventDefault();
    hidePopup();

    $.ajax({
        url: server_script_url + "?action=go_down&current_map_level="+current_map_level+"&key="+clicked_point_key,
        async : false,
        dataType: "json",
        success: function(data){
            if(data != "") {
                var m_data = data;
                my_data = m_data.data;
                map_data = m_data.map_data;
                loadMapData(map_data, my_data);
                current_map_level = m_data.map_level;
                map_key = m_data.map_key;
                updatePopupMenu();
            }
        }
    });
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
            backgroundColor: null,
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            formatter: function () {
                return this.point.tooltip;
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
                        clicked_point = this.id;
                        clicked_point_key = this["hc-key"];
                        clicked_point_level = this.level;
                        clicked_point_obj = this;
                        $("#point_menu_div").css("display","none");
                        $("#point_menu_div").css("display","block").css("left",e.clientX + "px").css("top",e.clientY+"px");
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
});
