const fs = require('fs')
const H = require('highland')

var papers = JSON.parse(fs.readFileSync('./data/rfc_index.json', 'utf8'))


H(papers)
	.map((paper) =>{
		try{
			var text = fs.readFileSync(`./data/RFC-all/rfc${parseInt(paper.id)}.txt`, 'utf8')
		}catch (E){
			console.log(`./data/RFC-all/rfc${parseInt(paper.id)}.txt`,'Dose not exist')
			return ''
		}

		var m = text.match(/(RFC[0-9]+\s|RFC\s[0-9]+\s|RFC\s[0-9]+\.|\[RFC[0-9]+\]|RFC\s#[0-9]|RFC\s[0-9]+\,|RFC\-[0-9]+)/g)
		if (!m) {
			console.log('No Refs:',`./data/RFC-all/rfc${parseInt(paper.id)}.txt`)
		}else{
			paper.links = {}
			m.forEach((aRfcLink) =>{
				var rfcNumber = aRfcLink.match(/[0-9]+/)
				if (rfcNumber){
					if (parseInt(rfcNumber[0])!==parseInt(paper.id)){
						if (!paper.links[parseInt(rfcNumber[0])]) paper.links[parseInt(rfcNumber[0])] = 0
						paper.links[parseInt(rfcNumber[0])]++
					}
				}else{
					console.log('No number',aRfcLink)
				}
			})
		}

	})
	.compact()
	.done(()=>{
		fs.writeFileSync('./data/rfc_index_with_links.json',JSON.stringify(papers,null,2))
	})

