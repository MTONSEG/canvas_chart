const canvas = document.querySelector('canvas#pie')
const ctx = canvas.getContext('2d')

canvas.width = 700
canvas.height = 400

canvas.addEventListener('click', handleClick)

const w = canvas.width
const h = canvas.height
const r = 150

const data = {
	red: {
		color: 'red',
		value: null,
		show: true,
		button: null
	},
	orange: {
		color: 'orange',
		value: null,
		show: true,
		button: null
	},
	blue: {
		color: 'blue',
		value: null,
		show: true,
		button: null
	},
	green: {
		color: 'green',
		value: null,
		show: true,
		button: null
	}
}

init(true)
drawPieChart()

function init(isSetup) {
	let positionBtn = [5, 5]

	for (let key in data) {
		const current = data[key]

		ctx.fillStyle = current.color

		current.button = drawButton(...positionBtn, 30, 15, key, current.show)

		positionBtn[1] = positionBtn[1] += 20

		if (isSetup) {
			current.value = setData()
		}
	}
}

function setData() {
	return Math.floor(Math.random() * 30) + 1
}

function drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color) {
	ctx.fillStyle = color
	ctx.beginPath()
	ctx.moveTo(centerX, centerY)
	ctx.arc(centerX, centerY, radius, startAngle, endAngle)
	ctx.closePath()
	ctx.fill()
}

function drawPieChart() {
	let totalValue = 0

	for (let key in data) {
		if (data[key].show) {
			totalValue += data[key].value
		}
	}

	let startAngle = 0

	for (let key in data) {
		if (data[key].show) {
			const sliceAngle = (data[key].value / totalValue) * 2 * Math.PI

			drawPieSlice(
				w / 2,
				h / 2,
				r,
				startAngle,
				startAngle + sliceAngle,
				data[key].color
			)

			startAngle += sliceAngle
		}
	}
}

function drawButton(x, y, width, height, text, isShow) {
	ctx.font = '12px Arial'
	ctx.textBaseline = 'bottom'
	ctx.fillRect(x, y, width, height)
	ctx.fillText(text, x + width + 10, y + height)

	!isShow && setThrough()

	function setThrough() {
		ctx.beginPath()
		ctx.moveTo(x + width + 10, y + height / 2)
		ctx.lineTo(x + width + 10 + ctx.measureText(text).width, y + height / 2)
		ctx.stroke()
	}

	return {
		x: x,
		y: y,
		width: width,
		height: height,
		textWidth: ctx.measureText(text).width + 10
	}
}

function handleClick(event) {
	const mouseX = event.clientX - canvas.getBoundingClientRect().left
	const mouseY = event.clientY - canvas.getBoundingClientRect().top

	for (let key in data) {
		if (isInsideButton(mouseX, mouseY, data[key].button)) {
			data[key].show = !data[key].show
		}

		ctx.clearRect(
			data[key].button.x,
			data[key].button.y,
			data[key].button.width + data[key].button.textWidth,
			data[key].button.height
		)
	}

	init()
	drawPieChart()
}

function isInsideButton(x, y, button) {
	return (
		x > button.x &&
		x < button.x + button.width &&
		y > button.y &&
		y < button.y + button.height
	)
}
