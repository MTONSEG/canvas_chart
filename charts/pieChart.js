export class PieChart {
	constructor(canvasId, data) {
		this.canvas = document.getElementById(canvasId)
		this.ctx = this.canvas.getContext('2d')
		this.tooltip = document.querySelector('#pie-tooltip')
		this.updateBtn = document.querySelector('.pie-btn#update')
		this.addBtn = document.querySelector('.pie-btn#add')

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
		this.updateBtn.addEventListener('click', this.handleUpdate.bind(this))
		this.addBtn.addEventListener('click', this.handleAddData.bind(this))
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
				current.value = this.setValue()
			}
		}
	}

	setValue() {
		return Math.floor(Math.random() * 30) + 1
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
			if (!this.data[key].show) continue

			const sliceAngle = (this.data[key].value / totalValue) * 2 * Math.PI
			const path = new Path2D()

			path.moveTo(this.w / 2, this.h / 2)
			path.arc(
				this.w / 2,
				this.h / 2,
				this.r,
				startAngle,
				startAngle + sliceAngle
			)
			path.closePath()

			this.ctx.fillStyle = this.data[key].color
			this.ctx.fill(path)

			this.data[key].path = path

			startAngle += sliceAngle
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

	handleClick(e) {
		const mouseX = e.clientX - this.canvas.getBoundingClientRect().left
		const mouseY = e.clientY - this.canvas.getBoundingClientRect().top

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
			if (
				this.data[key].show &&
				this.ctx.isPointInPath(this.data[key].path, mouseX, mouseY)
			) {
				this.tooltip.innerHTML = `${key}: ${this.data[key].value}`
				this.tooltip.style.left = e.pageX + 10 + 'px'
				this.tooltip.style.top = e.pageY + 10 + 'px'
				this.tooltip.style.display = 'block'
				this.tooltip.style.background = 'black'
				return
			}
		}

		this.tooltip.style.display = 'none'
	}

	handleUpdate() {
		this.ctx.clearRect(0, 0, this.w, this.h)

		this.init(true)
		this.drawPieChart()
	}

	handleAddData() {
		this.data.violet = {
			color: 'violet',
			value: null,
			show: true,
			button: null
		}

		this.init(true)
		this.drawPieChart()
	}
}
