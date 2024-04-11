import Image from "next/image";
export default function CustomLoadingElement() {
  return (
    <div className="w-full h-screen flex flex-col gap-4 justify-center place-items-center">
      <Image src="/logo.ico" alt="Your image" width={50} height={50} />
      <span className="text-xl">Đang tải dữ liệu...</span>
    </div>
  );
}
