<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="windows-1251" />
<xsl:strip-space elements="*"/>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="/">
	<xsl:apply-templates select="//quick_links"/>	
	<xsl:apply-templates select="//title_page"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="title_page">
	<h1><xsl:value-of select="@title"/></h1>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="quick_links">
	<div id="crumbs">
		 <xsl:apply-templates select="*"><xsl:sort select="@level" data-type="number" order="ascending"/> </xsl:apply-templates>
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