function drawLineChart(data) {
	const container = d3.select("#line-chart");
	if (container.empty() || !data?.length) return;

	const rows = data
		.filter((row) => Number.isFinite(row.Year))
		.sort((first, second) => first.Year - second.Year);
	if (!rows.length) return;

	const series = Object.keys(rows[0])
		.filter((key) => key !== "Year")
		.map((key) => ({
			key,
			values: rows.map((row) => ({ year: row.Year, value: row[key] }))
		}))
		.filter((item) => item.values.some((point) => Number.isFinite(point.value)));
	if (!series.length) return;

	const width = 760;
	const height = 400;
	const margin = { top: 20, right: 24, bottom: 96, left: 78 };
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;
	const colors = ["#328574", "#d87845", "#718fb0", "#b55d66", "#a7a84b", "#8d6a9f", "#526a62"];
	const maxValue = d3.max(series, (item) => d3.max(item.values, (point) => point.value));
	const x = d3.scaleLinear()
		.domain(d3.extent(rows, (row) => row.Year))
		.nice()
		.range([0, chartWidth]);
	const y = d3.scaleLinear()
		.domain([0, maxValue])
		.nice()
		.range([chartHeight, 0]);
	const line = d3.line()
		.defined((point) => Number.isFinite(point.value))
		.x((point) => x(point.year))
		.y((point) => y(point.value));
	const seriesLabel = (key) => key.startsWith("Average Price") ? "Average" : key.split(" (")[0];

	container.selectAll("*").remove();

	const svg = container.append("svg")
		.attr("class", "line-chart")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Annual electricity spot prices by region, in dollars per megawatt hour");

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
		.call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));

	chart.selectAll(".series-line")
		.data(series)
		.join("path")
		.attr("class", "series-line")
		.attr("stroke", (item, index) => colors[index % colors.length])
		.attr("d", (item) => line(item.values))
		.append("title")
		.text((item) => seriesLabel(item.key));

	chart.append("text")
		.attr("class", "axis-label")
		.attr("x", chartWidth / 2)
		.attr("y", chartHeight + 42)
		.attr("text-anchor", "middle")
		.text("Year");

	chart.append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -chartHeight / 2)
		.attr("y", -58)
		.attr("text-anchor", "middle")
		.text("Spot price ($/MWh)");

	const legend = svg.append("g")
		.attr("transform", `translate(${margin.left},${height - margin.bottom + 34})`);

	const legendItems = legend.selectAll("g")
		.data(series)
		.join("g")
		.attr("transform", (item, index) => `translate(${(index % 4) * 164},${Math.floor(index / 4) * 26})`);

	legendItems.append("line")
		.attr("x2", 16)
		.attr("y1", 0)
		.attr("y2", 0)
		.attr("stroke", (item, index) => colors[index % colors.length])
		.attr("stroke-width", 2.5);

	legendItems.append("text")
		.attr("class", "legend-label")
		.attr("x", 22)
		.attr("y", 4)
		.text((item) => seriesLabel(item.key));
}

document.addEventListener("data-loaded", (event) => {
	drawLineChart(event.detail.spotPrices);
});

if (window.chartData?.spotPrices) {
	drawLineChart(window.chartData.spotPrices);
}