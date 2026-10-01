const dataFiles = {
	spotPrices: "data/Ex5_ARE_Spot_Prices.csv",
	tvEnergy55Inch: "data/Ex5_TV_energy_55inchtv_byScreenType.csv",
	tvEnergyAllSizes: "data/Ex5_TV_energy_Allsizes_byScreenType.csv",
	tvEnergy: "data/Ex5_TV_energy.csv"
};

async function loadData() {
	const entries = await Promise.all(
		Object.entries(dataFiles).map(async ([name, path]) => [
			name,
			await d3.csv(path, d3.autoType)
		])
	);

	window.chartData = Object.fromEntries(entries);
	document.dispatchEvent(new CustomEvent("data-loaded", {
		detail: window.chartData
	}));
	return window.chartData;
}

loadData().catch((error) => {
	console.error("Could not load chart data:", error);
});