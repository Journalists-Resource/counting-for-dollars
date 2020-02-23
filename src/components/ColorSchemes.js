import { scaleOrdinal, scaleSequential, scaleQuantile, scaleQuantize } from 'd3-scale'
import { interpolateRdYlGn, schemeRdYlGn } from "d3-scale-chromatic"

const categoricalColors = scaleOrdinal(["#a71930","#574241","#bfa5a4","#00689d","#009dd4","#cf6576","#8b8680"])
.domain(["HHS","USDA","HUD","DOT","ED","SBA", "other"])
.unknown("#8b8680")

// const categoricalColors = scaleOrdinal(["#a71730", "#104b6d", "#4ad9e1", "#6c3640", "#4ed31b", "#7f42a9", "#abd28d", "#bce333", "#8c2efc", "#598322", "#dfa3f0", "#54b2fc", "#c5089e", "#1cf1a3", "#f55c71", "#1f9383", "#faa38c", "#9a5c0d", "#f3d426", "#fa79f5", "#f79302", "#848484", "#fd5917"])
// .domain(["HHS","USDA","HUD","DOT","ED","SBA","other","DOL","EPA","DOJ","DHS","DOI","Treasury","CNCS","ARC","VA","DOC","DOE","IMLS","DOD","NEA","NEH","DRA"])

const fullAgencyName = scaleOrdinal()
.domain(["HHS","USDA","HUD","DOT","ED","SBA","other","DOL","EPA","DOJ","DHS","DOI","Treasury","CNCS","ARC","VA","DOC","DOE","IMLS","DOD","NEA","NEH","DRA"])
.range(["Health and Human Services", "Department of Agriculture", "Housing and Urban Development", "Department of Transportation", "Education Department", "Small Business Administration", "other", "Department of Labor", "Environmental Protection Agency", "Department of Justice", "Department of Homeland Security", "Department of the Interior", "Treasury", "Corporation for National and Community Service", "Appalachian Regional Commission", "Veterans' Affairs", "Department of Commerce", "Department of Energy", "Institute of Museum and Library Services", "Department of Defense", "National Endowment for the Arts", "National Endowment for the Humanities", "Delta Regional Authority"]).unknown("")

const divergingColors = scaleSequential(interpolateRdYlGn)

const bucketScale = scaleQuantile().range(schemeRdYlGn[5]);

export { categoricalColors, divergingColors, bucketScale, fullAgencyName }
