import { PieChart } from './charts/pieChart.js'
import { VerticalBarChart } from './charts/verticalChart.js'

const verticalData = {
	apple: { colors: ['pink', 'violet'], yearData: [], show: true },
	samsung: { colors: ['yellow', 'orange'], yearData: [], show: true },
	xiaomi: { colors: ['lime', 'green'], yearData: [], show: true },
	nokia: { colors: ['violet', 'violet'], yearData: [], show: true }
}

const pieData = {
	red: { color: 'red', value: null, show: true, button: null },
	orange: { color: 'orange', value: null, show: true, button: null },
	blue: { color: 'blue', value: null, show: true, button: null },
	green: { color: 'green', value: null, show: true, button: null }
}

const verticalBarChart = new VerticalBarChart(
	'vertical',
	'.btn',
	'.refresh-btn',
	'.tooltip',
	verticalData
)

const pieChart = new PieChart('pie', pieData)
