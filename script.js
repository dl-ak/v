// HTML elements ko select karna
const downloadBtn = document.querySelector('#downloadBtn');
const inputField = document.querySelector('#videoUrl');
const resultDiv = document.querySelector('#result');

downloadBtn.addEventListener('click', async () => {
    const reelUrl = inputField.value.trim();

    // 1. Validating Input
    if (!reelUrl || !reelUrl.includes('instagram.com')) {
        alert("Please paste a valid Instagram Reel link!");
        return;
    }

    // 2. Loading State
    downloadBtn.innerText = "Processing...";
    downloadBtn.disabled = true;
    resultDiv.innerHTML = "Fetching video details...";

    // 3. API Configuration (Using your Key and Host)
    // Hum '/post_info' use kar rahe hain reel ka data nikalne ke liye
    const apiUrl = `https://instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com/post_info?url=${encodeURIComponent(reelUrl)}`;
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '296ebfd70cmshdb3ed8562b069ddp128294jsncb7c7c57a4df',
            'x-rapidapi-host': 'instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        
        // Agar response 403 hai toh matlab subscription activate nahi hai
        if (response.status === 403) {
            resultDiv.innerHTML = "<p style='color:red;'>Error: API Key invalid hai ya subscribe nahi kiya.</p>";
            return;
        }

        const data = await response.json();
        console.log("API Result:", data); // Isse Spck Console mein check karein

        // 4. Video Link Nikalna
        // Is API ka data structure check karke link nikalna
        let videoLink = "";
        if (data.data && data.data.video_url) {
            videoLink = data.data.video_url;
        } else if (data.video_url) {
            videoLink = data.video_url;
        }

        // 5. Success Message aur Download Button
        if (videoLink) {
            resultDiv.innerHTML = `
                <div style="margin-top:20px; text-align:center;">
                    <p style="color:green; font-weight:bold;">Video Found!</p>
                    <a href="${videoLink}" target="_blank" 
                       style="display:inline-block; background:#E1306C; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">
                       DOWNLOAD NOW
                    </a>
                </div>`;
        } else {
            resultDiv.innerHTML = "<p style='color:red;'>Error: Video link nahi mila. Check karein ki post public hai.</p>";
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        resultDiv.innerHTML = "<p style='color:red;'>Server Error! Connection check karein.</p>";
    } finally {
        downloadBtn.innerText = "Download Now";
        downloadBtn.disabled = false;
    }
});