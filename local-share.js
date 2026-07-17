(() => {
  "use strict";

  const PACK_FORMAT = "earth-collection-friend-pack";
  const MESSAGE_KEY = "earth-collection-friend-messages-v1";
  const NAME_KEY = "earth-collection-friend-name";
  const $id = (id) => document.getElementById(id);
  const ui = {
    name: $id("friendPackNameInput"),
    title: $id("friendPackTitleInput"),
    message: $id("friendPackMessageInput"),
    generate: $id("generateFriendPackBtn"),
    input: $id("mergeFriendPackInput"),
    panel: $id("friendMessagePanel"),
    list: $id("friendMessageList"),
    clear: $id("clearFriendMessagesBtn")
  };

  if (!ui.generate || !ui.input) return;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[character]);
  }

  function safePhoto(value) {
    const photo = String(value || "");
    return /^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(photo) ? photo : "";
  }

  function fileSafe(value) {
    return String(value || "地球收藏夹").replace(/[\\/:*?"<>|]/g, "-").slice(0, 40);
  }

  function loadMessages() {
    try {
      const messages = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "[]");
      return Array.isArray(messages) ? messages : [];
    } catch {
      return [];
    }
  }

  function saveMessages(messages) {
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages.slice(-50)));
  }

  function renderMessages() {
    const messages = loadMessages().sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    ui.list.innerHTML = "";
    ui.panel.classList.toggle("hidden", !messages.length);
    messages.forEach((item) => {
      const article = document.createElement("article");
      const heading = document.createElement("div");
      const name = document.createElement("b");
      const date = document.createElement("small");
      const message = document.createElement("p");
      name.textContent = item.sender || "朋友";
      date.textContent = new Date(Number(item.createdAt) || Date.now()).toLocaleDateString("zh-CN");
      message.textContent = item.message;
      heading.append(name, date);
      article.append(heading, message);
      ui.list.appendChild(article);
    });
  }

  function cardMarkup(entry) {
    const photo = safePhoto(entry.photo);
    const image = photo
      ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(entry.placeName || entry.cityName)}" />`
      : `<div class="photo-empty">${escapeHtml(String(entry.type || "✨").split(" ")[0])}</div>`;
    return `<article class="memory-card">
      ${image}
      <div class="memory-copy">
        <div class="memory-top"><b>${escapeHtml(entry.mood || "💭")} ${escapeHtml(entry.cityName)}</b><span>${escapeHtml(entry.type || "✨ 其他")}</span></div>
        <small>${escapeHtml(entry.countryName)} · ${escapeHtml(entry.date)}${entry.placeName ? ` · ${escapeHtml(entry.placeName)}` : ""}</small>
        ${entry.subjectName ? `<h3>${escapeHtml(entry.subjectName)}</h3>` : ""}
        <p>${escapeHtml(entry.text || "这张照片收藏了一个难忘的瞬间。")}</p>
      </div>
    </article>`;
  }

  function buildShareHtml(payload) {
    const entries = [...payload.entries].sort((a, b) => String(b.date).localeCompare(String(a.date)) || Number(b.createdAt) - Number(a.createdAt));
    const cities = new Set(entries.map((entry) => `${entry.countryCode}|${entry.cityName}`)).size;
    const embedded = JSON.stringify(payload).replace(/</g, "\\u003c");
    const cards = entries.length ? entries.map(cardMarkup).join("") : `<p class="empty">这个共享包里还没有照片。</p>`;
    const note = payload.sender.message ? `<blockquote>“${escapeHtml(payload.sender.message)}”<small>—— ${escapeHtml(payload.sender.name)}</small></blockquote>` : "";
    return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escapeHtml(payload.title)}</title>
