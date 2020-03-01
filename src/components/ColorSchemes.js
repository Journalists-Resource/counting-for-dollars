import { scaleOrdinal, scaleSequential, scaleQuantile, scaleQuantize } from 'd3-scale'
import { interpolateRdYlGn, schemeRdYlGn } from "d3-scale-chromatic"

const categoricalColors = scaleOrdinal(["#a71930","#574241","#bfa5a4","#00689d","#009dd4","#cf6576","#8b8680"])
.domain(["HHS","USDA","HUD","DOT","ED","SBA", "other"])
.unknown("#8b8680")

const categoricalColorsWithoutSBA = scaleOrdinal(["#a71930","#574241","#bfa5a4","#00689d","#009dd4","#8b8680"])
.domain(["HHS","USDA","HUD","DOT","ED","other"])
.unknown("#8b8680")

const fullAgencyName = scaleOrdinal()
.domain(["HHS","USDA","HUD","DOT","ED","SBA","other","DOL","EPA","DOJ","DHS","DOI","Treasury","CNCS","ARC","VA","DOC","DOE","IMLS","DOD","NEA","NEH","DRA"])
.range(["Health and Human Services", "Department of Agriculture", "Housing and Urban Development", "Department of Transportation", "Education Department", "Small Business Administration", "other", "Department of Labor", "Environmental Protection Agency", "Department of Justice", "Department of Homeland Security", "Department of the Interior", "Treasury", "Corporation for National and Community Service", "Appalachian Regional Commission", "Veterans' Affairs", "Department of Commerce", "Department of Energy", "Institute of Museum and Library Services", "Department of Defense", "National Endowment for the Arts", "National Endowment for the Humanities", "Delta Regional Authority"]).unknown("")

const divergingColors = scaleSequential(interpolateRdYlGn)

const bucketScale = scaleQuantile().range(schemeRdYlGn[5]);

export { categoricalColors, categoricalColorsWithoutSBA, divergingColors, bucketScale, fullAgencyName }
