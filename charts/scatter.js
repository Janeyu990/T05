function drawScatterChart(data) {
	const container = d3.select("#scatter-chart");
	if (container.empty() || !data?.length) return;

	const values = data.filter((row) =>
		Number.isFinite(row.screensize) && Number.isFinite(row.energy_consumpt) && row.screen_tech
	);
	if (!values.length) return;

	const width = 700;
	const height = 360;
	const margin = { top: 20, right: 148, bottom: 62, left: 78 };
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;
	const technologies = Array.from(new Set(values.map((row) => row.screen_tech))).sort();
	const x = d3.scaleLinear()
		.domain(d3.extent(values, (row) => row.screensize))
		.nice()
		.range([0, chartWidth]);
	const y = d3.scaleLinear()
		.domain(d3.extent(values, (row) => row.energy_consumpt))
		.nice()
		.range([chartHeight, 0]);
	const color = d3.scaleOrdinal()
		.domain(technologies)
		.range(d3.schemeTableau10);

	container.selectAll("*").remove();

	const svg = container.append("svg")
		.attr("class", "scatter-chart")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Television energy consumption by screen size and screen technology");

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
		.call(d3.axisBottom(x).ticks(6));

	chart.selectAll(".point")
		.data(values)
		.join("circle")
		.attr("class", "point")
		.attr("cx", (row) => x(row.screensize))
		.attr("cy", (row) => y(row.energy_consumpt))
		.attr("r", 4)
		.attr("fill", (row) => color(row.screen_tech))
		.append("title")
		.text((row) => `${row.brand} | ${row.screen_tech} | ${row.screensize} in | ${d3.format(",.1f")(row.energy_consumpt)} kWh/year | ${row.count} records`);

	chart.append("text")
		.attr("class", "axis-label")
		.attr("x", chartWidth / 2)
		.attr("y", chartHeight + 46)
		.attr("text-anchor", "middle")
		.text("Screen size (inches)");

	chart.append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -chartHeight / 2)
		.attr("y", -58)
		.attr("text-anchor", "middle")
		.text("Energy consumption (kWh/year)");

	const legend = svg.append("g")
		.attr("transform", `translate(${width - margin.right + 18},${margin.top + 8})`);

	legend.selectAll("g")
		.data(technologies)
		.join("g")
		.attr("transform", (technology, index) => `translate(0,${index * 24})`)
		.call((items) => {
			items.append("circle")
				.attr("r", 4)
				.attr("fill", (technology) => color(technology));
			items.append("text")
				.attr("class", "legend-label")
				.attr("x", 12)
				.attr("y", 4)
				.text((technology) => technology);
		});
}

document.addEventListener("data-loaded", (event) => {
	drawScatterChart(event.detail.tvEnergy);
});

if (window.chartData?.tvEnergy) {
	drawScatterChart(window.chartData.tvEnergy);
}