import { titleTemplate } from './titleTemplate'
import { personTemplate } from './personTemplate'
import { locationTemplate } from './locationTemplate'

export const broadcastTemplates = {
    titles: titleTemplate,
    persons: personTemplate,
    locations: locationTemplate,
} as const
