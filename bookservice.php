<?php 
require_once './db.php'; 
// The mysql database connection script
$phoneno = $_POST['phone'];
$lan= $_POST['lan'];
$lat= $_POST['lat'];

$maker = $_POST['maker'];
$modal = $_POST['modal'];
$pickup= $_POST['pickup'];
$address = $_POST['address'];
$phoneno = $_POST['phone'];
$mail = $_POST['mail'];
$lan= $_POST['lan'];
$lat= $_POST['lat'];
$name = $_POST['name'];
$bikedetail = $maker.' - '.$modal;
$status = "0";
$created = time();
if($_POST['tab']=='quick')
{
	$service = $_POST['tab'];
     	$query = "INSERT INTO `CustomerMaster`(`phone_no`,`mail`,`lat`,`lan`,`address`,`pickuptime`,`service`,`name`)  VALUES ('$phoneno','$mail','$lat','$lan','$address',STR_TO_DATE('$pickup','%d-%M-%Y'),'$service','$name')";

}
else
{
$query="INSERT INTO `CustomerMaster`(`phone_no`,`mail`,`lat`,`lan`,`address`,`bike_detail`,`pickuptime`,`name`)  VALUES ('$phoneno','$mail', '$lat','$lan','$address','$bikedetail',STR_TO_DATE('$pickup','%d-%M-%Y'),
'$name')";
}
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$result = $mysqli->affected_rows;

echo $json_response = json_encode($result);

?>