from PIL import Image, ImageDraw, ImageFont
import math, json


data = json.load(open('../data/rfc_d3_format.json'))
counter = 0
lookup = []
lookupGroup = []
colorLookup = {
	0:(0, 153, 198,255),
	1:(153, 0, 153,255),
	2:(16, 150, 24,255),
	3:(255, 153, 0,255),
	4:(220, 57, 18,255),
	5:(51, 102, 204,255)
}
height = 10000
width = 190600
bottomMargin = 950


# height = 10000
# width = 10000


canvas = Image.new('RGBA', (width,height), (255,255,255,255))
d = ImageDraw.Draw(canvas)

for node in data['nodes']:
	counter+=1
	node['pos'] = [(counter*20),height-bottomMargin,(counter*20+20),height-(bottomMargin-20)]
	counter+=0.2
	lookup.append(node['pos'])
	lookupGroup.append(colorLookup[node['group']])
	d.rectangle(node['pos'], fill=colorLookup[node['group']])

	if len(node['name'])>115:
		node['name'] = node['name'][0:112] + '...'
	text = node['name']
	font = ImageFont.truetype('Tahoma.ttf', 18)
	fontWidth, fontHeight = font.getsize(text)

	image2 = Image.new('RGBA', (fontWidth, fontHeight))
	draw2 = ImageDraw.Draw(image2)
	draw2.text((0, 0), text=text, font=font, fill=(0, 0, 0,200))
	image2 = image2.rotate(-70, expand=1)

	px, py = int(node['pos'][0]), int(node['pos'][3])
	sx, sy = image2.size
	canvas.paste(image2, (px, py, px + sx, py + sy), image2)

	if int(counter) % 1000 == 0:
		print("building nodes:",int(counter))






counter= 0
for link in data['links']:
	source = lookup[link['source']]
	target = lookup[link['target']]

	dist = abs(source[0] - target[0]) / 2

	if source[0] < target[0]:
		x0 = source[0]
		x1 = target[0]
	else:
		x0 = target[0]
		x1 = source[0]

	#bump it to the middle of the 20x20 node
	x0+=10
	x1+=10

	y0 = height-bottomMargin-(dist/2)
	y1 = height-bottomMargin+(dist/2)
	bbox = [x0,y0,x1,y1]

	# d.rectangle(bbox, fill=(255,255,255,100))

	# arc(d,bbox,180,360,fill=(0,0,0,200),width=10)
	color = lookupGroup[link['source']]
	color = (color[0],color[1],color[2],200)	
	d.arc(bbox,180,360,fill=color)

	counter+=1
	if int(counter) % 1000 == 0:
		print("building links:",int(counter))

	# if counter > 1000:
	# 	break


# bbox = [0,10,50,500]

# d.arc(((0,0),(100,100)),3,3,fill= "blue")
# d.rectangle(bbox, fill="white", outline = "blue")
# arc(d,bbox,180,360,fill=(0,0,0,100),width=2)

canvas.save('test.png', "PNG")