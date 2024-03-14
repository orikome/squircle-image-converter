document.addEventListener('DOMContentLoaded', function() {
    const effectSlider = document.getElementById('effectSlider');
    const effectValue = document.getElementById('effectValue');

    effectSlider.addEventListener('input', function() {
        effectValue.textContent = effectSlider.value;
    });

    document.getElementById('drop_zone').addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    document.getElementById('drop_zone').addEventListener('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processImage(files[0], parseInt(effectSlider.value));
        }
    });
});

function processImage(file, effectIntensity) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            createSquirclePath(ctx, canvas.width, canvas.height, effectIntensity, effectIntensity);

            ctx.clip();

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function(blob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'squircle-image.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 'image/png');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function createSquirclePath(ctx, width, height, radius, effectIntensity) {
    const normalizedRadius = Math.min(radius / 100, 1) * Math.min(width, height) / 2;
    const edgeCurveIntensity = effectIntensity / 100;

    const basicRadiusEffect = normalizedRadius * (1 - edgeCurveIntensity);
    
    const squircleEnhancement = normalizedRadius * edgeCurveIntensity;

    ctx.beginPath();
    ctx.moveTo(basicRadiusEffect + squircleEnhancement, 0);
    
    ctx.lineTo(width - (basicRadiusEffect + squircleEnhancement), 0);
    ctx.bezierCurveTo(width, 0, width, 0, width, basicRadiusEffect + squircleEnhancement);
    ctx.lineTo(width, height - (basicRadiusEffect + squircleEnhancement));
    ctx.bezierCurveTo(width, height, width, height, width - (basicRadiusEffect + squircleEnhancement), height);
    ctx.lineTo(basicRadiusEffect + squircleEnhancement, height);
    ctx.bezierCurveTo(0, height, 0, height, 0, height - (basicRadiusEffect + squircleEnhancement));
    ctx.lineTo(0, basicRadiusEffect + squircleEnhancement);
    ctx.bezierCurveTo(0, 0, 0, 0, basicRadiusEffect + squircleEnhancement, 0);
    ctx.closePath();
}