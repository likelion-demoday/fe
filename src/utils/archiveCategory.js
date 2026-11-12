export const ARCHIVE_CATEGORIES = ["전체", "친구관계", "연인관계", "부모자식관계", "일상대화", "갈등대화"];

export const matchesArchiveCategory = (item, category) => {
  if (category === "전체") return true;
  const type = item.relationshipType;
  if (category === "친구관계" && type?.startsWith("FRIEND_")) return true;
  if (category === "연인관계" && type?.startsWith("COUPLE_")) return true;
  if (category === "부모자식관계" && type?.startsWith("PARENT_CHILD_")) return true;
  if (category === "일상대화" && type?.endsWith("_DAILY")) return true;
  if (category === "갈등대화" && type?.endsWith("_CONFLICT")) return true;
  return item.category === category ||
    (category === "부모자식관계" && item.category === "부모 • 자녀관계");
};
