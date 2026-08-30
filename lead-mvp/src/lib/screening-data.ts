import routesData from '../../../data/routes.json'
import localitiesData from '../../../data/localities.json'

export type Criterion = { id: string; he: string; route_ids: string[] }
export type ScreeningConfig = {
  criteria: Criterion[]
  localities: string[]
  defaultAges: {
    service: number
    civilService: number
    noService: number
    permanentResidentNoService: number
  }
  specialUnitMinAge: number
}

type Route = {
  id: string
  criterion_id: string
  min_age_service: number
  min_age_civil_service: number
  min_age_no_service: number
  min_age_permanent_resident_no_service: number
}

export function getScreeningConfig(): ScreeningConfig {
  const routes = routesData.routes as Route[]
  const reference = routes.find((route) => route.id === 'residence')
  const special = routes.find((route) => route.id === 'idf-special-unit-fighter')

  if (!reference || !special) throw new Error('Screening source data is incomplete')

  return {
    criteria: (routesData.criteria as Criterion[]).map((criterion) => ({
      id: criterion.id,
      he: criterion.he,
      route_ids: [...criterion.route_ids],
    })),
    localities: localitiesData.localities.map((locality) => locality.name_he),
    defaultAges: {
      service: reference.min_age_service,
      civilService: reference.min_age_civil_service,
      noService: reference.min_age_no_service,
      permanentResidentNoService: reference.min_age_permanent_resident_no_service,
    },
    specialUnitMinAge: special.min_age_service,
  }
}
