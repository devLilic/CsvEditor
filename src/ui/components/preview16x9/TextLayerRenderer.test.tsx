import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BroadcastTextLayer } from '@/shared/preview/templateContract'
import { TextLayerRenderer } from './TextLayerRenderer'

const baseLayer: BroadcastTextLayer = {
    id: 'text-1',
    type: 'text',
    fieldId: 'title',
    fallbackText: 'Fallback title',
    x: 150,
    y: 320,
    width: 900,
    height: 90,
    zIndex: 1,
    opacity: 0.9,
    rotation: 4,
    textStyle: {
        fontFamily: 'Inter',
        fontSize: 56,
        fontWeight: 700,
        color: '#ffffff',
        align: 'center',
    },
}

beforeEach(() => {
    class ResizeObserverMock {
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    Object.defineProperty(window, 'ResizeObserver', {
        writable: true,
        configurable: true,
        value: ResizeObserverMock,
    })
})

describe('TextLayerRenderer', () => {
    it('renders resolved text in the design box', () => {
        const { container } = render(
            <TextLayerRenderer layer={baseLayer} data={{ title: 'Live title' }} />
        )
        const textLayer = container.querySelector('[data-layer-id="text-1"]')

        expect(screen.getByText('Live title')).toBeInTheDocument()
        expect(textLayer).toHaveStyle({
            position: 'absolute',
            left: '150px',
            top: '320px',
            width: '900px',
            height: '90px',
            overflow: 'hidden',
        })
    })

    it('applies text style and transform', () => {
        const upperLayer: BroadcastTextLayer = {
            ...baseLayer,
            textStyle: {
                ...baseLayer.textStyle,
                transform: 'uppercase',
            },
        }

        const { container } = render(
            <TextLayerRenderer layer={upperLayer} data={{ title: 'Live title' }} />
        )
        const textLayer = container.querySelector('[data-layer-id="text-1"]')

        expect(screen.getByText('LIVE TITLE')).toBeInTheDocument()
        expect(textLayer).toHaveStyle({
            opacity: '0.9',
            transform: 'rotate(4deg)',
            color: '#ffffff',
            fontFamily: 'Inter',
            fontSize: '56px',
            fontWeight: '700',
            textAlign: 'center',
        })
    })

    it('uses fallback text when data is missing', () => {
        render(<TextLayerRenderer layer={baseLayer} data={{}} />)

        expect(screen.getByText('Fallback title')).toBeInTheDocument()
    })

    it('keeps short text at scaleX=1', async () => {
        vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300)

        render(<TextLayerRenderer layer={baseLayer} data={{ title: 'Short' }} />)

        await waitFor(() => {
            expect(screen.getByText('Short')).toHaveStyle({ transform: 'scaleX(1)' })
        })
    })

    it('shrinks long text on X when it does not fit', async () => {
        vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1800)

        render(<TextLayerRenderer layer={baseLayer} data={{ title: 'Long title' }} />)

        await waitFor(() => {
            expect(screen.getByText('Long title')).toHaveStyle({ transform: 'scaleX(0.65)' })
        })
    })

    it('respects minScaleX', async () => {
        vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(3000)

        render(
            <TextLayerRenderer
                layer={{ ...baseLayer, minScaleX: 0.8 }}
                data={{ title: 'Very long title' }}
            />
        )

        await waitFor(() => {
            expect(screen.getByText('Very long title')).toHaveStyle({ transform: 'scaleX(0.8)' })
        })
    })

    it('uses transform-origin based on align', async () => {
        vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1800)

        render(
            <TextLayerRenderer
                layer={{
                    ...baseLayer,
                    textStyle: { ...baseLayer.textStyle, align: 'right' },
                }}
                data={{ title: 'Right aligned' }}
            />
        )

        await waitFor(() => {
            expect(screen.getByText('Right aligned')).toHaveStyle({
                transformOrigin: 'right center',
            })
        })
    })
})
