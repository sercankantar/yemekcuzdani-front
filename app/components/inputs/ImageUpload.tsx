'use client';
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from 'react-icons/tb'

declare global {
  var cloudinary: any
}

const uploadPreset = "pgc9ehd5";

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.files);
  }, [onChange]);

  return (
    <div
      className="
        relative
        cursor-pointer
        hover:opacity-70
        transition
        border-dashed 
        border-2 
        p-20 
        border-neutral-300
        flex
        flex-col
        justify-center
        items-center
        gap-4
        text-neutral-600
      "
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={async (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append('file', files[i]);
            }
            const response = await fetch(`https://api.yemekcuzdani.com/api/v1/file-upload/upload`, {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();
            onChange(data.files);
            handleUpload(data);
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <TbPhotoPlus size={50} />
      <div className="font-semibold text-lg">
        Resim yüklemek için tıklayın
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {value && value.map((filePath, index) => (
          <div key={index} className="relative w-32 h-32">
            <Image
              layout="fill"
              style={{ objectFit: 'cover' }}
              src={'https://api.yemekcuzdani.com' + filePath}
              alt={`Image ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUpload;