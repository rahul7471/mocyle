<?php
session_start();
class SendOTP {
    private  $baseUrl = "https://sendotp.msg91.com/api";   
    public function verifyBySendOtp($request)
    {
        $data = array("countryCode" => $request['countryCode'], "mobileNumber" => $request['mobileNumber'], "getGeneratedOTP" => true);
        $data_string = json_encode($data);
        $ch = curl_init($this->baseUrl.'/generateOTP');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string),
            'application-Key': '2AQJzNu80qu8jhXgRnfoLBrmWdvTGlhX7aT8CXFhtAh6-IleyhL7ZVCIIGasO2_EfcDk-4YgwahdGaTQf9nRSOrhMLyo080Nb1IJ2ZMu1JtfQPwSHp4HqzlabTtSiYydgW1CwxjTYyeJTbWTnLBzRA=='
        ));
        $result = curl_exec($ch);
        curl_close($ch);

        
       $response = json_decode($result, true);
        if($response["status"] == "error"){
            //customize this as per your framework
            $resp['message'] =  $response["response"]["code"];
            return json_encode($resp);
        }
        //save the OTP on your server
        if($response["response"]["oneTimePassword"]){
            $resp['otp'] = $response["response"]["oneTimePassword"];
            return json_encode($resp);
        }
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