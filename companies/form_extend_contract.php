<?php

require("../settings.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$company_name = $request->company_name;
$company_id = $request->company_id;
$starting_date = $request->starting_date;
$ending_date = $request->ending_date;
if(!is_null($starting_date)){
	$starting_date = strtotime($starting_date);
	$starting_date = date('Y-m-d', $starting_date);
}
if(!is_null($ending_date)){
	$ending_date = strtotime($ending_date);
	$ending_date = date('Y-m-d', $ending_date);
}
$company_phone = $request->company_phone;
$company_email = $request->company_email;
$invoice_number = $request->invoice_number;
$service_provider = $request->service_provider;
$transfer_date = $request->transfer_date;
$invoice_date = $request->invoice_date;
if(!is_null($transfer_date)){
	$transfer_date = strtotime($transfer_date);
	$transfer_date = date('Y-m-d', $transfer_date);
}
if(!is_null($invoice_date)){
	$invoice_date = strtotime($invoice_date);
	$invoice_date = date('Y-m-d', $invoice_date);
}
$payment_method = $request->payment_method;
$account_number = $request->account_number;
$price_of_serv_num = $request->price_of_serv_num;
$price_of_serv_let = $request->price_of_serv_let;
$company_address = $request->company_address;
$company_register_id = $request->company_register_id;
$company_tax_id = $request->company_tax_id;
$postal_number = $request->postal_number;

if($request->postal_service == "yes"){
	$postal_service = 1;
} else {
	$postal_service = 0;
}

$postal_name = $request->postal_name;
$postal_address = $request->postal_address;
$manager_name = $request->manager_name;
$manager_status = $request->manager_status;
$manager_id = $request->manager_id;
$manager_mother_name = $request->manager_mother_name;
$manager_address = $request->manager_address;
$document_holder = $request->document_holder;
$document_holder_address = $request->document_holder_address;

$query_string = 'INSERT INTO companies_detailed(';
$query_string .= 'company_id, ';
$query_string .= 'starting_date, ';
$query_string .= 'ending_date, ';
$query_string .= 'company_phone, ';
$query_string .= 'company_email, ';
$query_string .= 'invoice_number, ';
$query_string .= 'service_provider, ';

$query_string .= 'transfer_date, ';
$query_string .= 'invoice_date, ';
$query_string .= 'payment_method, ';
$query_string .= 'account_number, ';


$query_string .= 'price_of_serv_num, ';
$query_string .= 'price_of_serv_let, ';
$query_string .= 'company_address, ';
$query_string .= 'company_register_id, ';
$query_string .= 'company_tax_id, ';
$query_string .= 'postal_number, ';
$query_string .= 'postal_service, ';
$query_string .= 'postal_name, ';
$query_string .= 'postal_address, ';
$query_string .= 'manager_name, ';
$query_string .= 'manager_status, ';
$query_string .= 'manager_id, ';
$query_string .= 'manager_mother_name, ';
$query_string .= 'manager_address, ';
$query_string .= 'document_holder, ';
$query_string .= 'document_holder_address ';

$query_string .= ') VALUES(:company_id,
	:starting_date,
	:ending_date,
	:company_phone,
	:company_email,
	:invoice_number,
	:service_provider,
	:transfer_date,
	:invoice_date,
	:payment_method,
	:account_number,
	:price_of_serv_num,
	:price_of_serv_let,
	:company_address,
	:company_register_id,
	:company_tax_id,
	:postal_number,
	:postal_service,
	:postal_name,
	:postal_address,
	:manager_name,
	:manager_status,
	:manager_id,
	:manager_mother_name,
	:manager_address,
	:document_holder,
	:document_holder_address)';

$statement2 = $pdo->prepare($query_string);
$statement2->execute(array(
	'company_id' => $company_id,
	'starting_date' => $starting_date,
	'ending_date' => $ending_date,
	'company_phone' => $company_phone,
	'company_email' => $company_email,
	'invoice_number' => $invoice_number,
	'service_provider' => $service_provider,
	'transfer_date' => $transfer_date,
	'invoice_date' => $invoice_date,
	'payment_method' => $payment_method,
	'account_number' => $account_number,
	'price_of_serv_num' => $price_of_serv_num,
	'price_of_serv_let' => $price_of_serv_let,
	'company_address' => $company_address,
	'company_register_id' => $company_register_id,
	'company_tax_id' => $company_tax_id,
	'postal_number' => $postal_number,
	'postal_service' => $postal_service,
	'postal_name' => $postal_name,
	'postal_address' => $postal_address,
	'manager_name' => $manager_name,
	'manager_status' => $manager_status,
	'manager_id' => $manager_id,
	'manager_mother_name' => $manager_mother_name,
	'manager_address' => $manager_address,
	'document_holder' => $document_holder,
	'document_holder_address' => $document_holder_address
));

echo("Contract successfully extended!");

?>