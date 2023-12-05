export const housingMap: Record<string, Record<number, string>> = {
  housingType: { 1: "1-year lease", 2: "Short-term lease" },
  moveIn: { 1: "ASAP", 2: " in < 3 months", 3: "in 3+ months" },
  housemates: {
    1: "1-2 roomies",
    2: "3-5 roomies",
    3: "6-12 roomies",
    4: "12+ roomies",
  },
  roomPrice: {
    1: "Less than $1000",
    2: "$1000 - $1500",
    3: "$1500 - $2000",
    4: "$2000 - $2500",
    5: "$2500 - $3000",
    6: "Over $3000",
  },
  location: {
    1: "Lower Haight",
    2: "Hayes Valley",
    3: "Alamo Square",
    4: "Mission",
    5: "SoMa",
    6: "Pacific Heights",
    7: "NoPa",
    8: "San Francisco - Other",
    9: "Berkeley",
    10: "Oakland",
    11: "East Bay - Other",
    12: "Hillsborough",
    13: "Menlo Park",
    14: "Palo Alto",
    15: "Peninsula - Other",
    16: "South Bay",
    17: "North Bay",
  },
};

// Accepts the number of days since last confirmation, returns derived activity level
export default function deriveActivityLevel(daysSinceConf: number) {
  if (daysSinceConf <= 10) {
    return "high";
  }
  if (daysSinceConf <= 20) {
    return "med";
  } else {
    return "low";
  }
}
