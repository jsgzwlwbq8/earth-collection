const DB_NAME = "food-travel-diary";
const STORE_NAME = "entries";
const DB_VERSION = 1;
const ROUTE_SETTINGS_KEY = "earth-collection-route-settings";
const JOURNAL_DRAFT_KEY = "earth-collection-journal-draft";
const STUDY_DIARY_KEY = "earth-collection-study-diary";
const GUIDE_HIDE_KEY = "earth-collection-hide-guide-v1";
const CHINA_CITIES = Array.isArray(window.CHINA_CITIES) ? window.CHINA_CITIES : [];
const TRAVEL_MODES = {
  plane: { emoji: "✈️", name: "飞机", color: "#82c9ff", altitude: .22, stroke: .26, dashLength: .34, dashGap: .12, speed: 2600 },
  train: { emoji: "🚄", name: "高铁", color: "#ffd36e", altitude: .035, stroke: .34, dashLength: .18, dashGap: .06, speed: 1600 },
  bus: { emoji: "🚌", name: "大巴", color: "#ff9f78", altitude: .025, stroke: .32, dashLength: .15, dashGap: .07, speed: 2100 },
  cruise: { emoji: "🛳️", name: "邮轮", color: "#68e0dc", altitude: .015, stroke: .38, dashLength: .24, dashGap: .08, speed: 3200 }
};
const STUDY_QUESTS = [
  { id: "campus", emoji: "🏫", title: "探索一个校园角落", detail: "找到一处以后会想念的校园地点", xp: 120 },
  { id: "cook", emoji: "🍳", title: "做一顿家乡味道", detail: "在异国复刻一道熟悉的食物", xp: 120 },
  { id: "language", emoji: "🗣️", title: "主动说一次当地语言", detail: "勇敢开口，哪怕只是一句问候", xp: 120 },
  { id: "friend", emoji: "🤝", title: "认识一位新朋友", detail: "记住对方的名字和一个小故事", xp: 120 },
  { id: "explore", emoji: "🧭", title: "独自解锁一个新地点", detail: "去一处从未到过的街区或城市", xp: 120 },
  { id: "culture", emoji: "💭", title: "记录一次文化冲击", detail: "写下让你惊讶或不习惯的瞬间", xp: 120 }
];
const CHECKIN_BADGES = [
  { days: 6, emoji: "🌱", name: "冒险萌芽", colors: ["#77e4c8", "#235d70"] },
  { days: 66, emoji: "🧭", name: "城市漫游者", colors: ["#80c8ff", "#5452a6"] },
  { days: 100, emoji: "💯", name: "百日收藏家", colors: ["#ffca67", "#bd654e"] },
  { days: 200, emoji: "🌍", name: "世界观察员", colors: ["#72e3dd", "#237c9c"] },
  { days: 520, emoji: "💗", name: "热爱每一天", colors: ["#ff91bc", "#a23978"] },
  { days: 666, emoji: "🔥", name: "生活探险家", colors: ["#ffb45d", "#bd3c58"] },
  { days: 888, emoji: "✨", name: "回忆典藏家", colors: ["#e4c8ff", "#7058bf"] }
];

const BASE_LOCATIONS = [
  { country: "中国", code: "CN", cities: [{ city: "北京", lat: 39.9042, lng: 116.4074 }, { city: "上海", lat: 31.2304, lng: 121.4737 }, { city: "成都", lat: 30.5728, lng: 104.0668 }, { city: "广州", lat: 23.1291, lng: 113.2644 }, { city: "香港", lat: 22.3193, lng: 114.1694 }] },
  { country: "日本", code: "JP", cities: [{ city: "东京", lat: 35.6762, lng: 139.6503 }, { city: "京都", lat: 35.0116, lng: 135.7681 }, { city: "大阪", lat: 34.6937, lng: 135.5023 }] },
  { country: "韩国", code: "KR", cities: [{ city: "首尔", lat: 37.5665, lng: 126.978 }, { city: "釜山", lat: 35.1796, lng: 129.0756 }] },
  { country: "泰国", code: "TH", cities: [{ city: "曼谷", lat: 13.7563, lng: 100.5018 }, { city: "清迈", lat: 18.7883, lng: 98.9853 }] },
  { country: "新加坡", code: "SG", cities: [{ city: "新加坡", lat: 1.3521, lng: 103.8198 }] },
  { country: "法国", code: "FR", cities: [{ city: "巴黎", lat: 48.8566, lng: 2.3522 }, { city: "尼斯", lat: 43.7102, lng: 7.262 }] },
  { country: "英国", code: "GB", cities: [{ city: "伦敦", lat: 51.5072, lng: -0.1276 }, { city: "爱丁堡", lat: 55.9533, lng: -3.1883 }] },
  { country: "意大利", code: "IT", cities: [{ city: "罗马", lat: 41.9028, lng: 12.4964 }, { city: "佛罗伦萨", lat: 43.7696, lng: 11.2558 }, { city: "威尼斯", lat: 45.4408, lng: 12.3155 }] },
  { country: "西班牙", code: "ES", cities: [{ city: "巴塞罗那", lat: 41.3874, lng: 2.1686 }, { city: "马德里", lat: 40.4168, lng: -3.7038 }] },
  { country: "美国", code: "US", cities: [{ city: "纽约", lat: 40.7128, lng: -74.006 }, { city: "华盛顿", lat: 38.9072, lng: -77.0369 }, { city: "芝加哥", lat: 41.8781, lng: -87.6298 }, { city: "西雅图", lat: 47.6062, lng: -122.3321 }, { city: "洛杉矶", lat: 34.0522, lng: -118.2437 }, { city: "旧金山", lat: 37.7749, lng: -122.4194 }, { city: "圣地亚哥", lat: 32.7157, lng: -117.1611 }, { city: "萨克拉门托", lat: 38.5816, lng: -121.4944 }, { city: "圣何塞", lat: 37.3382, lng: -121.8863 }, { city: "圣塔芭芭拉", lat: 34.4208, lng: -119.6982 }, { city: "蒙特雷", lat: 36.6002, lng: -121.8947 }, { city: "棕榈泉", lat: 33.8303, lng: -116.5453 }, { city: "优胜美地", lat: 37.8651, lng: -119.5383 }, { city: "太浩湖", lat: 39.0968, lng: -120.0324 }, { city: "拉斯维加斯", lat: 36.1699, lng: -115.1398 }, { city: "迈阿密", lat: 25.7617, lng: -80.1918 }, { city: "火奴鲁鲁", lat: 21.3099, lng: -157.8581 }] },
  { country: "加拿大", code: "CA", cities: [{ city: "温哥华", lat: 49.2827, lng: -123.1207 }, { city: "多伦多", lat: 43.6532, lng: -79.3832 }] },
  { country: "澳大利亚", code: "AU", cities: [{ city: "悉尼", lat: -33.8688, lng: 151.2093 }, { city: "墨尔本", lat: -37.8136, lng: 144.9631 }] },
  { country: "新西兰", code: "NZ", cities: [{ city: "奥克兰", lat: -36.8509, lng: 174.7645 }, { city: "皇后镇", lat: -45.0312, lng: 168.6626 }] },
  { country: "冰岛", code: "IS", cities: [{ city: "雷克雅未克", lat: 64.1466, lng: -21.9426 }] },
  { country: "埃及", code: "EG", cities: [{ city: "开罗", lat: 30.0444, lng: 31.2357 }] }
  ,{ country: "德国", code: "DE", cities: [{ city: "柏林", lat: 52.52, lng: 13.405 }, { city: "慕尼黑", lat: 48.1351, lng: 11.582 }] }
  ,{ country: "荷兰", code: "NL", cities: [{ city: "阿姆斯特丹", lat: 52.3676, lng: 4.9041 }] }
  ,{ country: "瑞士", code: "CH", cities: [{ city: "苏黎世", lat: 47.3769, lng: 8.5417 }, { city: "日内瓦", lat: 46.2044, lng: 6.1432 }] }
  ,{ country: "希腊", code: "GR", cities: [{ city: "雅典", lat: 37.9838, lng: 23.7275 }, { city: "圣托里尼", lat: 36.3932, lng: 25.4615 }] }
  ,{ country: "土耳其", code: "TR", cities: [{ city: "伊斯坦布尔", lat: 41.0082, lng: 28.9784 }, { city: "卡帕多奇亚", lat: 38.6431, lng: 34.8289 }] }
  ,{ country: "阿联酋", code: "AE", cities: [{ city: "迪拜", lat: 25.2048, lng: 55.2708 }, { city: "阿布扎比", lat: 24.4539, lng: 54.3773 }] }
  ,{ country: "印度", code: "IN", cities: [{ city: "新德里", lat: 28.6139, lng: 77.209 }, { city: "孟买", lat: 19.076, lng: 72.8777 }] }
  ,{ country: "印度尼西亚", code: "ID", cities: [{ city: "巴厘岛", lat: -8.3405, lng: 115.092 }] }
  ,{ country: "越南", code: "VN", cities: [{ city: "河内", lat: 21.0278, lng: 105.8342 }, { city: "胡志明市", lat: 10.8231, lng: 106.6297 }] }
  ,{ country: "墨西哥", code: "MX", cities: [{ city: "墨西哥城", lat: 19.4326, lng: -99.1332 }, { city: "坎昆", lat: 21.1619, lng: -86.8515 }] }
  ,{ country: "巴西", code: "BR", cities: [{ city: "里约热内卢", lat: -22.9068, lng: -43.1729 }, { city: "圣保罗", lat: -23.5505, lng: -46.6333 }] }
  ,{ country: "阿根廷", code: "AR", cities: [{ city: "布宜诺斯艾利斯", lat: -34.6037, lng: -58.3816 }] }
  ,{ country: "南非", code: "ZA", cities: [{ city: "开普敦", lat: -33.9249, lng: 18.4241 }] }
];

