<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="windows-1251" />
<xsl:strip-space elements="*"/>


<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="/">
		<xsl:apply-templates select="//data"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="data">
	<div id="content">
		<xsl:attribute name="onLoad">
			<xsl:text>ldEventsLoad();</xsl:text>
		</xsl:attribute>
		<xsl:apply-templates select="quick_links"/>
		<xsl:apply-templates select="title_page"/>

		<table id="ld_nodes">
			<thead>
				<tr>
					<th width="1%"></th>
					<th width="98%"></th>
					<th width="1%"></th>
				</tr>
			</thead>
			<tbody>
				<xsl:apply-templates select="elements"/>
			</tbody>
		</table>
				
		<xsl:apply-templates select="pages"/>
	</div>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="elements">
	<xsl:apply-templates select="node()" /> 
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="container">
	<tr>
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="path"><xsl:value-of select="@link"/></xsl:attribute>
	
		<xsl:attribute name="n_title">
				<xsl:value-of select="@title"/>
				<xsl:if test="not(@title) or string-length(@title)=0">
					&#160;	
				</xsl:if>
		</xsl:attribute>

		<td>
			<img src="img/icon-folder.gif"/>
		</td>
		<td>
			<span>
				<xsl:value-of select="@title"/>
				<xsl:if test="not(@title) or string-length(@title)=0">
					&#160;	
				</xsl:if>
			</span>
		</td>
	</tr>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="back">
	<tr>
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="path"><xsl:value-of select="@link"/></xsl:attribute>
		<xsl:attribute name="n_title"/>
		<td></td>
		<td>
			<span>
				<xsl:value-of select="@title"/>
			</span>
		</td>
		<td></td>
	</tr>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="noda">
	<tr>
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="path"><xsl:value-of select="@link"/></xsl:attribute>
		<xsl:attribute name="n_title">
				<xsl:value-of select="@title"/>
				<xsl:if test="not(@title) or string-length(@title)=0">
					&#160;	
				</xsl:if>
		</xsl:attribute>
		<td>
			<img src="img/icon-file.gif"/>
		</td>
		<td>
			<span>
				<xsl:variable name="title">
					<xsl:choose>
						<xsl:when test="string-length(@title)>40">
							<xsl:value-of select="substring(@title,1,40)"/>
							<xsl:text>...</xsl:text>
						</xsl:when>
						<xsl:when test="not(@title) or string-length(@title)=0">
							<xsl:text>&#160;</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="@title"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:value-of select="$title"/>
				<!--
				<xsl:value-of select="@title"/>
				<xsl:if test="not(@title) or string-length(@title)=0">
					&#160;	
				</xsl:if>
				-->
			</span>
		</td>
	</tr>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="pages">
<div class="pager">
	Страницы:<xsl:apply-templates select="page"/>
</div>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="page">
	&#160;<a href="#">
		<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
		<xsl:value-of select="@num"/>
	</a>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="page[@select=1]">
	&#160;	<b><xsl:value-of select="@num"/> </b>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="page[@num='pred']">
	&#160;<a href="#">
		<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
		&lt;&lt;
	</a>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="page[@num='next']">
	&#160;<a href="#">
		<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>')
		</xsl:attribute>
		&gt;&gt;
	</a>

</xsl:template>

<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="title_page">
	<h1><xsl:value-of select="@title"/></h1>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="quick_links">
	<div id="crumbs">
		 <xsl:apply-templates select="qlink" ><xsl:sort select="@level" data-type="number" order="ascending"/> </xsl:apply-templates>
	</div>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="qlink">
	<a href="#">
		<xsl:attribute name="onClick">
				javascript:callEvent('<xsl:value-of select="@link"/>'); return false;
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