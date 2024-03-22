const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const buttons = document.querySelectorAll('.btn')
const refreshBtn = document.querySelector('.refresh-btn')

canvas.width = 700
canvas.height = 400

const w = canvas.width
const h = canvas.height
const gap = 5
const amountYears = 5

const data = {
	apple: {
		colors: ['pink', 'violet'],
		yearData: [],
		show: true
	},
	samsung: {
		colors: ['yellow', 'orange'],
		yearData: [],
		show: true
	},
	xiaomi: {
		colors: ['lime', 'green'],
		yearData: [],
		show: true
	},
	nokia: {
		colors: ['violet', 'violet'],
		yearData: [],
		show: true
	}
}

const keysData = Object.keys(data)

init()
createData()
drawDiagram()

function createData() {
	for (let key in data) {
		const current = data[key].yearData

		if (current.length) current.length = 0

		for (let i = 0; i < amountYears; i++) {
			current.push(setYearData())
		}
	}
}

function init() {
	ctx.strokeStyle = 'black'
	ctx.beginPath()
	ctx.rect(0, 0, w, h)
	ctx.stroke()

	for (let i = 0, x = w / amountYears; x < w; i++, x += w / amountYears) {
		setLine(x, 0, x, h)
	}

	for (let i = 0, y = h / 10; y < h; i++, y += h / 10) {
		setLine(0, y, w, y)
	}

	for (let btn of buttons) {
		const dataset = btn.getAttribute('data-set')
		const isShow = data[dataset].show

		btn.onclick = () => {
			data[dataset].show = !data[dataset].show
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			init()
			drawDiagram()
		}

		btn.style.borderColor = data[dataset].colors[1]
		btn.style.background = isShow ? data[dataset].colors[0] : 'transparent'
	}
}

function drawDiagram() {
	const list = []

	for (let key in data) {
		if (data[key].show) {
			list.push({ value: data[key].yearData, colors: data[key].colors })
		}
	}

	for (
		let k = 0, d = 0;
		k < list.length;
		k++, d += w / amountYears / list.length
	) {
		for (let i = 0, x = 0; i < amountYears; i++, x += w / amountYears) {
			ctx.fillStyle = list[k].colors[0]
			ctx.strokeStyle = list[k].colors[1]

			const positionX = x + gap + d
			const positionY = getValue(list[k].value[i])
			const columnWidth = w / amountYears / list.length - gap * 2

			setGraph(positionX, positionY, columnWidth, h)
		}
	}
}

function setYearData() {
	return Math.floor(Math.random() * 100) + 1
}

function getValue(value) {
	return h - h * (value * 0.01)
}

function setLine(x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
}

function setGraph(x, y, w, h) {
	ctx.beginPath()
	ctx.rect(x, y, w, h)
	ctx.fill()
	ctx.stroke()
}

refreshBtn.onclick = () => {
	ctx.clearRect(0, 0, w, h)

	init()
	createData()
	drawDiagram()
}

canvas.onmousemove = (e) => {
	const mouseX = e.offsetX
	const mouseY = e.offsetY

}
