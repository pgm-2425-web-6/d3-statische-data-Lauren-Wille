import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function barChart(
  selector,
  data,
  attributes = {
    width: 500,
    height: 300,
    margin: { top: 20, right: 20, bottom: 50, left: 50 },
  }
) {
  const { width, height, margin } = attributes;

  // Prepare scales based on the data
  const xScale = d3
    .scaleBand()
    .domain(data.map((d, i) => i)) // Use index or adjust based on your data
    .range([margin.left, width - margin.right])
    .padding(0.1); // Adds spacing between bars

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)]) // Adjust accessor if data is an array of objects
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Create the SVG container
  const svgBarChart = d3
    .select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Append the x-axis
  svgBarChart
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(
      d3.axisBottom(xScale).tickFormat((d) => data[d]?.label || `Item ${d + 1}`) // Adjust for labeled data
    )
    .selectAll("text")
    .attr("transform", "rotate(-45)") // Rotate labels if needed
    .style("text-anchor", "end");

  // Append the y-axis
  svgBarChart
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).ticks(5));

  // Create the bars
  svgBarChart
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (_, i) => xScale(i))
    .attr("y", (d) => yScale(d.value)) // Adjust if `value` is the key for bar height
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - margin.bottom - yScale(d.value))
    .attr("fill", "steelblue");

  // Tooltip setup
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0,0,0,0.7)")
    .style("color", "white")
    .style("padding", "5px 10px")
    .style("border-radius", "4px");

  // Add interactivity
  svgBarChart
    .selectAll(".bar")
    .on("mouseover", function (event, d) {
      tooltip
        .style("visibility", "visible")
        .text(`Value: ${d.value}`); // Adjust tooltip content
      d3.select(this).attr("fill", "orange");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", "steelblue");
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", `${event.pageY + 10}px`)
        .style("left", `${event.pageX + 10}px`);
    });
}


/* function drawChart(data) {
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 40 };

  const svg = d3.select("#chart").attr("width", width).attr("height", height);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.season))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.episodes)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.season))
    .attr("y", (d) => y(d.episodes))
    .attr("height", (d) => y(0) - y(d.episodes))
    .attr("width", x.bandwidth());

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat((d) => `Season ${d}`))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .text("Season");

  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .text("Number of Episodes");
}
 */