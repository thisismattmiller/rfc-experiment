const fs = require('fs')
var papers = JSON.parse(fs.readFileSync('./data/rfc_index_with_links.json', 'utf8'))

links = {}
titles = {}

papers.forEach((paper)=>{
	if (!paper.links) return
	Object.keys(paper.links).forEach((linkKey)=>{
		if (!links[linkKey]){
			links[linkKey] = 0
		}
		links[linkKey] = links[linkKey] + 1
	})
	if (!titles[parseInt(paper.id)]){
		titles[parseInt(paper.id)] = `${paper.id} - ${paper.title} (${paper.year})`
	}

	// console.log(paper)
})

all_count = []
both = {}
Object.keys(links).forEach((linkKey)=>{
	all_count.push(links[linkKey])
	both[linkKey] = {links: links[linkKey],title:titles[linkKey]}
})


var total = 0;
for(var i = 0; i < all_count.length; i++) {
    total += all_count[i];
}
var avg = total / all_count.length;

console.log('mean',avg)

function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

console.log('median',median(all_count))

console.log(both)


// Create items array
var items = Object.keys(both).map(function(key) {
    return [both[key].links, both[key].title];
});

// Sort the array based on the second element
items.sort(function(first, second) {
    return second[0] - first[0];
});

console.log(items)