const LOCATIONS = BASE_LOCATIONS.map((item) => ({ ...item, cities: [...item.cities] }));
(Array.isArray(window.POPULAR_LOCATIONS) ? window.POPULAR_LOCATIONS : []).forEach((extraCountry) => {
  let country = LOCATIONS.find((item) => item.code === extraCountry.code);
  if (!country) {
    country = { country: extraCountry.country, code: extraCountry.code, cities: [] };
    LOCATIONS.push(country);
  }
  extraCountry.cities.forEach((extraCity) => {
    const index = country.cities.findIndex((city) => city.city === extraCity.city);
    if (index >= 0) country.cities[index] = { ...country.cities[index], ...extraCity };
    else country.cities.push(extraCity);
  });
});

const state = {
  entries: [], selectedLocation: null, mapSelection: null, activeEntryId: null, imageData: "", globe: null, globeMode: "far", started: false, pendingAdd: false, pendingStudyMemory: false, map: null, mapMarker: null, calendarDate: new Date(),
  routeSettings: { closeLoop: true, returnMode: "plane" },
  journalDraft: { title: "", startDate: "", endDate: "", fun: "" },
  studyDiary: { school: "", city: "", startDate: "", completedQuestIds: [], notes: [], checkIns: [] },
  guideFromStart: false
};
const $ = (selector) => document.querySelector(selector);
function notifyCloudSync(type, detail = {}) {
  window.dispatchEvent(new CustomEvent("earth-local-change", { detail: { type, ...detail } }));
}
const elements = {
  welcome: $("#welcome"), startBtn: $("#startBtn"), globe: $("#globe"), fallback: $("#globeFallback"), homeCosmos: $("#homeCosmos"), marsMarker: $("#marsMarker"), marsPositionText: $("#marsPositionText"), statusBar: $("#statusBar"), addBtn: $("#addBtn"), routeBtn: $("#routeBtn"), routeShortcutBtn: $("#routeShortcutBtn"), journalBtn: $("#journalBtn"), studyBtn: $("#studyBtn"), backupBtn: $("#backupBtn"), backupDialog: $("#backupDialog"), helpBtn: $("#helpBtn"), onboardingDialog: $("#onboardingDialog"), guideCloseBtn: $("#guideCloseBtn"), guideDoneBtn: $("#guideDoneBtn"), guideNoReminderInput: $("#guideNoReminderInput"),
  count: $("#collectionCount"), currentPlace: $("#currentPlace"), chooseCityBtn: $("#chooseCityBtn"), recenterBtn: $("#recenterBtn"), zoomHint: $("#zoomHint"),
  locationDialog: $("#locationDialog"), locationForm: $("#locationForm"), countrySearch: $("#countrySearch"), citySearch: $("#citySearch"), countryList: $("#countryList"), cityList: $("#cityList"),
  locateBtn: $("#locateBtn"), addressSearch: $("#addressSearch"), addressSearchBtn: $("#addressSearchBtn"), flatMap: $("#flatMap"), mapStatus: $("#mapStatus"), locationQuickPicks: $("#locationQuickPicks"),
  entryDialog: $("#entryDialog"), entryForm: $("#entryForm"), entryFormTitle: $("#entryFormTitle"), entryId: $("#entryId"), photoField: $(".photo-field"), photoInput: $("#photoInput"), photoPicker: $("#photoPicker"), photoPickerText: $("#photoPickerText"), photoPrompt: $("#photoPrompt"), photoPreview: $("#photoPreview"),
  countryInput: $("#countryInput"), countryCodeInput: $("#countryCodeInput"), cityInput: $("#cityInput"), latInput: $("#latInput"), lngInput: $("#lngInput"), placeInput: $("#placeInput"), subjectInput: $("#subjectInput"), dateInput: $("#dateInput"), travelModeInput: $("#travelModeInput"), studyMemoryInput: $("#studyMemoryInput"), typeInput: $("#typeInput"), moodInput: $("#moodInput"), textInput: $("#textInput"),
  detailDialog: $("#detailDialog"), detailPhoto: $("#detailPhoto"), detailType: $("#detailType"), detailMood: $("#detailMood"), detailLocation: $("#detailLocation"), detailSubject: $("#detailSubject"), detailMeta: $("#detailMeta"), detailPlace: $("#detailPlace"), detailText: $("#detailText"), editBtn: $("#editBtn"), deleteBtn: $("#deleteBtn"),
  cityDialog: $("#cityDialog"), cityDialogTitle: $("#cityDialogTitle"), cityEntries: $("#cityEntries"), routeDialog: $("#routeDialog"), routeSummary: $("#routeSummary"), routeList: $("#routeList"), closeLoopInput: $("#closeLoopInput"), returnModeInput: $("#returnModeInput"), viewWholeRouteBtn: $("#viewWholeRouteBtn"),
  studyDialog: $("#studyDialog"), studySchoolInput: $("#studySchoolInput"), studyCityInput: $("#studyCityInput"), studyStartInput: $("#studyStartInput"), studyChapter: $("#studyChapter"), studyLevel: $("#studyLevel"), studyProgressBar: $("#studyProgressBar"), studyXpText: $("#studyXpText"), studyDaysText: $("#studyDaysText"), studyBadgeGrid: $("#studyBadgeGrid"), dailyCheckinNote: $("#dailyCheckinNote"), sceneryCheckinBtn: $("#sceneryCheckinBtn"), foodCheckinBtn: $("#foodCheckinBtn"), dailyCheckinStatus: $("#dailyCheckinStatus"), dailyCheckinList: $("#dailyCheckinList"), studyQuestCount: $("#studyQuestCount"), studyQuestList: $("#studyQuestList"), studyNoteForm: $("#studyNoteForm"), studyNoteDate: $("#studyNoteDate"), studyNoteMood: $("#studyNoteMood"), studyNoteTitle: $("#studyNoteTitle"), studyNoteText: $("#studyNoteText"), studyPhotoBtn: $("#studyPhotoBtn"), studyPhotoList: $("#studyPhotoList"), studyNoteList: $("#studyNoteList"),
  journalDialog: $("#journalDialog"), journalTitleInput: $("#journalTitleInput"), journalStartInput: $("#journalStartInput"), journalEndInput: $("#journalEndInput"), journalFunInput: $("#journalFunInput"), journalSummary: $("#journalSummary"), journalPreview: $("#journalPreview"), copyJournalBtn: $("#copyJournalBtn"), shareJournalBtn: $("#shareJournalBtn"), calendarBtn: $("#calendarBtn"), calendarDialog: $("#calendarDialog"), calendarTitle: $("#calendarTitle"), calendarGrid: $("#calendarGrid"), moodSummary: $("#moodSummary"), calendarDayList: $("#calendarDayList"), prevMonthBtn: $("#prevMonthBtn"), nextMonthBtn: $("#nextMonthBtn"), newDiaryBtn: $("#newDiaryBtn"), exportBtn: $("#exportBtn"), importInput: $("#importInput"), toast: $("#toast")
};

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runStore(mode, action) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const result = action(tx.objectStore(STORE_NAME));
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function getAllEntries() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

const saveEntry = (entry) => runStore("readwrite", (store) => store.put(entry));
const removeEntry = (id) => runStore("readwrite", (store) => store.delete(id));
const replaceEntries = (entries) => runStore("readwrite", (store) => { store.clear(); entries.forEach((entry) => store.put(entry)); });

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function createId() {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const oldType = entry.type === "food" ? "🍜 食物" : entry.type === "travel" ? "🌳 风景" : entry.type;
  return {
    id: String(entry.id || createId()),
    countryName: String(entry.countryName || "未标注"),
    countryCode: String(entry.countryCode || "ZZ").toUpperCase(),
    cityName: String(entry.cityName || entry.location || "待补充"),
    lat: Number.isFinite(Number(entry.lat)) ? Number(entry.lat) : 0,
    lng: Number.isFinite(Number(entry.lng)) ? Number(entry.lng) : 0,
    placeName: String(entry.placeName || entry.title || ""),
    subjectName: String(entry.subjectName || ""),
    date: /^\d{4}-\d{2}-\d{2}$/.test(entry.date) ? entry.date : localDate(),
    photo: String(entry.photo || entry.image || ""),
    text: String(entry.text || entry.note || ""),
    mood: String(entry.mood || "💭 难以形容"),
    type: ["🏛 建筑", "🍜 食物", "🌳 风景", "🐶 动物", "🎁 物品", "✨ 其他"].includes(oldType) ? oldType : "✨ 其他",
    travelMode: normalizeTravelMode(entry.travelMode),
    studyMemory: entry.studyMemory === true,
    createdAt: Number.isFinite(Number(entry.createdAt)) ? Number(entry.createdAt) : Date.now(),
    updatedAt: Number.isFinite(Number(entry.updatedAt)) ? Number(entry.updatedAt) : (Number.isFinite(Number(entry.createdAt)) ? Number(entry.createdAt) : Date.now())
  };
}

function isValidImport(entry) {
  const item = normalizeEntry(entry);
  return Boolean(item && item.id && item.countryName && item.cityName && item.date && item.lat >= -90 && item.lat <= 90 && item.lng >= -180 && item.lng <= 180);
}

function findCountry(name) { return LOCATIONS.find((item) => item.country === name.trim()); }
function normalizeChinaCityName(name) {
  return String(name || "").trim().replace(/(特别行政区|自治州|地区|盟|市)$/u, "");
}

function findCity(countryName, cityName) {
  const country = findCountry(countryName);
  const cleanCityName = cityName.trim();
  if (!country || !cleanCityName) return null;
  const city = country.cities.find((item) =>
    item.city === cleanCityName ||
    (country.code === "CN" && normalizeChinaCityName(item.city) === normalizeChinaCityName(cleanCityName))
  );
  if (city) return { country: country.country, code: country.code, ...city };
  if (country.code !== "CN") return null;
  const chinaCity = CHINA_CITIES.find((item) =>
    item.city === cleanCityName ||
    normalizeChinaCityName(item.city) === normalizeChinaCityName(cleanCityName)
  );
  return chinaCity ? { country: "中国", code: "CN", ...chinaCity, lat: null, lng: null } : null;
}

