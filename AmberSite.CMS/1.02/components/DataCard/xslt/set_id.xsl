<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml"/>
<xsl:strip-space elements="*"/>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="/">
	<xsl:apply-templates select="*"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement | FormAttrib"> <!-- FormAttrib -->
	<xsl:copy >
		<xsl:attribute name="id"><xsl:value-of select="generate-id(.)"/></xsl:attribute>
		<xsl:copy-of select="@*"/>
		<xsl:apply-templates/>
	</xsl:copy>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="node()">
	<xsl:copy-of select="."/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
	
</xsl:stylesheet>