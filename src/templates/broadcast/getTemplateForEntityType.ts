import { broadcastTemplates } from './templates'

export function getTemplateForEntityType(entityType: string) {
    if (entityType === 'titles') return broadcastTemplates.titles
    if (entityType === 'persons') return broadcastTemplates.persons
    if (entityType === 'locations') return broadcastTemplates.locations

    return broadcastTemplates.titles
}
