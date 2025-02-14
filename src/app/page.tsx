"use client"
import dynamic from "next/dynamic";
const FaceDetectionCamera = dynamic(() => import("./components/face-detection-camera"), { ssr: false });

export default function Home() {
  return (
    <div className= "mx-auto relative">
      <section className="sticky flex items-center gap-2 top-0 z-[10] bg-grey py-4 px-2 md:px-3">
        <div className="border-[2px] border-white h-[30px] w-[30px]">
          <div className="border-[2px] border-red h-[16px] w-[16px]" />
        </div>
        <h3 className="font-bold text-[24px]"> Stay<span className="text-red">Inside </span></h3>
      </section>
      <div className=" min-h-[calc(100vh-130px)] md:min-h-[calc(100vh-80px)] relative">
       <FaceDetectionCamera />
      </div>
    </div>
  );
}
