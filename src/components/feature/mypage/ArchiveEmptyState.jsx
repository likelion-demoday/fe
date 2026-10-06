import emptyCharacter from "../../../assets/images/record-end-character.png";

const ArchiveEmptyState = ({ message, className = "" }) => (
  <div
    role="status"
    className={`flex flex-col items-center gap-[10px] ${className}`}
  >
    <p className="text-heading w-full text-center text-[#454545]">{message}</p>
    <div className="relative size-[136px] overflow-hidden">
      <img
        src={emptyCharacter}
        alt=""
        className="absolute -top-[4.41%] -left-[4.41%] size-[108.82%] max-w-none"
      />
    </div>
  </div>
);

export default ArchiveEmptyState;
