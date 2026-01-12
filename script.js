async function handleDownload() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const btn = document.getElementById('downloadBtn');
    const resultDiv = document.getElementById('result');

    if (!videoUrl) {
        alert("Please paste a link first!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Processing...";
    resultDiv.innerHTML = "Fetching video link...";

    try {
        // Method: Direct Download Link Service
        const apiUrl = `https://api.fabdl.com/instagram/get-video-info?url=${encodeURIComponent(videoUrl)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result && data.result.download_url) {
            resultDiv.innerHTML = `
                <div style="background: #e8f0fe; padding: 15px; border-radius: 8px;">
                    <a href="${data.result.download_url}" target="_blank" style="display:inline-block; background:#28a745; color:white; padding:12px 25px; text-decoration:none; border-radius:8px; font-weight:bold;">Download Now</a>
                </div>`;
        } else {
            // Agar pehli API fail ho, toh backup Cobalt par jaye
            const backupResponse = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: videoUrl, vQuality: '720' })
            });
            const backupData = await backupResponse.json();
            
            if (backupData.url) {
                resultDiv.innerHTML = `<a href="${backupData.url}" target="_blank" style="display:inline-block; background:#28a745; color:white; padding:12px 25px; text-decoration:none; border-radius:8px;">Download Video</a>`;
            } else {
                resultDiv.innerHTML = "<p style='color:red;'>Link Not Supported. Please try another link.</p>";
            }
        }
    } catch (error) {
        resultDiv.innerHTML = "<p style='color:red;'>Server busy. Please try again in 1 minute.</p>";
    } finally {
        btn.disabled = false;
        btn.innerText = "Generate Link";
    }
            }
