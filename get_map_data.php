<?php
	require_once('include/h.inc.php');

	$db->query("SET NAMES 'utf8'");

	function dump2($v){
		echo "<pre>";
		var_dump($v);
		echo "</pre>";
	}

	$min_level  = 1;

	$requested_map_level = isset($_GET['requested_map_level']) ? $_GET['requested_map_level'] : $min_level;
	$hc_key = isset($_GET['map_key']) ? $_GET['map_key'] : 'ca';
	
	$res = $db->query("select * from map_data where hc_key = '$hc_key' and level = $requested_map_level");
	if($db->num_rows($res) > 0){
		$row = $db->fetch_object($res);
		$map_data = $row->map_data;
		
		$res = $db->query("select * from map_data where parent_hc_key = '" . $row->hc_key . "'");
		$data = array();
		while($row = $db->fetch_object($res)){
			$data[] = array("title"=>$row->title, "hc-key"=>$row->hc_key,"id"=>$row->id,"value"=>rand(1,100));
		}
		
		echo "{\"map_data\":$map_data,\"data\":" . json_encode($data) . "}";
		exit;
	}
	
	echo "";