function fillCountryList() {
  elements.countryList.innerHTML = LOCATIONS.map((item) => `<option value="${item.country}"></option>`).join("");
}

function fillCityList(countryName) {
  const country = findCountry(countryName);
  const cities = country?.code === "CN"
    ? CHINA_CITIES
    : country ? country.cities : LOCATIONS.flatMap((item) => item.cities);
  elements.cityList.innerHTML = "";
  cities.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.city;
    if (item.province) option.label = [item.province, item.parent].filter(Boolean).join(" · ");
    else if (item.attractions?.length) option.label = item.attractions.join(" · ");
    elements.cityList.appendChild(option);
  });
}

function hasCoordinates(location) {
  return Number.isFinite(location?.lat) && Number.isFinite(location?.lng);
}

async function locateListedCity(location) {
  if (hasCoordinates(location)) return location;
  const query = [location.province, location.parent, location.city, "中国"].filter(Boolean).join(" ");
  const data = await requestGeocode(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1&addressdetails=1&accept-language=zh-CN`);
  if (!data.length) throw new Error("暂时没有找到这个城市，请改用地址搜索");
  return { ...location, lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

function fillQuickLocations() {
  const californiaCities = ["旧金山", "洛杉矶", "圣地亚哥", "萨克拉门托", "优胜美地", "太浩湖"];
  elements.locationQuickPicks.innerHTML = "";
  californiaCities.forEach((cityName) => {
    const location = findCity("美国", cityName);
    if (!location) return;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `加州 · ${cityName}`;
    button.addEventListener("click", () => setMapSelection(location, `美国 · 加利福尼亚州 · ${cityName}`));
    elements.locationQuickPicks.appendChild(button);
  });
}

function initMap() {
  if (state.map) return;
  if (typeof L === "undefined") {
    elements.flatMap.textContent = "平面地图暂时未加载，请检查网络后刷新";
    elements.flatMap.classList.add("map-fallback");
    return;
  }
  state.map = L.map(elements.flatMap, { zoomControl: true }).setView([25, 10], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(state.map);
  state.map.on("click", async (event) => {
    const { lat, lng } = event.latlng;
    setMapSelection({ country: "未标注", code: "ZZ", city: "地图位置", lat, lng }, "正在识别地图位置…");
    await reverseGeocode(lat, lng);
  });
}

function openLocationDialog() {
  if (!elements.locationDialog.open) elements.locationDialog.showModal();
  initMap();
  setTimeout(() => {
    state.map?.invalidateSize();
    if (state.selectedLocation) setMapLocation(state.selectedLocation.lat, state.selectedLocation.lng, 9);
  }, 80);
}

function setMapLocation(lat, lng, zoom = 12) {
  if (!state.map) return;
  if (state.mapMarker) state.mapMarker.setLatLng([lat, lng]);
  else state.mapMarker = L.marker([lat, lng]).addTo(state.map);
  state.map.setView([lat, lng], zoom);
}

function setMapSelection(location, message) {
  state.mapSelection = location;
  elements.countrySearch.value = location.country;
  elements.citySearch.value = location.city;
  fillCityList(location.country);
  setMapLocation(location.lat, location.lng);
  elements.mapStatus.textContent = message || `${location.country} · ${location.city}`;
}

let lastGeocodeAt = 0;
async function requestGeocode(url) {
  const now = Date.now();
  if (now - lastGeocodeAt < 1100) throw new Error("请稍等一秒再查询");
  lastGeocodeAt = now;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("地图查询暂时不可用");
  return response.json();
}

function locationFromAddress(address, lat, lng) {
  const cleanName = (value, fallback) => String(value || fallback).split(";")[0];
  const country = cleanName(address.country, "未标注");
  const city = cleanName(address.city || address.town || address.village || address.municipality || address.county || address.state, "地图位置");
  return { country, code: String(address.country_code || "ZZ").toUpperCase(), city, lat: Number(lat), lng: Number(lng) };
}

async function reverseGeocode(lat, lng) {
  try {
    const data = await requestGeocode(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&addressdetails=1&accept-language=zh-CN`);
    const location = locationFromAddress(data.address || {}, lat, lng);
    setMapSelection(location, data.display_name || `${location.country} · ${location.city}`);
  } catch (error) {
    elements.mapStatus.textContent = `已选择坐标 ${lat.toFixed(4)}, ${lng.toFixed(4)}；${error.message}`;
  }
}

async function searchAddress() {
  const query = elements.addressSearch.value.trim();
  if (!query) { toast("请输入地址或地标"); return; }
  elements.addressSearchBtn.disabled = true;
  elements.mapStatus.textContent = "正在地图上查找…";
  try {
    const data = await requestGeocode(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1&addressdetails=1&accept-language=zh-CN`);
    if (!data.length) throw new Error("没有找到这个地址");
    const result = data[0];
    const location = locationFromAddress(result.address || {}, result.lat, result.lon);
    setMapSelection(location, result.display_name);
  } catch (error) {
    elements.mapStatus.textContent = error.message;
    toast(error.message);
  } finally {
    elements.addressSearchBtn.disabled = false;
  }
}

function cityGroups() {
  const groups = new Map();
  state.entries.forEach((entry) => {
    const key = `${entry.countryCode}|${entry.cityName}`;
    if (!groups.has(key)) groups.set(key, { key, countryName: entry.countryName, cityName: entry.cityName, lat: entry.lat, lng: entry.lng, entries: [] });
    groups.get(key).entries.push(entry);
  });
  return [...groups.values()];
}

function typeEmoji(type) { return type.split(" ")[0] || "✨"; }
function moodEmoji(mood) { return mood.split(" ")[0] || "💭"; }
function formatDate(value) { return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${value}T00:00:00`)); }
function normalizeTravelMode(mode) { return Object.prototype.hasOwnProperty.call(TRAVEL_MODES, mode) ? mode : "plane"; }
function travelModeEmoji(mode) { return TRAVEL_MODES[normalizeTravelMode(mode)].emoji; }
function travelModeName(mode) { return TRAVEL_MODES[normalizeTravelMode(mode)].name; }
function travelModeStyle(mode) { return TRAVEL_MODES[normalizeTravelMode(mode)]; }

function loadRouteSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(ROUTE_SETTINGS_KEY) || "{}");
    state.routeSettings = {
      closeLoop: saved.closeLoop !== false,
      returnMode: normalizeTravelMode(saved.returnMode)
    };
  } catch {
    state.routeSettings = { closeLoop: true, returnMode: "plane" };
  }
}

function saveRouteSettings() {
  localStorage.setItem(ROUTE_SETTINGS_KEY, JSON.stringify(state.routeSettings));
  notifyCloudSync("profile");
}

function routeStops() {
  const sorted = [...state.entries]
    .filter((entry) => Number.isFinite(entry.lat) && Number.isFinite(entry.lng))
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  return sorted.filter((entry, index) => {
    const previous = sorted[index - 1];
    return !previous || previous.cityName !== entry.cityName || previous.countryCode !== entry.countryCode;
  });
}

function travelRoutes() {
  const stops = routeStops();
  const routes = [];
  for (let index = 1; index < stops.length; index += 1) {
    const from = stops[index - 1];
    const to = stops[index];
    routes.push({
      id: `${from.id}-${to.id}`,
      from, to,
      startLat: from.lat, startLng: from.lng,
      endLat: to.lat, endLng: to.lng,
      mode: normalizeTravelMode(to.travelMode),
      closing: false
    });
  }
  if (state.routeSettings.closeLoop && stops.length >= 3) {
    const from = stops[stops.length - 1];
    const to = stops[0];
    routes.push({
      id: `${from.id}-${to.id}-return`,
      from, to,
      startLat: from.lat, startLng: from.lng,
      endLat: to.lat, endLng: to.lng,
      mode: state.routeSettings.returnMode,
      closing: true
    });
  }
  return routes;
}

function routeMidpoint(route) {
  const toRadians = (value) => value * Math.PI / 180;
  const toDegrees = (value) => value * 180 / Math.PI;
  const lat1 = toRadians(route.startLat);
  const lng1 = toRadians(route.startLng);
  const lat2 = toRadians(route.endLat);
  const deltaLng = toRadians(route.endLng - route.startLng);
  const bx = Math.cos(lat2) * Math.cos(deltaLng);
  const by = Math.cos(lat2) * Math.sin(deltaLng);
  const lat = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bx) ** 2 + by ** 2));
  const lng = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
  return { lat: toDegrees(lat), lng: ((toDegrees(lng) + 540) % 360) - 180 };
}

function routeVehicleMarkers(routes) {
  return routes.slice(0, 32).map((route) => ({ kind: "route", route, ...routeMidpoint(route) }));
}

let toastTimer;
function toast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function createMarker(item, mode) {
  if (item.kind === "route") {
    const vehicle = document.createElement("div");
    vehicle.className = `route-vehicle ${item.route.mode}`;
    vehicle.textContent = travelModeEmoji(item.route.mode);
    vehicle.title = `${item.route.from.cityName} → ${item.route.to.cityName} · ${travelModeName(item.route.mode)}`;
    return vehicle;
  }
  if (mode === "far") {
    const button = document.createElement("button");
    button.className = "city-marker";
    button.textContent = `${item.cityName} · ${item.entries.length}`;
    button.addEventListener("click", () => openCity(item));
    return button;
  }
  if (mode === "mid") {
    const button = document.createElement("button");
    button.className = "type-marker";
    button.textContent = typeEmoji(item.type);
    button.title = `${item.cityName} · ${item.type}`;
    button.addEventListener("click", () => openDetail(item.id));
    return button;
  }
  const button = document.createElement("button");
  button.className = "collectible";
  button.title = `${item.cityName} · ${item.placeName || item.type}`;
  const image = document.createElement("img");
  image.src = item.photo || placeholderImage(item.type);
  image.alt = item.placeName || `${item.cityName}的收藏`;
  const badge = document.createElement("span");
  badge.textContent = typeEmoji(item.type);
  button.append(image, badge);
  button.addEventListener("click", () => openDetail(item.id));
  return button;
}

