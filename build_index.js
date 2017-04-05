const H = require('highland')
const fs = require('fs')

var rfcPaper = { lines: [] }
var papers = []

H(fs.createReadStream('data/RFC-all/rfc-index.txt'))
	.split()
	.map((line)=>{
		if (/^[0-9]{4}\s/.test(line)){
			if (rfcPaper.lines.length>0 && rfcPaper.lines.join().search('RFC INDEX') === -1){
				var full = rfcPaper.lines.join(' ')
				var m = full.match(/^([0-9]{4})\s(.*?)\.\s(([A-Z]\.|[A-Z]{2}\.|[A-Z]{2}\s|[A-Z]\-[A-Z]\.|[A-Z]\([A-Z]\)|Network Information Center|Information Sciences Institute|International Telegraph|National Bureau of Standards|International Organization|ISO\.\s|Bolt Beranek|National Research Council|Gateway Algorithms and|National Science Foundation|NetBIOS Working Group|Sun Microsystems|Defense Advanced Research|North American Directory Forum|ESCC X\.500\/X\.400 Task Force|ACM SIGUCCS|Internet Architecture Board|Vietnamese Standardization Working Group|Juha Heinanen|Internet Engineering Steering Group|EARN Staff|RARE WG-MSG|IETF Secretariat|Internet Assigned Numbers Authority|Federal Networking Council|The North American Directory Forum|IAB, IESG|Audio-Video Transport Working Group|ISOC Board of Trustees|KOI8-U Working Group|The Internet Society|RFC Editor|IAB, L. Daigle|IANA\.\s|IAB Advisory Committee|Y Lim, D. Singer|A Colegrove, H Harney|IAB, P\. Faltstrom).*?)((January|February|March|April|May|June|July|August|September|October|November|December)\s([0-9]{4}))/)
				if (m){
					rfcPaper.full = full
					rfcPaper.id = m[1]
					rfcPaper.title = m[2].trim()
					rfcPaper.author = m[3].trim()
					rfcPaper.month = m[6]
					rfcPaper.year = m[7]	
					var statusM = full.match(/\(Status:\s(.*?)\)/)
					var doiM = full.match(/\(DOI:\s(.*?)\)/)
					rfcPaper.status = (statusM) ? statusM[1] : null
					rfcPaper.doi = (doiM) ? doiM[1] : null
					papers.push(rfcPaper)
				}
			}
			rfcPaper = { lines: [] }
			rfcPaper.lines.push(line.trim())
		}else{
			rfcPaper.lines.push(line.trim())			
		}
	})
	.done(()=>{

		fs.writeFileSync('./data/rfc_index.json',JSON.stringify(papers,null,2))

	})
	