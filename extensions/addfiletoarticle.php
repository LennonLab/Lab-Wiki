<?php
if( !defined( 'MEDIAWIKI' ) )
die();


$wgHooks['ArticleAfterFetchContent'][] = 'addimage';
$wgHooks['ImagePageFindFile'][] = 'uploadchange';
function addimage(&$article, &$content)
{
	list($temp,$name) = split(":",$_GET['image']);
	if($name=="") return true;
	list($file,$extension) = split("\.",$name);
	if($extension=="png"||$extension=="jpg"||$extension=="jpeg"||$extension=="gif")
	{
		$temp1="\n\n[[image:".$name."]]";
	}
	else
	{
		$temp1="\n\n[[media:".$name."]]";
	}
	$content.=$temp1;

	return true;
}



function uploadchange($page, &$file, &$displayFile)
{
		
	$boxtext  = "Add File to a Page"; 
	$btext = "Submit";
	global $wgOut;
	global $wgScript;	
	$Action = htmlspecialchars( $wgScript );		
	



$temp2=<<<ENDFORM

<script type="text/javascript">
function clearText(thefield){
if (thefield.defaultValue==thefield.value)
thefield.value = ""
} 
function addText(thefield){
	if (thefield.value=="")
	thefield.value = thefield.defaultValue 
}
</script>
<table border="0" style="position:relative; top:35px;" align="right" width="423" cellspacing="0" cellpadding="0">
<tr>
<td width="100%" align="right" bgcolor="">
<form name="createbox" action="{$Action}" method="get" class="createbox">
	<input type='hidden' name="image" value="{$page->getTitle()}">
	<input type='hidden' name="action" value="edit">
	<input class="createboxInput" name="title" type="text" value="{$boxtext}" size="30" style="color:#666;" onfocus="clearText(this);" onblur="addText(this);"/>	
	<input type='submit' name="create" class="createboxButton" value="{$btext}"/>	
</form>
</td>
</tr>
</table>

ENDFORM;
$wgOut->addHTML($temp2);
	return true;
}
?>
