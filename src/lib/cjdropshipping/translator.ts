/**
 * Smart Translator & Fuzzy Normalizer for CJ Dropshipping Catalog
 * 
 * Bridges Spanish dropshipping searches and common typos into
 * clean English keywords that CJ Dropshipping's indexing engine recognizes.
 */

// Common Spanish -> English dropshipping mappings (ordered by phrase length / specificity)
const TRANSLATION_MAP: Array<{ patterns: RegExp[]; english: string; fallback: string }> = [
  // Pets
  {
    patterns: [/cepillo.*vapor.*gato/i, /steamy.*cat/i, /cepillo.*vapor/i],
    english: 'steamy cat brush',
    fallback: 'pet brush',
  },
  {
    patterns: [/cepillo.*(gato|perro|mascota|pelo)/i, /peine.*(gato|perro)/i, /quitapelos/i, /quitar.*pelo/i],
    english: 'pet hair brush',
    fallback: 'pet brush',
  },
  {
    patterns: [/bebedero.*(gato|perro)/i, /fuente.*agua.*(gato|perro)/i],
    english: 'pet water fountain',
    fallback: 'pet fountain',
  },
  {
    patterns: [/comedero.*(gato|perro)/i, /plato.*mascota/i],
    english: 'pet bowl feeder',
    fallback: 'pet feeder',
  },
  {
    patterns: [/cama.*(gato|perro|mascota)/i, /colchon.*perro/i],
    english: 'pet calming bed',
    fallback: 'pet bed',
  },

  // Home & Lighting
  {
    patterns: [/lampara.*luna.*levit/i, /luna.*flotante/i, /luna.*levita/i],
    english: 'magnetic levitating moon lamp',
    fallback: 'moon lamp',
  },
  {
    patterns: [/lampara.*luna/i, /luz.*luna/i, /lampara.*lunar/i],
    english: '3d moon lamp',
    fallback: 'moon lamp',
  },
  {
    patterns: [/proyector.*astronauta/i, /astronauta.*galaxia/i],
    english: 'astronaut galaxy projector',
    fallback: 'galaxy projector',
  },
  {
    patterns: [/proyector.*galaxia/i, /proyector.*estrellas/i, /luz.*galaxia/i],
    english: 'galaxy star projector',
    fallback: 'projector',
  },
  {
    patterns: [/humidificador.*volcan/i, /difusor.*volcan/i],
    english: 'volcano humidifier diffuser',
    fallback: 'volcano humidifier',
  },
  {
    patterns: [/humidificador/i, /difusor.*aroma/i, /difusor.*esencias/i],
    english: 'aroma essential oil diffuser',
    fallback: 'humidifier',
  },
  {
    patterns: [/luces.*led/i, /tira.*led/i, /cinta.*led/i],
    english: 'rgb led strip light',
    fallback: 'led light',
  },

  // Health, Beauty & Posture
  {
    patterns: [/corrector.*postura/i, /faja.*espalda/i, /soporte.*espalda/i],
    english: 'adjustable posture corrector',
    fallback: 'posture corrector',
  },
  {
    patterns: [/masajeador.*cuello/i, /masajeador.*cervical/i],
    english: 'neck massager relief',
    fallback: 'neck massager',
  },
  {
    patterns: [/pistola.*masaje/i, /pistola.*muscular/i],
    english: 'massage gun deep tissue',
    fallback: 'massage gun',
  },
  {
    patterns: [/depiladora.*laser/i, /depiladora.*ipl/i, /depilacion.*luz.*pulsada/i],
    english: 'ipl laser hair removal',
    fallback: 'hair removal',
  },
  {
    patterns: [/depiladora/i, /maquinilla.*afeitar/i],
    english: 'electric hair removal epilator',
    fallback: 'epilator',
  },
  {
    patterns: [/faja.*reductora/i, /faja.*moldeadora/i, /faja.*colombiana/i],
    english: 'waist trainer corset shapewear',
    fallback: 'waist trainer',
  },
  {
    patterns: [/limpiador.*facial/i, /cepillo.*facial/i, /extractor.*puntos.*negros/i],
    english: 'ultrasonic facial skin scrubber',
    fallback: 'facial cleanser',
  },

  // Tech & Gadgets
  {
    patterns: [/anillo.*inteligente/i, /smart.*ring/i],
    english: 'smart health ring',
    fallback: 'smart ring',
  },
  {
    patterns: [/reloj.*inteligente/i, /smartwatch/i],
    english: 'smart watch fitness tracker',
    fallback: 'smart watch',
  },
  {
    patterns: [/auriculares.*inalambrico/i, /audifonos.*bluetooth/i, /auricular.*bluetooth/i],
    english: 'wireless bluetooth earbuds',
    fallback: 'wireless earbuds',
  },
  {
    patterns: [/mini.*impresora/i, /impresora.*bolsillo/i, /impresora.*termica/i],
    english: 'mini thermal pocket printer',
    fallback: 'pocket printer',
  },
  {
    patterns: [/cargador.*inalambrico/i, /estacion.*carga/i],
    english: 'fast wireless charger stand',
    fallback: 'wireless charger',
  },
  {
    patterns: [/soporte.*(celular|movil|telefono).*coche/i, /porta.*celular.*auto/i],
    english: 'car phone holder mount',
    fallback: 'phone holder',
  },
  {
    patterns: [/soporte.*(celular|movil|telefono|tablet)/i],
    english: 'desk phone stand holder',
    fallback: 'phone stand',
  },
  {
    patterns: [/soporte.*laptop/i, /soporte.*portatil/i],
    english: 'ergonomic laptop stand',
    fallback: 'laptop stand',
  },
  {
    patterns: [/aro.*luz/i, /anillo.*luz/i],
    english: 'ring light with tripod',
    fallback: 'ring light',
  },

  // Lifestyle & Kitchen
  {
    patterns: [/botella.*agua/i, /botella.*motivacional/i, /termo/i],
    english: 'motivational water bottle',
    fallback: 'water bottle',
  },
  {
    patterns: [/mochila.*antirrobo/i, /mochila.*impermeable/i],
    english: 'anti theft waterproof backpack',
    fallback: 'backpack',
  },
  {
    patterns: [/picador.*verduras/i, /cortador.*verduras/i, /mandolina/i],
    english: 'multifunctional vegetable chopper',
    fallback: 'vegetable cutter',
  },
  {
    patterns: [/organizador.*maquillaje/i, /caja.*maquillaje/i],
    english: 'makeup organizer box',
    fallback: 'makeup organizer',
  },
  {
    patterns: [/gafas.*sol/i, /lentes.*sol/i, /anteojos/i, /lentes/i, /gafas/i],
    english: 'polarized sunglasses',
    fallback: 'sunglasses',
  },
  {
    patterns: [/ventilador.*cuello/i, /ventilador.*portatil/i, /abanico.*cuello/i, /ventilador/i],
    english: 'portable neck fan',
    fallback: 'neck fan',
  },
  {
    patterns: [/auriculares/i, /audifonos/i, /auricular/i, /audifono/i, /headphone/i, /earphone/i],
    english: 'wireless bluetooth earbuds',
    fallback: 'earbuds',
  },
  {
    patterns: [/almohada.*cervical/i, /almohada.*ortopedica/i, /almohada.*cuello/i, /cojin/i, /almohada/i],
    english: 'orthopedic cervical memory foam pillow',
    fallback: 'pillow',
  },
  {
    patterns: [/espejo.*led/i, /espejo.*maquillaje/i, /espejo/i],
    english: 'led vanity makeup mirror',
    fallback: 'makeup mirror',
  },
  {
    patterns: [/blanqueador.*dientes/i, /blanqueamiento.*dental/i, /dientes/i],
    english: 'teeth whitening kit led',
    fallback: 'teeth whitening',
  },
  {
    patterns: [/camara.*seguridad/i, /mini.*camara/i, /camara.*wifi/i, /camara/i],
    english: 'wireless mini wifi security camera',
    fallback: 'mini camera',
  },
  {
    patterns: [/funda.*(celular|movil|iphone)/i, /carcasa/i, /case/i],
    english: 'magnetic phone case',
    fallback: 'phone case',
  },

  // Fitness & Outdoor
  {
    patterns: [/banda.*resistencia/i, /ligas.*ejercicio/i, /bandas.*elasticas/i],
    english: 'resistance bands set workout',
    fallback: 'resistance bands',
  },
  {
    patterns: [/esterilla.*yoga/i, /tapete.*yoga/i, /mat.*yoga/i],
    english: 'non slip yoga mat',
    fallback: 'yoga mat',
  },
  {
    patterns: [/cuerda.*saltar/i, /salto.*cuerda/i],
    english: 'cordless jump rope fitness',
    fallback: 'jump rope',
  },

  // Kitchen & Home Gadgets
  {
    patterns: [/dispensador.*jabon/i, /jabonera.*automatica/i],
    english: 'automatic sensor soap dispenser',
    fallback: 'soap dispenser',
  },
  {
    patterns: [/termo.*cafe/i, /vaso.*termico/i, /taza.*termica/i],
    english: 'insulated travel coffee mug',
    fallback: 'coffee mug',
  },
  {
    patterns: [/aspiradora.*mano/i, /mini.*aspiradora/i, /aspiradora.*coche/i],
    english: 'portable cordless car vacuum cleaner',
    fallback: 'vacuum cleaner',
  },
  {
    patterns: [/dron/i, /drone/i],
    english: '4k dual camera mini drone',
    fallback: 'mini drone',
  },
  {
    patterns: [/cartera/i, /billetera/i, /tarjetero/i],
    english: 'rfid blocking leather wallet',
    fallback: 'wallet',
  },
  {
    patterns: [/zapatillas/i, /zapatos/i, /tenis/i, /calzado/i],
    english: 'breathable running shoes sneakers',
    fallback: 'shoes',
  },
  {
    patterns: [/collar/i, /pulsera/i, /joya/i, /anillo/i],
    english: 'stainless steel crystal jewelry necklace',
    fallback: 'jewelry',
  },
]