function placeholderImage(type) {
  const emoji = typeEmoji(type);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#17335b"/><stop offset="1" stop-color="#09142e"/></linearGradient></defs><rect width="100%" height="100%" rx="40" fill="url(#g)"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="180">${emoji}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function updateGlobeLayers(force = false) {
  if (!state.globe) return;
  const altitude = state.globe.pointOfView().altitude ?? 2.2;
  const mode = altitude > 1.65 ? "far" : altitude > .72 ? "mid" : "close";
  if (!force && mode === state.globeMode) return;
  state.globeMode = mode;
  const groups = cityGroups();
  const routes = travelRoutes();
  const collectionData = mode === "far" ? groups : state.entries.slice(0, mode === "close" ? 45 : 80);
  const htmlData = [...collectionData, ...routeVehicleMarkers(routes)];
  state.globe.pointsData(mode === "far" ? groups : [])
    .arcsData(routes)
    .htmlElementsData(htmlData)
    .htmlLat((item) => item.lat)
    .htmlLng((item) => item.lng)
    .htmlAltitude((item) => item.kind === "route" ? Math.max(.018, travelModeStyle(item.route.mode).altitude * .58) : (mode === "close" ? .045 : .022))
    .htmlElement((item) => createMarker(item, mode));
}

function initGlobe() {
  if (typeof Globe !== "function") {
    elements.fallback.classList.remove("hidden");
    return;
  }
  try {
    state.globe = new Globe(elements.globe, { rendererConfig: { antialias: true, alpha: true } })
      .width(window.innerWidth).height(window.innerHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .globeImageUrl("https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg")
      .bumpImageUrl("https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png")
      .globeCurvatureResolution(2)
      .showAtmosphere(true).atmosphereColor("#76b6ff").atmosphereAltitude(.18)
      .pointLat("lat").pointLng("lng").pointColor(() => "#9de7cf").pointAltitude(.012).pointRadius(.35)
      .pointLabel((item) => `${item.cityName} · ${item.entries.length} 件收藏`)
      .arcStartLat("startLat").arcStartLng("startLng").arcEndLat("endLat").arcEndLng("endLng")
      .arcColor((item) => travelModeStyle(item.mode).color)
      .arcAltitude((item) => travelModeStyle(item.mode).altitude)
      .arcStroke((item) => travelModeStyle(item.mode).stroke)
      .arcDashLength((item) => travelModeStyle(item.mode).dashLength)
      .arcDashGap((item) => travelModeStyle(item.mode).dashGap)
      .arcDashAnimateTime((item) => travelModeStyle(item.mode).speed)
      .arcLabel((item) => `${travelModeEmoji(item.mode)} ${item.from.cityName} → ${item.to.cityName}`)
      .onPointClick((item) => openCity(item))
      .onZoom(() => updateGlobeLayers());
    state.globe.controls().autoRotate = true;
    state.globe.controls().autoRotateSpeed = .28;
    state.globe.controls().enableDamping = true;
    state.globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 2 : 2.5));
    state.globe.pointOfView({ lat: 24, lng: 108, altitude: 2.25 }, 0);
    updateGlobeLayers(true);
    window.addEventListener("resize", () => state.globe.width(window.innerWidth).height(window.innerHeight));
  } catch (error) {
    console.error(error);
    elements.fallback.classList.remove("hidden");
  }
}

function begin() {
  state.started = true;
  elements.welcome.classList.add("leaving");
  elements.homeCosmos.classList.add("leaving");
  setTimeout(() => elements.welcome.classList.add("hidden"), 360);
  setTimeout(() => elements.homeCosmos.classList.add("hidden"), 700);
  elements.statusBar.classList.remove("hidden");
  elements.addBtn.classList.remove("hidden");
  setTimeout(() => {
    if (localStorage.getItem(GUIDE_HIDE_KEY) === "1") openLocationDialog();
    else openGuide(true);
  }, 380);
}

function planetPosition(elementsForPlanet, centuries) {
  const value = (base, rate) => base + rate * centuries;
  const a = value(elementsForPlanet.a[0], elementsForPlanet.a[1]);
  const e = value(elementsForPlanet.e[0], elementsForPlanet.e[1]);
  const inclination = value(elementsForPlanet.i[0], elementsForPlanet.i[1]) * Math.PI / 180;
  const meanLongitude = value(elementsForPlanet.l[0], elementsForPlanet.l[1]);
  const perihelion = value(elementsForPlanet.p[0], elementsForPlanet.p[1]);
  const ascendingNode = value(elementsForPlanet.n[0], elementsForPlanet.n[1]);
  const meanAnomaly = ((meanLongitude - perihelion) % 360 + 360) % 360 * Math.PI / 180;
  let eccentricAnomaly = meanAnomaly;
  for (let step = 0; step < 8; step += 1) {
    eccentricAnomaly -= (eccentricAnomaly - e * Math.sin(eccentricAnomaly) - meanAnomaly) / (1 - e * Math.cos(eccentricAnomaly));
  }
  const xPrime = a * (Math.cos(eccentricAnomaly) - e);
  const yPrime = a * Math.sqrt(1 - e * e) * Math.sin(eccentricAnomaly);
  const omega = (perihelion - ascendingNode) * Math.PI / 180;
  const node = ascendingNode * Math.PI / 180;
  const cosOmega = Math.cos(omega);
  const sinOmega = Math.sin(omega);
  const cosNode = Math.cos(node);
  const sinNode = Math.sin(node);
  const cosInclination = Math.cos(inclination);
  const sinInclination = Math.sin(inclination);
  return {
    x: (cosOmega * cosNode - sinOmega * sinNode * cosInclination) * xPrime + (-sinOmega * cosNode - cosOmega * sinNode * cosInclination) * yPrime,
    y: (cosOmega * sinNode + sinOmega * cosNode * cosInclination) * xPrime + (-sinOmega * sinNode + cosOmega * cosNode * cosInclination) * yPrime,
    z: sinOmega * sinInclination * xPrime + cosOmega * sinInclination * yPrime
  };
}

function updateMarsPosition() {
  const julianDate = Date.now() / 86400000 + 2440587.5;
  const centuries = (julianDate - 2451545) / 36525;
  const earth = planetPosition({
    a: [1.00000018, -0.00000003], e: [0.01673163, -0.00003661], i: [-0.00054346, -0.01337178],
    l: [100.46691572, 35999.37306329], p: [102.93005885, 0.31795260], n: [-5.11260389, -0.24123856]
  }, centuries);
  const mars = planetPosition({
    a: [1.52371243, 0.00000097], e: [0.09336511, 0.00009149], i: [1.85181869, -0.00724757],
    l: [-4.56813164, 19140.29934243], p: [-23.91744784, 0.45223625], n: [49.71320984, -0.26852431]
  }, centuries);
  const longitude = ((Math.atan2(mars.y - earth.y, mars.x - earth.x) * 180 / Math.PI) % 360 + 360) % 360;
  const screenAngle = (longitude - 90) * Math.PI / 180;
  const left = 50 + Math.cos(screenAngle) * 35;
  const top = 38 + Math.sin(screenAngle) * 21;
  elements.marsMarker.style.left = `${left.toFixed(2)}%`;
  elements.marsMarker.style.top = `${top.toFixed(2)}%`;
  elements.marsMarker.classList.toggle("label-left", left > 50);
  elements.marsPositionText.textContent = `今日火星轨道方位约 ${Math.round(longitude)}° · 示意`;
}

function openGuide(fromStart = false) {
  state.guideFromStart = fromStart;
  elements.guideNoReminderInput.checked = localStorage.getItem(GUIDE_HIDE_KEY) === "1";
  if (!elements.onboardingDialog.open) elements.onboardingDialog.showModal();
}

function finishGuide() {
  if (elements.guideNoReminderInput.checked) localStorage.setItem(GUIDE_HIDE_KEY, "1");
  else localStorage.removeItem(GUIDE_HIDE_KEY);
  elements.onboardingDialog.close();
  if (state.guideFromStart) {
    state.guideFromStart = false;
    openLocationDialog();
  }
}

function focusLocation(location) {
  state.selectedLocation = location;
  elements.currentPlace.textContent = `${location.country} · ${location.city}`;
  if (state.globe) {
    state.globe.controls().autoRotate = false;
    state.globe.pointOfView({ lat: location.lat, lng: location.lng, altitude: .62 }, 1700);
    setTimeout(() => updateGlobeLayers(true), 1750);
  }
}

function resetEntryForm(entry = null) {
  elements.entryForm.reset();
  state.imageData = entry?.photo || "";
  elements.entryId.value = entry?.id || "";
  elements.entryFormTitle.textContent = entry ? "编辑这件收藏" : "添加一件收藏";
  const location = entry ? { country: entry.countryName, code: entry.countryCode, city: entry.cityName, lat: entry.lat, lng: entry.lng } : state.selectedLocation;
  elements.countryInput.value = location?.country || "";
  elements.countryCodeInput.value = location?.code || "";
  elements.cityInput.value = location?.city || "";
  elements.latInput.value = location?.lat ?? "";
  elements.lngInput.value = location?.lng ?? "";
  elements.dateInput.value = entry?.date || localDate();
  elements.placeInput.value = entry?.placeName || "";
  elements.subjectInput.value = entry?.subjectName || "";
  elements.travelModeInput.value = normalizeTravelMode(entry?.travelMode);
  elements.studyMemoryInput.checked = entry?.studyMemory === true || (!entry && state.pendingStudyMemory);
  state.pendingStudyMemory = false;
  elements.typeInput.value = entry?.type || "✨ 其他";
  elements.moodInput.value = entry?.mood || "🥰 很幸福";
  elements.textInput.value = entry?.text || "";
  elements.photoPreview.src = state.imageData;
  elements.photoPreview.classList.toggle("hidden", !state.imageData);
  elements.photoField.classList.toggle("has-photo", Boolean(state.imageData));
  elements.photoPickerText.textContent = state.imageData ? "更换照片" : "选择一张照片";
  fillCityList(elements.countryInput.value);
}

