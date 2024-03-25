import { PieChart } from './charts/pieChart.js'
import { VerticalBarChart } from './charts/verticalChart.js'

document.addEventListener('DOMContentLoaded', () => {
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

	const verticalBarChart = new VerticalBarChart('vertical', verticalData)
	const pieChart = new PieChart('pie', pieData)

	gsap.registerPlugin(ScrollTrigger)

	// ScrollTrigger.create({
	// 	trigger: '.vartical-section',
	// 	markers: true,
	// 	toggleActions: 'reverse pause resume reset',
	// 	opacity: 1,
		
	// })

	// gsap.to('.vartical-section', {
	// 	scrollTrigger: {
	// 		trigger: '.vartical-section',
	// 		markers: true,
	// 	},
	// 	duration: 1,
	// 	opacity: 1
	// })
})
