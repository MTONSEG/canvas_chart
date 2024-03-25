const canvas = document.querySelector('canvas#vertical')
const ctx = canvas.getContext('2d')
const buttons = document.querySelectorAll('.btn')
const refreshBtn = document.querySelector('.refresh-btn')
const tooltip = document.querySelector('.tooltip')

canvas.width = 700
canvas.height = 400

const w = canvas.width
const h = canvas.height
const gap = 5
const countYear = 5

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

		for (let i = 0; i < countYear; i++) {
			current.push({ value: setYearData() })
		}
	}
}

function init() {
	ctx.strokeStyle = 'black'
	ctx.beginPath()
	ctx.rect(0, 0, w, h)
	ctx.stroke()

	for (let i = 0, x = w / countYear; x < w; i++, x += w / countYear) {
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
		const year = data[key].yearData
		const colors = data[key].colors

		if (data[key].show) {
			list.push({ year, colors })
		}
	}

	for (
		let k = 0, d = 0;
		k < list.length;
		k++, d += w / countYear / list.length
	) {
		for (let i = 0, x = 0; i < countYear; i++, x += w / countYear) {
			ctx.fillStyle = list[k].colors[0]
			ctx.strokeStyle = list[k].colors[1]

			const positionX = x + gap + d
			const positionY = getValue(list[k].year[i].value)
			const columnWidth = w / countYear / list.length - gap * 2

			const columnData = {
				value: list[k].year[i].value,
				x: positionX,
				y: positionY,
				w: columnWidth,
				h
			}

			list[k].year[i] = columnData

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

	for (let key in data) {
		const { yearData, colors } = data[key]

		if (data[key].show) {
			for (let i = 0; i < countYear; i++) {
				const column = yearData[i]

				if (
					mouseX > column.x &&
					mouseX < column.x + column.w &&
					mouseY > column.y &&
					mouseY < h
				) {
					tooltip.innerHTML = `
					${toUpperFirstLetter(key)}: ${column.value}`

					tooltip.style.display = 'block'
					tooltip.style.background = colors[1]
					tooltip.style.left = e.pageX + 10 + 'px'
					tooltip.style.top = e.pageY + 10 + 'px'
					return
				}
			}
		}
	}

	tooltip.style.display = 'none'
}

function toUpperFirstLetter(text) {
	return text.charAt(0).toUpperCase() + text.slice(1)
}
