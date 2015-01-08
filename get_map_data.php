<?php
	require_once('include/h.inc.php');

	$db->query("SET NAMES 'utf8'");

	if(isset($_GET['action'])) {
		if($_GET['action'] == "go_up"){
			echo moveUp($_GET['key']);
		}
		else
			echo drillDown($_GET['key']);
	}
	else
		echo initMap("ca");

	function initMap($key){
		global $db;
		$min_level  = 1;

		$res = $db->query("select * from map_data where hc_key = '$key'");
		if($db->num_rows($res) > 0){
			$row = $db->fetch_object($res);
			$map_data = $row->map_data;
			$map_key = $row->hc_key;
			$map_level = $row->level;

			$res = $db->query("select * from map_data where parent_hc_key = '" . $row->hc_key . "'");
			$data = array();
			while($row = $db->fetch_object($res)){
				$value = rand(1,100);
				$tooltip = "<div class=\"tooltip_container\"><h4 class=\"tooltip_header\">" . $row->title . "</h4>";
				$tooltip .= "<p class=\"tooltip_data\">$value</p></div>";
				$data[] = array("level"=>$row->level,"tooltip"=>$tooltip,"title"=>$row->title, "hc-key"=>$row->hc_key,"id"=>$row->id,"value"=>$value);
			}

			return "{\"map_level\":$map_level,\"map_key\":\"$map_key\",\"map_data\":$map_data,\"data\":" . json_encode($data) . "}";
		}

		return "";
	}

	function drillDown($key){
		global $db;

		$res = $db->query("select * from map_data where hc_key = '$key' and map_data is not null");
		if($db->num_rows($res) > 0){
			$row = $db->fetch_object($res);
			$map_data = $row->map_data;
			$map_key = $row->hc_key;
			$map_level = $row->level;

			$res = $db->query("select * from map_data where parent_hc_key = '$map_key'");
			$data = array();
			while($row = $db->fetch_object($res)){
				$value = rand(1,100);
				$tooltip = "<div class=\"tooltip_container\"><h4 class=\"tooltip_header\">" . $row->title . "</h4>";
				$tooltip .= "<p class=\"tooltip_data\">$value</p></div>";
				$data[] = array("tooltip"=>$tooltip,"title"=>$row->title, "hc-key"=>$row->hc_key,"id"=>$row->id,"value"=>$value);
			}

			return "{\"map_level\":$map_level,\"map_key\":\"$map_key\",\"map_data\":$map_data,\"data\":" . json_encode($data) . "}";
		}

		return "";
	}

	function moveUp($key){
		global $db;
		$res = $db->query("select parent_hc_key from map_data where hc_key = '$key' and parent_hc_key is not null");
		if($db->num_rows($res) > 0){
			$row = $db->fetch_object($res);
			$parent_key = $row->parent_hc_key;
			$res = $db->query("select * from map_data where hc_key = '$parent_key'");
			$row = $db->fetch_object($res);
			$map_data = $row->map_data;
			$map_key = $row->hc_key;
			$map_level = $row->level;
			$res = $db->query("select * from map_data where parent_hc_key = '" . $row->hc_key . "'");
			$data = array();
			while($row = $db->fetch_object($res)){
				$value = rand(1,100);
				$tooltip = "<div class=\"tooltip_container\"><h4 class=\"tooltip_header\">" . $row->title . "</h4>";
				$tooltip .= "<p class=\"tooltip_data\">$value</p></div>";
				$data[] = array("tooltip"=>$tooltip,"title"=>$row->title, "hc-key"=>$row->hc_key,"id"=>$row->id,"value"=>$value);
			}

			return "{\"map_level\":$map_level,\"map_key\":\"$map_key\",\"map_data\":$map_data,\"data\":" . json_encode($data) . "}";
		}
		return "";
	}

	function dump2($v){
		echo "<pre>";
		var_dump($v);
		echo "</pre>";
	}