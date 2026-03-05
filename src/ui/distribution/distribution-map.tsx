import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface ComputingCenter {
  id: string;
  name: string;
  province: string;
  district: string;
  longitude: number;
  latitude: number;
  chipType: string;
  chipCount: number;
}

export const data: ComputingCenter[] = [
  {
    id: "shanghai-pudong-1",
    name: "上海浦东数据中心1号",
    province: "上海",
    district: "浦东新区",
    longitude: 121.5444,
    latitude: 31.2189,
    chipType: "英伟达 H100",
    chipCount: 1800,
  },
  {
    id: "shanghai-xuhui-1",
    name: "上海徐汇数据中心1号",
    province: "上海",
    district: "徐汇区",
    longitude: 121.4367,
    latitude: 31.1882,
    chipType: "英伟达 A100",
    chipCount: 1200,
  },
  {
    id: "shanghai-jiading-1",
    name: "上海嘉定数据中心1号",
    province: "上海",
    district: "嘉定区",
    longitude: 121.2506,
    latitude: 31.3756,
    chipType: "华为昇腾910",
    chipCount: 1500,
  },
  {
    id: "shanghai-songjiang-1",
    name: "上海松江数据中心1号",
    province: "上海",
    district: "松江区",
    longitude: 121.2234,
    latitude: 31.0306,
    chipType: "英伟达 H100",
    chipCount: 1600,
  },
  {
    id: "shanghai-qingpu-1",
    name: "上海青浦数据中心1号",
    province: "上海",
    district: "青浦区",
    longitude: 121.1242,
    latitude: 31.1438,
    chipType: "寒武纪MLU370",
    chipCount: 600,
  },
  {
    id: "jiangsu-nanjing-1",
    name: "南京数据中心1号",
    province: "江苏",
    district: "鼓楼区",
    longitude: 118.7969,
    latitude: 32.0603,
    chipType: "英伟达 A100",
    chipCount: 1100,
  },
  {
    id: "jiangsu-nanjing-2",
    name: "南京数据中心2号",
    province: "江苏",
    district: "江宁区",
    longitude: 118.7222,
    latitude: 32.0417,
    chipType: "华为昇腾910",
    chipCount: 900,
  },
  {
    id: "jiangsu-suzhou-1",
    name: "苏州数据中心1号",
    province: "江苏",
    district: "工业园区",
    longitude: 120.5853,
    latitude: 31.2989,
    chipType: "英伟达 H100",
    chipCount: 1400,
  },
  {
    id: "zhejiang-hangzhou-1",
    name: "杭州数据中心1号",
    province: "浙江",
    district: "西湖区",
    longitude: 120.1551,
    latitude: 30.2741,
    chipType: "英伟达 A100",
    chipCount: 1000,
  },
  {
    id: "zhejiang-hangzhou-2",
    name: "杭州数据中心2号",
    province: "浙江",
    district: "滨江区",
    longitude: 120.1903,
    latitude: 30.2477,
    chipType: "英伟达 H100",
    chipCount: 1200,
  },
  {
    id: "zhejiang-ningbo-1",
    name: "宁波数据中心1号",
    province: "浙江",
    district: "鄞州区",
    longitude: 121.5494,
    latitude: 29.8683,
    chipType: "华为昇腾910",
    chipCount: 800,
  },
  {
    id: "beijing-haidian-1",
    name: "北京海淀区数据中心1号",
    province: "北京",
    district: "海淀区",
    longitude: 116.2982,
    latitude: 39.9599,
    chipType: "英伟达 H100",
    chipCount: 2000,
  },
  {
    id: "beijing-chaoyang-1",
    name: "北京朝阳区数据中心1号",
    province: "北京",
    district: "朝阳区",
    longitude: 116.4431,
    latitude: 39.9211,
    chipType: "英伟达 A100",
    chipCount: 1400,
  },
  {
    id: "beijing-daxing-1",
    name: "北京大兴区数据中心1号",
    province: "北京",
    district: "大兴区",
    longitude: 116.338,
    latitude: 39.7289,
    chipType: "华为昇腾910",
    chipCount: 1000,
  },
  {
    id: "guangdong-guangzhou-1",
    name: "广州数据中心1号",
    province: "广东",
    district: "天河区",
    longitude: 113.2644,
    latitude: 23.1291,
    chipType: "英伟达 A100",
    chipCount: 1300,
  },
  {
    id: "guangdong-guangzhou-2",
    name: "广州数据中心2号",
    province: "广东",
    district: "黄埔区",
    longitude: 113.2903,
    latitude: 23.1567,
    chipType: "华为昇腾910",
    chipCount: 1000,
  },
  {
    id: "guangdong-shenzhen-1",
    name: "深圳数据中心1号",
    province: "广东",
    district: "南山区",
    longitude: 114.0579,
    latitude: 22.5431,
    chipType: "英伟达 H100",
    chipCount: 1900,
  },
  {
    id: "hubei-wuhan-1",
    name: "武汉数据中心1号",
    province: "湖北",
    district: "洪山区",
    longitude: 114.3054,
    latitude: 30.5931,
    chipType: "英伟达 A100",
    chipCount: 900,
  },
  {
    id: "hubei-wuhan-2",
    name: "武汉数据中心2号",
    province: "湖北",
    district: "江夏区",
    longitude: 114.2713,
    latitude: 30.6289,
    chipType: "华为昇腾910",
    chipCount: 700,
  },
  {
    id: "hunan-changsha-1",
    name: "长沙数据中心1号",
    province: "湖南",
    district: "岳麓区",
    longitude: 112.9388,
    latitude: 28.2282,
    chipType: "英伟达 A100",
    chipCount: 800,
  },
  {
    id: "hunan-changsha-2",
    name: "长沙数据中心2号",
    province: "湖南",
    district: "雨花区",
    longitude: 112.9717,
    latitude: 28.1925,
    chipType: "华为昇腾910",
    chipCount: 600,
  },
  {
    id: "hebei-shijiazhuang-1",
    name: "石家庄数据中心1号",
    province: "河北",
    district: "裕华区",
    longitude: 114.5149,
    latitude: 38.0423,
    chipType: "华为昇腾910",
    chipCount: 700,
  },
  {
    id: "hebei-xiongan-1",
    name: "雄安新区数据中心1号",
    province: "河北",
    district: "雄安新区",
    longitude: 115.9957,
    latitude: 38.9768,
    chipType: "寒武纪MLU370",
    chipCount: 400,
  },
  {
    id: "neimenggu-hohhot-1",
    name: "呼和浩特数据中心1号",
    province: "内蒙古",
    district: "新城区",
    longitude: 111.7492,
    latitude: 40.8426,
    chipType: "寒武纪MLU370",
    chipCount: 500,
  },
  {
    id: "neimenggu-baotou-1",
    name: "包头数据中心1号",
    province: "内蒙古",
    district: "青山区",
    longitude: 109.8403,
    latitude: 40.6574,
    chipType: "华为昇腾910",
    chipCount: 600,
  },
  {
    id: "xinjiang-urumqi-1",
    name: "乌鲁木齐数据中心1号",
    province: "新疆",
    district: "天山区",
    longitude: 87.6168,
    latitude: 43.8256,
    chipType: "寒武纪MLU370",
    chipCount: 300,
  },
  {
    id: "xinjiang-urumqi-2",
    name: "乌鲁木齐数据中心2号",
    province: "新疆",
    district: "沙依巴克区",
    longitude: 87.5843,
    latitude: 43.8592,
    chipType: "华为昇腾910",
    chipCount: 400,
  },
  {
    id: "ningxia-yinchuan-1",
    name: "银川数据中心1号",
    province: "宁夏",
    district: "金凤区",
    longitude: 106.2309,
    latitude: 38.4872,
    chipType: "寒武纪MLU370",
    chipCount: 350,
  },
  {
    id: "ningxia-yinchuan-2",
    name: "银川数据中心2号",
    province: "宁夏",
    district: "兴庆区",
    longitude: 106.2547,
    latitude: 38.5118,
    chipType: "华为昇腾910",
    chipCount: 450,
  },
  {
    id: "qinghai-xining-1",
    name: "西宁数据中心1号",
    province: "青海",
    district: "城中区",
    longitude: 101.7782,
    latitude: 36.6171,
    chipType: "寒武纪MLU370",
    chipCount: 250,
  },
  {
    id: "qinghai-xining-2",
    name: "西宁数据中心2号",
    province: "青海",
    district: "城西区",
    longitude: 101.8017,
    latitude: 36.5934,
    chipType: "寒武纪MLU370",
    chipCount: 280,
  },
];

