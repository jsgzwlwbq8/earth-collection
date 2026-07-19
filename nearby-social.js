(() => {
  const PRESENCE_COLLECTION = "nearby_presence";
  const MESSAGES_COLLECTION = "nearby_messages";
  const ENABLED_KEY = "earth-nearby-enabled";
  const NICKNAME_KEY = "earth-nearby-nickname";
  const BLOCKED_KEY = "earth-nearby-blocked";
  const ACTIVE_WINDOW = 5 * 60 * 1000;
  const HEARTBEAT_INTERVAL = 60 * 1000;
  const REFRESH_INTERVAL = 12 * 1000;
  const MESSAGE_INTERVAL = 4 * 1000;

  const $ = (selector) => document.querySelector(selector);
  const readBlockedUsers = () => {
    try {
      const value = JSON.parse(localStorage.getItem(BLOCKED_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };
  const ui = {
    open: $("#nearbySocialBtn"),
    badge: $("#nearbySocialBadge"),
    dialog: $("#nearbySocialDialog"),
    enabled: $("#nearbyEnabledInput"),
    nickname: $("#nearbyNicknameInput"),
    statusIcon: $("#nearbyStatusIcon"),
    statusText: $("#nearbyStatusText"),
    statusDetail: $("#nearbyStatusDetail"),
    place: $("#nearbyPlaceText"),
    refresh: $("#nearbyRefreshBtn"),
    people: $("#nearbyPeopleList"),
    chatDialog: $("#nearbyChatDialog"),
    chatAvatar: $("#nearbyChatAvatar"),
    chatName: $("#nearbyChatName"),
    chatPlace: $("#nearbyChatPlace"),
    chatMessages: $("#nearbyChatMessages"),
    chatForm: $("#nearbyChatForm"),
    chatInput: $("#nearbyChatInput"),
    chatClose: $("#nearbyChatCloseBtn"),
    block: $("#nearbyBlockBtn")
  };

  const state = {
    db: null,
    user: null,
    location: null,
    people: [],
    activePerson: null,
    conversationId: "",
    seenPeople: new Set(),
    blocked: new Set(readBlockedUsers()),
    heartbeatTimer: 0,
    refreshTimer: 0,
    messageTimer: 0,
    busy: false
  };

  function resultData(result) {
    if (result?.error) throw result.error;
    if (result?.code) throw new Error(result.message || result.code);
    return result?.data ?? result;
  }

  function userId() {
    return String(state.user?.id || state.user?.uid || "");
  }

  function nickname() {
    return ui.nickname.value.trim() || state.user?.username || state.user?.nickname || "同城旅行者";
  }

  function placeKey(location = state.location) {
    if (!location?.city) return "";
    return `${String(location.country || "").trim().toLowerCase()}|${String(location.city).trim().toLowerCase()}`;
  }

  function toast(message) {
    window.dispatchEvent(new CustomEvent("earth-toast", { detail: { message } }));
  }

  function setStatus(kind, text, detail) {
    const icon = { online: "●", searching: "⌁", error: "!", offline: "○" }[kind] || "○";
    ui.statusIcon.textContent = icon;
    ui.statusText.textContent = text;
    ui.statusDetail.textContent = detail || "";
    ui.open.classList.toggle("active", kind === "online" || kind === "searching");
  }

  function showEmpty(message) {
    ui.people.innerHTML = "";
    const paragraph = document.createElement("p");
    paragraph.className = "nearby-empty";
    paragraph.textContent = message;
    ui.people.appendChild(paragraph);
  }

  function updatePlace() {
    state.location = window.EarthCollectionApp?.getCurrentLocation?.() || state.location;
    ui.place.textContent = state.location?.city
      ? `${state.location.country || ""} · ${state.location.city}`
      : "请先在地球上选择城市";
  }

  async function hashId(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function presenceDocumentId() {
    return hashId(`nearby|${userId()}`);
  }

  async function conversationDocumentId(otherId) {
    const pair = [userId(), otherId].sort().join("|");
    return hashId(`${placeKey()}|${pair}`);
  }

  async function getSessionUser() {
    const cloud = window.EarthCloud;
    if (!cloud?.auth || !cloud?.db) return null;
    state.db = cloud.db;
    const known = cloud.getCurrentUser?.();
    if (known) return known;
    const session = resultData(await cloud.auth.getSession());
    return session?.session?.user || null;
  }

  function cloudMessage(error) {
    const text = String(error?.message || error?.code || "");
    if (/collection|not found|不存在/i.test(text)) return "同城偶遇数据库还没有创建";
    if (/permission|denied|unauthorized/i.test(text)) return "同城偶遇数据库权限尚未开启";
    if (/network|fetch|timeout/i.test(text)) return "网络不稳定，稍后会自动重试";
    return text || "同城偶遇暂时无法连接";
  }

  async function publishPresence() {
    if (!ui.enabled.checked || !state.db || !state.user || !state.location?.city) return;
    const id = await presenceDocumentId();
    resultData(await state.db.collection(PRESENCE_COLLECTION).doc(id).set({
      ownerId: userId(),
      nickname: nickname().slice(0, 18),
      country: String(state.location.country || "").slice(0, 40),
      city: String(state.location.city || "").slice(0, 60),
      placeKey: placeKey(),
      enabled: true,
      updatedAt: Date.now()
    }));
  }

  async function removePresence() {
    if (!state.db || !state.user) return;
    try {
      const id = await presenceDocumentId();
      await state.db.collection(PRESENCE_COLLECTION).doc(id).remove();
    } catch (error) {
      console.warn("Unable to remove nearby presence", error);
    }
  }

  function renderPeople() {
    ui.people.innerHTML = "";
    if (!state.people.length) {
      showEmpty("暂时没有同城旅行者在线。保持开启，有人出现时会提醒你。");
      return;
    }
    state.people.forEach((person) => {
      const article = document.createElement("article");
      article.className = "nearby-person";
      const avatar = document.createElement("span");
      avatar.textContent = String(person.nickname || "旅").slice(0, 1);
      const details = document.createElement("div");
      const name = document.createElement("b");
      name.textContent = person.nickname || "同城旅行者";
      const time = document.createElement("small");
      const seconds = Math.max(0, Math.round((Date.now() - Number(person.updatedAt || 0)) / 1000));
      time.textContent = seconds < 60 ? "刚刚在线" : `${Math.ceil(seconds / 60)} 分钟前在线`;
      details.append(name, time);
      const chat = document.createElement("button");
      chat.type = "button";
      chat.textContent = "聊天";
      chat.addEventListener("click", () => openChat(person));
      article.append(avatar, details, chat);
      ui.people.appendChild(article);
    });
  }

  function updateBadge(count) {
    ui.badge.textContent = String(Math.min(99, count));
    ui.badge.classList.toggle("hidden", count < 1);
  }

  function canAutoOpenChat() {
    return !document.querySelector("dialog[open]") && document.visibilityState === "visible";
  }

  async function notifyNewPeople(people) {
    const newcomers = people.filter((person) => !state.seenPeople.has(person.ownerId));
    people.forEach((person) => state.seenPeople.add(person.ownerId));
    if (!newcomers.length) return;
    updateBadge(newcomers.length);
    const first = newcomers[0];
    toast(`${first.nickname || "一位旅行者"}也在${first.city}，可以打个招呼`);
    if (canAutoOpenChat()) await openChat(first);
  }

  async function refreshPeople(silent = false) {
    if (state.busy || !ui.enabled.checked) return;
    state.busy = true;
    if (!silent) setStatus("searching", "正在寻找同城旅行者…", "只匹配最近 5 分钟在线的人");
    try {
      state.user = await getSessionUser();
      updatePlace();
      if (!state.user) throw new Error("请先登录账号");
      if (!state.location?.city) throw new Error("请先选择一个城市");
      await publishPresence();
      const result = await state.db.collection(PRESENCE_COLLECTION).where({ placeKey: placeKey(), enabled: true }).get();
      const data = resultData(result);
      const cutoff = Date.now() - ACTIVE_WINDOW;
      const people = (Array.isArray(data) ? data : [])
        .filter((person) => person.ownerId && person.ownerId !== userId())
        .filter((person) => Number(person.updatedAt || 0) >= cutoff)
        .filter((person) => !state.blocked.has(person.ownerId))
        .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
      state.people = people;
      renderPeople();
      setStatus("online", people.length ? `${people.length} 人此刻也在这里` : "正在等待同城的人", `${state.location.city} · 最近 5 分钟`);
      await notifyNewPeople(people);
    } catch (error) {
      const message = cloudMessage(error);
      setStatus("error", message, "本机收藏不受影响");
      if (!silent) showEmpty(message);
    } finally {
      state.busy = false;
    }
  }

  function stopTimers() {
    clearInterval(state.heartbeatTimer);
    clearInterval(state.refreshTimer);
    clearInterval(state.messageTimer);
    state.heartbeatTimer = 0;
    state.refreshTimer = 0;
    state.messageTimer = 0;
  }

  function startTimers() {
    clearInterval(state.heartbeatTimer);
    clearInterval(state.refreshTimer);
    state.heartbeatTimer = setInterval(() => publishPresence().catch(console.error), HEARTBEAT_INTERVAL);
    state.refreshTimer = setInterval(() => refreshPeople(true), REFRESH_INTERVAL);
  }

  async function enableNearby() {
    state.user = await getSessionUser();
    updatePlace();
    if (!state.user) {
      ui.enabled.checked = false;
      localStorage.removeItem(ENABLED_KEY);
      setStatus("error", "请先登录账号", "登录后才能让同城的人看到你");
      window.dispatchEvent(new CustomEvent("earth-open-account"));
      return;
    }
    if (!state.location?.city) {
      ui.enabled.checked = false;
      localStorage.removeItem(ENABLED_KEY);
      setStatus("error", "请先选择一个城市", "选择后再开启同城偶遇");
      return;
    }
    if (!ui.nickname.value.trim()) ui.nickname.value = nickname();
    localStorage.setItem(NICKNAME_KEY, ui.nickname.value.trim());
    localStorage.setItem(ENABLED_KEY, "1");
    startTimers();
    await refreshPeople();
  }

  async function disableNearby() {
    localStorage.removeItem(ENABLED_KEY);
    stopTimers();
    await removePresence();
    state.people = [];
    renderPeople();
    updateBadge(0);
    setStatus("offline", "同城偶遇已关闭", "其他人现在看不到你在线");
  }

  function formatTime(timestamp) {
    return new Date(Number(timestamp || Date.now())).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  }

  function renderMessages(messages) {
    ui.chatMessages.innerHTML = "";
    if (!messages.length) {
      const empty = document.createElement("p");
      empty.className = "nearby-chat-empty";
      empty.textContent = "你们在同一座城市出现了，打个招呼吧 👋";
      ui.chatMessages.appendChild(empty);
      return;
    }
    messages.forEach((message) => {
      const bubble = document.createElement("div");
      bubble.className = `nearby-message${message.fromUserId === userId() ? " mine" : ""}`;
      bubble.append(document.createTextNode(String(message.text || "")));
      const time = document.createElement("small");
      time.textContent = formatTime(message.createdAt);
      bubble.appendChild(time);
      ui.chatMessages.appendChild(bubble);
    });
    ui.chatMessages.scrollTop = ui.chatMessages.scrollHeight;
  }

  async function loadMessages() {
    if (!state.db || !state.conversationId) return;
    try {
      const _ = state.db.command;
      const result = await state.db.collection(MESSAGES_COLLECTION).where(_.or([
        { conversationId: state.conversationId, participantA: userId() },
        { conversationId: state.conversationId, participantB: userId() }
      ])).get();
      const data = resultData(result);
      const messages = (Array.isArray(data) ? data : [])
        .filter((message) => Number(message.createdAt || 0) >= Date.now() - 7 * 24 * 60 * 60 * 1000)
        .sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0))
        .slice(-100);
      renderMessages(messages);
    } catch (error) {
      renderMessages([]);
      toast(cloudMessage(error));
    }
  }

  async function openChat(person) {
    if (!person?.ownerId || state.blocked.has(person.ownerId)) return;
    state.activePerson = person;
    state.conversationId = await conversationDocumentId(person.ownerId);
    ui.chatAvatar.textContent = String(person.nickname || "旅").slice(0, 1);
    ui.chatName.textContent = person.nickname || "同城旅行者";
    ui.chatPlace.textContent = `${person.country || ""} · ${person.city || ""}`;
    if (ui.dialog.open) ui.dialog.close();
    updateBadge(0);
    await loadMessages();
    if (!ui.chatDialog.open) ui.chatDialog.showModal();
    ui.chatInput.focus();
    clearInterval(state.messageTimer);
    state.messageTimer = setInterval(loadMessages, MESSAGE_INTERVAL);
  }

  async function sendMessage(event) {
    event.preventDefault();
    const text = ui.chatInput.value.trim();
    if (!text || !state.db || !state.activePerson || !state.conversationId) return;
    const button = ui.chatForm.querySelector("button");
    button.disabled = true;
    try {
      const participants = [userId(), state.activePerson.ownerId].sort();
      resultData(await state.db.collection(MESSAGES_COLLECTION).add({
        conversationId: state.conversationId,
        placeKey: placeKey(),
        participantA: participants[0],
        participantB: participants[1],
        fromUserId: userId(),
        fromNickname: nickname().slice(0, 18),
        toUserId: state.activePerson.ownerId,
        text: text.slice(0, 240),
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      }));
      ui.chatInput.value = "";
      await loadMessages();
    } catch (error) {
      toast(cloudMessage(error));
    } finally {
      button.disabled = false;
      ui.chatInput.focus();
    }
  }

  function closeChat() {
    clearInterval(state.messageTimer);
    state.messageTimer = 0;
    if (ui.chatDialog.open) ui.chatDialog.close();
  }

  async function blockPerson() {
    if (!state.activePerson?.ownerId) return;
    state.blocked.add(state.activePerson.ownerId);
    localStorage.setItem(BLOCKED_KEY, JSON.stringify([...state.blocked]));
    const name = state.activePerson.nickname || "这位用户";
    closeChat();
    state.people = state.people.filter((person) => person.ownerId !== state.activePerson.ownerId);
    renderPeople();
    toast(`已屏蔽${name}`);
  }

  async function openNearby() {
    updatePlace();
    state.user = await getSessionUser().catch(() => null);
    if (!ui.dialog.open) ui.dialog.showModal();
    if (ui.enabled.checked) await refreshPeople();
  }

  ui.nickname.value = localStorage.getItem(NICKNAME_KEY) || "";
  ui.enabled.checked = localStorage.getItem(ENABLED_KEY) === "1";
  updatePlace();
  setStatus("offline", "同城偶遇尚未开启", "登录并选择城市后可以开启");
  ui.open.addEventListener("click", openNearby);
  ui.enabled.addEventListener("change", () => ui.enabled.checked ? enableNearby() : disableNearby());
  ui.nickname.addEventListener("input", () => {
    localStorage.setItem(NICKNAME_KEY, ui.nickname.value.trim());
    if (ui.enabled.checked) publishPresence().catch(console.error);
  });
  ui.refresh.addEventListener("click", () => refreshPeople());
  ui.chatForm.addEventListener("submit", sendMessage);
  ui.chatClose.addEventListener("click", closeChat);
  ui.block.addEventListener("click", blockPerson);
  ui.chatDialog.addEventListener("close", () => {
    clearInterval(state.messageTimer);
    state.messageTimer = 0;
  });
  window.addEventListener("earth-location-changed", async (event) => {
    state.location = event.detail?.location || null;
    updatePlace();
    state.seenPeople.clear();
    if (ui.enabled.checked) await refreshPeople(true);
  });
  window.addEventListener("earth-account-changed", async (event) => {
    state.user = event.detail?.user || null;
    if (!state.user && ui.enabled.checked) {
      ui.enabled.checked = false;
      await disableNearby();
    } else if (state.user && ui.enabled.checked) {
      await enableNearby();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && ui.enabled.checked) refreshPeople(true);
  });
  window.addEventListener("beforeunload", () => {
    if (ui.enabled.checked) removePresence();
  });
})();