function openEntry(entry = null) {
  if (!entry && !state.selectedLocation) { state.pendingAdd = true; openLocationDialog(); return; }
  resetEntryForm(entry);
  elements.entryDialog.showModal();
}

function openDetail(id) {
  const entry = state.entries.find((item) => item.id === id);
  if (!entry) return;
  state.activeEntryId = id;
  elements.detailPhoto.src = entry.photo || placeholderImage(entry.type);
  elements.detailType.textContent = entry.type;
  elements.detailMood.textContent = entry.mood;
  elements.detailLocation.textContent = `${entry.countryName} · ${entry.cityName}`;
  elements.detailSubject.textContent = entry.subjectName || "";
  elements.detailSubject.classList.toggle("hidden", !entry.subjectName);
  elements.detailMeta.textContent = `${entry.countryCode} · ${formatDate(entry.date)} · ${travelModeEmoji(entry.travelMode)} ${travelModeName(entry.travelMode)}`;
  elements.detailPlace.textContent = entry.placeName ? `📍 ${entry.placeName}` : "";
  elements.detailText.textContent = entry.text || "这个瞬间没有留下文字，但照片记得。";
  elements.detailDialog.showModal();
}

function openCity(group) {
  elements.cityDialogTitle.textContent = `${group.countryName} · ${group.cityName}`;
  elements.cityEntries.innerHTML = "";
  group.entries.forEach((entry) => {
    const button = document.createElement("button");
    button.className = "city-entry";
    const image = document.createElement("img");
    image.src = entry.photo || placeholderImage(entry.type);
    image.alt = entry.placeName || `${entry.cityName}的收藏`;
    const label = document.createElement("span");
    label.textContent = `${typeEmoji(entry.type)} ${entry.placeName || formatDate(entry.date)}`;
    button.append(image, label);
    button.addEventListener("click", () => { elements.cityDialog.close(); openDetail(entry.id); });
    elements.cityEntries.appendChild(button);
  });
  elements.cityDialog.showModal();
}

function renderRouteDialog() {
  const stops = routeStops();
  const routes = travelRoutes();
  elements.closeLoopInput.checked = state.routeSettings.closeLoop;
  elements.returnModeInput.value = state.routeSettings.returnMode;
  elements.returnModeInput.disabled = !state.routeSettings.closeLoop || stops.length < 3;
  elements.routeSummary.innerHTML = "";
  [
    `${stops.length} 个地点`,
    `${routes.filter((route) => route.mode === "plane").length} 段飞机`,
    `${routes.filter((route) => route.mode === "train").length} 段高铁`,
    `${routes.filter((route) => route.mode === "bus").length} 段大巴`,
    `${routes.filter((route) => route.mode === "cruise").length} 段邮轮`
  ].forEach((text) => {
    const chip = document.createElement("span");
    chip.textContent = text;
    elements.routeSummary.appendChild(chip);
  });
  elements.routeList.innerHTML = "";
  if (!routes.length) {
    const empty = document.createElement("p");
    empty.className = "route-empty";
    empty.textContent = stops.length ? "再添加一个不同地点，就会出现第一段旅行路线。" : "添加不同城市的收藏后，这里会自动生成足迹路线。";
    elements.routeList.appendChild(empty);
    return;
  }
  routes.forEach((route) => {
    const leg = document.createElement("div");
    leg.className = "route-leg";
    const icon = document.createElement("span");
    icon.textContent = travelModeEmoji(route.mode);
    const content = document.createElement("div");
    const title = document.createElement("b");
    title.textContent = `${route.from.cityName} → ${route.to.cityName}`;
    const meta = document.createElement("small");
    meta.textContent = `${travelModeName(route.mode)}${route.closing ? " · 返回出发点" : ` · ${formatDate(route.to.date)}`}`;
    content.append(title, meta);
    const modeSelect = document.createElement("select");
    modeSelect.setAttribute("aria-label", `${route.from.cityName}到${route.to.cityName}的交通方式`);
    Object.entries(TRAVEL_MODES).forEach(([value, mode]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = `${mode.emoji} ${mode.name}`;
      modeSelect.appendChild(option);
    });
    modeSelect.value = route.mode;
    modeSelect.addEventListener("change", async () => {
      const mode = normalizeTravelMode(modeSelect.value);
      let saved = true;
      modeSelect.disabled = true;
      if (route.closing) {
        state.routeSettings.returnMode = mode;
        saveRouteSettings();
      } else {
        const previousMode = route.to.travelMode;
        const previousUpdatedAt = route.to.updatedAt;
        route.to.travelMode = mode;
        route.to.updatedAt = Date.now();
        try {
          await saveEntry(route.to);
          notifyCloudSync("entry", { entry: route.to });
        } catch (error) {
          console.error(error);
          route.to.travelMode = previousMode;
          route.to.updatedAt = previousUpdatedAt;
          saved = false;
          toast("交通方式保存失败，请重试");
        }
      }
      renderRouteDialog();
      updateGlobeLayers(true);
      if (saved) toast(`已改为${travelModeEmoji(mode)}${travelModeName(mode)}`);
    });
    leg.append(icon, content, modeSelect);
    elements.routeList.appendChild(leg);
  });
}

function openRouteDialog() {
  renderRouteDialog();
  if (!elements.routeDialog.open) elements.routeDialog.showModal();
}

function normalizeStudyDiary(value) {
  const source = value && typeof value === "object" ? value : {};
  const completedQuestIds = Array.isArray(source.completedQuestIds)
    ? source.completedQuestIds.filter((id) => STUDY_QUESTS.some((quest) => quest.id === id))
    : [];
  const notes = Array.isArray(source.notes) ? source.notes.map((note) => ({
    id: String(note.id || createId()),
    date: /^\d{4}-\d{2}-\d{2}$/.test(note.date) ? note.date : localDate(),
    mood: String(note.mood || "💭 难以形容"),
    title: String(note.title || "留学小故事").slice(0, 60),
    text: String(note.text || "").slice(0, 500),
    createdAt: Number.isFinite(Number(note.createdAt)) ? Number(note.createdAt) : Date.now()
  })).filter((note) => note.text) : [];
  const checkIns = Array.isArray(source.checkIns) ? source.checkIns.map((checkIn) => ({
    id: String(checkIn.id || createId()),
    date: /^\d{4}-\d{2}-\d{2}$/.test(checkIn.date) ? checkIn.date : localDate(),
    type: checkIn.type === "food" ? "food" : "scenery",
    note: String(checkIn.note || "").slice(0, 80),
    createdAt: Number.isFinite(Number(checkIn.createdAt)) ? Number(checkIn.createdAt) : Date.now()
  })).filter((checkIn, index, items) =>
    items.findIndex((item) => item.date === checkIn.date && item.type === checkIn.type) === index
  ) : [];
  return {
    school: String(source.school || "").slice(0, 60),
    city: String(source.city || "").slice(0, 40),
    startDate: /^\d{4}-\d{2}-\d{2}$/.test(source.startDate) ? source.startDate : "",
    completedQuestIds: [...new Set(completedQuestIds)],
    notes,
    checkIns
  };
}

function loadStudyDiary() {
  try {
    state.studyDiary = normalizeStudyDiary(JSON.parse(localStorage.getItem(STUDY_DIARY_KEY) || "{}"));
  } catch {
    state.studyDiary = normalizeStudyDiary({});
  }
}

function saveStudyDiary() {
  localStorage.setItem(STUDY_DIARY_KEY, JSON.stringify(state.studyDiary));
  notifyCloudSync("profile");
}

function syncStudyProfile() {
  state.studyDiary.school = elements.studySchoolInput.value.trim();
  state.studyDiary.city = elements.studyCityInput.value.trim();
  state.studyDiary.startDate = elements.studyStartInput.value;
  saveStudyDiary();
}

function studyXp() {
  const completedXp = STUDY_QUESTS
    .filter((quest) => state.studyDiary.completedQuestIds.includes(quest.id))
    .reduce((total, quest) => total + quest.xp, 0);
  const noteXp = state.studyDiary.notes.length * 80;
  const photoXp = state.entries.filter((entry) => entry.studyMemory).length * 40;
  const checkInXp = state.studyDiary.checkIns.length;
  return completedXp + noteXp + photoXp + checkInXp;
}

function checkInDayCount() {
  return new Set(state.studyDiary.checkIns.map((checkIn) => checkIn.date)).size;
}

