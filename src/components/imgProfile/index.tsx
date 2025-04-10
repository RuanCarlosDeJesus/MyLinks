import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function ImgProfile() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      alert("Selecione uma imagem antes de enviar!");
      return;
    }

    setUploading(true);
    const storage = getStorage();
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);

    try {
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);

      await setDoc(doc(db, "users", user.uid), { profilePic: downloadURL }, { merge: true });

      alert("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
        Escolher Foto
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </label>

      {imagePreview && (
        <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
      )}

      <button onClick={uploadImage} className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={uploading}>
        {uploading ? "Cadastrando..." : "Cadastrar Foto"}
      </button>
    </div>
  );
}
