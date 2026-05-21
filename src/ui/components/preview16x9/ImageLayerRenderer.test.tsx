import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { BroadcastImageLayer } from '@/shared/preview/templateContract'
import { ImageLayerRenderer } from './ImageLayerRenderer'

const baseLayer: BroadcastImageLayer = {
    id: 'image-1',
    type: 'image',
    src: '/logo.png',
    x: 100,
    y: 200,
    width: 320,
    height: 180,
    zIndex: 1,
}

describe('ImageLayerRenderer', () => {
    it('renders an image inside the design box with default contain objectFit', () => {
        const { container } = render(<ImageLayerRenderer layer={baseLayer} />)
        const image = container.querySelector('img')

        expect(image).toHaveAttribute('src', '/logo.png')
        expect(image).toHaveStyle({
            position: 'absolute',
            left: '100px',
            top: '200px',
            width: '320px',
            height: '180px',
            objectFit: 'contain',
            display: 'block',
        })
    })

    it('supports cover objectFit', () => {
        const { container } = render(
            <ImageLayerRenderer layer={{ ...baseLayer, objectFit: 'cover' }} />
        )

        expect(container.querySelector('img')).toHaveStyle({ objectFit: 'cover' })
    })

    it('supports fill objectFit', () => {
        const { container } = render(
            <ImageLayerRenderer layer={{ ...baseLayer, objectFit: 'fill' }} />
        )

        expect(container.querySelector('img')).toHaveStyle({ objectFit: 'fill' })
    })

    it('does not crash and renders a discrete placeholder when src is empty', () => {
        const { container } = render(
            <ImageLayerRenderer layer={{ ...baseLayer, src: '' }} />
        )

        const placeholder = container.querySelector('[data-empty-image-layer="true"]')

        expect(container.querySelector('img')).toBeNull()
        expect(placeholder).toHaveStyle({
            position: 'absolute',
            left: '100px',
            top: '200px',
            width: '320px',
            height: '180px',
        })
    })
})
