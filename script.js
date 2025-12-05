let qrCodeInstance = null;
let currentAmount = 0;
let logoImageData = null;

window.addEventListener('load', function () {
    const logoImg = document.getElementById('logoImg');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    logoImg.onload = function () {
        tempCanvas.width = logoImg.naturalWidth;
        tempCanvas.height = logoImg.naturalHeight;
        tempCtx.drawImage(logoImg, 0, 0);
        try {
            logoImageData = tempCanvas.toDataURL('image/png');
        } catch (e) {
            console.log('Logo image could not be loaded for download');
        }
    };

    if (logoImg.complete) {
        logoImg.onload();
    }
});

function generateQR() {
    const amount = document.getElementById('amount').value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    currentAmount = amount;
    const upiId = 'createprincemahto-2@okaxis';
    const companyName = 'Quad Shaped';
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(companyName)}&am=${amount}&cu=INR`;

    const qrDiv = document.getElementById('qrcode');
    qrDiv.innerHTML = '';

    qrCodeInstance = new QRCode(qrDiv, {
        text: upiString,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('displayAmount').textContent = amount;
    document.getElementById('qrResult').style.display = 'block';
}

async function downloadQR() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) return;

    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');

    finalCanvas.width = 840;
    finalCanvas.height = 1200;

    const bgGrad = ctx.createLinearGradient(0, 0, 840, 1200);
    bgGrad.addColorStop(0, '#000428');
    bgGrad.addColorStop(1, '#004e92');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 840, 1200);

    const spotlight1 = ctx.createRadialGradient(420, 200, 50, 420, 200, 400);
    spotlight1.addColorStop(0, 'rgba(0, 78, 146, 0.5)');
    spotlight1.addColorStop(0.5, 'rgba(0, 78, 146, 0.2)');
    spotlight1.addColorStop(1, 'rgba(0, 78, 146, 0)');
    ctx.fillStyle = spotlight1;
    ctx.fillRect(0, 0, 840, 600);

    const spotlight2 = ctx.createRadialGradient(420, 1000, 50, 420, 1000, 400);
    spotlight2.addColorStop(0, 'rgba(0, 4, 40, 0.4)');
    spotlight2.addColorStop(0.5, 'rgba(0, 4, 40, 0.15)');
    spotlight2.addColorStop(1, 'rgba(0, 4, 40, 0)');
    ctx.fillStyle = spotlight2;
    ctx.fillRect(0, 600, 840, 600);

    for (let i = 0; i < 40; i++) {
        const x = Math.random() * 840;
        const y = Math.random() * 1200;
        const size = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.6 + 0.2;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        glow.addColorStop(0, `rgba(0, 78, 146, ${opacity})`);
        glow.addColorStop(1, 'rgba(0, 78, 146, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.strokeStyle = 'rgba(0, 78, 146, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 40);
        ctx.lineTo(840, i * 40);
        ctx.stroke();
    }

    for (let i = 0; i < 22; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 40, 0);
        ctx.lineTo(i * 40, 1200);
        ctx.stroke();
    }

    const cornerAccent = (x, y, size, rotation) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.strokeStyle = 'rgba(0, 78, 146, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, -size);
        ctx.stroke();
        ctx.restore();
    };

    cornerAccent(60, 60, 40, 0);
    cornerAccent(780, 60, 40, Math.PI / 2);
    cornerAccent(780, 1140, 40, Math.PI);
    cornerAccent(60, 1140, 40, -Math.PI / 2);

    const logoSize = 120;
    const logoX = (840 - logoSize) / 2;
    const logoY = 140;

    const logoGlow = ctx.createRadialGradient(420, logoY + logoSize / 2, 0, 420, logoY + logoSize / 2, 180);
    logoGlow.addColorStop(0, 'rgba(0, 126, 255, 1)');
    logoGlow.addColorStop(0.3, 'rgba(0, 126, 255, 0.7)');
    logoGlow.addColorStop(0.6, 'rgba(0, 78, 146, 0.5)');
    logoGlow.addColorStop(1, 'rgba(0, 78, 146, 0)');
    ctx.fillStyle = logoGlow;
    ctx.beginPath();
    ctx.arc(420, logoY + logoSize / 2, 180, 0, Math.PI * 2);
    ctx.fill();

    if (logoImageData) {
        const logoImg = new Image();
        logoImg.src = logoImageData;
        await new Promise((resolve) => {
            logoImg.onload = () => {
                ctx.save();
                ctx.shadowColor = 'rgba(0, 126, 255, 1)';
                ctx.shadowBlur = 60;
                ctx.beginPath();
                ctx.arc(420, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                ctx.restore();

                ctx.strokeStyle = 'rgba(0, 126, 255, 1)';
                ctx.lineWidth = 5;
                ctx.shadowColor = 'rgba(0, 126, 255, 1)';
                ctx.shadowBlur = 50;
                ctx.beginPath();
                ctx.arc(420, logoY + logoSize / 2, logoSize / 2 + 8, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 40;
                ctx.beginPath();
                ctx.arc(420, logoY + logoSize / 2, logoSize / 2 + 15, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
                resolve();
            };
            logoImg.onerror = () => resolve();
        });
    } else {
        ctx.fillStyle = 'rgba(0, 78, 146, 0.3)';
        ctx.beginPath();
        ctx.arc(420, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 126, 255, 1)';
        ctx.lineWidth = 5;
        ctx.shadowColor = 'rgba(0, 126, 255, 1)';
        ctx.shadowBlur = 50;
        ctx.beginPath();
        ctx.arc(420, logoY + logoSize / 2, logoSize / 2 + 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(420, logoY + logoSize / 2, logoSize / 2 + 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = '#4a90e2';
    ctx.font = 'bold 52px Poppins, Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(74, 144, 226, 0.9)';
    ctx.shadowBlur = 25;
    ctx.fillText('QUAD SHAPED', 420, 350);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(0, 78, 146, 0.25)';
    ctx.fillRect(220, 375, 400, 2);

    ctx.fillStyle = '#4ec9ff';
    ctx.font = 'bold 62px Poppins, Arial';
    ctx.shadowColor = 'rgba(78, 201, 255, 0.8)';
    ctx.shadowBlur = 28;
    ctx.fillText(`₹ ${currentAmount}`, 420, 445);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(78, 201, 255, 0.35)';
    ctx.font = '600 18px Poppins, Arial';
    ctx.fillText('PAYMENT AMOUNT', 420, 480);

    const qrSize = 280;
    const qrX = (840 - qrSize) / 2;
    const qrY = 540;

    const qrGlow = ctx.createRadialGradient(420, qrY + qrSize / 2, 0, 420, qrY + qrSize / 2, 220);
    qrGlow.addColorStop(0, 'rgba(0, 78, 146, 0.4)');
    qrGlow.addColorStop(0.6, 'rgba(0, 78, 146, 0.15)');
    qrGlow.addColorStop(1, 'rgba(0, 78, 146, 0)');
    ctx.fillStyle = qrGlow;
    ctx.fillRect(qrX - 50, qrY - 50, qrSize + 100, qrSize + 100);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 78, 146, 0.7)';
    ctx.shadowBlur = 45;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX - 25, qrY - 25, qrSize + 50, qrSize + 50, 20);
    ctx.fill();
    ctx.shadowBlur = 0;

    const borderGrad = ctx.createLinearGradient(qrX - 25, qrY - 25, qrX + qrSize + 25, qrY + qrSize + 25);
    borderGrad.addColorStop(0, 'rgba(0, 78, 146, 0.9)');
    borderGrad.addColorStop(0.5, 'rgba(0, 4, 40, 0.9)');
    borderGrad.addColorStop(1, 'rgba(0, 78, 146, 0.9)');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.clip();

    ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);
    ctx.restore();

    ctx.fillStyle = '#d4e4ff';
    ctx.font = 'bold 26px Poppins, Arial';
    ctx.shadowColor = 'rgba(0, 78, 146, 0.7)';
    ctx.shadowBlur = 12;
    ctx.fillText('SCAN TO PAY', 420, 900);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(212, 228, 255, 0.4)';
    ctx.fillRect(310, 915, 220, 1.5);

    ctx.font = '600 20px Poppins, Arial';
    ctx.fillStyle = '#9fb8d9';
    ctx.fillText('createprincemahto-2@okaxis', 420, 950);

    ctx.fillStyle = 'rgba(0, 78, 146, 0.2)';
    ctx.beginPath();
    ctx.roundRect(120, 990, 600, 140, 10);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 78, 146, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#b8c8e6';
    ctx.font = '600 20px Poppins, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAYMENT DETAILS', 420, 1020);

    ctx.font = '400 18px Poppins, Arial';
    ctx.fillStyle = '#8fa3c7';
    ctx.textAlign = 'left';
    ctx.fillText('Recipient:', 150, 1055);
    ctx.fillText('UPI ID:', 150, 1085);
    ctx.fillText('Amount:', 150, 1115);

    ctx.font = '600 18px Poppins, Arial';
    ctx.fillStyle = '#d4e4ff';
    ctx.textAlign = 'right';
    ctx.fillText('Quad Shaped', 690, 1055);
    ctx.fillText('createprincemahto-2@okaxis', 690, 1085);
    ctx.fillText(`₹ ${currentAmount}`, 690, 1115);

    const link = document.createElement('a');
    link.download = `QuadShaped_Payment_${currentAmount}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
}

document.getElementById('amount').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        generateQR();
    }
});