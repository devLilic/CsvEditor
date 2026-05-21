import type { BroadcastTemplate } from '@/shared/preview/templateContract'

export const locationTemplate: BroadcastTemplate = {
    id: 'location',
    name: 'Location Bug',
    canvas: {
        width: 1920,
        height: 1080,
        background: {
            type: 'color',
            value: '#101214',
        },
    },
    layers: [
        {
            id: 'location-marker',
            type: 'shape',
            shapeType: 'rect',
            x: 510,
            y: 812,
            width: 18,
            height: 18,
            zIndex: 1,
            fill: {
                type: 'solid',
                value: '#d71920',
            },
        },
        {
            id: 'location-text',
            type: 'text',
            x: 542,
            y: 796,
            width: 420,
            height: 48,
            zIndex: 2,
            fieldId: 'location',
            fallbackText: 'LOCATIE',
            fitInBox: true,
            fitMode: 'scaleX',
            minScaleX: 0.7,
            textStyle: {
                fontFamily: 'Inter',
                fontSize: 34,
                fontWeight: 800,
                color: '#f5f5f2',
                align: 'left',
                transform: 'uppercase',
            },
        },
    ],
}
