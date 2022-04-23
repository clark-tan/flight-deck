<template>
  <div class="map-overview" :class="[activeView]">
    <div id="hospital-map"></div>
    <!-- <IncomePanel class="income-panel" ref="incomePanel" /> -->
    <DisplayPanel v-if="isConfig" :text="'配置'" class="config-panel">
      <div>
        <button @click="getCenter">获取中心点</button>
      </div>
      <button class="btn" @click="createPolygon" style="margin-bottom: 5px">
        新建
      </button>
      <button class="btn" @click="polyEditor.open()" style="margin-bottom: 5px">
        开始编辑
      </button>
      <button class="btn" @click="closePolygon">结束编辑</button>
    </DisplayPanel>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DisplayPanel from "@/components/DisplayPanel.vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { themesColor } from "@/utils/Enumerate";
import { viewData } from "./viewData";
//*********弹窗面板********* */
// import IncomePanel from "@/views/outpatient-overview/map-marker-panel/IncomePanel.vue";
@Component({
  components: {
    DisplayPanel,
    // IncomePanel,
  },
})
export default class HospitalViewOne extends Vue {
  markerIcon: any = {
    blueCircleMarker: require("@/assets/images/map/inpatient-marker-circle.png"),
    greenCircleMarker: require("@/assets/images/map/outpatient-marker-circle.png"),
    redCircleMarker: require("@/assets/images/map/emergency-marker-circle.png"),
    waterDrop: require("@/assets/images/map/hospital-marker-header.svg"),
    redWaterDrop: require("@/assets/images/map/emergency-marker-header.svg"),
    littleDrop: require("@/assets/images/map/marker-index.svg"),
  };

