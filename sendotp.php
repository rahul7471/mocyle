<?php
session_start();
class SendOTP {
    private  $baseUrl = "https://sendotp.msg91.com/api";  
    private  $sendgrid_apikey = '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';   	
	private  $url = 'https://api.sendgrid.com/';
	private  $pass = $sendgrid_apikey;
	
    public function verifyByOTPMail($request){

		$emailId = $_POST['email'];
    	$data = array("countryCode" => $_POST['countryCode'], "mobileNumber" => $_POST['phone'], "getGeneratedOTP" => true);
        $data_string = json_encode($data);
        $ch = curl_init($this->baseUrl.'/generateOTP');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string),
            'application-Key: 2AQJzNu80qu8jhXgRnfoLBrmWdvTGlhX7aT8CXFhtAh6-IleyhL7ZVCIIGasO2_EfcDk-4YgwahdGaTQf9nRSOrhMLyo080Nb1IJ2ZMu1JtfQPwSHp4HqzlabTtSiYydgW1CwxjTYyeJTbWTnLBzRA=='
        ));
        $result = curl_exec($ch);
        curl_close($ch);
       
       $response = json_decode($result, true);
        if($response["status"] == "error"){
            $resp['error'] =  $response["response"];
            return json_encode($resp);

        }
        //save the OTP on your server
        if(!$response["response"]["oneTimePassword"]){
            $resp['response'] = $response["response"];
        }

	$otp = $response["response"]["oneTimePassword"]; 
	$template_id = '4397c20b-65c5-4328-9e77-9507fea579f3';
	$js = array(
	  'sub' => array(':name' => array('Elmer')),
	  'filters' => array('templates' => array('settings' => array('enable' => 1, 'template_id' => $template_id)))
	);
	
	
	$params = array(
	    'to'        => $emailId,
	    'toname'    => "Greetings customer",
	    'from'      => "mocyle-reply@mocyle.com",
	    'fromname'  => "mocyle",
	    'subject'   => "Verify Email",
	    'html'      => "your OTP is <b>".$otp."</b>",
	    'x-smtpapi' => json_encode($js)
	  );
	
	$request =  $url.'api/mail.send.json';
	
	// Generate curl request
	$session = curl_init($request);
	// Tell PHP not to use SSLv3 (instead opting for TLS)
	curl_setopt($session, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
	curl_setopt($session, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $sendgrid_apikey));
	// Tell curl to use HTTP POST
	curl_setopt ($session, CURLOPT_POST, true);
	// Tell curl that this is the body of the POST
	curl_setopt ($session, CURLOPT_POSTFIELDS, $params);
	// Tell curl not to return headers, but do return the response
	curl_setopt($session, CURLOPT_HEADER, false);
	curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
	
	$response = curl_exec($session);
	curl_close($session);
	return json_encode($resp);

    }
    
    
}
$sendOTPObject = new SendOTP();
if (isset($_REQUEST['action']) && !empty($_REQUEST['action'])) {
  echo $sendOTPObject->$_REQUEST['action']($_REQUEST);
} else {
  echo "Error Wrong api";
}
?>