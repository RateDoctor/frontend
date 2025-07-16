import female from "../imgs/female.svg";
import man from "../imgs/man-ezgif.com-gif-maker.svg";
import defaultAvatar from "../imgs/defaultAvatar.jpg";

export const getAvatar = (gender, image) => {
  if (image) return image;
  if (gender === "female" || gender === "woman") return female;
  if (gender === "male" || gender === "man") return man;
  return defaultAvatar;
};
