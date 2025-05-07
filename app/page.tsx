"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Cloud,
  CloudRain,
  Sun,
  CloudDrizzle,
  Calendar,
  Thermometer,
  Moon,
  Luggage,
  Plane,
  Droplets,
  X,
  ArrowDown,
  ArrowUp,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { fetchWeatherData, shouldUpdateWeather, setLastUpdate } from "@/lib/weather-api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Dati meteo base per il pellegrinaggio (usati come fallback)
const datiMeteoBase = [
  {
    data: "08-mag",
    orario: "A 10:45",
    orario24h: "10:45",
    tipoOrario: "A", // A = Arrivo, P = Partenza
    citta: "MADRID",
    tempo: "nubi sparse",
    tempMin: 10,
    tempMax: 17,
    precipProbability: 20,
    note: "AEROPORTO", // Aggiunta la label Aeroporto come richiesto
    lat: 40.4168,
    lon: -3.7038,
  },
  {
    data: "08-mag",
    orario: "A 16:30",
    orario24h: "16:30",
    tipoOrario: "A",
    citta: "SARAGOZZA",
    tempo: "nubi sparse",
    tempMin: 8,
    tempMax: 21,
    precipProbability: 10,
    note: "PERNOTTAMENTO",
    lat: 41.6488,
    lon: -0.8891,
  },
  {
    data: "09-mag",
    orario: "P 09:00",
    orario24h: "09:00",
    tipoOrario: "P",
    citta: "SARAGOZZA",
    tempo: "nubi sparse",
    tempMin: 12,
    tempMax: 21,
    precipProbability: 15,
    note: "",
    lat: 41.6488,
    lon: -0.8891,
  },
  {
    data: "09-mag",
    orario: "A 10:15",
    orario24h: "10:15",
    tipoOrario: "A",
    citta: "TUDELA",
    tempo: "nubi sparse",
    tempMin: 10,
    tempMax: 19,
    precipProbability: 5,
    note: "",
    lat: 42.0642,
    lon: -1.607,
  },
  {
    data: "09-mag",
    orario: "A 14:30",
    orario24h: "14:30",
    tipoOrario: "A",
    citta: "SARAGOZZA",
    tempo: "nubi sparse",
    tempMin: 12,
    tempMax: 21,
    precipProbability: 20,
    note: "PERNOTTAMENTO",
    lat: 41.6488,
    lon: -0.8891,
  },
  {
    data: "10-mag",
    orario: "P 08:00",
    orario24h: "08:00",
    tipoOrario: "P",
    citta: "SARAGOZZA",
    tempo: "nubi sparse con pioggia",
    tempMin: 11,
    tempMax: 24,
    precipProbability: 60,
    note: "BAGAGLI",
    lat: 41.6488,
    lon: -0.8891,
  },
  {
    data: "10-mag",
    orario: "A 09:30",
    orario24h: "09:30",
    tipoOrario: "A",
    citta: "OLVEGA",
    tempo: "nubi sparse con pioggia",
    tempMin: 5,
    tempMax: 17,
    precipProbability: 55,
    note: "",
    lat: 41.7758,
    lon: -1.9983,
  },
  {
    data: "10-mag",
    orario: "A 14:15",
    orario24h: "14:15",
    tipoOrario: "A",
    citta: "CARBONERO",
    tempo: "sereno",
    tempMin: 15,
    tempMax: 21,
    precipProbability: 0,
    note: "",
    lat: 41.1218,
    lon: -4.2661,
  },
  {
    data: "10-mag",
    orario: "A 19:00",
    orario24h: "19:00",
    tipoOrario: "A",
    citta: "SEGOVIA",
    tempo: "pioggia e schiarite",
    tempMin: 4,
    tempMax: 15,
    precipProbability: 70,
    note: "PERNOTTAMENTO",
    lat: 40.9429,
    lon: -4.1088,
  },
  {
    data: "11-mag",
    orario: "P 08:30",
    orario24h: "08:30",
    tipoOrario: "P",
    citta: "SEGOVIA",
    tempo: "nubi sparse con pioggia",
    tempMin: 5,
    tempMax: 13,
    precipProbability: 45,
    note: "",
    lat: 40.9429,
    lon: -4.1088,
  },
  {
    data: "11-mag",
    orario: "A 09:30",
    orario24h: "09:30",
    tipoOrario: "A",
    citta: "AVILA",
    tempo: "nubi sparse",
    tempMin: 1,
    tempMax: 14,
    precipProbability: 25,
    note: "",
    lat: 40.6567,
    lon: -4.6818,
  },
  {
    data: "11-mag",
    orario: "A 17:00",
    orario24h: "17:00",
    tipoOrario: "A",
    citta: "SEGOVIA",
    tempo: "nubi sparse",
    tempMin: 4,
    tempMax: 14,
    precipProbability: 30,
    note: "PERNOTTAMENTO",
    lat: 40.9429,
    lon: -4.1088,
  },
  {
    data: "12-mag",
    orario: "P 09:30",
    orario24h: "09:30",
    tipoOrario: "P",
    citta: "SEGOVIA",
    tempo: "pioggia e schiarite",
    tempMin: 7,
    tempMax: 14,
    precipProbability: 65,
    note: "BAGAGLI",
    lat: 40.9429,
    lon: -4.1088,
  },
  {
    data: "12-mag",
    orario: "A 10:30",
    orario24h: "10:30",
    tipoOrario: "A",
    citta: "MADRID",
    tempo: "nubi sparse",
    tempMin: 11,
    tempMax: 19,
    precipProbability: 15,
    note: "PERNOTTAMENTO",
    lat: 40.4168,
    lon: -3.7038,
  },
  {
    data: "13-mag",
    orario: "P 15:00",
    orario24h: "15:00",
    tipoOrario: "P",
    citta: "MADRID",
    tempo: "pioggia e schiarite",
    tempMin: 11,
    tempMax: 20,
    precipProbability: 50,
    note: "BAGAGLI,AEROPORTO",
    lat: 40.4983,
    lon: -3.5676,
  },
]

