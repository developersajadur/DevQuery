import uploadClient from "@/lib/uploadthing";


export const POST = async (req, res) => {
  try {
    const file = req.body.file;
    const result = await uploadClient.uploadFile(file);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
};
