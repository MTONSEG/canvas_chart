export class PieChart {
	constructor(canvasId, data) {
		this.canvas = document.getElementById(canvasId)
		this.ctx = this.canvas.getContext('2d')
		this.canvas.width = 700
		this.canvas.height = 400
		this.w = this.canvas.width
		this.h = this.canvas.height
		this.r = 150
		this.data = data

		this.init(true)
		this.drawPieChart()
		this.canvas.addEventListener('click', this.handleClick.bind(this))
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
		this.tooltip = document.querySelector('#pie-tooltip')
	}

	init(isSetup) {
		let positionBtn = [5, 5]

		for (let key in this.data) {
			const current = this.data[key]
			this.ctx.fillStyle = current.color
			current.button = this.drawButton(
				...positionBtn,
				30,
				15,
				key,
				current.show
			)

			positionBtn[1] += 20

			if (isSetup) {
				current.value = this.setData()
			}
		}
	}

	setData() {
		return Math.floor(Math.random() * 30) + 1
	}

	drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color) {
		this.ctx.fillStyle = color
		this.ctx.beginPath()
		this.ctx.moveTo(centerX, centerY)
		this.ctx.arc(centerX, centerY, radius, startAngle, endAngle)
		this.ctx.closePath()
		this.ctx.fill()
	}

	drawPieChart() {
		let totalValue = 0

		for (let key in this.data) {
			if (this.data[key].show) {
				totalValue += this.data[key].value
			}
		}

		let startAngle = 0

		for (let key in this.data) {
			if (this.data[key].show) {
				const sliceAngle = (this.data[key].value / totalValue) * 2 * Math.PI

				const segmentPosition = {
					x: this.w / 2,
					y: this.h / 2,
					r: this.r,
					startAngle,
					endAngle: startAngle + sliceAngle
				}

				this.data[key].segment = { ...segmentPosition }

				this.drawPieSlice(
					...Object.values(segmentPosition),
					this.data[key].color
				)

				startAngle += sliceAngle
			}
		}
	}

	drawButton(x, y, width, height, text, isShow) {
		this.ctx.font = '12px Arial'
		this.ctx.textBaseline = 'bottom'
		this.ctx.fillRect(x, y, width, height)
		this.ctx.fillText(text, x + width + 10, y + height)

		if (!isShow) {
			this.ctx.beginPath()
			this.ctx.moveTo(x + width + 10, y + height / 2)
			this.ctx.lineTo(
				x + width + 10 + this.ctx.measureText(text).width,
				y + height / 2
			)
			this.ctx.stroke()
		}

		return {
			x: x,
			y: y,
			width: width,
			height: height,
			textWidth: this.ctx.measureText(text).width + 10
		}
	}

	handleClick(event) {
		const mouseX = event.clientX - this.canvas.getBoundingClientRect().left
		const mouseY = event.clientY - this.canvas.getBoundingClientRect().top

		for (let key in this.data) {
			if (this.isInsideButton(mouseX, mouseY, this.data[key].button)) {
				this.data[key].show = !this.data[key].show
			}

			this.ctx.clearRect(
				this.data[key].button.x,
				this.data[key].button.y,
				this.data[key].button.width + this.data[key].button.textWidth,
				this.data[key].button.height
			)
		}

		this.init()
		this.drawPieChart()
	}

	isInsideButton(x, y, button) {
		return (
			x > button.x &&
			x < button.x + button.width &&
			y > button.y &&
			y < button.y + button.height
		)
	}

	handleMouseMove(e) {
		const mouseX = e.clientX - this.canvas.getBoundingClientRect().left
		const mouseY = e.clientY - this.canvas.getBoundingClientRect().top

		for (let key in this.data) {
			if (this.data[key].show) {
				const { x, y, startAngle, endAngle } = this.data[key].segment

				const dx = mouseX - x
				const dy = mouseY - y

				let angle = Math.atan2(dy, dx)

				angle = angle < 0 ? angle + 2 * Math.PI : angle

				const isClockwise = startAngle > endAngle
				const isInSegment = isClockwise
					? angle >= startAngle || angle <= endAngle
					: angle >= startAngle && angle <= endAngle

				if (isInSegment) {
					this.tooltip.innerHTML = `${key}: ${this.data[key].value}`
					this.tooltip.style.left = e.pageX + 10 + 'px'
					this.tooltip.style.top = e.pageY + 10 + 'px'
					this.tooltip.style.display = 'block'
					return
				}
			}
		}

		this.tooltip.style.display = 'none'
	}
}
