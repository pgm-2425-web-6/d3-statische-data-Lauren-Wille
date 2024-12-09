import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function barChart(
  selector,
  data,
  attributes) {
  const { width, height, margin } = attributes;

  const xScale = d3
    .scaleBand()
    .domain(data.map((d, i) => i))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.episodes)])
    .range([height - margin.bottom, margin.top]);

  const svgBarChart = d3
    .select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svgBarChart
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat((d) => `season ${data[d]?.season}`))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svgBarChart
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).ticks(9));

  svgBarChart
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (_, i) => xScale(i))
    .attr("y", (d) => yScale(d.episodes))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - margin.bottom - yScale(d.episodes));

  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  svgBarChart
    .selectAll(".bar")
    .on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible").text(`${d.episodes} episodes`);
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
