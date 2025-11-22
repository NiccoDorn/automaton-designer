export function captureCanvasRegion(canvas, region, filename = 'automaton-screenshot.png') {
    const { minX, minY, maxX, maxY } = region;
    const width = maxX - minX;
    const height = maxY - minY;

    if (width <= 0 || height <= 0) {
        console.log('Invalid screenshot region');
        return;
    }

    // Create temporary canvas for the cropped region
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the selected region from the main canvas
    tempCtx.drawImage(
        canvas,
        minX, minY, width, height,  // Source rectangle
        0, 0, width, height          // Destination rectangle
    );

    // Convert to blob and download
    tempCanvas.toBlob((blob) => {
        if (!blob) {
            console.error('Failed to create screenshot');
            return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}
