<?php 
require_once './db.php';
class Admin { 

    public function login($request)
    {
  session_start();
    $id = $_POST['id'];
    $pass = $_POST['pass'];
      global $mysqli;
    $query = "SELECT * FROM `admin` WHERE `adminid`= '$id' AND `password`= '$pass'";
    
    $result = $mysqli->query($query) or die($mysqli->error.__LINE__);

	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$user[] = $row;
		}
		$_SESSION['user'] = $id;			
	}
	else {
		$user['fail'] = 'login failed';
		
	}
       return json_encode($user);
    }
    public function logout($request)
    {	
    	if(isset($_SESSION['user'])){
    		if($_SESSION['user']==$_POST['id']){
    			$resp['success'] = 'successfully logged out';
    		}
    	}
    	else{
    		$resp['fail'] = 'you are not logged in';
    	}
    	$_SESSION['user'] = '';
	return json_encode($resp);
    }
   public function allBookings($request)
    {
 	  global $mysqli;
	$query="SELECT * FROM  `CustomerMaster` ORDER BY id DESC";
	$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

	$arr = array();
	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$arr[] = $row;	
		}
	}


	return json_encode($arr);

    
    }
    public function quickbooking($request)
    {
      global $mysqli;
	$query="SELECT * FROM  `CustomerMaster` WHERE `pickuptime` = CURDATE() OR `service`='quick' ORDER BY id DESC";
	$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

	$arr = array();
	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$arr[] = $row;	
		}
	}

	return json_encode($arr);

    
    }
    public function addAdmin($request)
    {
     $name = $_POST['name'];
     $pass = $_POST['pass'];
     $level =$_POST['level'];

       global $mysqli;
      $query="INSERT INTO `admin`(`name`, `password`, `level`) VALUES ('$name','$pass','$level')";
  $result = $mysqli->query($query) or die($mysqli->error.__LINE__);

  if($mysqli->affected_rows >0){

   $result = $mysqli->insert_id;
  }


echo $json_response = json_encode($result);


    }
    public function changePass($request)
    {

      $adminid = $_POST['adminid'];
      $newpass = $_POST['pass'];

       global $mysqli;
      $query="UPDATE `admin` SET `password` = '$newpass' WHERE `adminid`='$adminid'";
  $result = $mysqli->query($query) or die($mysqli->error.__LINE__);

    echo $json_response = json_encode($result);

    }
    


}
$admin = new Admin();
if (isset($_REQUEST['action']) && !empty($_REQUEST['action'])) {
  echo $admin->$_REQUEST['action']($_REQUEST);
} else {
  echo "Wrong action taken";
}

?>