// Funzione per ottenere il giorno della settimana
function getWeekday(dateStr: string, year = 2025) {
  const [day, month] = dateStr.split("-")
  const date = new Date(year, mesiMap[month] - 1, Number.parseInt(day))

  const weekdays = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
  return weekdays[date.getDay()]
}

// Funzione per formattare la data con il giorno della settimana
function formatDateWithWeekday(dateStr: string) {
  const weekday = getWeekday(dateStr)
  return `${weekday} ${dateStr}`
}

// Funzione per ottenere l'icona meteo appropriata
function getWeatherIcon(weatherCode: number | string, size = "medium") {
  const sizeClass = size === "large" ? "h-14 w-14" : size === "small" ? "h-7 w-7" : "h-10 w-10"
  const iconClass = `${sizeClass} drop-shadow-md`

  // Se è una stringa (dati fallback), usa la logica precedente
  if (typeof weatherCode === "string") {
    if (weatherCode.includes("sereno")) {
      return (
        <div className="relative">
          <Sun className={`${iconClass} text-yellow-500`} />
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-200 to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    } else if (weatherCode.includes("pioggia") && !weatherCode.includes("schiarite")) {
      return (
        <div className="relative">
          <CloudRain className={`${iconClass} text-blue-500`} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-200 rounded-full animate-ping opacity-75"></div>
        </div>
      )
    } else if (weatherCode.includes("schiarite")) {
      return (
        <div className="relative">
          <CloudDrizzle className={`${iconClass} text-blue-400`} />
          <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-200 rounded-full opacity-75"></div>
        </div>
      )
    } else if (weatherCode.includes("temporale")) {
      return (
        <div className="relative">
          <CloudRain className={`${iconClass} text-purple-500`} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-75"></div>
        </div>
      )
    } else if (weatherCode.includes("neve")) {
      return (
        <div className="relative">
          <CloudDrizzle className={`${iconClass} text-sky-200`} />
          <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    } else {
      return (
        <div className="relative">
          <Cloud className={`${iconClass} text-gray-500`} />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    }
  }

  // Altrimenti usa i codici WMO dell'API meteo
  switch (true) {
    case weatherCode === 0: // Clear sky
      return (
        <div className="relative">
          <Sun className={`${iconClass} text-yellow-500`} />
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-200 to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    case weatherCode === 1: // Mainly clear
      return (
        <div className="relative">
          <Sun className={`${iconClass} text-yellow-500`} />
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-200 to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    case weatherCode === 2: // Partly cloudy
    case weatherCode === 3: // Overcast
      return (
        <div className="relative">
          <Cloud className={`${iconClass} text-gray-500`} />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    case weatherCode >= 45 && weatherCode <= 48: // Fog
      return (
        <div className="relative">
          <Cloud className={`${iconClass} text-gray-400`} />
          <div className="absolute inset-0 bg-gray-200 opacity-50 rounded-full blur-sm"></div>
        </div>
      )
    case weatherCode >= 51 && weatherCode <= 55: // Drizzle
      return (
        <div className="relative">
          <CloudDrizzle className={`${iconClass} text-blue-400`} />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-200 rounded-full animate-ping opacity-75"></div>
        </div>
      )
    case weatherCode >= 56 && weatherCode <= 57: // Freezing Drizzle
      return (
        <div className="relative">
          <CloudDrizzle className={`${iconClass} text-blue-300`} />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-100 rounded-full animate-ping opacity-75"></div>
        </div>
      )
    case weatherCode >= 61 && weatherCode <= 65: // Rain
      return (
        <div className="relative">
          <CloudRain className={`${iconClass} text-blue-500`} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-75"></div>
        </div>
      )
    case weatherCode >= 66 && weatherCode <= 67: // Freezing Rain
      return (
        <div className="relative">
          <CloudRain className={`${iconClass} text-blue-600`} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-200 rounded-full animate-ping opacity-75"></div>
        </div>
      )
    case weatherCode >= 71 && weatherCode <= 77: // Snow
      return (
        <div className="relative">
          <CloudDrizzle className={`${iconClass} text-sky-200`} />
          <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    case weatherCode >= 80 && weatherCode <= 82: // Rain showers
      return (
        <div className="relative">
          <CloudRain className={`${iconClass} text-blue-500`} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-75"></div>
        </div>
      )
    case weatherCode >= 85 && weatherCode <= 86: // Snow showers
      return (
        <div className="relative">
          <CloudDrizzle className={`${iconClass} text-sky-200`} />
          <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-30 rounded-full"></div>
        </div>
      )
    case weatherCode >= 95 && weatherCode <= 99: // Thunderstorm
      return (
        <div className="relative">
          <CloudRain className={`${iconClass} text-purple-500`} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-75"></div>
        </div>
      )
    default:
      return (
        <div className="relative">
          <Cloud className={`${iconClass} text-gray-500`} />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-transparent opacity-30 rounded-full"></div>
        </div>
      )
  }
}

// Funzione per convertire il codice meteo in descrizione
function getWeatherDescription(weatherCode: number | string) {
  // Se è una stringa (dati fallback), restituiscila direttamente
  if (typeof weatherCode === "string") {
    return weatherCode
  }

  // Altrimenti usa i codici WMO dell'API meteo
  switch (true) {
    case weatherCode === 0:
      return "sereno"
    case weatherCode === 1:
      return "prevalentemente sereno"
    case weatherCode === 2:
      return "parzialmente nuvoloso"
    case weatherCode === 3:
      return "nuvoloso"
    case weatherCode >= 45 && weatherCode <= 48:
      return "nebbia"
    case weatherCode >= 51 && weatherCode <= 55:
      return "pioviggine"
    case weatherCode >= 56 && weatherCode <= 57:
      return "pioviggine gelata"
    case weatherCode >= 61 && weatherCode <= 65:
      return "pioggia"
    case weatherCode >= 66 && weatherCode <= 67:
      return "pioggia gelata"
    case weatherCode >= 71 && weatherCode <= 77:
      return "neve"
    case weatherCode >= 80 && weatherCode <= 82:
      return "pioggia e schiarite"
    case weatherCode >= 85 && weatherCode <= 86:
      return "neve a tratti"
    case weatherCode >= 95 && weatherCode <= 99:
      return "temporale"
    default:
      return "condizioni meteo sconosciute"
  }
}

// Funzione per ottenere il colore della barra di precipitazioni
function getPrecipitationColor(probability: number) {
  if (probability < 20) return "bg-green-500"
  if (probability < 40) return "bg-lime-500"
  if (probability < 60) return "bg-yellow-500"
  if (probability < 80) return "bg-orange-500"
  return "bg-red-500"
}

// Modificare la funzione getTipoOrarioBadge per differenziare meglio i colori
function getTipoOrarioBadge(tipoOrario: string, orario24h: string) {
  if (tipoOrario === "A") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1 text-sm w-auto">
        <ArrowDown className="h-3 w-3 flex-shrink-0" />
        <span>Arrivo {orario24h}</span>
      </Badge>
    )
  } else {
    return (
      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex items-center gap-1 text-sm w-auto">
        <ArrowUp className="h-3 w-3 flex-shrink-0" />
        <span>Partenza {orario24h}</span>
      </Badge>
    )
  }
}

// Modificare la funzione getNoteIcon per differenziare i colori
function getNoteIcon(nota: string) {
  const icons = []

  if (nota.includes("PERNOTTAMENTO")) {
    icons.push({
      icon: <Moon className="h-6 w-6 text-purple-600" />,
      label: "Pernottamento",
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    })
  }

  if (nota.includes("BAGAGLI")) {
    icons.push({
      icon: <Luggage className="h-6 w-6 text-amber-600" />,
      label: "Portare via i bagagli",
      color: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    })
  }

  if (nota.includes("AEROPORTO")) {
    icons.push({
      icon: <Plane className="h-6 w-6 text-sky-600" />,
      label: "Aeroporto",
      color: "bg-sky-100 text-sky-800 hover:bg-sky-200",
    })
  }

  return icons.length > 0 ? icons : null
}

export default function Home() {
  const [datiMeteo, setDatiMeteo] = useState(datiMeteoBase)
  const [giornoSelezionato, setGiornoSelezionato] = useState<string | null>(null)
  const [datiGiornoSelezionato, setDatiGiornoSelezionato] = useState<typeof datiMeteo>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accordionValue, setAccordionValue] = useState<string>("item-1")
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null)

  // Raggruppa i dati per giorno
  const giorniUnici = [...new Set(datiMeteo.map((item) => item.data))].sort()

  // Modificare la funzione handleGiornoClick
  const handleGiornoClick = (giorno: string) => {
    // Se il giorno è già selezionato, deselezionalo
    if (giornoSelezionato === giorno) {
      setGiornoSelezionato(null)
      setDatiGiornoSelezionato([])
    } else {
      setGiornoSelezionato(giorno)
      setDatiGiornoSelezionato(datiMeteo.filter((item) => item.data === giorno))
    }
  }

  // Funzione per formattare la data dell'ultimo aggiornamento
  const formatLastUpdate = () => {
    if (!lastUpdateTime) return null

    const date = new Date(lastUpdateTime)
    return `${date.toLocaleDateString("it-IT")} ${date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`
  }

  // Funzione per aggiornare i dati meteo usando l'API meteo
  const aggiornaDatiMeteo = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Verifica se è necessario aggiornare i dati meteo
      const shouldUpdate = typeof window !== "undefined" ? shouldUpdateWeather() : true

      // Se non è necessario aggiornare, usa i dati esistenti
      if (!shouldUpdate && datiMeteo !== datiMeteoBase) {
        setIsLoading(false)
        return
      }

      // Raggruppa i dati per città per ridurre il numero di richieste API
      const cittaUniche = [...new Set(datiMeteoBase.map((dato) => `${dato.lat.toFixed(4)}_${dato.lon.toFixed(4)}`))]
      const datiPerCitta = {}

      // Crea un array di promesse per le chiamate API, ma con un ritardo tra le richieste
      const promesse = []

      for (let i = 0; i < cittaUniche.length; i++) {
        const [lat, lon] = cittaUniche[i].split("_").map(Number)

        // Aggiungi un ritardo tra le richieste per evitare di superare i limiti dell'API
        // Utilizziamo un ritardo progressivo per distribuire le richieste nel tempo
        const delay = i * 500 // 500ms di ritardo tra ogni richiesta

        promesse.push(
          new Promise((resolve) => {
            setTimeout(async () => {
              try {
                // Per ogni città, ottieni i dati meteo per tutte le date associate
                const datiCitta = datiMeteoBase.filter(
                  (dato) => dato.lat.toFixed(4) === lat.toFixed(4) && dato.lon.toFixed(4) === lon.toFixed(4),
                )

                // Ottieni date uniche per questa città
                const dateUniche = [
                  ...new Set(
                    datiCitta.map((dato) => {
                      const [giorno, mese] = dato.data.split("-")
                      return new Date(2025, mesiMap[mese] - 1, Number.parseInt(giorno))
                    }),
                  ),
                ]

                // Ottieni i dati meteo per ogni data
                const risultatiCitta = await Promise.all(
                  dateUniche.map(async (data) => {
                    const datiAPI = await fetchWeatherData(lat, lon, data)
                    return { data, datiAPI }
                  }),
                )

                // Memorizza i risultati per questa città
                datiPerCitta[`${lat.toFixed(4)}_${lon.toFixed(4)}`] = risultatiCitta
                resolve()
              } catch (err) {
                console.error(`Errore nel recupero dati per lat=${lat}, lon=${lon}:`, err)
                resolve() // Risolvi comunque per non bloccare le altre richieste
              }
            }, delay)
          }),
        )
      }

      // Attendi che tutte le chiamate API siano completate
      await Promise.all(promesse)

      // Aggiorna i dati meteo con i risultati ottenuti
      const risultati = datiMeteoBase.map((dato) => {
        const chiaveCitta = `${dato.lat.toFixed(4)}_${dato.lon.toFixed(4)}`
        const risultatiCitta = datiPerCitta[chiaveCitta]

        if (!risultatiCitta) {
          return dato // Usa i dati originali se non abbiamo risultati per questa città
        }

        // Trova i dati meteo per la data specifica
        const [giorno, mese] = dato.data.split("-")
        const data = new Date(2025, mesiMap[mese] - 1, Number.parseInt(giorno))
        const dataFormatted = data.toISOString().split("T")[0]

        const risultatoData = risultatiCitta.find((r) => r.data.toISOString().split("T")[0] === dataFormatted)

        if (!risultatoData) {
          return dato // Usa i dati originali se non abbiamo risultati per questa data
        }

        // Aggiorna i dati con i risultati dell'API
        return {
          ...dato,
          tempo: risultatoData.datiAPI.weatherCode,
          tempMin: risultatoData.datiAPI.tempMin,
          tempMax: risultatoData.datiAPI.tempMax,
          precipProbability: risultatoData.datiAPI.precipProbability,
        }
      })

      // Aggiorna lo stato con i nuovi dati
      setDatiMeteo(risultati)

      // Aggiorna anche i dati del giorno selezionato se presente
      if (giornoSelezionato) {
        setDatiGiornoSelezionato(risultati.filter((item) => item.data === giornoSelezionato))
      }

      // Salva l'ultimo aggiornamento
      if (typeof window !== "undefined") {
        setLastUpdate()
        setLastUpdateTime(new Date().toISOString())
      }
    } catch (err) {
      console.error("Errore nell'aggiornamento dei dati meteo:", err)
      setError("Si è verificato un errore durante l'aggiornamento dei dati meteo. Riprova più tardi.")
    } finally {
      setIsLoading(false)
    }
  }

  // Modificare la funzione useEffect per aggiornare automaticamente i dati quando passa un giorno
  // Sostituire l'useEffect esistente con questo:

  useEffect(() => {
    // Funzione per verificare e aggiornare i dati
    const checkAndUpdateData = () => {
      if (typeof window !== "undefined") {
        // Verifica se è necessario aggiornare i dati
        const shouldUpdate = shouldUpdateWeather()
        if (shouldUpdate) {
          aggiornaDatiMeteo()
        }
      }
    }

    // Esegui subito all'avvio
    checkAndUpdateData()

    // Imposta un intervallo per controllare ogni ora se è necessario aggiornare
    // (questo verificherà se è passato un giorno e aggiornerà automaticamente)
    const intervalId = setInterval(checkAndUpdateData, 60 * 60 * 1000) // Ogni ora

    // Pulizia dell'intervallo quando il componente viene smontato
    return () => clearInterval(intervalId)
  }, [])

  // Modificare il titolo e aggiungere il sottotitolo della comunità
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con logo e immagine di Carmen */}
        <div className="flex flex-col items-center md:flex-row md:justify-center md:gap-8 mb-6">
          {/* Logo Parrocchia */}
          <div className="mb-2 md:mb-0">
            <Image
              src="/images/sacra-famiglia-logo.png"
              alt="Logo Parrocchia Sacra Famiglia"
              width={100}
              height={100}
              className="w-24 h-24 md:w-40 md:h-40 object-contain"
              priority
            />
          </div>

          {/* Immagine di Carmen */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <Image
              src="/images/carmen.jpeg"
              alt="Carmen"
              fill
              style={{ objectFit: "cover" }}
              className="hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 text-sky-800">
          Pellegrinaggio sulle orme di Carmen Hernández Barrera
        </h1>
        <h3 className="text-lg md:text-xl font-medium text-center mb-1 text-sky-700">8-13 Maggio 2025</h3>
        <p className="text-md md:text-lg font-medium text-center mb-2 text-sky-700">
          1ˆ comunità neocatecumenale (1973 - 2025)
        </p>
        <h3 className="text-md md:text-lg font-medium text-center mb-6 text-sky-700">
          Parrocchia Sacra Famiglia Palermo
        </h3>

        {/* Rimuovere la sezione "Ultimo aggiornamento" */}
        {/* Eliminare completamente questo blocco: */}

        {/* Messaggio di errore */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Sezione giorni con Accordion */}
        <div className="mb-8">
          <Accordion
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={setAccordionValue}
            className="bg-white rounded-lg shadow"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="px-4 py-3 text-xl font-semibold text-sky-700 hover:bg-sky-50">
                Seleziona giorno
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {giorniUnici.map((giorno) => (
                    <button
                      key={giorno}
                      onClick={() => handleGiornoClick(giorno)}
                      className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                        giornoSelezionato === giorno
                          ? "bg-sky-600 text-white shadow-lg"
                          : "bg-sky-50 hover:bg-sky-100 text-sky-800 shadow"
                      }`}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">{formatDateWithWeekday(giorno)}</span>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Dettagli meteo */}
        {giornoSelezionato && (
          <div className="relative mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-sky-700">
                Programma del {formatDateWithWeekday(giornoSelezionato)}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGiornoSelezionato(null)
                  setDatiGiornoSelezionato([])
                }}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span>Chiudi</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {datiGiornoSelezionato.map((dato, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-[#3e8bba] to-[#c5deed] text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{dato.citta}</h3>
                        <p className="text-white text-sm mt-1">{getWeatherDescription(dato.tempo)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right bg-white/20 px-2 py-1 rounded-md">
                          <div className="flex items-center justify-end">
                            <span className="text-blue-100 font-medium">{dato.tempMin}°</span>
                            <span className="mx-1 text-white">/</span>
                            <span className="text-white font-bold">{dato.tempMax}°</span>
                          </div>
                          <div className="text-xs flex items-center justify-end mt-1">
                            <Droplets className="h-3 w-3 mr-1 text-blue-100" />
                            <span className="text-white font-medium">{dato.precipProbability}%</span>
                          </div>
                        </div>
                        {getWeatherIcon(dato.tempo, "large")}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                        <span className="text-gray-700 font-medium">{formatDateWithWeekday(dato.data)}</span>
                      </div>
                      <div className="inline-flex">{getTipoOrarioBadge(dato.tipoOrario, dato.orario24h)}</div>
                    </div>

                    {dato.note && getNoteIcon(dato.note) && (
                      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                        {getNoteIcon(dato.note)?.map((noteItem, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className={`flex items-center gap-1 px-2 py-1 ${noteItem.color}`}
                                >
                                  {noteItem.icon}
                                  <span>{noteItem.label}</span>
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{noteItem.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tabella completa - versione desktop */}
        <div className="mt-10 hidden md:block">
          <h2 className="text-xl font-semibold mb-4 text-sky-700 text-center">Programma</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#1784c7] text-white">
                  <th className="py-3 px-4 text-left">Data</th>
                  <th className="py-3 px-4 text-left">Orario</th>
                  <th className="py-3 px-4 text-left">Città</th>
                  <th className="py-3 px-4 text-left">Tempo</th>
                  <th className="py-3 px-4 text-left">Min</th>
                  <th className="py-3 px-4 text-left">Max</th>
                  <th className="py-3 px-4 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {datiMeteo.map((dato, index) => (
                  <tr
                    key={index}
                    className={`border-b hover:bg-sky-50 ${index % 2 === 0 ? "bg-sky-50/50" : "bg-white"}`}
                  >
                    <td className="py-3 px-4">{formatDateWithWeekday(dato.data)}</td>
                    <td className="py-3 px-4">{getTipoOrarioBadge(dato.tipoOrario, dato.orario24h)}</td>
                    <td className="py-3 px-4 font-medium">{dato.citta}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <span className="mr-2">{getWeatherIcon(dato.tempo, "small")}</span>
                          <span>{getWeatherDescription(dato.tempo)}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                          <span className="text-blue-700 mr-1">{dato.precipProbability}%</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getPrecipitationColor(dato.precipProbability)}`}
                              style={{ width: `${dato.precipProbability}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-blue-700">{dato.tempMin}°</td>
                    <td className="py-3 px-4 text-red-700">{dato.tempMax}°</td>
                    <td className="py-3 px-4">
                      {dato.note && getNoteIcon(dato.note) ? (
                        <div className="flex flex-wrap gap-1">
                          {getNoteIcon(dato.note)?.map((noteItem, i) => (
                            <TooltipProvider key={i}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className={`flex items-center gap-1 px-1.5 py-0.5 text-xs ${noteItem.color}`}
                                  >
                                    {noteItem.icon}
                                    <span className="hidden sm:inline">{noteItem.label}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{noteItem.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabella completa - versione mobile */}
        <div className="mt-10 md:hidden">
          <h2 className="text-xl font-semibold mb-4 text-sky-700 text-center">Programma</h2>
          <div className="space-y-4">
            {datiMeteo.map((dato, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 border-l-4 border-[#1784c7]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-[#1784c7] text-lg">{dato.citta}</div>
                    <div className="text-base text-gray-700 font-medium">{formatDateWithWeekday(dato.data)}</div>
                    <div className="mt-2 inline-flex">{getTipoOrarioBadge(dato.tipoOrario, dato.orario24h)}</div>
                  </div>
                  <div className="flex items-center">{getWeatherIcon(dato.tempo)}</div>
                </div>

                <div className="mb-2 mt-3">
                  <div className="text-base mb-1">{getWeatherDescription(dato.tempo)}</div>
                  <div className="flex items-center text-sm mb-2">
                    <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-blue-700 mr-1">{dato.precipProbability}%</span>
                    <Progress
                      value={dato.precipProbability}
                      className="h-2 w-20"
                      indicatorClassName={getPrecipitationColor(dato.precipProbability)}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <span className="flex items-center text-blue-700">
                      <Thermometer className="h-5 w-5 mr-1" />
                      {dato.tempMin}°
                    </span>
                    <span className="flex items-center text-red-700">
                      <Thermometer className="h-5 w-5 mr-1" />
                      {dato.tempMax}°
                    </span>
                  </div>
                </div>

                {dato.note && getNoteIcon(dato.note) && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {getNoteIcon(dato.note)?.map((noteItem, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className={`flex items-center gap-1 px-2 py-1 text-sm ${noteItem.color}`}
                      >
                        {noteItem.icon}
                        <span>{noteItem.label}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// Mappa dei nomi dei mesi alle loro rappresentazioni numeriche
const mesiMap = {
  gen: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  mag: 5,
  giu: 6,
  lug: 7,
  ago: 8,
  set: 9,
  ott: 10,
  nov: 11,
  dic: 12,
}
