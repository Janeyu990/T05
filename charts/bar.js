function drawBarChart(data) {
	const container = d3.select("#bar-chart");
	if (container.empty() || !data?.length) return;

	const width = 600;
	const height = 320;
	const margin = { top: 16, right: 20, bottom: 56, left: 78 };
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;
	const valueKey = "Mean(Labelled energy consumption (kWh/year))";
	const values = data.filter((row) => Number.isFinite(row[valueKey]));

	const x = d3.scaleBand()
		.domain(values.map((row) => row.Screen_Tech))
		.range([0, chartWidth])
		.padding(0.28);
	const y = d3.scaleLinear()
		.domain([0, d3.max(values, (row) => row[valueKey]) * 1.1])
		.nice()
		.range([chartHeight, 0]);

	container.selectAll("*").remove();

	const svg = container.append("svg")
		.attr("class", "bar-chart")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Average annual energy consumption by screen technology");

	const chart = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	chart.append("g")
		.attr("class", "grid")
		.call(d3.axisLeft(y).ticks(5).tickSize(-chartWidth).tickFormat(""));

	chart.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(y).ticks(5));

	chart.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(0,${chartHeight})`)
		.call(d3.axisBottom(x));

	chart.selectAll(".bar")
		.data(values)
		.join("rect")
		.attr("class", "bar")
		.attr("x", (row) => x(row.Screen_Tech))
		.attr("y", (row) => y(row[valueKey]))
		.attr("width", x.bandwidth())
		.attr("height", (row) => chartHeight - y(row[valueKey]))
		.append("title")
		.text((row) => `${row.Screen_Tech}: ${d3.format(",.1f")(row[valueKey])} kWh/year`);

	chart.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -chartHeight / 2)
		.attr("y", -58)
		.attr("text-anchor", "middle")
		.attr("fill", "#53645d")
		.attr("font-size", 12)
		.text("Mean energy consumption (kWh/year)");
}

document.addEventListener("data-loaded", (event) => {
	drawBarChart(event.detail.tvEnergy55Inch);
});

if (window.chartData?.tvEnergy55Inch) {
	drawBarChart(window.chartData.tvEnergy55Inch);
}