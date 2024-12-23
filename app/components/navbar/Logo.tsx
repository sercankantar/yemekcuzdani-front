'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <div>
  {/* Mobil için görünür logo */}
  <Image
    onClick={() => router.push('/')}
    className="block md:hidden cursor-pointer" 
    src="/images/mobil-logo.png" 
    height="50" // Daha küçük boyut
    width="65"  // Daha küçük boyut
    alt="Logo" 
  />
  {/* Masaüstü için görünür logo */}
  <Image
    onClick={() => router.push('/')}
    className="hidden md:block cursor-pointer" 
    src="/images/logo.png" 
    height="100" 
    width="150" 
    alt="Logo" 
  />
</div>
   );
}
 
export default Logo;
