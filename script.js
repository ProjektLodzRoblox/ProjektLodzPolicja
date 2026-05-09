const changelog = [
    {
        version: "0.0.1",
        date: "28.04.2026",
        isNew: false,
        changes: {
            added: ["Dodano opcje ręcznego oraz urposzczonego podpisu", "Dodano dziennik zmian", "Dodano przycisk od wczytania ostatniego swojego podpisu",],
            fixed: ["Brak"],
            changed: ["Poprawiono lekko style przycisków"]
        }
    },
        {
        version: "0.0.2",
        date: "09.05.2026",
        isNew: true,
        changes: {
            added: ["Dodano ukrytą opcję 👀", "Dodano lekki efekt wciskania przycisku", "Dodano auto zapis pól po wyjściu z strony", "Dodano animacje pojawiania się elementów strony"],
            fixed: ["Brak"],
            changed: ["Poprawiono lekko tło", "Poprawiono pasek przewijania strony na własny"]
        }
    }
];
const start = new Date("2026-04-26T00:00:00");
const end = new Date("2026-04-27T20:00:00");

const maintenanceDiv = document.getElementById("maintenance");
const timer = document.getElementById("timer");

function updateMaintenance() {
    const now = new Date();

    if (now >= start && now <= end) {
        maintenanceDiv.style.display = "flex";

        const diff = end - now;

        const h = Math.floor(diff / 1000 / 60 / 60);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        timer.innerText = `${h}h ${m}m ${s}s`;

    } else {
        maintenanceDiv.style.display = "none";
        //alert("Informuję że w dniu 16.04.2026r. strona będzie niedostępna od 00:00 do 20:00 spowodowane jest to pracami nad ulepszeniem strony, prosmy ręcznie wypisywać raporty! Przepraszam za problem ale będzie mocna przebudowa :)");
    }
}

setInterval(updateMaintenance, 1000);
updateMaintenance();

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateMaintenance();
});

function wrap(text, width) {
    let result = [];
    text = text || "";

    while (text.length > width) {
        result.push(text.substring(0, width));
        text = text.substring(width);
    }
    result.push(text);
    return result;
}

function linia(label, value, width = 42) {
    let lines = wrap(value, width);
    let out = [];

    lines.forEach((line, i) => {
        if (i === 0) {
            let txt = (label + line).padEnd(width);
            out.push(`│ ${txt} │`);
        } else {
            let txt = line.padEnd(width);
            out.push(`│ ${txt} │`);
        }
    });

    return out.join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();
});

async function startRaport() {
    openSignature();
}

let canvasReady = false;


