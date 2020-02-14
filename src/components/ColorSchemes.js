import { scaleOrdinal, scaleSequential, scaleQuantile } from 'd3-scale'
import { interpolateRdYlGn, schemeRdYlGn } from "d3-scale-chromatic"

const categoricalColors = scaleOrdinal(["#a71930","#574241","#bfa5a4","#00689d","#009dd4","#cf6576","#a18584","#e8cdcc","#67a8c9","#5cd1fa"]).domain(["HHS","USDA","HUD","DOT","ED","SBA","other","DOL","EPA","DOJ","DHS","DOI","Treasury","CNCS","ARC","VA","DOC","DOE","IMLS","DOD","NEA","NEH","DRA"])

const divergingColors = scaleSequential(interpolateRdYlGn)

const bucketScale = scaleQuantile().range(schemeRdYlGn[10]);

export { categoricalColors, divergingColors, bucketScale }
