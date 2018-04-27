(function() {
	var viz = {
		id: "highcharts_waterfall",
		label: "Waterfall",
		options: {
			chartName: {
				section: "Chart",
				label: "Chart Name",
				type: "string",
			},
			firstColumnName: {
				section: "Chart",
				label: "First Column Name",
				type: "string",
			},
			yAxisName: {
				section: "Chart",
				label: "Y Axis Name",
				type: "string",
			},
			color_range: {
				section: "Chart",
				type: "array",
				label: "Color Range",
				display: "colors",
				default: ["#dd3333", "#80ce5d", "#f78131", "#369dc1", "#c572d3", "#36c1b3", "#b57052", "#ed69af"],
			},
			totalColor: {
				type: "string",
				label: "Color for totals",
				display: "color",
				default: "#5245ed",
			}
		},
		// Set up the initial state of the visualization
		create: function(element, config) {
			var css = element.innerHTML = `
				<style>
					.remove-me {
					}

					.looker-waterfall-chart {
						height: 100%;
						width: 100%;
					}
				</style>
				<div id="looker-waterfall-chart" class="looker-waterfall-chart"></div>
			`;
		},
		// Render in response to the data or settings changing
		update: function(data, element, config, queryResponse) {
			formattedLog(data, queryResponse, config);
			if (!handleErrors(this, queryResponse, {
				min_dimensions: 1,
				max_dimensions: 1,
				min_measures: 1,
				max_measures: 1,
			})) return;

			let x = queryResponse.fields.dimension_like[0]
			let y = queryResponse.fields.measure_like[0]
			let xCategories = data.map(function(row) { return row[x.name].value })

			let series = []
			let pivots = Object.keys(data[0][y.name]) //Cancelled, Complete

			for (i = 0; i < pivots.length; i++) {
				pivot = pivots[i]

				let totalValue = data.reduce((prev, curr) => {
					return prev + curr[y.name][pivot].value
				}, 0)

				let seriesData = data.map(function(row) {

					return {
						drill: row[y.name][pivot].links[0],
						value: row[y.name][pivot].value / totalValue * -100
					};
				})

				console.log('Totalvalue: ', totalValue)
				console.log(seriesData)

				series.push({
					color: config.color_range[i],
					data: seriesData
				})
			}

			console.log('Series:', series)

			//let myChart = Highcharts.chart(element, options);
			Highcharts.chart(element.querySelector('#looker-waterfall-chart'), {
				chart: {
					type: 'waterfall'
				}, title: {
					text: config.chartName
				}, xAxis: {
					categories: [config.firstColumnName, ...xCategories]
				}, yAxis: {
					labels: {
						formatter: function() {
							return this.value+"%";
						},
						minorTickInterval: 10
					},
					title: {
						text: ''
					},
					tickAmount: 11,
					max: 100,
					min: 0
				}, legend: {
					enabled: false
				},
				colors: ['#275cae', '#2e9078'],
				//tooltip: {
					//pointFormat: '<b>${point.y:,.2f}</b> USD'
				//},

				series: [{
					data: [{
						y: 100,
						className: 'move-me',
					}, ...series[0].data.map(row => (
						{
							y: row.value,

							events: {
								click: function(event) {
									link = {
										label: row.drill.label,
										type: 'url',
										type_label: 'Url',
										url: row.drill.url
									}
									window.LookerCharts.Utils.openDrillMenu({links: [link], event})
								}
							}
						}
					))],
					pointPadding: 0,
					dataLabels: {
						enabled: true,
						formatter: function() {
							var multiplier = (this.y < 0)
							return Highcharts.numberFormat(Math.abs(this.y), 0, ',') + '%';
						},
						style: {
							fontWeight: 'bold'
						}
					},
				}, {
					data: [{
						y: 100,
						className: 'remove-me',
						dataLabels: {
							enabled: false
						}
					}, ...series[1].data.map(row => (
						{
							y: row.value,
							events: {
								click: function(event) {
									link = {
										label: row.drill.label,
										type: 'url',
										type_label: 'Url',
										url: row.drill.url
									}
									window.LookerCharts.Utils.openDrillMenu({links: [link], event})
								}
							}
						}
					))],
					pointPadding: 0,
					dataLabels: {
						enabled: true,
						formatter: function() {
							return Highcharts.numberFormat(Math.abs(this.y), 0, ',') + '%';
						},
						style: {
							fontWeight: 'bold'
						}
					},
				}],
			});
		}
	};
	looker.plugins.visualizations.add(viz);
}());
