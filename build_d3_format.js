const fs = require('fs')
const H = require('highland')

var papers = JSON.parse(fs.readFileSync('./data/rfc_index_with_links.json', 'utf8'))

var d3Format = {nodes:[],links:[]}
var nodeCounter = 0
var idLookup = {}
var groupLookup = {1960:0, 1970:1, 1980:2, 1990:3, 2000:4, 2010:5}
var paperKeys = []
var paperLookup = {}

papers.forEach((p)=>{
	paperKeys.push(parseInt(p.id))
	paperLookup[parseInt(p.id)] = p
})

function sortNumber(a,b) {
    return a - b;
}

//build all the nodes first
H(paperKeys.sort(sortNumber))
	.map((paper) =>{

		paper = paperLookup[paper]
		paper.id = parseInt(paper.id)
		if (!idLookup[paper.id]) {
			idLookup[paper.id] = nodeCounter++
			// add in the node
			var decade = parseInt(paper.year / 10, 10) * 10
			d3Format.nodes.push({"name":`${paper.id} - ${paper.title} (${paper.year})`,"group":groupLookup[decade]})
		}


	})
	.compact()
	.done(()=>{



		//links
		H(paperKeys.sort(sortNumber))
			.map((paper) =>{
				paper = paperLookup[paper]
				paper.id = parseInt(paper.id)
				if (!paper.links) paper.links = {}
				Object.keys(paper.links).forEach((linkTarget) =>{
					if (typeof idLookup[parseInt(linkTarget)] === 'undefined') return
					if (parseInt(paper.links[linkTarget]) <= 2) return
					d3Format.links.push({"source":idLookup[paper.id],"target":idLookup[parseInt(linkTarget)],"value":paper.links[linkTarget]})
				})
			})
			.compact()
			.done(()=>{
				console.log(d3Format)
				fs.writeFileSync('./data/rfc_d3_format.json',JSON.stringify(d3Format,null,2))
			})		


	})