// Common typo corrections in Spanish & English
const TYPO_MAP: Record<string, string> = {
  'prodcuto': 'producto',
  'prodcutos': 'productos',
  'ceppillo': 'cepillo',
  'sepillo': 'cepillo',
  'lampara': 'lampara',
  'lanpara': 'lampara',
  'lamparita': 'lampara',
  'proyestor': 'proyector',
  'masageador': 'masajeador',
  'masajeadro': 'masajeador',
  'depiladroa': 'depiladora',
  'relog': 'reloj',
  'audifono': 'audifonos',
  'auricular': 'auriculares',
  'audiculares': 'auriculares',
  'humificador': 'humidificador',
  'umidificador': 'humidificador',
  'astronauto': 'astronauta',
  'corrector': 'corrector',
  'corector': 'corrector',
  'projector': 'projector',
  'projecor': 'projector',
  'boteya': 'botella',
  'funda': 'funda',
}

/**
 * Normalizes accents, trims whitespace and cleans special characters
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export interface TranslatedQuery {
  originalQuery: string
  translatedQuery: string
  fallbackQuery: string
  wasTranslated: boolean
  matchedCategory?: string
}

/**
 * Translates Spanish or typo-ridden queries into optimized CJ Dropshipping keywords
 */
export function smartTranslateQuery(query: string): TranslatedQuery {
  const original = query.trim()
  let normalized = normalizeString(original)

  // 1. Correct word-level typos
  const words = normalized.split(' ')
  const correctedWords = words.map((w) => TYPO_MAP[w] || w)
  normalized = correctedWords.join(' ')

  // 2. Check translation map for matching dropshipping concepts
  for (const item of TRANSLATION_MAP) {
    for (const pattern of item.patterns) {
      if (pattern.test(normalized)) {
        return {
          originalQuery: original,
          translatedQuery: item.english,
          fallbackQuery: item.fallback,
          wasTranslated: true,
          matchedCategory: item.fallback,
        }
      }
    }
  }

  // 3. Simple fallback translation for common individual nouns
  const simpleReplacements: Record<string, string> = {
    'gato': 'cat',
    'perro': 'dog',
    'mascota': 'pet',
    'cepillo': 'brush',
    'lampara': 'lamp',
    'luz': 'light',
    'luna': 'moon lamp',
    'reloj': 'watch',
    'anillo': 'ring',
    'cuello': 'neck',
    'espalda': 'back',
    'coche': 'car',
    'auto': 'car',
    'botella': 'bottle',
    'agua': 'water bottle',
    'faja': 'waist trainer',
    'bolso': 'bag',
    'mochila': 'backpack',
    'dron': 'drone',
    'drone': 'drone',
    'gafas': 'sunglasses',
    'lentes': 'sunglasses',
    'espejo': 'makeup mirror',
    'ventilador': 'portable fan',
    'almohada': 'cervical pillow',
    'cojin': 'cervical pillow',
    'aspiradora': 'vacuum cleaner',
    'termo': 'travel mug',
    'cartera': 'wallet',
    'billetera': 'wallet',
    'joya': 'jewelry',
    'zapatos': 'shoes',
    'zapatillas': 'sneakers',
    'dientes': 'teeth whitening',
  }

  for (const [es, en] of Object.entries(simpleReplacements)) {
    if (normalized.includes(es)) {
      return {
        originalQuery: original,
        translatedQuery: en,
        fallbackQuery: en,
        wasTranslated: true,
      }
    }
  }

  // If already in English or not matched, use normalized query
  return {
    originalQuery: original,
    translatedQuery: normalized,
    fallbackQuery: normalized.split(' ')[0] || normalized,
    wasTranslated: false,
  }
}

