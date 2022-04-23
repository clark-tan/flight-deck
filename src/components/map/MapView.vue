<template>
  <div class="map-overview" :class="[ToolBarModule.activeView]">
    <div id="hospital-map"></div>
    <div
      class="map-model"
      :class="[viewChange && !isConfig && 'page-hide']"
    ></div>
    <DisplayPanel v-if="isConfig" :text="'配置'" class="config-panel">
      <div>
        <button @click="getCenter">获取中心点</button>
      </div>
      <p>多边形定位</p>
      <button class="btn" @click="createPolygon" style="margin-bottom: 5px">
        新建
      </button>
      <button class="btn" @click="polyEditor.open()" style="margin-bottom: 5px">
        开始编辑
      </button>
      <button class="btn" @click="closePolygon">结束编辑</button>
      <p>更新后台页面配置数据</p>
      <div>
        <button @click="saveConfig">保存数据</button>
      </div>
    </DisplayPanel>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DisplayPanel from "@/components/DisplayPanel.vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { ToolBarModule } from "@/store/tool-bar/index";
import { AppConfigModule } from "@/store/app-config";
import { themesColor } from "@/utils/Enumerate";
import { viewData } from "./viewData1";
import API from "@/api";
@Component({
  components: {
    DisplayPanel,
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
  loca: any = null; // 地图图层
  layerList: any = []; //图层列表
  circleList: any = []; // 水波图层
  AMap: any = null;
  viewChange: any = true;
  ToolBarModule = ToolBarModule;
  AppConfigModule = AppConfigModule;
  @Watch("ToolBarModule.activeView")
  async activeViewChange() {
    this.viewChange = true;
    this.showCircle();
    this.showLayer();
    this.setMapCenter();
    this.initAnimation();
  }
  get mapConfig() {
    // 地图配置
    return this.AppConfigModule.pageConfig;
  }
  get commonConfig() {
    return this.AppConfigModule.commonConfig;
  }
  get showMarker() {
    return this.mapConfig.showMarker;
  }
  mapAnimation(data: any) {
    // this.gaodeMap.setZoom(data.zoom);
    // this.gaodeMap.setRotation(data.rotation);
    // this.gaodeMap.setPitch(data.pitch);
    this.gaodeMap.setZoom(data.zoom, false, 600);
    this.gaodeMap.setRotation(data.rotation, false, 600);
    this.gaodeMap.setPitch(data.pitch, false, 600);
  }
  mounted() {
    this.getMapData();
  }
  async getMapData() {
    try {
      const hospitalId = this.$route.query.hospitalId;
      let res = null;
      if (hospitalId) {
        res = await API.hostipal.getHospitalById(hospitalId);
      } else {
        res = await API.hostipal.getHospitalList();
        res = res[0];
      }
      AppConfigModule.setHospital(res);
      const config = this.isConfig
        ? { mapConfig: JSON.stringify(viewData) }
        : await API.map.getMapConfig();
      AppConfigModule.setCommonConfig(JSON.parse(config.mapConfig));
      this.createScene();
    } catch (error) {
      console.log(AppConfigModule);
    }
    // this.$emit("changeLoading", true);
  }

  createScene() {
    const firstItem = this.mapConfig.center;
    const center: any = [firstItem.lng, firstItem.lat];
    const flag = this.isConfig;
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
          keyboardEnable: false,
          // pitchEnable: true,
          zoom: 15, //15
          rotation: 75, //135
          viewMode: "3D",
          buildingAnimation: true, //楼块出现是否带动画
          expandZoomRange: true,
          dragEnable: flag,
          pitchEnable: flag,
          doubleClickZoom: flag,
          scrollWheel: flag,
          rotateEnable: flag,
        });
        this.gaodeMap.on("complete", () => {
          console.log("触发complete事件！");
          this.AMap = AMap;
          this.initAnimation();
          const _window: any = window;
          this.loca = new _window.Loca.Container({
            map: this.gaodeMap,
          });
          this.createLayer(this.loca, AMap);
          this.gaodeMap.on("viewchange", (animationData: any) => {
            this.mapViewChange(animationData);
          });
          if (this.isConfig) {
            this.openConfigFunction();
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  mapViewChange(animationData: any) {
    const data = this.mapConfig.mapAnimation;
    let flag = true;
    Object.keys(data).forEach((key: any) => {
      flag = flag
        ? Math.round(animationData[key] * 100) / 100 ===
          Math.round(data[key] * 100) / 100
        : false;
    });
    if (flag) {
      this.viewChange = false;
      this.$emit("changeLoading", true);
    }
  }
  createLayer(loca: any, AMap: any) {
    const newViewData = this.commonConfig.mapConfig;
    const data = newViewData.marker;
    data.forEach((item: any) => {
      // this.createPrismLayer(item, loca);
      // this.createScatterLayer(item, loca);
      this.createMarker(item, AMap);
    });
    this.showLayer();
    this.showCircle();
    // 启动渲染动画
    loca.animate.start();
  }
  createPrismLayer(sourceData: any, loca: any) {
    const data = JSON.parse(JSON.stringify(sourceData));
    const _window: any = window;
    const properties = data.properties;
    // 单个的颜色不同，需要每一个单独增加一个图层
    let newData: any = this.getCommonDataTpl(
      properties,
      data.markerBar,
      "Polygon"
    );
    newData = new _window.Loca.GeoJSONSource({ data: newData });
    const woolColor = themesColor(properties.color || "color2");
    const layer = new _window.Loca.PolygonLayer({
      loca,
      zIndex: 120,
      opacity: 0.1,
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
    layer.hide();
    this.layerList.push({
      name: properties.name,
      marker: layer,
      type: "bar",
    });
  }
  createScatterLayer(sourceData: any, loca: any) {
    const _window: any = window;
    // 单个的颜色不同，需要每一个单独增加一个图层
    const scatter = new _window.Loca.ScatterLayer({
      loca,
      zIndex: 121,
      opacity: 1,
      shininess: 10,
      hasSide: true,
    });
    const data = JSON.parse(JSON.stringify(sourceData));
    const properties = data.properties;
    let newData: any = this.getCommonDataTpl(properties, data.marker, "Point");
    newData = new _window.Loca.GeoJSONSource({ data: newData });
    const styleOptions = this.getCircleStyle(properties);
    scatter.setSource(newData);
    scatter.setStyle(styleOptions);
    this.circleList.push({
      name: properties.name,
      marker: scatter,
      type: "circle",
    });
  }
  createMarker(sourceData: any, AMap: any) {
    const data = JSON.parse(JSON.stringify(sourceData));
    const properties = data.properties;
    const height = properties.height;
    const el: any = document.createElement("div");
    el.innerHTML = this.getMarkerHtml(properties);
    const marker = new AMap.Marker({
      position: [data.marker[0], data.marker[1], Math.ceil(height + 2)],
      anchor: "bottom-center",
      content: el,
    });
    marker.on("click", () => {
      this.markerClick(properties);
    });
    this.gaodeMap.add(marker);
    marker.hide();
    this.layerList.push({
      name: properties.name,
      marker: marker,
      type: "marker",
    });
  }
  getCircleStyle(properties: any) {
    const markerIcon = this.markerIcon;
    return {
      unit: "meter",
      size: this.getCircleSize(properties),
      borderWidth: 10,
      texture: properties.icon
        ? markerIcon[properties.icon]
        : markerIcon.greenCircleMarker,
      duration: 1500,
      animate: true,
      altitude: (index: any, f: any) => {
        const item = f.properties;
        const height = item.height;
        return height;
      },
    };
  }
  getCircleSize(properties: any) {
    const itemSize = properties.size;
    return properties.type === ToolBarModule.activeView && itemSize
      ? itemSize
      : [20, 20];
  }
  getCommonDataTpl(properties: any, pistions: any, type: any) {
    return {
      features: [
        {
          type: "Feature",
          properties: properties,
          geometry: {
            coordinates: pistions,
            type: type,
          },
        },
      ],
      type: "FeatureCollection",
    };
  }
  showLayer() {
    const showMarker = this.mapConfig.showMarker;
    this.layerList.forEach((item: any) => {
      const name = item.name;
      const marker = item.marker;
      if (showMarker.includes(name)) {
        marker.show();
      } else {
        marker.hide();
      }
    });
  }
  showCircle() {
    // 水波动画的图层通过setStyle更改size大小后，会消失掉。原因不明
    // 所以通过销毁重新加载水波动画图层
    const circleList = this.circleList;
    this.circleList = [];
    const showMarker = this.mapConfig.showMarker;
    const newViewData = this.commonConfig.mapConfig;
    const data = newViewData.marker;
    data.forEach((item: any) => {
      if (showMarker.includes(item.properties.name)) {
        this.createScatterLayer(item, this.loca);
      }
    });
    circleList.forEach((item: any) => {
      const marker = item.marker;
      marker.destroy();
    });
  }
  markerClick(item: any) {
    const type = item.type;
    switch (type) {
      case "OutpatientOverview":
        ToolBarModule.setActiveView("OutpatientOverview");
        break;
      case "HospitalOverview":
        ToolBarModule.setActiveView("HospitalOverview");
        break;
      case "InpatientOverview":
        ToolBarModule.setActiveView("InpatientOverview");
        break;
    }
    // AppConfigModule.setPageConfig(type);
    // this.setMapCenter();
  }
  setMapCenter() {
    const center: any = this.mapConfig.center;
    this.gaodeMap.setCenter([center.lng, center.lat]);
  }
  initAnimation() {
    const animation = this.mapConfig.mapAnimation;
    this.mapAnimation(animation);
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
  //------------------配置相关-开始--------------
  isConfig: any = false;
  polyEditor: any = null;
  polyEditorObj: any = {};
  openConfigFunction() {
    this.createPolygonEditor();
    this.gaodeMap.on("click", (e: any) => {
      console.log({ lng: e.lnglat.getLng(), lat: e.lnglat.getLat() });
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
    // this.gaodeMap.setFitView();
    const polyEditor = (this.polyEditor = new this.AMap.PolygonEditor(
      this.gaodeMap
    ));
    polyEditor.on("add", (data: any) => {
      const polygon = data.target;
      this.polyEditorObj[ToolBarModule.activeView] = polygon;
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
  saveConfig() {
    API.map.updateMapConfig(this.commonConfig);
  }
  //-----------------配置相关-结束-------------------
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
.OutpatientOverview ::v-deep .emergency-marker,
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
.map-model {
  height: 100%;
  width: 100%;
}
.page-hide {
  // z-index: 999;
  position: absolute;
  top: 0;
}
</style>