  gaodeMap: any = null; // 地图全局对象
  infoWindow: any = null;
  isConfig: any = true;
  loca: any = null; // 地图图层
  layerList: any = []; //图层列表
  AMap: any = null;
  polyEditor: any = null;
  polyEditorObj: any = {};
  activeView: any = "HospitalOverview";
  mapCenter: any = {
    OutpatientOverview: { lng: 116.261775, lat: 40.098938 },
    InpatientOverview: { lng: 116.262329, lat: 40.102712 },
    HospitalOverview: { lng: 116.263564, lat: 40.104668 },
  };
  mapAnimation(data: any) {
    this.gaodeMap.setRotation(data.rotation, false, 1000);
    this.gaodeMap.setPitch(data.pitch, false, 1000);
    this.gaodeMap.setZoom(data.zoom, false, 1000);
  }
  mounted() {
    this.getMapData();
  }
  async getMapData() {
    this.createScene();
  }
  createScene() {
    const mapData: any = viewData[this.activeView];
    const firstItem = mapData.center;
    const center: any = [firstItem.lng, firstItem.lat];
    AMapLoader.load({
      key: "5f8c4263cf0e3d5cb2e9397ad8d83cfb", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      Loca: {
        version: "2.0",
      },
      plugins: ["AMap.PolygonEditor"],
    })
      .then((AMap) => {
        this.gaodeMap = new AMap.Map("hospital-map", {
          pitch: 40, // 倾斜度
          mapStyle: "amap://styles/blue",
          center: center,
          showLabel: false,
          skyColor: "021a27",
          resizeEnable: true,
          rotateEnable: true,
          pitchEnable: true,
          zoom: 15, //15
          rotation: 75, //135
          viewMode: "3D",
          buildingAnimation: true, //楼块出现是否带动画
          expandZoomRange: true,
          // showBuildingBlock: false,
        });
        this.AMap = AMap;
        this.gaodeMap.on("complete", () => {
          console.log("触发complete事件！");
          const activeView = this.activeView;
          this.initAnimation(activeView);
          const _window: any = window;
          this.loca = _window.loca = new _window.Loca.Container({
            map: this.gaodeMap,
          });
          this.createPolygonEditor();
          this.createLayer(this.loca, AMap);
          // this.gaodeMap.on("click", (e: any) => {
          //   console.log({ lng: e.lnglat.getLng(), lat: e.lnglat.getLat() });
          // });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  getCenter() {
    const center = this.gaodeMap.getCenter();
    const zoom = this.gaodeMap.getZoom();
    const pitch = this.gaodeMap.getPitch();
    const rotation = this.gaodeMap.getRotation();
    console.log({
      center: { lng: center.lng, lat: center.lat },
      zoom: zoom,
      pitch: pitch,
      rotation: rotation,
    });
  }
  createPolygonEditor() {
    this.gaodeMap.setFitView();
    const polyEditor = (this.polyEditor = new this.AMap.PolygonEditor(
      this.gaodeMap
    ));
    polyEditor.on("add", (data: any) => {
      const polygon = data.target;
      this.polyEditorObj[this.activeView] = polygon;
      polyEditor.addAdsorbPolygons(polygon);
      polygon.on("dblclick", () => {
        polyEditor.setTarget(polygon);
        polyEditor.open();
      });
    });
  }
  createPolygon() {
    const polyEditor = this.polyEditor;
    polyEditor.close();
    polyEditor.setTarget();
    polyEditor.open();
  }
  closePolygon() {
    const polyEditor = this.polyEditor;
    const path = polyEditor.getPath();
    polyEditor.close();
    console.log(JSON.stringify(path), "path");
  }
  createLayer(loca: any, AMap: any) {
    const newViewData = viewData[this.activeView];
    const data = newViewData.marker;
    // console.log(JSON.stringify(viewData));
    this.createPrismLayer(data, loca, AMap);
    // this.createScatterLayer(data, loca);
    // this.createMarker(data, AMap);
    // 启动渲染动画
    loca.animate.start();
  }
  createPrismLayer(data: any, loca: any, AMap: any) {
    const _window: any = window;
    const newData = new _window.Loca.GeoJSONSource({ data: data });
    const woolColor = themesColor("color2");
    const layer = new _window.Loca.PolygonLayer({
      loca,
      zIndex: 120,
      opacity: 0.2,
      depth: false,
      cullface: "none",
    });
    layer.setSource(newData);
    layer.setStyle({
      topColor: woolColor,
      sideTopColor: woolColor,
      sideBottomColor: woolColor,
      height: (index: any, f: any) => {
        const item = f.properties;
        const height = item.height;
        return height;
      },
    });
    loca.add(layer);
    layer.show(0);
    this.layerList.push(layer);
  }
  createScatterLayer(sourceData: any, loca: any) {
    const data = JSON.parse(JSON.stringify(sourceData));
    const _window: any = window;
    data.features.forEach((item: any) => {
      // 单个的颜色不同，需要每一个单独增加一个图层
      const marker = item.properties.marker;
      item.geometry.coordinates = marker;
      item.geometry.type = "Point";
      let newData: any = {
        features: [item],
        type: "FeatureCollection",
      };
      newData = new _window.Loca.GeoJSONSource({ data: newData });
      const scatter = new _window.Loca.ScatterLayer({
        loca,
        zIndex: 121,
        opacity: 1,
        shininess: 10,
        hasSide: true,
      });

      const itemSize = item.properties.size;
      const markerIcon = this.markerIcon;
      scatter.setSource(newData);
      scatter.setStyle({
        unit: "meter",
        size:
          item.properties.type === this.activeView && itemSize
            ? itemSize
            : [20, 20],
        borderWidth: 10,
        texture: item.properties.icon
          ? markerIcon[item.properties.icon]
          : markerIcon.greenCircleMarker,
        duration: 1500,
        animate: true,
        altitude: (index: any, f: any) => {
          const item = f.properties;
          const height = item.height;
          return height;
        },
      });
      loca.add(scatter);
      scatter.show(0);
      this.layerList.push(scatter);
    });
  }
  createMarker(sourceData: any, AMap: any) {
    const data = JSON.parse(JSON.stringify(sourceData));
    data.features.forEach((item: any) => {
      const properties = item.properties;
      const height = properties.height;
      const el: any = document.createElement("div");
      el.innerHTML = this.getMarkerHtml(properties);
      const marker = new AMap.Marker({
        position: [
          properties.marker[0],
          properties.marker[1],
          Math.ceil(height + 2),
        ],
        anchor: "bottom-center",
        content: el,
      });

      this.gaodeMap.add(marker);
      this.layerList.push(marker);
    });
  }
  removeLayer() {
    this.layerList.forEach((item: any) => {
      item.remove();
    });
    this.layerList = [];
  }
  setMapCenter(type: any) {
    const center: any = this.mapCenter[type];
    this.gaodeMap.setCenter([center.lng, center.lat]);
  }
  initAnimation(type: any) {
    switch (type) {
      case "OutpatientOverview": //门诊
        this.mapAnimation({
          zoom: 18,
          rotation: 155,
          pitch: 80,
        });
        break;
      case "InpatientOverview":
        this.mapAnimation({
          zoom: 17.7,
          rotation: 35,
          pitch: 73,
        });
        break;
      default:
        this.mapAnimation({
          zoom: 17,
          roation: 0,
          // pitch: 40,
          pitch: 60,
        });
    }
  }
  getMarkerHtml(item: any) {
    const markerIcon = this.markerIcon;
    const header = markerIcon[item.waterDrop] || markerIcon.waterDrop;
    const index = markerIcon[item.littleDrop] || markerIcon.littleDrop;
    const name = item.name;
    const text = item.markerText;
    let html = "";
    html += `<div class="${name}-marker marker-common">`;
    html += `<img class="marker-header" src="${header}" />`;
    html += `<p>${text}</p><img class="marker-index" src="${index}"></div>`;
    return html;
  }
}
</script>

<style lang="less" scoped>
@header-p-top: -19.5px;
.map-overview {
  height: 100%;
  > div {
    height: 100%;
  }
}
::v-deep .marker-common {
  position: relative;
  text-align: center;
  animation: jump 2s ease-in-out infinite;
  transition: transform 0.2s linear;
  &:hover {
    animation: none;
    transform: scale(1.2);
  }
  img {
    position: absolute;
  }
  .marker-circle {
    margin: 0 auto;
  }
  .marker-circle-img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    left: 2.5px;
    top: 2.5px;
  }
  .marker-header {
    display: none;
    width: 50px;
    left: 50%;
    transform: translate(-50%, calc(-50% - 6.5px));
  }
  p {
    color: #fff;
    position: relative;
    left: 50%;
    transform: translate(-50%, @header-p-top);
    white-space: nowrap;
  }
  .marker-index {
    left: 50%;
    height: 17px;
    transform: translate(-50%, @header-p-top);
  }
}
.OutpatientOverview ::v-deep .outpatient-marker,
.OutpatientOverview ::v-deep .emergency,
.InpatientOverview ::v-deep .inpatient-marker,
.HospitalOverview ::v-deep .hospital-marker {
  > .marker-header {
    display: block;
  }
  > .marker-index {
    display: none;
  }
}
::v-deep .amap-copyright,
::v-deep .amap-logo {
  display: none !important;
}

// 弹跳
@keyframes jump {
  0% {
    top: 0;
    animation-timing-function: ease-in;
  }
  50% {
    top: 4px;
    animation-timing-function: ease-out;
  }
  55% {
    top: 8px;
    animation-timing-function: ease-in;
  }
  65% {
    top: 2px;
    animation-timing-function: ease-out;
  }
  95% {
    top: 0;
    animation-timing-function: ease-in;
  }
  100% {
    top: 0;
    animation-timing-function: ease-in;
  }
}
.config-panel {
  position: absolute;
  top: 100px;
  right: 16px;
  width: 450px;
  height: calc(100% - 100px);
  button {
    color: rgba(red, 0.6) !important;
  }
}
</style>