<style>
:root{color-scheme:dark;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;background:#050a18;color:#f4f7ff}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 75% 5%,#17376a 0,transparent 30%),radial-gradient(circle at 15% 35%,#123642 0,transparent 27%),#050a18}main{width:min(720px,100%);margin:auto;padding:42px 16px 70px}header{padding:22px 6px 30px}header small{color:#8ea6cf;letter-spacing:.16em}h1{margin:9px 0 8px;font-family:Georgia,"Songti SC",serif;font-size:clamp(30px,9vw,48px);font-weight:500}header p{margin:0;color:#aebbd0}.summary{display:flex;gap:8px;margin-top:20px}.summary span{padding:8px 12px;border:1px solid #29476d;border-radius:99px;background:#0b1730;color:#d9e8ff;font-size:12px}blockquote{margin:0 0 22px;padding:18px;border:1px solid #294a56;border-radius:20px;background:#0c2028;color:#d9f5eb;line-height:1.7}blockquote small{display:block;margin-top:8px;color:#82a8a0}.grid{display:grid;gap:14px}.memory-card{overflow:hidden;border:1px solid #263550;border-radius:22px;background:rgba(15,25,48,.92);box-shadow:0 18px 45px rgba(0,0,0,.23)}.memory-card img,.photo-empty{width:100%;height:auto;aspect-ratio:4/3;display:block;object-fit:cover}.photo-empty{display:grid;place-items:center;background:linear-gradient(135deg,#193858,#17213d);font-size:64px}.memory-copy{padding:16px}.memory-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.memory-top b{font-size:17px}.memory-top span{flex:none;color:#9fb1cc;font-size:11px}.memory-copy>small{display:block;margin-top:7px;color:#7f91ae}.memory-copy h3{margin:14px 0 0}.memory-copy p{margin:10px 0 0;color:#c8d2e3;line-height:1.7;white-space:pre-wrap}.empty{padding:40px;text-align:center;color:#8b99b0}footer{margin-top:26px;padding:20px 8px;color:#7787a2;font-size:12px;line-height:1.7}footer b{color:#b7c8e4}
@media(min-width:640px){.grid{grid-template-columns:1fr 1fr}.memory-card img,.photo-empty{aspect-ratio:1/1}}
</style></head><body><main><header><small>EARTH COLLECTION</small><h1>${escapeHtml(payload.title)}</h1><p>${escapeHtml(payload.sender.name)} 分享的地球回忆</p><div class="summary"><span>${entries.length} 件收藏</span><span>${cities} 个城市</span></div></header>${note}<section class="grid">${cards}</section><footer><b>这是「地球收藏夹」生成的只读朋友共享包。</b><br>你可以直接浏览；如果你也有“地球收藏夹”，可在“共享日志 → 合并朋友的共享包”中导入，原有记录不会被清空。</footer></main><script id="earthShareData" type="application/json">${embedded}</script></body></html>`;
  }

  async function deliverPack(file) {
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({ title: file.name, text: "我用地球收藏夹给你发来了一份回忆。", files: [file] });
        toast("共享包已打开系统分享");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("共享包已生成，可以发给朋友了");
  }

  ui.generate.addEventListener("click", async () => {
    const senderName = ui.name.value.trim() || "一位朋友";
    const title = ui.title.value.trim() || "我的地球收藏夹";
    localStorage.setItem(NAME_KEY, senderName);
    const payload = {
      format: PACK_FORMAT,
      version: 1,
      createdAt: Date.now(),
      title,
      sender: { name: senderName, message: ui.message.value.trim() },
      entries: state.entries.map(normalizeEntry).filter(Boolean),
      studyDiary: state.studyDiary
    };
    const html = buildShareHtml(payload);
    const file = new File([html], `${fileSafe(title)}-${localDate()}.html`, { type: "text/html" });
    await deliverPack(file);
  });

  function parsePack(text) {
    const trimmed = text.trim();
    if (trimmed.startsWith("<")) {
      const doc = new DOMParser().parseFromString(trimmed, "text/html");
      const data = doc.getElementById("earthShareData");
      if (!data) throw new Error("这不是地球收藏夹共享包");
      return JSON.parse(data.textContent);
    }
    return JSON.parse(trimmed);
  }

  function fingerprint(entry) {
    return [entry.date, entry.countryCode, entry.cityName, entry.placeName, entry.subjectName, String(entry.photo || "").slice(-120)].join("|").toLowerCase();
  }

  function mergeStudyDiary(remoteValue) {
    if (!remoteValue || typeof remoteValue !== "object") return;
    const remote = normalizeStudyDiary(remoteValue);
    const local = normalizeStudyDiary(state.studyDiary);
    const notes = new Map(local.notes.map((item) => [item.id, item]));
    remote.notes.forEach((item) => {
      const old = notes.get(item.id);
      if (!old || Number(item.createdAt) > Number(old.createdAt)) notes.set(item.id, item);
    });
    const checkIns = new Map(local.checkIns.map((item) => [`${item.date}|${item.type}`, item]));
    remote.checkIns.forEach((item) => {
      const key = `${item.date}|${item.type}`;
      if (!checkIns.has(key)) checkIns.set(key, item);
    });
    state.studyDiary = normalizeStudyDiary({
      school: local.school || remote.school,
      city: local.city || remote.city,
      startDate: local.startDate || remote.startDate,
      completedQuestIds: [...new Set([...local.completedQuestIds, ...remote.completedQuestIds])],
      notes: [...notes.values()],
      checkIns: [...checkIns.values()]
    });
    saveStudyDiary();
  }

  function rememberMessage(pack) {
    const message = String(pack?.sender?.message || "").trim();
    if (!message) return;
    const sender = String(pack?.sender?.name || "朋友").slice(0, 30);
    const createdAt = Number(pack.createdAt) || Date.now();
    const id = `${sender}|${createdAt}|${message}`;
    const messages = loadMessages();
    if (!messages.some((item) => item.id === id)) messages.push({ id, sender, message: message.slice(0, 300), createdAt });
    saveMessages(messages);
    renderMessages();
  }

  ui.input.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const pack = parsePack(await file.text());
      if (pack?.format !== PACK_FORMAT || !Array.isArray(pack.entries) || !pack.entries.every(isValidImport)) throw new Error("共享包格式不正确");
      const localById = new Map(state.entries.map((entry) => [entry.id, entry]));
      const fingerprints = new Set(state.entries.map((entry) => fingerprint(normalizeEntry(entry))));
      let added = 0;
      let updated = 0;
      let skipped = 0;
      for (const raw of pack.entries) {
        const incoming = normalizeEntry(raw);
        const old = localById.get(incoming.id);
        if (old) {
          if (Number(incoming.updatedAt) > Number(normalizeEntry(old).updatedAt)) {
            await saveEntry(incoming);
            const index = state.entries.findIndex((entry) => entry.id === incoming.id);
            state.entries[index] = incoming;
            localById.set(incoming.id, incoming);
            updated += 1;
          } else skipped += 1;
        } else if (fingerprints.has(fingerprint(incoming))) {
          skipped += 1;
        } else {
          await saveEntry(incoming);
          state.entries.push(incoming);
          localById.set(incoming.id, incoming);
          fingerprints.add(fingerprint(incoming));
          added += 1;
        }
      }
      mergeStudyDiary(pack.studyDiary);
      rememberMessage(pack);
      renderStatus();
      toast(`合并完成：新增 ${added} 条，更新 ${updated} 条，跳过 ${skipped} 条`);
    } catch (error) {
      console.error(error);
      toast(`合并失败：${error.message}`);
    } finally {
      ui.input.value = "";
    }
  });

  ui.clear.addEventListener("click", () => {
    if (!confirm("确定清空朋友捎来的话吗？收藏记录不会被删除。")) return;
    localStorage.removeItem(MESSAGE_KEY);
    renderMessages();
  });

  ui.name.value = localStorage.getItem(NAME_KEY) || "";
  renderMessages();
})();
