import { useState } from "react";

function ImageWithStatus({ src, alt, className, draggable = false }) {
  const [status, setStatus] = useState("loading");

  return (
    <div className={className}>
      {status !== "loaded" && (
        <span role="status" className="absolute inset-0 flex items-center justify-center text-center text-[12px] font-medium text-[#595959]">
          {status === "error" ? "이미지를 불러오지 못했어요" : "로딩중 . . ."}
        </span>
      )}
      <img
        src={src}
        alt={alt}
        draggable={draggable}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`block size-full object-contain ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default function CharacterImage(props) {
  return <ImageWithStatus key={props.src} {...props} />;
}
