// js/storage.js
export function saveRecentCities(list) {
  localStorage.setItem("recentSearch", JSON.stringify(list));
}

export function loadRecentCities() {
  const data = localStorage.getItem("recentSearch");
  return data ? JSON.parse(data) : [];
}
