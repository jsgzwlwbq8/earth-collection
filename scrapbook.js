(() => {
  const $ = (selector) => document.querySelector(selector);
  const elements = {
    button: $("#scrapbookBtn"),
    dialog: $("#scrapbookDialog"),
    title: $("#scrapbookTitleInput"),
    text: $("#scrapbookTextInput"),
    photoInput: $("#scrapbookPhotoInput"),
    photoButton: $("#scrapbookPhotoBtn"),
    photoList: $("#scrapbookPhotoList"),
    cutout: $("#scrapbookCutoutInput"),
    generate: $("#generateScrapbookBtn"),
    working: $("#scrapbookWorking"),
    canvas: $("#scrapbookCanvas"),
    download: $("#downloadScrapbookBtn"),
    share: $("#shareScrapbookBtn")
  };
  if (!elements.button || !elements.canvas) return;

  const ctx = elements.canvas.getContext("2d");
  let photos = [];
  let generated = false;

  function setStatus(message = "", busy = false) {
    elements.working.textContent = message;
    elements.working.classList.toggle("hidden", !message);
    elements.generate.disabled = busy;
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("有一张照片无法读取"));
      image.src = source;
    });
  }

  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ source: reader.result, name: file.name || "旅行照片" });
      reader.onerror = () => reject(new Error("照片读取失败"));
      reader.readAsDataURL(file);
    });
  }

  function snapshotEntries() {
    try {
      return window.EarthCollectionApp?.getSnapshot?.().entries || [];
    } catch {
      return [];
    }
  }

  function travelCopy(entries) {
    const countries = [...new Set(entries.map((entry) => entry.countryName).filter(Boolean))];
    const cities = [...new Set(entries.map((entry) => entry.cityName).filter(Boolean))];
    const moods = entries.map((entry) => String(entry.mood || "").split(" ")[0]).filter(Boolean);
    const placeText = cities.length ? cities.slice(0, 4).join("、") : "远方";
    const moodText = moods.length ? [...new Set(moods)].slice(0, 3).join("") : "✨";
    const title = countries.length === 1
      ? `${countries[0]}旅行手帐`
      : cities.length ? `${cities[0]}出发的旅行` : "我的旅行手帐";
    const text = `把脚步留在${placeText}，把风景和心情装进口袋。${moodText} 每一次出发，都让世界变得更近，也让回忆有了可以反复翻阅的形状。`;
    return { title, text };
  }

  function loadCollectionPhotos() {
    const entries = snapshotEntries()
      .filter((entry) => entry.photo)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 8);
    photos = entries.map((entry) => ({
      source: entry.photo,
      name: entry.placeName || entry.cityName || "收藏照片"
    }));
    const copy = travelCopy(entries);
    if (!elements.title.value.trim()) elements.title.value = copy.title;
    if (!elements.text.value.trim()) elements.text.value = copy.text;
  }

  function renderPhotos() {
    elements.photoList.innerHTML = "";
    photos.forEach((photo, index) => {
      const card = document.createElement("div");
      card.className = "scrapbook-photo-card";
      const image = document.createElement("img");
      image.src = photo.source;
      image.alt = photo.name;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `移除第 ${index + 1} 张照片`);
      remove.addEventListener("click", () => {
        photos.splice(index, 1);
        generated = false;
        renderPhotos();
      });
      card.append(image, remove);
      elements.photoList.appendChild(card);
    });
  }

  function drawCover(context, image, x, y, width, height) {
    const scale = Math.max(width / image.width, height / image.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (image.width - sourceWidth) / 2;
    const sourceY = (image.height - sourceHeight) / 2;
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function wrapText(context, text, maxWidth) {
    const characters = [...String(text || "")];
    const lines = [];
    let line = "";
    characters.forEach((character) => {
      const test = line + character;
      if (line && context.measureText(test).width > maxWidth) {
        lines.push(line);
        line = character;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function borderSamples(data, width, height) {
    const samples = [];
    const step = Math.max(1, Math.floor(Math.min(width, height) / 28));
    for (let x = 0; x < width; x += step) {
      samples.push((x * 4), ((height - 1) * width + x) * 4);
    }
    for (let y = 0; y < height; y += step) {
      samples.push((y * width) * 4, (y * width + width - 1) * 4);
    }
    return samples.map((offset) => [data[offset], data[offset + 1], data[offset + 2]]);
  }

  async function removeSimpleBackground(source) {
    const image = await loadImage(source);
    const scale = Math.min(1, 460 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const samples = borderSamples(data, canvas.width, canvas.height);
    const average = samples.reduce((sum, color) => sum.map((value, index) => value + color[index]), [0, 0, 0])
      .map((value) => value / samples.length);
    const variance = samples.reduce((sum, color) => {
      return sum + color.reduce((part, value, index) => part + (value - average[index]) ** 2, 0);
    }, 0) / samples.length;
    if (variance > 6200) return null;

    const pixelCount = canvas.width * canvas.height;
    const visited = new Uint8Array(pixelCount);
    const queue = new Int32Array(pixelCount);
    let head = 0;
    let tail = 0;
    const enqueue = (index) => {
      if (!visited[index]) {
        visited[index] = 1;
        queue[tail++] = index;
      }
    };
    for (let x = 0; x < canvas.width; x += 1) {
      enqueue(x);
      enqueue((canvas.height - 1) * canvas.width + x);
    }
    for (let y = 0; y < canvas.height; y += 1) {
      enqueue(y * canvas.width);
      enqueue(y * canvas.width + canvas.width - 1);
    }
    const threshold = Math.max(52, Math.min(88, 58 + Math.sqrt(variance) * .22));
    while (head < tail) {
      const index = queue[head++];
      const offset = index * 4;
      const distance = Math.sqrt(
        (data[offset] - average[0]) ** 2 +
        (data[offset + 1] - average[1]) ** 2 +
        (data[offset + 2] - average[2]) ** 2
      );
      if (distance > threshold) continue;
      data[offset + 3] = distance > threshold * .72 ? Math.round(255 * (distance / threshold - .72) / .28) : 0;
      const x = index % canvas.width;
      const y = Math.floor(index / canvas.width);
      if (x > 0) enqueue(index - 1);
      if (x + 1 < canvas.width) enqueue(index + 1);
      if (y > 0) enqueue(index - canvas.width);
      if (y + 1 < canvas.height) enqueue(index + canvas.width);
    }
    context.putImageData(imageData, 0, 0);
    return canvas;
  }

  function drawPaper() {
    ctx.fillStyle = "#f4edda";
    ctx.fillRect(0, 0, 900, 1200);
    ctx.strokeStyle = "rgba(92,72,54,.07)";
    ctx.lineWidth = 1;
    for (let y = 38; y < 1200; y += 38) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(900, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(65,115,112,.08)";
    for (let y = 24; y < 1200; y += 52) {
      for (let x = 24; x < 900; x += 52) ctx.fillRect(x, y, 2, 2);
    }
    ctx.fillStyle = "#315e5a";
    ctx.fillRect(0, 0, 17, 1200);
    ctx.fillStyle = "#e6a36b";
    ctx.fillRect(17, 0, 7, 1200);
  }

  function drawPhotoCard(image, x, y, width, height, angle) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(angle);
    ctx.shadowColor = "rgba(48,36,27,.25)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = "#fffaf0";
    roundedRect(ctx, -width / 2 - 11, -height / 2 - 11, width + 22, height + 50, 8);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.save();
    roundedRect(ctx, -width / 2, -height / 2, width, height, 3);
    ctx.clip();
    drawCover(ctx, image, -width / 2, -height / 2, width, height);
    ctx.restore();
    ctx.restore();
  }

  function drawDecorations() {
    ctx.save();
    ctx.strokeStyle = "#cc765c";
    ctx.lineWidth = 5;
    ctx.setLineDash([12, 13]);
    ctx.beginPath();
    ctx.moveTo(95, 1040);
    ctx.bezierCurveTo(310, 930, 500, 1120, 790, 970);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "44px system-ui";
    ctx.fillText("✈", 755, 982);
    ctx.font = "34px system-ui";
    ctx.fillText("📍", 78, 1055);
    ctx.restore();
  }

  async function generate() {
    if (!photos.length) {
      setStatus("请先选择照片，或先在地球上添加带照片的收藏。");
      return;
    }
    setStatus("正在本地抠图和排版，请稍候…", true);
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 30)));
    try {
      const images = await Promise.all(photos.slice(0, 8).map((photo) => loadImage(photo.source)));
      let cutout = null;
      if (elements.cutout.checked) cutout = await removeSimpleBackground(photos[0].source);
      drawPaper();

      ctx.fillStyle = "#263f3d";
      ctx.font = '700 58px Georgia, "Songti SC", serif';
      ctx.fillText(elements.title.value.trim() || "我的旅行手帐", 70, 105, 750);
      ctx.fillStyle = "#bf7257";
      ctx.font = '700 15px system-ui, "PingFang SC"';
      ctx.letterSpacing = "4px";
      ctx.fillText("TRAVEL NOTES · COLLECT THE WORLD", 74, 143);
      ctx.letterSpacing = "0px";

      const layouts = [
        [70, 205, 330, 240, -.055],
        [470, 185, 340, 255, .045],
        [85, 520, 285, 220, .04],
        [520, 530, 285, 220, -.045],
        [90, 815, 295, 210, -.025],
        [500, 810, 305, 210, .035]
      ];
      images.slice(cutout ? 1 : 0, (cutout ? 1 : 0) + layouts.length).forEach((image, index) => {
        drawPhotoCard(image, ...layouts[index]);
      });

      if (cutout) {
        const maxWidth = 385;
        const maxHeight = 410;
        const scale = Math.min(maxWidth / cutout.width, maxHeight / cutout.height);
        const width = cutout.width * scale;
        const height = cutout.height * scale;
        ctx.save();
        ctx.shadowColor = "rgba(34,31,25,.35)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 13;
        ctx.drawImage(cutout, 450 - width / 2, 470 - height / 2, width, height);
        ctx.restore();
      }

      ctx.save();
      ctx.fillStyle = "rgba(255,246,211,.88)";
      ctx.translate(450, 770);
      ctx.rotate(-.018);
      roundedRect(ctx, -360, -63, 720, 126, 8);
      ctx.fill();
      ctx.fillStyle = "#4b4b42";
      ctx.font = '23px "Kaiti SC", "Songti SC", serif';
      const lines = wrapText(ctx, elements.text.value.trim() || travelCopy([]).text, 660).slice(0, 3);
      lines.forEach((line, index) => ctx.fillText(line, -330, -25 + index * 34));
      ctx.restore();

      ctx.fillStyle = "rgba(230,163,107,.72)";
      ctx.save();
      ctx.translate(194, 188);
      ctx.rotate(-.16);
      ctx.fillRect(-55, -14, 110, 28);
      ctx.restore();
      ctx.save();
      ctx.translate(707, 502);
      ctx.rotate(.14);
      ctx.fillRect(-50, -13, 100, 26);
      ctx.restore();
      drawDecorations();

      ctx.fillStyle = "#566e6a";
      ctx.font = '16px system-ui, "PingFang SC"';
      const date = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
      ctx.fillText(`EARTH COLLECTION · ${date}`, 70, 1150);
      generated = true;
      setStatus(cutout ? "手帐已生成，第一张照片已尝试自动抠图。" : "手帐已生成；复杂背景已保留原图。");
    } catch (error) {
      console.error(error);
      setStatus(error.message || "生成失败，请换一张照片再试。");
    } finally {
      elements.generate.disabled = false;
    }
  }

  function canvasBlob() {
    return new Promise((resolve) => elements.canvas.toBlob(resolve, "image/jpeg", .94));
  }

  async function download() {
    if (!generated) await generate();
    if (!generated) return;
    const blob = await canvasBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${elements.title.value.trim() || "旅行手帐"}.jpg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function share() {
    if (!generated) await generate();
    if (!generated) return;
    const blob = await canvasBlob();
    const file = new File([blob], "旅行手帐.jpg", { type: "image/jpeg" });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({ title: elements.title.value || "旅行手帐", text: "这是我的地球收藏夹旅行手帐", files: [file] });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    await download();
    setStatus("当前浏览器不支持直接分享，已改为保存图片。");
  }

  function drawEmptyPreview() {
    drawPaper();
    ctx.fillStyle = "#315e5a";
    ctx.textAlign = "center";
    ctx.font = '700 54px Georgia, "Songti SC", serif';
    ctx.fillText("旅行手帐", 450, 500);
    ctx.font = "80px system-ui";
    ctx.fillText("📒 ✈️ 📍", 450, 625);
    ctx.fillStyle = "#82796c";
    ctx.font = '22px system-ui, "PingFang SC"';
    ctx.fillText("选择照片后，点击“自动生成旅行手帐”", 450, 700);
    ctx.textAlign = "start";
  }

  elements.button.addEventListener("click", () => {
    if (!photos.length) loadCollectionPhotos();
    renderPhotos();
    if (!generated) drawEmptyPreview();
    if (!elements.dialog.open) elements.dialog.showModal();
  });
  elements.photoButton.addEventListener("click", () => elements.photoInput.click());
  elements.photoInput.addEventListener("change", async () => {
    try {
      const selected = await Promise.all([...elements.photoInput.files].slice(0, 8 - photos.length).map(readPhoto));
      photos.push(...selected);
      generated = false;
      renderPhotos();
      setStatus(photos.length >= 8 ? "已选满 8 张照片。" : `已选择 ${photos.length} 张照片。`);
    } catch (error) {
      setStatus(error.message);
    }
    elements.photoInput.value = "";
  });
  elements.generate.addEventListener("click", generate);
  elements.download.addEventListener("click", download);
  elements.share.addEventListener("click", share);
  elements.title.addEventListener("input", () => { generated = false; });
  elements.text.addEventListener("input", () => { generated = false; });
  elements.cutout.addEventListener("change", () => { generated = false; });
  drawEmptyPreview();
})();
