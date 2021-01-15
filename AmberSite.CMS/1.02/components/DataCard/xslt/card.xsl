<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" cdata-section-elements="FormElement FormAttrib" encoding="windows-1251"/>
<xsl:strip-space elements="*"/>

<!--********************************************************************************************************************************** -->
<xsl:template match="/">
		<xsl:apply-templates select="node()" mode="copy"/>
</xsl:template>
<!--********************************************************************************************************************************** -->
<xsl:template match="node()" mode="copy">
	<xsl:copy>
		<xsl:apply-templates select="node()|@*" mode="copy"/>
	</xsl:copy>
</xsl:template>
<!--********************************************************************************************************************************** -->
<xsl:template match="@*" mode="copy">
	<xsl:copy/>
</xsl:template>
<!--********************************************************************************************************************************** -->
<xsl:template match="options" mode="copy"/>
<!--********************************************************************************************************************************** --><xsl:template match="FormElement" mode="copy">
			<xsl:apply-templates select="." mode="type"/>
</xsl:template>
<!--********************************************************************************************************************************** --><xsl:template match="FormElementHtmlText" mode="copy">
	<xsl:if test="count(child::node())=0">&#160;</xsl:if> 
	<xsl:copy-of select="node()"/>
</xsl:template>
<!--********************************************************************************************************************************** --><xsl:template match="FormElement" mode="type">
	<div class="p">
	<xsl:attribute name="id">
		<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
	</xsl:attribute>
	<table class="card">
	      <tr>
	      		<td class="ctl"><img src="img/x.gif" width="5" height="1" alt=""/></td>
	      		<td class="ctm"><p><xsl:value-of select="@title"/><xsl:if test="not(@title)"><xsl:value-of select="@sys-name"/></xsl:if></p></td>
	      		<td class="ctm2">
	      			<xsl:if test="parent::node()/@type='collection' or @collection">
	      				<xsl:variable name="pid">
	      					<xsl:choose>
	      						<xsl:when test="@collection"><xsl:value-of select="@collection"/></xsl:when>
	      						<xsl:otherwise><xsl:value-of select="parent::node()/@id"/></xsl:otherwise>
						</xsl:choose>
	      				</xsl:variable>
	      				<img src="img/icon-delete.gif">
						<xsl:attribute name="onClick">
							javascript:callEvent('method=delete_collection_element#parent_id=<xsl:value-of select="$pid"/>#id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
	      				</img>
	      			</xsl:if>
	      		</td>
			<td class="ctr"><img src="img/x.gif" width="5" height="1" alt=""/>	</td>
		</tr>
		<tr>
			<td class="cml"></td>
			<td class="cmm" colspan="2"><div class="p"><xsl:apply-templates select="node()" mode="copy"/></div></td>
			<td class="cmr"></td>
		</tr>
		<tr>
			<td class="cbl"></td>
			<td class="cbm" colspan="2"></td>
			<td class="cbr"></td>
		</tr>
	</table>
	</div>
</xsl:template>
<!--********************************************************************************************************************************** --><xsl:template match="FormElement[@type='collection']" mode="type">
	<div class="p">
	<table class="card2">
		<tr>
			<td class="ctl"><img src="img/x.gif" width="5" height="1" alt=""/></td>
			<td class="ctm"><p><xsl:value-of select="@title"/><xsl:if test="not(@title)"><xsl:value-of select="@sys-name"/></xsl:if></p></td>
	      		<td class="ctm2">
	      			<xsl:if test="parent::node()/@type='collection' or @collection">
	      				<xsl:variable name="pid">
	      					<xsl:choose>
	      						<xsl:when test="@collection"><xsl:value-of select="@collection"/></xsl:when>
	      						<xsl:otherwise><xsl:value-of select="parent::node()/@id"/></xsl:otherwise>
						</xsl:choose>
	      				</xsl:variable>
	      				<img src="img/icon-delete.gif">
						<xsl:attribute name="onClick">
							javascript:callEvent('method=delete_collection_element#parent_id=<xsl:value-of select="$pid"/>#id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
	      				</img>
	      			</xsl:if>
	      		</td>
			<td class="ctr"><img src="img/x.gif" width="5" height="1" alt=""/></td>
		</tr>
		<tr>
			<td class="cml"></td>
			<td class="cmm"  colspan="2">
				<div class="p">
					<xsl:attribute name="id">
						<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
					</xsl:attribute>
					<xsl:apply-templates select="FormAttrib" mode="copy"/>

					<xsl:apply-templates select="FormElement" mode="collection"/>
					<input type="button" class="button">
						<xsl:attribute name="id"><xsl:text>cl_e</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
						<xsl:attribute name="onClick">
							javascript:callEvent('method=insert_collection_element#parent_id=<xsl:value-of select="@id"/>#type=last#title=<xsl:value-of select="options/@title"/>');
						</xsl:attribute>
						<xsl:attribute name="value">
							<xsl:value-of select="options/@title"/>
						</xsl:attribute>
					</input>
				</div>
			</td>
			<td class="cmr"></td>
		</tr>
		<tr>
			<td class="cbl"></td>
			<td class="cbm"  colspan="2"></td>
			<td class="cbr"></td>
		</tr>
	</table>
	</div>
</xsl:template>
<!--********************************************************************************************************************************** -->
<xsl:template match="node()" mode="collection">
		<input type="button" class="button">
			<xsl:attribute name="id"><xsl:text>cl_s</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="onClick">
				javascript:callEvent('method=insert_collection_element#parent_id=<xsl:value-of select="parent::node()/@id"/>#type=before#id=<xsl:value-of select="@id"/>#title=<xsl:value-of select="parent::node()/options/@title"/>');
			</xsl:attribute>
			<xsl:attribute name="value">
				<xsl:value-of select="parent::node()/options/@title"/>
			</xsl:attribute>
		</input>
		<xsl:apply-templates select="." mode="copy"/>
	</xsl:template>
<!--********************************************************************************************************************************** -->

<xsl:template match="FormElement[@type='plain-text']" mode="type">
	<div class="p">
	<xsl:attribute name="id">
		<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
	</xsl:attribute>
	<table class="card2">
		<tr>
			<td class="ctl"><img src="img/x.gif" width="5" height="1" alt=""/></td>
			<td class="ctm"><p><xsl:value-of select="@title"/><xsl:if test="not(@title)"><xsl:value-of select="@sys-name"/></xsl:if></p></td>
	      		<td class="ctm2">
	      			<xsl:if test="parent::node()/@type='collection' or @collection">
	      				<xsl:variable name="pid">
	      					<xsl:choose>
	      						<xsl:when test="@collection"><xsl:value-of select="@collection"/></xsl:when>
	      						<xsl:otherwise><xsl:value-of select="parent::node()/@id"/></xsl:otherwise>
						</xsl:choose>
	      				</xsl:variable>
	      				<img src="img/icon-delete.gif">
						<xsl:attribute name="onClick">
							javascript:callEvent('method=delete_collection_element#parent_id=<xsl:value-of select="$pid"/>#id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
	      				</img>
	      			</xsl:if>
	      		</td>
			<td class="ctr"><img src="img/x.gif" width="5" height="1" alt=""/></td>
		</tr>
		<tr>
			<td class="cml"></td>
			<td class="cmm" colspan="2">
				<div class="p">
					<xsl:apply-templates select="FormAttrib" mode="copy"/>
					<textarea rows="" cols="">
						<xsl:attribute name="onblur">
							javascript:callEvent('method=SaveCardElement#type=plain-text#card_type=e#xml_id=<xsl:value-of select="@id"/>#html_id=<xsl:value-of select="@id"/>'); 
						</xsl:attribute>
						<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
						<xsl:if test="not(node())">&#160;</xsl:if>
						<!-- <xsl:if test="node()"><xsl:copy-of select="node()"/></xsl:if> -->
						<!-- <xsl:apply-templates select="node()[name() != 'FormAttrib']" mode="copy"/> -->
						<xsl:apply-templates select="FormElementHtmlText" mode="copy"/>
					</textarea>

				</div>
			</td>
			<td class="cmr"></td>
		</tr>
		<tr>
			<td class="cbl"></td>
			<td class="cbm" colspan="2"></td>
			<td class="cbr"></td>
		</tr>
	</table>
	</div>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement[@type='html-text']" mode="type">
	<div class="p">
	<xsl:attribute name="id">
		<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
	</xsl:attribute>
	<table class="card2">
		<tr>
			<td class="ctl"><img src="img/x.gif" width="5" height="1" alt=""/></td>
			<td class="ctm"><p><xsl:value-of select="@title"/><xsl:if test="not(@title)"><xsl:value-of select="@sys-name"/></xsl:if></p></td>
	      		<td class="ctm2">
	      			<xsl:if test="parent::node()/@type='collection' or @collection">
	      				<xsl:variable name="pid">
	      					<xsl:choose>
	      						<xsl:when test="@collection"><xsl:value-of select="@collection"/></xsl:when>
	      						<xsl:otherwise><xsl:value-of select="parent::node()/@id"/></xsl:otherwise>
						</xsl:choose>
	      				</xsl:variable>
	      				<img src="img/icon-delete.gif">
						<xsl:attribute name="onClick">
							javascript:callEvent('method=delete_collection_element#parent_id=<xsl:value-of select="$pid"/>#id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
	      				</img>
	      			</xsl:if>
	      		</td>
			<td class="ctr"><img src="img/x.gif" width="5" height="1" alt=""/></td>
		</tr>
		<tr>
			<td class="cml"></td>
			<td class="cmm" colspan="2">
				<div class="p">
					<xsl:apply-templates select="FormAttrib" mode="copy"/>
					<xsl:element name="div">
						<xsl:attribute name="class"><xsl:text>html-text</xsl:text></xsl:attribute>
						<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
<!--						<xsl:if test="count(child::node()[name() != 'FormAttrib'])=0">&#160;</xsl:if> 
						<xsl:apply-templates select="node()[name() != 'FormAttrib']" mode="copy"/>-->
						<xsl:apply-templates select="FormElementHtmlText" mode="copy"/>
					</xsl:element>
					<input type="button" class="button" value="изменить">
						<xsl:attribute name="onclick">
							javascript:callEvent('method=get_wysiwig#id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
					</input>
				</div>
			</td>
			<td class="cmr"></td>
		</tr>
		<tr>
			<td class="cbl"></td>
			<td class="cbm" colspan="2"></td>
			<td class="cbr"></td>
		</tr>
	</table>
	</div>
	
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement[@type='time']" mode="type">
<!--		<xsl:apply-templates select="node()" mode="copy"/> -->
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>

		<xsl:variable name="tit" select="substring-after(@title,'@')"/>
		<xsl:variable name="title">
			<xsl:value-of select="FormAttrib[@sys-name=$tit]/node()"/> 
		</xsl:variable>
		<xsl:value-of select="$title"/>
		<xsl:if test="string-length($title)=0">
			<xsl:value-of select="@title"/> 
		</xsl:if>
		<xsl:if test="string-length($title)=0 and not(@title)">
			<xsl:value-of select="@sys-name"/> 
		</xsl:if>
		<xsl:text>:</xsl:text>
		<br/>
		<xsl:variable name="time"><xsl:value-of select="options/@input_attr"/></xsl:variable>
		<xsl:variable name="val">
			<xsl:value-of select="FormAttrib[@sys-name=$time]/node()"/> 
		</xsl:variable>
		<xsl:variable name="hh" select="substring-before($val,':')"/>
		<xsl:variable name="mm" select="substring-after($val,':')"/>
		<input type="text" class="stext">
			<xsl:attribute name="id"><xsl:text>hh</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="value">
				<xsl:value-of select="$hh"/>
			</xsl:attribute>
			<xsl:attribute name="onBlur">
				javascript:callEvent('method=SaveCardElement#type=time#card_type=e#in_attr=h#xml_id=<xsl:value-of select="@id"/>#html_id=hh<xsl:value-of select="@id"/>');
			</xsl:attribute>
		</input>:
		<input type="text" class="stext">
			<xsl:attribute name="id"><xsl:text>mm</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="value">
				<xsl:value-of select="$mm"/>
			</xsl:attribute>
			<xsl:attribute name="onBlur">
				javascript:callEvent('method=SaveCardElement#type=time#card_type=e#in_attr=m#xml_id=<xsl:value-of select="@id"/>#html_id=mm<xsl:value-of select="@id"/>');
			</xsl:attribute>
		</input>
	</div>

</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement[@type='link']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:variable name="tit" select="substring-after(@title,'@')"/>
		<xsl:variable name="title">
			<xsl:value-of select="FormAttrib[@sys-name=$tit]/node()"/> 
		</xsl:variable>
		<xsl:value-of select="$title"/>
		<xsl:if test="string-length($title)=0">
			<xsl:value-of select="@title"/> 
		</xsl:if>
		<xsl:if test="string-length($title)=0 and not(@title)">
			<xsl:value-of select="@sys-name"/> 
		</xsl:if>
		<xsl:text>:</xsl:text>
		<br/>
		<xsl:variable name="link_title_attr"><xsl:value-of select="options/@input_attr"/></xsl:variable>
		<xsl:variable name="link_title">
			<xsl:value-of select="FormAttrib[@sys-name=$link_title_attr]/node()"/> 
		</xsl:variable>
		
		<input type="text" class="text" disabled="disabled">
			<xsl:attribute name="id">
				<xsl:value-of select="@id"/>
			</xsl:attribute>
		</input>

		<img src="img/x.gif" alt="">
			<xsl:attribute name="onLoad">
				<xsl:text>javascript:callEvent('method=get_link_title#id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>#link_title=</xsl:text>
				<xsl:value-of select="$link_title"/>				
				<xsl:text>')</xsl:text>
			</xsl:attribute>
		</img>
		
		<input type="button" class="button" value="выбрать">
			<xsl:attribute name="onClick">
				<xsl:text>javascript:callEvent('method=get_linkdialog#id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>#choose_path=</xsl:text>
				<xsl:value-of select="@choose_path"/>
				<xsl:text>');</xsl:text>
			</xsl:attribute>
		</input>
		<input type="button" class="button" value="очистить">
			<xsl:attribute name="onClick">
				<xsl:text>javascript:callEvent('method=SaveCardElement#type=link#card_type=e#path=#xml_id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>#html_id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>'); document.getElementById('</xsl:text>
				<xsl:value-of select="@id"/>
   				<xsl:text>').value='';</xsl:text>
			</xsl:attribute>
		</input>
	</div>

<!--		<xsl:apply-templates select="node()" mode="copy"/> -->
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement[@type='image']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>

	<table class="card2">
		<tr>
			<td class="ctl"><img src="img/x.gif" width="5" height="1" alt=""/></td>
			<td class="ctm"><p><xsl:value-of select="@title"/><xsl:if test="not(@title)"><xsl:value-of select="@sys-name"/></xsl:if></p></td>
	      		<td class="ctm2">
	      			<xsl:if test="parent::node()/@type='collection' or @collection">
	      				<xsl:variable name="pid">
	      					<xsl:choose>
	      						<xsl:when test="@collection"><xsl:value-of select="@collection"/></xsl:when>
	      						<xsl:otherwise><xsl:value-of select="parent::node()/@id"/></xsl:otherwise>
						</xsl:choose>
	      				</xsl:variable>
	      				<img src="img/icon-delete.gif">
						<xsl:attribute name="onClick">
							javascript:callEvent('method=delete_collection_element#parent_id=<xsl:value-of select="$pid"/>#id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
	      				</img>
	      			</xsl:if>
	      		</td>
			<td class="ctr"><img src="img/x.gif" width="5" height="1" alt=""/></td>
		</tr>
		<tr>
		<td class="cml"></td>
		<td class="cmm" colspan="2">
			<div class="p">
				<div class="image">
					<table><tr><td>
					<img src="img/x.gif" awidth="160" aheight="100" alt="">
						<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
						<xsl:attribute name="onLoad">
							<xsl:text>javascript:callEvent('method=get_img_prev#id=</xsl:text>
							<xsl:value-of select="@id"/>
							<xsl:text>#src=</xsl:text>
							<xsl:value-of select="FormAttrib[@sys-name='src']/node()"/>				
							<xsl:text>')</xsl:text>
						</xsl:attribute>
					</img>
					</td></tr></table>
				</div>
				<div>
					<input type="button" class="button" value="добавить">
						<xsl:attribute name="onClick">
							<xsl:text>javascript:callEvent('method=get_upload_image_dialog#id=</xsl:text>
							<xsl:value-of select="@id"/>
							<xsl:text>');</xsl:text>
						</xsl:attribute>
					</input>
					<input type="button" class="button" value="Очистить">
						<xsl:attribute name="onClick">
							javascript:callEvent('method=SaveCardElement#type=image#card_type=e#in_attr=delete#xml_id=<xsl:value-of select="@id"/>#html_id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
					</input>
					&#160;просмотр&#160;
					<input type="checkbox" class="checkbox">
						<xsl:attribute name="id">check<xsl:value-of select="@id"/></xsl:attribute>
						<xsl:attribute name="onBlur">
							javascript:callEvent('method=SaveCardElement#type=image#card_type=e#in_attr=check#xml_id=<xsl:value-of select="@id"/>#html_id=check<xsl:value-of select="@id"/>');
						</xsl:attribute>
					</input>
				</div>
			</div>
		</td>
		<td class="cmr"></td>
		</tr>
		<tr>
			<td class="cbl"></td>
			<td class="cbm" colspan="2"></td>
			<td class="cbr"></td>
		</tr>
	</table>
	</div>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement[@type='file']" mode="type">
	<div class="p">
	<xsl:attribute name="id"><xsl:text>div</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
	<table class="card2">
		<tr>
			<td class="ctl"><img src="img/x.gif" width="5" height="1" alt=""/></td>
			<td class="ctm"><p><xsl:value-of select="@title"/><xsl:if test="not(@title)"><xsl:value-of select="@sys-name"/></xsl:if></p></td>
	      		<td class="ctm2">
	      			<xsl:if test="parent::node()/@type='collection' or @collection">
	      				<xsl:variable name="pid">
	      					<xsl:choose>
	      						<xsl:when test="@collection"><xsl:value-of select="@collection"/></xsl:when>
	      						<xsl:otherwise><xsl:value-of select="parent::node()/@id"/></xsl:otherwise>
						</xsl:choose>
	      				</xsl:variable>
	      				<img src="img/icon-delete.gif">
						<xsl:attribute name="onClick">
							javascript:callEvent('method=delete_collection_element#parent_id=<xsl:value-of select="$pid"/>#id=<xsl:value-of select="@id"/>');
						</xsl:attribute>
	      				</img>
	      			</xsl:if>
	      		</td>
			<td class="ctr"><img src="img/x.gif" width="5" height="1" alt=""/></td>
		</tr>
		<tr>
			<td class="cml"></td>
			<td class="cmm" colspan="2">
			<div class="p">
				<input type="text" class="text">
					<xsl:attribute name="id"><xsl:text>desc</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="value"><xsl:value-of select="FormAttrib[@sys-name='title']/node()"/></xsl:attribute>
					<xsl:attribute name="onBlur">
						javascript:callEvent('method=SaveCardElement#type=file#card_type=e#in_attr=desc#xml_id=<xsl:value-of select="@id"/>#html_id=desc<xsl:value-of select="@id"/>');
					</xsl:attribute>
				</input>
				<input type="text" class="text" disabled="disabled">
					<xsl:attribute name="id"><xsl:text>path</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="value"><xsl:value-of select="FormAttrib[@sys-name='path']/node()"/></xsl:attribute>
				</input>
				<input type="button" class="button" value="выбрать">
						<xsl:attribute name="onClick">
							<xsl:text>javascript:callEvent('method=get_upload_file_dialog#id=</xsl:text>
							<xsl:value-of select="@id"/>
							<xsl:text>');</xsl:text>
						</xsl:attribute>
				</input>
				<input type="button" class="button" value="очистить">
					<xsl:attribute name="onClick">
						javascript:callEvent('method=SaveCardElement#type=file#card_type=e#in_attr=delete#xml_id=<xsl:value-of select="@id"/>#html_id=path<xsl:value-of select="@id"/>');
					</xsl:attribute>
				</input>
			</div>
			</td>
			<td class="cmr"></td>
		</tr>
		<tr>
			<td class="cbl"></td>
			<td class="cbm" colspan="2"></td>
			<td class="cbr"></td>
		</tr>
	</table>
	</div>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement[@type='date']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:variable name="tit" select="substring-after(@title,'@')"/>
		<xsl:variable name="title">
			<xsl:value-of select="FormAttrib[@sys-name=$tit]/node()"/> 
		</xsl:variable>
		<xsl:value-of select="$title"/>
		<xsl:if test="string-length($title)=0">
			<xsl:value-of select="@title"/> 
		</xsl:if>
		<xsl:if test="string-length($title)=0 and not(@title)">
			<xsl:value-of select="@sys-name"/> 
		</xsl:if>
		<xsl:text>:</xsl:text>
		<br/>
		<xsl:variable name="date"><xsl:value-of select="options/@input_attr"/></xsl:variable>
		<xsl:variable name="val">
			<xsl:value-of select="FormAttrib[@sys-name=$date]/node()"/> 
		</xsl:variable>
		<xsl:variable name="dd" select="substring-before($val,'.')"/>
		<xsl:variable name="temp" select="substring-after($val,'.')"/>
		<xsl:variable name="mm" select="substring-before($temp,'.')"/>
		<xsl:variable name="yy" select="substring-after($temp,'.')"/>
		
		<table><tr><td>
			<input type="text" class="stext">
				<xsl:attribute name="id"><xsl:text>dd</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="$dd"/>
				</xsl:attribute>
				<xsl:attribute name="onBlur">
					javascript:callEvent('method=SaveCardElement#type=date#card_type=e#in_attr=d#xml_id=<xsl:value-of select="@id"/>#html_id=dd<xsl:value-of select="@id"/>');
				</xsl:attribute>
				
			</input>/
			<input type="text" class="stext">
				<xsl:attribute name="id"><xsl:text>mm</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="$mm"/>
				</xsl:attribute>
				<xsl:attribute name="onBlur">
					javascript:callEvent('method=SaveCardElement#type=date#card_type=e#in_attr=m#xml_id=<xsl:value-of select="@id"/>#html_id=mm<xsl:value-of select="@id"/>');
				</xsl:attribute>
				
			</input>/
			<input type="text" class="stext">
				<xsl:attribute name="id"><xsl:text>yyyy</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="$yy"/>
				</xsl:attribute>
				<xsl:attribute name="onBlur">
					javascript:callEvent('method=SaveCardElement#type=date#card_type=e#in_attr=y#xml_id=<xsl:value-of select="@id"/>#html_id=yyyy<xsl:value-of select="@id"/>');
				</xsl:attribute>
				
			</input>
		</td>
		<td valign="bottom">
			<input type="button" class="button" value="показать">
				<xsl:attribute name="id"><xsl:text>button</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="onclick"	>
					<xsl:text>calendar_switch('</xsl:text>
					<xsl:value-of select="@id"/>
					<xsl:text>');</xsl:text>
				</xsl:attribute>
			</input>
		</td>
		<td>
			<div style="position:absolute;">
				<xsl:attribute name="id"><xsl:text>calendar</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
			</div>
		</td></tr></table>

	</div>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement[@type='checkbox']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:variable name="tit" select="substring-after(@title,'@')"/>
		<xsl:variable name="title">
			<xsl:value-of select="FormAttrib[@sys-name=$tit]/node()"/> 
		</xsl:variable>
		<xsl:value-of select="$title"/>
		<xsl:if test="string-length($title)=0">
			<xsl:value-of select="@title"/> 
		</xsl:if>
		<xsl:if test="string-length($title)=0 and not(@title)">
			<xsl:value-of select="@sys-name"/> 
		</xsl:if>
		<xsl:text>:</xsl:text>

		<xsl:variable name="check"><xsl:value-of select="options/@input_attr"/></xsl:variable>
		<xsl:variable name="val">
			<xsl:value-of select="FormAttrib[@sys-name=$check]/node()"/> 
		</xsl:variable>
		<input type="checkbox" class="checkbox">
			<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="options/@checked=$val">
				<xsl:attribute name="checked"/>
			</xsl:if>
			<xsl:attribute name="onBlur">
				javascript:callEvent('method=SaveCardElement#type=checkbox#card_type=e#xml_id=<xsl:value-of select="@id"/>#html_id=<xsl:value-of select="@id"/>');
			</xsl:attribute>
			
		</input>
	</div>
</xsl:template> 
<!-- ********************************************************************************************************************************************************* -->
<!-- АТРИБУТЫ-->
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib" mode="copy">
	<xsl:apply-templates select="." mode="type"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib" mode="type"> <!--[@type='input-text' or @type='default']-->
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:value-of select="@title"/>
		<xsl:if test="not(@title) or string-length(@title)=0">
			<xsl:value-of select="@sys-name"/>
		</xsl:if>
		<xsl:text>:</xsl:text>
		<br/>
		<input type="text" class="text">
			<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="value">
				<xsl:value-of select="node()"/>
			</xsl:attribute>
			<xsl:if test="@disabled='true'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
			<xsl:attribute name="onBlur">
				javascript:callEvent('method=SaveCardElement#type=default#card_type=a#xml_id=<xsl:value-of select="@id"/>#html_id=<xsl:value-of select="@id"/>');
			</xsl:attribute>
			
		</input>
	</div>
</xsl:template> 
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib[@type='checkbox']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:value-of select="@title"/>
		<xsl:if test="not(@title) or string-length(@title)=0">
			<xsl:value-of select="@sys-name"/>
		</xsl:if>
		<xsl:text>:</xsl:text>
		<input type="checkbox" class="checkbox">
			<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="node()='true'">
				<xsl:attribute name="checked"/>
			</xsl:if>
			<xsl:if test="@disabled='true'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
			<xsl:attribute name="onBlur">
				javascript:callEvent('method=SaveCardElement#type=checkbox#card_type=a#xml_id=<xsl:value-of select="@id"/>#html_id=<xsl:value-of select="@id"/>');
			</xsl:attribute>
			
		</input>
	</div>
</xsl:template> 
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib[@type='hidden']" mode="type" />
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib[@type='time']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:value-of select="@title"/>
		<xsl:if test="not(@title) or string-length(@title)=0">
			<xsl:value-of select="@sys-name"/>
		</xsl:if>
		<xsl:text>:</xsl:text>
		<br/>
		<xsl:variable name="hh" select="substring-before(node(),':')"/>
		<xsl:variable name="mm" select="substring-after(node(),':')"/>
		<input type="text" class="stext">
			<xsl:attribute name="id"><xsl:text>hh</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="value">
				<xsl:value-of select="$hh"/>
			</xsl:attribute>
			<xsl:if test="@disabled='true'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
			<xsl:attribute name="onBlur">
				javascript:callEvent('method=SaveCardElement#type=time#card_type=a#in_attr=h#xml_id=<xsl:value-of select="@id"/>#html_id=hh<xsl:value-of select="@id"/>');
			</xsl:attribute>
			
		</input>:
		<input type="text" class="stext">
			<xsl:attribute name="id"><xsl:text>mm</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="value">
				<xsl:value-of select="$mm"/>
			</xsl:attribute>
			<xsl:if test="@disabled='true'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
			<xsl:attribute name="onBlur">
				javascript:callEvent('method=SaveCardElement#type=time#card_type=a#in_attr=m#xml_id=<xsl:value-of select="@id"/>#html_id=mm<xsl:value-of select="@id"/>');
			</xsl:attribute>
			
		</input>
	</div>
</xsl:template> 
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib[@type='link']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:value-of select="@title"/>
		<xsl:if test="not(@title) or string-length(@title)=0">
			<xsl:value-of select="@sys-name"/>
		</xsl:if>
		<xsl:text>:</xsl:text>
		<br/>
		
		<input type="text" class="text" disabled="disabled">
			<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		</input>		

		<img src="img/x.gif" alt="">
			<xsl:attribute name="onLoad">
				<xsl:text>javascript:callEvent('method=get_link_title#id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>#link_title=</xsl:text>
				<xsl:value-of select="node()"/>				
				<xsl:text>')</xsl:text>
			</xsl:attribute>
		</img>
		
		
		<input type="button" class="button" value="выбрать">
			<xsl:attribute name="onClick">
				<xsl:text>javascript:callEvent('method=get_linkdialog#id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>#choose_path=</xsl:text>
				<xsl:value-of select="@choose_path"/>
				<xsl:text>');</xsl:text>
			</xsl:attribute>
		</input>

		
		<input type="button" class="button" value="очистить">
			<xsl:attribute name="onClick">
				<xsl:text>javascript:callEvent('method=SaveCardElement#type=link#card_type=a#path=#xml_id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>#html_id=</xsl:text>
				<xsl:value-of select="@id"/>
				<xsl:text>'); document.getElementById('</xsl:text>
				<xsl:value-of select="@id"/>
   				<xsl:text>').value='';</xsl:text>
			</xsl:attribute>
		</input>
		
	</div>
</xsl:template> 
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib[@type='date']" mode="type">
	<div class="p">
		<xsl:attribute name="id">
			<xsl:text>div</xsl:text><xsl:value-of select="@id"/>
		</xsl:attribute>
	
		<xsl:value-of select="@title"/>
		<xsl:if test="not(@title) or string-length(@title)=0">
			<xsl:value-of select="@sys-name"/>
		</xsl:if>
		<xsl:text>:</xsl:text>
		<br/>
		<xsl:variable name="dd" select="substring-before(node(),'.')"/>
		<xsl:variable name="temp" select="substring-after(node(),'.')"/>
		<xsl:variable name="mm" select="substring-before($temp,'.')"/>
		<xsl:variable name="yy" select="substring-after($temp,'.')"/>
		
		<table><tr><td>
			<input type="text" class="stext">
				<xsl:attribute name="id"><xsl:text>dd</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="$dd"/>
				</xsl:attribute>
				<xsl:if test="@disabled='true'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>				
				<xsl:attribute name="onBlur">
					javascript:callEvent('method=SaveCardElement#type=date#card_type=a#in_attr=d#xml_id=<xsl:value-of select="@id"/>#html_id=dd<xsl:value-of select="@id"/>');
				</xsl:attribute>
				
			</input>/
			<input type="text" class="stext">
				<xsl:attribute name="id"><xsl:text>mm</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="$mm"/>
				</xsl:attribute>
				<xsl:if test="@disabled='true'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
				<xsl:attribute name="onBlur">
					javascript:callEvent('method=SaveCardElement#type=date#card_type=a#in_attr=m#xml_id=<xsl:value-of select="@id"/>#html_id=mm<xsl:value-of select="@id"/>');
				</xsl:attribute>
				
			</input>/
			<input type="text" class="stext">
				<xsl:attribute name="id"><xsl:text>yyyy</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="$yy"/>
				</xsl:attribute>
				<xsl:if test="@disabled='true'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
				<xsl:attribute name="onBlur">
					javascript:callEvent('method=SaveCardElement#type=date#card_type=a#in_attr=y#xml_id=<xsl:value-of select="@id"/>#html_id=yyyy<xsl:value-of select="@id"/>');
				</xsl:attribute>
				
			</input>
		</td>
		<td valign="bottom">
			<input type="button" class="button" value="показать">
				<xsl:attribute name="id"><xsl:text>button</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="onclick"	>
					<xsl:text>calendar_switch('</xsl:text>
					<xsl:value-of select="@id"/>
					<xsl:text>');</xsl:text>
				</xsl:attribute>
			</input>
		</td>
		
		<td>
			<div style="position:absolute;">
				<xsl:attribute name="id"><xsl:text>calendar</xsl:text><xsl:value-of select="@id"/></xsl:attribute>
			</div>
		</td></tr></table>
		
	</div>
</xsl:template> 

<!-- ********************************************************************************************************************************************************* -->
</xsl:stylesheet>