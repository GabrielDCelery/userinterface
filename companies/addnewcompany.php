<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$company_name = $request->companyName;
$starting_date = $request->startingDate;
$ending_date = $request->endingDate;
$company_phone = $request->companyPhone;
$company_email = $request->companyEmail;
$invoice_number = $request->invoiceNumber;
$service_provider = $request->serviceProvider;
$transfer_date = $request->transferDate;
$invoice_date = $request->invoiceDate;
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

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

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

$q2 .= ') VALUES(:cid, :sd, :ed, :cp, :ce, :in, :sp, :td, :id, :pm, :an, :posn, :posl, :ca, :cri, :cti, :pnu, :ps, :pna, :pa, :mn, :ms, :mi, :mmn, :ma, :dh, :dha)';

$statement2 = $pdo->prepare($q2);
$statement2->execute(array(
	'cid' => $company_id,
	'sd' => $starting_date,
	'ed' => $ending_date,
	'cp' => $company_phone,
	'ce' => $company_email,
	'in' => $invoice_number,
	'sp' => $service_provider,
	'td' => $transfer_date,
	'id' => $invoice_date,
	'pm' => $payment_method,
	'an' => $account_number,
	'posn' => $price_of_serv_num,
	'posl' => $price_of_serv_let,
	'ca' => $company_address,
	'cri' => $company_register_id,
	'cti' => $company_tax_id,
	'pnu' => $postal_number,
	'ps' => $postal_service,
	'pna' => $postal_name,
	'pa' => $postal_address,
	'mn' => $manager_name,
	'ms' => $manager_status,
	'mi' => $manager_id,
	'mmn' => $manager_mother_name,
	'ma' => $manager_address,
	'dh' => $document_holder,
	'dha' => $document_holder_address
));

echo($company_id);

?>