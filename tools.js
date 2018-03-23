module.exports = {
  findEmoji: (icon, client) => {
    return findEmoji(icon, client);
  }
};

const findEmoji = (icon, client) => {
  if (icon.startsWith("[id]")) {
    const iconId = icon.substr(4, icon.length);
    const emoji = client.emojis.find("id", iconId);
    if (!emoji) {
      console.log("Emoji not found");
    }
    return emoji;
  }
  if (icon.startsWith(":")) {
    const iconName = icon.substr(1, icon.length - 2);
    const emoji = client.emojis.find("name", iconName);
    if (!emoji) {
      console.log("Emoji not found");
    }
    return emoji;
  }
  return icon;
};
