// 龙华人民医院
const listMap = [
  {
    id: "HospitalOverview",
    center: { lng: 114.032107, lat: 22.65818 },
    pageName: "医院总览",
    tabChangeTime: 30000,
    scrollTime: 3000,
    rotateTime: 40000,
    mapAnimation: {
      zoom: 17.95,
      rotation: 13.6,
      pitch: 63.8,
    },
    showMarker: ["outpatient", "inpatient", "hospital"],
  },
  {
    id: "InpatientOverview",
    center: { lng: 114.033289, lat: 22.661112 },
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
    center: { lng: 114.030528, lat: 22.659593 },
    pageName: "门诊概况",
    tabChangeTime: 30000,
    scrollTime: 3000,
    rotateTime: 40000,
    mapAnimation: {
      zoom: 17.7,
      rotation: 41.4,
      pitch: 78.3,
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
          height: 26,
          size: [25, 25],
          icon: "",
          waterDrop: "",
          littleDrop: "",
          markerText: "门诊",
        },
        // marker: [116.264975, 40.100965],
        marker: [114.033355, 22.655902],
        markerBar: [
          [
            [114.033281, 22.655873],
            [114.033394, 22.655957],
            [114.033448, 22.655894],
            [114.03333, 22.655808],
          ],
        ],
      },
      {
        properties: {
          type: "OutpatientOverview",
          name: "emergency",
          height: 26,
          size: [25, 25],
          waterDrop: "redWaterDrop",
          littleDrop: "",
          color: "color4",
          icon: "redCircleMarker",
          markerText: "急诊",
        },
        marker: [114.033567, 22.656074],
        markerBar: [
          [
            [114.033515, 22.656036],
            [114.033624, 22.656115],
            [114.033674, 22.656055],
            [114.033562, 22.655976],
          ],
        ],
      },
      {
        properties: {
          type: "InpatientOverview",
          name: "inpatient",
          height: 47,
          icon: "",
          size: [25, 25],
          waterDrop: "",
          littleDrop: "",
          markerText: "住院",
        },
        marker: [114.032574, 22.656221],
        markerBar: [
          [
            [114.032512, 22.656259],
            [114.032569, 22.656307],
            [114.032654, 22.656309],
            [114.032663, 22.656279],
            [114.032634, 22.65612],
            [114.032517, 22.656098],
          ],
        ],
      },
      {
        properties: {
          type: "HospitalOverview",
          name: "hospital",
          height: 47,
          size: [25, 25],
          icon: "",
          waterDrop: "",
          littleDrop: "",
          markerText: "总览",
        },
        marker: [114.031812, 22.655837],
        markerBar: [
          [
            [114.031713, 22.65586],
            [114.031838, 22.655704],
            [114.031925, 22.655763],
            [114.031799, 22.655915],
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
