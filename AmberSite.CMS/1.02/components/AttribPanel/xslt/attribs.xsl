<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" encoding="windows-1251"/>
	<xsl:strip-space elements="*"/>
	<!-- *********************************************************************************************************************************** -->
	<xsl:template match="/">
		<div class="head">Атрибуты</div>
		<table>
				<thead>
					<tr>
						<th width="75%"/>
						<th width="25%"/>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><a href="#">Добавить атрибут</a></td>
						<td class="right"><a href="#">Сохранить</a></td>
					</tr>
				</tbody>
		</table>
		<form action="">
		<table>
				<thead>
					<tr>
						<th width="60%"/>
						<th width="35%"/>
						<th width="5%"/>
					</tr>
				</thead>
				<tbody>
					<xsl:apply-templates select="//attr"/>
				</tbody>
		</table>
		</form>
	</xsl:template>
	<!-- *********************************************************************************************************************************** -->
	<xsl:template match="attr">
		<tr>
			<td class="td1"><xsl:value-of select="@name"/></td>
			<td>
				<input type="input" name="{@name}">
					<xsl:attribute name="id"><xsl:value-of select="@name"/></xsl:attribute>
					<xsl:attribute name="onBlur">javascript:callEvent('method=SaveAttrib#html_id=<xsl:value-of select="@name"/>');</xsl:attribute>
					<xsl:attribute name="onFocus">javascript:callEvent('method=StartEditAttrib#html_id=<xsl:value-of select="@name"/>');</xsl:attribute>
					<xsl:attribute name="value">	<xsl:copy-of select="node()"/></xsl:attribute>
				</input>
			</td>
			<td>
				<img src="img/crest.gif" alt="">
					<xsl:attribute name="onClick">javascript:callEvent('method=DelAttrib#html_id=<xsl:value-of select="@name"/>');</xsl:attribute>
				</img>
			</td>
		</tr>
	</xsl:template>
	<!--************************************************************************************************************************************* -->
</xsl:stylesheet>
