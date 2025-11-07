export interface CityOption {
  id: string;
  name: string;
}

export interface StationOption {
  id: string;
  cityId: string;
  name: string;
}

export const CITY_OPTIONS: CityOption[] = [
  { id: "tokyo-23", name: "東京都23区" },
  { id: "yokohama", name: "横浜市" },
  { id: "saitama", name: "さいたま市" }
];

export const STATION_OPTIONS: StationOption[] = [
  { id: "shibuya", cityId: "tokyo-23", name: "渋谷駅" },
  { id: "ikebukuro", cityId: "tokyo-23", name: "池袋駅" },
  { id: "yokohama-st", cityId: "yokohama", name: "横浜駅" },
  { id: "kawasaki-st", cityId: "yokohama", name: "川崎駅" },
  { id: "omiya", cityId: "saitama", name: "大宮駅" },
  { id: "urawa", cityId: "saitama", name: "浦和駅" }
];

export const LAYOUT_OPTIONS = [
  { value: "1R", label: "1R/1K" },
  { value: "1LDK", label: "1LDK" },
  { value: "2LDK", label: "2LDK" },
  { value: "3LDK", label: "3LDK" }
];
