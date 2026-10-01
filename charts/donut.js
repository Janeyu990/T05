function drawDonutChart(data) {
	const container = d3.select("#donut-chart");
	if (container.empty() || !data?.length) return;

	const valueKey = "Mean(Labelled energy consumption (kWh/year))";
	const values = data.filter((row) => row.Screen_Tech && Number.isFinite(row[valueKey]) && row[valueKey] > 0);
	if (!values.length) return;

	const width = 600;
	const height = 320;
	const colors = ["#328574", "#d87845", "#7194ab", "#a7a84b"];
	const pie = d3.pie()
		.sort(null)
		.value((row) => row[valueKey]);
	const arc = d3.arc()
		.innerRadius(62)
		.outerRadius(108);
	const total = d3.sum(values, (row) => row[valueKey]);

	container.selectAll("*").remove();

	const svg = container.append("svg")
		.attr("class", "donut-chart")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Share of mean annual energy consumption by screen technology");

	const chart = svg.append("g")
		.attr("transform", "translate(174,160)");

	const formatValue = d3.format(",.1f");
	const formatPercent = d3.format(".1%");

	chart.selectAll(".slice")
		.data(pie(values))
		.join("path")
		.attr("class", "slice")
		.attr("d", arc)
		.attr("fill", (slice, index) => colors[index % colors.length])
		.append("title")
		.text((slice) => `${slice.data.Screen_Tech}: ${formatValue(slice.data[valueKey])} kWh/year (${formatPercent(slice.value / total)})`);

	chart.append("text")
		.attr("class", "center-label")
		.attr("text-anchor", "middle")
		.attr("y", -5)
		.text("Mean annual");
	chart.append("text")
		.attr("class", "center-label")
		.attr("text-anchor", "middle")
		.attr("y", 14)
		.text("consumption");

	const legend = svg.append("g")
		.attr("transform", "translate(340,104)");

	const items = legend.selectAll("g")
		.data(pie(values))
		.join("g")
		.attr("transform", (slice, index) => `translate(0,${index * 42})`);

	items.append("circle")
		.attr("r", 6)
		.attr("fill", (slice, index) => colors[index % colors.length]);

	items.append("text")
		.attr("class", "legend-label")
		.attr("x", 14)
		.attr("y", 4)
		.text((slice) => `${slice.data.Screen_Tech}  ${formatValue(slice.data[valueKey])} kWh (${formatPercent(slice.value / total)})`);
}

document.addEventListener("data-loaded", (event) => {
	drawDonutChart(event.detail.tvEnergyAllSizes);
});

if (window.chartData?.tvEnergyAllSizes) {
	drawDonutChart(window.chartData.tvEnergyAllSizes);
}