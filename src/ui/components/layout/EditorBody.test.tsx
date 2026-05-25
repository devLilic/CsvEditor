import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { settingsService } from '@/features/csv-editor/services/settingsService'
import { EditorBody } from './EditorBody'

vi.mock('../EntityTypeTabsLeft', () => ({
    EntityTypeTabsLeft: () => <div>Entity type tabs</div>,
}))

vi.mock('../EntityList', () => ({
    EntityList: () => <div>Entity list panel</div>,
}))

vi.mock('../EntityEditor', () => ({
    EntityEditor: () => <div>Entity editor panel</div>,
}))

describe('EditorBody', () => {
    beforeEach(() => {
        vi.spyOn(settingsService, 'getConfig').mockResolvedValue({})
        vi.spyOn(settingsService, 'setConfig').mockResolvedValue({})
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    it('renders a vertical resize separator', () => {
        render(<EditorBody />)

        const separator = screen.getByRole('separator')

        expect(separator).toHaveAttribute('aria-orientation', 'vertical')
        expect(separator).toHaveClass('cursor-col-resize')
    })

    it('renders the left and right panels', () => {
        render(<EditorBody />)

        expect(screen.getByText('Entity type tabs')).toBeInTheDocument()
        expect(screen.getByText('Entity list panel')).toBeInTheDocument()
        expect(screen.getByText('Entity editor panel')).toBeInTheDocument()
    })

    it('uses saved layout.leftPanelWidth when it exists', async () => {
        vi.mocked(settingsService.getConfig).mockResolvedValue({
            layout: {
                leftPanelWidth: 820,
            },
        })

        const { container } = render(<EditorBody />)
        const layout = container.firstElementChild as HTMLElement

        await waitFor(() => {
            expect(layout.style.gridTemplateColumns).toContain('820px')
        })
    })

    it('uses the default width when saved layout.leftPanelWidth is invalid', async () => {
        vi.mocked(settingsService.getConfig).mockResolvedValue({
            layout: {
                leftPanelWidth: 'wide',
            },
        })

        const { container } = render(<EditorBody />)
        const layout = container.firstElementChild as HTMLElement

        await waitFor(() => {
            expect(settingsService.getConfig).toHaveBeenCalled()
        })

        expect(layout.style.gridTemplateColumns).toContain('700px')
    })

    it('saves the new width at the end of resize', async () => {
        const setConfigSpy = vi.mocked(settingsService.setConfig)
        render(<EditorBody />)

        act(() => {
            screen.getByRole('separator').dispatchEvent(
                new PointerEvent('pointerdown', {
                    bubbles: true,
                    clientX: 100,
                }),
            )
        })

        act(() => {
            window.dispatchEvent(
                new PointerEvent('pointermove', {
                    bubbles: true,
                    clientX: 220,
                }),
            )
        })

        act(() => {
            window.dispatchEvent(
                new PointerEvent('pointerup', {
                    bubbles: true,
                    clientX: 220,
                }),
            )
        })

        await waitFor(() => {
            expect(setConfigSpy).toHaveBeenCalledWith({
                layout: {
                    leftPanelWidth: 820,
                },
            })
        })
    })
})
