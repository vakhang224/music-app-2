async function getAlbum(query) {
    try {
      const response = await fetch(`http://192.168.170.1:3000/spotify/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch album:", error);
      return null;
    }
  }
