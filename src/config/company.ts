/**
 * Firmenkonfiguration für OpenCarBox & Carvantooo
 * Zentrale Unternehmensdaten gemäß österreichischem Recht
 *
 * Carvantooo = Shop/Teile (rot #E53E3E)
 * OpenCarBox Werkstatt = Service (blau #3182CE)
 * OpenCarBox Autohandel = Fahrzeuge (blau #3182CE)
 */
export const companyConfig = {
  // Markenname für den Shop
  name: "Carvantooo",
  // Slogan
  claim: "Weil dein Auto zur Familie gehört.",
  // Rechtlicher Firmenname
  legalName: "OpenCarBox GmbH",
  ceo: "Herr Arac Metehan",
  founded: "16.06.2020",
  description: "Betrieb einer KFZ-Reparaturwerkstätte; Autohandel",

  address: {
    street: "Rennweg 76",
    zip: "1030",
    city: "Wien",
    country: "Österreich"
  },

  contact: {
    phone: "01 7981310",
    email: "office@opencarbox.co.at",
    website: "www.carvantooo.at"
  },

  legal: {
    registerNumber: "FN 534799 w",
    uid: "ATU75630015",
    court: "Handelsgericht Wien",
    form: "Gesellschaft mit beschränkter Haftung (GmbH)",
    authority: "Magistrat der Stadt Wien",
    department: "Magistratsabteilung 63 - Gewerbewesen und betriebsanlagenbehördliche Angelegenheiten",
    authorityAddress: "Friedrich-Schmidt-Platz 3-4, 1080 Wien",
    authorityPhone: "+43 1 4000-63210"
  },

  regulations: [
    "Gewerbeordnung 1994 (GewO 1994)",
    "Kraftfahrgesetz 1967 (KFG 1967)",
    "Kraftfahrgesetz-Durchführungsverordnung 1967 (KDV 1967)",
    "EU-Fahrzeuggenehmigungsverordnung",
    "Produkthaftungsgesetz (PHG)"
  ],

  licenses: [
    "Kraftfahrzeugtechnik (§ 94 Z 73 GewO 1994)",
    "Handel mit Kraftfahrzeugen (§ 94 Z 22 GewO 1994)",
    "Überprüfung von Fahrzeugen gemäß § 57a KFG"
  ],

  dispute: {
    euUrl: "https://ec.europa.eu/consumers/odr/",
    ombudsmann: "www.ombudsmann.at",
    oeamtc: "www.oeamtc.at"
  },

  social: {
    facebook: "https://facebook.com/opencarbox",
    instagram: "https://instagram.com/opencarbox",
    twitter: "https://twitter.com/opencarbox",
    youtube: "https://youtube.com/@opencarbox"
  }
} as const;

export type CompanyConfig = typeof companyConfig;
