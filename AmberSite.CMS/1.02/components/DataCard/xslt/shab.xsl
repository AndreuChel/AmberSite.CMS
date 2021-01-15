<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml" encoding="windows-1251"/>
<xsl:strip-space elements="*"/>

<xsl:variable name="elements"  select="result/dstyle"/>
<xsl:variable name="sitepath" select="result/@site_path"/>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="/">
		<xsl:apply-templates select="result"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="result">
		<xsl:apply-templates select="node()">
			<xsl:with-param name="path-node"></xsl:with-param>
		</xsl:apply-templates>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="dstyle">
		<xsl:param name="path-node"/>
		<xsl:variable name="tmp"><xsl:copy-of select="."/></xsl:variable>
</xsl:template>

<!-- ********************************************************************************************************************************************************* -->
<xsl:template name="gettype">
	<xsl:param name="fullpath"/>
	<xsl:variable name="fullpathwithslash" select="concat('/',$fullpath)"/>
		<xsl:if test="not($elements/element[@path=$fullpath or @path=$fullpathwithslash]) and contains($fullpath,'/')">
			<xsl:call-template name="gettype">
				<xsl:with-param name="fullpath">
					<xsl:value-of select="substring-after($fullpath,'/')"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:value-of select="$elements/element[@path=$fullpath or @path=$fullpathwithslash]/@path"/>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="node()">
		<xsl:param name="path-node"/>
		<xsl:variable name="fullpath">
			<xsl:if test="string-length($path-node) != 0">
				<xsl:value-of select="concat($path-node,'/',name())"/>
			</xsl:if>
			<xsl:if test="string-length($path-node) = 0">
				<xsl:value-of select="name()"/>
			</xsl:if>
		</xsl:variable>

		<xsl:variable name="typepath">
			<xsl:call-template  name="gettype"><xsl:with-param name="fullpath"><xsl:value-of select="$fullpath"/></xsl:with-param></xsl:call-template>
		</xsl:variable>
		<xsl:element name="FormElement">
			<xsl:attribute name="sys-name"><xsl:value-of select="name()"/></xsl:attribute>
			<xsl:copy-of select="$elements/element[@path=$typepath]/@*"/>
			<!-- *** -->
				<xsl:variable name="type" select="$elements/element[@path=$typepath]/@type"/>	
				<xsl:if test="$type='html-text'">
					<xsl:attribute name="need-prepare-text"><xsl:value-of select="$sitepath"/></xsl:attribute>
				</xsl:if>
				<xsl:if test="$type='plain-text'">
					<xsl:attribute name="need-prepare-text"><xsl:value-of select="$sitepath"/></xsl:attribute>
				</xsl:if>
				
			<!-- *** -->
			<xsl:apply-templates select="@*">
				<xsl:with-param name="path-node"><xsl:value-of select="$fullpath"/></xsl:with-param>
			</xsl:apply-templates>
			<xsl:apply-templates select="$elements/element[@path=$typepath]/options">
				<xsl:with-param name="path-node"><xsl:value-of select="$fullpath"/></xsl:with-param>
			</xsl:apply-templates>

			<xsl:choose>
				<xsl:when test="$type='html-text'">
					<xsl:element name="FormElementHtmlText">
						<xsl:apply-templates select="node()" mode="prepare-text"/>
					</xsl:element>
				</xsl:when>

				<xsl:when test="$type='plain-text'">
					<xsl:element name="FormElementHtmlText">
						<xsl:apply-templates select="node()" mode="prepare-text"/>
					</xsl:element>
						
				</xsl:when>
				
				<xsl:otherwise>
	      				<xsl:apply-templates select="*">
						<xsl:with-param name="path-node"><xsl:value-of select="$fullpath"/></xsl:with-param>
					</xsl:apply-templates>
				</xsl:otherwise>
			</xsl:choose>	
		</xsl:element>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="@*">
	<xsl:param name="path-node"/>

	<xsl:variable name="fullpath">
		<xsl:value-of select="concat($path-node,'/@',name())"/>
	</xsl:variable>
	<xsl:variable name="typepath">
		<xsl:call-template  name="gettype">
			<xsl:with-param name="fullpath"><xsl:value-of select="$fullpath"/></xsl:with-param> 
			<xsl:with-param name="name" select="name()"/>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="typeElement">
		<xsl:value-of select="$elements/element[@path=$typepath]/@type"/>
	</xsl:variable>

	<xsl:element name="FormAttrib">
	<xsl:attribute name="sys-name"><xsl:value-of select="name()"/></xsl:attribute>
	<xsl:copy-of select="$elements/element[@path=$typepath]/@*"/>
	<xsl:value-of select="."/>
	</xsl:element>
	
</xsl:template>
<!--********************************************************************************************************************************************************* -->
<xsl:template match="options">
	<xsl:param name="path-node"/>
	<xsl:variable name="fullpath"	><xsl:value-of select="$path-node"/></xsl:variable>
	<xsl:element name="options"	>
		<xsl:copy-of select="@*"/>
		<xsl:apply-templates select="*">
				<xsl:with-param name="path-node"><xsl:value-of select="$fullpath"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:element>
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
<!--  ********************************************************************************************************************************************************* -->
<xsl:template match="img/@onclick" mode="prepare-text">
	<xsl:attribute name="preview">
		<xsl:value-of select="."/>
	</xsl:attribute>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
<xsl:template match="@src" mode="prepare-text">
	<xsl:variable name="str" select="."/>
	<xsl:attribute name="src">
		<xsl:choose>
			<xsl:when test="not(starts-with($str,'http://')) and not(starts-with($str,'file:///'))">
				<xsl:value-of select="$sitepath"/>
				<xsl:text>/</xsl:text>
				<xsl:value-of select="$str"/>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="$str"/></xsl:otherwise>
		</xsl:choose>
	</xsl:attribute>
</xsl:template>
<!-- ********************************************************************************************************************************************************* -->
</xsl:stylesheet>