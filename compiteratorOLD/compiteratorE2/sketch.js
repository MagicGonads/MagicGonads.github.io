var g = {}

function iterate() {
	x0 = exp(g.t.x)
	y0 = log(abs(g.t.y)+1)*(g.t.y<0 ? -1 : 1)
	x1 = g.attr.x-g.pnt.x
	y1 = g.attr.y-g.pnt.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	R = sqrt(x1*x1+y1*y1)
	x3 = x2+(x0*x1-y0*y1)/R
	y3 = y2+(x0*y1+x1*y0)/R
	g.pnt.x=x3
	g.pnt.y=y3
}

function mod(a,b){
	return a-b*int(a/b)
}

function setup() {
	g.cr = 1
	g.reps = 500
	g.radi = 10
	g.scali = 360
	g.prob = 0.5
	g.pnt = createVector(0,0)
	g.t = createVector(1/2,0)
	g.attrs = [[
			createVector(0,2/sqrt(3)),
			createVector(1,-1/sqrt(3)),
			createVector(-1,-1/sqrt(3)),
		],
		[
			createVector(0,-2/sqrt(3)),
			createVector(1,1/sqrt(3)),
			createVector(-1,1/sqrt(3)),
		]
	]
	createCanvas(windowWidth*g.cr,windowHeight*g.cr)
	g.g = createGraphics(width,height)
	t = min(width,height)/(1080*g.cr)
	g.scal = g.scali*t
	g.rad = g.radi*t
	g.x = width/2
	g.y = height/2
	background(0)
	g.g.noStroke()
	colorMode(HSB,360)
	g.g.colorMode(HSB,360)
	angleMode(DEGREES)
	textSize(20*t)
	textFont('Consolas')
	g.set=g.attrs[0]
	g.addr=0
	g.edit=1
	g.col=1
	g.colm=5
	g.excl=0
	g.excn=0
	g.mem=1
}

