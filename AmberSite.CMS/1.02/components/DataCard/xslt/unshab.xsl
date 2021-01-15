<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml" encoding="windows-1251"/>
<xsl:strip-space elements="*"/>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="/">
	<xsl:apply-templates select="node()" mode="copy"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElement" mode="copy">
	<xsl:element name="{@sys-name}">
		<xsl:apply-templates select="FormAttrib" mode="copy"/>
		<xsl:if test="not(@need-prepare-text)"> 
			<xsl:apply-templates select="node()" mode="copy"/>
		</xsl:if> 
		<xsl:apply-templates select="FormElementHtmlText" mode="copy"/>
		<!--
		<xsl:if test="@need-prepare-text">
			<xsl:apply-templates select="node()[name() != 'FormAttrib']" mode="prepare-text"/>
		</xsl:if> 
		-->
	</xsl:element>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormElementHtmlText" mode="copy">
	<xsl:apply-templates select="node()" mode="prepare-text"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="FormAttrib" mode="copy">
	<xsl:attribute name="{@sys-name}"><xsl:value-of select="node()"/></xsl:attribute>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="options" mode="copy"/>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="node()" mode="copy">
	<xsl:copy-of select="."/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="node()" mode="prepare-text">
	<xsl:copy>
		<xsl:apply-templates select="node()|@*" mode="prepare-text"/>
	</xsl:copy>
</xsl:template>
<!--  ********************************************************************************************************************************************************* -->
<xsl:template match="@*" mode="prepare-text">
	<xsl:copy/>	
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="img/@preview" mode="prepare-text">
	<xsl:attribute name="onclick">
		<xsl:value-of select="."/>
	</xsl:attribute>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="@src" mode="prepare-text">
	<xsl:variable name="sitepath">
		<xsl:value-of select="ancestor::FormElement[position()=1]/@need-prepare-text"/>
		<xsl:text>/</xsl:text>
	</xsl:variable>
	<xsl:variable name="str" select="."/>
	<xsl:attribute name="src">
		<xsl:choose>
			<xsl:when test="starts-with($str,$sitepath)"><xsl:value-of select="substring-after($str,$sitepath)"/></xsl:when>
			<xsl:otherwise><xsl:value-of select="$str"/></xsl:otherwise>
		</xsl:choose>
	</xsl:attribute>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->

</xsl:stylesheet>