function aggregateByProvince(centers: ComputingCenter[]) {
  const map = new Map<string, number>();
  for (const c of centers) {
    map.set(c.province, (map.get(c.province) || 0) + c.chipCount);
  }
  return Array.from(map, ([name, value]) => ({ name, value }));
}

const chipColorMap: Record<string, string> = {
  "英伟达 H100": "#76B900",
  "英伟达 A100": "#00C9A7",
  "华为昇腾910": "#E63946",
  "寒武纪MLU370": "#F4A261",
};

function buildScatterData(centers: ComputingCenter[]) {
  return centers.map((c) => {
    const color = chipColorMap[c.chipType] || "#f39c12";
    return {
      name: c.name,
      value: [c.longitude, c.latitude, c.chipCount],
      province: c.province,
      district: c.district,
      chipType: c.chipType,
      itemStyle: {
        color,
        shadowBlur: 10,
        shadowColor: `${color}80`,
      },
    };
  });
}

export function DistributionMap() {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/china.json")
      .then((r) => r.json())
      .then((geoJson) => {
        if (cancelled) return;
        echarts.registerMap("china", geoJson);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    const provinceData = aggregateByProvince(data);
    const scatterData = buildScatterData(data);

    const provincesWithData = new Set(data.map((c) => c.province));
    const mapData = provinceData.map((d) => ({
      ...d,
      itemStyle: {
        areaColor: provincesWithData.has(d.name) ? "#1a3355" : "#132039",
      },
    }));

    chart.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(13, 27, 42, 0.9)",
        borderColor: "rgba(100, 180, 255, 0.3)",
        textStyle: { color: "#e0e6ed" },
        formatter: (params: { seriesType: string; name: string; value: number; data: { name: string; province: string; district: string; chipType: string; value: number[] } }) => {
          if (params.seriesType === "effectScatter") {
            const d = params.data;
            return `<b>${d.name}</b><br/>${d.province} · ${d.district}<br/>芯片类型：${d.chipType}<br/>芯片数量：${d.value[2]}`;
          }
          if (params.seriesType === "map") {
            return `<b>${params.name}</b><br/>芯片总量：${params.value || 0}`;
          }
          return "";
        },
      },
      geo: {
        map: "china",
        roam: false,
        zoom: 1.2,
        itemStyle: {
          areaColor: "#132039",
          borderColor: "rgba(100, 180, 255, 0.25)",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: "#1e3a5f",
          },
          label: { show: false },
        },
        label: { show: false },
      },
      series: [
        {
          type: "map",
          map: "china",
          geoIndex: 0,
          data: mapData,
        },
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          data: scatterData,
          symbolSize: (val: number[]) => Math.max(6, Math.sqrt(val[2]) * 0.6),
          rippleEffect: {
            brushType: "stroke",
            scale: 3,
            period: 4,
          },
        },
      ],
      animationDuration: 1500,
      animationEasing: "cubicOut",
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, [ready]);

  return <div ref={chartRef} className="w-full h-full" />;
}