async function generujCanvas() {
    return new Promise((resolve) => {

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        canvas.style.display = "";

        const width = 900;
        const height = 560;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#0b1220";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#111827";
        roundRect(ctx, 20, 20, width - 40, 70, 12, true);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 26px Segoe UI";
        ctx.fillText("🚔 RAPORT SŁUŻBY", 40, 65);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "14px Segoe UI";
        ctx.fillText(new Date().toLocaleDateString("pl-PL"), width - 150, 65);

        drawSection("FUNKCJONARIUSZ", 20, 110, 420, [
            ["Nick", nick.value],
            ["Stopień", stopien.value],
            ["Nr odznaki", odznaka.value],
            ["Partner", partner.value]
        ]);

        drawSection("UŻYCIE", 460, 110, 420, [
            ["Radio", radio.value],
            ["Taser", taser.value],
            ["Broń palna", bron.value],
            ["Kajdanki", kajdanki.value]
        ]);

        drawSection("SZCZEGÓŁY", 20, 280, 860, [
            ["Powód tasera", powodTaser.value],
            ["Powód broni", powodBron.value],
            ["Powód kajdanek", powodKajdanki.value]
        ]);

        drawSection("PODSUMOWANIE", 20, 400, 860, [
            ["Godziny", godziny.value],
            ["Zatrzymani", zatrzymani.value],
            ["Dowód (w postaci ss)", dowod.value],
            ["Uwagi", uwagi.value]
        ]);

        function drawSection(title, x, y, w, fields) {
            ctx.fillStyle = "#111827";
            roundRect(ctx, x, y, w, 140, 10, true);

            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 14px Segoe UI";
            ctx.fillText(title, x + 15, y + 25);

            ctx.fillStyle = "#1f2937";
            ctx.fillRect(x + 15, y + 35, w - 30, 1);

            let offsetY = y + 60;

            fields.forEach(f => {
                ctx.fillStyle = "#9ca3af";
                ctx.font = "12px Segoe UI";
                ctx.fillText(f[0], x + 15, offsetY);

                ctx.fillStyle = "#e5e7eb";
                ctx.font = "12px Consolas";
                ctx.fillText(f[1] || "-", x + 150, offsetY);

                offsetY += 25;
            });
        }

        if (signatureData) {
            const img = new Image();

            img.onload = () => {
                const boxWidth = 200;
                const boxHeight = 60;

                const x = width - boxWidth - 40;
                const y = height - boxHeight - 25;

                ctx.fillStyle = "#9ca3af";
                ctx.font = "12px Segoe UI";

                const text = "Podpisano:";
                const textWidth = ctx.measureText(text).width;

                ctx.fillText(text, x + (boxWidth - textWidth) / 2, y);

                ctx.strokeStyle = "#9ca3af";
                ctx.beginPath();
                ctx.moveTo(x, y + 8);
                ctx.lineTo(x + boxWidth, y + 8);
                ctx.stroke();

                ctx.drawImage(img, x, y + 12, boxWidth, boxHeight);

                ctx.save();

                const offsetX = (Math.random() * 20) - 10;
                const offsetY = (Math.random() * 20) - 10;
                const randomRot = (-0.25 + Math.random() * 0.5);

                const centerX = x - 5 + offsetX;
                const centerY = y + 15 + offsetY;

                const radius = 45;

                ctx.translate(centerX, centerY);
                ctx.rotate(randomRot);

                ctx.strokeStyle = "rgba(180,0,0,0.85)";
                ctx.fillStyle = "rgba(180,0,0,0.85)";
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
                ctx.stroke();

                function textOnArc(text, r, startAngle, spacing = 0.06) {
                    ctx.save();
                    ctx.rotate(startAngle - (text.length * spacing) / 2);

                    for (let i = 0; i < text.length; i++) {
                        ctx.save();
                        ctx.rotate(i * spacing);
                        ctx.translate(0, -r);
                        ctx.fillText(text[i], 0, 0);
                        ctx.restore();
                    }

                    ctx.restore();
                }

                ctx.font = "bold 8px Arial";
                textOnArc("KOMENDA POWIATOWA POLICJI W ŁODZI", radius - 8, -Math.PI / 2);

                textOnArc("POLICJA", radius - 8, Math.PI / 2);

                ctx.textAlign = "center";

                ctx.font = "bold 11px Arial";
                ctx.fillText(stopien.value || "STOPIEŃ", 0, -3);

                ctx.font = "10px Arial";
                ctx.fillText(nick.value || "NICK", 0, 10);

                ctx.font = "9px Arial";
                ctx.fillText("NR " + (odznaka.value || "00000"), 0, 22);

                ctx.restore();

                canvasReady = true;
                resolve();
            };

            img.src = signatureData;

        } else {
            canvasReady = true;
            resolve();
        }
    });
}

function roundRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fill();
}

let signatureData = null;
let drawing = false;

const sigCanvas = document.getElementById("signatureCanvas");
const sigCtx = sigCanvas.getContext("2d");

sigCtx.lineWidth = 2;
sigCtx.lineCap = "round";
sigCtx.lineJoin = "round";
sigCtx.strokeStyle = "white";

let lastX = 0;
let lastY = 0;

sigCanvas.addEventListener("mousedown", (e) => {
    if (signatureMode !== "draw") return;

    drawing = true;

    const rect = sigCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

    sigCtx.beginPath();
    sigCtx.moveTo(lastX, lastY);
});

sigCanvas.addEventListener("mousemove", (e) => {
    if (signatureMode !== "draw") return;
    if (!drawing) return;

    const rect = sigCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sigCtx.lineTo(x, y);
    sigCtx.stroke();
});

sigCanvas.addEventListener("mouseup", () => {
    drawing = false;
    sigCtx.beginPath();
});

sigCanvas.addEventListener("mouseleave", () => {
    drawing = false;
    sigCtx.beginPath();
});

sigCanvas.addEventListener("touchstart", (e) => {
    if (signatureMode !== "draw") return;

    drawing = true;

    const rect = sigCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    sigCtx.beginPath();
    sigCtx.moveTo(x, y);
});

sigCanvas.addEventListener("touchmove", (e) => {
    if (signatureMode !== "draw") return;
    if (!drawing) return;

    e.preventDefault();

    const rect = sigCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    sigCtx.lineTo(x, y);
    sigCtx.stroke();
});

