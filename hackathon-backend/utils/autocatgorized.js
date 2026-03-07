const categoryMap = {
  Food: ["swiggy", "zomato", "restaurant", "dominos", "pizza"],
  Travel: ["uber", "ola", "rapido", "metro", "bus"],
  Shopping: ["amazon", "flipkart", "myntra"],
  Entertainment: ["netflix", "movie", "game"],
  Stationery: ["pen", "notebook", "stationery", "book"]
};

function autoCategorize(title) {
  const lower = title.toLowerCase();

  for (const category in categoryMap) {
    if (categoryMap[category].some(keyword => lower.includes(keyword))) {
      return category;
    }
  }

  return "Other";
}

module.exports = autoCategorize;