const listMap = [
  {
    id: "HospitalOverview",
    center: { lng: 116.263564, lat: 40.104668 },
    pageName: "医院总览",
    tabChangeTime: 30000,
    scrollTime: 3000,
    rotateTime: 40000,
    mapAnimation: {
      zoom: 17,
      rotation: 0,
      pitch: 60,
    },
    showMarker: ["outpatient", "inpatient", "hospital"],
  },
  {
    id: "InpatientOverview",
    center: { lng: 116.264871, lat: 40.104602 },
    pageName: "住院概况",
    tabChangeTime: 30000,
    scrollTime: 3000,
    rotateTime: 40000,
    mapAnimation: {
      zoom: 17.4,
      rotation: -2.9,
      pitch: 79.4,
    },
    showMarker: ["outpatient", "inpatient", "hospital"],
  },
  {
    id: "OutpatientOverview",
    center: { lng: 116.26149, lat: 40.099123 },
    pageName: "门诊概况",
    tabChangeTime: 30000,
    scrollTime: 3000,
    rotateTime: 40000,
    mapAnimation: {
      zoom: 17.7,
      rotation: 147.4,
      pitch: 76.8,
    },
    showMarker: ["outpatient", "emergency", "inpatient", "hospital"],
  },
];

const data = {
  listMap: listMap,
  mapConfig: {
    marker: [
      {
        properties: {
          type: "OutpatientOverview",
          name: "outpatient",
          height: 22,
          size: [25, 25],
          icon: "",
          waterDrop: "",
          littleDrop: "",
          markerText: "门诊",
        },
        // marker: [116.264975, 40.100965],
        marker: [116.264982, 40.100957],
        markerBar: [
          [
            [116.264923, 40.10112],
            [116.264971, 40.101069],
            [116.265038, 40.10102],
            [116.265121, 40.100981],
            [116.265229, 40.100947],
            [116.265105, 40.100835],
            [116.264992, 40.100866],
            [116.26492, 40.100906],
            [116.264841, 40.100954],
            [116.264796, 40.101001],
          ],
        ],
      },
      {
        properties: {
          type: "OutpatientOverview",
          name: "emergency",
          height: 25,
          size: [25, 25],
          waterDrop: "redWaterDrop",
          littleDrop: "",
          color: "color4",
          icon: "redCircleMarker",
          markerText: "急诊",
        },
        marker: [116.264177, 40.101394],
        markerBar: [
          [
            [116.264002, 40.101419],
            [116.264284, 40.101528],
            [116.264375, 40.101398],
            [116.264088, 40.101287],
          ],
        ],
      },
      {
        properties: {
          type: "InpatientOverview",
          name: "inpatient",
          height: 22,
          size: [25, 25],
          icon: "",
          waterDrop: "",
          littleDrop: "",
          markerText: "住院",
        },
        marker: [116.264133, 40.100205],
        markerBar: [
          [
            [116.263967, 40.100261],
            [116.264284, 40.100268],
            [116.26429, 40.100161],
            [116.263967, 40.100157],
          ],
        ],
      },
      {
        properties: {
          type: "HospitalOverview",
          name: "hospital",
          height: 95,
          size: [25, 25],
          icon: "",
          waterDrop: "",
          littleDrop: "",
          markerText: "总览",
        },
        marker: [116.262224, 40.102191],
        markerBar: [
          [
            [116.261976, 40.102202],
            [116.262394, 40.102348],
            [116.262476, 40.102212],
            [116.262058, 40.102064],
          ],
        ],
      },
    ],
  },
  tabChangeTime: 30000,
  scrollTime: 3000,
  rotateTime: 400000,
};
const viewData: any = data;
export { viewData };
