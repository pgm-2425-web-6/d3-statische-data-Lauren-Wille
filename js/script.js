import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import barChart from "./barChart.mjs";

d3.json("https://bobsburgers-api.herokuapp.com/episodes")
  .then((data) => {
    const episodesBySeason = d3
      .rollups(
        data,
        (v) => v.length,
        (d) => d.season
      )
      .map(([season, episodes]) => ({ season, episodes }));

    episodesBySeason.sort((a, b) => a.season - b.season);

    barChart("#barChart", episodesBySeason);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
