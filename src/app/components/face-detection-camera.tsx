"use client"
import { useRef, useEffect, useState } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`);
import '@tensorflow-models/face-detection';
import "@mediapipe/face_mesh"
import classNames from "classnames";
import { Camera } from "react-camera-pro";
import { FacingMode } from "react-camera-pro/dist/components/Camera/types";



const FaceDetectionCamera = () => {
  const cameraRef = useRef<any>(null);
  const [facingMode, setFacingMode] = useState("user")
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [ timer, setTimer] = useState(3);
  const [faceDetected, setFaceDetected] = useState(false);
  const [takeScreenshot, setTakeScreenshot] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false)
  const [numberOfCameras, setNumberOfCameras] = useState(0);

  const runFaceDetection = async () => {
    const model = facemesh.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "tfjs",
    };
    const detector = await facemesh.createDetector(model, detectorConfig as  facemesh.MediaPipeFaceMeshTfjsModelConfig);

    await setInterval(() => {
      detect(detector);
    }, 100);

  };

  const detect = async (detector) => {
    if (
      typeof window!== "undefined" &&
      typeof cameraRef.current !== "undefined" &&
      cameraRef.current !== null
    ) {
      
      const video = document.getElementById("video") as HTMLVideoElement;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;
    
      if(videoWidth && videoHeight) {
        const face = await detector?.estimateFaces(video);
        if (face.length) {
          setFaceDetected(true)
        } else {
          setFaceDetected(false)
        } 
      }
    }
  };

  useEffect(() => {
    runFaceDetection()
  },[])

  const onRetake = () => {
    setImgSrc(null)
  }

  const switchCamera = () => {
    if(cameraRef.current) {
      cameraRef.current.switchCamera();
      setFacingMode( prev => prev === "user" ? "environment" : "user")
    }
  }

  const capture = () => {
    if(cameraRef.current) {
      const imageSrc = cameraRef.current.takePhoto();
      setTakeScreenshot(false);
      setImgSrc(imageSrc);
      setTimer(3);
    }
  };
  
  useEffect(() => {
    if ( faceDetected && !imgSrc) {
      setTimeout(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          setTakeScreenshot(true);
        }
      }, 1000);
    }

    if (!faceDetected) {
      setTimer(3);
    }
  }, [faceDetected, timer, imgSrc]);

  useEffect(() => {
    if (takeScreenshot) {
      capture();
    }
  }, [takeScreenshot]);

  return (
    <>
      {cameraAvailable && 
        <div className="w-full absolute top-0 z-10 flex py-1 bg-[rgba(0,0,0,0.5)] backdrop-blur px-4 md:px-8">
          <div className="flex h-[56px] items-center justify-center w-full z-10 text-sm">
            <div className={classNames("text-center", faceDetected ? "text-[#36B043]" : "text-red", imgSrc && "hidden")}>
               {faceDetected ? "Face visible" : "No face found"}
               {faceDetected  &&
               <p> Taking picture in {timer} </p>
               }
            </div>
          </div>
        </div>
      }
      {imgSrc === null ?
        <div> 
          <Camera
            ref={cameraRef} 
            facingMode={facingMode as FacingMode}
            numberOfCamerasCallback={setNumberOfCameras} 
            errorMessages={{
              noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
              permissionDenied: 'Permission denied. Please refresh and give camera permission.',
              switchCamera:
                'It is not possible to switch camera to different one because there is only one video device accessible.',
              canvas: 'Canvas is not supported.'
            }}
            videoReadyCallback={() => setCameraAvailable(true)}
          />
        </div>
      : 
        <div className="relative ">
          <img 
            src={imgSrc} 
            alt="preview-picture"
            width={"100%"} 
            height={"100%"}
          />
        </div>
      }
      <div className="w-full absolute bottom-0 flex py-1 bg-[rgba(0,0,0,0.5)] backdrop-blur px-4 md:px-8">
        {imgSrc ?
          <div className="flex h-[56px] items-center justify-between w-full z-10">
            <div className=" w-[56px] h-[56px]" />
            <a href={imgSrc}  download='picture.jpeg'> 
              <button 
                className="w-[56px] h-[56px] border-white border-[8px] bg-white rounded-full "
              >
                <img src={`/download-icon.svg`} />
              </button>
            </a>
            <button 
              className="w-[40px] h-[40px] "
              onClick={onRetake}
            >
              <img src={`/retake-icon.svg`} />
            </button>
          </div>
        : 
          <div className="flex h-[56px] items-center justify-between w-full z-10">
            <div className=" w-[56px] h-[56px]" />
              <button 
                className="z-10 w-[56px] h-[56px] bg-[rgba(227,73,28,0.8)] hover:bg-[rgba(227,73,28,1)]  border-[8px] border-[rgba(255,255,255.5)] rounded-full"
                onClick={capture}
              />
            {numberOfCameras > 1 ?
              <button className="w-[46px] h-[46px]" onClick={switchCamera} >
                <img src={`/switch-camera-icon.svg`} />
              </button>
            :  
              <div className=" w-[56px] h-[56px]" />
            }
          </div> 
        }
      </div>
    </>
  )
}

export default FaceDetectionCamera;
