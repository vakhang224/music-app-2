
export async function getAlbum(query) {
    try {
      const response = await fetch(`http://192.168.138.244:3000/spotify/search?q=${encodeURIComponent(query)}`);
      // const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}`)

      console.log("Nó đây nè", response.status)
      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
  
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch album:", error);
      return null;
    }
  }
