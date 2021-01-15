<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml"/>
<xsl:strip-space elements="*"/>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="main_menu">
	<xsl:copy >
		<xsl:apply-templates select="*" mode="copy"/>
	</xsl:copy>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="menu_item" mode="copy">
	<xsl:copy >
		<xsl:attribute name="id"><xsl:value-of select="generate-id(.)"/></xsl:attribute>
		<xsl:copy-of select="@*"/>
	</xsl:copy>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
</xsl:stylesheet>