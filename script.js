const start = new Date("2026-04-19T21:00:00");
const end = new Date("2026-04-20T20:00:00");
const isService = false;

const maintenanceDiv = document.getElementById("maintenance");
const timer = document.getElementById("timer");

function updateMaintenance() {
    const now = new Date();

    if (now >= start && now <= end && isService) {
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

async function kopiuj() {
    try {
        const canvas = document.getElementById("canvas");

        canvas.toBlob(async (blob) => {
            if (!blob) {
                alert("Błąd generowania obrazu");
                return;
            }

            await navigator.clipboard.write([
                new ClipboardItem({
                    "image/png": blob
                })
            ]);

            alert("Skopiowano raport do schowka");
        });

    } catch (err) {
        console.error(err);
        alert("Twoja przeglądarka nie obsługuje kopiowania obrazów");
    }
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
    drawing = true;

    const rect = sigCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

    sigCtx.beginPath();
    sigCtx.moveTo(lastX, lastY);
});

sigCanvas.addEventListener("mousemove", (e) => {
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
    drawing = true;

    const rect = sigCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    sigCtx.beginPath();
    sigCtx.moveTo(x, y);
});

sigCanvas.addEventListener("touchmove", (e) => {
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
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
}

function showLoading() {
    document.getElementById("loadingModal").style.display = "flex";
}

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

async function saveSignature() {
    signatureData = sigCanvas.toDataURL("image/png");
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
