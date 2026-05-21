import { describe, expect, it } from 'vitest'
import { broadcastTemplates } from './templates'

const allowedLayerTypes = ['text', 'image', 'shape']

describe('broadcastTemplates', () => {
    const templates = Object.values(broadcastTemplates)

    it('has at least one template', () => {
        expect(templates.length).toBeGreaterThan(0)
    })

    it('each template has a valid minimal contract', () => {
        for (const template of templates) {
            expect(template.id).toBeTruthy()
            expect(template.canvas.width).toBeGreaterThan(0)
            expect(template.canvas.height).toBeGreaterThan(0)
            expect(template.canvas.width / template.canvas.height).toBeCloseTo(16 / 9)

            for (const layer of template.layers) {
                expect(layer.id).toBeTruthy()
                expect(typeof layer.zIndex).toBe('number')
                expect(layer.width).toBeGreaterThanOrEqual(0)
                expect(layer.height).toBeGreaterThanOrEqual(0)
                expect(allowedLayerTypes).toContain(layer.type)
            }
        }
    })
})
