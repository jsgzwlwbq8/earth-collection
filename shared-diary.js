(() => {
  const ENV_KEY = "earth-collection-cloudbase-env";
  const NICKNAME_KEY = "earth-collection-shared-nickname";
  const ROOM_KEY = "earth-collection-shared-room";
  const COLLECTIONS = {
    rooms: "shared_rooms",
    members: "shared_members",
    posts: "shared_posts",
    comments: "shared_comments"
  };

  const $ = (selector) => document.querySelector(selector);
  const ui = {
    open: $("#sharedDiaryBtn"),
    dialog: $("#sharedDiaryDialog"),
    setup: $("#cloudSetupPanel"),
    statusDot: $("#cloudStatusDot"),
    statusText: $("#cloudStatusText"),
    env: $("#cloudEnvInput"),
    connect: $("#connectCloudBtn"),
    profile: $("#sharedProfilePanel"),
    nickname: $("#sharedNicknameInput"),
    roomActions: $("#sharedRoomActions"),
    newRoomName: $("#newRoomNameInput"),
    createRoom: $("#createRoomBtn"),
    joinCode: $("#joinRoomCodeInput"),
    joinRoom: $("#joinRoomBtn"),
    activeRoom: $("#activeSharedRoom"),
    roomName: $("#sharedRoomName"),
    memberText: $("#sharedMemberText"),
    leaveRoom: $("#leaveRoomBtn"),
    inviteCode: $("#sharedInviteCode"),
    copyInvite: $("#copyInviteCodeBtn"),
    postForm: $("#sharedPostForm"),
    photoInput: $("#sharedPhotoInput"),
    photoPicker: $("#sharedPhotoPicker"),
    photoPreview: $("#sharedPhotoPreview"),
    postDate: $("#sharedPostDate"),
    postMood: $("#sharedPostMood"),
    postText: $("#sharedPostText"),
    refresh: $("#refreshSharedFeedBtn"),
    feed: $("#sharedFeed")
  };

  const sharedState = {
    app: null,
    db: null,
    userId: "",
    roomCode: localStorage.getItem(ROOM_KEY) || "",
    room: null,
    photo: "",
    connecting: false
  };

  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function makeId() {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function makeInviteCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return [...bytes].map((value) => alphabet[value % alphabet.length]).join("");
  }

  function nickname() {
    return ui.nickname.value.trim();
  }

  function setStatus(kind, text) {
    ui.statusDot.className = kind;
    ui.statusText.textContent = text;
  }

  function setBusy(button, busy, text) {
    if (!button) return;
    if (!button.dataset.defaultText) button.dataset.defaultText = button.textContent;
    button.disabled = busy;
    button.textContent = busy ? text : button.dataset.defaultText;
  }

  function showMessage(message, type = "") {
    ui.feed.innerHTML = "";
    const paragraph = document.createElement("p");
    paragraph.className = `shared-message ${type}`.trim();
    paragraph.textContent = message;
    ui.feed.appendChild(paragraph);
  }

  function resultData(result) {
    if (result?.error) throw result.error;
    if (result?.code) throw new Error(result.message || result.code);
    return result?.data;
  }

  function oneDocument(result) {
    const data = resultData(result);
    if (Array.isArray(data)) return data[0] || null;
    return data || null;
  }

  async function connectCloud() {
    if (sharedState.connecting) return;
    const envId = ui.env.value.trim();
    if (!envId) {
      setStatus("error", "请先填写CloudBase环境ID");
      return;
    }
    if (typeof cloudbase === "undefined") {
      setStatus("error", "云端组件没有加载，请检查网络后刷新");
      return;
    }
    sharedState.connecting = true;
    setBusy(ui.connect, true, "正在连接…");
    setStatus("loading", "正在连接云端…");
    try {
      sharedState.app = cloudbase.init({ env: envId, region: "ap-shanghai" });
      const auth = sharedState.app.auth;
      let sessionResult = await auth.getSession();
      let sessionData = resultData(sessionResult);
      let user = sessionData?.session?.user;
      if (!user) {
        const loginResult = await auth.signInAnonymously();
        const loginData = resultData(loginResult);
        user = loginData?.user || loginData?.session?.user;
      }
      if (!user?.id) throw new Error("匿名登录没有返回用户ID");
      sharedState.userId = String(user.id);
      sharedState.db = sharedState.app.database();
      localStorage.setItem(ENV_KEY, envId);
      ui.profile.classList.remove("hidden");
      setStatus("online", "云端已连接");
      if (sharedState.roomCode) await enterRoom(sharedState.roomCode, false);
    } catch (error) {
      console.error(error);
      sharedState.app = null;
      sharedState.db = null;
      setStatus("error", cloudErrorMessage(error));
    } finally {
      sharedState.connecting = false;
      setBusy(ui.connect, false);
    }
  }

  function cloudErrorMessage(error) {
    const message = String(error?.message || "");
    if (/domain|来源|permission|denied|unauthorized/i.test(message)) return "连接被拒绝，请检查安全域名和数据库权限";
    if (/collection|not found|不存在/i.test(message)) return "请先在CloudBase创建四个共享数据集合";
    if (/network|fetch|unreachable/i.test(message)) return "网络连接失败，请稍后重试";
    return message ? `连接失败：${message}` : "连接云端失败，请检查环境ID";
  }

  async function ensureMember(roomCode) {
    const memberId = `${roomCode}_${sharedState.userId}`;
    const setResult = await sharedState.db.collection(COLLECTIONS.members).doc(memberId).set({
      roomCode,
      userId: sharedState.userId,
      nickname: nickname(),
      joinedAt: Date.now()
    });
    resultData(setResult);
  }

  async function createRoom() {
    if (!sharedState.db) {
      setStatus("error", "请先连接云端");
      return;
    }
    if (!nickname()) {
      ui.nickname.focus();
      setStatus("error", "请先填写昵称");
      return;
    }
    const roomName = ui.newRoomName.value.trim();
    if (!roomName) {
      ui.newRoomName.focus();
      return;
    }
    setBusy(ui.createRoom, true, "正在创建…");
    try {
      const code = makeInviteCode();
      const result = await sharedState.db.collection(COLLECTIONS.rooms).doc(code).set({
        code,
        name: roomName,
        ownerId: sharedState.userId,
        createdBy: nickname(),
        createdAt: Date.now()
      });
      resultData(result);
      await ensureMember(code);
      ui.newRoomName.value = "";
      await enterRoom(code, false);
    } catch (error) {
      console.error(error);
      setStatus("error", cloudErrorMessage(error));
    } finally {
      setBusy(ui.createRoom, false);
    }
  }

  async function joinRoom() {
    if (!sharedState.db) {
      setStatus("error", "请先连接云端");
      return;
    }
    if (!nickname()) {
      ui.nickname.focus();
      setStatus("error", "请先填写昵称");
      return;
    }
    const code = ui.joinCode.value.trim().toUpperCase();
    if (!code) return;
    setBusy(ui.joinRoom, true, "正在加入…");
    try {
      await enterRoom(code, true);
      ui.joinCode.value = "";
    } catch (error) {
      console.error(error);
      setStatus("error", cloudErrorMessage(error));
    } finally {
      setBusy(ui.joinRoom, false);
    }
  }

  async function enterRoom(code, addMember) {
    if (addMember) await ensureMember(code);
    let room;
    try {
      const result = await sharedState.db.collection(COLLECTIONS.rooms).doc(code).get();
      room = oneDocument(result);
    } catch (error) {
      if (addMember) {
        const memberId = `${code}_${sharedState.userId}`;
        await sharedState.db.collection(COLLECTIONS.members).doc(memberId).remove().catch(() => {});
      }
      throw error;
    }
    if (!room) {
      if (addMember) {
        const memberId = `${code}_${sharedState.userId}`;
        await sharedState.db.collection(COLLECTIONS.members).doc(memberId).remove().catch(() => {});
      }
      throw new Error("没有找到这个邀请码");
    }
    sharedState.roomCode = code;
    sharedState.room = room;
    localStorage.setItem(ROOM_KEY, code);
    ui.roomActions.classList.add("hidden");
    ui.activeRoom.classList.remove("hidden");
    ui.roomName.textContent = room.name || "共享日志";
    ui.inviteCode.textContent = code;
    setStatus("online", `已进入：${room.name || "共享日志"}`);
    await loadSharedFeed();
  }

  function leaveRoom() {
    sharedState.roomCode = "";
    sharedState.room = null;
    localStorage.removeItem(ROOM_KEY);
    ui.activeRoom.classList.add("hidden");
    ui.roomActions.classList.remove("hidden");
    setStatus("online", "云端已连接，可以创建或加入共享日志");
  }

  function compressPhoto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("无法读取照片"));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("无法处理照片"));
        image.onload = () => {
          const scale = Math.min(1, 760 / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", .66);
          if (dataUrl.length > 900000) {
            reject(new Error("照片仍然太大，请换一张照片"));
            return;
          }
          resolve(dataUrl);
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function submitPost(event) {
    event.preventDefault();
    if (!sharedState.db || !sharedState.roomCode) return;
    if (!nickname()) {
      setStatus("error", "请先填写昵称");
      return;
    }
    const submit = ui.postForm.querySelector('button[type="submit"]');
    setBusy(submit, true, "正在发布…");
    try {
      const result = await sharedState.db.collection(COLLECTIONS.posts).add({
        roomCode: sharedState.roomCode,
        userId: sharedState.userId,
        nickname: nickname(),
        photo: sharedState.photo,
        date: ui.postDate.value,
        mood: ui.postMood.value,
        text: ui.postText.value.trim(),
        createdAt: Date.now()
      });
      resultData(result);
      sharedState.photo = "";
      ui.photoInput.value = "";
      ui.photoPreview.src = "";
      ui.photoPreview.classList.add("hidden");
      ui.photoPicker.classList.remove("hidden");
      ui.postText.value = "";
      await loadSharedFeed();
      setStatus("online", "共同回忆已发布");
    } catch (error) {
      console.error(error);
      setStatus("error", cloudErrorMessage(error));
    } finally {
      setBusy(submit, false);
    }
  }

  async function addComment(postId, input, button) {
    const text = input.value.trim();
    if (!text || !sharedState.db) return;
    setBusy(button, true, "发送中…");
    try {
      const result = await sharedState.db.collection(COLLECTIONS.comments).add({
        roomCode: sharedState.roomCode,
        postId,
        userId: sharedState.userId,
        nickname: nickname() || "匿名朋友",
        text,
        createdAt: Date.now()
      });
      resultData(result);
      input.value = "";
      await loadSharedFeed();
    } catch (error) {
      console.error(error);
      setStatus("error", cloudErrorMessage(error));
    } finally {
      setBusy(button, false);
    }
  }

  async function loadSharedFeed() {
    if (!sharedState.db || !sharedState.roomCode) return;
    setBusy(ui.refresh, true, "刷新中…");
    showMessage("正在读取大家的照片和留言…");
    try {
      const [postsResult, commentsResult, membersResult] = await Promise.all([
        sharedState.db.collection(COLLECTIONS.posts).where({ roomCode: sharedState.roomCode }).get(),
        sharedState.db.collection(COLLECTIONS.comments).where({ roomCode: sharedState.roomCode }).get(),
        sharedState.db.collection(COLLECTIONS.members).where({ roomCode: sharedState.roomCode }).get()
      ]);
      const posts = (resultData(postsResult) || []).sort((a, b) => b.createdAt - a.createdAt);
      const comments = (resultData(commentsResult) || []).sort((a, b) => a.createdAt - b.createdAt);
      const members = resultData(membersResult) || [];
      const uniqueMembers = new Set(members.map((member) => member.userId));
      ui.memberText.textContent = `${uniqueMembers.size || 1} 位成员 · ${posts.length} 条共同回忆`;
      renderFeed(posts, comments);
    } catch (error) {
      console.error(error);
      showMessage(cloudErrorMessage(error), "error");
      setStatus("error", cloudErrorMessage(error));
    } finally {
      setBusy(ui.refresh, false);
    }
  }

  function renderFeed(posts, comments) {
    ui.feed.innerHTML = "";
    if (!posts.length) {
      showMessage("这里还没有内容，发布第一张共同回忆吧。");
      return;
    }
    posts.forEach((post) => {
      const article = document.createElement("article");
      article.className = "shared-post-card";
      const author = document.createElement("div");
      author.className = "shared-post-author";
      const avatar = document.createElement("span");
      avatar.textContent = (post.nickname || "友").slice(0, 1);
      const person = document.createElement("span");
      const name = document.createElement("b");
      name.textContent = post.nickname || "匿名朋友";
      const date = document.createElement("small");
      date.textContent = post.date || "";
      person.append(name, date);
      const mood = document.createElement("em");
      mood.textContent = post.mood || "💭";
      author.append(avatar, person, mood);
      article.appendChild(author);
      if (post.photo) {
        const image = document.createElement("img");
        image.className = "shared-post-photo";
        image.src = post.photo;
        image.alt = `${post.nickname || "朋友"}分享的照片`;
        article.appendChild(image);
      }
      const story = document.createElement("p");
      story.className = "shared-post-text";
      story.textContent = post.text || "";
      article.appendChild(story);

      const commentList = document.createElement("div");
      commentList.className = "shared-comment-list";
      comments.filter((comment) => comment.postId === post._id || comment.postId === post.id).forEach((comment) => {
        const line = document.createElement("p");
        const commenter = document.createElement("b");
        commenter.textContent = `${comment.nickname || "朋友"}：`;
        const text = document.createTextNode(comment.text || "");
        line.append(commenter, text);
        commentList.appendChild(line);
      });
      article.appendChild(commentList);

      const commentForm = document.createElement("div");
      commentForm.className = "shared-comment-form";
      const input = document.createElement("input");
      input.maxLength = 120;
      input.placeholder = "给这条回忆留言…";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "发送";
      const postId = post._id || post.id;
      button.addEventListener("click", () => addComment(postId, input, button));
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          addComment(postId, input, button);
        }
      });
      commentForm.append(input, button);
      article.appendChild(commentForm);
      ui.feed.appendChild(article);
    });
  }

  async function copyInvite() {
    const text = `邀请你加入「${sharedState.room?.name || "共享日志"}」\n邀请码：${sharedState.roomCode}`;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("online", "邀请文字已复制");
    } catch {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
      setStatus("online", "邀请文字已复制");
    }
  }

  ui.env.value = localStorage.getItem(ENV_KEY) || "";
  ui.nickname.value = localStorage.getItem(NICKNAME_KEY) || "";
  ui.postDate.value = today();

  ui.open.addEventListener("click", async () => {
    if (!ui.dialog.open) ui.dialog.showModal();
    if (ui.env.value.trim() && !sharedState.db) await connectCloud();
  });
  ui.connect.addEventListener("click", connectCloud);
  ui.nickname.addEventListener("input", () => localStorage.setItem(NICKNAME_KEY, nickname()));
  ui.createRoom.addEventListener("click", createRoom);
  ui.joinRoom.addEventListener("click", joinRoom);
  ui.leaveRoom.addEventListener("click", leaveRoom);
  ui.copyInvite.addEventListener("click", copyInvite);
  ui.refresh.addEventListener("click", loadSharedFeed);
  ui.photoPicker.addEventListener("click", () => ui.photoInput.click());
  ui.photoPreview.addEventListener("click", () => ui.photoInput.click());
  ui.photoInput.addEventListener("change", async () => {
    const file = ui.photoInput.files?.[0];
    if (!file) return;
    try {
      sharedState.photo = await compressPhoto(file);
      ui.photoPreview.src = sharedState.photo;
      ui.photoPreview.classList.remove("hidden");
      ui.photoPicker.classList.add("hidden");
    } catch (error) {
      setStatus("error", error.message);
    }
  });
  ui.postForm.addEventListener("submit", submitPost);
})();
