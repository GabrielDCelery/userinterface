<?php

/*****************************************************************************
DOWNLOADING COMPLETE FILE
*****************************************************************************/

$file = "contract.docx";

if (file_exists($file)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.basename($file).'"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');

    readfile($file);
}



?>