export const electionNames = [
    'CORE 2013',
    'CORE 2017',
    'CORE 2021',
    'Diputados 2013',
    'Diputados 2017',
    'Diputados 2021',
    'Municipal 2012 - Alcaldes',
    'Municipal 2012 - Concejales',
    'Municipal 2016 - Alcaldes',
    'Municipal 2016 - Concejales',
    'Municipal 2021 - Alcaldes',
    'Municipal 2021 - Concejales',
    'Plebiscito Constitucional 2020 Apruebo Rechazo',
    'Plebiscito Constitucional 2022',
    'Presidencial 2013 Primera Vuelta',
    'Presidencial 2013 Segunda Vuelta',
    'Presidencial 2017 Primera Vuelta',
    'Presidencial 2017 Segunda Vuelta',
    'Presidencial 2021 Primera Vuelta',
    'Presidencial 2021 Segunda Vuelta',
    'Senadores 2013',
    'Senadores 2017',
    'Senadores 2021'
]

export const electionsApiHost = import.meta.env.MODE === 'production'
                    ? import.meta.env.VITE_API_URL_PROD
                    : import.meta.env.VITE_API_URL_DEBUG;

export const partidosApiEndpoint = import.meta.env.VITE_API_ENDPOINT_PARTIDOS
export const candidatosApiEndpoint = import.meta.env.VITE_API_ENDPOINT_CANDIDATOS

export const partidosApiUrl = `${electionsApiHost}/${partidosApiEndpoint}`
export const candidatosApiUrl = `${electionsApiHost}/${candidatosApiEndpoint}`
