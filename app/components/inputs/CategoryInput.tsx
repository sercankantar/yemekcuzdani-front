'use client';
import Image from 'next/image';
interface CategoryBoxProps {
  icon: string,
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon,
  label,
  selected,
  onClick
}) => {
  return ( 
    <div
      onClick={() => onClick(label)}
      className={`
        rounded-xl
        border-2
        p-4
        flex
        flex-col
        gap-3
        hover:border-black
        transition
        cursor-pointer
        ${selected ? 'border-black' : 'border-neutral-200'}
      `}
    >
      <img src={'https://api.yemekcuzdani.com' + icon} alt={label} width={30} height={30} />
      <div className="font-semibold">
        {label}
      </div>
    </div>
   );
}
 
export default CategoryBox;