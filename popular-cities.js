// 热门旅行城市与代表景点。用于离线选择；具体地址仍通过 OpenStreetMap 查询。
window.POPULAR_LOCATIONS = [
  {
    country: "美国", code: "US", cities: [
      { city: "纽约", lat: 40.7128, lng: -74.006, attractions: ["自由女神像", "时代广场", "中央公园"] },
      { city: "华盛顿", lat: 38.9072, lng: -77.0369, attractions: ["白宫", "国家广场", "林肯纪念堂"] },
      { city: "波士顿", lat: 42.3601, lng: -71.0589, attractions: ["自由之路", "哈佛大学"] },
      { city: "费城", lat: 39.9526, lng: -75.1652, attractions: ["独立宫", "自由钟"] },
      { city: "芝加哥", lat: 41.8781, lng: -87.6298, attractions: ["千禧公园", "海军码头"] },
      { city: "迈阿密", lat: 25.7617, lng: -80.1918, attractions: ["南海滩", "小哈瓦那"] },
      { city: "奥兰多", lat: 28.5383, lng: -81.3792, attractions: ["迪士尼世界", "环球影城"] },
      { city: "亚特兰大", lat: 33.749, lng: -84.388, attractions: ["可口可乐世界", "乔治亚水族馆"] },
      { city: "新奥尔良", lat: 29.9511, lng: -90.0715, attractions: ["法国区", "杰克逊广场"] },
      { city: "纳什维尔", lat: 36.1627, lng: -86.7816, attractions: ["乡村音乐名人堂", "百老汇街"] },
      { city: "休斯敦", lat: 29.7604, lng: -95.3698, attractions: ["休斯敦太空中心", "博物馆区"] },
      { city: "达拉斯", lat: 32.7767, lng: -96.797, attractions: ["迪利广场", "达拉斯艺术博物馆"] },
      { city: "奥斯汀", lat: 30.2672, lng: -97.7431, attractions: ["州议会大厦", "南国会大道"] },
      { city: "丹佛", lat: 39.7392, lng: -104.9903, attractions: ["红石剧场", "落基山门户"] },
      { city: "盐湖城", lat: 40.7608, lng: -111.891, attractions: ["圣殿广场", "大盐湖"] },
      { city: "菲尼克斯", lat: 33.4484, lng: -112.074, attractions: ["沙漠植物园", "驼背山"] },
      { city: "拉斯维加斯", lat: 36.1699, lng: -115.1398, attractions: ["拉斯维加斯大道", "红岩峡谷"] },
      { city: "洛杉矶", lat: 34.0522, lng: -118.2437, attractions: ["好莱坞", "格里菲斯天文台", "圣莫尼卡"] },
      { city: "阿纳海姆", lat: 33.8366, lng: -117.9143, attractions: ["加州迪士尼乐园"] },
      { city: "圣地亚哥", lat: 32.7157, lng: -117.1611, attractions: ["巴尔博亚公园", "拉霍亚海岸"] },
      { city: "旧金山", lat: 37.7749, lng: -122.4194, attractions: ["金门大桥", "渔人码头", "九曲花街"] },
      { city: "圣何塞", lat: 37.3382, lng: -121.8863, attractions: ["硅谷", "温彻斯特鬼屋"] },
      { city: "萨克拉门托", lat: 38.5816, lng: -121.4944, attractions: ["加州议会大厦", "老城"] },
      { city: "圣塔芭芭拉", lat: 34.4208, lng: -119.6982, attractions: ["老教堂", "斯特恩码头"] },
      { city: "蒙特雷", lat: 36.6002, lng: -121.8947, attractions: ["蒙特雷湾水族馆", "17英里路"] },
      { city: "棕榈泉", lat: 33.8303, lng: -116.5453, attractions: ["空中缆车", "约书亚树"] },
      { city: "西雅图", lat: 47.6062, lng: -122.3321, attractions: ["太空针塔", "派克市场"] },
      { city: "波特兰", lat: 45.5152, lng: -122.6784, attractions: ["华盛顿公园", "鲍威尔书城"] },
      { city: "火奴鲁鲁", lat: 21.3099, lng: -157.8581, attractions: ["威基基海滩", "钻石头山"] },
      { city: "安克雷奇", lat: 61.2181, lng: -149.9003, attractions: ["楚加奇山", "阿拉斯加铁路"] },
      { city: "尼亚加拉瀑布城", lat: 43.0962, lng: -79.0377, attractions: ["尼亚加拉瀑布"] },
      { city: "优胜美地", lat: 37.8651, lng: -119.5383, attractions: ["优胜美地国家公园"] },
      { city: "太浩湖", lat: 39.0968, lng: -120.0324, attractions: ["太浩湖", "翡翠湾"] }
    ]
  },
  {
    country: "日本", code: "JP", cities: [
      { city: "东京", lat: 35.6762, lng: 139.6503, attractions: ["浅草寺", "涩谷", "东京塔"] },
      { city: "横滨", lat: 35.4437, lng: 139.638, attractions: ["港未来", "中华街"] },
      { city: "镰仓", lat: 35.3192, lng: 139.5467, attractions: ["镰仓大佛", "鹤冈八幡宫"] },
      { city: "箱根", lat: 35.2324, lng: 139.1069, attractions: ["芦之湖", "大涌谷"] },
      { city: "日光", lat: 36.7199, lng: 139.6982, attractions: ["东照宫", "华严瀑布"] },
      { city: "富士河口湖", lat: 35.4982, lng: 138.7687, attractions: ["河口湖", "富士山"] },
      { city: "札幌", lat: 43.0618, lng: 141.3545, attractions: ["大通公园", "札幌钟楼"] },
      { city: "小樽", lat: 43.1907, lng: 140.9947, attractions: ["小樽运河", "音乐盒堂"] },
      { city: "函馆", lat: 41.7687, lng: 140.7288, attractions: ["函馆山", "五棱郭"] },
      { city: "旭川", lat: 43.7706, lng: 142.365, attractions: ["旭山动物园"] },
      { city: "仙台", lat: 38.2682, lng: 140.8694, attractions: ["仙台城迹", "松岛"] },
      { city: "金泽", lat: 36.5613, lng: 136.6562, attractions: ["兼六园", "东茶屋街"] },
      { city: "高山", lat: 36.1461, lng: 137.2522, attractions: ["古街", "宫川朝市"] },
      { city: "松本", lat: 36.238, lng: 137.972, attractions: ["松本城", "上高地"] },
      { city: "名古屋", lat: 35.1815, lng: 136.9066, attractions: ["名古屋城", "热田神宫"] },
      { city: "京都", lat: 35.0116, lng: 135.7681, attractions: ["清水寺", "伏见稻荷", "岚山"] },
      { city: "大阪", lat: 34.6937, lng: 135.5023, attractions: ["大阪城", "道顿堀", "环球影城"] },
      { city: "奈良", lat: 34.6851, lng: 135.8048, attractions: ["奈良公园", "东大寺"] },
      { city: "神户", lat: 34.6901, lng: 135.1955, attractions: ["神户港", "北野异人馆"] },
      { city: "姬路", lat: 34.8151, lng: 134.6853, attractions: ["姬路城"] },
      { city: "冈山", lat: 34.6551, lng: 133.9195, attractions: ["后乐园", "冈山城"] },
      { city: "广岛", lat: 34.3853, lng: 132.4553, attractions: ["和平纪念公园", "宫岛"] },
      { city: "福冈", lat: 33.5904, lng: 130.4017, attractions: ["天神", "博多运河城"] },
      { city: "长崎", lat: 32.7503, lng: 129.8777, attractions: ["稻佐山", "哥拉巴园"] },
      { city: "熊本", lat: 32.8031, lng: 130.7079, attractions: ["熊本城", "水前寺成趣园"] },
      { city: "别府", lat: 33.2846, lng: 131.4912, attractions: ["地狱温泉", "别府温泉"] },
      { city: "鹿儿岛", lat: 31.5966, lng: 130.5571, attractions: ["樱岛", "仙岩园"] },
      { city: "那霸", lat: 26.2124, lng: 127.6809, attractions: ["首里城", "国际通"] }
    ]
  },
  {
    country: "韩国", code: "KR", cities: [
      { city: "首尔", lat: 37.5665, lng: 126.978, attractions: ["景福宫", "北村韩屋村", "南山塔"] },
      { city: "仁川", lat: 37.4563, lng: 126.7052, attractions: ["松岛中央公园", "中华街"] },
      { city: "水原", lat: 37.2636, lng: 127.0286, attractions: ["水原华城"] },
      { city: "釜山", lat: 35.1796, lng: 129.0756, attractions: ["海云台", "甘川文化村"] },
      { city: "济州", lat: 33.4996, lng: 126.5312, attractions: ["汉拿山", "城山日出峰"] },
      { city: "庆州", lat: 35.8562, lng: 129.2247, attractions: ["佛国寺", "东宫月池"] },
      { city: "大邱", lat: 35.8714, lng: 128.6014, attractions: ["前山公园", "西门市场"] },
      { city: "大田", lat: 36.3504, lng: 127.3845, attractions: ["国立中央科学馆", "儒城温泉"] },
      { city: "光州", lat: 35.1595, lng: 126.8526, attractions: ["国立亚洲文化殿堂", "无等山"] },
      { city: "蔚山", lat: 35.5384, lng: 129.3114, attractions: ["大王岩公园", "长生浦鲸鱼文化村"] },
      { city: "全州", lat: 35.8242, lng: 127.148, attractions: ["全州韩屋村", "殿洞圣堂"] },
      { city: "江陵", lat: 37.7519, lng: 128.8761, attractions: ["镜浦台", "安木海边"] },
      { city: "束草", lat: 38.207, lng: 128.5918, attractions: ["雪岳山", "束草市场"] },
      { city: "安东", lat: 36.5684, lng: 128.7294, attractions: ["河回村", "月映桥"] },
      { city: "丽水", lat: 34.7604, lng: 127.6622, attractions: ["海上缆车", "世博海洋公园"] },
      { city: "统营", lat: 34.8544, lng: 128.4331, attractions: ["闲丽水道", "东悬崖壁画村"] },
      { city: "木浦", lat: 34.8118, lng: 126.3922, attractions: ["木浦海上缆车", "儒达山"] },
      { city: "浦项", lat: 36.019, lng: 129.3435, attractions: ["虎尾岬", "Space Walk"] },
      { city: "清州", lat: 36.6424, lng: 127.489, attractions: ["上党山城", "国立现代美术馆"] },
      { city: "公州", lat: 36.4465, lng: 127.119, attractions: ["公山城", "武宁王陵"] }
    ]
  },
  {
    country: "新加坡", code: "SG", cities: [
      { city: "新加坡", lat: 1.3521, lng: 103.8198, attractions: ["滨海湾", "圣淘沙", "牛车水", "乌节路", "樟宜机场"] }
    ]
  },
  {
    country: "法国", code: "FR", cities: [
      { city: "巴黎", lat: 48.8566, lng: 2.3522, attractions: ["埃菲尔铁塔", "卢浮宫", "凯旋门"] },
      { city: "凡尔赛", lat: 48.8049, lng: 2.1204, attractions: ["凡尔赛宫"] },
      { city: "尼斯", lat: 43.7102, lng: 7.262, attractions: ["英国人漫步大道", "老城"] },
      { city: "里昂", lat: 45.764, lng: 4.8357, attractions: ["里昂老城", "富维耶圣母院"] },
      { city: "马赛", lat: 43.2965, lng: 5.3698, attractions: ["马赛老港", "守护圣母圣殿"] },
      { city: "波尔多", lat: 44.8378, lng: -0.5792, attractions: ["交易所广场", "葡萄酒城"] },
      { city: "斯特拉斯堡", lat: 48.5734, lng: 7.7521, attractions: ["大教堂", "小法兰西"] },
      { city: "阿维尼翁", lat: 43.9493, lng: 4.8055, attractions: ["教皇宫", "圣贝内泽桥"] }
    ]
  },
  {
    country: "英国", code: "GB", cities: [
      { city: "伦敦", lat: 51.5072, lng: -0.1276, attractions: ["大本钟", "大英博物馆", "塔桥"] },
      { city: "爱丁堡", lat: 55.9533, lng: -3.1883, attractions: ["爱丁堡城堡", "皇家英里"] },
      { city: "曼彻斯特", lat: 53.4808, lng: -2.2426, attractions: ["老特拉福德", "北区"] },
      { city: "利物浦", lat: 53.4084, lng: -2.9916, attractions: ["阿尔伯特码头", "披头士故事馆"] },
      { city: "牛津", lat: 51.752, lng: -1.2577, attractions: ["牛津大学", "基督堂学院"] },
      { city: "剑桥", lat: 52.2053, lng: 0.1218, attractions: ["剑桥大学", "国王学院"] },
      { city: "巴斯", lat: 51.3811, lng: -2.359, attractions: ["罗马浴场", "皇家新月楼"] },
      { city: "约克", lat: 53.959, lng: -1.0815, attractions: ["约克大教堂", "肉铺街"] }
    ]
  },
  {
    country: "意大利", code: "IT", cities: [
      { city: "罗马", lat: 41.9028, lng: 12.4964, attractions: ["斗兽场", "许愿池", "梵蒂冈"] },
      { city: "佛罗伦萨", lat: 43.7696, lng: 11.2558, attractions: ["圣母百花大教堂", "乌菲兹美术馆"] },
      { city: "威尼斯", lat: 45.4408, lng: 12.3155, attractions: ["圣马可广场", "大运河"] },
      { city: "米兰", lat: 45.4642, lng: 9.19, attractions: ["米兰大教堂", "埃马努埃莱二世长廊"] },
      { city: "比萨", lat: 43.7228, lng: 10.4017, attractions: ["比萨斜塔"] },
      { city: "那不勒斯", lat: 40.8518, lng: 14.2681, attractions: ["庞贝古城", "维苏威火山"] },
      { city: "维罗纳", lat: 45.4384, lng: 10.9916, attractions: ["维罗纳竞技场", "朱丽叶故居"] },
      { city: "博洛尼亚", lat: 44.4949, lng: 11.3426, attractions: ["双塔", "马焦雷广场"] },
      { city: "锡耶纳", lat: 43.3188, lng: 11.3308, attractions: ["田野广场", "锡耶纳大教堂"] },
      { city: "阿马尔菲", lat: 40.634, lng: 14.6027, attractions: ["阿马尔菲海岸", "大教堂"] }
    ]
  },
  {
    country: "西班牙", code: "ES", cities: [
      { city: "马德里", lat: 40.4168, lng: -3.7038, attractions: ["普拉多博物馆", "马约尔广场"] },
      { city: "巴塞罗那", lat: 41.3874, lng: 2.1686, attractions: ["圣家堂", "古埃尔公园"] },
      { city: "塞维利亚", lat: 37.3891, lng: -5.9845, attractions: ["西班牙广场", "王宫"] },
      { city: "格拉纳达", lat: 37.1773, lng: -3.5986, attractions: ["阿尔罕布拉宫"] },
      { city: "瓦伦西亚", lat: 39.4699, lng: -0.3763, attractions: ["艺术科学城", "中央市场"] },
      { city: "托莱多", lat: 39.8628, lng: -4.0273, attractions: ["托莱多古城", "大教堂"] },
      { city: "马拉加", lat: 36.7213, lng: -4.4214, attractions: ["阿尔卡萨瓦城堡", "毕加索博物馆"] },
      { city: "圣塞瓦斯蒂安", lat: 43.3183, lng: -1.9812, attractions: ["贝壳湾", "老城"] }
    ]
  },
  {
    country: "德国", code: "DE", cities: [
      { city: "柏林", lat: 52.52, lng: 13.405, attractions: ["勃兰登堡门", "博物馆岛"] },
      { city: "慕尼黑", lat: 48.1351, lng: 11.582, attractions: ["玛利亚广场", "新天鹅堡门户"] },
      { city: "法兰克福", lat: 50.1109, lng: 8.6821, attractions: ["罗马广场", "美因河"] },
      { city: "科隆", lat: 50.9375, lng: 6.9603, attractions: ["科隆大教堂", "霍亨索伦桥"] },
      { city: "汉堡", lat: 53.5511, lng: 9.9937, attractions: ["仓库城", "易北爱乐厅"] },
      { city: "海德堡", lat: 49.3988, lng: 8.6724, attractions: ["海德堡城堡", "哲学家小径"] },
      { city: "德累斯顿", lat: 51.0504, lng: 13.7373, attractions: ["圣母教堂", "茨温格宫"] },
      { city: "纽伦堡", lat: 49.4521, lng: 11.0767, attractions: ["皇帝堡", "老城"] }
    ]
  },
  {
    country: "荷兰", code: "NL", cities: [
      { city: "阿姆斯特丹", lat: 52.3676, lng: 4.9041, attractions: ["运河带", "国立博物馆", "梵高博物馆"] },
      { city: "鹿特丹", lat: 51.9244, lng: 4.4777, attractions: ["立方屋", "伊拉斯谟桥"] },
      { city: "海牙", lat: 52.0705, lng: 4.3007, attractions: ["和平宫", "莫瑞泰斯皇家美术馆"] },
      { city: "乌得勒支", lat: 52.0907, lng: 5.1214, attractions: ["运河码头", "主教塔"] },
      { city: "羊角村", lat: 52.721, lng: 6.078, attractions: ["水上村庄", "运河"] }
    ]
  },
  {
    country: "瑞士", code: "CH", cities: [
      { city: "苏黎世", lat: 47.3769, lng: 8.5417, attractions: ["苏黎世湖", "班霍夫大街"] },
      { city: "日内瓦", lat: 46.2044, lng: 6.1432, attractions: ["日内瓦湖", "大喷泉"] },
      { city: "卢塞恩", lat: 47.0502, lng: 8.3093, attractions: ["卡佩尔廊桥", "卢塞恩湖"] },
      { city: "因特拉肯", lat: 46.6863, lng: 7.8632, attractions: ["少女峰", "何维克街"] },
      { city: "伯尔尼", lat: 46.948, lng: 7.4474, attractions: ["钟楼", "老城"] },
      { city: "采尔马特", lat: 46.0207, lng: 7.7491, attractions: ["马特洪峰", "戈尔内格拉特"] },
      { city: "洛桑", lat: 46.5197, lng: 6.6323, attractions: ["奥林匹克博物馆", "乌希码头"] }
    ]
  },
  {
    country: "葡萄牙", code: "PT", cities: [
      { city: "里斯本", lat: 38.7223, lng: -9.1393, attractions: ["贝伦塔", "阿尔法玛"] },
      { city: "波尔图", lat: 41.1579, lng: -8.6291, attractions: ["路易一世大桥", "莱罗书店"] },
      { city: "辛特拉", lat: 38.8029, lng: -9.3817, attractions: ["佩纳宫", "雷加莱拉庄园"] },
      { city: "法鲁", lat: 37.0194, lng: -7.9304, attractions: ["阿尔加维海岸", "法鲁老城"] },
      { city: "科英布拉", lat: 40.2033, lng: -8.4103, attractions: ["科英布拉大学", "若阿尼娜图书馆"] }
    ]
  },
  {
    country: "奥地利", code: "AT", cities: [
      { city: "维也纳", lat: 48.2082, lng: 16.3738, attractions: ["美泉宫", "金色大厅", "艺术史博物馆"] },
      { city: "萨尔茨堡", lat: 47.8095, lng: 13.055, attractions: ["米拉贝尔宫", "萨尔茨堡城堡"] },
      { city: "因斯布鲁克", lat: 47.2692, lng: 11.4041, attractions: ["黄金屋顶", "北链山"] },
      { city: "哈尔施塔特", lat: 47.5622, lng: 13.6493, attractions: ["哈尔施塔特湖", "盐矿"] }
    ]
  },
  {
    country: "捷克", code: "CZ", cities: [
      { city: "布拉格", lat: 50.0755, lng: 14.4378, attractions: ["查理大桥", "布拉格城堡", "老城广场"] },
      { city: "克鲁姆洛夫", lat: 48.8127, lng: 14.3175, attractions: ["克鲁姆洛夫城堡", "老城"] },
      { city: "卡罗维发利", lat: 50.2319, lng: 12.8719, attractions: ["温泉回廊", "磨坊温泉长廊"] }
    ]
  },
  {
    country: "匈牙利", code: "HU", cities: [
      { city: "布达佩斯", lat: 47.4979, lng: 19.0402, attractions: ["国会大厦", "渔人堡", "塞切尼浴场"] },
      { city: "埃格尔", lat: 47.9025, lng: 20.3772, attractions: ["埃格尔城堡", "美女谷"] }
    ]
  },
  {
    country: "比利时", code: "BE", cities: [
      { city: "布鲁塞尔", lat: 50.8503, lng: 4.3517, attractions: ["大广场", "撒尿小童"] },
      { city: "布鲁日", lat: 51.2093, lng: 3.2247, attractions: ["钟楼", "玫瑰码头"] },
      { city: "根特", lat: 51.0543, lng: 3.7174, attractions: ["伯爵城堡", "圣米歇尔桥"] },
      { city: "安特卫普", lat: 51.2194, lng: 4.4025, attractions: ["中央车站", "圣母大教堂"] }
    ]
  },
  {
    country: "丹麦", code: "DK", cities: [
      { city: "哥本哈根", lat: 55.6761, lng: 12.5683, attractions: ["新港", "小美人鱼", "蒂沃利花园"] },
      { city: "奥胡斯", lat: 56.1629, lng: 10.2039, attractions: ["ARoS美术馆", "老城博物馆"] }
    ]
  },
  {
    country: "瑞典", code: "SE", cities: [
      { city: "斯德哥尔摩", lat: 59.3293, lng: 18.0686, attractions: ["老城", "瓦萨博物馆"] },
      { city: "哥德堡", lat: 57.7089, lng: 11.9746, attractions: ["里瑟本游乐园", "哈加老城"] },
      { city: "马尔默", lat: 55.605, lng: 13.0038, attractions: ["旋转大楼", "小广场"] }
    ]
  },
  {
    country: "挪威", code: "NO", cities: [
      { city: "奥斯陆", lat: 59.9139, lng: 10.7522, attractions: ["歌剧院", "维格兰雕塑公园"] },
      { city: "卑尔根", lat: 60.3913, lng: 5.3221, attractions: ["布吕根木屋群", "弗洛伊恩山"] },
      { city: "特罗姆瑟", lat: 69.6492, lng: 18.9553, attractions: ["北极教堂", "极光"] },
      { city: "斯塔万格", lat: 58.97, lng: 5.7331, attractions: ["布道石", "老城"] },
      { city: "奥勒松", lat: 62.4722, lng: 6.1495, attractions: ["阿克斯拉观景台", "峡湾"] }
    ]
  },
  {
    country: "芬兰", code: "FI", cities: [
      { city: "赫尔辛基", lat: 60.1699, lng: 24.9384, attractions: ["白教堂", "芬兰堡"] },
      { city: "罗瓦涅米", lat: 66.5039, lng: 25.7294, attractions: ["圣诞老人村", "北极圈"] },
      { city: "图尔库", lat: 60.4518, lng: 22.2666, attractions: ["图尔库城堡", "奥拉河"] }
    ]
  },
  {
    country: "爱尔兰", code: "IE", cities: [
      { city: "都柏林", lat: 53.3498, lng: -6.2603, attractions: ["圣三一学院", "健力士仓库"] },
      { city: "戈尔韦", lat: 53.2707, lng: -9.0568, attractions: ["拉丁区", "莫赫悬崖门户"] },
      { city: "科克", lat: 51.8985, lng: -8.4756, attractions: ["英国市场", "布拉尼城堡"] },
      { city: "基拉尼", lat: 52.0599, lng: -9.5044, attractions: ["基拉尼国家公园", "罗斯城堡"] }
    ]
  },
  {
    country: "波兰", code: "PL", cities: [
      { city: "华沙", lat: 52.2297, lng: 21.0122, attractions: ["老城", "皇家城堡"] },
      { city: "克拉科夫", lat: 50.0647, lng: 19.945, attractions: ["中央集市广场", "瓦维尔城堡"] },
      { city: "格但斯克", lat: 54.352, lng: 18.6466, attractions: ["长街", "海神喷泉"] },
      { city: "弗罗茨瓦夫", lat: 51.1079, lng: 17.0385, attractions: ["市场广场", "小矮人雕像"] },
      { city: "扎科帕内", lat: 49.2992, lng: 19.9496, attractions: ["塔特拉山", "克鲁波夫基街"] }
    ]
  },
  {
    country: "克罗地亚", code: "HR", cities: [
      { city: "杜布罗夫尼克", lat: 42.6507, lng: 18.0944, attractions: ["古城墙", "斯特拉顿街"] },
      { city: "斯普利特", lat: 43.5081, lng: 16.4402, attractions: ["戴克里先宫", "里瓦海滨"] },
      { city: "萨格勒布", lat: 45.815, lng: 15.9819, attractions: ["圣马可教堂", "上城"] },
      { city: "扎达尔", lat: 44.1194, lng: 15.2314, attractions: ["海风琴", "太阳敬礼"] }
    ]
  },
  {
    country: "希腊", code: "GR", cities: [
      { city: "雅典", lat: 37.9838, lng: 23.7275, attractions: ["雅典卫城", "普拉卡"] },
      { city: "圣托里尼", lat: 36.3932, lng: 25.4615, attractions: ["伊亚日落", "蓝顶教堂"] },
      { city: "米科诺斯", lat: 37.4467, lng: 25.3289, attractions: ["小威尼斯", "风车"] },
      { city: "塞萨洛尼基", lat: 40.6401, lng: 22.9444, attractions: ["白塔", "亚里士多德广场"] },
      { city: "卡兰巴卡", lat: 39.704, lng: 21.626, attractions: ["迈泰奥拉修道院"] }
    ]
  },
  {
    country: "土耳其", code: "TR", cities: [
      { city: "伊斯坦布尔", lat: 41.0082, lng: 28.9784, attractions: ["圣索菲亚大教堂", "蓝色清真寺"] },
      { city: "卡帕多奇亚", lat: 38.6431, lng: 34.8289, attractions: ["热气球", "格雷梅"] },
      { city: "安塔利亚", lat: 36.8969, lng: 30.7133, attractions: ["卡莱伊奇老城", "杜登瀑布"] },
      { city: "伊兹密尔", lat: 38.4237, lng: 27.1428, attractions: ["科纳克广场", "以弗所门户"] },
      { city: "棉花堡", lat: 37.9137, lng: 29.1187, attractions: ["棉花堡温泉", "希拉波利斯"] }
    ]
  },
  {
    country: "冰岛", code: "IS", cities: [
      { city: "雷克雅未克", lat: 64.1466, lng: -21.9426, attractions: ["哈尔格林姆斯教堂", "太阳航海者"] },
      { city: "维克", lat: 63.4186, lng: -19.006, attractions: ["黑沙滩", "迪霍拉里"] },
      { city: "阿克雷里", lat: 65.6885, lng: -18.1262, attractions: ["阿克雷里教堂", "众神瀑布"] },
      { city: "赫本", lat: 64.2539, lng: -15.2082, attractions: ["杰古沙龙冰河湖", "瓦特纳冰川"] }
    ]
  }
];
