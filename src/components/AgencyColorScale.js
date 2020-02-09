import { scaleOrdinal } from 'd3-scale'
import { legendColor } from 'd3-svg-legend'

const AgencyColorScale = scaleOrdinal(["#a71930","#574241","#bfa5a4","#00689d","#009dd4","#cf6576","#a18584","#e8cdcc","#67a8c9","#5cd1fa"]);

AgencyColorScale.domain(["HHS","USDA","HUD","DOT","ED","SBA","other","DOL","EPA","DOJ","DHS","DOI","Treasury","CNCS","ARC","VA","DOC","DOE","IMLS","DOD","NEA","NEH","DRA"])

export default AgencyColorScale
