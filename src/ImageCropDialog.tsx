import React, { useState, ChangeEvent } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import "./App.css";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import FlipIcon from '@mui/icons-material/Flip';

interface AspectRatio {
  value: number;
  text: string;
}

interface ImageCropDialogProps {
  id: number;
  imageUrl: string | null;
  cropInit: { x: number; y: number };
  zoomInit: number;
  aspectInit: AspectRatio;
  onCancel: () => void;
  setCroppedImageFor: (
    id: number,
    crop: { x: number; y: number },
    zoom: number,
    aspect: AspectRatio,
    croppedImageUrl: string
  ) => void;
  resetImage: (id: number) => void;
}

const aspectRatios: AspectRatio[] = [
  { value: 4 / 3, text: "4/3" },
  { value: 16 / 9, text: "16/9" },
  { value: 1 / 2, text: "1/2" },
];

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  id,
  imageUrl,
  cropInit,
  zoomInit,
  aspectInit,
  onCancel,
  setCroppedImageFor,
  resetImage,
}) => {
  let zoom = zoomInit != null ? zoomInit : 1;
  let crop = cropInit != null ? cropInit : { x: 0, y: 0 };
  let aspect = aspectInit != null ? aspectInit : aspectRatios[0];

  const [zoomState, setZoom] = useState(zoom);
  const [cropState, setCrop] = useState(crop);
  const [aspectState, setAspect] = useState(aspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onRotateChange = (value: string | number) => {
    setRotation(Number(value));
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onAspectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseFloat(e.target.value);
    const ratio = aspectRatios.find((ratio) => ratio.value === value);
    if (ratio) {
      setAspect(ratio);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    const croppedImageUrl = await getCroppedImg(
      imageUrl!,
      croppedAreaPixels,
      rotation,
      flip
    );
    setCroppedImageFor(id, cropState, zoomState, aspectState, croppedImageUrl);
  };

  const onFlipHorizontal = () => {
    setFlip((prevFlip) => ({ ...prevFlip, horizontal: !prevFlip.horizontal }));
    setRotation((prevRotation) => prevRotation + 180);
  };

  const onFlipVertical = () => {
    setFlip({ ...flip, vertical: !flip.vertical });
    setRotation((prevRotation) => prevRotation + 90);
  };

  const onRotateLeft = () => {
    setRotation((prevRotation) => prevRotation - 90);
  };

  return (
    <div className="image-crop-dialog-container">
      <div className="backdrop">
        <div className="backdrop-content">
        <button className="buttonTop" onClick={onRotateLeft} style={{ backgroundColor: "#ebebeb" }}>
          <RotateLeftIcon /> Rotate Left
        </button>
        <button className="buttonTop" onClick={onFlipHorizontal} style={{ backgroundColor: "#ebebeb" }}>
          <FlipIcon style={{ transform: "rotate(90deg)" }} /> Flip Horizontal
        </button>
        <button className="buttonTop" onClick={onFlipVertical} style={{ backgroundColor: "#ebebeb" }}>
          <FlipIcon /> Flip Vertical
        </button>
        </div>
      </div>
      <div className="head_cc">
        <div className="crop-container">
          <Cropper
            image={imageUrl!}
            zoom={zoomState}
            crop={cropState}
            aspect={aspectState.value}
            rotation={rotation}
            flip={flip}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            {...(flip.horizontal && { flipHorizontal: true })}
            {...(flip.vertical && { flipVertical: true })}
          />
        </div>
      </div>
      <div className="controls">
        <div className="controls-upper-area">
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={rotation}
            onInput={(e) => {
              onRotateChange(e.currentTarget.value);
            }}
            className="slider"
          />
        </div>
        <div className="button-area">
          <button onClick={onCancel} className="discard-button" style={{ backgroundColor: "#FFB020", marginRight: "15%" }}>
            Cancel upload
          </button>
          <button onClick={onCrop} className="submit-logo-button" style={{ backgroundColor: "#51baa2", marginLeft: "15%" }}>
            Submit logo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropDialog;
