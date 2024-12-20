'use client';

import qs from 'query-string';
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";

interface CategoryBoxProps {
  icon: string; // icon tipi artık string olacak
  label: string;
  seo_url: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon,
  label,
  seo_url,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    const url = `/kategoriler/${seo_url}`;

    router.push(url);
  }, [seo_url, router]);

  return ( 
    <div
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
        ${selected ? 'border-b-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
      `}
    >
      {/* Icon'u URL olarak kullanıyoruz */}
      <img src={icon} alt={label} className="w-8 h-8 object-cover" />
      <div className="font-medium text-sm">
        {label}
      </div>
    </div>
  );
};

export default CategoryBox;
