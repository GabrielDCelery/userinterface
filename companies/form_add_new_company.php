<?php

require("../settings.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$company_name = $request->companyName;
$starting_date = $request->startingDate;
$ending_date = $request->endingDate;
if(!is_null($starting_date)){
	$starting_date = strtotime($starting_date);
	$starting_date = date('Y-m-d', $starting_date);
}
if(!is_null($ending_date)){
	$ending_date = strtotime($ending_date);
	$ending_date = date('Y-m-d', $ending_date);
}
$company_phone = $request->companyPhone;
$company_email = $request->companyEmail;
$invoice_number = $request->invoiceNumber;
$service_provider = $request->serviceProvider;
$transfer_date = $request->transferDate;
$invoice_date = $request->invoiceDate;
if(!is_null($transfer_date)){
	$transfer_date = strtotime($transfer_date);
	$transfer_date = date('Y-m-d', $transfer_date);
}
if(!is_null($invoice_date)){
	$invoice_date = strtotime($invoice_date);
	$invoice_date = date('Y-m-d', $invoice_date);
}
$payment_method = $request->paymentMethod;
$account_number = $request->accountNumber;
$price_of_serv_num = $request->priceOfServNum;
$price_of_serv_let = $request->priceOfServLet;
$company_address = $request->companyAddress;
$company_register_id = $request->companyRegisterId;
$company_tax_id = $request->companyTaxId;
$postal_number = $request->postalNumber;

if($request->postalService == "yes"){
	$postal_service = 1;
} else {
	$postal_service = 0;
}

$postal_name = $request->postalName;
$postal_address = $request->postalAddress;
$manager_name = $request->managerName;
$manager_status = $request->managerStatus;
$manager_id = $request->managerId;
$manager_mother_name = $request->managerMotherName;
$manager_address = $request->managerAddress;
$document_holder = $request->documentHolder;
$document_holder_address = $request->documentHolderAddress;

$statement1 = $pdo->prepare('INSERT INTO companies(company_name, contract_status) VALUES(:cname, :cstatus)');
$statement1->execute(array(
	'cname' => $company_name,
	'cstatus' => 1

));

$q1 = 'SELECT id FROM companies WHERE companies.company_name = "' . $company_name . '"';
$result = $pdo->query($q1);
$rows = $result->fetchAll(PDO::FETCH_ASSOC);

$company_id = $rows[0]["id"];

$q2 = 'INSERT INTO companies_detailed(';
$q2 .= 'company_id, ';
$q2 .= 'starting_date, ';
$q2 .= 'ending_date, ';
$q2 .= 'company_phone, ';
$q2 .= 'company_email, ';
$q2 .= 'invoice_number, ';
$q2 .= 'service_provider, ';

$q2 .= 'transfer_date, ';
$q2 .= 'invoice_date, ';
$q2 .= 'payment_method, ';
$q2 .= 'account_number, ';


$q2 .= 'price_of_serv_num, ';
$q2 .= 'price_of_serv_let, ';
$q2 .= 'company_address, ';
$q2 .= 'company_register_id, ';
$q2 .= 'company_tax_id, ';
$q2 .= 'postal_number, ';
$q2 .= 'postal_service, ';
$q2 .= 'postal_name, ';
$q2 .= 'postal_address, ';
$q2 .= 'manager_name, ';
$q2 .= 'manager_status, ';
$q2 .= 'manager_id, ';
$q2 .= 'manager_mother_name, ';
$q2 .= 'manager_address, ';
$q2 .= 'document_holder, ';
$q2 .= 'document_holder_address ';

$q2 .= ') VALUES(:company_id,
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

$statement2 = $pdo->prepare($q2);
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

echo("Company successfully added to database");

?>