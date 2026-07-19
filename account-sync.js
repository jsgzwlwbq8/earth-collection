(() => {
  const ENV_ID = "earth-collection-sync-d079e694b4";
  const REGION = "ap-shanghai";
  const ACCESS_KEY = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMWRjMzFlLWI0ZDAtNDQ4Yi1hNzZmLWIwY2M2M2Q4MTQ5OCJ9.eyJpc3MiOiJodHRwczovL2VhcnRoLWNvbGxlY3Rpb24tc3luYy1kMDc5ZTY5NGI0LmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJlYXJ0aC1jb2xsZWN0aW9uLXN5bmMtZDA3OWU2OTRiNCIsImV4cCI6NDA4Nzk2MDE1NSwiaWF0IjoxNzg0Mjc2OTU1LCJub25jZSI6IjBwNUVoalhJUjUycHFLS1dhSnQxNlEiLCJhdF9oYXNoIjoiMHA1RWhqWElSNTJwcUtLV2FKdDE2USIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJlYXJ0aC1jb2xsZWN0aW9uLXN5bmMtZDA3OWU2OTRiNCIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJ1c2VyX3R5cGUiOiIiLCJjbGllbnRfdHlwZSI6ImNsaWVudF91c2VyIiwiaXNfc3lzdGVtX2FkbWluIjpmYWxzZX0.dD8_AU0ai1zTjNcZQZ-eHo9wzGqj7JFsZt5_m2mZbTTLMetR1svLKaCCer0vpX0RIEqW0XV9ONvoGnNXEqdU0a9BxsgzGIP-zTZV5nnUgqym9VT0sLA_qNsDcyIKp-AJKQpyHCPhQod7UBlwP1PaTr1uhNVKldW8MCSBH5Km4eAk8Ku1KRmqMIbCfYE3gkdmvnQCQ0S--4Lvavv8ZsTq-12EHu_DFuBDig2eBRtFvIkqV7db3U22UueVWSz-ga2StcqXBaCLrait5uuffXBqIYLUj1WKx89mZa1Bhg9OW7ZUMBDP4qgH61ZBJgTppnqHp7hOkM4SPJYfKdepb-8ctQ";
  const ENTRIES_COLLECTION = "earth_user_entries";
  const PROFILES_COLLECTION = "earth_user_profiles";
  const LAST_ACCOUNT_KEY = "earth-cloud-last-account";
  const PROFILE_UPDATED_KEY = "earth-cloud-profile-updated";

  const $ = (selector) => document.querySelector(selector);
  const ui = {
    button: $("#accountBtn"),
    dialog: $("#accountDialog"),
    signedOut: $("#accountSignedOut"),
    signedIn: $("#accountSignedIn"),
    userName: $("#accountUserName"),
    message: $("#accountMessage"),
    syncIcon: $("#syncStatusIcon"),
    syncText: $("#syncStatusText"),
    syncDetail: $("#syncStatusDetail"),
    tabs: [...document.querySelectorAll(".account-tab")],
    panels: [...document.querySelectorAll(".account-panel")],
    passwordForm: $("#passwordLoginForm"),
    passwordAccount: $("#passwordAccountInput"),
    password: $("#passwordInput"),
    emailForm: $("#emailLoginForm"),
    email: $("#emailLoginInput"),
    sendEmailCode: $("#sendEmailCodeBtn"),
    emailCodeField: $("#emailCodeField"),
    emailCode: $("#emailCodeInput"),
    verifyEmailCode: $("#verifyEmailCodeBtn"),
    registerForm: $("#registerForm"),
    registerUsername: $("#registerUsernameInput"),
    registerEmail: $("#registerEmailInput"),
    registerPassword: $("#registerPasswordInput"),
    sendRegisterCode: $("#sendRegisterCodeBtn"),
    registerCodeField: $("#registerCodeField"),
    registerCode: $("#registerCodeInput"),
    finishRegister: $("#finishRegisterBtn"),
    syncNow: $("#syncNowBtn"),
    logout: $("#logoutBtn")
  };

  let app = null;
  let auth = null;
  let db = null;
  let currentUser = null;
  let emailVerify = null;
  let registerVerify = null;
  let profileTimer = 0;
  let syncing = false;

  function setMessage(message = "", isError = false) {
    ui.message.textContent = message;
    ui.message.classList.toggle("error", isError);
  }

  function setSyncStatus(status, detail = "") {
    const icons = { syncing: "↻", online: "☁️", error: "⚠️", offline: "○" };
    ui.syncIcon.textContent = icons[status] || "☁️";
    ui.syncText.textContent = status === "syncing" ? "正在同步…" :
      status === "online" ? "云端同步已开启" :
      status === "error" ? "本次同步未完成" : "尚未登录";
    ui.syncDetail.textContent = detail || (status === "online" ? "这台设备与云端数据一致" : "");
  }

  function setBusy(element, busy, busyText = "请稍候…") {
    if (!element) return;
    if (busy) {
      element.dataset.originalText = element.textContent;
      element.textContent = busyText;
      element.disabled = true;
    } else {
      element.textContent = element.dataset.originalText || element.textContent;
      element.disabled = false;
    }
  }

  function showAccountState() {
    const signedIn = Boolean(currentUser);
    ui.signedOut.classList.toggle("hidden", signedIn);
    ui.signedIn.classList.toggle("hidden", !signedIn);
    ui.button.classList.toggle("signed-in", signedIn);
    ui.button.textContent = signedIn ? "☁️" : "👤";
    if (signedIn) {
      ui.userName.textContent = currentUser.username || currentUser.email || currentUser.nickname || "地球收藏家";
    }
  }

  function announceAccount() {
    window.dispatchEvent(new CustomEvent("earth-account-changed", {
      detail: {
        signedIn: Boolean(currentUser),
        user: currentUser ? {
          id: userId(),
          username: currentUser.username || "",
          email: currentUser.email || "",
          nickname: currentUser.nickname || ""
        } : null
      }
    }));
  }

  function userId(user = currentUser) {
    return String(user?.id || user?.uid || "");
  }

  function resultData(result) {
    if (result?.error) throw result.error;
    if (result?.code) throw new Error(result.message || result.code);
    return result?.data ?? result;
  }

  function cloudErrorMessage(error) {
    const code = String(error?.code || error?.error || "");
    const message = String(error?.message || "");
    if (/invalid_password|password.*incorrect/i.test(`${code} ${message}`)) return "密码不正确，请重新输入";
    if (/not_found|not exist/i.test(`${code} ${message}`)) return "账号不存在，请先注册";
    if (/resource_exhausted|too many|频率/i.test(`${code} ${message}`)) return "操作太频繁，请稍后再试";
    if (/invalid_argument|format|格式/i.test(`${code} ${message}`)) return "输入格式不正确，请检查后重试";
    if (/permission|denied|unauthorized/i.test(`${code} ${message}`)) return "云端权限尚未生效，请稍后再试";
    if (/network|fetch|unreachable|timeout/i.test(`${code} ${message}`)) return "网络连接失败，本机数据仍然安全";
    if (/document.*large|size|too large/i.test(`${code} ${message}`)) return "有一张照片太大，暂时无法上传云端";
    return message || "操作失败，请稍后再试";
  }

  function whenAppReady() {
    if (window.EarthCollectionApp?.ready) return Promise.resolve();
    return new Promise((resolve) => window.addEventListener("earth-app-ready", resolve, { once: true }));
  }

  async function hashId(value) {
    if (crypto?.subtle) {
      const bytes = new TextEncoder().encode(value);
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    return btoa(unescape(encodeURIComponent(value))).replace(/[^a-z0-9]/gi, "").slice(0, 96);
  }

  function entryUpdatedAt(entry) {
    return Number(entry?.updatedAt || entry?.createdAt || 0);
  }

  async function entryDocumentId(id) {
    return hashId(`${userId()}|entry|${id}`);
  }

  async function profileDocumentId() {
    return hashId(`${userId()}|profile`);
  }

  async function setEntryDocument(entry) {
    if (!currentUser || !entry?.id) return;
    const docId = await entryDocumentId(entry.id);
    const result = await db.collection(ENTRIES_COLLECTION).doc(docId).set({
      localId: String(entry.id),
      ownerId: userId(),
      deleted: false,
      updatedAt: entryUpdatedAt(entry) || Date.now(),
      entry
    });
    resultData(result);
  }

  async function setEntryTombstone(id, updatedAt = Date.now()) {
    if (!currentUser || !id) return;
    const docId = await entryDocumentId(id);
    const result = await db.collection(ENTRIES_COLLECTION).doc(docId).set({
      localId: String(id),
      ownerId: userId(),
      deleted: true,
      updatedAt: Number(updatedAt) || Date.now()
    });
    resultData(result);
  }

  async function fetchRemoteEntries() {
    const collection = db.collection(ENTRIES_COLLECTION);
    const query = typeof collection.limit === "function" ? collection.limit(1000) : collection;
    const result = await query.get();
    const data = resultData(result);
    return Array.isArray(data) ? data : [];
  }

  async function fetchRemoteProfile() {
    const docId = await profileDocumentId();
    try {
      const result = await db.collection(PROFILES_COLLECTION).doc(docId).get();
      const data = resultData(result);
      return Array.isArray(data) ? (data[0] || null) : (data || null);
    } catch (error) {
      if (/not.?found|不存在/i.test(String(error?.message || error?.code || ""))) return null;
      throw error;
    }
  }

  function profileFromSnapshot(snapshot) {
    return {
      routeSettings: snapshot.routeSettings,
      journalDraft: snapshot.journalDraft,
      studyDiary: snapshot.studyDiary
    };
  }

  function blankProfile() {
    return {
      routeSettings: { closeLoop: true, returnMode: "plane" },
      journalDraft: { title: "", startDate: "", endDate: "", fun: "" },
      studyDiary: { school: "", city: "", startDate: "", completedQuestIds: [], notes: [], checkIns: [] }
    };
  }

  function hasMeaningfulLocalData(snapshot) {
    const profile = profileFromSnapshot(snapshot);
    return snapshot.entries.length > 0 ||
      Boolean(profile.journalDraft.title || profile.journalDraft.fun) ||
      Boolean(profile.studyDiary.school || profile.studyDiary.notes?.length || profile.studyDiary.checkIns?.length);
  }

  async function setProfile(profile, updatedAt = Date.now()) {
    const docId = await profileDocumentId();
    const result = await db.collection(PROFILES_COLLECTION).doc(docId).set({
      ownerId: userId(),
      updatedAt,
      ...profile
    });
    resultData(result);
    localStorage.setItem(PROFILE_UPDATED_KEY, String(updatedAt));
  }

  async function runInBatches(items, worker, size = 4) {
    for (let index = 0; index < items.length; index += size) {
      await Promise.all(items.slice(index, index + size).map(worker));
    }
  }

  function mergeEntries(localEntries, remoteDocuments, acceptLocal) {
    const merged = new Map();
    if (acceptLocal) localEntries.forEach((entry) => merged.set(String(entry.id), entry));

    remoteDocuments.forEach((document) => {
      const id = String(document.localId || document.entry?.id || "");
      if (!id) return;
      const local = merged.get(id);
      const remoteUpdated = Number(document.updatedAt || 0);
      if (document.deleted) {
        if (!local || remoteUpdated >= entryUpdatedAt(local)) merged.delete(id);
        return;
      }
      if (!document.entry) return;
      if (!local || remoteUpdated > entryUpdatedAt(local)) {
        const normalized = window.EarthCollectionApp.normalizeEntry(document.entry);
        if (normalized) merged.set(id, normalized);
      }
    });
    return [...merged.values()];
  }

  async function syncAll() {
    if (!currentUser || syncing) return;
    syncing = true;
    setSyncStatus("syncing", "正在合并这台设备和云端的收藏");
    try {
      await whenAppReady();
      const localSnapshot = window.EarthCollectionApp.getSnapshot();
      const lastAccount = localStorage.getItem(LAST_ACCOUNT_KEY) || "";
      const sameAccount = !lastAccount || lastAccount === userId();
      const mayMigrateLocal = sameAccount && (lastAccount === userId() || hasMeaningfulLocalData(localSnapshot));
      const [remoteDocuments, remoteProfile] = await Promise.all([
        fetchRemoteEntries(),
        fetchRemoteProfile()
      ]);

      const entries = mergeEntries(localSnapshot.entries, remoteDocuments, mayMigrateLocal);
      const remoteProfileUpdated = Number(remoteProfile?.updatedAt || 0);
      let localProfileUpdated = Number(localStorage.getItem(PROFILE_UPDATED_KEY) || 0);
      if (!lastAccount && hasMeaningfulLocalData(localSnapshot)) localProfileUpdated = Date.now();
      if (lastAccount && lastAccount !== userId()) localProfileUpdated = 0;

      let chosenProfile;
      let chosenProfileUpdated;
      if (remoteProfile && remoteProfileUpdated > localProfileUpdated) {
        chosenProfile = {
          routeSettings: remoteProfile.routeSettings,
          journalDraft: remoteProfile.journalDraft,
          studyDiary: remoteProfile.studyDiary
        };
        chosenProfileUpdated = remoteProfileUpdated;
      } else if (lastAccount && lastAccount !== userId()) {
        chosenProfile = remoteProfile ? {
          routeSettings: remoteProfile.routeSettings,
          journalDraft: remoteProfile.journalDraft,
          studyDiary: remoteProfile.studyDiary
        } : blankProfile();
        chosenProfileUpdated = remoteProfileUpdated || Date.now();
      } else {
        chosenProfile = profileFromSnapshot(localSnapshot);
        chosenProfileUpdated = localProfileUpdated || Date.now();
      }

      await window.EarthCollectionApp.applySnapshot({ entries, ...chosenProfile });
      localStorage.setItem(LAST_ACCOUNT_KEY, userId());
      localStorage.setItem(PROFILE_UPDATED_KEY, String(chosenProfileUpdated));

      const remoteById = new Map(remoteDocuments.map((item) => [String(item.localId || ""), item]));
      const entriesToUpload = entries.filter((entry) => {
        const remote = remoteById.get(String(entry.id));
        return !remote || remote.deleted || entryUpdatedAt(entry) > Number(remote.updatedAt || 0);
      });
      await runInBatches(entriesToUpload, setEntryDocument);
      if (!remoteProfile || chosenProfileUpdated > remoteProfileUpdated) {
        await setProfile(chosenProfile, chosenProfileUpdated);
      }

      setSyncStatus("online", `已同步 ${entries.length} 件收藏 · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`);
      setMessage("登录成功，收藏已安全同步到云端");
    } catch (error) {
      console.error("Cloud sync failed", error);
      setSyncStatus("error", cloudErrorMessage(error));
      setMessage(cloudErrorMessage(error), true);
    } finally {
      syncing = false;
    }
  }

  async function pushFullSnapshot() {
    if (!currentUser) return;
    try {
      await whenAppReady();
      const snapshot = window.EarthCollectionApp.getSnapshot();
      const remoteDocuments = await fetchRemoteEntries();
      const localIds = new Set(snapshot.entries.map((entry) => String(entry.id)));
      const missing = remoteDocuments.filter((item) => !item.deleted && item.localId && !localIds.has(String(item.localId)));
      await runInBatches(missing, (item) => setEntryTombstone(item.localId, Date.now()));
      await runInBatches(snapshot.entries, setEntryDocument);
      await setProfile(profileFromSnapshot(snapshot), Date.now());
      setSyncStatus("online", `已同步 ${snapshot.entries.length} 件收藏`);
    } catch (error) {
      console.error(error);
      setSyncStatus("error", cloudErrorMessage(error));
    }
  }

  function scheduleProfileSync() {
    clearTimeout(profileTimer);
    profileTimer = setTimeout(async () => {
      if (!currentUser) return;
      try {
        await whenAppReady();
        await setProfile(profileFromSnapshot(window.EarthCollectionApp.getSnapshot()), Date.now());
        setSyncStatus("online", "设置已同步");
      } catch (error) {
        console.error(error);
        setSyncStatus("error", cloudErrorMessage(error));
      }
    }, 900);
  }

  async function afterLogin(user) {
    currentUser = user || resultData(await auth.getSession())?.session?.user || null;
    if (!currentUser) throw new Error("登录成功，但没有取得账号信息");
    showAccountState();
    announceAccount();
    await syncAll();
  }

  function activatePanel(panelId) {
    ui.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.accountPanel === panelId));
    ui.panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.accountPanelId === panelId));
    setMessage("");
  }

  ui.tabs.forEach((tab) => tab.addEventListener("click", () => activatePanel(tab.dataset.accountPanel)));
  function openAccountDialog() {
    showAccountState();
    if (!ui.dialog.open) ui.dialog.showModal();
  }

  ui.button.addEventListener("click", openAccountDialog);
  window.addEventListener("earth-open-account", openAccountDialog);

  ui.passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!auth) return setMessage("云端组件还没有加载，请刷新页面", true);
    const account = ui.passwordAccount.value.trim();
    const params = account.includes("@") ? { email: account } : { username: account };
    setBusy(event.submitter, true, "正在登录…");
    setMessage("正在验证账号…");
    try {
      const result = await auth.signInWithPassword({ ...params, password: ui.password.value });
      const data = resultData(result);
      await afterLogin(data?.user || data?.session?.user);
    } catch (error) {
      setMessage(cloudErrorMessage(error), true);
    } finally {
      setBusy(event.submitter, false);
    }
  });

  ui.sendEmailCode.addEventListener("click", async () => {
    if (!ui.email.reportValidity()) return;
    setBusy(ui.sendEmailCode, true, "正在发送…");
    setMessage("正在发送邮箱验证码…");
    try {
      const data = resultData(await auth.signInWithOtp({ email: ui.email.value.trim() }));
      if (typeof data?.verifyOtp !== "function") throw new Error("没有收到验证码验证入口");
      emailVerify = data.verifyOtp;
      ui.emailCodeField.classList.remove("hidden");
      ui.verifyEmailCode.classList.remove("hidden");
      ui.emailCode.focus();
      setMessage("验证码已发送，请检查收件箱和垃圾邮件");
    } catch (error) {
      setMessage(cloudErrorMessage(error), true);
    } finally {
      setBusy(ui.sendEmailCode, false);
    }
  });

  ui.emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!emailVerify) return setMessage("请先发送验证码", true);
    const code = ui.emailCode.value.trim();
    if (!code) return setMessage("请输入邮箱验证码", true);
    setBusy(ui.verifyEmailCode, true, "正在验证…");
    try {
      const data = resultData(await emailVerify({ token: code }));
      await afterLogin(data?.user || data?.session?.user);
    } catch (error) {
      setMessage(cloudErrorMessage(error), true);
    } finally {
      setBusy(ui.verifyEmailCode, false);
    }
  });

  ui.sendRegisterCode.addEventListener("click", async () => {
    if (!ui.registerForm.reportValidity()) return;
    setBusy(ui.sendRegisterCode, true, "正在发送…");
    setMessage("正在创建账号并发送验证码…");
    try {
      const data = resultData(await auth.signUp({
        username: ui.registerUsername.value.trim(),
        email: ui.registerEmail.value.trim(),
        password: ui.registerPassword.value
      }));
      if (typeof data?.verifyOtp !== "function") throw new Error("没有收到注册验证入口");
      registerVerify = data.verifyOtp;
      ui.registerCodeField.classList.remove("hidden");
      ui.finishRegister.classList.remove("hidden");
      ui.registerCode.focus();
      setMessage("注册验证码已发送到邮箱");
    } catch (error) {
      setMessage(cloudErrorMessage(error), true);
    } finally {
      setBusy(ui.sendRegisterCode, false);
    }
  });

  ui.registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!registerVerify) return setMessage("请先发送注册验证码", true);
    const code = ui.registerCode.value.trim();
    if (!code) return setMessage("请输入注册验证码", true);
    setBusy(ui.finishRegister, true, "正在完成注册…");
    try {
      const data = resultData(await registerVerify({ token: code }));
      await afterLogin(data?.user || data?.session?.user);
    } catch (error) {
      setMessage(cloudErrorMessage(error), true);
    } finally {
      setBusy(ui.finishRegister, false);
    }
  });

  ui.syncNow.addEventListener("click", syncAll);
  ui.logout.addEventListener("click", async () => {
    setBusy(ui.logout, true, "正在退出…");
    try {
      resultData(await auth.signOut());
      currentUser = null;
      showAccountState();
      announceAccount();
      setSyncStatus("offline", "本机收藏仍保留");
      setMessage("已退出登录");
    } catch (error) {
      setMessage(cloudErrorMessage(error), true);
    } finally {
      setBusy(ui.logout, false);
    }
  });

  window.addEventListener("earth-local-change", async (event) => {
    if (!currentUser) return;
    const detail = event.detail || {};
    if (detail.type === "profile") {
      localStorage.setItem(PROFILE_UPDATED_KEY, String(Date.now()));
      scheduleProfileSync();
      return;
    }
    try {
      if (detail.type === "entry") await setEntryDocument(detail.entry);
      else if (detail.type === "delete") await setEntryTombstone(detail.id, detail.updatedAt);
      else if (detail.type === "full") await pushFullSnapshot();
      if (detail.type === "entry" || detail.type === "delete") setSyncStatus("online", "最新修改已同步");
    } catch (error) {
      console.error(error);
      setSyncStatus("error", `${cloudErrorMessage(error)}，稍后点击“立即同步”重试`);
    }
  });

  async function initialize() {
    showAccountState();
    setSyncStatus("offline", "登录后可跨浏览器使用");
    if (typeof cloudbase === "undefined") {
      setMessage("云端组件没有加载，请检查网络后刷新", true);
      return;
    }
    try {
      app = cloudbase.init({ env: ENV_ID, region: REGION, accessKey: ACCESS_KEY });
      auth = typeof app.auth === "function" ? app.auth() : app.auth;
      db = app.database();
      window.EarthCloud = { app, auth, db, envId: ENV_ID, region: REGION, accessKey: ACCESS_KEY, getCurrentUser: () => currentUser };
      const sessionData = resultData(await auth.getSession());
      currentUser = sessionData?.session?.user || null;
      showAccountState();
      announceAccount();
      if (currentUser) await syncAll();
    } catch (error) {
      console.error(error);
      setMessage(cloudErrorMessage(error), true);
      setSyncStatus("error", "云端连接失败，本机收藏不受影响");
    }
  }

  initialize();
})();
