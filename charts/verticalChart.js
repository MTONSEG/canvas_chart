export class VerticalBarChart {
	constructor(canvasId, data) {
		this.canvas = document.getElementById(canvasId)
		this.ctx = this.canvas.getContext('2d')
		this.buttons = document.querySelectorAll('.btn')
		this.refreshBtn = document.querySelector('.refresh-btn')
		this.tooltip = document.querySelector('.tooltip')

		this.data = data
		this.canvas.width = 700
		this.canvas.height = 400
		this.w = this.canvas.width
		this.h = this.canvas.height
		this.gap = 5
		this.countYear = 5

		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
		this.refreshBtn.addEventListener('click', this.handleRefresh.bind(this))

		this.init()
		this.createData()
		this.drawDiagram()
	}

	createData() {
		for (let key in this.data) {
			const current = this.data[key].yearData

			if (current.length) current.length = 0

			for (let i = 0; i < this.countYear; i++) {
				current.push({ value: this.setYearData() })
			}
		}
	}

	init() {
		this.ctx.strokeStyle = 'black'
		this.ctx.beginPath()
		this.ctx.rect(0, 0, this.w, this.h)
		this.ctx.stroke()

		for (
			let i = 0, x = this.w / this.countYear;
			x < this.w;
			i++, x += this.w / this.countYear
		) {
			this.setLine(x, 0, x, this.h)
		}

		for (let i = 0, y = this.h / 10; y < this.h; i++, y += this.h / 10) {
			this.setLine(0, y, this.w, y)
		}

		this.buttons.forEach((btn) => {
			const dataset = btn.getAttribute('data-set')
			const isShow = this.data[dataset].show

			btn.onclick = () => {
				this.data[dataset].show = !this.data[dataset].show
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
				this.init()
				this.drawDiagram()
			}

			btn.style.borderColor = this.data[dataset].colors[1]
			btn.style.background = isShow
				? this.data[dataset].colors[0]
				: 'transparent'
		})
	}

	drawDiagram() {
		const list = []

		for (let key in this.data) {
			const year = this.data[key].yearData
			const colors = this.data[key].colors

			if (this.data[key].show) {
				list.push({ year, colors })
			}
		}

		for (
			let k = 0, d = 0;
			k < list.length;
			k++, d += this.w / this.countYear / list.length
		) {
			for (
				let i = 0, x = 0;
				i < this.countYear;
				i++, x += this.w / this.countYear
			) {
				this.ctx.fillStyle = list[k].colors[0]
				this.ctx.strokeStyle = list[k].colors[1]

				const positionX = x + this.gap + d
				const positionY = this.getValue(list[k].year[i].value)
				const columnWidth = this.w / this.countYear / list.length - this.gap * 2
				
				const columnData = {
					value: list[k].year[i].value,
					x: positionX,
					y: positionY,
					w: columnWidth,
					h: this.h
				}

				list[k].year[i] = columnData

				this.setGraph(positionX, positionY, columnWidth, this.h)
			}
		}
	}

	setYearData() {
		return Math.floor(Math.random() * 100) + 1
	}

	getValue(value) {
		return this.h - this.h * (value * 0.01)
	}

	setLine(x1, y1, x2, y2) {
		this.ctx.beginPath()
		this.ctx.moveTo(x1, y1)
		this.ctx.lineTo(x2, y2)
		this.ctx.stroke()
	}

	setGraph(x, y, w, h) {
		this.ctx.beginPath()
		this.ctx.rect(x, y, w, h)
		this.ctx.fill()
		this.ctx.stroke()
	}

	handleRefresh() {
		this.ctx.clearRect(0, 0, this.w, this.h)
		this.init()
		this.createData()
		this.drawDiagram()
	}

	handleMouseMove(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY

		for (let key in this.data) {
			const { yearData, colors } = this.data[key]

			if (this.data[key].show) {
				for (let i = 0; i < this.countYear; i++) {
					const column = yearData[i]

					if (
						mouseX > column.x &&
						mouseX < column.x + column.w &&
						mouseY > column.y &&
						mouseY < this.h
					) {
						this.tooltip.innerHTML = `${this.upperFirstLetter(key)}: ${
							column.value
						}`
						this.tooltip.style.display = 'block'
						this.tooltip.style.background = colors[1]
						this.tooltip.style.left = e.pageX + 10 + 'px'
						this.tooltip.style.top = e.pageY + 10 + 'px'
						return
					}
				}
			}
		}

		this.tooltip.style.display = 'none'
	}

	upperFirstLetter(text) {
		return text.charAt(0).toUpperCase() + text.slice(1)
	}
}