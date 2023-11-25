import React, { useState, ChangeEvent } from "react";
import ImageCropDialog from "./ImageCropDialog";

interface Item {
  id: number;
  imageUrl: string | null;
  croppedImageUrl: string | null;
  crop: { x: number; y: number }; 
  zoom: number;
  aspect: any;
}

const initData: Item[] = [
  {
    id: 1,
    imageUrl: null,
    croppedImageUrl: null,
    crop: { x: 0, y: 0 }, 
    zoom: 1,
    aspect: { value: 4 / 3, text: "4/3" }, 
  },
];


function App() {
  const [items, setItems] = useState<Item[]>(initData);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const onCancel = () => {
    setSelectedItem(null);
  };

  const handleImageChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const newItemsList = [...items];
    const itemIndex = items.findIndex((x) => x.id === id);
    const item = items[itemIndex];

    if (e.target.files && e.target.files.length > 0) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      const newItem = { ...item, imageUrl, croppedImageUrl: null };
      newItemsList[itemIndex] = newItem;
      setItems(newItemsList);
    }
  };

  const setCroppedImageFor = (
    id: number,
    crop: any,
    zoom: any,
    aspect: any,
    croppedImageUrl: string
  ) => {
    const newItemsList = [...items];
    const itemIndex = items.findIndex((x) => x.id === id);
    const item = items[itemIndex];
    const newItem = { ...item, croppedImageUrl, crop, zoom, aspect };
    newItemsList[itemIndex] = newItem;
    setItems(newItemsList);
    setSelectedItem(null);
  };

  const resetImage = (id: number) => {
    const newItemsList = [...items];
    const itemIndex = items.findIndex((x) => x.id === id);
    const item = items[itemIndex];
    const newItem = { ...item, imageUrl: null, croppedImageUrl: null };
    newItemsList[itemIndex] = newItem;
    setItems(newItemsList);
  };

  return (
    <div>
      {selectedItem ? (
        <ImageCropDialog
          id={selectedItem.id}
          imageUrl={selectedItem.imageUrl}
          cropInit={selectedItem.crop}
          zoomInit={selectedItem.zoom}
          aspectInit={selectedItem.aspect}
          onCancel={onCancel}
          setCroppedImageFor={setCroppedImageFor}
          resetImage={resetImage}
        />
      ) : null}
      {items.map((item) => (
        <div className="imageCard" key={item.id}>
          {item.imageUrl ? (
            <img
              src={item.croppedImageUrl ? item.croppedImageUrl : item.imageUrl}
              alt=""
              onClick={() => setSelectedItem(item)}
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(item.id, e)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
