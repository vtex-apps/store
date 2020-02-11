export enum textPositionValues {
  CENTER = 'CENTER',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum textAlignmentValues {
  CENTER = 'CENTER',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export const textPositionTypes: Record<
  string,
  { name: string; value: textPositionValues }
> = {
  TEXT_POSITION_CENTER: {
    name: 'admin/editor.rich-text.textPosition.center',
    value: textPositionValues.CENTER,
  },
  TEXT_POSITION_LEFT: {
    name: 'admin/editor.rich-text.textPosition.left',
    value: textPositionValues.LEFT,
  },
  TEXT_POSITION_RIGHT: {
    name: 'admin/editor.rich-text.textPosition.right',
    value: textPositionValues.RIGHT,
  },
}

export const textAlignmentTypes: Record<
  string,
  { name: string; value: textAlignmentValues }
> = {
  TEXT_ALIGNMENT_CENTER: {
    name: 'admin/editor.rich-text.textAlignment.center',
    value: textAlignmentValues.CENTER,
  },
  TEXT_ALIGNMENT_LEFT: {
    name: 'admin/editor.rich-text.textAlignment.left',
    value: textAlignmentValues.LEFT,
  },
  TEXT_ALIGNMENT_RIGHT: {
    name: 'admin/editor.rich-text.textAlignment.right',
    value: textAlignmentValues.RIGHT,
  },
}
