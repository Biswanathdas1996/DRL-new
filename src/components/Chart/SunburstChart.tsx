// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/sunburst
import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { sunBurstChartData } from "./MockData"; // Adjust the import path as necessary

const MyResponsiveSunburst = () => (
  <div style={{ width: "100%", height: "500px" }}>
    <ResponsiveSunburst
      data={sunBurstChartData}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      id="name"
      value="loc"
      cornerRadius={2}
      borderColor={{ theme: "background" }}
      colors={{ scheme: "nivo" }}
      childColor={{
        from: "color",
        modifiers: [["brighter", 0.1]],
      }}
      enableArcLabels={true}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 1.4]],
      }}
    />
  </div>
);

export default MyResponsiveSunburst;
