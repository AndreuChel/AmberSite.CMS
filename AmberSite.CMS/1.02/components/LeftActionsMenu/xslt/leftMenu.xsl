<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml" encoding="windows-1251"/>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="node()">
	<data>
		<xsl:apply-templates select="menu_item"/>
	</data>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="menu_item"><div id="{@id}"><xsl:attribute name="onClick">javascript:callEvent('method=left_menu_click#id=<xsl:value-of select="@id"/>');</xsl:attribute><table><tr><td width="25" id="td1{@id}"><xsl:if test="@src"><img src="{@src}" alt=""/></xsl:if></td><td><span><xsl:value-of select="@title"/></span></td></tr></table></div></xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="menu_item[@typeof='separator']"><div id="{@id}" class="spacer">&#160;</div></xsl:template>
<!-- ********************************************************************************************************************************************************* -->
</xsl:stylesheet>