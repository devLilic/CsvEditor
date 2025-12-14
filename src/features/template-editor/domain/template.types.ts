// src/features/template-editor/domain/template.types.ts

export interface Template {
    id: string
    name: string

    canvas: {
        width: number
        height: number
        background: Background
    }

    layers: Layer[]
}

export type Background =
    | { type: 'image'; value: string } // value = url/path/data-uri
    | { type: 'color'; value: string } // value = hex/rgb/rgba

export type Layer = RectangleLayer | TextLayer

export interface BaseLayer {
    id: string
    x: number
    y: number
    width: number
    height: number
    rotation?: number
    opacity?: number
    zIndex: number
    visible: boolean
}

export type Gradient = {
    type: 'linear'
    angle: number
    stops: Array<{ color: string; offset: number }> // offset: 0..1
}

export interface RectangleLayer extends BaseLayer {
    type: 'rectangle'
    fill:
        | { type: 'solid'; value: string } // hex/rgb/rgba
        | { type: 'gradient'; value: Gradient }
}

export interface TextLayer extends BaseLayer {
    type: 'text'
    binding: string // ex: "titles.title"
    textStyle: {
        fontFamily: string
        fontSize: number
        fontWeight: number
        color: string
        align: 'left' | 'center' | 'right'
        transform?: 'uppercase'
    }
}
