// src/api/psgc.js
const PSGC_API = "https://psgc.cloud/api";

export async function getRegions() {
  const res = await fetch(`${PSGC_API}/regions`);
  return res.json();
}

export async function getProvinces(regionCode) {
  const res = await fetch(`${PSGC_API}/regions/${regionCode}/provinces`);
  return res.json();
}

export async function getCitiesMunicipalities(provinceCode) {
  const res = await fetch(`${PSGC_API}/provinces/${provinceCode}/cities-municipalities`);
  return res.json();
}

export async function getBarangays(cityMunicipalityCode) {
  const res = await fetch(`${PSGC_API}/cities-municipalities/${cityMunicipalityCode}/barangays`);
  return res.json();
}