import { axios } from "../config";

export const uploadFile = async (uri: string): Promise<string> => {
  const formData = new FormData();
  
  // Extract file name and type from URI
  const filename = uri.split("/").pop() || "image.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpg`;

  console.log("[Storage API] Starting upload for:", filename);

  formData.append("file", {
    uri,
    name: filename,
    type,
  } as any);

  try {
    const { data } = await axios.post<string>("/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data) => data,
    });

    console.log("[Storage API] Upload success, URL:", data);
    return data;
  } catch (error) {
    console.error("[Storage API] Upload failed:", error);
    throw error;
  }
};