function draw() {
	background(0)
	translate(g.x,g.y)
	if (g.edit) {
		len = g.attrs.length
		brk = []
		brek = 1
		for (var i=0;i<len;i++) {
			attrs = g.attrs[i]
			len2 = attrs.length
			for (var k=0;k<len2;k++) {
				attr = attrs[k]
				brek = 1
				if(mouseIsPressed){
					tempos = createVector(mouseX-g.x,-mouseY+g.y).div(g.scal)
					if (g.scal*tempos.dist(attr)<g.rad) {
						if (attrs.length>1){ 
								brk.push([i,k])
								brek = 0
						}
				}
				}
				if(brek){
					fill(360*i/len,360,360)
					ellipse(attr.x*g.scal,-attr.y*g.scal,g.rad,g.rad)
				}
			}
		}
		for (var i = 0; i<brk.length;i++){
		g.attrs[brk[i][0]].splice(brk[i][1],1)
		}
		if(!(mouseX>-g.x && mouseX<9*g.x/20-g.rad && mouseY<25/18*g.y/2)){
			fill(10)
			rect(-g.x,-g.y,17/20*g.x/2+g.rad,12/10*g.y/2+g.rad*5)
			fill(360)
			text(
				'Controls\n'+
				'Space: Toggle Render/Edit\n'+
				'ALT (Hold) + LMB: Add Node\n'+
				'LMB (Hold): Delete Node\n'+
				'Up: New Layer\n'+
				'Down: Delete Top Layer\n'+
				'Right: Next Layer\n'+
				'Left: Previous Layer\n'+
				'B: Cycle Colour Mode\n'+
				'N: Toggle Node Reselection\n'+
				'M: Toggle Layer Reselection\n'+
				'<: Decrease Cycle Depth\n'+
				'>: Increase Cycle Depth\n'+
				'Enter: Save Image'
			,-g.x+2*g.rad,g.rad-g.y,9/10*g.x/2,12/10*g.y/2+g.rad*4)
		}	
	}
	else { 
		for (var i = 0;i<g.reps/(g.mem+(g.mem==0));i++){
			ph=g.pnt.copy()
			if(mouseIsPressed){
				g.t.x=(mouseX-g.x)/g.scal
				g.t.y=-(mouseY-g.y)/g.scal
				//g.g.clear()
			}
			for(var m=0;m<(g.mem+(g.mem==0));m++){
			if (random(1)>g.prob){
				if(g.excl && g.attrs.length>1){
					_set = []
					for (var k=0;k<g.attrs.length;k++){
						a=g.attrs[k]
						if(a!=g.set){
							_set.push(g.attrs[k])
						}
					}
					g.set = random(_set)
				}
				else{
					g.set = random(g.attrs)
				}
			}
			if(g.excn && g.set.length>1){
				_set = []
				for (var k=0;k<g.set.length;k++){
					a=g.set[k]
					if(a!=g.attr){
					_set.push(g.set[k])
					}
				}
				g.attr = random(_set)
			}
			else{
				g.attr = random(g.set)
			}
			iterate()
		    }
			if(g.mem==0){
				ph=g.pnt.copy()
			}
			switch(g.col){
				case 1:
					h = ph.heading()
					if (h<0){
						h+=360
					}
					g.g.fill(h,360,360)
					break
				case 2:
					h = 180*ph.mag()
					if (h<0){
						h+=360
					}
					if (h>360){
						h-=360
					}
					g.g.fill(h,360,360)
					break
				case 3:
					h = g.pnt.heading()-ph.heading()
					if (h<0){
						h+=360
					}
					g.g.fill(h,360,360)
					break
				case 4:
					h = 180*(g.pnt.mag()-ph.mag())
					if (h<0){
						h+=360
					}
					if (h>360){
						h-=360
					}
					g.g.fill(h,360,360)
					break
				default:
					g.g.fill(360)
				}
			g.g.ellipse(g.pnt.x*g.scal+g.x,-g.pnt.y*g.scal+g.y,0.25,0.25)
		}
		image(g.g,-g.x,-g.y,width,height)
	}
}

function windowResized() {
	resizeCanvas(windowWidth*g.cr,windowHeight*g.cr)
	t = min(width,height)/(1080*g.cr)
	g.g = createGraphics(width,height)
	g.scal = g.scali*t
	g.rad = g.radi*t
	g.x = width/2
	g.y = height/2
	textSize(20*t)
	g.g.colorMode(HSB,360)
	g.g.noStroke()
}

function keyPressed() {
	print(keyCode)

	if (keyCode==32){
		g.edit = !g.edit
		g.g.clear()
	}
	if (g.edit){
		switch (keyCode){
			case 37:
			if (g.addr){
				g.addr--
			}
			break
			case 38:
			g.attrs.push([])
			break
			case 39:
			if (g.addr<g.attrs.length-1){
				g.addr++
			}
			break
			case 40:
			if (g.attrs.length>1){
				g.attrs.pop()
				if (g.addr>=g.attrs.length){
					g.addr=g.attrs.length-1
				}
			}
			break
			default:
			
		}
	}
	else{
		if (keyCode==13){
			saveCanvas('compiterator.png')
		}
		if (keyCode==66){
			g.col++
			if(g.col>=g.colm){
			g.col=0
			}
			g.g.clear()
		}
		if (keyCode==78){
			g.excn=!g.excn
			g.g.clear()
		}
		if (keyCode==77){
			g.excl=!g.excl
			g.g.clear()
		}
		if (keyCode==188&&g.mem){
			g.mem--
			g.g.clear()
		}
		if (keyCode==190){
			g.mem++
			g.g.clear()
		}
	}
}

function mouseClicked(){
	if (keyCode==18 && keyIsPressed && g.edit){
		g.attrs[g.addr].push(createVector(mouseX-g.x,g.y-mouseY).div(g.scal))
	}
}