sigCanvas.addEventListener("touchend", () => {
    drawing = false;
    sigCtx.beginPath();
});

function clearSignature() {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
}

function openSignature() {
    document.getElementById("signatureModal").style.display = "flex";
    updateLoadButton();
    if (signatureMode === "text") {
        generateTextSignature();
    }
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
}

function openChangelog() {
    document.getElementById("changelogModal").classList.add("show");
}

function closeChangelog() {
    document.getElementById("changelogModal").classList.remove("show");
}

function showLoading() {
    document.getElementById("loadingModal").style.display = "flex";
}

function loadVersion(v) {
    document.getElementById("versionTitle").innerText = "Wersja " + v;

    const content = document.getElementById("versionContent");

    content.classList.remove("show");

    setTimeout(() => {
        content.innerText = changelog[v] || "Brak danych";
        content.classList.add("show");
    }, 100);

    document.querySelectorAll(".versionItem").forEach(el => {
        el.classList.remove("active");
        if (el.innerText.includes(v)) {
            el.classList.add("active");
        }
    });
}

function renderChangelog() {
    const list = document.getElementById("versionList");
    const content = document.getElementById("versionContent");

    list.innerHTML = "";

    const sorted = [...changelog].sort((a, b) =>
        b.version.localeCompare(a.version, undefined, { numeric: true })
    );

    sorted.forEach((v, i) => {
        const item = document.createElement("div");
        item.classList.add("versionItem");

        item.innerHTML = `
            <div class="versionTop">
                <div>
                    <div class="version">v${v.version}</div>
                    <div class="versionDate">${v.date}</div>
                </div>
                ${v.isNew ? `<span class="badgeNew">NOWE</span>` : ``}
            </div>
        `;

        item.onclick = () => {
            localStorage.setItem("seenVersion", sorted[0].version);
            updateChangelogDot();

            document.querySelectorAll(".versionItem").forEach(el => {
                el.classList.remove("active");
            });

            item.classList.add("active");

            content.innerHTML = `
                <div class="changelogContent">
                    <div class="changelogHeader">
                        <div class="ver">v${v.version}</div>
                        <div class="date">${v.date}</div>
                    </div>

                   ${renderGroup("Dodano", v.changes.added, "added")}
${renderGroup("Zmieniono", v.changes.changed, "changed")}
${renderGroup("Naprawiono", v.changes.fixed, "fixed")}
                </div>
            `;
        };

        list.appendChild(item);

        if (i === 0) item.click();
    });
}

