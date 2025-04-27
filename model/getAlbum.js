
export async function getAlbum(query) {
    try {

      const response = await fetch(`http://192.168.1.11:3000/spotify/Albums?id=${encodeURIComponent(query)}`);
      

      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
  
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch Tracks:", error);
      return null;
    }
  }