function dateDaysAgo(offset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function checkInStreak() {
  const days = new Set(state.studyDiary.checkIns.map((checkIn) => checkIn.date));
  let offset = days.has(dateDaysAgo(0)) ? 0 : 1;
  let streak = 0;
  while (days.has(dateDaysAgo(offset))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

function addDailyCheckIn(type) {
  const date = localDate();
  if (state.studyDiary.checkIns.some((checkIn) => checkIn.date === date && checkIn.type === type)) {
    toast(type === "food" ? "今天的美食已经打卡了" : "今天的风景已经打卡了");
    return;
  }
  const beforeDays = checkInDayCount();
  state.studyDiary.checkIns.push({
    id: createId(),
    date,
    type,
    note: elements.dailyCheckinNote.value.trim(),
    createdAt: Date.now()
  });
  elements.dailyCheckinNote.value = "";
  saveStudyDiary();
  renderStudyDiary();
  const afterDays = checkInDayCount();
  const badge = CHECKIN_BADGES.find((item) => beforeDays < item.days && afterDays >= item.days);
  toast(badge ? `解锁“${badge.name}”徽章！` : `${type === "food" ? "美食" : "风景"}打卡成功，经验值＋1`);
}

function renderStudyDiary() {
  const xp = studyXp();
  const level = Math.floor(xp / 300) + 1;
  const currentLevelXp = xp % 300;
  const chapters = ["初到异乡", "开始适应", "城市探索者", "文化解锁者", "独立生活家", "世界公民"];
  elements.studyLevel.textContent = `留学生 Lv.${level}`;
  elements.studyChapter.textContent = `第${Math.min(level, chapters.length)}章 · ${chapters[Math.min(level - 1, chapters.length - 1)]}`;
  elements.studyProgressBar.style.width = `${currentLevelXp / 3}%`;
  elements.studyXpText.textContent = `总经验 ${xp} XP · 距离下一等级还差 ${300 - currentLevelXp} XP`;

  const dayCount = checkInDayCount();
  const streak = checkInStreak();
  elements.studyDaysText.textContent = `已打卡 ${dayCount} 天`;
  elements.studyBadgeGrid.innerHTML = "";
  CHECKIN_BADGES.forEach((badge) => {
    const unlocked = dayCount >= badge.days;
    const card = document.createElement("article");
    card.className = `study-badge${unlocked ? " unlocked" : " locked"}`;
    card.style.setProperty("--badge-start", badge.colors[0]);
    card.style.setProperty("--badge-end", badge.colors[1]);
    const medal = document.createElement("div");
    medal.className = "study-badge-medal";
    const icon = document.createElement("span");
    icon.textContent = unlocked ? badge.emoji : "🔒";
    const days = document.createElement("b");
    days.textContent = `${badge.days}`;
    medal.append(icon, days);
    const name = document.createElement("strong");
    name.textContent = badge.name;
    const progress = document.createElement("small");
    progress.textContent = unlocked ? "已解锁" : `还差 ${badge.days - dayCount} 天`;
    card.append(medal, name, progress);
    elements.studyBadgeGrid.appendChild(card);
  });

  const todayCheckIns = state.studyDiary.checkIns.filter((checkIn) => checkIn.date === localDate());
  const sceneryDone = todayCheckIns.some((checkIn) => checkIn.type === "scenery");
  const foodDone = todayCheckIns.some((checkIn) => checkIn.type === "food");
  elements.sceneryCheckinBtn.disabled = sceneryDone;
  elements.foodCheckinBtn.disabled = foodDone;
  elements.sceneryCheckinBtn.classList.toggle("done", sceneryDone);
  elements.foodCheckinBtn.classList.toggle("done", foodDone);
  elements.sceneryCheckinBtn.querySelector("small").textContent = sceneryDone ? "今天已完成" : "打卡 ＋1 XP";
  elements.foodCheckinBtn.querySelector("small").textContent = foodDone ? "今天已完成" : "打卡 ＋1 XP";
  elements.dailyCheckinStatus.textContent = `连续打卡 ${streak} 天 · 今天完成 ${todayCheckIns.length}/2`;
  elements.dailyCheckinList.innerHTML = "";
  [...state.studyDiary.checkIns]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .slice(0, 8)
    .forEach((checkIn) => {
      const item = document.createElement("div");
      item.className = "daily-checkin-item";
      const icon = document.createElement("span");
      icon.textContent = checkIn.type === "food" ? "🍜" : "🌄";
      const text = document.createElement("span");
      const title = document.createElement("b");
      title.textContent = `${checkIn.type === "food" ? "美食" : "风景"}打卡`;
      const meta = document.createElement("small");
      meta.textContent = `${formatDate(checkIn.date)}${checkIn.note ? ` · ${checkIn.note}` : ""}`;
      text.append(title, meta);
      item.append(icon, text);
      elements.dailyCheckinList.appendChild(item);
    });

  elements.studyQuestCount.textContent = `${state.studyDiary.completedQuestIds.length} / ${STUDY_QUESTS.length}`;
  elements.studyQuestList.innerHTML = "";
  STUDY_QUESTS.forEach((quest) => {
    const label = document.createElement("label");
    label.className = `study-quest${state.studyDiary.completedQuestIds.includes(quest.id) ? " completed" : ""}`;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.studyDiary.completedQuestIds.includes(quest.id);
    input.setAttribute("aria-label", quest.title);
    const icon = document.createElement("span");
    icon.textContent = quest.emoji;
    const content = document.createElement("span");
    const title = document.createElement("b");
    title.textContent = quest.title;
    const detail = document.createElement("small");
    detail.textContent = quest.detail;
    content.append(title, detail);
    const reward = document.createElement("em");
    reward.textContent = `＋${quest.xp} XP`;
    input.addEventListener("change", () => {
      if (input.checked) state.studyDiary.completedQuestIds.push(quest.id);
      else state.studyDiary.completedQuestIds = state.studyDiary.completedQuestIds.filter((id) => id !== quest.id);
      state.studyDiary.completedQuestIds = [...new Set(state.studyDiary.completedQuestIds)];
      saveStudyDiary();
      renderStudyDiary();
      toast(input.checked ? `支线完成，获得 ${quest.xp} XP` : "支线任务已恢复");
    });
    label.append(input, icon, content, reward);
    elements.studyQuestList.appendChild(label);
  });

  const photoEntries = state.entries
    .filter((entry) => entry.studyMemory)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  elements.studyPhotoList.innerHTML = "";
  if (!photoEntries.length) {
    const empty = document.createElement("p");
    empty.className = "study-empty";
    empty.textContent = "还没有照片章节。添加收藏时勾选“收录到留学日记”即可出现。";
    elements.studyPhotoList.appendChild(empty);
  } else {
    photoEntries.slice(0, 8).forEach((entry) => {
      const button = document.createElement("button");
      button.className = "study-photo-card";
      const image = document.createElement("img");
      image.src = entry.photo || placeholderImage(entry.type);
      image.alt = entry.subjectName || `${entry.cityName}的留学照片`;
      const text = document.createElement("span");
      const title = document.createElement("b");
      title.textContent = `${moodEmoji(entry.mood)} ${entry.subjectName || entry.placeName || entry.cityName}`;
      const meta = document.createElement("small");
      meta.textContent = `${entry.cityName} · ${formatDate(entry.date)}`;
      text.append(title, meta);
      button.append(image, text);
      button.addEventListener("click", () => { elements.studyDialog.close(); openDetail(entry.id); });
      elements.studyPhotoList.appendChild(button);
    });
  }

  elements.studyNoteList.innerHTML = "";
  const notes = [...state.studyDiary.notes].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  if (!notes.length) {
    const empty = document.createElement("p");
    empty.className = "study-empty";
    empty.textContent = "写下第一篇小故事，就会开启你的留学主线。";
    elements.studyNoteList.appendChild(empty);
  } else {
    notes.forEach((note) => {
      const article = document.createElement("article");
      article.className = "study-note-card";
      const heading = document.createElement("div");
      const title = document.createElement("b");
      title.textContent = `${moodEmoji(note.mood)} ${note.title}`;
      const date = document.createElement("small");
      date.textContent = formatDate(note.date);
      heading.append(title, date);
      const story = document.createElement("p");
      story.textContent = note.text;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.setAttribute("aria-label", `删除${note.title}`);
      remove.addEventListener("click", () => {
        if (!confirm(`确定删除“${note.title}”吗？`)) return;
        state.studyDiary.notes = state.studyDiary.notes.filter((item) => item.id !== note.id);
        saveStudyDiary();
        renderStudyDiary();
        toast("这篇留学故事已删除");
      });
      article.append(heading, story, remove);
      elements.studyNoteList.appendChild(article);
    });
  }
}

function openStudyDiary() {
  elements.studySchoolInput.value = state.studyDiary.school;
  elements.studyCityInput.value = state.studyDiary.city;
  elements.studyStartInput.value = state.studyDiary.startDate;
  elements.studyNoteDate.value = localDate();
  renderStudyDiary();
  if (!elements.studyDialog.open) elements.studyDialog.showModal();
}

function loadJournalDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(JOURNAL_DRAFT_KEY) || "{}");
    state.journalDraft = {
      title: String(saved.title || ""),
      startDate: /^\d{4}-\d{2}-\d{2}$/.test(saved.startDate) ? saved.startDate : "",
      endDate: /^\d{4}-\d{2}-\d{2}$/.test(saved.endDate) ? saved.endDate : "",
      fun: String(saved.fun || "")
    };
  } catch {
    state.journalDraft = { title: "", startDate: "", endDate: "", fun: "" };
  }
}

function saveJournalDraft() {
  state.journalDraft = {
    title: elements.journalTitleInput.value.trim(),
    startDate: elements.journalStartInput.value,
    endDate: elements.journalEndInput.value,
    fun: elements.journalFunInput.value.trim()
  };
  localStorage.setItem(JOURNAL_DRAFT_KEY, JSON.stringify(state.journalDraft));
  notifyCloudSync("profile");
}

function journalEntries() {
  const startDate = elements.journalStartInput.value;
  const endDate = elements.journalEndInput.value;
  return [...state.entries]
    .filter((entry) => (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate))
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
}

function journalShareText(entries = journalEntries()) {
  const title = elements.journalTitleInput.value.trim() || "我的旅行日志";
  const lines = [`🧳 ${title}`];
  if (elements.journalStartInput.value || elements.journalEndInput.value) {
    lines.push(`📅 ${elements.journalStartInput.value || "出发"} 至 ${elements.journalEndInput.value || "现在"}`);
  }
  const fun = elements.journalFunInput.value.trim();
  if (fun) lines.push(`\n✨ 最好玩的事情\n${fun}`);
  entries.forEach((entry) => {
    lines.push(`\n${entry.mood} ${entry.countryName} · ${entry.cityName}`);
    lines.push(`${formatDate(entry.date)}${entry.placeName ? ` · ${entry.placeName}` : ""}`);
    if (entry.text) lines.push(entry.text);
  });
  lines.push("\n来自「地球收藏夹」");
  return lines.join("\n");
}

