<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" encoding="windows-1251"/>
	<xsl:strip-space elements="*"/>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="/">
		<xsl:apply-templates select="//data"/>
		<!--   <textarea cols="70" rows="20">
        		<xsl:copy-of select = "."/>
    			</textarea>
    		-->
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="data">
		<div id="content">
			<xsl:attribute name="onLoad"><xsl:text>navMenuEventsLoad();</xsl:text></xsl:attribute>
			<xsl:apply-templates select="quick_links"/>
			<xsl:apply-templates select="title_page"/>
			<table id="nodes">
				<thead>
					<tr>
						<th width="1%"/>
						<th width="98%"/>
						<th width="1%" class="c">
							<img src="img/icon-all.gif" onclick="switchSelection();"/>
						</th>
					</tr>
				</thead>
				<tbody>
					<xsl:apply-templates select="elements"/>
				</tbody>
			</table>
			<div class="pages" >
			<xsl:apply-templates select="pages"/>
			<xsl:apply-templates select="@current_limit"/>
			</div>
		</div>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
		<xsl:template match="//data/@current_limit">
				&#160;&#160;&#160;&#160;|&#160;Отображать по&#160;
				<input name="newlimit" id="newlimit" value="{.}" type="text" style="width:25px; height:15px;"/>&#160;&#160;на странице&#160;
				(<a href="#" onclick="callEvent('method=new_limit_set#html_id=newlimit');">сохранить</a>)
<!--
				<input name="lim_submit" type="submit" value="сохранить">
					<xsl:attribute name="onClick">
						 javascript:callEvent('method=new_limit_set#html_id=newlimit') 
					</xsl:attribute>
				</input>
-->				
		</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->

	<xsl:template match="elements">
		<xsl:apply-templates select="node()"/>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="container">
		<tr>
			<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="path"><xsl:value-of select="@link"/></xsl:attribute>
			<td>
				<xsl:if test="@visible='true'">
					<img src="img/icon-folder.gif"/>
				</xsl:if>
				<xsl:if test="@visible='false'">
					<img src="img/icon-folder-bw.gif"/>
				</xsl:if>
			</td>
			<td>
				<span>
					<xsl:value-of select="@title"/>
					<xsl:if test="not(@title) or string-length(@title)=0">
					&#160;	
				</xsl:if>
				</span>
			</td>
			<td class="c">
				<input type="checkbox"/>
			</td>
		</tr>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="back">
		<tr>
			<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="path"><xsl:value-of select="@link"/></xsl:attribute>
			<td/>
			<td>
				<span>
					<xsl:value-of select="@title"/>
				</span>
			</td>
			<td/>
		</tr>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="noda">
		<tr>
			<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="path"><xsl:value-of select="@link"/></xsl:attribute>
			<td>
				<xsl:if test="@visible='true'">
					<img src="img/icon-file.gif"/>
				</xsl:if>
				<xsl:if test="@visible='false'">
					<img src="img/icon-file-bw.gif"/>
				</xsl:if>
			</td>
			<td>
				<span>
					<xsl:value-of select="@title"/>
					<xsl:if test="not(@title) or string-length(@title)=0">
					&#160;	
				</xsl:if>
				</span>
			</td>
			<td class="c">
				<input type="checkbox"/>
			</td>
		</tr>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="pages">
	Страницы:&#160;<xsl:apply-templates select="*"/>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="page">
		<a href="#">
			<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
			<xsl:value-of select="@num"/>
		</a>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="page[@select=1]">
		<b>
			<xsl:value-of select="@num"/>
		</b>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="page[@num='pred']">
		<a href="#">
			<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
		&#171;
	</a>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="page[@num='next']">
		<a href="#">
			<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
		&#187;
	</a>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="page[@num='toStart']">
		<a href="#">
			<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
			<xsl:text>В начало</xsl:text>
		</a>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="page[@num='toEnd']">
		<a href="#">
			<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
			<xsl:text>В конец</xsl:text>
		</a>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="title_page">
		<h1>
			<xsl:value-of select="@title"/>
		</h1>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="quick_links">
		<div id="crumbs">
			<xsl:apply-templates select="*">
				<xsl:sort select="@level" data-type="number" order="ascending"/>
			</xsl:apply-templates>
		</div>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
	<xsl:template match="qlink">
		<a href="#">
			<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
			<xsl:choose>
				<xsl:when test="position()=1">
					<xsl:text>Начало</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@title"/>
					<xsl:if test="not(@title) or string-length(@title)=0">
						<xsl:text>(not titled)</xsl:text>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</a>
		<xsl:if test="not(position()=last())">
			<xsl:text>&#160;/&#160;</xsl:text>
		</xsl:if>
	</xsl:template>
	<!-- ********************************************************************************************************************************************************* -->
</xsl:stylesheet>
