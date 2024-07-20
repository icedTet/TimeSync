import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import * as jimp from "jimp";
import { Modal } from "../Modal";
// map imagescript types to imagescript
function readFile(file: File) {
  return new Promise(async (resolve) => {
    const perf = performance.now();
    const imgBuffer = Buffer.from(await file.arrayBuffer());

    const img = await jimp.read(imgBuffer);
    //   console.log('jimpread', performance.now()) - perf)
    const width = img.getWidth();
    const height = img.getHeight();
    let changed = false;
    if (height < 512 || width < 512) {
      changed = true;
      // resize image to have both dimensions at least 512
      if (height < 512) {
        const ratio = width / height;
        img.resize(Math.round(512 * ratio), 512);
      } else if (width < 512) {
        const ratio = height / width;
        img.resize(512, Math.round(512 / ratio));
      }
    }
    // // img.resize(512, 512)
    //   console.log('jimpresize', performance.now()) - perf)
    resolve({
      img: changed
        ? await img.getBase64Async(jimp.MIME_PNG)
        : `data:image/png;base64,`.concat(imgBuffer.toString("base64")),
      scaleType: width / height > 1 ? "vertical-cover" : "horizontal-cover",
      width: img.getWidth(),
      height: img.getHeight(),
    });
    // const reader = new FileReader()
    // reader.addEventListener(
    //   'load',
    //   async () => {
    //     if (!reader.result) return
    //   //   console.log(typeof reader.result, { res: reader.result, buf: Buffer.from(reader.result as string)) })
    //     resolve(reader.result as string)

    //     // const image = decode(
    //     //   typeof reader.result === 'string' ? Buffer.from(reader.result as string) : new Uint8Array(reader.result)
    //     // )
    //     // image.resize(512, 512)
    //     // resolve(Buffer.from(await image.encode(4)).toString('base64'))
    //   },
    //   false
    // )
    // reader.readAsDataURL(file)
  }) as Promise<{
    img: string | ArrayBuffer | null;
    scaleType: "vertical-cover" | "horizontal-cover";
    width: number;
    height: number;
  }>;
}
export const UpdateProfileModal = (props: {
  profilePicture?: File | null;
  returnCroppedImage?: (image: string) => void;
  onCancel?: () => void;
}) => {
  const [pfp, setPfp] = useState(null as string | null);
  const [scale, setScale] = useState(
    "" as "vertical-cover" | "horizontal-cover"
  );
  const [newPFP, setNewPFP] = useState(null as string | null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [area, setarea] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [updating, setUpdating] = useState(false);

  const onInteractionComplete = async () => {
    if (!pfp) return;
    const img = await jimp.read(pfp);
    //   console.log(img, area))
    const cropped = await img.crop(area.x, area.y, area.width, area.height);
    const newImg = await img.getBase64Async(jimp.MIME_PNG);
    setNewPFP(newImg);
  };
  useEffect(() => {
    const perf = performance.now();
    // console.log('updateprofilemodal', performance.now()) - perf)
    if (props.profilePicture)
      readFile(props.profilePicture!).then((data) => {
        //   console.log('readFile', performance.now()) - perf)
        setZoom(
          data.width / data.height > 1
            ? data.width / data.height
            : data.height / data.width
        );
        setMinZoom(
          data.width / data.height > 1
            ? data.width / data.height
            : data.height / data.width
        );
        setPfp(data.img as string);
      });
  }, [props.profilePicture]);
  if (!pfp) return null;
  return (
    <Modal visible={!!pfp} onClose={() => props.onCancel?.()} title={""}>
      <div className="flex flex-col items-center justify-center h-auto max-w-full gap-4 p-4">
        <span className={`text-lg font-inter font-semibold w-full`}>
          Crop your profile picture
        </span>
        <span className={`text-xs font-inter w-full`}>
          Scroll or pinch to zoom in and out. Drag to move the image.
        </span>

        <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] w-64 h-64">
          <Cropper
            image={pfp!}
            crop={crop}
            zoom={zoom}
            minZoom={minZoom}
            maxZoom={Math.max(1, minZoom) * 5}
            cropShape="round"
            showGrid={false}
            restrictPosition={true}
            cropSize={{ width: 384, height: 384 }}
            aspect={1 / 1}
            onCropChange={setCrop}
            onCropComplete={(_, pixels) => {
              if (pixels.height === Infinity || pixels.width === Infinity)
                return;
              //   console.log(pixels))
              setarea(pixels);
            }}
            // onInteractionEnd={onInteractionComplete}
            onZoomChange={setZoom}
            objectFit={scale}
          />
        </div>
        <div className="flex flex-row justify-end w-full gap-4">
          <button
            onClick={() => {
              setPfp(null);
              props.onCancel && props.onCancel();
            }}
            className={`px-4 py-2 rounded-xl hover:bg-gray-900 transition-all text-gray-700 hover:text-gray-50`}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!pfp) return;
              setUpdating(true);
              let perf = performance.now();
              const img = await jimp.read(pfp);
              //   console.log('jimpread', performance.now()) - perf)
              perf = performance.now();
              //   console.log(img, area))
              const cropped = await img.crop(
                area.x,
                area.y,
                area.width,
                area.height
              );
              //   console.log('jimpcrop', performance.now()) - perf)
              perf = performance.now();
              await img.resize(512, 512);
              //   console.log('jimpresize', performance.now()) - perf)
              perf = performance.now();
              const newImg = await img.getBase64Async(jimp.MIME_PNG);
              //   console.log('jimpgetbase64', performance.now()) - perf)
              perf = performance.now();
              props.returnCroppedImage?.(newImg);
              setUpdating(false);
              setPfp(null);
            }}
            className={`btn-primary`}
            disabled={updating}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};