function renderJournal() {
  const entries = journalEntries();
  const cityCount = new Set(entries.map((entry) => `${entry.countryCode}|${entry.cityName}`)).size;
  elements.journalSummary.innerHTML = "";
  [`${entries.length} 张照片`, `${cityCount} 个地点`, `${new Set(entries.map((entry) => moodEmoji(entry.mood))).size} 种心情`].forEach((text) => {
    const chip = document.createElement("span");
    chip.textContent = text;
    elements.journalSummary.appendChild(chip);
  });
  elements.journalPreview.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "journal-empty";
    empty.textContent = "这个日期范围内还没有照片，换一段日期试试看。";
    elements.journalPreview.appendChild(empty);
    return;
  }
  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "journal-card";
    const image = document.createElement("img");
    image.src = entry.photo || placeholderImage(entry.type);
    image.alt = entry.placeName || `${entry.cityName}的旅行照片`;
    const content = document.createElement("div");
    content.className = "journal-card-content";
    const title = document.createElement("b");
    title.textContent = `${entry.mood} ${entry.cityName}${entry.placeName ? ` · ${entry.placeName}` : ""}`;
    const meta = document.createElement("small");
    meta.textContent = `${entry.countryName} · ${formatDate(entry.date)}`;
    const story = document.createElement("p");
    story.textContent = entry.text || "这张照片记录了旅途中的一个瞬间。";
    content.append(title, meta, story);
    card.append(image, content);
    elements.journalPreview.appendChild(card);
  });
}

function openJournal() {
  const sorted = [...state.entries].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  if (!state.journalDraft.startDate && sorted.length) state.journalDraft.startDate = sorted[0].date;
  if (!state.journalDraft.endDate && sorted.length) state.journalDraft.endDate = sorted[sorted.length - 1].date;
  if (!state.journalDraft.title && sorted.length) {
    const first = sorted[0].cityName;
    const last = sorted[sorted.length - 1].cityName;
    state.journalDraft.title = first === last ? `${first}旅行日志` : `${first}到${last}的旅行日志`;
  }
  elements.journalTitleInput.value = state.journalDraft.title;
  elements.journalStartInput.value = state.journalDraft.startDate;
  elements.journalEndInput.value = state.journalDraft.endDate;
  elements.journalFunInput.value = state.journalDraft.fun;
  renderJournal();
  if (!elements.journalDialog.open) elements.journalDialog.showModal();
}

async function copyJournalText() {
  const text = journalShareText();
  try {
    await navigator.clipboard.writeText(text);
    toast("分享文字已复制");
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
    toast("分享文字已复制");
  }
}

async function photoFilesForShare(entries) {
  const photos = entries.filter((entry) => entry.photo.startsWith("data:image/")).slice(0, 6);
  return Promise.all(photos.map(async (entry, index) => {
    const blob = await (await fetch(entry.photo)).blob();
    const extension = blob.type.includes("png") ? "png" : "jpg";
    return new File([blob], `旅行照片-${index + 1}.${extension}`, { type: blob.type || "image/jpeg" });
  }));
}

async function shareJournal() {
  const entries = journalEntries();
  if (!entries.length) { toast("这个日期范围内还没有可以分享的照片"); return; }
  const title = elements.journalTitleInput.value.trim() || "我的旅行日志";
  const text = journalShareText(entries);
  try {
    if (typeof navigator.share === "function") {
      const files = await photoFilesForShare(entries);
      const payload = { title, text };
      if (files.length && navigator.canShare?.({ files })) payload.files = files;
      await navigator.share(payload);
      toast("旅行日志已打开分享");
      return;
    }
    await copyJournalText();
    toast("当前浏览器不支持直接分享，已复制分享文字");
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
      await copyJournalText();
      toast("照片分享暂时不可用，已复制分享文字");
    }
  }
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function renderCalendar() {
  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  const key = monthKey(state.calendarDate);
  const monthEntries = state.entries.filter((entry) => entry.date.startsWith(key));
  elements.calendarTitle.textContent = `${year}年 ${month + 1}月`;
  elements.calendarGrid.innerHTML = "";

  const moodCounts = new Map();
  monthEntries.forEach((entry) => moodCounts.set(entry.mood, (moodCounts.get(entry.mood) || 0) + 1));
  elements.moodSummary.innerHTML = "";
  if (!moodCounts.size) {
    const empty = document.createElement("span");
    empty.className = "mood-empty";
    empty.textContent = "这个月还没有收藏和心情";
    elements.moodSummary.appendChild(empty);
  } else {
    [...moodCounts.entries()].sort((a, b) => b[1] - a[1]).forEach(([mood, count]) => {
      const chip = document.createElement("span");
      chip.className = "mood-chip";
      chip.textContent = `${mood} · ${count}`;
      elements.moodSummary.appendChild(chip);
    });
  }

  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const dayCount = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDayOffset; i += 1) {
    const blank = document.createElement("div");
    blank.className = "calendar-blank";
    elements.calendarGrid.appendChild(blank);
  }
  let firstMemoryDate = "";
  for (let day = 1; day <= dayCount; day += 1) {
    const date = `${key}-${String(day).padStart(2, "0")}`;
    const entries = monthEntries.filter((entry) => entry.date === date);
    if (!firstMemoryDate && entries.length) firstMemoryDate = date;
    const button = document.createElement("button");
    button.className = `calendar-day${entries.length ? " has-memory" : ""}`;
    button.type = "button";
    const number = document.createElement("b");
    number.textContent = day;
    const moods = document.createElement("small");
    moods.textContent = entries.slice(0, 3).map((entry) => moodEmoji(entry.mood)).join("");
    button.append(number, moods);
    button.addEventListener("click", () => {
      document.querySelectorAll(".calendar-day").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      renderCalendarDay(date);
    });
    elements.calendarGrid.appendChild(button);
  }
  renderCalendarDay(firstMemoryDate || `${key}-01`);
}

function renderCalendarDay(date) {
  const entries = state.entries.filter((entry) => entry.date === date);
  elements.calendarDayList.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "calendar-empty-day";
    empty.textContent = `${formatDate(date)}没有收藏`;
    elements.calendarDayList.appendChild(empty);
    return;
  }
  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.className = "day-memory";
    const image = document.createElement("img");
    image.src = entry.photo || placeholderImage(entry.type);
    image.alt = entry.subjectName || entry.placeName || `${entry.cityName}的收藏`;
    const text = document.createElement("span");
    const title = document.createElement("b");
    title.textContent = `${moodEmoji(entry.mood)} ${entry.subjectName || entry.placeName || entry.cityName}`;
    const meta = document.createElement("small");
    meta.textContent = `${entry.countryName} · ${entry.cityName} · ${entry.type}`;
    text.append(title, meta);
    button.append(image, text);
    button.addEventListener("click", () => { elements.calendarDialog.close(); openDetail(entry.id); });
    elements.calendarDayList.appendChild(button);
  });
}

function openCalendar() {
  const latest = [...state.entries].sort((a, b) => b.date.localeCompare(a.date))[0];
  state.calendarDate = latest ? new Date(`${latest.date}T00:00:00`) : new Date();
  renderCalendar();
  elements.calendarDialog.showModal();
}

function compressImage(file, maxSize = 1400, quality = .8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("无法读取照片"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("无法处理照片"));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderStatus() {
  elements.count.textContent = state.entries.length;
  updateGlobeLayers(true);
}

elements.startBtn.addEventListener("click", begin);
elements.chooseCityBtn.addEventListener("click", openLocationDialog);
elements.addBtn.addEventListener("click", () => openEntry());
elements.routeBtn.addEventListener("click", openRouteDialog);
elements.routeShortcutBtn.addEventListener("click", openRouteDialog);
elements.journalBtn.addEventListener("click", openJournal);
elements.studyBtn.addEventListener("click", openStudyDiary);
elements.backupBtn.addEventListener("click", () => elements.backupDialog.showModal());
elements.helpBtn.addEventListener("click", () => openGuide(false));
elements.guideDoneBtn.addEventListener("click", finishGuide);
elements.guideCloseBtn.addEventListener("click", finishGuide);
elements.recenterBtn.addEventListener("click", () => {
  if (!state.globe) return;
  state.globe.pointOfView({ lat: 20, lng: 100, altitude: 2.25 }, 1200);
  state.globe.controls().autoRotate = true;
});

elements.countrySearch.addEventListener("input", () => { state.mapSelection = null; fillCityList(elements.countrySearch.value); elements.citySearch.value = ""; });
elements.citySearch.addEventListener("input", () => {
  const location = findCity(elements.countrySearch.value, elements.citySearch.value);
  if (location) {
    state.mapSelection = location;
    if (hasCoordinates(location)) {
      setMapLocation(location.lat, location.lng, 9);
      elements.mapStatus.textContent = `${location.country} · ${location.city}`;
    } else {
      elements.mapStatus.textContent = `${location.province}${location.parent ? ` · ${location.parent}` : ""} · ${location.city}，点击“带我去这里”后定位`;
    }
  }
});
elements.addressSearchBtn.addEventListener("click", searchAddress);
elements.addressSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); searchAddress(); }
});
elements.locateBtn.addEventListener("click", () => {
  if (!navigator.geolocation) { toast("当前浏览器不支持自动定位"); return; }
  elements.mapStatus.textContent = "正在获取当前位置…";
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      setMapSelection({ country: "未标注", code: "ZZ", city: "当前位置", lat: latitude, lng: longitude }, "已定位，正在识别城市…");
      await reverseGeocode(latitude, longitude);
    },
    (error) => {
      const messages = { 1: "你没有允许定位，可以改用地址搜索", 2: "暂时无法取得位置", 3: "定位超时，请再试一次" };
      elements.mapStatus.textContent = messages[error.code] || "自动定位失败";
      toast(elements.mapStatus.textContent);
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
  );
});
elements.locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const builtInLocation = findCity(elements.countrySearch.value, elements.citySearch.value);
  const mapLocationMatches = state.mapSelection &&
    state.mapSelection.country === elements.countrySearch.value.trim() &&
    state.mapSelection.city === elements.citySearch.value.trim();
  let location = builtInLocation || (mapLocationMatches ? state.mapSelection : null);
  if (!location) { toast("请从列表选择城市，或先在地图上选位置"); return; }
  if (!hasCoordinates(location)) {
    elements.mapStatus.textContent = `正在定位 ${location.city}…`;
    try {
      location = await locateListedCity(location);
      state.mapSelection = location;
      setMapLocation(location.lat, location.lng, 9);
    } catch (error) {
      elements.mapStatus.textContent = error.message;
      toast(error.message);
      return;
    }
  }
  focusLocation(location);
  elements.locationDialog.close();
  toast(`已到达 ${location.city}`);
  if (state.pendingAdd) {
    state.pendingAdd = false;
    setTimeout(() => openEntry(), 80);
  }
});