function renderGroup(title, arr, type) {
    if (!arr || arr.length === 0) return "";

    const icons = {
        added: "+",
        changed: "↻",
        fixed: "✓"
    };

    return `
    <div class="group ${type}">
        <div class="groupTitle">
            <span class="icon">${icons[type]}</span> ${title}
        </div>
        ${arr.map(c => `<div class="change">${c}</div>`).join("")}
    </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    renderChangelog();
    updateChangelogDot();
});

const latestVersion = changelog[0].version;
const seenVersion = localStorage.getItem("seenVersion");

const dot = document.getElementById("newDot");

function updateChangelogDot() {
    const latestVersion = changelog[0].version;
    const seenVersion = localStorage.getItem("seenVersion");

    const dot = document.getElementById("newDot");
    if (!dot) return;

    dot.style.display = (seenVersion !== latestVersion) ? "block" : "none";
}

updateChangelogDot();

function hideLoading() {
    document.getElementById("loadingModal").style.display = "none";
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setLoadingState(type, text) {
    const icon = document.getElementById("loadingIcon");
    const txt = document.querySelector(".loadingText");

    txt.innerText = text;

    if (type === "loading") {
        icon.className = "spinner";
        icon.innerHTML = "";
    }

    if (type === "success") {
        icon.className = "successIcon";
        icon.innerHTML = "✔";
    }

    if (type === "error") {
        icon.className = "successIcon";
        icon.style.color = "#ef4444";
        icon.innerHTML = "✖";
    }
}

function updateLoadButton() {
    const saved = localStorage.getItem("savedSignature");
    const btn = document.getElementById("loadSignatureBtn");

    if (saved) {
        btn.style.display = "inline-block";
    } else {
        btn.style.display = "none";
    }
}

function loadSavedSignature() {
    const saved = localStorage.getItem("savedSignature");

    if (!saved) {
        alert("Brak zapisanego podpisu");
        return;
    }

    const img = new Image();

    img.onload = () => {
        sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
        sigCtx.drawImage(img, 0, 0, sigCanvas.width, sigCanvas.height);
    };

    img.src = saved;
}

let signatureMode = "draw";

function syncSignatureUI() {
    const saved = localStorage.getItem("savedSignature");

    const clearBtn = document.querySelector('button[onclick="clearSignature()"]');
    const loadBtn = document.getElementById("loadSignatureBtn");

    const isDraw = signatureMode === "draw";

    if (clearBtn) clearBtn.style.display = isDraw ? "inline-block" : "none";
    if (loadBtn) loadBtn.style.display = (saved && isDraw) ? "inline-block" : "none";
}

function setSignatureMode(mode, el) {

    if (mode === "text" && !nick.value.trim()) {
        alert("Najpierw proszę o wpisanie swojego nicku.");
        return;
    }

    signatureMode = mode;

    document.querySelectorAll(".sigTab").forEach(t => t.classList.remove("active"));
    el.classList.add("active");

    sigCanvas.style.opacity = "0";

    setTimeout(() => {
        if (mode === "draw") {
            clearSignature();
        } else {
            generateTextSignature();
        }

        sigCanvas.style.opacity = "1";
    }, 150);

    const title = document.getElementById("signatureTitle");

    if (mode === "draw") {
        title.innerText = "Proszę się podpisać (Parafka lub Imię i Nazwisko)";
    } else {
        title.innerText = "Podpis zostanie wygenerowany z Twojego nicku";
    }

    syncSignatureUI();
}

document.fonts.load("42px Pacifico");

async function generateTextSignature() {
    const text = document.getElementById("nick").value || "Podpis";

    await document.fonts.load("42px Pacifico");

    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);

    sigCtx.fillStyle = "white";
    sigCtx.font = "42px 'Pacifico', cursive";

    sigCtx.textAlign = "center";
    sigCtx.textBaseline = "middle";

    sigCtx.fillText(text, sigCanvas.width / 2, sigCanvas.height / 2);
}

document.getElementById("nick").addEventListener("input", () => {
    if (signatureMode === "text") {
        generateTextSignature();
    }
});

async function saveSignature() {
    signatureData = sigCanvas.toDataURL("image/png");
    localStorage.setItem("savedSignature", signatureData);
    updateLoadButton();
    document.getElementById("signatureModal").style.display = "none";

    showLoading();
    setLoadingState("loading", "Trwa generowanie raportu...");

    const startTime = Date.now();

    await generujCanvas();

    const elapsed = Date.now() - startTime;
    const minTime = 1500;

    if (elapsed < minTime) {
        await delay(minTime - elapsed);
    }

    const canvas = document.getElementById("canvas");

    canvas.toBlob(async (blob) => {

        if (!blob) {
            setLoadingState("error", "Błąd generowania");
            setTimeout(hideLoading, 1500);
            return;
        }

        try {
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]);

            setLoadingState("success", "Skopiowano do schowka!");

        } catch {
            setLoadingState("error", "Clipboard nie działa");
        }

        setTimeout(hideLoading, 1500);
    });
}

let corners = [];
const target = ["TL", "BR", "BL", "TR"];
const margin = 50;

document.addEventListener("click", (e) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let clicked = null;

    if (e.clientX < margin && e.clientY < margin) clicked = "TL";
    else if (e.clientX > w - margin && e.clientY < margin) clicked = "TR";
    else if (e.clientX < margin && e.clientY > h - margin) clicked = "BL";
    else if (e.clientX > w - margin && e.clientY > h - margin) clicked = "BR";

    if (!clicked) return;

    corners.push(clicked);

    for (let i = 0; i < corners.length; i++) {
        if (corners[i] !== target[i]) {
            corners = [];
            return;
        }
    }

    if (corners.length === target.length) {
        alert("Brawo odkryłeś easter egg!");
        document.body.style.transform = "rotate(2deg)";
        corners = [];
    }
});

document.querySelectorAll("input").forEach(input => {
    input.value = localStorage.getItem(input.id) || "";

    input.addEventListener("input", () => {
        localStorage.setItem(input.id, input.value);
    });
});

document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", e => {
        const ripple = document.createElement("span");
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.transform = "scale(0)";
        ripple.style.background = "rgba(255,255,255,0.4)";
        ripple.style.width = ripple.style.height = "100px";
        ripple.style.left = e.offsetX - 50 + "px";
        ripple.style.top = e.offsetY - 50 + "px";
        ripple.style.animation = "ripple 0.6s linear";
        ripple.style.pointerEvents = "none";

        btn.style.position = "relative";
        btn.style.overflow = "hidden";
        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = 1;
            e.target.style.transform = "translateY(0)";
        }
    });
});

document.querySelectorAll(".grid input").forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(10px)";
    el.style.transition = "0.4s";

    observer.observe(el);
});

document.addEventListener("DOMContentLoaded", () => {

    const cmd = document.getElementById("cmdPalette");
    const input = document.getElementById("cmdInput");
    const list = document.getElementById("cmdList");

    const actions = [
        {
            name: "🌀 Chaos mode",
            tag: "fun",
            run: () => {
                setInterval(() => {
                    document.body.style.transform = `
                rotate(${Math.random() * 6 - 3}deg)
                scale(${1 + Math.random() * 0.03})
            `;
                }, 120);
            }
        },

        {
            name: "🔄 Flip ekran",
            tag: "fun",
            run: () => {
                document.body.style.transition = "1s";
                document.body.style.transform = "rotate(180deg)";
            }
        },

        {
            name: "🙃 Mirror mode",
            tag: "fun",
            run: () => {
                document.body.style.transform = "scaleX(-1)";
            }
        },

        {
            name: "💊 Matrix mode",
            tag: "fun",
            run: () => {
                document.body.style.background = "black";

                const rain = document.createElement("div");
                rain.style = `
            position:fixed;
            inset:0;
            color:#00ff00;
            font-family:monospace;
            font-size:14px;
            pointer-events:none;
            z-index:9999;
            white-space:pre;
        `;

                setInterval(() => {
                    rain.innerText += Math.random() > 0.5 ? "1" : "0";

                    if (rain.innerText.length > 5000) {
                        rain.innerText = "";
                    }
                }, 5);

                document.body.appendChild(rain);
            }
        },

        {
            name: "🐟 Fish mode",
            tag: "fun",
            run: () => {
                const fish = document.createElement("div");

                fish.innerText = "🐟";
                fish.style = `
            position:fixed;
            left:-100px;
            top:50%;
            font-size:80px;
            z-index:9999;
            transition:12s linear;
        `;

                document.body.appendChild(fish);

                setTimeout(() => {
                    fish.style.left = "120%";
                }, 100);
            }
        },

        {
            name: "🧱 DVD logo",
            tag: "fun",
            run: () => {

                const dvd = document.createElement("div");

                dvd.innerText = "DVD";
                dvd.style = `
            position:fixed;
            left:100px;
            top:100px;
            font-size:40px;
            font-weight:bold;
            color:white;
            z-index:9999;
        `;

                document.body.appendChild(dvd);

                let x = 100;
                let y = 100;
                let dx = 4;
                let dy = 4;

                setInterval(() => {

                    x += dx;
                    y += dy;

                    if (x <= 0 || x >= window.innerWidth - 100) dx *= -1;
                    if (y <= 0 || y >= window.innerHeight - 50) dy *= -1;

                    dvd.style.left = x + "px";
                    dvd.style.top = y + "px";

                }, 16);
            }
        },

        {
            name: "🔥 Podpal stronę",
            tag: "chaos",
            run: () => {

                for (let i = 0; i < 40; i++) {

                    const fire = document.createElement("div");

                    fire.innerText = "🔥";
                    fire.style = `
                position:fixed;
                left:${Math.random() * 100}%;
                bottom:-50px;
                font-size:${40 + Math.random() * 60}px;
                animation:fireFly 5s linear infinite;
                pointer-events:none;
            `;

                    document.body.appendChild(fire);
                }

                const style = document.createElement("style");

                style.innerHTML = `
        @keyframes fireFly{
            from{
                transform:translateY(0);
                opacity:1;
            }
            to{
                transform:translateY(-120vh);
                opacity:0;
            }
        }`;

                document.head.appendChild(style);
            }
        },

        {
            name: "🫨 Trzęsienie strony",
            tag: "chaos",
            run: () => {
                setInterval(() => {
                    document.body.style.transform =
                        `translate(${Math.random() * 20 - 10}px,${Math.random() * 20 - 10}px)`;
                }, 40);
            }
        },

        {
            name: "🐸 Deszcz żab",
            tag: "fun",
            run: () => {

                setInterval(() => {

                    const frog = document.createElement("div");

                    frog.innerText = "🐸";

                    frog.style = `
                position:fixed;
                left:${Math.random() * 100}%;
                top:-50px;
                font-size:50px;
                transition:4s linear;
                z-index:9999;
            `;

                    document.body.appendChild(frog);

                    setTimeout(() => {
                        frog.style.top = "120%";
                    }, 50);

                    setTimeout(() => frog.remove(), 5000);

                }, 200);
            }
        },

        {
            name: "📺 VHS mode",
            tag: "fun",
            run: () => {
                document.body.style.filter = `
            contrast(1.2)
            saturate(0.8)
            blur(0.3px)
        `;

                setInterval(() => {
                    document.body.style.transform =
                        `translateY(${Math.random() * 4 - 2}px)`;
                }, 50);
            }
        },

        {
            name: "🎲 Demo mode",
            tag: "demo",
            run: () => {

                const random = arr => arr[Math.floor(Math.random() * arr.length)];

                const data = {
                    nick: ["Kacper", "Mati", "Neo", "Kubix", "Szymix", "Marhub", "Matix"],
                    stopien: ["Sierżant", "Aspirant", "Komisarz", "Posterunkowy"],
                    odznaka: () => Math.floor(10000 + Math.random() * 90000),
                    partner: ["Brak", "Olek", "Seba", "Kris", "Dawid"],

                    radio: ["TAK", "NIE"],
                    taser: ["0", "1", "2"],
                    bron: ["0", "1"],
                    kajdanki: ["1", "2", "3"],

                    powodTaser: [
                        "Agresywny obywatel",
                        "Stawianie oporu",
                        "Pościg pieszy",
                        "Nie wykonywał poleceń"
                    ],

                    powodBron: [
                        "Oddano strzał ostrzegawczy",
                        "Zagrożenie życia",
                        "Podejrzany posiadał broń",
                        "Brak użycia"
                    ],

                    powodKajdanki: [
                        "Zatrzymanie obywatela",
                        "Zakłócanie porządku",
                        "Pościg zakończony sukcesem"
                    ],

                    godziny: [
                        "2h 15min",
                        "5h 40min",
                        "8h 10min"
                    ],

                    zatrzymani: [
                        "2 osoby",
                        "5 osób",
                        "1 osoba",
                        "0 osób"
                    ],

                    dowod: [
                        "imgur.com/abc123",
                        "streamable.com/test",
                        "medal.tv/clip123"
                    ],

                    uwagi: [
                        "Spokojna służba",
                        "Dużo zgłoszeń",
                        "Pościg zakończony sukcesem",
                        "Obywatel próbował ucieczki"
                    ]
                };

                Object.keys(data).forEach(id => {

                    const el = document.getElementById(id);

                    if (!el) return;

                    const value =
                        typeof data[id] === "function"
                            ? data[id]()
                            : random(data[id]);

                    el.value = value;

                    localStorage.setItem(id, value);

                    el.dispatchEvent(new Event("input"));
                });

                // fancy typing effect
                document.querySelectorAll("input").forEach((input, i) => {

                    input.style.transition = "0.2s";
                    input.style.transform = "scale(1.03)";
                    input.style.boxShadow = "0 0 15px rgba(56,189,248,.6)";

                    setTimeout(() => {
                        input.style.transform = "scale(1)";
                        input.style.boxShadow = "none";
                    }, 300 + i * 20);
                });

            }
        }
    ];

    function render(filter = "") {
        list.innerHTML = "";

        actions
            .filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach((a, i) => {
                const div = document.createElement("div");
                div.className = "cmdItem";

                let text = "";
                let idx = 0;

                const type = setInterval(() => {
                    text += a.name[idx];
                    div.innerText = text;
                    idx++;

                    if (idx >= a.name.length) clearInterval(type);
                }, 10);

                div.onclick = () => {
                    a.run();
                    hideCmd();
                };

                list.appendChild(div);
            });
    }

    function showCmd() {
        cmd.classList.remove("hidden");
        input.value = "";
        render();
        input.focus();
    }

    function hideCmd() {
        cmd.classList.add("hidden");
    }

    input.addEventListener("input", () => render(input.value));

    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key.toLowerCase() === "k") {
            e.preventDefault();
            showCmd();
        }

        if (e.key === "Escape") {
            hideCmd();
        }

        if (e.key === "Enter" && !cmd.classList.contains("hidden")) {
            const first = document.querySelector(".cmdItem");
            if (first) first.click();
        }

        if (e.key === "Tab") {
            e.preventDefault();

            const items = document.querySelectorAll(".cmdItem");
            if (items.length > 0) {
                items[0].click();
            }
        }
    });

});
