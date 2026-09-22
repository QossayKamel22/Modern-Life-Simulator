import type { PropertyListing } from "@/types/game";

// Curated, hand-verified Unsplash photos (real photography, stable CDN links,
// checked to actually match the property type — free-tag services like
// LoremFlickr/Unsplash-Source returned unrelated or dead images in testing).
const TYPE_PHOTOS: Record<PropertyListing["type"], string[]> = {
  studio: ["1522708323590-d24dbb6b0267"],
  apartment: ["1580216643062-cf460548a66a", "1493809842364-78817add7ffb"],
  townhouse: ["1568605114967-8130f3a36994", "1600047509807-ba8f99d2cdde"],
  villa: [
    "1512917774080-9991f1c4c750",
    "1600596542815-ffad4c1539a9",
    "1580587771525-78b9dba3b914",
    "1613977257363-707ba9348227",
    "1512918728675-ed5a9ecdebfd",
  ],
  commercial: ["1497366216548-37526070297c", "1524230572899-a752b3835840"],
  land: ["1500382017468-9049fed747ef", "1587582423116-ec07293f0395"],
};

function hashToInt(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getPropertyImageUrl(listing: PropertyListing, width = 800, height = 600): string {
  const options = TYPE_PHOTOS[listing.type];
  const photoId = options[hashToInt(listing.id) % options.length];
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=70`;
}