elements.calendarBtn.addEventListener("click", openCalendar);
elements.closeLoopInput.addEventListener("change", () => {
  state.routeSettings.closeLoop = elements.closeLoopInput.checked;
  saveRouteSettings();
  renderRouteDialog();
  updateGlobeLayers(true);
});
elements.returnModeInput.addEventListener("change", () => {
  state.routeSettings.returnMode = normalizeTravelMode(elements.returnModeInput.value);
  saveRouteSettings();
  renderRouteDialog();
  updateGlobeLayers(true);
});
elements.viewWholeRouteBtn.addEventListener("click", () => {
  elements.routeDialog.close();
  if (!state.globe) return;
  state.globe.controls().autoRotate = false;
  state.globe.pointOfView({ lat: 18, lng: 105, altitude: 2.25 }, 1300);
  updateGlobeLayers(true);
});
[
  elements.journalTitleInput,
  elements.journalStartInput,
  elements.journalEndInput,
  elements.journalFunInput
].forEach((input) => input.addEventListener("input", () => {
  saveJournalDraft();
  renderJournal();
}));
elements.copyJournalBtn.addEventListener("click", copyJournalText);
elements.shareJournalBtn.addEventListener("click", shareJournal);
[elements.studySchoolInput, elements.studyCityInput, elements.studyStartInput].forEach((input) => input.addEventListener("input", syncStudyProfile));
elements.sceneryCheckinBtn.addEventListener("click", () => addDailyCheckIn("scenery"));
elements.foodCheckinBtn.addEventListener("click", () => addDailyCheckIn("food"));
elements.studyNoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.studyDiary.notes.push({
    id: createId(),
    date: elements.studyNoteDate.value,
    mood: elements.studyNoteMood.value,
    title: elements.studyNoteTitle.value.trim(),
    text: elements.studyNoteText.value.trim(),
    createdAt: Date.now()
  });
  saveStudyDiary();
  elements.studyNoteTitle.value = "";
  elements.studyNoteText.value = "";
  renderStudyDiary();
  toast("支线故事已保存，获得 80 XP");
});
elements.studyPhotoBtn.addEventListener("click", () => {
  elements.studyDialog.close();
  state.pendingStudyMemory = true;
  openEntry();
});
elements.newDiaryBtn.addEventListener("click", () => {
  elements.calendarDialog.close();
  openEntry();
});
elements.prevMonthBtn.addEventListener("click", () => {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1);
  renderCalendar();
});
elements.nextMonthBtn.addEventListener("click", () => {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1);
  renderCalendar();
});

elements.countryInput.addEventListener("input", () => {
  const country = findCountry(elements.countryInput.value);
  fillCityList(elements.countryInput.value);
  if (country) elements.countryCodeInput.value = country.code;
});
elements.cityInput.addEventListener("input", () => {
  const location = findCity(elements.countryInput.value, elements.cityInput.value);
  if (hasCoordinates(location)) { elements.latInput.value = location.lat; elements.lngInput.value = location.lng; }
});
elements.photoPicker.addEventListener("click", () => elements.photoInput.click());
elements.photoPreview.addEventListener("click", () => elements.photoInput.click());
elements.photoInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    state.imageData = await compressImage(file);
    elements.photoPreview.src = state.imageData;
    elements.photoPreview.classList.remove("hidden");
    elements.photoField.classList.add("has-photo");
    elements.photoPickerText.textContent = "更换照片";
  } catch (error) { toast(error.message); }
});

elements.entryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.imageData) { toast("请先选择一张照片"); return; }
  const oldEntry = state.entries.find((item) => item.id === elements.entryId.value);
  const entry = {
    id: oldEntry?.id || createId(), countryName: elements.countryInput.value.trim(), countryCode: elements.countryCodeInput.value.trim().toUpperCase(), cityName: elements.cityInput.value.trim(),
    lat: Number(elements.latInput.value), lng: Number(elements.lngInput.value), placeName: elements.placeInput.value.trim(), subjectName: elements.subjectInput.value.trim(), date: elements.dateInput.value, photo: state.imageData,
    text: elements.textInput.value.trim(), mood: elements.moodInput.value, type: elements.typeInput.value, travelMode: normalizeTravelMode(elements.travelModeInput.value), studyMemory: elements.studyMemoryInput.checked, createdAt: oldEntry?.createdAt || Date.now(), updatedAt: Date.now()
  };
  try {
    await saveEntry(entry);
    const index = state.entries.findIndex((item) => item.id === entry.id);
    if (index >= 0) state.entries[index] = entry; else state.entries.push(entry);
    focusLocation({ country: entry.countryName, code: entry.countryCode, city: entry.cityName, lat: entry.lat, lng: entry.lng });
    renderStatus();
    elements.entryDialog.close();
    notifyCloudSync("entry", { entry });
    toast(oldEntry ? "收藏已更新" : "已收藏到地球");
  } catch (error) { console.error(error); toast("保存失败，请重试"); }
});

elements.editBtn.addEventListener("click", () => {
  const entry = state.entries.find((item) => item.id === state.activeEntryId);
  elements.detailDialog.close();
  if (entry) openEntry(entry);
});
elements.deleteBtn.addEventListener("click", async () => {
  const entry = state.entries.find((item) => item.id === state.activeEntryId);
  if (!entry || !confirm(`确定删除在“${entry.cityName}”的这件收藏吗？`)) return;
  try {
    await removeEntry(entry.id);
    state.entries = state.entries.filter((item) => item.id !== entry.id);
    elements.detailDialog.close();
    renderStatus();
    notifyCloudSync("delete", { id: entry.id, updatedAt: Date.now() });
    toast("收藏已删除");
  } catch (error) { console.error(error); toast("删除失败，请重试"); }
});

elements.exportBtn.addEventListener("click", () => {
  const backup = { version: 3, entries: state.entries, studyDiary: state.studyDiary };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `地球收藏夹备份-${localDate()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});
elements.importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const raw = JSON.parse(await file.text());
    const rawEntries = Array.isArray(raw) ? raw : raw?.entries;
    if (!Array.isArray(rawEntries) || !rawEntries.every(isValidImport)) throw new Error("备份文件格式不正确");
    const entries = rawEntries.map(normalizeEntry);
    await replaceEntries(entries);
    state.entries = entries;
    if (!Array.isArray(raw) && raw.studyDiary) {
      state.studyDiary = normalizeStudyDiary(raw.studyDiary);
      saveStudyDiary();
    }
    renderStatus();
    notifyCloudSync("full");
    toast(`成功导入 ${entries.length} 件收藏`);
  } catch (error) { toast(`导入失败：${error.message}`); }
  finally { elements.importInput.value = ""; }
});

document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => $(`#${button.dataset.close}`).close()));
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  if (dialog === elements.onboardingDialog) finishGuide();
  else dialog.close();
}));

function cloudSnapshot() {
  return {
    entries: state.entries.map((entry) => ({ ...entry })),
    routeSettings: { ...state.routeSettings },
    journalDraft: { ...state.journalDraft },
    studyDiary: JSON.parse(JSON.stringify(state.studyDiary))
  };
}

async function applyCloudSnapshot(snapshot = {}) {
  if (Array.isArray(snapshot.entries)) {
    const entries = snapshot.entries.map(normalizeEntry).filter(Boolean);
    await replaceEntries(entries);
    state.entries = entries;
  }
  if (snapshot.routeSettings) {
    state.routeSettings = {
      closeLoop: snapshot.routeSettings.closeLoop !== false,
      returnMode: normalizeTravelMode(snapshot.routeSettings.returnMode)
    };
    localStorage.setItem(ROUTE_SETTINGS_KEY, JSON.stringify(state.routeSettings));
  }
  if (snapshot.journalDraft) {
    state.journalDraft = {
      title: String(snapshot.journalDraft.title || ""),
      startDate: /^\d{4}-\d{2}-\d{2}$/.test(snapshot.journalDraft.startDate) ? snapshot.journalDraft.startDate : "",
      endDate: /^\d{4}-\d{2}-\d{2}$/.test(snapshot.journalDraft.endDate) ? snapshot.journalDraft.endDate : "",
      fun: String(snapshot.journalDraft.fun || "")
    };
    localStorage.setItem(JOURNAL_DRAFT_KEY, JSON.stringify(state.journalDraft));
  }
  if (snapshot.studyDiary) {
    state.studyDiary = normalizeStudyDiary(snapshot.studyDiary);
    localStorage.setItem(STUDY_DIARY_KEY, JSON.stringify(state.studyDiary));
  }
  renderStatus();
}

window.EarthCollectionApp = {
  ready: false,
  getSnapshot: cloudSnapshot,
  applySnapshot: applyCloudSnapshot,
  normalizeEntry
};

async function start() {
  updateMarsPosition();
  loadRouteSettings();
  loadJournalDraft();
  loadStudyDiary();
  fillCountryList();
  fillCityList("");
  fillQuickLocations();
  try {
    const rawEntries = await getAllEntries();
    state.entries = rawEntries.map(normalizeEntry).filter(Boolean);
  } catch (error) {
    console.error(error);
    toast("无法打开本地收藏，请换用 Chrome 或 Edge");
  }
  initGlobe();
  renderStatus();
  window.EarthCollectionApp.ready = true;
  window.dispatchEvent(new CustomEvent("earth-app-ready"));
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js?v=21").catch(console.error);
}

start();
