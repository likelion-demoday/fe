import pill from "../../../assets/icons/google-pill.svg";
import mask from "../../../assets/icons/google-mask.svg";
import colorWheel from "../../../assets/icons/google-g.png";
import group0 from "../../../assets/icons/google-group0.svg";
import group1 from "../../../assets/icons/google-group1.svg";
import group2 from "../../../assets/icons/google-group2.svg";
import group3 from "../../../assets/icons/google-group3.svg";
import group4 from "../../../assets/icons/google-group4.svg";
import group5 from "../../../assets/icons/google-group5.svg";

// Figma의 마스크 구조를 그대로 옮긴 값들 (40x40 컨테이너 기준)
const MASK_STYLE = {
  maskImage: `url(${mask})`,
  maskRepeat: "no-repeat",
  maskSize: "19.573px 20px",
  WebkitMaskImage: `url(${mask})`,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "19.573px 20px",
};

const LAYERS = [
  { src: colorWheel, inset: "17.27% 17.51% 18.3% 18.15%", maskPosition: "2.741px 3.093px", innerInset: "0 0 0 0" },
  { src: group0, inset: "38.57% 34.66% 37.36% 34.91%", maskPosition: "-3.964px -5.427px", innerInset: "-6.22% -7.94%" },
  { src: group1, inset: "37.8% -1.98% 46.73% 64.79%", maskPosition: "-15.915px -5.122px", innerInset: "-32.33% -13.44%" },
  { src: group2, inset: "34.6% 18.29% 53.51% 44.66%", maskPosition: "-7.866px -3.842px", innerInset: "-42.05% -13.5%" },
  { src: group3, inset: "26.37% 7.62% 61.74% 55.34%", maskPosition: "-12.134px -0.549px", innerInset: "-42.05% -13.5%" },
  { src: group4, inset: "41.92% 17.53% 42.53% 39.94%", maskPosition: "-5.976px -6.768px", innerInset: "-32.16% -11.76%" },
  { src: group5, inset: "24.39% 24.23% 54.29% 50.15%", maskPosition: "-10.061px 0.244px", innerInset: "-8.82% -9.96%" },
];

const GoogleIcon = ({ className = "size-[40px]" }) => {
  return (
    <div className={`relative shrink-0 overflow-clip ${className}`}>
      <img src={pill} alt="" className="absolute inset-0 block size-full max-w-none" />
      {LAYERS.map(({ src, inset, maskPosition, innerInset }) => (
        <div
          key={src}
          className="absolute"
          style={{ inset, ...MASK_STYLE, maskPosition, WebkitMaskPosition: maskPosition }}
        >
          <div className="absolute" style={{ inset: innerInset }}>
            <img src={src} alt="" className="block size-full max-w-none" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoogleIcon;
